/**
 * Add Placeholder Images to All Recipes
 * Updates YAML frontmatter to include placeholder image
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
const PLACEHOLDER_IMAGE = '/images/recipes/placeholder.svg';

/**
 * Add image field to recipe YAML frontmatter
 */
function addImageToRecipe(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if image field already exists
  if (content.match(/^image:/m)) {
    return { updated: false, reason: 'Image field already exists' };
  }
  
  // Find the end of YAML frontmatter (second ---)
  const lines = content.split('\n');
  let yamlEndIndex = -1;
  let dashCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      dashCount++;
      if (dashCount === 2) {
        yamlEndIndex = i;
        break;
      }
    }
  }
  
  if (yamlEndIndex === -1) {
    return { updated: false, reason: 'Could not find YAML frontmatter end' };
  }
  
  // Extract recipe title for alt text
  const titleMatch = content.match(/^title:\s*"(.+)"/m);
  const title = titleMatch ? titleMatch[1] : 'Recipe';
  
  // Insert image and imageAlt fields before the closing ---
  const imageFields = [
    `image: "${PLACEHOLDER_IMAGE}"`,
    `imageAlt: "${title} recipe"`
  ];
  
  lines.splice(yamlEndIndex, 0, ...imageFields);
  
  const updatedContent = lines.join('\n');
  fs.writeFileSync(filePath, updatedContent, 'utf-8');
  
  return { updated: true, title };
}

/**
 * Process all recipe files
 */
function processAllRecipes() {
  console.log('🖼️  Adding Placeholder Images to All Recipes\n');
  console.log('=' .repeat(60));
  
  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.md') && !f.includes('REVIEW') && !f.includes('CONVERSION'));
  
  let updatedCount = 0;
  let skippedCount = 0;
  const results = [];
  
  files.forEach(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const result = addImageToRecipe(filePath);
    
    if (result.updated) {
      updatedCount++;
      results.push(`✅ ${file} - Added placeholder image`);
    } else {
      skippedCount++;
      results.push(`⏭️  ${file} - ${result.reason}`);
    }
  });
  
  // Print results
  console.log('\n📊 Results:\n');
  console.log(`Total recipes: ${files.length}`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Placeholder images added successfully!\n');
  console.log(`All recipes now have:`);
  console.log(`  - image: "${PLACEHOLDER_IMAGE}"`);
  console.log(`  - imageAlt: "[Recipe Title] recipe"`);
  console.log('\n' + '='.repeat(60));
}

// Run the script
processAllRecipes();

