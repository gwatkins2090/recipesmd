import { Recipe } from '@/types';
import { getAllRecipes, getRecipeBySlug } from '@/lib/markdown';
import { userRecipeToRecipe, getUserRecipes, getUserRecipeBySlug } from '@/lib/recipe-utils';

/**
 * Get all recipes (markdown and user recipes) - SERVER SIDE ONLY
 *
 * Note: Family recipes are now loaded via the markdown parser from /recipes/family/
 * The old family-recipes system has been deprecated and removed.
 */
export async function getAllRecipesIncludingUser(): Promise<Recipe[]> {
  const markdownRecipes = await getAllRecipes();
  const userRecipes = getUserRecipes();

  const convertedUserRecipes = userRecipes.map(userRecipeToRecipe);

  return [...markdownRecipes, ...convertedUserRecipes];
}

/**
 * Get a recipe by slug (checks markdown and user recipes) - SERVER SIDE ONLY
 *
 * Note: Family recipes are now loaded via the markdown parser.
 * The old family-recipes system has been deprecated and removed.
 */
export async function getRecipeBySlugIncludingUser(slug: string): Promise<Recipe | null> {
  // First try to get from markdown (includes all family recipes)
  try {
    const markdownRecipe = await getRecipeBySlug(slug);
    if (markdownRecipe) {
      return markdownRecipe;
    }
  } catch (error) {
    console.error('Error fetching markdown recipe:', error);
  }

  // For server-side rendering, we can't access localStorage
  // User recipes will be handled client-side if needed
  // This function primarily handles markdown recipes on the server

  return null;
}
