import { notFound } from 'next/navigation';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { CategoryHeader } from '@/components/categories/category-header';
import { RecipeFilters } from '@/components/recipes/recipe-filters';
import { getAllRecipes, getRecipesByCategory } from '@/lib/markdown';
import { kebabToTitle } from '@/lib/utils';

// Define valid categories
const validCategories = [
  'breakfast',
  'italian',
  'desert',
  'mexican',
  'asian',
  'soups',
  'beef',
  'poultry',
  'pork',
  'sides',
];

const categoryInfo = {
  breakfast: {
    title: 'Breakfast',
    description: 'Start your day right with hearty morning meals and energizing dishes',
    emoji: '🥞',
    color: 'from-orange-400 to-yellow-400',
  },
  italian: {
    title: 'Italian',
    description: 'Authentic flavors from the heart of Italy, from pasta to pizza',
    emoji: '🍝',
    color: 'from-green-400 to-red-400',
  },
  desert: {
    title: 'Desserts',
    description: 'Sweet treats to satisfy your cravings and celebrate special moments',
    emoji: '🍰',
    color: 'from-pink-400 to-purple-400',
  },
  mexican: {
    title: 'Mexican',
    description: 'Bold and vibrant flavors from Mexico with authentic spices',
    emoji: '🌮',
    color: 'from-red-400 to-orange-400',
  },
  asian: {
    title: 'Asian',
    description: 'Diverse cuisines from across Asia with fresh ingredients and bold flavors',
    emoji: '🍜',
    color: 'from-blue-400 to-green-400',
  },
  soups: {
    title: 'Soups',
    description: 'Comforting bowls for every season, from light broths to hearty stews',
    emoji: '🍲',
    color: 'from-teal-400 to-blue-400',
  },
  beef: {
    title: 'Beef',
    description: 'Hearty beef dishes from steaks to slow-cooked comfort foods',
    emoji: '🥩',
    color: 'from-red-500 to-red-700',
  },
  poultry: {
    title: 'Poultry',
    description: 'Versatile chicken and turkey recipes for every occasion',
    emoji: '🍗',
    color: 'from-yellow-400 to-orange-500',
  },
  pork: {
    title: 'Pork',
    description: 'Savory pork dishes from bacon to tenderloin',
    emoji: '🥓',
    color: 'from-pink-400 to-red-400',
  },
  sides: {
    title: 'Side Dishes',
    description: 'Perfect accompaniments to complete your meals',
    emoji: '🥗',
    color: 'from-green-400 to-lime-400',
  },
};

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return validCategories.map((category) => ({
    category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    return {
      title: 'Category Not Found',
    };
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];

  return {
    title: `${info.title} Recipes | Savor`,
    description: `Discover delicious ${info.title.toLowerCase()} recipes. ${info.description}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  // Check if category is valid
  if (!validCategories.includes(category)) {
    notFound();
  }

  // Get category info
  const info = categoryInfo[category as keyof typeof categoryInfo];

  // Get recipes for this category
  const recipes = await getRecipesByCategory(category);

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <CategoryHeader
          title={info.title}
          description={info.description}
          emoji={info.emoji}
          color={info.color}
          recipeCount={recipes.length}
        />

        <section className='py-8 lg:py-12'>
          <div className='container'>
            <div className='grid gap-8 lg:grid-cols-4'>
              {/* Filters Sidebar */}
              <div className='lg:col-span-1'>
                <RecipeFilters recipes={recipes} />
              </div>

              {/* Recipe Grid */}
              <div className='lg:col-span-3'>
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
