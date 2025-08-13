import Link from 'next/link';
import { ChefHat, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container py-12'>
        <div className='grid gap-8 md:grid-cols-4'>
          <div className='space-y-4'>
            <Link href='/' className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
                <ChefHat className='h-6 w-6 text-white' />
              </div>
              <div className='flex flex-col'>
                <span className='font-heading text-xl font-bold text-savor-charcoal dark:text-savor-cream'>
                  Savor
                </span>
                <span className='-mt-1 text-xs text-muted-foreground'>
                  Every recipe tells a story
                </span>
              </div>
            </Link>
            <p className='max-w-xs text-sm text-muted-foreground'>
              Discover, save, and share recipes that bring families together. From traditional
              comfort foods to modern culinary adventures.
            </p>
            <div className='flex space-x-4'>
              <Link
                href='#'
                className='text-muted-foreground transition-colors hover:text-savor-saffron'
              >
                <Instagram className='h-5 w-5' />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground transition-colors hover:text-savor-saffron'
              >
                <Facebook className='h-5 w-5' />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground transition-colors hover:text-savor-saffron'
              >
                <Twitter className='h-5 w-5' />
              </Link>
              <Link
                href='#'
                className='text-muted-foreground transition-colors hover:text-savor-saffron'
              >
                <Youtube className='h-5 w-5' />
              </Link>
            </div>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Recipes</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/categories/breakfast'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Breakfast
                </Link>
              </li>
              <li>
                <Link
                  href='/categories/italian'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Italian
                </Link>
              </li>
              <li>
                <Link
                  href='/categories/desert'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Desserts
                </Link>
              </li>
              <li>
                <Link
                  href='/categories'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Discover</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/featured'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Featured Recipes
                </Link>
              </li>
              <li>
                <Link
                  href='/trending'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  href='/seasonal'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Seasonal
                </Link>
              </li>
              <li>
                <Link
                  href='/quick-meals'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Quick Meals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 font-semibold'>Community</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  About Savor
                </Link>
              </li>
              <li>
                <Link
                  href='/submit-recipe'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Submit Recipe
                </Link>
              </li>
              <li>
                <Link
                  href='/newsletter'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Newsletter
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-muted-foreground transition-colors hover:text-savor-saffron'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t pt-8 text-center text-sm text-muted-foreground'>
          <p>
            &copy; 2025 Savor Recipe Book. All rights reserved. Made with ❤️ for food lovers
            everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
