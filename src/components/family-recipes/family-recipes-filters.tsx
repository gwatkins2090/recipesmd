'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Clock, ChefHat, Heart } from 'lucide-react';

interface FamilyRecipesFiltersProps {
  onFiltersChange?: (filters: {
    search: string;
    generation: string;
    mealType: string;
    difficulty: string;
  }) => void;
}

export function FamilyRecipesFilters({ onFiltersChange }: FamilyRecipesFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Notify parent component of filter changes
  useEffect(() => {
    onFiltersChange?.({
      search: searchQuery,
      generation: selectedGeneration,
      mealType: selectedMealType,
      difficulty: selectedDifficulty,
    });
  }, [searchQuery, selectedGeneration, selectedMealType, selectedDifficulty, onFiltersChange]);

  const generations = [
    { value: 'all', label: 'All Generations' },
    { value: 'great-grandma', label: "Great Grandma's Recipes" },
    { value: 'grandma', label: "Grandma's Recipes" },
    { value: 'mom', label: "Mom's Recipes" },
    { value: 'modern', label: 'Modern Family Additions' },
  ];

  const mealTypes = [
    { value: 'all', label: 'All Meals' },
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'holiday', label: 'Holiday Specials' },
    { value: 'comfort', label: 'Comfort Food' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Challenging' },
  ];

  const handleFilterChange = () => {
    if (onFiltersChange) {
      onFiltersChange({
        search: searchQuery,
        generation: selectedGeneration,
        mealType: selectedMealType,
        difficulty: selectedDifficulty,
      });
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGeneration('all');
    setSelectedMealType('all');
    setSelectedDifficulty('all');
    if (onFiltersChange) {
      onFiltersChange({
        search: '',
        generation: 'all',
        mealType: 'all',
        difficulty: 'all',
      });
    }
  };

  const hasActiveFilters =
    searchQuery ||
    selectedGeneration !== 'all' ||
    selectedMealType !== 'all' ||
    selectedDifficulty !== 'all';

  return (
    <section className='bg-savor-cream/30 py-8'>
      <div className='container'>
        <Card>
          <CardContent className='p-6'>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Filter className='h-5 w-5 text-savor-saffron' />
                <h2 className='text-lg font-semibold text-savor-charcoal'>Find Family Recipes</h2>
              </div>
              {hasActiveFilters && (
                <Button variant='outline' size='sm' onClick={clearFilters}>
                  <X className='mr-2 h-4 w-4' />
                  Clear All
                </Button>
              )}
            </div>

            {/* Search Bar */}
            <div className='mb-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  placeholder='Search family recipes, ingredients, or stories...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
                />
                {searchQuery && (
                  <Button
                    variant='ghost'
                    size='sm'
                    className='absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0'
                    onClick={() => setSearchQuery('')}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Categories */}
            <div className='space-y-6'>
              {/* Generation Filter */}
              <div>
                <h3 className='mb-3 flex items-center gap-2 text-sm font-medium text-savor-charcoal'>
                  <Heart className='h-4 w-4 text-savor-saffron' />
                  Generation
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {generations.map((generation) => (
                    <Badge
                      key={generation.value}
                      variant={selectedGeneration === generation.value ? 'default' : 'outline'}
                      className='cursor-pointer'
                      onClick={() => setSelectedGeneration(generation.value)}
                    >
                      {generation.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Meal Type Filter */}
              <div>
                <h3 className='mb-3 flex items-center gap-2 text-sm font-medium text-savor-charcoal'>
                  <Clock className='h-4 w-4 text-savor-saffron' />
                  Meal Type
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {mealTypes.map((mealType) => (
                    <Badge
                      key={mealType.value}
                      variant={selectedMealType === mealType.value ? 'default' : 'outline'}
                      className='cursor-pointer'
                      onClick={() => setSelectedMealType(mealType.value)}
                    >
                      {mealType.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className='mb-3 flex items-center gap-2 text-sm font-medium text-savor-charcoal'>
                  <ChefHat className='h-4 w-4 text-savor-saffron' />
                  Difficulty
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {difficulties.map((difficulty) => (
                    <Badge
                      key={difficulty.value}
                      variant={selectedDifficulty === difficulty.value ? 'default' : 'outline'}
                      className='cursor-pointer'
                      onClick={() => setSelectedDifficulty(difficulty.value)}
                    >
                      {difficulty.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className='mt-6 border-t pt-4'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>Active filters:</span>
                  {searchQuery && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      Search: "{searchQuery}"
                      <X className='h-3 w-3 cursor-pointer' onClick={() => setSearchQuery('')} />
                    </Badge>
                  )}
                  {selectedGeneration !== 'all' && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      {generations.find((g) => g.value === selectedGeneration)?.label}
                      <X
                        className='h-3 w-3 cursor-pointer'
                        onClick={() => setSelectedGeneration('all')}
                      />
                    </Badge>
                  )}
                  {selectedMealType !== 'all' && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      {mealTypes.find((m) => m.value === selectedMealType)?.label}
                      <X
                        className='h-3 w-3 cursor-pointer'
                        onClick={() => setSelectedMealType('all')}
                      />
                    </Badge>
                  )}
                  {selectedDifficulty !== 'all' && (
                    <Badge variant='secondary' className='flex items-center gap-1'>
                      {difficulties.find((d) => d.value === selectedDifficulty)?.label}
                      <X
                        className='h-3 w-3 cursor-pointer'
                        onClick={() => setSelectedDifficulty('all')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
