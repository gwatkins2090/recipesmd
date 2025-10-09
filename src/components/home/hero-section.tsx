import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, Star, Users } from 'lucide-react';

export function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-20 lg:py-32'>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/images/food-pattern.svg')] opacity-5"></div>

      <div className='container relative'>
        <div className='mx-auto max-w-4xl text-center'>
          {/* Hero content */}
          <div className='mb-8 flex justify-center'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-xl'>
              <ChefHat className='h-10 w-10 text-white' />
            </div>
          </div>

          <h1 className='mb-6 font-heading text-4xl font-bold tracking-tight text-savor-charcoal dark:text-savor-cream sm:text-5xl lg:text-6xl'>
            Every Recipe Tells a{' '}
            <span className='bg-gradient-to-r from-savor-saffron to-savor-paprika bg-clip-text text-transparent'>
              Story
            </span>
          </h1>

          <p className='mb-8 text-lg text-savor-charcoal/80 dark:text-savor-cream/80 sm:text-xl lg:text-2xl'>
            Discover, save, and share recipes that bring families together. From traditional
            comfort foods to modern culinary adventures.
          </p>

          {/* Search placeholder */}
          <div className='mb-12'>
            <p className='text-center text-muted-foreground'>
              Search functionality coming soon...
            </p>
          </div>

          {/* CTA buttons */}
          <div className='mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <Button
              asChild
              size='lg'
              className='bg-savor-saffron font-semibold text-savor-charcoal hover:bg-savor-saffron/90'
            >
              <Link href='/recipes'>Explore Recipes</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='lg'
              className='border-savor-sage text-savor-sage hover:bg-savor-sage hover:text-white'
            >
              <Link href='/categories'>Browse Categories</Link>
            </Button>
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-8 sm:grid-cols-4'>
            <div className='text-center'>
              <div className='mb-2 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-savor-saffron/20'>
                  <ChefHat className='h-6 w-6 text-savor-saffron' />
                </div>
              </div>
              <div className='text-2xl font-bold text-foreground'>500+</div>
              <div className='text-sm text-muted-foreground'>Recipes</div>
            </div>

            <div className='text-center'>
              <div className='mb-2 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-savor-sage/20'>
                  <Users className='h-6 w-6 text-savor-sage' />
                </div>
              </div>
              <div className='text-2xl font-bold text-foreground'>10K+</div>
              <div className='text-sm text-muted-foreground'>Home Cooks</div>
            </div>

            <div className='text-center'>
              <div className='mb-2 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-savor-paprika/20'>
                  <Heart className='h-6 w-6 text-savor-paprika' />
                </div>
              </div>
              <div className='text-2xl font-bold text-foreground'>50K+</div>
              <div className='text-sm text-muted-foreground'>Favorites</div>
            </div>

            <div className='text-center'>
              <div className='mb-2 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-savor-mint/40'>
                  <Star className='h-6 w-6 text-savor-sage' />
                </div>
              </div>
              <div className='text-2xl font-bold text-foreground'>4.9</div>
              <div className='text-sm text-muted-foreground'>Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className='absolute left-10 top-20 hidden lg:block'>
        <div className='animate-bounce text-4xl'>🥘</div>
      </div>
      <div className='absolute right-10 top-32 hidden lg:block'>
        <div className='animate-bounce text-4xl' style={{ animationDelay: '1s' }}>
          🍳
        </div>
      </div>
      <div className='absolute bottom-20 left-20 hidden lg:block'>
        <div className='animate-bounce text-4xl' style={{ animationDelay: '2s' }}>
          🥗
        </div>
      </div>
      <div className='absolute bottom-32 right-20 hidden lg:block'>
        <div className='animate-bounce text-4xl' style={{ animationDelay: '0.5s' }}>
          🍰
        </div>
      </div>
    </section>
  );
}
