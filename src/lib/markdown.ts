import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Recipe, RecipeMeta, RecipeIngredient, RecipeInstruction } from '@/types';
import { generateSlug } from './recipe-utils';

const recipesDirectory = path.join(process.cwd(), 'recipes');

/**
 * Parse ISO 8601 duration to human-readable format
 * PT10M -> 10 min, PT1H30M -> 1 hr 30 min
 */
function parseISODuration(duration: string | undefined): string {
  if (!duration) return '0 min';

  // If already in human format, return as-is
  if (!duration.startsWith('PT')) return duration;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;

  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');

  if (hours > 0 && minutes > 0) {
    return `${hours} hr ${minutes} min`;
  } else if (hours > 0) {
    return `${hours} hr`;
  } else {
    return `${minutes} min`;
  }
}

/**
 * Parse yield/servings field
 * "8 servings" -> 8, "6-8 servings" -> 7 (median)
 */
function parseYield(yieldStr: string | number | undefined): number {
  if (typeof yieldStr === 'number') return yieldStr;
  if (!yieldStr) return 4;

  const str = String(yieldStr);

  // Handle range (e.g., "6-8 servings")
  const rangeMatch = str.match(/(\d+)-(\d+)/);
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1]);
    const max = parseInt(rangeMatch[2]);
    return Math.round((min + max) / 2);
  }

  // Extract first number
  const numMatch = str.match(/(\d+)/);
  return numMatch ? parseInt(numMatch[1]) : 4;
}

/**
 * Parse frontmatter data into RecipeMeta
 */
function parseFrontmatter(data: any): RecipeMeta {
  return {
    title: data.title || '',
    description: data.description || '',
    category: data.category || '',
    subcategory: data.subcategory,
    cuisine: data.cuisine,
    difficulty: data.difficulty || 'Medium',
    servings: parseYield(data.yield || data.servings),
    times: {
      prep: parseISODuration(data.prepTime) || data.prep || '0 min',
      cook: parseISODuration(data.cookTime) || data.cook || '0 min',
      total: parseISODuration(data.totalTime) || data.total || '0 min',
      rest: parseISODuration(data.restTime) || data.rest
    },
    tags: Array.isArray(data.tags) ? data.tags : [],
    author: data.author,
    dateCreated: data.dateCreated || data.dateAdded || data.date,
    dateModified: data.dateModified,
    image: data.image,
    imageAlt: data.imageAlt || data.alt,
    rating: data.rating,
    reviewCount: data.reviewCount
  };
}

/**
 * Parse ingredients from markdown content or frontmatter
 */
function parseIngredients(data: any, content: string): RecipeIngredient[] {
  // Try frontmatter first
  if (data.ingredients && Array.isArray(data.ingredients)) {
    return data.ingredients.map((ing: any, index: number) => {
      if (typeof ing === 'string') {
        // Parse string format: "1 cup flour"
        const parts = ing.trim().split(' ');
        const amount = parts[0];
        const unit = parts[1];
        const ingredient = parts.slice(2).join(' ');
        
        return {
          amount,
          unit: unit !== ingredient ? unit : undefined,
          ingredient: unit === ingredient ? parts.slice(1).join(' ') : ingredient
        };
      }
      
      return {
        amount: ing.amount || '',
        unit: ing.unit,
        ingredient: ing.ingredient || '',
        notes: ing.notes
      };
    });
  }

  // Parse from markdown content
  const ingredientSection = content.match(/## Ingredients\s*\n([\s\S]*?)(?=\n## |\n# |$)/i);
  if (ingredientSection) {
    const ingredientLines = ingredientSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());

    return ingredientLines.map(line => {
      const parts = line.split(' ');
      const amount = parts[0];
      const unit = parts[1];
      const ingredient = parts.slice(2).join(' ');
      
      return {
        amount,
        unit: unit !== ingredient ? unit : undefined,
        ingredient: unit === ingredient ? parts.slice(1).join(' ') : ingredient
      };
    });
  }

  return [];
}

/**
 * Parse instructions from markdown content or frontmatter
 */
function parseInstructions(data: any, content: string): RecipeInstruction[] {
  // Try frontmatter first
  if (data.instructions && Array.isArray(data.instructions)) {
    return data.instructions.map((inst: any, index: number) => ({
      step: index + 1,
      instruction: typeof inst === 'string' ? inst : inst.instruction || '',
      time: typeof inst === 'object' ? inst.time : undefined,
      temperature: typeof inst === 'object' ? inst.temperature : undefined
    }));
  }

  // Parse from markdown content
  const instructionSection = content.match(/## Instructions\s*\n([\s\S]*?)(?=\n## |\n# |$)/i);
  if (instructionSection) {
    const instructionLines = instructionSection[1]
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./) || line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^\d+\.\s*|^[-*]\s*/, '').trim());

    return instructionLines.map((instruction, index) => ({
      step: index + 1,
      instruction
    }));
  }

  return [];
}

/**
 * Get all recipe files from a category directory
 */
export function getRecipeFiles(category?: string): string[] {
  if (category) {
    const categoryPath = path.join(recipesDirectory, category);
    if (!fs.existsSync(categoryPath)) return [];
    
    return fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(category, file));
  }

  // Get all recipe files from all categories
  const categories = fs.readdirSync(recipesDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const allFiles: string[] = [];
  categories.forEach(cat => {
    const categoryPath = path.join(recipesDirectory, cat);
    const files = fs.readdirSync(categoryPath)
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(cat, file));
    allFiles.push(...files);
  });

  return allFiles;
}

/**
 * Parse a single recipe file
 */
export async function parseRecipeFile(filePath: string): Promise<Recipe | null> {
  try {
    const fullPath = path.join(recipesDirectory, filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Generate slug from filename or title
    const fileName = path.basename(filePath, '.md');
    const slug = data.slug || generateSlug(data.title || fileName);

    // Parse frontmatter
    const meta = parseFrontmatter(data);
    
    // Parse ingredients and instructions
    const ingredients = parseIngredients(data, content);
    const instructions = parseInstructions(data, content);

    // Process markdown content
    const processedContent = await remark()
      .use(html)
      .process(content);

    const recipe: Recipe = {
      slug,
      meta,
      ingredients,
      instructions,
      nutrition: data.nutrition,
      notes: data.notes ? (Array.isArray(data.notes) ? data.notes : [data.notes]) : undefined,
      variations: data.variations ? (Array.isArray(data.variations) ? data.variations : [data.variations]) : undefined,
      storage: data.storage,
      content: processedContent.toString()
    };

    return recipe;
  } catch (error) {
    console.error(`Error parsing recipe file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  const files = getRecipeFiles();
  const recipes: Recipe[] = [];

  for (const file of files) {
    const recipe = await parseRecipeFile(file);
    if (recipe) {
      recipes.push(recipe);
    }
  }

  return recipes;
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const files = getRecipeFiles(category);
  const recipes: Recipe[] = [];

  for (const file of files) {
    const recipe = await parseRecipeFile(file);
    if (recipe) {
      recipes.push(recipe);
    }
  }

  return recipes;
}

/**
 * Get a single recipe by slug
 */
export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const files = getRecipeFiles();
  
  for (const file of files) {
    const recipe = await parseRecipeFile(file);
    if (recipe && recipe.slug === slug) {
      return recipe;
    }
  }

  return null;
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  try {
    return fs.readdirSync(recipesDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}
