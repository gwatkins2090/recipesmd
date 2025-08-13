import { MetadataRoute } from 'next';
import { getAllRecipes, getCategories } from '@/lib/markdown';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://savor-recipes.com';
  
  // Get all recipes and categories
  const recipes = await getAllRecipes();
  const categories = getCategories();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ];

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Recipe pages
  const recipePages = recipes.map((recipe) => ({
    url: `${baseUrl}/recipes/${recipe.slug}`,
    lastModified: recipe.meta.dateModified 
      ? new Date(recipe.meta.dateModified) 
      : recipe.meta.dateCreated 
      ? new Date(recipe.meta.dateCreated)
      : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...recipePages];
}
