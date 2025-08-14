import { Recipe } from '@/types';
import { getAllRecipes, getRecipeBySlug } from '@/lib/markdown';
import { getAllFamilyRecipes, getFamilyRecipeBySlug } from '@/lib/family-recipes';
import { userRecipeToRecipe, getUserRecipes, getUserRecipeBySlug } from '@/lib/recipe-utils';

/**
 * Get all recipes (markdown, family, and user recipes) - SERVER SIDE ONLY
 */
export async function getAllRecipesIncludingUser(): Promise<Recipe[]> {
  const markdownRecipes = await getAllRecipes();
  const familyRecipes = await getAllFamilyRecipes();
  const userRecipes = getUserRecipes();

  const convertedUserRecipes = userRecipes.map(userRecipeToRecipe);

  return [...markdownRecipes, ...familyRecipes, ...convertedUserRecipes];
}

/**
 * Get a recipe by slug (checks markdown, family, and user recipes) - SERVER SIDE ONLY
 */
export async function getRecipeBySlugIncludingUser(slug: string): Promise<Recipe | null> {
  // First try to get from markdown
  try {
    const markdownRecipe = await getRecipeBySlug(slug);
    if (markdownRecipe) {
      return markdownRecipe;
    }
  } catch (error) {
    // Continue to check family recipes
  }

  // Then try family recipes
  try {
    const familyRecipe = await getFamilyRecipeBySlug(slug);
    if (familyRecipe) {
      return familyRecipe;
    }
  } catch (error) {
    // Continue to check user recipes
  }

  // For server-side rendering, we can't access localStorage
  // User recipes will be handled client-side if needed
  // This function primarily handles markdown and family recipes on the server

  return null;
}
