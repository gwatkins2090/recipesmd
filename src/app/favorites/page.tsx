'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { SearchBar } from '@/components/ui/search-bar';
import { Heart, BookOpen } from 'lucide-react';
import { Recipe } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load recipes and favorites on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all recipes
        const response = await fetch('/api/recipes');
        const recipes = response.ok ? await response.json() : [];
        setAllRecipes(recipes);

        // Load favorites from localStorage
        if (typeof window !== 'undefined') {
          const savedFavorites = localStorage.getItem('savor-favorites');
          if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter recipes to only show favorites
  const favoriteRecipes = useMemo(() => {
    return allRecipes.filter(recipe => favorites.has(recipe.slug));
  }, [allRecipes, favorites]);

  // Filter by search query
  const filteredRecipes = useMemo(() => {
    if (!searchQuery.trim()) {
      return favoriteRecipes;
    }

    const query = searchQuery.toLowerCase();
    return favoriteRecipes.filter(recipe => {
      return (
        recipe.meta.title.toLowerCase().includes(query) ||
        recipe.meta.description.toLowerCase().includes(query) ||
        recipe.meta.category.toLowerCase().includes(query) ||
        recipe.meta.tags.some(tag => tag.toLowerCase().includes(query))
      );
    });
  }, [favoriteRecipes, searchQuery]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <main className='container py-12'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
            <p className='text-muted-foreground'>Loading your favorites...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-16 lg:py-24'>
          <div className='container'>
            <div className='text-center'>
              <div className='mb-6 flex justify-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-paprika to-savor-saffron shadow-xl'>
                  <Heart className='h-8 w-8 text-white' fill='white' />
                </div>
              </div>

              <h1 className='mb-4 font-heading text-4xl font-bold text-savor-charcoal dark:text-savor-cream sm:text-5xl lg:text-6xl'>
                My Favorite Recipes
              </h1>

              <p className='mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80 dark:text-savor-cream/80 sm:text-xl'>
                {favoriteRecipes.length > 0
                  ? `You have ${favoriteRecipes.length} favorite ${favoriteRecipes.length === 1 ? 'recipe' : 'recipes'} saved. Your personal collection of delicious dishes!`
                  : 'Start building your collection of favorite recipes'}
              </p>

              {/* Search bar - only show if there are favorites */}
              {favoriteRecipes.length > 0 && (
                <div className='mx-auto max-w-2xl'>
                  <SearchBar
                    placeholder='Search your favorites...'
                    size='lg'
                    value={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        <section className='py-8 lg:py-12'>
          <div className='container'>
            {favoriteRecipes.length === 0 ? (
              // Empty State
              <div className='mx-auto max-w-2xl text-center'>
                <div className='rounded-lg border-2 border-dashed border-savor-sage/30 bg-savor-cream/50 p-12 dark:bg-savor-charcoal/50'>
                  <Heart className='mx-auto mb-6 h-20 w-20 text-savor-sage/40' />
                  <h2 className='mb-4 text-2xl font-bold text-savor-charcoal dark:text-savor-cream'>
                    No Favorites Yet
                  </h2>
                  <p className='mb-8 text-lg text-savor-charcoal/70 dark:text-savor-cream/70'>
                    You haven't added any favorites yet. Browse recipes and click the heart icon to
                    save your favorites!
                  </p>
                  <Link href='/recipes'>
                    <Button size='lg' className='bg-savor-saffron hover:bg-savor-paprika'>
                      <BookOpen className='mr-2 h-5 w-5' />
                      Browse Recipes
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Recipe Grid
              <div>
                {searchQuery && filteredRecipes.length === 0 ? (
                  // No search results
                  <div className='mx-auto max-w-2xl text-center'>
                    <div className='rounded-lg border border-savor-sage/30 bg-savor-cream/50 p-12 dark:bg-savor-charcoal/50'>
                      <p className='mb-4 text-lg text-savor-charcoal/70 dark:text-savor-cream/70'>
                        No favorites match your search for "{searchQuery}"
                      </p>
                      <Button
                        variant='outline'
                        onClick={() => setSearchQuery('')}
                        className='border-savor-sage text-savor-sage hover:bg-savor-sage/10'
                      >
                        Clear Search
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Results count */}
                    {searchQuery && (
                      <div className='mb-6 text-center'>
                        <p className='text-sm text-muted-foreground'>
                          Showing {filteredRecipes.length} of {favoriteRecipes.length} favorites
                        </p>
                      </div>
                    )}
                    <RecipeGrid recipes={filteredRecipes} />
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

