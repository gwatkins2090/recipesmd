'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from '@/components/ui/recipe-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Heart, ShoppingCart, Plus } from 'lucide-react';
import { RecipeCard as RecipeCardType, Recipe } from '@/types';

interface FamilyRecipesGridProps {
  searchQuery?: string;
  selectedGeneration?: string;
  selectedMealType?: string;
  selectedDifficulty?: string;
}

export function FamilyRecipesGrid({
  searchQuery = '',
  selectedGeneration = 'all',
  selectedMealType = 'all',
  selectedDifficulty = 'all',
}: FamilyRecipesGridProps = {}) {
  const [recipes, setRecipes] = useState<RecipeCardType[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load family recipes and favorites
  useEffect(() => {
    const loadFamilyRecipes = async () => {
      try {
        setIsLoading(true);

        // Load family recipes from API
        const response = await fetch('/api/family-recipes');
        if (response.ok) {
          const familyRecipes: Recipe[] = await response.json();
          const recipeCards = familyRecipes.map((recipe) => ({
            slug: recipe.slug,
            title: recipe.meta.title,
            description: recipe.meta.description,
            category: recipe.meta.category,
            difficulty: recipe.meta.difficulty,
            totalTime: recipe.meta.times.total,
            servings: recipe.meta.servings,
            image: recipe.meta.image,
            imageAlt: recipe.meta.imageAlt,
            tags: recipe.meta.tags,
            rating: recipe.meta.rating || 5.0,
            reviewCount: recipe.meta.reviewCount || 1,
          }));
          setRecipes(recipeCards);
        }

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('savor-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading family recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFamilyRecipes();
  }, []);

  const handleFavoriteClick = (slug: string) => {
    const updatedFavorites = favorites.includes(slug)
      ? favorites.filter((fav) => fav !== slug)
      : [...favorites, slug];

    setFavorites(updatedFavorites);
    localStorage.setItem('savor-favorites', JSON.stringify(updatedFavorites));
  };

  // Filter recipes based on search and filter criteria
  const filteredRecipes = recipes.filter((recipe) => {
    // Search filter
    const matchesSearch =
      !searchQuery ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Generation filter (based on tags or recipe characteristics)
    const matchesGeneration =
      selectedGeneration === 'all' ||
      (selectedGeneration === 'great-grandma' && recipe.tags.includes('traditional')) ||
      (selectedGeneration === 'grandma' &&
        (recipe.tags.includes('comfort-food') || recipe.category === 'dinner')) ||
      (selectedGeneration === 'mom' &&
        (recipe.tags.includes('quick') || recipe.difficulty === 'Easy')) ||
      (selectedGeneration === 'modern' && recipe.tags.includes('modern'));

    // Meal type filter
    const matchesMealType =
      selectedMealType === 'all' ||
      recipe.category === selectedMealType ||
      (selectedMealType === 'holiday' && recipe.tags.includes('holiday')) ||
      (selectedMealType === 'comfort' && recipe.tags.includes('comfort-food'));

    // Difficulty filter
    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesGeneration && matchesMealType && matchesDifficulty;
  });

  if (isLoading) {
    return (
      <section className='py-12'>
        <div className='container'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
            <p className='text-muted-foreground'>Loading family recipes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='family-recipes-grid' className='py-12'>
      <div className='container'>
        {/* Results Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h2 className='mb-2 text-2xl font-bold text-savor-charcoal'>
              Family Recipe Collection
            </h2>
            <p className='text-muted-foreground'>
              {filteredRecipes.length} of {recipes.length} treasured recipe
              {recipes.length !== 1 ? 's' : ''} from our family kitchen
            </p>
          </div>

          {/* Cookbook Integration */}
          <div className='flex gap-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => (window.location.href = '/cookbook?tab=favorites')}
              className='flex items-center gap-2'
            >
              <BookOpen className='h-4 w-4' />
              <span className='hidden sm:inline'>View in Cookbook</span>
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => (window.location.href = '/shopping-list')}
              className='flex items-center gap-2'
            >
              <ShoppingCart className='h-4 w-4' />
              <span className='hidden sm:inline'>Shopping List</span>
            </Button>
          </div>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length === 0 ? (
          <Card className='py-12 text-center'>
            <CardContent>
              <Heart className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
              <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                {recipes.length === 0 ? 'No Family Recipes Found' : 'No Matching Recipes'}
              </h3>
              <p className='mb-6 text-muted-foreground'>
                {recipes.length === 0
                  ? "We're still collecting and digitizing our family recipes. Check back soon!"
                  : 'No family recipes match your current search and filter criteria.'}
              </p>
              <Button onClick={() => (window.location.href = '/recipes')}>
                <BookOpen className='mr-2 h-4 w-4' />
                Browse All Recipes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.slug}
                recipe={recipe}
                showFavorite={true}
                isFavorited={favorites.includes(recipe.slug)}
                onFavoriteClick={() => handleFavoriteClick(recipe.slug)}
                className='h-full'
              />
            ))}
          </div>
        )}

        {/* Cookbook Call-to-Action */}
        <div className='mt-12'>
          <Card className='border-savor-saffron/20 bg-gradient-to-br from-savor-saffron/10 to-savor-paprika/10'>
            <CardContent className='p-8 text-center'>
              <BookOpen className='mx-auto mb-4 h-12 w-12 text-savor-saffron' />
              <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                Save Your Favorites to Your Cookbook
              </h3>
              <p className='mb-6 text-muted-foreground'>
                Create shopping lists, print kitchen-friendly versions, and organize all your
                favorite family recipes in one place.
              </p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button
                  size='lg'
                  onClick={() => (window.location.href = '/cookbook')}
                  className='bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                >
                  <BookOpen className='mr-2 h-5 w-5' />
                  Open Cookbook
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  onClick={() => (window.location.href = '/cookbook?tab=upload')}
                >
                  <Plus className='mr-2 h-5 w-5' />
                  Add Your Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
