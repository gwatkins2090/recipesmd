'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Heart, Search, Filter, X, BookOpen } from 'lucide-react';
import { Recipe, RecipeCard as RecipeCardType } from '@/types';

interface FavoritesSectionProps {
  favorites: string[];
  onFavoritesChange: (favorites: string[]) => void;
}

export function FavoritesSection({ favorites, onFavoritesChange }: FavoritesSectionProps) {
  const [favoriteRecipes, setFavoriteRecipes] = useState<RecipeCardType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load favorite recipes from localStorage
  useEffect(() => {
    const loadFavoriteRecipes = () => {
      try {
        // For now, we'll create mock data for favorites
        // In a real app, you'd fetch this from an API or have it passed as props
        const mockFavoriteRecipes: RecipeCardType[] = favorites.map((slug, index) => ({
          slug,
          title: `Favorite Recipe ${index + 1}`,
          description: 'A delicious recipe saved to your favorites',
          category: ['breakfast', 'italian', 'dessert', 'mexican'][index % 4],
          difficulty: ['Easy', 'Medium', 'Hard'][index % 3] as 'Easy' | 'Medium' | 'Hard',
          totalTime: '30 min',
          servings: 4,
          image: '/images/recipes/placeholder.svg',
          imageAlt: `Recipe ${index + 1} image`,
          tags: ['favorite', 'delicious'],
          rating: 4.5,
          reviewCount: 10,
        }));

        setFavoriteRecipes(mockFavoriteRecipes);
      } catch (error) {
        console.error('Error loading favorite recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteRecipes();
  }, [favorites]);

  const handleRemoveFavorite = (slug: string) => {
    const updatedFavorites = favorites.filter((fav) => fav !== slug);
    onFavoritesChange(updatedFavorites);
    localStorage.setItem('savor-favorites', JSON.stringify(updatedFavorites));

    // Update local state
    setFavoriteRecipes((prev) => prev.filter((recipe) => recipe.slug !== slug));
  };

  // Filter recipes based on search and category
  const filteredRecipes = favoriteRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from favorite recipes
  const categories = ['all', ...new Set(favoriteRecipes.map((recipe) => recipe.category))];

  if (isLoading) {
    return (
      <div className='py-12 text-center'>
        <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
        <p className='text-muted-foreground'>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-savor-charcoal'>
          <Heart className='h-6 w-6 text-red-500' />
          Your Favorite Recipes
        </h2>
        <p className='text-muted-foreground'>
          {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? 's' : ''} saved to your
          favorites
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <Card className='py-12 text-center'>
          <CardContent>
            <Heart className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
            <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>No Favorites Yet</h3>
            <p className='mb-6 text-muted-foreground'>
              Start exploring recipes and click the heart icon to save your favorites here.
            </p>
            <Button onClick={() => (window.location.href = '/recipes')}>
              <BookOpen className='mr-2 h-4 w-4' />
              Browse Recipes
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Filter className='h-5 w-5 text-savor-saffron' />
                Filter Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col gap-4 sm:flex-row'>
                {/* Search */}
                <div className='flex-1'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
                    <Input
                      placeholder='Search your favorites...'
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
                </div>

                {/* Category Filter */}
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

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== 'all') && (
                <div className='mt-4 flex items-center gap-2'>
                  <span className='text-sm text-muted-foreground'>Active filters:</span>
                  {searchQuery && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      Search: "{searchQuery}"
                      <X className='h-3 w-3 cursor-pointer' onClick={() => setSearchQuery('')} />
                    </Badge>
                  )}
                  {selectedCategory !== 'all' && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      Category: {selectedCategory}
                      <X
                        className='h-3 w-3 cursor-pointer'
                        onClick={() => setSelectedCategory('all')}
                      />
                    </Badge>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {filteredRecipes.length === 0 ? (
            <Card className='py-12 text-center'>
              <CardContent>
                <Search className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                  No Matching Favorites
                </h3>
                <p className='mb-6 text-muted-foreground'>
                  No favorites match your current search and filter criteria.
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Results Count */}
              <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground'>
                  Showing {filteredRecipes.length} of {favoriteRecipes.length} favorite
                  {favoriteRecipes.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Recipe Grid */}
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.slug}
                    recipe={recipe}
                    showFavorite={true}
                    isFavorited={true}
                    onFavoriteClick={() => handleRemoveFavorite(recipe.slug)}
                    className='h-full'
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
