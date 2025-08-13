import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { RecipeFilters } from '@/components/recipes/recipe-filters';
import { SearchBar } from '@/components/ui/search-bar';
import { getAllRecipes } from '@/lib/markdown';
import { ChefHat } from 'lucide-react';

export const metadata = {
  title: 'All Recipes | Savor',
  description: 'Browse our complete collection of delicious recipes from around the world. Find your next favorite dish.',
};

export default async function RecipesPage() {
  const recipes = await getAllRecipes();

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
                All Recipes
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80 sm:text-xl">
                Explore our complete collection of {recipes.length} delicious recipes. 
                From quick weeknight dinners to special occasion treats.
              </p>

              {/* Search bar */}
              <div className="mx-auto max-w-2xl">
                <SearchBar
                  placeholder="Search recipes, ingredients, or cuisines..."
                  size="lg"
                  onSearch={(query) => {
                    // Navigate to search page with query
                    window.location.href = `/search?q=${encodeURIComponent(query)}`;
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Recipes Section */}
        <section className="py-8 lg:py-12">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <RecipeFilters recipes={recipes} />
              </div>
              
              {/* Recipe Grid */}
              <div className="lg:col-span-3">
                <RecipeGrid recipes={recipes} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
