import { Recipe, RecipeIngredient, ScaledRecipe, RecipeCard, RecipeSearchFilters } from '@/types';

/**
 * Scale recipe ingredients based on serving size
 */
export function scaleRecipe(recipe: Recipe, newServings: number): ScaledRecipe {
  const scalingFactor = newServings / recipe.meta.servings;
  
  const scaledIngredients: RecipeIngredient[] = recipe.ingredients.map(ingredient => {
    const amount = parseFloat(ingredient.amount);
    if (isNaN(amount)) {
      return ingredient; // Return as-is if amount is not numeric
    }
    
    const scaledAmount = (amount * scalingFactor).toFixed(2);
    return {
      ...ingredient,
      amount: scaledAmount.endsWith('.00') ? scaledAmount.slice(0, -3) : scaledAmount
    };
  });

  return {
    ...recipe,
    ingredients: scaledIngredients,
    meta: {
      ...recipe.meta,
      servings: newServings
    },
    scalingFactor,
    originalServings: recipe.meta.servings
  };
}

/**
 * Convert recipe to card format for listings
 */
export function recipeToCard(recipe: Recipe): RecipeCard {
  return {
    slug: recipe.slug,
    title: recipe.meta.title,
    description: recipe.meta.description,
    category: recipe.meta.category,
    difficulty: recipe.meta.difficulty,
    totalTime: recipe.meta.times.total,
    servings: recipe.meta.servings,
    image: recipe.meta.image,
    imageAlt: recipe.meta.imageAlt,
    tags: recipe.meta.tags,
    rating: recipe.meta.rating,
    reviewCount: recipe.meta.reviewCount
  };
}

/**
 * Parse time string to minutes
 */
export function parseTimeToMinutes(timeString: string): number {
  const timeRegex = /(\d+)\s*(h|hr|hour|hours|m|min|minute|minutes)/gi;
  let totalMinutes = 0;
  let match;

  while ((match = timeRegex.exec(timeString)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    if (unit.startsWith('h')) {
      totalMinutes += value * 60;
    } else if (unit.startsWith('m')) {
      totalMinutes += value;
    }
  }

  return totalMinutes;
}

/**
 * Format minutes to readable time string
 */
export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Calculate total time from prep and cook times
 */
export function calculateTotalTime(prepTime: string, cookTime: string): string {
  const prepMinutes = parseTimeToMinutes(prepTime);
  const cookMinutes = parseTimeToMinutes(cookTime);
  return formatTime(prepMinutes + cookMinutes);
}

/**
 * Filter recipes based on search criteria
 */
export function filterRecipes(recipes: Recipe[], filters: RecipeSearchFilters): Recipe[] {
  return recipes.filter(recipe => {
    // Category filter
    if (filters.category && recipe.meta.category !== filters.category) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty && filters.difficulty.length > 0 && 
        !filters.difficulty.includes(recipe.meta.difficulty)) {
      return false;
    }

    // Max time filter
    if (filters.maxTime) {
      const totalMinutes = parseTimeToMinutes(recipe.meta.times.total);
      if (totalMinutes > filters.maxTime) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        recipe.meta.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Cuisine filter
    if (filters.cuisine && filters.cuisine.length > 0 && recipe.meta.cuisine &&
        !filters.cuisine.includes(recipe.meta.cuisine)) {
      return false;
    }

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        recipe.meta.title,
        recipe.meta.description,
        recipe.meta.category,
        recipe.meta.cuisine || '',
        ...recipe.meta.tags,
        ...recipe.ingredients.map(ing => ing.ingredient)
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get unique values from recipes for filter options
 */
export function getFilterOptions(recipes: Recipe[]) {
  const difficulties = [...new Set(recipes.map(r => r.meta.difficulty))];
  const cuisines = [...new Set(recipes.map(r => r.meta.cuisine).filter(Boolean))];
  const tags = [...new Set(recipes.flatMap(r => r.meta.tags))];
  const maxTime = Math.max(...recipes.map(r => parseTimeToMinutes(r.meta.times.total)));

  return {
    difficulties,
    cuisines,
    tags,
    maxTime
  };
}

/**
 * Generate recipe slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Validate recipe data
 */
export function validateRecipe(recipe: Partial<Recipe>): string[] {
  const errors: string[] = [];

  if (!recipe.meta?.title) errors.push('Title is required');
  if (!recipe.meta?.category) errors.push('Category is required');
  if (!recipe.meta?.difficulty) errors.push('Difficulty is required');
  if (!recipe.meta?.servings || recipe.meta.servings <= 0) errors.push('Valid servings count is required');
  if (!recipe.ingredients || recipe.ingredients.length === 0) errors.push('At least one ingredient is required');
  if (!recipe.instructions || recipe.instructions.length === 0) errors.push('At least one instruction is required');

  return errors;
}

/**
 * Convert user recipe to Recipe format
 */
export function userRecipeToRecipe(userRecipe: any): Recipe {
  return {
    slug: userRecipe.slug || `recipe-${userRecipe.id}`,
    meta: {
      title: userRecipe.title,
      description: userRecipe.description || 'A delicious homemade recipe',
      category: userRecipe.category,
      difficulty: userRecipe.difficulty,
      servings: userRecipe.servings || 4,
      times: {
        prep: userRecipe.prepTime || '15 min',
        cook: userRecipe.cookTime || '30 min',
        total: `${parseInt(userRecipe.prepTime?.replace(/\D/g, '') || '15') + parseInt(userRecipe.cookTime?.replace(/\D/g, '') || '30')} min`
      },
      tags: userRecipe.tags || [],
      image: userRecipe.image || '/images/recipes/placeholder.svg',
      imageAlt: `${userRecipe.title} recipe image`,
      rating: 0,
      reviewCount: 0
    },
    ingredients: userRecipe.ingredients || [],
    instructions: userRecipe.instructions || [],
    notes: userRecipe.notes ? [userRecipe.notes] : [],
    variations: [],
    storage: [],
    nutrition: null
  };
}

/**
 * Get user recipes from localStorage
 */
export function getUserRecipes(): any[] {
  if (typeof window === 'undefined') return [];

  const savedUserRecipes = localStorage.getItem('savor-user-recipes');
  return savedUserRecipes ? JSON.parse(savedUserRecipes) : [];
}

/**
 * Get a specific user recipe by slug
 */
export function getUserRecipeBySlug(slug: string): any | null {
  const userRecipes = getUserRecipes();
  return userRecipes.find(recipe =>
    (recipe.slug === slug) || (`recipe-${recipe.id}` === slug)
  ) || null;
}

// Note: Server-side functions for combining markdown and user recipes
// are moved to a separate server-side utility file

/**
 * Create shopping list from recipe
 */
export function createShoppingListFromRecipe(recipe: Recipe): {
  name: string;
  items: Array<{
    id: string;
    name: string;
    quantity: string;
    unit: string;
    category: string;
    purchased: boolean;
    recipeSource: string;
  }>;
} {
  const listName = `${recipe.meta.title} - Shopping List`;

  const items = recipe.ingredients.map((ingredient, index) => ({
    id: `${Date.now()}-${index}`,
    name: ingredient.ingredient,
    quantity: ingredient.amount,
    unit: ingredient.unit || '',
    category: categorizeIngredient(ingredient.ingredient),
    purchased: false,
    recipeSource: recipe.meta.title
  }));

  return {
    name: listName,
    items
  };
}

/**
 * Simple ingredient categorization
 */
function categorizeIngredient(ingredient: string): string {
  const lowerIngredient = ingredient.toLowerCase();

  if (lowerIngredient.includes('chicken') || lowerIngredient.includes('beef') ||
      lowerIngredient.includes('pork') || lowerIngredient.includes('fish') ||
      lowerIngredient.includes('salmon') || lowerIngredient.includes('shrimp')) {
    return 'Meat & Seafood';
  }

  if (lowerIngredient.includes('milk') || lowerIngredient.includes('cheese') ||
      lowerIngredient.includes('butter') || lowerIngredient.includes('cream') ||
      lowerIngredient.includes('yogurt') || lowerIngredient.includes('egg')) {
    return 'Dairy & Eggs';
  }

  if (lowerIngredient.includes('apple') || lowerIngredient.includes('banana') ||
      lowerIngredient.includes('tomato') || lowerIngredient.includes('onion') ||
      lowerIngredient.includes('carrot') || lowerIngredient.includes('lettuce') ||
      lowerIngredient.includes('potato') || lowerIngredient.includes('pepper')) {
    return 'Produce';
  }

  if (lowerIngredient.includes('flour') || lowerIngredient.includes('sugar') ||
      lowerIngredient.includes('salt') || lowerIngredient.includes('oil') ||
      lowerIngredient.includes('pasta') || lowerIngredient.includes('rice') ||
      lowerIngredient.includes('beans') || lowerIngredient.includes('spice')) {
    return 'Pantry & Dry Goods';
  }

  if (lowerIngredient.includes('frozen') || lowerIngredient.includes('ice cream')) {
    return 'Frozen';
  }

  if (lowerIngredient.includes('bread') || lowerIngredient.includes('bagel') ||
      lowerIngredient.includes('muffin')) {
    return 'Bakery';
  }

  if (lowerIngredient.includes('juice') || lowerIngredient.includes('soda') ||
      lowerIngredient.includes('water') || lowerIngredient.includes('coffee') ||
      lowerIngredient.includes('tea')) {
    return 'Beverages';
  }

  return 'Other';
}

/**
 * Add recipe to shopping list and redirect
 */
export function addRecipeToShoppingList(recipe: Recipe): void {
  if (typeof window === 'undefined') return;

  const shoppingListData = createShoppingListFromRecipe(recipe);

  // Get existing shopping lists
  const existingLists = JSON.parse(localStorage.getItem('savor-shopping-lists') || '[]');

  // Create new shopping list
  const newList = {
    id: Date.now().toString(),
    name: shoppingListData.name,
    items: shoppingListData.items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Add to existing lists
  const updatedLists = [...existingLists, newList];
  localStorage.setItem('savor-shopping-lists', JSON.stringify(updatedLists));

  // Show success message (you could replace this with a toast notification)
  alert(`Shopping list "${newList.name}" created successfully!`);

  // Redirect to shopping list page
  window.location.href = `/shopping-list?list=${newList.id}`;
}
