'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, Star, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RecipeCard as RecipeCardType } from '@/types';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: RecipeCardType;
  className?: string;
  showFavorite?: boolean;
  onFavoriteClick?: (slug: string) => void;
  isFavorited?: boolean;
}

export function RecipeCard({
  recipe,
  className,
  showFavorite = true,
  onFavoriteClick,
  isFavorited = false,
}: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteClick?.(recipe.slug);
  };

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-lg', className)}>
      <Link href={`/recipes/${recipe.slug}`}>
        <div className='relative aspect-[4/3] overflow-hidden'>
          {recipe.image ? (
            <Image
              src={recipe.image}
              alt={recipe.imageAlt || recipe.title}
              fill
              className='object-cover transition-transform group-hover:scale-105'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-savor-sage/20 to-savor-saffron/20'>
              <span className='text-4xl'>🍽️</span>
            </div>
          )}

          {showFavorite && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 p-0 backdrop-blur-sm hover:bg-white/90'
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFavorited ? 'fill-savor-paprika text-savor-paprika' : 'text-gray-600'
                )}
              />
            </Button>
          )}

          <div className='absolute bottom-2 left-2'>
            <Badge
              variant='secondary'
              className='bg-white/90 text-savor-charcoal backdrop-blur-sm'
            >
              {recipe.category}
            </Badge>
          </div>
        </div>

        <CardContent className='p-4'>
          <div className='space-y-2'>
            <h3 className='line-clamp-2 font-heading text-lg font-semibold transition-colors group-hover:text-savor-saffron'>
              {recipe.title}
            </h3>

            <p className='line-clamp-2 text-sm text-muted-foreground'>{recipe.description}</p>

            <div className='flex items-center justify-between text-xs text-muted-foreground'>
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-1'>
                  <Clock className='h-3 w-3' />
                  <span>{recipe.totalTime}</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Users className='h-3 w-3' />
                  <span>{recipe.servings}</span>
                </div>
              </div>

              {recipe.rating && (
                <div className='flex items-center space-x-1'>
                  <Star className='h-3 w-3 fill-savor-saffron text-savor-saffron' />
                  <span>{recipe.rating}</span>
                  {recipe.reviewCount && (
                    <span className='text-muted-foreground'>({recipe.reviewCount})</span>
                  )}
                </div>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <Badge
                variant='outline'
                className={cn(
                  'text-xs',
                  recipe.difficulty === 'Easy' && 'border-green-500 text-green-700',
                  recipe.difficulty === 'Medium' && 'border-savor-saffron text-savor-saffron',
                  recipe.difficulty === 'Hard' && 'border-savor-paprika text-savor-paprika'
                )}
              >
                {recipe.difficulty}
              </Badge>

              {recipe.tags.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {recipe.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant='secondary'
                      className='bg-savor-mint/20 text-xs text-savor-sage'
                    >
                      {tag}
                    </Badge>
                  ))}
                  {recipe.tags.length > 2 && (
                    <Badge variant='secondary' className='text-xs'>
                      +{recipe.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
