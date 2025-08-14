'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FamilyRecipesHero } from '@/components/family-recipes/family-recipes-hero';
import { FamilyRecipesGrid } from '@/components/family-recipes/family-recipes-grid';
import { FamilyRecipesFilters } from '@/components/family-recipes/family-recipes-filters';

export default function FamilyRecipesPage() {
  const [filters, setFilters] = useState({
    search: '',
    generation: 'all',
    mealType: 'all',
    difficulty: 'all',
  });

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <FamilyRecipesHero />
        <FamilyRecipesFilters onFiltersChange={handleFiltersChange} />
        <FamilyRecipesGrid
          searchQuery={filters.search}
          selectedGeneration={filters.generation}
          selectedMealType={filters.mealType}
          selectedDifficulty={filters.difficulty}
        />
      </main>
      <Footer />
    </div>
  );
}
