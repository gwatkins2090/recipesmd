'use client';

import { useState, useEffect } from 'react';
import { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { CookbookDashboard } from '@/components/cookbook/cookbook-dashboard';
import { RecipeUpload } from '@/components/cookbook/recipe-upload';
import { MyRecipesSection } from '@/components/cookbook/my-recipes-section';
import { FavoritesSection } from '@/components/cookbook/favorites-section';
import { ShoppingListGenerator } from '@/components/cookbook/shopping-list-generator';
import { PrintableRecipes } from '@/components/cookbook/printable-recipes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Plus,
  Heart,
  ShoppingCart,
  Printer,
  Scale,
  ChefHat,
  Download,
} from 'lucide-react';

export default function CookbookPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userRecipes, setUserRecipes] = useState<any[]>([]);

  // Load favorites from localStorage and handle URL params
  useEffect(() => {
    const savedFavorites = localStorage.getItem('savor-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedUserRecipes = localStorage.getItem('savor-user-recipes');
    if (savedUserRecipes) {
      setUserRecipes(JSON.parse(savedUserRecipes));
    }

    // Check for tab parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (
      tabParam &&
      ['dashboard', 'upload', 'my-recipes', 'favorites', 'shopping', 'print', 'scale'].includes(
        tabParam
      )
    ) {
      setActiveTab(tabParam);
    }
  }, []);

  const handleRecipeUpload = (recipe: any) => {
    const newRecipes = [...userRecipes, { ...recipe, id: Date.now() }];
    setUserRecipes(newRecipes);
    localStorage.setItem('savor-user-recipes', JSON.stringify(newRecipes));
  };

  const handleRecipeEdit = (recipe: any) => {
    // For now, redirect to upload form with recipe data
    // In a full implementation, you'd populate the form with existing data
    setActiveTab('upload');
  };

  const handleRecipeDelete = (recipeId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      const updatedRecipes = userRecipes.filter((recipe) => recipe.id !== recipeId);
      setUserRecipes(updatedRecipes);
      localStorage.setItem('savor-user-recipes', JSON.stringify(updatedRecipes));
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-12 lg:py-16'>
          <div className='container'>
            <div className='text-center'>
              <div className='mb-6 flex justify-center'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
                  <BookOpen className='h-6 w-6 text-white' />
                </div>
              </div>

              <h1 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
                Your Personal Cookbook
              </h1>

              <p className='mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80'>
                Create, organize, and share your favorite recipes. Scale servings, generate
                shopping lists, and print kitchen-friendly versions for cooking.
              </p>

              <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                <Button
                  size='lg'
                  className='bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                  onClick={() => setActiveTab('upload')}
                >
                  <Plus className='mr-2 h-5 w-5' />
                  Add Recipe
                </Button>
                <Button size='lg' variant='outline' onClick={() => setActiveTab('favorites')}>
                  <Heart className='mr-2 h-5 w-5' />
                  View Favorites ({favorites.length})
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Cookbook Content */}
        <section className='py-8 lg:py-12'>
          <div className='container'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
              <TabsList className='mb-8 grid w-full grid-cols-2 lg:grid-cols-7'>
                <TabsTrigger value='dashboard' className='flex items-center gap-2'>
                  <ChefHat className='h-4 w-4' />
                  <span className='hidden sm:inline'>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value='upload' className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  <span className='hidden sm:inline'>Add Recipe</span>
                </TabsTrigger>
                <TabsTrigger value='my-recipes' className='flex items-center gap-2'>
                  <ChefHat className='h-4 w-4' />
                  <span className='hidden sm:inline'>My Recipes</span>
                </TabsTrigger>
                <TabsTrigger value='favorites' className='flex items-center gap-2'>
                  <Heart className='h-4 w-4' />
                  <span className='hidden sm:inline'>Favorites</span>
                </TabsTrigger>
                <TabsTrigger value='shopping' className='flex items-center gap-2'>
                  <ShoppingCart className='h-4 w-4' />
                  <span className='hidden sm:inline'>Shopping</span>
                </TabsTrigger>
                <TabsTrigger value='print' className='flex items-center gap-2'>
                  <Printer className='h-4 w-4' />
                  <span className='hidden sm:inline'>Print</span>
                </TabsTrigger>
                <TabsTrigger value='scale' className='flex items-center gap-2'>
                  <Scale className='h-4 w-4' />
                  <span className='hidden sm:inline'>Scale</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value='dashboard' className='space-y-6'>
                <CookbookDashboard
                  favorites={favorites}
                  userRecipes={userRecipes}
                  onTabChange={setActiveTab}
                />
              </TabsContent>

              <TabsContent value='upload' className='space-y-6'>
                <RecipeUpload onRecipeUpload={handleRecipeUpload} />
              </TabsContent>

              <TabsContent value='my-recipes' className='space-y-6'>
                <MyRecipesSection
                  userRecipes={userRecipes}
                  onRecipeEdit={handleRecipeEdit}
                  onRecipeDelete={handleRecipeDelete}
                  onAddNewRecipe={() => setActiveTab('upload')}
                />
              </TabsContent>

              <TabsContent value='favorites' className='space-y-6'>
                <FavoritesSection favorites={favorites} onFavoritesChange={setFavorites} />
              </TabsContent>

              <TabsContent value='shopping' className='space-y-6'>
                <div className='py-12 text-center'>
                  <ShoppingCart className='mx-auto mb-4 h-16 w-16 text-savor-saffron' />
                  <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                    Shopping Lists Moved
                  </h3>
                  <p className='mb-6 text-muted-foreground'>
                    Shopping list management has moved to its own dedicated page with enhanced
                    features.
                  </p>
                  <Button
                    size='lg'
                    onClick={() => (window.location.href = '/shopping-list')}
                    className='bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                  >
                    <ShoppingCart className='mr-2 h-5 w-5' />
                    Go to Shopping Lists
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value='print' className='space-y-6'>
                <PrintableRecipes favorites={favorites} userRecipes={userRecipes} />
              </TabsContent>

              <TabsContent value='scale' className='space-y-6'>
                <div className='py-12 text-center'>
                  <Scale className='mx-auto mb-4 h-16 w-16 text-savor-saffron' />
                  <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                    Recipe Scaling
                  </h3>
                  <p className='mb-6 text-muted-foreground'>
                    Select a recipe from your favorites or uploaded recipes to scale the
                    ingredients.
                  </p>
                  <div className='flex justify-center gap-4'>
                    <Button variant='outline' onClick={() => setActiveTab('favorites')}>
                      Scale Favorites
                    </Button>
                    <Button variant='outline' onClick={() => setActiveTab('dashboard')}>
                      Scale My Recipes
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Quick Actions */}
        <section className='bg-savor-cream/30 py-12'>
          <div className='container'>
            <div className='mb-8 text-center'>
              <h2 className='mb-4 text-2xl font-bold text-savor-charcoal'>Quick Actions</h2>
              <p className='text-muted-foreground'>Common cookbook tasks made easy</p>
            </div>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <Button
                variant='outline'
                className='flex h-auto flex-col items-center gap-3 p-6'
                onClick={() => (window.location.href = '/recipes')}
              >
                <BookOpen className='h-8 w-8 text-savor-saffron' />
                <div className='text-center'>
                  <div className='font-semibold'>Browse Recipes</div>
                  <div className='text-sm text-muted-foreground'>Find new favorites</div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='flex h-auto flex-col items-center gap-3 p-6'
                onClick={() => setActiveTab('upload')}
              >
                <Plus className='h-8 w-8 text-savor-saffron' />
                <div className='text-center'>
                  <div className='font-semibold'>Add Recipe</div>
                  <div className='text-sm text-muted-foreground'>Upload your own</div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='flex h-auto flex-col items-center gap-3 p-6'
                onClick={() => (window.location.href = '/shopping-list')}
              >
                <ShoppingCart className='h-8 w-8 text-savor-saffron' />
                <div className='text-center'>
                  <div className='font-semibold'>Shopping List</div>
                  <div className='text-sm text-muted-foreground'>Generate from recipes</div>
                </div>
              </Button>

              <Button
                variant='outline'
                className='flex h-auto flex-col items-center gap-3 p-6'
                onClick={() => setActiveTab('print')}
              >
                <Download className='h-8 w-8 text-savor-saffron' />
                <div className='text-center'>
                  <div className='font-semibold'>Export Recipes</div>
                  <div className='text-sm text-muted-foreground'>Print or PDF</div>
                </div>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
