'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/ui/recipe-card';
import { ChefHat, Search, Filter, X, Plus, Edit, Trash2, Eye, ShoppingCart } from 'lucide-react';
import { RecipeCard as RecipeCardType } from '@/types';
import { userRecipeToRecipe, addRecipeToShoppingList } from '@/lib/recipe-utils';

interface MyRecipesSectionProps {
  userRecipes: any[];
  onRecipeEdit?: (recipe: any) => void;
  onRecipeDelete?: (recipeId: string) => void;
  onAddNewRecipe?: () => void;
}

export function MyRecipesSection({
  userRecipes,
  onRecipeEdit,
  onRecipeDelete,
  onAddNewRecipe,
}: MyRecipesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Convert user recipes to recipe card format
  const recipeCards: RecipeCardType[] = userRecipes.map((recipe) => ({
    slug: recipe.slug || `recipe-${recipe.id}`,
    title: recipe.title,
    description: recipe.description || 'A delicious homemade recipe',
    category: recipe.category,
    difficulty: recipe.difficulty as 'Easy' | 'Medium' | 'Hard',
    totalTime: `${recipe.prepTime || '15'} + ${recipe.cookTime || '30'} min`,
    servings: recipe.servings || 4,
    image: recipe.image || '/images/recipes/placeholder.svg',
    imageAlt: `${recipe.title} recipe image`,
    tags: recipe.tags || [],
    rating: recipe.rating || 0,
    reviewCount: recipe.reviewCount || 0,
  }));

  // Filter recipes based on search and filters
  const filteredRecipes = recipeCards.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === 'all' || recipe.difficulty.toLowerCase() === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Get unique categories and difficulties from user recipes
  const categories = ['all', ...new Set(recipeCards.map((recipe) => recipe.category))];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== 'all' || selectedDifficulty !== 'all';

  const handleAddToShoppingList = (userRecipe: any) => {
    const recipe = userRecipeToRecipe(userRecipe);
    addRecipeToShoppingList(recipe);
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-savor-charcoal'>
          <ChefHat className='h-6 w-6 text-savor-saffron' />
          My Recipes
        </h2>
        <p className='text-muted-foreground'>
          {userRecipes.length} recipe{userRecipes.length !== 1 ? 's' : ''} created by you
        </p>
      </div>

      {userRecipes.length === 0 ? (
        <Card className='py-12 text-center'>
          <CardContent>
            <ChefHat className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
            <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>No Recipes Yet</h3>
            <p className='mb-6 text-muted-foreground'>
              Start building your personal recipe collection by adding your first recipe.
            </p>
            <Button onClick={onAddNewRecipe}>
              <Plus className='mr-2 h-4 w-4' />
              Add Your First Recipe
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Filter className='h-5 w-5 text-savor-saffron' />
                  Filter My Recipes
                </div>
                <Button onClick={onAddNewRecipe}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Recipe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* Search */}
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
                  <Input
                    placeholder='Search your recipes...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-10'
                  />
                  {searchQuery && (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0'
                      onClick={() => setSearchQuery('')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>

                {/* Filters */}
                <div className='flex flex-col gap-4 sm:flex-row'>
                  {/* Category Filter */}
                  <div className='flex-1'>
                    <label className='mb-2 block text-sm font-medium text-savor-charcoal'>
                      Category
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          className='cursor-pointer'
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category === 'all'
                            ? 'All Categories'
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div className='flex-1'>
                    <label className='mb-2 block text-sm font-medium text-savor-charcoal'>
                      Difficulty
                    </label>
                    <div className='flex flex-wrap gap-2'>
                      {difficulties.map((difficulty) => (
                        <Badge
                          key={difficulty}
                          variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                          className='cursor-pointer'
                          onClick={() => setSelectedDifficulty(difficulty)}
                        >
                          {difficulty === 'all'
                            ? 'All Levels'
                            : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className='flex items-center gap-2 border-t pt-2'>
                    <span className='text-sm text-muted-foreground'>Active filters:</span>
                    {searchQuery && (
                      <Badge variant='secondary' className='flex items-center gap-1'>
                        Search: "{searchQuery}"
                        <X className='h-3 w-3 cursor-pointer' onClick={() => setSearchQuery('')} />
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && (
                      <Badge variant='secondary' className='flex items-center gap-1'>
                        {selectedCategory}
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() => setSelectedCategory('all')}
                        />
                      </Badge>
                    )}
                    {selectedDifficulty !== 'all' && (
                      <Badge variant='secondary' className='flex items-center gap-1'>
                        {selectedDifficulty}
                        <X
                          className='h-3 w-3 cursor-pointer'
                          onClick={() => setSelectedDifficulty('all')}
                        />
                      </Badge>
                    )}
                    <Button variant='ghost' size='sm' onClick={clearFilters}>
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredRecipes.length === 0 ? (
            <Card className='py-12 text-center'>
              <CardContent>
                <Search className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                  No Matching Recipes
                </h3>
                <p className='mb-6 text-muted-foreground'>
                  No recipes match your current search and filter criteria.
                </p>
                <Button variant='outline' onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                  Showing {filteredRecipes.length} of {userRecipes.length} recipe
                  {userRecipes.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Recipe Grid */}
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredRecipes.map((recipe, index) => {
                  const originalRecipe = userRecipes[index];
                  return (
                    <div key={recipe.slug} className='group relative'>
                      <RecipeCard recipe={recipe} showFavorite={false} className='h-full' />

                      {/* Recipe Actions Overlay */}
                      <div className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100'>
                        <div className='flex gap-1'>
                          <Button
                            size='sm'
                            variant='secondary'
                            className='h-8 w-8 p-0'
                            onClick={() => (window.location.href = `/recipe/${recipe.slug}`)}
                            title='View Recipe'
                          >
                            <Eye className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='secondary'
                            className='h-8 w-8 p-0'
                            onClick={() => handleAddToShoppingList(originalRecipe)}
                            title='Add to Shopping List'
                          >
                            <ShoppingCart className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='secondary'
                            className='h-8 w-8 p-0'
                            onClick={() => onRecipeEdit?.(originalRecipe)}
                            title='Edit Recipe'
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            size='sm'
                            variant='destructive'
                            className='h-8 w-8 p-0'
                            onClick={() => onRecipeDelete?.(originalRecipe.id)}
                            title='Delete Recipe'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
