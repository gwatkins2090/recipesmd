import { RecipeCard } from '@/components/ui/recipe-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Recipe } from '@/types';
import { recipeToCard } from '@/lib/recipe-utils';

interface SearchResultsProps {
  recipes: Recipe[];
  searchQuery: string;
  totalRecipes: number;
  isLoading?: boolean;
}

export function SearchResults({ 
  recipes, 
  searchQuery, 
  totalRecipes, 
  isLoading = false 
}: SearchResultsProps) {
  const recipeCards = recipes.map(recipeToCard);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // No results state
  if (recipes.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-savor-charcoal">
            No recipes found
          </h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any recipes matching "{searchQuery}". Try adjusting your search or filters.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-savor-charcoal mb-2">Try these suggestions:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                chicken
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                pasta
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                dessert
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                quick meals
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                vegetarian
              </Badge>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={() => window.location.href = '/recipes'}>
              Browse All Recipes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state (no search query)
  if (recipes.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-savor-saffron/20 mx-auto mb-4">
            <Search className="h-8 w-8 text-savor-saffron" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-savor-charcoal">
            Start Your Recipe Search
          </h3>
          <p className="text-muted-foreground mb-6">
            Enter a recipe name, ingredient, or cuisine type to find delicious recipes.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-savor-charcoal mb-2">Popular searches:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                chocolate chip cookies
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                chicken breast
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                spaghetti
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-savor-saffron/20">
                soup
              </Badge>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={() => window.location.href = '/categories'}>
              Browse by Category
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-savor-charcoal">
            {searchQuery ? (
              <>
                Search Results for "{searchQuery}"
              </>
            ) : (
              'All Recipes'
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
            {totalRecipes > 0 && recipes.length !== totalRecipes && (
              <span> (filtered from {totalRecipes} total)</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <label htmlFor="sort" className="text-sm font-medium text-savor-charcoal">
            Sort by:
          </label>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="title">Name</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="time">Cook Time</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recipe grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipeCards.map((recipe) => (
          <RecipeCard
            key={recipe.slug}
            recipe={recipe}
            showFavorite={false}
            className="h-full"
          />
        ))}
      </div>

      {/* Load more button (for future pagination) */}
      {recipes.length >= 12 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
}
