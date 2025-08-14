'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/ui/recipe-card';
import { ArrowRight, Sparkles } from 'lucide-react';
import { RecipeCard as RecipeCardType } from '@/types';

// Mock featured recipes data - in a real app, this would come from an API
const mockFeaturedRecipes: RecipeCardType[] = [
  {
    slug: 'grandmas-pancakes',
    title: "Grandma's Fluffy Buttermilk Pancakes",
    description:
      'Light, fluffy pancakes that melt in your mouth - a family recipe passed down through generations',
    category: 'breakfast',
    difficulty: 'Easy',
    totalTime: '25 min',
    servings: 4,
    image: '/images/recipes/placeholder.svg',
    imageAlt: 'Stack of golden fluffy pancakes with butter and syrup',
    tags: ['pancakes', 'breakfast', 'family-recipe'],
    rating: 4.9,
    reviewCount: 127,
  },
  {
    slug: 'classic-spaghetti-carbonara',
    title: 'Classic Spaghetti Carbonara',
    description:
      'Authentic Roman carbonara with eggs, cheese, pancetta, and black pepper - no cream needed!',
    category: 'italian',
    difficulty: 'Medium',
    totalTime: '25 min',
    servings: 4,
    image: '/images/recipes/placeholder.svg',
    imageAlt: 'Creamy spaghetti carbonara with crispy pancetta and black pepper',
    tags: ['pasta', 'carbonara', 'italian'],
    rating: 4.8,
    reviewCount: 156,
  },
  {
    slug: 'chocolate-chip-cookies',
    title: 'Perfect Chocolate Chip Cookies',
    description:
      'Crispy edges, chewy centers, and loaded with chocolate chips - the ultimate comfort cookie',
    category: 'desert',
    difficulty: 'Easy',
    totalTime: '27 min',
    servings: 24,
    image: '/images/recipes/placeholder.svg',
    imageAlt: 'Golden brown chocolate chip cookies on a cooling rack',
    tags: ['cookies', 'chocolate-chip', 'dessert'],
    rating: 4.9,
    reviewCount: 342,
  },
  {
    slug: 'chicken-tacos-al-pastor',
    title: 'Chicken Tacos Al Pastor',
    description: 'Marinated chicken with pineapple, onions, and cilantro in warm corn tortillas',
    category: 'mexican',
    difficulty: 'Medium',
    totalTime: '35 min',
    servings: 6,
    image: '/images/recipes/placeholder.svg',
    imageAlt: 'Colorful chicken tacos with pineapple and cilantro',
    tags: ['tacos', 'mexican', 'chicken'],
    rating: 4.7,
    reviewCount: 134,
  },
];

export function FeaturedRecipes() {
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeCardType[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    // In a real app, fetch featured recipes from API
    setFeaturedRecipes(mockFeaturedRecipes);

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('savor-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  const handleFavoriteClick = (slug: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(slug)) {
      newFavorites.delete(slug);
    } else {
      newFavorites.add(slug);
    }
    setFavorites(newFavorites);
    localStorage.setItem('savor-favorites', JSON.stringify(Array.from(newFavorites)));
  };

  return (
    <section className='py-16 lg:py-24'>
      <div className='container'>
        {/* Section header */}
        <div className='mb-12 text-center'>
          <div className='mb-4 flex justify-center'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron/20 to-savor-paprika/20'>
              <Sparkles className='h-6 w-6 text-savor-saffron' />
            </div>
          </div>

          <h2 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
            Featured Recipes
          </h2>

          <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
            Handpicked recipes that our community loves most. These dishes have been tested,
            perfected, and approved by home cooks everywhere.
          </p>
        </div>

        {/* Recipe grid */}
        <div className='mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.slug}
              recipe={recipe}
              showFavorite={false}
              className='h-full'
            />
          ))}
        </div>

        {/* View all button */}
        <div className='text-center'>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='border-savor-sage text-savor-sage hover:bg-savor-sage hover:text-white'
          >
            <Link href='/recipes' className='inline-flex items-center'>
              View All Recipes
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
