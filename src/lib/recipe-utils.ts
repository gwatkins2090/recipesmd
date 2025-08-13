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
