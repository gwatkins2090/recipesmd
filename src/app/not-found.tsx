import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <h1 className='font-serif text-6xl font-bold tracking-tighter'>404</h1>
          <p className='max-w-[700px] text-muted-foreground md:text-xl'>
            Oops! The page you&apos;re looking for can&apos;t be found.
          </p>
          <p className='max-w-[600px] text-muted-foreground'>
            It seems you&apos;ve reached a broken link or a page that no longer exists.
          </p>
          <div className='mt-8 flex gap-4'>
            <Button asChild size='lg' className='font-medium'>
              <Link href='/'>Back to Home</Link>
            </Button>
            <Button asChild variant='outline' size='lg'>
              <Link href='/contact'>Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
