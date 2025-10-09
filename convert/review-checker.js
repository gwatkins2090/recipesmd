/**
 * Review Checker
 * Identifies recipes that need manual review
 */

/**
 * Check for issues that require manual review
 */
function checkForReviewIssues(parsed, metadata, filename, reviewReport, stats) {
  let needsReview = false;

  // Check for incomplete ingredient quantities
  if (hasIncompleteQuantities(parsed.ingredients)) {
    reviewReport.incompleteQuantities.push({
      file: filename,
      title: metadata.title,
      issues: findIncompleteQuantities(parsed.ingredients),
    });
    needsReview = true;
  }

  // Check for missing or minimal instructions
  if (hasVagueInstructions(parsed.instructions)) {
    reviewReport.vagueInstructions.push({
      file: filename,
      title: metadata.title,
      stepCount: parsed.instructions.length,
      reason: getVagueInstructionReason(parsed.instructions),
    });
    needsReview = true;
  }

  // Check for missing metadata
  if (hasMissingMetadata(parsed, metadata)) {
    reviewReport.missingMetadata.push({
      file: filename,
      title: metadata.title,
      missing: getMissingMetadata(parsed, metadata),
    });
    needsReview = true;
  }

  // Check for uncertain category inference
  if (isUncertainCategory(parsed, metadata)) {
    reviewReport.uncertainCategories.push({
      file: filename,
      title: metadata.title,
      inferredCategory: metadata.category,
      reason: 'Category inferred from limited information - please verify',
    });
    needsReview = true;
  }

  // Check for multi-component recipes
  if (isMultiComponentRecipe(parsed)) {
    reviewReport.multiComponentRecipes.push({
      file: filename,
      title: metadata.title,
      reason: 'Multi-component recipe - verify organization',
    });
    needsReview = true;
  }

  if (needsReview) {
    stats.flaggedForReview++;
  }

  return needsReview;
}

/**
 * Check if ingredients have incomplete quantities
 */
function hasIncompleteQuantities(ingredients) {
  return ingredients.some(ingredient => {
    const lower = ingredient.toLowerCase();

    // Check for ingredients without quantities (but not seasonings)
    // Exclude common seasonings and items that are typically "to taste"
    if (lower.match(/^(tuna|chicken|beef|pork|fish|cheese|noodles|pasta)(?!\s+\d)/) &&
        !lower.match(/to taste|or to taste/)) {
      return true;
    }

    // Check for truly vague quantities (but exclude acceptable phrases)
    // "to taste", "salt and pepper to taste", etc. are acceptable in family recipes
    // Small measurements like "1/4 tsp", "1/8 tsp" are valid, not vague
    if (lower.match(/some |a little (?!salt|pepper|seasoning)/) &&
        !lower.match(/to taste|or to taste|as needed/)) {
      return true;
    }

    return false;
  });
}

/**
 * Find specific incomplete quantities
 */
function findIncompleteQuantities(ingredients) {
  const issues = [];

  ingredients.forEach((ingredient, index) => {
    const lower = ingredient.toLowerCase();

    // Flag ingredients without quantities (excluding seasonings and "to taste" items)
    if (lower.match(/^(tuna|chicken|beef|pork|fish|cheese|noodles|pasta)(?!\s+\d)/) &&
        !lower.match(/to taste|or to taste/)) {
      issues.push(`Line ${index + 1}: "${ingredient}" - missing quantity`);
    }

    // Flag truly vague quantities (excluding acceptable traditional phrases)
    // "to taste" is a traditional recipe convention and is acceptable
    // Small measurements are valid quantities
    if (lower.match(/some (?!salt|pepper|seasoning)|a little (?!salt|pepper|seasoning)/) &&
        !lower.match(/to taste|or to taste|as needed/)) {
      issues.push(`Line ${index + 1}: "${ingredient}" - vague quantity`);
    }
  });

  return issues;
}

/**
 * Check if instructions are vague or minimal
 */
function hasVagueInstructions(instructions) {
  if (instructions.length === 0) return true;
  if (instructions.length === 1 && instructions[0].length < 50) return true;
  
  // Check for very short instructions
  const shortInstructions = instructions.filter(inst => inst.length < 30);
  if (shortInstructions.length > instructions.length / 2) return true;
  
  return false;
}

/**
 * Get reason for vague instructions
 */
function getVagueInstructionReason(instructions) {
  if (instructions.length === 0) return 'No instructions found';
  if (instructions.length === 1) return 'Only one instruction - needs expansion';
  
  const avgLength = instructions.reduce((sum, inst) => sum + inst.length, 0) / instructions.length;
  if (avgLength < 40) return 'Instructions are very brief - need more detail';
  
  return 'Instructions may need expansion';
}

/**
 * Check for missing metadata
 */
function hasMissingMetadata(parsed, metadata) {
  // Check if we had to estimate times
  if (!parsed.metadata.timesText && !parsed.rawContent.match(/\d+\s*min/i)) {
    return true;
  }
  
  // Check if yield was estimated
  if (!parsed.rawContent.match(/serves|makes|yield/i)) {
    return true;
  }
  
  return false;
}

/**
 * Get list of missing metadata
 */
function getMissingMetadata(parsed, metadata) {
  const missing = [];

  if (!parsed.metadata.timesText && !parsed.rawContent.match(/\d+\s*min/i)) {
    missing.push('Prep/cook times estimated - please verify');
  }

  if (!parsed.rawContent.match(/serves|makes|yield/i)) {
    missing.push('Yield estimated - please verify');
  }

  // Don't flag missing author - "Maw Maw" is an acceptable default for family recipes
  // if (!parsed.author) {
  //   missing.push('Author unknown - using default');
  // }

  return missing;
}

/**
 * Check if category inference is uncertain
 */
function isUncertainCategory(parsed, metadata) {
  const title = parsed.title.toLowerCase();
  
  // If title is very generic, category might be uncertain
  if (title.match(/^(recipe|dish|food|meal)\s*\d*$/)) {
    return true;
  }
  
  // If we defaulted to "Main Dishes" without strong indicators
  if (metadata.category === 'Main Dishes') {
    const hasStrongIndicator = title.match(/casserole|chicken|beef|pork|fish|meat/);
    if (!hasStrongIndicator) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if recipe has multiple components
 */
function isMultiComponentRecipe(parsed) {
  const content = parsed.rawContent.toLowerCase();
  
  // Check for component indicators
  if (content.match(/for the (cake|icing|frosting|filling|crust|topping|sauce|glaze)/)) {
    return true;
  }
  
  // Check for multiple H3/H4 sections in ingredients or instructions
  const h3Count = (content.match(/###/g) || []).length;
  const h4Count = (content.match(/####/g) || []).length;
  
  if (h3Count > 2 || h4Count > 2) {
    return true;
  }
  
  return false;
}

/**
 * Get review summary for a recipe
 */
function getReviewSummary(filename) {
  const issues = [];
  
  // Check each review category
  const incomplete = reviewReport.incompleteQuantities.find(r => r.file === filename);
  if (incomplete) {
    issues.push(`Incomplete quantities: ${incomplete.issues.length} issues`);
  }
  
  const vague = reviewReport.vagueInstructions.find(r => r.file === filename);
  if (vague) {
    issues.push(`Vague instructions: ${vague.reason}`);
  }
  
  const missing = reviewReport.missingMetadata.find(r => r.file === filename);
  if (missing) {
    issues.push(`Missing metadata: ${missing.missing.join(', ')}`);
  }
  
  const uncertain = reviewReport.uncertainCategories.find(r => r.file === filename);
  if (uncertain) {
    issues.push(`Uncertain category: ${uncertain.inferredCategory}`);
  }
  
  const multiComponent = reviewReport.multiComponentRecipes.find(r => r.file === filename);
  if (multiComponent) {
    issues.push('Multi-component recipe');
  }
  
  return issues;
}

module.exports = {
  checkForReviewIssues,
  hasIncompleteQuantities,
  hasVagueInstructions,
  hasMissingMetadata,
  isUncertainCategory,
  isMultiComponentRecipe,
  getReviewSummary,
};

