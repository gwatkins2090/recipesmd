import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChefHat } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const categories = [
  {
    name: 'breakfast',
    title: 'Breakfast',
    description: 'Start your day right with hearty morning meals and energizing dishes',
    emoji: '🥞',
    color: 'from-orange-400 to-yellow-400',
    recipeCount: 45,
    featured: ['Grandma\'s Pancakes', 'French Toast Casserole', 'Breakfast Burrito']
  },
  {
    name: 'italian',
    title: 'Italian',
    description: 'Authentic flavors from the heart of Italy, from pasta to pizza',
    emoji: '🍝',
    color: 'from-green-400 to-red-400',
    recipeCount: 67,
    featured: ['Spaghetti Carbonara', 'Pizza Margherita', 'Chicken Parmigiana']
  },
  {
    name: 'desert',
    title: 'Desserts',
    description: 'Sweet treats to satisfy your cravings and celebrate special moments',
    emoji: '🍰',
    color: 'from-pink-400 to-purple-400',
    recipeCount: 89,
    featured: ['Chocolate Chip Cookies', 'Classic Tiramisu', 'Apple Pie']
  },
  {
    name: 'mexican',
    title: 'Mexican',
    description: 'Bold and vibrant flavors from Mexico with authentic spices',
    emoji: '🌮',
    color: 'from-red-400 to-orange-400',
    recipeCount: 52,
    featured: ['Chicken Tacos Al Pastor', 'Guacamole', 'Enchiladas']
  },
  {
    name: 'asian',
    title: 'Asian',
    description: 'Diverse cuisines from across Asia with fresh ingredients and bold flavors',
    emoji: '🍜',
    color: 'from-blue-400 to-green-400',
    recipeCount: 73,
    featured: ['Beef Stir Fry', 'Pad Thai', 'Chicken Teriyaki']
  },
  {
    name: 'soups',
    title: 'Soups',
    description: 'Comforting bowls for every season, from light broths to hearty stews',
    emoji: '🍲',
    color: 'from-teal-400 to-blue-400',
    recipeCount: 38,
    featured: ['Chicken Noodle Soup', 'Tomato Basil', 'Beef Stew']
  },
  {
    name: 'beef',
    title: 'Beef',
    description: 'Hearty beef dishes from steaks to slow-cooked comfort foods',
    emoji: '🥩',
    color: 'from-red-500 to-red-700',
    recipeCount: 42,
    featured: ['Beef Wellington', 'Pot Roast', 'Beef Tacos']
  },
  {
    name: 'poultry',
    title: 'Poultry',
    description: 'Versatile chicken and turkey recipes for every occasion',
    emoji: '🍗',
    color: 'from-yellow-400 to-orange-500',
    recipeCount: 56,
    featured: ['Roast Chicken', 'Chicken Curry', 'Turkey Meatballs']
  },
  {
    name: 'pork',
    title: 'Pork',
    description: 'Savory pork dishes from bacon to tenderloin',
    emoji: '🥓',
    color: 'from-pink-400 to-red-400',
    recipeCount: 34,
    featured: ['Pork Tenderloin', 'BBQ Ribs', 'Bacon Wrapped Chicken']
  },
  {
    name: 'sides',
    title: 'Side Dishes',
    description: 'Perfect accompaniments to complete your meals',
    emoji: '🥗',
    color: 'from-green-400 to-lime-400',
    recipeCount: 67,
    featured: ['Garlic Mashed Potatoes', 'Caesar Salad', 'Roasted Vegetables']
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-16 lg:py-24">
          <div className="container">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-xl">
                  <ChefHat className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="mb-4 font-heading text-4xl font-bold text-savor-charcoal sm:text-5xl lg:text-6xl">
                Recipe Categories
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg text-savor-charcoal/80 sm:text-xl">
                Explore our collection of recipes organized by cuisine, meal type, and cooking style. 
                Find exactly what you're craving.
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link key={category.name} href={`/categories/${category.name}`}>
                  <Card className="group h-full overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2">
                    <CardContent className="p-0">
                      {/* Category header with gradient */}
                      <div className={`bg-gradient-to-br ${category.color} p-8 text-white relative overflow-hidden`}>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h2 className="mb-2 font-heading text-2xl font-bold">
                                {category.title}
                              </h2>
                              <p className="text-sm opacity-90">
                                {category.recipeCount} recipes
                              </p>
                            </div>
                            <div className="text-5xl">{category.emoji}</div>
                          </div>
                          
                          <p className="text-sm opacity-90 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        {/* Background decoration */}
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10"></div>
                        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-white/5"></div>
                      </div>

                      {/* Category content */}
                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="mb-2 font-semibold text-savor-charcoal">Featured Recipes:</h3>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {category.featured.map((recipe, index) => (
                              <li key={index} className="flex items-center">
                                <span className="mr-2 h-1 w-1 rounded-full bg-savor-saffron"></span>
                                {recipe}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm font-medium text-savor-sage group-hover:text-savor-saffron transition-colors">
                            Explore {category.title}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            {category.recipeCount} recipes
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
