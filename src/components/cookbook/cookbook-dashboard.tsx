'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Plus, TrendingUp, Clock, Users, ChefHat, Star } from 'lucide-react';

interface CookbookDashboardProps {
  favorites: string[];
  userRecipes: any[];
  onTabChange: (tab: string) => void;
}

export function CookbookDashboard({
  favorites,
  userRecipes,
  onTabChange,
}: CookbookDashboardProps) {
  const stats = [
    {
      title: 'Favorite Recipes',
      value: favorites.length,
      icon: Heart,
      color: 'text-red-500',
      action: () => onTabChange('favorites'),
    },
    {
      title: 'My Recipes',
      value: userRecipes.length,
      icon: ChefHat,
      color: 'text-savor-saffron',
      action: () => onTabChange('my-recipes'),
    },
    {
      title: 'Total Recipes',
      value: favorites.length + userRecipes.length,
      icon: BookOpen,
      color: 'text-savor-sage',
      action: () => {},
    },
    {
      title: 'This Week',
      value: userRecipes.filter((recipe) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(recipe.dateCreated || Date.now()) > weekAgo;
      }).length,
      icon: TrendingUp,
      color: 'text-green-500',
      action: () => {},
    },
  ];

  const recentRecipes = userRecipes
    .sort(
      (a, b) => new Date(b.dateCreated || 0).getTime() - new Date(a.dateCreated || 0).getTime()
    )
    .slice(0, 3);

  return (
    <div className='space-y-8'>
      {/* Welcome Section */}
      <div className='text-center'>
        <h2 className='mb-2 text-2xl font-bold text-savor-charcoal'>Welcome to Your Cookbook</h2>
        <p className='text-muted-foreground'>
          Manage your recipes, create shopping lists, and organize your culinary adventures
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <Card
            key={index}
            className='cursor-pointer transition-shadow hover:shadow-lg'
            onClick={stat.action}
          >
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
                  <p className='text-2xl font-bold text-savor-charcoal'>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Recent Recipes */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-savor-saffron' />
              Recent Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecipes.length > 0 ? (
              <div className='space-y-4'>
                {recentRecipes.map((recipe, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded-lg bg-savor-cream/30 p-3'
                  >
                    <div>
                      <h4 className='font-medium text-savor-charcoal'>{recipe.title}</h4>
                      <p className='text-sm text-muted-foreground'>
                        {recipe.category} • {recipe.difficulty}
                      </p>
                    </div>
                    <Badge variant='secondary'>{recipe.servings} servings</Badge>
                  </div>
                ))}
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={() => onTabChange('my-recipes')}
                >
                  View All My Recipes
                </Button>
              </div>
            ) : (
              <div className='py-8 text-center'>
                <ChefHat className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                <p className='mb-4 text-muted-foreground'>No recipes uploaded yet</p>
                <Button onClick={() => onTabChange('upload')}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Your First Recipe
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Star className='h-5 w-5 text-savor-saffron' />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => onTabChange('upload')}
              >
                <Plus className='mr-2 h-4 w-4' />
                Add New Recipe
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => onTabChange('favorites')}
              >
                <Heart className='mr-2 h-4 w-4' />
                View Favorites ({favorites.length})
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => onTabChange('shopping')}
              >
                <Users className='mr-2 h-4 w-4' />
                Generate Shopping List
              </Button>

              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => onTabChange('print')}
              >
                <BookOpen className='mr-2 h-4 w-4' />
                Print Recipes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      {favorites.length === 0 && userRecipes.length === 0 && (
        <Card className='border-savor-saffron/20 bg-gradient-to-br from-savor-saffron/10 to-savor-paprika/10'>
          <CardContent className='p-8 text-center'>
            <BookOpen className='mx-auto mb-4 h-16 w-16 text-savor-saffron' />
            <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
              Start Building Your Cookbook
            </h3>
            <p className='mb-6 text-muted-foreground'>
              Your personal cookbook is empty. Start by adding your favorite recipes or uploading
              your own creations.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Button size='lg' onClick={() => (window.location.href = '/recipes')}>
                <BookOpen className='mr-2 h-5 w-5' />
                Browse Recipes
              </Button>
              <Button size='lg' variant='outline' onClick={() => onTabChange('upload')}>
                <Plus className='mr-2 h-5 w-5' />
                Add Recipe
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
