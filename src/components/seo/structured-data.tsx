import { Recipe } from '@/types';

interface RecipeStructuredDataProps {
  recipe: Recipe;
}

export function RecipeStructuredData({ recipe }: RecipeStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    "name": recipe.meta.title,
    "description": recipe.meta.description,
    "image": recipe.meta.image ? [recipe.meta.image] : [],
    "author": {
      "@type": "Person",
      "name": recipe.meta.author || "Savor Team"
    },
    "datePublished": recipe.meta.dateCreated,
    "dateModified": recipe.meta.dateModified || recipe.meta.dateCreated,
    "prepTime": `PT${recipe.meta.times.prep}`,
    "cookTime": `PT${recipe.meta.times.cook}`,
    "totalTime": `PT${recipe.meta.times.total}`,
    "recipeCategory": recipe.meta.category,
    "recipeCuisine": recipe.meta.cuisine,
    "recipeYield": recipe.meta.servings,
    "keywords": recipe.meta.tags.join(", "),
    "recipeIngredient": recipe.ingredients.map(ingredient => 
      `${ingredient.amount}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.ingredient}`
    ),
    "recipeInstructions": recipe.instructions.map((instruction, index) => ({
      "@type": "HowToStep",
      "name": `Step ${index + 1}`,
      "text": instruction.instruction,
      "url": `#step-${index + 1}`
    })),
    "aggregateRating": recipe.meta.rating ? {
      "@type": "AggregateRating",
      "ratingValue": recipe.meta.rating,
      "reviewCount": recipe.meta.reviewCount || 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "nutrition": recipe.nutrition ? {
      "@type": "NutritionInformation",
      "calories": recipe.nutrition.calories ? `${recipe.nutrition.calories} calories` : undefined,
      "proteinContent": recipe.nutrition.protein,
      "carbohydrateContent": recipe.nutrition.carbs,
      "fatContent": recipe.nutrition.fat,
      "fiberContent": recipe.nutrition.fiber,
      "sugarContent": recipe.nutrition.sugar,
      "sodiumContent": recipe.nutrition.sodium
    } : undefined,
    "video": undefined, // Add video data if available
    "publisher": {
      "@type": "Organization",
      "name": "Savor",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png"
      }
    }
  };

  // Remove undefined values
  const cleanedData = JSON.parse(JSON.stringify(structuredData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanedData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface WebsiteStructuredDataProps {
  searchUrl?: string;
}

export function WebsiteStructuredData({ searchUrl = "/search" }: WebsiteStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Savor",
    "alternateName": "Savor Recipe Book",
    "description": "Discover, save, and share recipes that bring families together. From traditional comfort foods to modern culinary adventures.",
    "url": "https://savor-recipes.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://savor-recipes.com${searchUrl}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Savor",
      "logo": {
        "@type": "ImageObject",
        "url": "/images/logo.png",
        "width": 200,
        "height": 60
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface OrganizationStructuredDataProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  socialLinks?: string[];
}

export function OrganizationStructuredData({ 
  name = "Savor",
  description = "A recipe sharing platform that brings families together through food",
  url = "https://savor-recipes.com",
  logo = "/images/logo.png",
  socialLinks = []
}: OrganizationStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo
    },
    "sameAs": socialLinks,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "English"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
