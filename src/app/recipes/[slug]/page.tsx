import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { RecipeHero } from '@/components/recipe/recipe-hero';
import { RecipeIngredients } from '@/components/recipe/recipe-ingredients';
import { RecipeInstructions } from '@/components/recipe/recipe-instructions';
import { RecipeNutrition } from '@/components/recipe/recipe-nutrition';
import { RecipeNotes } from '@/components/recipe/recipe-notes';
import { RelatedRecipes } from '@/components/recipe/related-recipes';
import { RecipeStructuredData, BreadcrumbStructuredData } from '@/components/seo/structured-data';
import { getRecipeBySlug, getAllRecipes } from '@/lib/markdown';
import { kebabToTitle } from '@/lib/utils';

interface RecipePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.meta.title} | Savor`,
    description: recipe.meta.description,
    openGraph: {
      title: recipe.meta.title,
      description: recipe.meta.description,
      images: recipe.meta.image ? [recipe.meta.image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.meta.title,
      description: recipe.meta.description,
      images: recipe.meta.image ? [recipe.meta.image] : [],
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.slug);

  if (!recipe) {
    notFound();
  }

  // Get related recipes (same category)
  const allRecipes = await getAllRecipes();
  const relatedRecipes = allRecipes
    .filter((r) => r.meta.category === recipe.meta.category && r.slug !== recipe.slug)
    .slice(0, 4);

  // Breadcrumb data for structured data
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Recipes', url: '/recipes' },
    { name: kebabToTitle(recipe.meta.category), url: `/categories/${recipe.meta.category}` },
    { name: recipe.meta.title, url: `/recipes/${recipe.slug}` },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <RecipeStructuredData recipe={recipe} />
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <Header />
      <main>
        <RecipeHero recipe={recipe} />

        <div className='container py-8 lg:py-12'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {/* Main content */}
            <div className='space-y-8 lg:col-span-2'>
              <RecipeIngredients
                ingredients={recipe.ingredients}
                servings={recipe.meta.servings}
              />

              <RecipeInstructions instructions={recipe.instructions} />

              {recipe.notes && recipe.notes.length > 0 && (
                <RecipeNotes
                  notes={recipe.notes}
                  variations={recipe.variations}
                  storage={recipe.storage}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className='lg:col-span-1'>
              {recipe.nutrition && <RecipeNutrition nutrition={recipe.nutrition} />}
            </div>
          </div>
        </div>

        {/* Related recipes */}
        {relatedRecipes.length > 0 && (
          <RelatedRecipes recipes={relatedRecipes} category={recipe.meta.category} />
        )}
      </main>
      <Footer />
    </div>
  );
}
