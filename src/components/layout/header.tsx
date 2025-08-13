'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Menu, X, Zap } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Environment Sync Station
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#workflow" className="text-sm font-medium hover:text-primary transition-colors">
            Workflow
          </Link>
          <Link href="#integrations" className="text-sm font-medium hover:text-primary transition-colors">
            Integrations
          </Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <Button size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-3">
            <Link href="#features" className="block text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#workflow" className="block text-sm font-medium hover:text-primary transition-colors">
              Workflow
            </Link>
            <Link href="#integrations" className="block text-sm font-medium hover:text-primary transition-colors">
              Integrations
            </Link>
            <Link href="/dashboard" className="block text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <div className="flex flex-col space-y-2 pt-2">
              {user ? (
                <Button size="sm" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};