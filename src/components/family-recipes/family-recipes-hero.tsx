'use client';

import { Button } from '@/components/ui/button';
import { Heart, BookOpen, Clock, Users } from 'lucide-react';

export function FamilyRecipesHero() {
  return (
    <section className="bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="mb-6 font-heading text-4xl font-bold text-savor-charcoal sm:text-5xl lg:text-6xl">
            Family Recipes
          </h1>
          
          <p className="mb-8 text-xl text-savor-charcoal/80 sm:text-2xl">
            Treasured recipes passed down through generations
          </p>
          
          <p className="mx-auto mb-10 max-w-3xl text-lg text-savor-charcoal/70 leading-relaxed">
            These aren't just recipes—they're family stories, memories, and traditions preserved in every 
            ingredient and technique. Each dish carries the love and wisdom of generations, from handwritten 
            recipe cards to cherished family gatherings around the dinner table.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              className="bg-savor-saffron hover:bg-savor-saffron/90 text-savor-charcoal"
              onClick={() => document.getElementById('family-recipes-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Heart className="mr-2 h-5 w-5" />
              Explore Family Recipes
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/cookbook'}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Add to Cookbook
            </Button>
          </div>

          {/* Family Recipe Stats */}
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-savor-sage/20">
                  <Clock className="h-6 w-6 text-savor-sage" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-savor-charcoal">50+</h3>
              <p className="text-sm text-savor-charcoal/70">Years of Tradition</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-savor-paprika/20">
                  <Users className="h-6 w-6 text-savor-paprika" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-savor-charcoal">4</h3>
              <p className="text-sm text-savor-charcoal/70">Generations</p>
            </div>
            
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-savor-saffron/20">
                  <Heart className="h-6 w-6 text-savor-saffron" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-savor-charcoal">∞</h3>
              <p className="text-sm text-savor-charcoal/70">Love & Memories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
