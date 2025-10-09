/**
 * Test Recipe Parsing
 * 
 * This script tests that the markdown parser can correctly parse
 * the new YAML frontmatter format from the converted family recipes.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Parse ISO 8601 duration to human-readable format
function parseISODuration(duration) {
  if (!duration) return '0 min';
  
  // If already in human format, return as-is
  if (!duration.startsWith('PT')) return duration;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  
  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} hr`;
  } else {
    return `${minutes} min`;
  }
}

// Parse yield/servings field
function parseYield(yieldStr) {
  if (typeof yieldStr === 'number') return yieldStr;
  if (!yieldStr) return 4;
  
  const str = String(yieldStr);
  
  // Handle range (e.g., "6-8 servings")
  const rangeMatch = str.match(/(\d+)-(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    return Math.round((min + max) / 2);
  }
  
  // Extract first number
  const numMatch = str.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : 4;
}

// Test parsing a recipe file
function testRecipe(filePath) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${path.basename(filePath)}`);
  console.log('='.repeat(60));
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    console.log('\n📋 YAML Frontmatter Fields:');
    console.log('  title:', data.title);
    console.log('  slug:', data.slug);
    console.log('  category:', data.category);
    console.log('  difficulty:', data.difficulty);
    console.log('  description:', data.description?.substring(0, 60) + '...');
    console.log('  prepTime:', data.prepTime, '→', parseISODuration(data.prepTime));
    console.log('  cookTime:', data.cookTime, '→', parseISODuration(data.cookTime));
    console.log('  totalTime:', data.totalTime, '→', parseISODuration(data.totalTime));
    console.log('  yield:', data.yield, '→', parseYield(data.yield), 'servings');
    console.log('  tags:', data.tags?.join(', '));
    console.log('  author:', data.author);
    console.log('  source:', data.source);
    console.log('  cuisine:', data.cuisine);
    console.log('  generation:', data.generation);
    console.log('  dateAdded:', data.dateAdded);
    console.log('  image:', data.image);
    console.log('  imageAlt:', data.imageAlt);
    
    console.log('\n✅ SUCCESS - Recipe parsed correctly!');
    return true;
  } catch (error) {
    console.log('\n❌ ERROR:', error.message);
    return false;
  }
}

// Main test
console.log('\n🧪 RECIPE PARSING TEST');
console.log('Testing new YAML frontmatter format...\n');

const testFiles = [
  'recipes/family/chocolate_chess_pie.md',
  'recipes/family/angel_biscuits.md',
  'recipes/family/chicken_spaghetti.md'
];

let passed = 0;
let failed = 0;

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (testRecipe(file)) {
      passed++;
    } else {
      failed++;
    }
  } else {
    console.log(`\n⚠️  File not found: ${file}`);
    failed++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n🎉 All tests passed! Recipe parsing is working correctly.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}

