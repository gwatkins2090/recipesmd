'use client';

import { useState, useMemo } from 'react';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Recipe } from '@/types';
import { recipeToCard } from '@/lib/recipe-utils';

interface RecipeGridProps {
  recipes: Recipe[];
  showFilters?: boolean;
}

type SortOption = 'title' | 'difficulty' | 'time' | 'rating';

export function RecipeGrid({ recipes, showFilters = true }: RecipeGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Convert recipes to card format
  const recipeCards = useMemo(() => {
    return recipes.map(recipeToCard);
  }, [recipes]);

  // Sort recipes
  const sortedRecipes = useMemo(() => {
    const sorted = [...recipeCards];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return sorted.sort((a, b) => 
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        );
      case 'time':
        return sorted.sort((a, b) => {
          const timeA = parseInt(a.totalTime.replace(/\D/g, ''));
          const timeB = parseInt(b.totalTime.replace(/\D/g, ''));
          return timeA - timeB;
        });
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  }, [recipeCards, sortBy]);

  const handleFavoriteClick = (slug: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(slug)) {
      newFavorites.delete(slug);
    } else {
      newFavorites.add(slug);
    }
    setFavorites(newFavorites);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('savor-favorites', JSON.stringify(Array.from(newFavorites)));
    }
  };

  // Load favorites from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('savor-favorites');
      if (savedFavorites) {
        setFavorites(new Set(JSON.parse(savedFavorites)));
      }
    }
  });

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4 text-6xl">🍽️</div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">No recipes found</h3>
        <p className="text-muted-foreground">
          We're working on adding more delicious recipes to this category. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sort options */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {recipes.length} Recipe{recipes.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover delicious recipes perfect for any occasion
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <label htmlFor="sort" className="text-sm font-medium text-foreground">
              Sort by:
            </label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Name</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="time">Cook Time</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Recipe grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.slug}
            recipe={recipe}
            onFavoriteClick={handleFavoriteClick}
            isFavorited={favorites.has(recipe.slug)}
            className="h-full"
          />
        ))}
      </div>

      {/* Load more button (for future pagination) */}
      {recipes.length > 12 && (
        <div className="text-center pt-8">
          <Button variant="outline" size="lg">
            Load More Recipes
          </Button>
        </div>
      )}
    </div>
  );
}
