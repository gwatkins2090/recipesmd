'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/layout/theme-toggle';
import { Menu, X, ChefHat, Search, Heart, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
            <ChefHat className='h-6 w-6 text-white' />
          </div>
          <div className='flex flex-col'>
            <span className='font-heading text-2xl font-bold text-savor-charcoal dark:text-savor-cream'>
              Savor
            </span>
            <span className='-mt-1 hidden text-xs text-savor-charcoal/70 dark:text-savor-cream/70 sm:block'>
              Every recipe tells a story
            </span>
          </div>
        </Link>

        <nav className='hidden items-center space-x-6 md:flex'>
          <Link
            href='/recipes'
            className='text-sm font-medium transition-colors hover:text-savor-saffron'
          >
            Recipes
          </Link>
          <Link
            href='/categories'
            className='text-sm font-medium transition-colors hover:text-savor-saffron'
          >
            Categories
          </Link>
          <Link
            href='/about'
            className='text-sm font-medium transition-colors hover:text-savor-saffron'
          >
            About
          </Link>
          <Link
            href='/search'
            className='text-sm font-medium transition-colors hover:text-savor-saffron'
          >
            <Search className='h-4 w-4' />
          </Link>
        </nav>

        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='sm' className='hidden md:flex'>
            <Heart className='mr-2 h-4 w-4' />
            Favorites
          </Button>
          <ThemeToggle />
          <Button
            variant='ghost'
            size='sm'
            className='md:hidden'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className='border-t bg-background/95 backdrop-blur md:hidden'>
          <div className='container space-y-3 py-4'>
            <Link
              href='/recipes'
              className='block text-sm font-medium transition-colors hover:text-savor-saffron'
              onClick={() => setIsMenuOpen(false)}
            >
              Recipes
            </Link>
            <Link
              href='/categories'
              className='block text-sm font-medium transition-colors hover:text-savor-saffron'
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href='/about'
              className='block text-sm font-medium transition-colors hover:text-savor-saffron'
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href='/search'
              className='flex items-center text-sm font-medium transition-colors hover:text-savor-saffron'
              onClick={() => setIsMenuOpen(false)}
            >
              <Search className='mr-2 h-4 w-4' />
              Search
            </Link>
            <Link
              href='/favorites'
              className='flex items-center text-sm font-medium transition-colors hover:text-savor-saffron'
              onClick={() => setIsMenuOpen(false)}
            >
              <Heart className='mr-2 h-4 w-4' />
              Favorites
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
