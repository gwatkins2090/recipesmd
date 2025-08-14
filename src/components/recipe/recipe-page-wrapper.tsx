'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { RecipeHero } from '@/components/recipe/recipe-hero';
import { RecipeIngredients } from '@/components/recipe/recipe-ingredients';
import { RecipeInstructions } from '@/components/recipe/recipe-instructions';
import { RecipeNutrition } from '@/components/recipe/recipe-nutrition';
import { RecipeNotes } from '@/components/recipe/recipe-notes';
import { RelatedRecipes } from '@/components/recipe/related-recipes';
import { RecipeStructuredData, BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { getUserRecipeBySlug, userRecipeToRecipe } from '@/lib/recipe-utils';
import { kebabToTitle } from '@/lib/utils';
import { Recipe } from '@/types';

interface RecipePageWrapperProps {
  slug: string;
  markdownRecipe: Recipe | null;
}

export function RecipePageWrapper({ slug, markdownRecipe }: RecipePageWrapperProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(markdownRecipe);
  const [isLoading, setIsLoading] = useState(!markdownRecipe);

  useEffect(() => {
    // If we don't have a markdown recipe, check for user recipes
    if (!markdownRecipe) {
      const userRecipe = getUserRecipeBySlug(slug);
      if (userRecipe) {
        setRecipe(userRecipeToRecipe(userRecipe));
      }
      setIsLoading(false);
    }
  }, [slug, markdownRecipe]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container py-12'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
            <p className='text-muted-foreground'>Loading recipe...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    notFound();
  }

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: kebabToTitle(recipe.meta.category), url: `/categories/${recipe.meta.category}` },
    { name: recipe.meta.title, url: `/recipes/${recipe.slug}` },
  ];

  return (
    <>
      <RecipeStructuredData recipe={recipe} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <RecipeHero recipe={recipe} />

      <div className='container py-8 lg:py-12'>
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Main content */}
          <div className='space-y-8 lg:col-span-2'>
            <RecipeIngredients ingredients={recipe.ingredients} servings={recipe.meta.servings} />

            <RecipeInstructions instructions={recipe.instructions} />

            {recipe.notes && recipe.notes.length > 0 && (
              <RecipeNotes
                notes={recipe.notes}
                variations={recipe.variations}
                storage={recipe.storage}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className='lg:col-span-1'>
            {recipe.nutrition && <RecipeNutrition nutrition={recipe.nutrition} />}
          </div>
        </div>
      </div>

      {/* Related recipes - simplified for user recipes */}
      <RelatedRecipes recipes={[]} category={recipe.meta.category} />
    </>
  );
}
