/**
 * Report Generator
 * Generates statistics and review reports
 */

const fs = require('fs');
const path = require('path');

/**
 * Print conversion statistics
 */
function printStatistics(stats) {
  console.log('\n📊 Conversion Statistics');
  console.log('========================');
  console.log(`Total recipes:           ${stats.total}`);
  console.log(`Successfully processed:  ${stats.processed}`);
  console.log(`Failed:                  ${stats.failed}`);
  console.log(`Flagged for review:      ${stats.flaggedForReview}`);
  console.log(`Success rate:            ${((stats.processed / stats.total) * 100).toFixed(1)}%`);
  console.log(`Review rate:             ${((stats.flaggedForReview / stats.total) * 100).toFixed(1)}%`);

  if (stats.issues.length > 0) {
    console.log('\n❌ Failed Recipes:');
    stats.issues.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.error}`);
    });
  }
}

/**
 * Generate detailed review report
 */
function generateReviewReport(reviewReport, CONFIG) {
  
  const reportLines = [];
  
  reportLines.push('# Recipe Conversion Review Report');
  reportLines.push('');
  reportLines.push(`Generated: ${new Date().toISOString()}`);
  reportLines.push('');
  reportLines.push('---');
  reportLines.push('');
  
  // Summary
  reportLines.push('## Summary');
  reportLines.push('');
  const totalIssues = 
    reviewReport.incompleteQuantities.length +
    reviewReport.vagueInstructions.length +
    reviewReport.missingMetadata.length +
    reviewReport.uncertainCategories.length +
    reviewReport.multiComponentRecipes.length;
  
  reportLines.push(`**Total recipes flagged for review:** ${totalIssues}`);
  reportLines.push('');
  reportLines.push('| Issue Type | Count |');
  reportLines.push('|------------|-------|');
  reportLines.push(`| Incomplete Quantities | ${reviewReport.incompleteQuantities.length} |`);
  reportLines.push(`| Vague Instructions | ${reviewReport.vagueInstructions.length} |`);
  reportLines.push(`| Missing Metadata | ${reviewReport.missingMetadata.length} |`);
  reportLines.push(`| Uncertain Categories | ${reviewReport.uncertainCategories.length} |`);
  reportLines.push(`| Multi-Component Recipes | ${reviewReport.multiComponentRecipes.length} |`);
  reportLines.push('');
  reportLines.push('---');
  reportLines.push('');
  
  // Incomplete Quantities
  if (reviewReport.incompleteQuantities.length > 0) {
    reportLines.push('## 🔴 Incomplete Ingredient Quantities');
    reportLines.push('');
    reportLines.push('These recipes have ingredients with missing or vague quantities that need to be specified:');
    reportLines.push('');
    
    reviewReport.incompleteQuantities.forEach(item => {
      reportLines.push(`### ${item.title}`);
      reportLines.push(`**File:** \`${item.file}\``);
      reportLines.push('');
      reportLines.push('**Issues:**');
      item.issues.forEach(issue => {
        reportLines.push(`- ${issue}`);
      });
      reportLines.push('');
    });
    
    reportLines.push('---');
    reportLines.push('');
  }
  
  // Vague Instructions
  if (reviewReport.vagueInstructions.length > 0) {
    reportLines.push('## 🟡 Vague or Minimal Instructions');
    reportLines.push('');
    reportLines.push('These recipes have instructions that are too brief or need expansion:');
    reportLines.push('');
    
    reviewReport.vagueInstructions.forEach(item => {
      reportLines.push(`### ${item.title}`);
      reportLines.push(`**File:** \`${item.file}\``);
      reportLines.push(`**Step Count:** ${item.stepCount}`);
      reportLines.push(`**Reason:** ${item.reason}`);
      reportLines.push('');
    });
    
    reportLines.push('---');
    reportLines.push('');
  }
  
  // Missing Metadata
  if (reviewReport.missingMetadata.length > 0) {
    reportLines.push('## 🟠 Missing or Estimated Metadata');
    reportLines.push('');
    reportLines.push('These recipes have metadata that was estimated and should be verified:');
    reportLines.push('');
    
    reviewReport.missingMetadata.forEach(item => {
      reportLines.push(`### ${item.title}`);
      reportLines.push(`**File:** \`${item.file}\``);
      reportLines.push('');
      reportLines.push('**Missing/Estimated:**');
      item.missing.forEach(m => {
        reportLines.push(`- ${m}`);
      });
      reportLines.push('');
    });
    
    reportLines.push('---');
    reportLines.push('');
  }
  
  // Uncertain Categories
  if (reviewReport.uncertainCategories.length > 0) {
    reportLines.push('## 🟢 Uncertain Categories');
    reportLines.push('');
    reportLines.push('These recipes have categories that were inferred and should be verified:');
    reportLines.push('');
    
    reviewReport.uncertainCategories.forEach(item => {
      reportLines.push(`### ${item.title}`);
      reportLines.push(`**File:** \`${item.file}\``);
      reportLines.push(`**Inferred Category:** ${item.inferredCategory}`);
      reportLines.push(`**Reason:** ${item.reason}`);
      reportLines.push('');
    });
    
    reportLines.push('---');
    reportLines.push('');
  }
  
  // Multi-Component Recipes
  if (reviewReport.multiComponentRecipes.length > 0) {
    reportLines.push('## 🔵 Multi-Component Recipes');
    reportLines.push('');
    reportLines.push('These recipes have multiple components (e.g., cake + icing) - verify organization:');
    reportLines.push('');
    
    reviewReport.multiComponentRecipes.forEach(item => {
      reportLines.push(`### ${item.title}`);
      reportLines.push(`**File:** \`${item.file}\``);
      reportLines.push(`**Note:** ${item.reason}`);
      reportLines.push('');
    });
    
    reportLines.push('---');
    reportLines.push('');
  }
  
  // Recommendations
  reportLines.push('## 📝 Recommendations');
  reportLines.push('');
  reportLines.push('### Priority 1 (High) - Fix Before Deployment');
  reportLines.push('- ✅ Fix incomplete ingredient quantities');
  reportLines.push('- ✅ Expand vague instructions');
  reportLines.push('');
  reportLines.push('### Priority 2 (Medium) - Verify and Enhance');
  reportLines.push('- ⚠️ Verify estimated prep/cook times');
  reportLines.push('- ⚠️ Verify estimated yields');
  reportLines.push('- ⚠️ Verify inferred categories');
  reportLines.push('');
  reportLines.push('### Priority 3 (Low) - Optional Enhancements');
  reportLines.push('- 💡 Add recipe descriptions (currently auto-generated)');
  reportLines.push('- 💡 Add equipment lists');
  reportLines.push('- 💡 Add storage instructions');
  reportLines.push('- 💡 Add recipe photos');
  reportLines.push('');
  
  // Write report to file
  const reportPath = path.join(CONFIG.outputDir, 'REVIEW_REPORT.md');
  fs.writeFileSync(reportPath, reportLines.join('\n'));
  
  console.log(`\n📄 Review report generated: ${reportPath}`);
  
  // Also print summary to console
  console.log('\n📋 Review Summary:');
  console.log(`   Incomplete quantities: ${reviewReport.incompleteQuantities.length} recipes`);
  console.log(`   Vague instructions: ${reviewReport.vagueInstructions.length} recipes`);
  console.log(`   Missing metadata: ${reviewReport.missingMetadata.length} recipes`);
  console.log(`   Uncertain categories: ${reviewReport.uncertainCategories.length} recipes`);
  console.log(`   Multi-component: ${reviewReport.multiComponentRecipes.length} recipes`);
}

/**
 * Generate category distribution report
 */
function generateCategoryReport(CONFIG) {
  const outputDir = CONFIG.outputDir;
  
  if (!fs.existsSync(outputDir)) {
    return;
  }
  
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.md') && f !== 'REVIEW_REPORT.md');
  const categories = {};
  const difficulties = {};
  const generations = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(outputDir, file), 'utf-8');
    
    // Extract category
    const categoryMatch = content.match(/^category:\s*"([^"]+)"/m);
    if (categoryMatch) {
      const category = categoryMatch[1];
      categories[category] = (categories[category] || 0) + 1;
    }
    
    // Extract difficulty
    const difficultyMatch = content.match(/^difficulty:\s*"([^"]+)"/m);
    if (difficultyMatch) {
      const difficulty = difficultyMatch[1];
      difficulties[difficulty] = (difficulties[difficulty] || 0) + 1;
    }
    
    // Extract generation
    const generationMatch = content.match(/^generation:\s*"([^"]+)"/m);
    if (generationMatch) {
      const generation = generationMatch[1];
      generations[generation] = (generations[generation] || 0) + 1;
    }
  });
  
  console.log('\n📊 Category Distribution:');
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count}`);
  });
  
  console.log('\n📊 Difficulty Distribution:');
  Object.entries(difficulties).sort((a, b) => b[1] - a[1]).forEach(([diff, count]) => {
    console.log(`   ${diff}: ${count}`);
  });
  
  console.log('\n📊 Generation Distribution:');
  Object.entries(generations).sort((a, b) => b[1] - a[1]).forEach(([gen, count]) => {
    console.log(`   ${gen}: ${count}`);
  });
}

module.exports = {
  printStatistics,
  generateReviewReport,
  generateCategoryReport,
};

