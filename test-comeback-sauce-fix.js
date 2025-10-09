/**
 * Test Comeback Sauce Recipe Fix
 * 
 * This script verifies that:
 * 1. The comeback sauce recipe file exists with the correct slug
 * 2. The markdown parser can read it correctly
 * 3. The slug matches the expected format (with hyphens)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

console.log('\n🧪 TESTING COMEBACK SAUCE RECIPE FIX\n');
console.log('=' .repeat(60));

// Test 1: Check file exists
console.log('\n📁 Test 1: File Existence');
console.log('-'.repeat(60));

const filePath = path.join(__dirname, 'recipes', 'family', 'comeback_sauce_recipe.md');
const fileExists = fs.existsSync(filePath);

if (fileExists) {
  console.log('✅ File exists: recipes/family/comeback_sauce_recipe.md');
} else {
  console.log('❌ File NOT found: recipes/family/comeback_sauce_recipe.md');
  process.exit(1);
}

// Test 2: Parse YAML frontmatter
console.log('\n📋 Test 2: YAML Frontmatter Parsing');
console.log('-'.repeat(60));

const fileContents = fs.readFileSync(filePath, 'utf8');
const { data, content } = matter(fileContents);

console.log('Title:', data.title);
console.log('Slug:', data.slug);
console.log('Category:', data.category);
console.log('Difficulty:', data.difficulty);
console.log('Image:', data.image);

// Test 3: Verify slug format
console.log('\n🔍 Test 3: Slug Format Verification');
console.log('-'.repeat(60));

const expectedSlug = 'comeback-sauce-recipe';
const actualSlug = data.slug;

if (actualSlug === expectedSlug) {
  console.log(`✅ Slug is correct: "${actualSlug}"`);
  console.log('   Expected URL: /recipes/comeback-sauce-recipe/');
} else {
  console.log(`❌ Slug mismatch!`);
  console.log(`   Expected: "${expectedSlug}"`);
  console.log(`   Actual: "${actualSlug}"`);
  process.exit(1);
}

// Test 4: Check for duplicate files
console.log('\n🔎 Test 4: Check for Duplicate Files');
console.log('-'.repeat(60));

const familyDir = path.join(__dirname, 'recipes', 'family');
const allFiles = fs.readdirSync(familyDir);
const comebackFiles = allFiles.filter(f => f.toLowerCase().includes('comeback'));

console.log(`Found ${comebackFiles.length} file(s) with "comeback" in the name:`);
comebackFiles.forEach(file => {
  console.log(`  - ${file}`);
});

if (comebackFiles.length === 1) {
  console.log('✅ No duplicate files found');
} else {
  console.log('⚠️  Multiple comeback sauce files found - may cause conflicts');
}

// Test 5: Verify all required fields
console.log('\n✅ Test 5: Required Fields Verification');
console.log('-'.repeat(60));

const requiredFields = ['title', 'slug', 'category', 'difficulty', 'description', 'prepTime', 'cookTime', 'totalTime', 'yield', 'tags', 'author', 'image'];
const missingFields = [];

requiredFields.forEach(field => {
  if (!data[field]) {
    missingFields.push(field);
    console.log(`❌ Missing field: ${field}`);
  } else {
    console.log(`✅ ${field}: ${Array.isArray(data[field]) ? `[${data[field].length} items]` : data[field]}`);
  }
});

// Test 6: Verify ingredients and instructions in content
console.log('\n📝 Test 6: Content Verification');
console.log('-'.repeat(60));

const hasIngredients = content.includes('## Ingredients');
const hasInstructions = content.includes('## Instructions');

if (hasIngredients) {
  console.log('✅ Ingredients section found');
} else {
  console.log('❌ Ingredients section NOT found');
}

if (hasInstructions) {
  console.log('✅ Instructions section found');
} else {
  console.log('❌ Instructions section NOT found');
}

// Final Summary
console.log('\n' + '='.repeat(60));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(60));

const allTestsPassed = 
  fileExists &&
  actualSlug === expectedSlug &&
  comebackFiles.length === 1 &&
  missingFields.length === 0 &&
  hasIngredients &&
  hasInstructions;

if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('\n✨ The comeback sauce recipe is correctly configured:');
  console.log('   - File: recipes/family/comeback_sauce_recipe.md');
  console.log('   - Slug: comeback-sauce-recipe');
  console.log('   - URL: /recipes/comeback-sauce-recipe/');
  console.log('\n🎉 The recipe should now be accessible at the correct URL!');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('\nPlease review the errors above and fix the issues.');
  process.exit(1);
}

