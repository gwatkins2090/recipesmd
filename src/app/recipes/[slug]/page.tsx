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
import { getRecipeBySlugIncludingUser } from '@/lib/recipe-server-utils';
import { RecipePageWrapper } from '@/components/recipe/recipe-page-wrapper';
import { kebabToTitle } from '@/lib/utils';

interface RecipePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Only generate static params for markdown recipes
  // User recipes will be handled dynamically
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlugIncludingUser(slug);

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
  const { slug } = await params;
  const markdownRecipe = await getRecipeBySlugIncludingUser(slug);

  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        <RecipePageWrapper slug={slug} markdownRecipe={markdownRecipe} />
      </main>
      <Footer />
    </div>
  );
}
