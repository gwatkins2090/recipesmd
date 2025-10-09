/* eslint-disable react/function-component-definition */
import type { Metadata } from 'next';
import { Inter, Open_Sans, Dancing_Script } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/poviders/theme-provider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Savor - Every Recipe Tells a Story',
    template: '%s | Savor',
  },
  description:
    'Discover, save, and share recipes that bring families together. From traditional comfort foods to modern culinary adventures. Join our community of food lovers.',
  keywords: [
    'recipes',
    'cooking',
    'food',
    'kitchen',
    'meals',
    'ingredients',
    'cuisine',
    'family recipes',
  ],
  authors: [{ name: 'Savor Team' }],
  creator: 'Savor',
  publisher: 'Savor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Savor - Every Recipe Tells a Story',
    description:
      'Discover, save, and share recipes that bring families together. From traditional comfort foods to modern culinary adventures.',
    siteName: 'Savor',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Savor - Recipe sharing platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Savor - Every Recipe Tells a Story',
    description: 'Discover, save, and share recipes that bring families together.',
    images: ['/images/twitter-image.jpg'],
    creator: '@savor_recipes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${inter.variable} ${openSans.variable} ${dancingScript.variable} font-sans`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position='top-right'
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
              },
              success: {
                iconTheme: {
                  primary: 'hsl(var(--primary))',
                  secondary: 'hsl(var(--primary-foreground))',
                },
              },
              error: {
                iconTheme: {
                  primary: 'hsl(var(--destructive))',
                  secondary: 'hsl(var(--destructive-foreground))',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
