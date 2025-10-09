/**
 * Verify Family Recipes Migration
 * 
 * This script verifies that:
 * 1. All 104 family recipes can be parsed correctly
 * 2. Each recipe has a valid slug
 * 3. No YAML parsing errors
 * 4. All recipes have required fields
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

console.log('\n🔍 VERIFYING FAMILY RECIPES MIGRATION\n');
console.log('=' .repeat(70));

const familyDir = path.join(__dirname, 'recipes', 'family');
const files = fs.readdirSync(familyDir).filter(f => f.endsWith('.md'));

console.log(`\n📊 Found ${files.length} recipe files in recipes/family/\n`);

let successCount = 0;
let errorCount = 0;
const errors = [];
const recipes = [];

files.forEach((file, index) => {
  const filePath = path.join(familyDir, file);
  
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Verify required fields
    const requiredFields = ['title', 'slug', 'category', 'difficulty'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      errors.push({
        file,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
      errorCount++;
      console.log(`❌ ${index + 1}. ${file} - Missing fields: ${missingFields.join(', ')}`);
    } else {
      successCount++;
      recipes.push({
        file,
        title: data.title,
        slug: data.slug,
        category: data.category,
        difficulty: data.difficulty,
        generation: data.generation || 'unknown'
      });
      
      // Show progress every 10 recipes
      if ((index + 1) % 10 === 0) {
        console.log(`✅ Processed ${index + 1}/${files.length} recipes...`);
      }
    }
  } catch (error) {
    errorCount++;
    errors.push({
      file,
      error: error.message
    });
    console.log(`❌ ${index + 1}. ${file} - Parse error: ${error.message.substring(0, 80)}...`);
  }
});

// Summary
console.log('\n' + '='.repeat(70));
console.log('📊 MIGRATION VERIFICATION SUMMARY');
console.log('='.repeat(70));

console.log(`\n✅ Successfully parsed: ${successCount} recipes`);
console.log(`❌ Errors: ${errorCount} recipes`);
console.log(`📈 Success rate: ${((successCount / files.length) * 100).toFixed(1)}%`);

// Category breakdown
if (successCount > 0) {
  console.log('\n📂 Category Distribution:');
  const categories = {};
  recipes.forEach(r => {
    categories[r.category] = (categories[r.category] || 0) + 1;
  });
  
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} recipes`);
    });
  
  // Generation breakdown
  console.log('\n👵 Generation Distribution:');
  const generations = {};
  recipes.forEach(r => {
    generations[r.generation] = (generations[r.generation] || 0) + 1;
  });
  
  Object.entries(generations)
    .sort((a, b) => b[1] - a[1])
    .forEach(([gen, count]) => {
      console.log(`   ${gen}: ${count} recipes`);
    });
}

// Show errors if any
if (errors.length > 0) {
  console.log('\n❌ ERRORS FOUND:');
  console.log('-'.repeat(70));
  errors.forEach(({ file, error }) => {
    console.log(`\n📄 ${file}`);
    console.log(`   Error: ${error}`);
  });
}

// Slug format check
console.log('\n🔍 Slug Format Verification:');
console.log('-'.repeat(70));

const slugIssues = [];
recipes.forEach(r => {
  // Check if slug has underscores (should use hyphens)
  if (r.slug.includes('_')) {
    slugIssues.push({
      file: r.file,
      slug: r.slug,
      issue: 'Contains underscores (should use hyphens)'
    });
  }
  
  // Check if slug has spaces
  if (r.slug.includes(' ')) {
    slugIssues.push({
      file: r.file,
      slug: r.slug,
      issue: 'Contains spaces'
    });
  }
  
  // Check if slug has uppercase
  if (r.slug !== r.slug.toLowerCase()) {
    slugIssues.push({
      file: r.file,
      slug: r.slug,
      issue: 'Contains uppercase letters'
    });
  }
});

if (slugIssues.length === 0) {
  console.log('✅ All slugs are properly formatted (lowercase, hyphens)');
} else {
  console.log(`⚠️  Found ${slugIssues.length} slug formatting issues:`);
  slugIssues.forEach(({ file, slug, issue }) => {
    console.log(`   ${file}: "${slug}" - ${issue}`);
  });
}

// Final verdict
console.log('\n' + '='.repeat(70));

if (errorCount === 0 && slugIssues.length === 0) {
  console.log('🎉 SUCCESS! All family recipes are properly migrated!');
  console.log('\n✨ Next steps:');
  console.log('   1. Start the dev server: npm run dev');
  console.log('   2. Visit /recipes to see all recipes');
  console.log('   3. Test the Generation filter to find family recipes');
  console.log('   4. Test individual recipe pages with their slugs');
  console.log('\n📝 Example URLs:');
  console.log('   - /recipes/comeback-sauce-recipe/');
  console.log('   - /recipes/chocolate-chess-pie/');
  console.log('   - /recipes/angel-biscuits/');
  process.exit(0);
} else {
  console.log('⚠️  MIGRATION INCOMPLETE - Please fix the errors above');
  process.exit(1);
}

