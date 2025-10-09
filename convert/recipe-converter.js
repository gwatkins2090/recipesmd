#!/usr/bin/env node

/**
 * Recipe Standardization Conversion Script
 * Converts 115 family recipes to standardized YAML frontmatter + Markdown format
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: __dirname,
  outputDir: path.join(__dirname, 'output'),
  backupDir: path.join(__dirname, 'backup'),
  testMode: false,
  testBatchSize: 10,
};

// Statistics tracking
const stats = {
  total: 0,
  processed: 0,
  failed: 0,
  flaggedForReview: 0,
  issues: [],
};

// Review report
const reviewReport = {
  incompleteQuantities: [],
  missingMetadata: [],
  vagueInstructions: [],
  uncertainCategories: [],
  multiComponentRecipes: [],
};

/**
 * Main conversion function
 */
async function convertRecipes(testMode = false) {
  console.log('🚀 Recipe Standardization Conversion Script');
  console.log('==========================================\n');

  // Setup directories
  setupDirectories();

  // Get all recipe files
  const files = getRecipeFiles();
  stats.total = files.length;

  console.log(`📁 Found ${files.length} recipe files`);
  
  if (testMode) {
    console.log(`🧪 TEST MODE: Processing first ${CONFIG.testBatchSize} recipes\n`);
    files.splice(CONFIG.testBatchSize);
  } else {
    console.log(`📝 Processing all ${files.length} recipes\n`);
  }

  // Process each recipe
  for (const file of files) {
    try {
      await processRecipe(file);
      stats.processed++;
      process.stdout.write(`\r✅ Processed: ${stats.processed}/${files.length}`);
    } catch (error) {
      stats.failed++;
      stats.issues.push({ file, error: error.message });
      console.error(`\n❌ Failed to process ${file}: ${error.message}`);
    }
  }

  console.log('\n\n📊 Conversion Complete!');
  printStatistics(stats);
  generateReviewReport(reviewReport, CONFIG);
  generateCategoryReport(CONFIG);
}

/**
 * Setup output and backup directories
 */
function setupDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }
}

/**
 * Get all .md files from input directory
 */
function getRecipeFiles() {
  return fs.readdirSync(CONFIG.inputDir)
    .filter(file => file.endsWith('.md') && file !== 'README.md')
    .sort();
}

/**
 * Process a single recipe file
 */
async function processRecipe(filename) {
  const inputPath = path.join(CONFIG.inputDir, filename);
  const content = fs.readFileSync(inputPath, 'utf-8');

  // Backup original
  const backupPath = path.join(CONFIG.backupDir, filename);
  fs.writeFileSync(backupPath, content);

  // Parse the recipe
  const parsed = parseRecipe(content, filename);

  // Generate metadata
  const metadata = generateMetadata(parsed, filename);

  // Generate standardized content
  const standardized = generateStandardizedRecipe(metadata, parsed);

  // Write to output
  const outputPath = path.join(CONFIG.outputDir, filename);
  fs.writeFileSync(outputPath, standardized);

  // Check for review flags
  checkForReviewIssues(parsed, metadata, filename, reviewReport, stats);
}

/**
 * Parse existing recipe format
 */
function parseRecipe(content, filename) {
  const lines = content.split('\n');
  const parsed = {
    title: '',
    author: '',
    source: '',
    ingredients: [],
    instructions: [],
    notes: [],
    rawContent: content,
    metadata: {},
  };

  let currentSection = '';
  let instructionCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Extract title from heading
    if (line.startsWith('##') && !line.toLowerCase().includes('ingredient') &&
        !line.toLowerCase().includes('instruction') && !line.toLowerCase().includes('direction')) {
      parsed.title = cleanTitle(line);
      
      // Check for author on next line
      if (i + 1 < lines.length && lines[i + 1].trim().startsWith('*by ')) {
        parsed.author = lines[i + 1].trim().replace(/^\*by\s+/, '').replace(/\*$/, '');
        i++; // Skip author line
      }
    }
    // Extract metadata from text (e.g., "Cook time: 45 Min | Prep time: 5 Min | Serves: 8")
    else if (line.match(/cook time:|prep time:|serves:/i)) {
      parsed.metadata.timesText = line;
    }
    // Section headers
    else if (line.match(/^\*\*ingredients:\*\*|^###?\s*ingredients:/i)) {
      currentSection = 'ingredients';
    }
    else if (line.match(/^\*\*instructions:\*\*|^\*\*directions:\*\*|^###?\s*(instructions|directions):/i)) {
      currentSection = 'instructions';
      instructionCounter = 1;
    }
    else if (line.match(/^\*\*note[s]?:\*\*|^note\s+by|^note:/i)) {
      currentSection = 'notes';
    }
    // Parse ingredients
    else if (currentSection === 'ingredients' && line.startsWith('-')) {
      const ingredient = line.replace(/^-\s*/, '').trim();
      if (ingredient) {
        parsed.ingredients.push(standardizeIngredient(ingredient));
      }
    }
    // Parse numbered instructions
    else if (currentSection === 'instructions' && line.match(/^\d+\./)) {
      const instruction = line.replace(/^\d+\.\s*/, '').trim();
      if (instruction) {
        parsed.instructions.push(instruction);
      }
    }
    // Parse paragraph instructions
    else if (currentSection === 'instructions' && line && !line.startsWith('#') && !line.startsWith('*')) {
      if (line.length > 20) { // Likely an instruction
        parsed.instructions.push(line);
      }
    }
    // Parse notes
    else if (currentSection === 'notes' && line) {
      parsed.notes.push(line);
    }
  }

  // If no title found, use filename
  if (!parsed.title) {
    parsed.title = filename.replace(/\.md$/, '').replace(/_/g, ' ')
      .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return parsed;
}

/**
 * Clean title - remove recipe numbers and formatting
 */
function cleanTitle(titleLine) {
  return titleLine
    .replace(/^##\s*/, '')
    .replace(/^Recipe #\d+:\s*/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
}

/**
 * Standardize ingredient formatting
 */
function standardizeIngredient(ingredient) {
  let cleaned = ingredient;

  // Standardize units - only when followed by space or end of word
  // Use specific patterns to avoid replacing parts of words
  cleaned = cleaned.replace(/\b(\d+\/?\d*)\s*c\b(?!\w)/gi, '$1 cup');
  cleaned = cleaned.replace(/\b(\d+\/?\d*)\s*c\./gi, '$1 cup');
  cleaned = cleaned.replace(/\bcups\b/gi, 'cup');
  cleaned = cleaned.replace(/\btsp\./gi, 'tsp');
  cleaned = cleaned.replace(/\bteasp\b/gi, 'tsp');
  cleaned = cleaned.replace(/\bteaspoons?\b/gi, 'tsp');
  cleaned = cleaned.replace(/\bTblsp\b/gi, 'Tbsp');
  cleaned = cleaned.replace(/\btablespoons?\b/gi, 'Tbsp');
  cleaned = cleaned.replace(/\bTBS\b/gi, 'Tbsp');
  cleaned = cleaned.replace(/\btablesp\b/gi, 'Tbsp');
  cleaned = cleaned.replace(/\boz\./gi, 'oz');
  cleaned = cleaned.replace(/\blb\./gi, 'lb');
  cleaned = cleaned.replace(/\blbs\./gi, 'lb');

  // Standardize fractions
  cleaned = cleaned.replace(/1\/2/g, '½');
  cleaned = cleaned.replace(/1\/4/g, '¼');
  cleaned = cleaned.replace(/3\/4/g, '¾');
  cleaned = cleaned.replace(/1\/3/g, '⅓');
  cleaned = cleaned.replace(/2\/3/g, '⅔');

  return cleaned;
}

// Load additional modules
const { generateMetadata } = require('./metadata-generator.js');
const { generateStandardizedRecipe } = require('./recipe-formatter.js');
const { checkForReviewIssues } = require('./review-checker.js');
const { printStatistics, generateReviewReport, generateCategoryReport } = require('./report-generator.js');

// Export for testing
module.exports = {
  convertRecipes,
  parseRecipe,
  cleanTitle,
  standardizeIngredient,
  stats,
  reviewReport,
  CONFIG,
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);
  const testMode = args.includes('--test');
  
  convertRecipes(testMode)
    .then(() => {
      console.log('\n✅ All done!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
}

