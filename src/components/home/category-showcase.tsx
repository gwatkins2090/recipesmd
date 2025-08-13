import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { kebabToTitle } from '@/lib/utils';

const categories = [
  {
    name: 'breakfast',
    title: 'Breakfast',
    description: 'Start your day right with hearty morning meals',
    emoji: '🥞',
    color: 'from-orange-400 to-yellow-400',
    recipeCount: 45
  },
  {
    name: 'italian',
    title: 'Italian',
    description: 'Authentic flavors from the heart of Italy',
    emoji: '🍝',
    color: 'from-green-400 to-red-400',
    recipeCount: 67
  },
  {
    name: 'desert',
    title: 'Desserts',
    description: 'Sweet treats to satisfy your cravings',
    emoji: '🍰',
    color: 'from-pink-400 to-purple-400',
    recipeCount: 89
  },
  {
    name: 'mexican',
    title: 'Mexican',
    description: 'Bold and vibrant flavors from Mexico',
    emoji: '🌮',
    color: 'from-red-400 to-orange-400',
    recipeCount: 52
  },
  {
    name: 'asian',
    title: 'Asian',
    description: 'Diverse cuisines from across Asia',
    emoji: '🍜',
    color: 'from-blue-400 to-green-400',
    recipeCount: 73
  },
  {
    name: 'soups',
    title: 'Soups',
    description: 'Comforting bowls for every season',
    emoji: '🍲',
    color: 'from-teal-400 to-blue-400',
    recipeCount: 38
  }
];

export function CategoryShowcase() {
  return (
    <section className="bg-gradient-to-br from-savor-mint/10 to-savor-sage/5 py-16 lg:py-24">
      <div className="container">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From quick weeknight dinners to special occasion treats, find the perfect recipe for any moment.
          </p>
        </div>

        {/* Category grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={`/categories/${category.name}`}>
              <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-0">
                  {/* Category header with gradient */}
                  <div className={`bg-gradient-to-br ${category.color} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="mb-2 font-heading text-xl font-bold">
                          {category.title}
                        </h3>
                        <p className="text-sm opacity-90">
                          {category.recipeCount} recipes
                        </p>
                      </div>
                      <div className="text-4xl">{category.emoji}</div>
                    </div>
                  </div>

                  {/* Category content */}
                  <div className="p-6">
                    <p className="mb-4 text-muted-foreground">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center text-sm font-medium text-savor-sage group-hover:text-savor-saffron transition-colors">
                      Explore {category.title}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View all categories button */}
        <div className="text-center">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="border-savor-sage text-savor-sage hover:bg-savor-sage hover:text-white"
          >
            <Link href="/categories" className="inline-flex items-center">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
