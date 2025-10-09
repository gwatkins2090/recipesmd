/**
 * Add Nutrition Information to Recipes
 * Uses USDA FoodData Central API to calculate nutrition
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUTPUT_DIR = path.join(__dirname, 'output');

// USDA API Configuration
// Get your free API key at: https://fdc.nal.usda.gov/api-guide.html
const USDA_API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY'; // Replace with your API key
const USDA_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Ingredient name mappings for better matching
 */
const INGREDIENT_MAPPINGS = {
  // Fats
  'oleo': 'margarine',
  'margarine': 'margarine',
  'butter': 'butter, salted',
  'shortening': 'vegetable shortening',
  'oil': 'vegetable oil',
  'olive oil': 'olive oil',
  
  // Dairy
  'velveta': 'processed cheese',
  'velveeta': 'processed cheese',
  'cream cheese': 'cream cheese',
  'sour cream': 'sour cream',
  'milk': 'whole milk',
  'evaporated milk': 'evaporated milk',
  'buttermilk': 'buttermilk',
  
  // Proteins
  'chicken': 'chicken breast, raw',
  'beef': 'ground beef',
  'pork': 'pork, ground',
  'ham': 'ham, sliced',
  'tuna': 'tuna, canned in water',
  'salmon': 'salmon, raw',
  'shrimp': 'shrimp, raw',
  'eggs': 'egg, whole, raw',
  
  // Grains
  'flour': 'wheat flour, white, all-purpose',
  'all-purpose flour': 'wheat flour, white, all-purpose',
  'sugar': 'sugar, granulated',
  'brown sugar': 'sugar, brown',
  'rice': 'rice, white, long-grain',
  'pasta': 'pasta, dry',
  'spaghetti': 'spaghetti, dry',
  'noodles': 'egg noodles, dry',
  
  // Vegetables
  'onion': 'onions, raw',
  'bell pepper': 'peppers, sweet, red, raw',
  'celery': 'celery, raw',
  'carrots': 'carrots, raw',
  'broccoli': 'broccoli, raw',
  
  // Canned goods
  'cream of mushroom soup': 'soup, cream of mushroom, canned',
  'cream of chicken soup': 'soup, cream of chicken, canned',
  'rotel': 'tomatoes, canned, diced',
  'tomatoes': 'tomatoes, canned',
};

/**
 * Unit conversion to grams/ml
 */
const UNIT_CONVERSIONS = {
  // Volume to grams (approximate for common ingredients)
  'cup': { flour: 120, sugar: 200, butter: 227, milk: 240, water: 240 },
  'tbsp': { flour: 8, sugar: 12.5, butter: 14, milk: 15, water: 15 },
  'tsp': { flour: 2.5, sugar: 4, butter: 5, milk: 5, water: 5 },
  
  // Weight
  'oz': 28.35,
  'lb': 453.59,
  'g': 1,
  'kg': 1000,
};

/**
 * Parse ingredient quantity
 */
function parseIngredientQuantity(ingredient) {
  const lower = ingredient.toLowerCase();
  
  // Extract quantity (handles fractions and ranges)
  const quantityMatch = lower.match(/^(\d+(?:\/\d+)?(?:\s*-\s*\d+)?)\s*([a-z]+)?/);
  
  if (!quantityMatch) {
    return { quantity: 0, unit: null, ingredient: lower, parseable: false };
  }
  
  let quantity = quantityMatch[1];
  const unit = quantityMatch[2] || null;
  
  // Handle ranges (e.g., "2-3 cups") - use median
  if (quantity.includes('-')) {
    const [min, max] = quantity.split('-').map(n => parseFloat(n));
    quantity = (min + max) / 2;
  } else {
    // Handle fractions
    if (quantity.includes('/')) {
      const [num, den] = quantity.split('/').map(n => parseFloat(n));
      quantity = num / den;
    } else {
      quantity = parseFloat(quantity);
    }
  }
  
  // Extract ingredient name (remove quantity and unit)
  const ingredientName = lower
    .replace(/^(\d+(?:\/\d+)?(?:\s*-\s*\d+)?)\s*([a-z]+)?\s*/, '')
    .trim();
  
  return { quantity, unit, ingredient: ingredientName, parseable: true };
}

/**
 * Map ingredient to USDA search term
 */
function mapIngredientToUSDA(ingredientName) {
  // Check direct mappings first
  for (const [key, value] of Object.entries(INGREDIENT_MAPPINGS)) {
    if (ingredientName.includes(key)) {
      return value;
    }
  }
  
  // Return cleaned ingredient name
  return ingredientName
    .replace(/\(.*?\)/g, '') // Remove parentheses
    .replace(/,.*$/, '') // Remove everything after comma
    .trim();
}

/**
 * Search USDA database for ingredient
 */
async function searchUSDAFood(ingredientName) {
  return new Promise((resolve, reject) => {
    const searchTerm = mapIngredientToUSDA(ingredientName);
    const url = `${USDA_API_BASE}/foods/search?query=${encodeURIComponent(searchTerm)}&api_key=${USDA_API_KEY}&pageSize=1`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.foods && result.foods.length > 0) {
            resolve(result.foods[0]);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Calculate nutrition for a single ingredient
 */
async function calculateIngredientNutrition(ingredient) {
  const parsed = parseIngredientQuantity(ingredient);
  
  if (!parsed.parseable || parsed.quantity === 0) {
    return null;
  }
  
  try {
    const foodData = await searchUSDAFood(parsed.ingredient);
    
    if (!foodData || !foodData.foodNutrients) {
      return null;
    }
    
    // Extract key nutrients (per 100g)
    const nutrients = {};
    foodData.foodNutrients.forEach(nutrient => {
      const name = nutrient.nutrientName.toLowerCase();
      if (name.includes('energy')) nutrients.calories = nutrient.value;
      if (name.includes('protein')) nutrients.protein = nutrient.value;
      if (name.includes('total lipid') || name.includes('fat, total')) nutrients.fat = nutrient.value;
      if (name.includes('carbohydrate')) nutrients.carbs = nutrient.value;
      if (name.includes('fiber')) nutrients.fiber = nutrient.value;
      if (name.includes('sugars, total')) nutrients.sugars = nutrient.value;
      if (name.includes('sodium')) nutrients.sodium = nutrient.value;
      if (name.includes('cholesterol')) nutrients.cholesterol = nutrient.value;
    });
    
    // Scale to actual quantity (simplified - assumes 100g base)
    const scaleFactor = parsed.quantity / 100;
    
    Object.keys(nutrients).forEach(key => {
      nutrients[key] = Math.round(nutrients[key] * scaleFactor * 10) / 10;
    });
    
    return {
      ingredient: parsed.ingredient,
      matched: foodData.description,
      nutrients,
      confidence: 'medium'
    };
    
  } catch (error) {
    console.error(`Error calculating nutrition for "${ingredient}":`, error.message);
    return null;
  }
}

/**
 * Calculate total recipe nutrition
 */
async function calculateRecipeNutrition(ingredients, servings) {
  console.log(`\nCalculating nutrition for ${ingredients.length} ingredients...`);
  
  const results = [];
  const totals = {
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    sugars: 0,
    sodium: 0,
    cholesterol: 0
  };
  
  for (const ingredient of ingredients) {
    const nutrition = await calculateIngredientNutrition(ingredient);
    
    if (nutrition) {
      results.push(nutrition);
      Object.keys(totals).forEach(key => {
        if (nutrition.nutrients[key]) {
          totals[key] += nutrition.nutrients[key];
        }
      });
      console.log(`  ✅ ${nutrition.ingredient} → ${nutrition.matched}`);
    } else {
      console.log(`  ⏭️  ${ingredient} - Could not calculate`);
    }
    
    // Rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Calculate per serving
  const perServing = {};
  Object.keys(totals).forEach(key => {
    perServing[key] = Math.round(totals[key] / servings * 10) / 10;
  });
  
  return {
    total: totals,
    perServing,
    servings,
    ingredientsAnalyzed: results.length,
    totalIngredients: ingredients.length
  };
}

/**
 * Add nutrition to recipe file
 */
async function addNutritionToRecipe(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if nutrition already exists
  if (content.match(/^nutrition:/m)) {
    return { updated: false, reason: 'Nutrition already exists' };
  }
  
  // Extract ingredients
  const ingredientsMatch = content.match(/## Ingredients\n\n([\s\S]+?)\n\n##/);
  if (!ingredientsMatch) {
    return { updated: false, reason: 'Could not extract ingredients' };
  }
  
  const ingredients = ingredientsMatch[1]
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim());
  
  // Extract servings
  const yieldMatch = content.match(/^yield:\s*"?(\d+)/m);
  const servings = yieldMatch ? parseInt(yieldMatch[1]) : 8;
  
  // Calculate nutrition
  const nutrition = await calculateRecipeNutrition(ingredients, servings);
  
  // Format nutrition YAML
  const nutritionYAML = [
    '',
    'nutrition:',
    `  servingSize: "1 serving (1/${servings} of recipe)"`,
    `  calories: "${Math.round(nutrition.perServing.calories)}"`,
    `  totalFat: "${nutrition.perServing.fat}g"`,
    `  protein: "${nutrition.perServing.protein}g"`,
    `  totalCarbohydrate: "${nutrition.perServing.carbs}g"`,
    `  dietaryFiber: "${nutrition.perServing.fiber}g"`,
    `  sugars: "${nutrition.perServing.sugars}g"`,
    `  sodium: "${nutrition.perServing.sodium}mg"`,
    `  cholesterol: "${nutrition.perServing.cholesterol}mg"`,
    `  note: "Estimated values based on ${nutrition.ingredientsAnalyzed}/${nutrition.totalIngredients} ingredients"`
  ].join('\n');
  
  // Insert before closing ---
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
    return { updated: false, reason: 'Could not find YAML end' };
  }
  
  lines.splice(yamlEndIndex, 0, nutritionYAML);
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  
  return { 
    updated: true, 
    nutrition,
    calories: Math.round(nutrition.perServing.calories)
  };
}

// Export functions
module.exports = {
  addNutritionToRecipe,
  calculateRecipeNutrition
};

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node add-nutrition.js <recipe-file.md>');
    console.log('  node add-nutrition.js --all (process all recipes)');
    console.log('\nNote: Set USDA_API_KEY environment variable with your API key');
    console.log('Get a free key at: https://fdc.nal.usda.gov/api-guide.html');
    process.exit(1);
  }
  
  if (args[0] === '--all') {
    console.log('⚠️  Processing all recipes will take time due to API rate limits');
    console.log('This feature is available but recommended to run on individual recipes first.\n');
  } else {
    const recipePath = path.join(OUTPUT_DIR, args[0]);
    if (!fs.existsSync(recipePath)) {
      console.error(`Error: Recipe file not found: ${recipePath}`);
      process.exit(1);
    }
    
    addNutritionToRecipe(recipePath).then(result => {
      if (result.updated) {
        console.log(`\n✅ Nutrition added successfully!`);
        console.log(`   Calories per serving: ${result.calories}`);
      } else {
        console.log(`\n⏭️  ${result.reason}`);
      }
    });
  }
}

