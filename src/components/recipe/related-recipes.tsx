import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/ui/recipe-card';
import { ArrowRight } from 'lucide-react';
import { Recipe } from '@/types';
import { recipeToCard } from '@/lib/recipe-utils';
import { kebabToTitle } from '@/lib/utils';

interface RelatedRecipesProps {
  recipes: Recipe[];
  category: string;
}

export function RelatedRecipes({ recipes, category }: RelatedRecipesProps) {
  if (recipes.length === 0) {
    return null;
  }

  const recipeCards = recipes.map(recipeToCard);

  return (
    <section className="bg-gradient-to-br from-savor-mint/10 to-savor-sage/5 py-16 lg:py-24">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl">
            More {kebabToTitle(category)} Recipes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover more delicious recipes from the same category that you might enjoy.
          </p>
        </div>

        {/* Recipe grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recipeCards.map((recipe) => (
            <RecipeCard
              key={recipe.slug}
              recipe={recipe}
              showFavorite={false}
              className="h-full"
            />
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="border-savor-sage text-savor-sage hover:bg-savor-sage hover:text-white"
          >
            <Link href={`/categories/${category}`} className="inline-flex items-center">
              View All {kebabToTitle(category)} Recipes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
