'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { RecipeFilters } from '@/components/recipes/recipe-filters';
import { SearchBar } from '@/components/ui/search-bar';
import { ChefHat } from 'lucide-react';
import { Recipe } from '@/types';

// This component needs to be client-side to handle filtering
export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulties: [] as string[],
    tags: [] as string[],
    generations: [] as string[],
    maxTime: 120
  });

  // Load recipes on mount
  useState(() => {
    const loadRecipes = async () => {
      try {
        // Load all recipes (now includes family recipes via markdown parser)
        const response = await fetch('/api/recipes');
        const allRecipes = response.ok ? await response.json() : [];
        setRecipes(allRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  });

  // Filter recipes based on selected filters
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Difficulty filter
      if (filters.difficulties.length > 0 && !filters.difficulties.includes(recipe.meta.difficulty)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => recipe.meta.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Generation filter
      if (filters.generations.length > 0) {
        const hasMatchingGeneration = filters.generations.some(gen => recipe.meta.tags.includes(gen));
        if (!hasMatchingGeneration) return false;
      }

      // Time filter
      if (filters.maxTime < 120) {
        const totalMinutes = parseInt(recipe.meta.times.total.replace(/\D/g, '')) || 0;
        if (totalMinutes > filters.maxTime) return false;
      }

      return true;
    });
  }, [recipes, filters]);

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <main className='container py-12'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
            <p className='text-muted-foreground'>Loading recipes...</p>
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
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-xl'>
                  <ChefHat className='h-8 w-8 text-white' />
                </div>
              </div>

              <h1 className='mb-4 font-heading text-4xl font-bold text-savor-charcoal dark:text-savor-cream sm:text-5xl lg:text-6xl'>
                All Recipes
              </h1>

              <p className='mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80 dark:text-savor-cream/80 sm:text-xl'>
                Explore our complete collection of {recipes.length} delicious recipes. From quick
                weeknight dinners to special occasion treats.
              </p>

              {/* Search bar */}
              <div className='mx-auto max-w-2xl'>
                <SearchBar placeholder='Search recipes, ingredients, or cuisines...' size='lg' />
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Section */}
        <section className='py-8 lg:py-12'>
          <div className='container'>
            <div className='grid gap-8 lg:grid-cols-4'>
              {/* Filters Sidebar */}
              <div className='lg:col-span-1'>
                <RecipeFilters recipes={recipes} onFiltersChange={handleFiltersChange} />
              </div>

              {/* Recipe Grid */}
              <div className='lg:col-span-3'>
                <RecipeGrid recipes={filteredRecipes} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
