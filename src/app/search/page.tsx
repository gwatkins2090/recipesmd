'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchResults } from '@/components/search/search-results';
import { SearchBar } from '@/components/ui/search-bar';
import { Recipe, RecipeSearchFilters } from '@/types';
import { filterRecipes } from '@/lib/recipe-utils';
import { Search } from 'lucide-react';

// Mock data - in a real app, this would come from an API
const mockRecipes: Recipe[] = [
  // This would be populated with actual recipe data
  // For now, we'll use empty array and show a message
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<RecipeSearchFilters>({
    query: initialQuery,
    difficulty: [],
    maxTime: undefined,
    tags: [],
    cuisine: [],
    category: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes on mount
  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/recipes');
        // const data = await response.json();
        // setRecipes(data);

        // For now, use mock data
        setRecipes(mockRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter recipes based on search query and filters
  const filteredRecipes = useMemo(() => {
    const currentFilters = {
      ...filters,
      query: searchQuery,
    };
    return filterRecipes(recipes, currentFilters);
  }, [recipes, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL without page reload
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleFiltersChange = (newFilters: Partial<RecipeSearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      query: '',
      difficulty: [],
      maxTime: undefined,
      tags: [],
      cuisine: [],
      category: undefined,
    });
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        {/* Search Hero */}
        <section className='bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-12 lg:py-16'>
          <div className='container'>
            <div className='text-center'>
              <div className='mb-6 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
                  <Search className='h-6 w-6 text-white' />
                </div>
              </div>

              <h1 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal dark:text-savor-cream sm:text-4xl'>
                Search Recipes
              </h1>

              <p className='mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80 dark:text-savor-cream/80'>
                Find the perfect recipe for any occasion. Search by ingredients, cuisine, or dish
                name.
              </p>

              {/* Search bar */}
              <div className='mx-auto max-w-2xl'>
                <SearchBar
                  placeholder='Search recipes, ingredients, or cuisines...'
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={handleSearch}
                  onClear={clearSearch}
                  size='lg'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className='py-8 lg:py-12'>
          <div className='container'>
            {isLoading ? (
              <div className='py-12 text-center'>
                <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
                <p className='text-muted-foreground'>Loading recipes...</p>
              </div>
            ) : (
              <div className='grid gap-8 lg:grid-cols-4'>
                {/* Filters Sidebar */}
                <div className='lg:col-span-1'>
                  <SearchFilters
                    recipes={recipes}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </div>

                {/* Results */}
                <div className='lg:col-span-3'>
                  <SearchResults
                    recipes={filteredRecipes}
                    searchQuery={searchQuery}
                    totalRecipes={recipes.length}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-background'>
          <Header />
          <main className='container py-8'>
            <div className='text-center'>Loading search...</div>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
