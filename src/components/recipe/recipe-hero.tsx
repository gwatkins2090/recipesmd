'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  Users,
  ChefHat,
  Star,
  Heart,
  Share2,
  Printer,
  ArrowLeft,
  BookOpen,
  ShoppingCart,
} from 'lucide-react';
import { Recipe } from '@/types';
import { addRecipeToShoppingList } from '@/lib/recipe-utils';
import { cn } from '@/lib/utils';

interface RecipeHeroProps {
  recipe: Recipe;
}

export function RecipeHero({ recipe }: RecipeHeroProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Save to localStorage
    const favorites = JSON.parse(localStorage.getItem('savor-favorites') || '[]');
    if (isFavorited) {
      const newFavorites = favorites.filter((slug: string) => slug !== recipe.slug);
      localStorage.setItem('savor-favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(recipe.slug);
      localStorage.setItem('savor-favorites', JSON.stringify(favorites));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.meta.title,
          text: recipe.meta.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    // Redirect to cookbook print section
    window.location.href = '/cookbook?tab=print';
  };

  const handleAddToShoppingList = () => {
    addRecipeToShoppingList(recipe);
  };

  return (
    <section className='relative'>
      {/* Back navigation */}
      <div className='container pt-4'>
        <Button variant='ghost' asChild className='mb-4'>
          <Link href={`/categories/${recipe.meta.category}`}>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to {recipe.meta.category} recipes
          </Link>
        </Button>
      </div>

      <div className='container pb-8'>
        <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
          {/* Recipe image */}
          <div className='relative'>
            <div className='aspect-[4/3] overflow-hidden rounded-2xl'>
              {recipe.meta.image ? (
                <Image
                  src={recipe.meta.image}
                  alt={recipe.meta.imageAlt || recipe.meta.title}
                  fill
                  className='object-cover'
                  priority
                  sizes='(max-width: 768px) 100vw, 50vw'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-savor-sage/20 to-savor-saffron/20'>
                  <span className='text-8xl'>🍽️</span>
                </div>
              )}
            </div>

            {/* Action buttons overlay */}
            <div className='absolute right-4 top-4 flex space-x-2'>
              <Button
                variant='secondary'
                size='sm'
                className='h-10 w-10 rounded-full bg-white/90 p-0 backdrop-blur-sm'
                onClick={handleFavorite}
              >
                <Heart
                  className={cn(
                    'h-4 w-4',
                    isFavorited ? 'fill-savor-paprika text-savor-paprika' : 'text-gray-600'
                  )}
                />
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='h-10 w-10 rounded-full bg-white/90 p-0 backdrop-blur-sm'
                onClick={handleShare}
              >
                <Share2 className='h-4 w-4' />
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='h-10 w-10 rounded-full bg-white/90 p-0 backdrop-blur-sm'
                onClick={handlePrint}
              >
                <Printer className='h-4 w-4' />
              </Button>
              <Button
                variant='secondary'
                size='sm'
                className='h-10 w-10 rounded-full bg-white/90 p-0 backdrop-blur-sm'
                onClick={handleAddToShoppingList}
                title='Add to Shopping List'
              >
                <ShoppingCart className='h-4 w-4' />
              </Button>
            </div>
          </div>

          {/* Recipe details */}
          <div className='space-y-6'>
            {/* Category and difficulty */}
            <div className='flex items-center space-x-3'>
              <Badge variant='secondary' className='bg-savor-mint/20 text-savor-sage'>
                {recipe.meta.category}
              </Badge>
              <Badge
                variant='outline'
                className={cn(
                  recipe.meta.difficulty === 'Easy' && 'border-green-500 text-green-700',
                  recipe.meta.difficulty === 'Medium' && 'border-savor-saffron text-savor-saffron',
                  recipe.meta.difficulty === 'Hard' && 'border-savor-paprika text-savor-paprika'
                )}
              >
                {recipe.meta.difficulty}
              </Badge>
            </div>

            {/* Title and description */}
            <div>
              <h1 className='mb-4 font-heading text-4xl font-bold text-savor-charcoal lg:text-5xl'>
                {recipe.meta.title}
              </h1>
              <p className='text-lg leading-relaxed text-muted-foreground'>
                {recipe.meta.description}
              </p>
            </div>

            {/* Author and rating */}
            <div className='flex items-center justify-between'>
              <div>
                {recipe.meta.author && (
                  <p className='text-sm text-muted-foreground'>
                    Recipe by{' '}
                    <span className='font-medium text-savor-charcoal'>{recipe.meta.author}</span>
                  </p>
                )}
              </div>

              {recipe.meta.rating && (
                <div className='flex items-center space-x-1'>
                  <Star className='h-4 w-4 fill-savor-saffron text-savor-saffron' />
                  <span className='font-medium'>{recipe.meta.rating}</span>
                  {recipe.meta.reviewCount && (
                    <span className='text-sm text-muted-foreground'>
                      ({recipe.meta.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Recipe stats */}
            <div className='grid grid-cols-3 gap-4'>
              <Card>
                <CardContent className='flex items-center space-x-3 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-savor-saffron/20'>
                    <Clock className='h-5 w-5 text-savor-saffron' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Total Time</p>
                    <p className='text-xs text-muted-foreground'>{recipe.meta.times.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='flex items-center space-x-3 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-savor-sage/20'>
                    <Users className='h-5 w-5 text-savor-sage' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Servings</p>
                    <p className='text-xs text-muted-foreground'>{recipe.meta.servings}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='flex items-center space-x-3 p-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-savor-paprika/20'>
                    <ChefHat className='h-5 w-5 text-savor-paprika' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Prep Time</p>
                    <p className='text-xs text-muted-foreground'>{recipe.meta.times.prep}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tags */}
            {recipe.meta.tags.length > 0 && (
              <div>
                <p className='mb-2 text-sm font-medium text-savor-charcoal'>Tags:</p>
                <div className='flex flex-wrap gap-2'>
                  {recipe.meta.tags.map((tag) => (
                    <Badge key={tag} variant='secondary' className='text-xs'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Cookbook Actions */}
            <div className='border-t pt-6'>
              <p className='mb-3 text-sm font-medium text-savor-charcoal'>Add to Cookbook:</p>
              <div className='flex flex-wrap gap-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => (window.location.href = '/cookbook?tab=favorites')}
                  className='flex items-center gap-2'
                >
                  <BookOpen className='h-4 w-4' />
                  View in Cookbook
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleAddToShoppingList}
                  className='flex items-center gap-2'
                >
                  <ShoppingCart className='h-4 w-4' />
                  Add to Shopping List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
