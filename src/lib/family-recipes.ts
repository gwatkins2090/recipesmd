import fs from 'fs';
import path from 'path';
import { Recipe, RecipeCard } from '@/types';

const FAMILY_RECIPES_DIRECTORY = path.join(process.cwd(), 'recipes', 'family');

interface ParsedFamilyRecipe {
  title: string;
  ingredients: Array<{ amount: string; unit: string; ingredient: string }>;
  instructions: Array<{ step: number; instruction: string }>;
  notes: string[];
}

/**
 * Parse a family recipe markdown file
 */
function parseFamilyRecipe(content: string, filename: string): ParsedFamilyRecipe {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);

  let title = '';
  const ingredients: Array<{ amount: string; unit: string; ingredient: string }> = [];
  const instructions: Array<{ step: number; instruction: string }> = [];
  const notes: string[] = [];

  let currentSection = '';
  let instructionCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Extract title from heading (only from ## headings that are not section headers)
    if (line.startsWith('##') && !line.toLowerCase().includes('ingredients') &&
        !line.toLowerCase().includes('instructions') && !line.toLowerCase().includes('directions')) {
      title = line.replace(/^##\s*/, '').replace(/^Recipe #\d+:\s*/, '').replace(/^\d+\.\s*/, '').trim();
    }
    // Section headers - handle both bold (**) and heading (###) formats
    else if (line.toLowerCase().includes('**ingredients:**') || line.toLowerCase().includes('### ingredients:')) {
      currentSection = 'ingredients';
    }
    else if (line.toLowerCase().includes('**instructions:**') || line.toLowerCase().includes('### instructions:') ||
             line.toLowerCase().includes('### directions:')) {
      currentSection = 'instructions';
      instructionCounter = 1;
    }
    else if (line.toLowerCase().includes('**note:**') || line.toLowerCase().includes('**notes:**') ||
             line.toLowerCase().includes('**additional instructions') || line.toLowerCase().includes('note by')) {
      currentSection = 'notes';
    }
    // Content parsing
    else if (line.startsWith('-') && currentSection === 'ingredients') {
      const ingredient = line.replace(/^-\s*/, '').trim();
      // Skip italic notes in ingredients, but include other content
      if (!ingredient.startsWith('*') || !ingredient.endsWith('*')) {
        ingredients.push(parseIngredient(ingredient));
      }
    }
    // Handle ingredients that don't start with dash but are in ingredients section
    else if (currentSection === 'ingredients' && line && !line.startsWith('**') && !line.toLowerCase().includes('instructions')) {
      // Check if this looks like an ingredient (not a section header)
      if (!line.toLowerCase().includes('mix until') && !line.toLowerCase().includes('note:')) {
        ingredients.push(parseIngredient(line));
      }
    }
    // Handle numbered instructions
    else if (line.match(/^\d+\./) && currentSection === 'instructions') {
      const instruction = line.replace(/^\d+\.\s*/, '').trim();
      instructions.push({ step: instructionCounter, instruction });
      instructionCounter++;
    }
    // Handle unnumbered instructions (single paragraph or multiple lines)
    else if (currentSection === 'instructions' && line && !line.startsWith('**') && !line.startsWith('#')) {
      // If this is the first instruction and no numbered instructions exist, treat as instruction
      if (instructions.length === 0 || !line.toLowerCase().includes('note:')) {
        // Check if this line continues a previous instruction or starts a new one
        if (instructions.length > 0 && !line.match(/^[A-Z]/) && line.length < 100 &&
            !line.toLowerCase().includes('bake') && !line.toLowerCase().includes('mix') &&
            !line.toLowerCase().includes('pour') && !line.toLowerCase().includes('cool')) {
          // Likely continuation of previous instruction
          const lastInstruction = instructions[instructions.length - 1];
          lastInstruction.instruction += ' ' + line;
        } else {
          // New instruction - split long paragraphs into sentences if they contain multiple steps
          if (line.length > 150 && line.includes('.')) {
            const sentences = line.split('.').filter(s => s.trim().length > 10);
            sentences.forEach((sentence, index) => {
              const trimmed = sentence.trim();
              if (trimmed) {
                instructions.push({ step: instructionCounter, instruction: trimmed + (index < sentences.length - 1 ? '.' : '') });
                instructionCounter++;
              }
            });
          } else {
            instructions.push({ step: instructionCounter, instruction: line });
            instructionCounter++;
          }
        }
      }
    }
    // Handle notes and additional content
    else if ((currentSection === 'notes' || currentSection === 'instructions') && line &&
             (line.includes('*') || line.includes('(') || line.toLowerCase().includes('note') ||
              line.toLowerCase().includes('serve') || line.toLowerCase().includes('delicious'))) {
      // Clean up note formatting
      const note = line.replace(/^\*\*Note:\*\*\s*/, '')
                      .replace(/^\*\*Notes:\*\*\s*/, '')
                      .replace(/^\*\(/, '(')
                      .replace(/\)\*$/, ')')
                      .replace(/^\*/, '')
                      .replace(/\*$/, '');
      if (note.trim()) {
        notes.push(note.trim());
      }
    }
  }

  // If no title found, use filename
  if (!title) {
    title = filename.replace(/\.md$/, '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  // If no instructions found but we have content after ingredients, try to extract it
  if (instructions.length === 0 && ingredients.length > 0) {
    let foundInstructions = false;
    let stepCounter = 1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes('**instructions:**') ||
          (foundInstructions && line && !line.startsWith('**') && !line.startsWith('#'))) {
        foundInstructions = true;
        if (!line.toLowerCase().includes('**instructions:**') && line.trim()) {
          instructions.push({ step: stepCounter, instruction: line.trim() });
          stepCounter++;
        }
      }
    }
  }

  return {
    title,
    ingredients,
    instructions,
    notes
  };
}

/**
 * Parse an ingredient string into amount, unit, and ingredient
 */
function parseIngredient(ingredientStr: string): { amount: string; unit: string; ingredient: string } {
  // Remove any italic formatting and clean up
  const cleaned = ingredientStr.replace(/\*([^*]+)\*/g, '$1')
                              .replace(/^\d+\s*-\s*/, '') // Remove leading numbers like "1 - "
                              .trim();

  // Common patterns for amounts and units
  const fractionMap: { [key: string]: string } = {
    '½': '1/2', '⅓': '1/3', '⅔': '2/3', '¼': '1/4', '¾': '3/4',
    '⅛': '1/8', '⅜': '3/8', '⅝': '5/8', '⅞': '7/8'
  };

  let normalized = cleaned;
  Object.entries(fractionMap).forEach(([symbol, fraction]) => {
    normalized = normalized.replace(new RegExp(symbol, 'g'), fraction);
  });

  // Enhanced unit patterns to catch more variations
  const unitPatterns = [
    // Standard measurements with explicit units
    /^(\d+(?:\/\d+)?(?:\s+\d+\/\d+)?)\s+(cups?|cup|tsp\.?|teaspoons?|tea\s+spoons?|tbsp\.?|tablespoons?|table\s+spoons?|lbs?\.?|pounds?|oz\.?|ounces?|packages?|pkg\.?|cans?|can|slices?|slice|sticks?|stick|cloves?|clove)\s+(.+)$/i,
    // Numbers with units but no space
    /^(\d+(?:\/\d+)?(?:\s+\d+\/\d+)?)([a-zA-Z]+\.?)\s+(.+)$/,
    // Just numbers followed by ingredient
    /^(\d+(?:\/\d+)?(?:\s+\d+\/\d+)?)\s+(.+)$/,
    // Everything else (no amount)
    /^(.+)$/
  ];

  for (const pattern of unitPatterns) {
    const match = normalized.match(pattern);
    if (match) {
      if (pattern.source.includes('cups?|cup|tsp') || pattern.source.includes('packages?|pkg')) {
        // Pattern with explicit unit
        return {
          amount: match[1].trim(),
          unit: match[2].trim(),
          ingredient: match[3].trim()
        };
      } else if (match.length === 4) {
        // Pattern with amount and possible unit
        const possibleUnit = match[2].trim();
        // Check if it's a real unit
        if (possibleUnit.match(/^(tsp|tbsp|cup|oz|lb|pkg|can|slice|stick|clove)s?\.?$/i)) {
          return {
            amount: match[1].trim(),
            unit: possibleUnit,
            ingredient: match[3].trim()
          };
        } else {
          // Not a unit, combine with ingredient
          return {
            amount: match[1].trim(),
            unit: '',
            ingredient: (possibleUnit + ' ' + match[3]).trim()
          };
        }
      } else if (match.length === 3) {
        // Pattern with amount but no explicit unit
        return {
          amount: match[1].trim(),
          unit: '',
          ingredient: match[2].trim()
        };
      } else {
        // No amount detected
        return {
          amount: '',
          unit: '',
          ingredient: match[1].trim()
        };
      }
    }
  }

  return {
    amount: '',
    unit: '',
    ingredient: cleaned
  };
}

/**
 * Convert parsed family recipe to Recipe format
 */
function familyRecipeToRecipe(parsed: ParsedFamilyRecipe, slug: string): Recipe {
  // Categorize based on recipe title/content
  const category = categorizeFamilyRecipe(parsed.title, parsed.ingredients);
  const difficulty = determineDifficulty(parsed.instructions.length, parsed.ingredients.length);
  
  return {
    slug,
    meta: {
      title: parsed.title,
      description: `A treasured family recipe for ${parsed.title.toLowerCase()}`,
      category,
      difficulty,
      servings: estimateServings(parsed.ingredients),
      times: {
        prep: '15 min',
        cook: '30 min',
        total: '45 min'
      },
      tags: generateTags(parsed.title, category),
      image: '/images/recipes/placeholder.svg',
      imageAlt: `${parsed.title} family recipe`,
      rating: 5.0,
      reviewCount: 1
    },
    ingredients: parsed.ingredients,
    instructions: parsed.instructions,
    notes: parsed.notes,
    variations: [],
    storage: undefined,
    nutrition: undefined
  };
}

/**
 * Categorize family recipe based on title and ingredients
 */
function categorizeFamilyRecipe(title: string, ingredients: Array<any>): string {
  const titleLower = title.toLowerCase();

  // Check ingredients for additional context
  const ingredientText = ingredients.map(ing => ing.ingredient.toLowerCase()).join(' ');

  if (titleLower.includes('breakfast') || titleLower.includes('biscuit') || titleLower.includes('muffin') ||
      titleLower.includes('scone') || titleLower.includes('pancake') || titleLower.includes('sausage casserole')) {
    return 'breakfast';
  }
  if (titleLower.includes('pie') || titleLower.includes('cake') || titleLower.includes('dessert') ||
      titleLower.includes('cookie') || titleLower.includes('cream') || titleLower.includes('custard') ||
      ingredientText.includes('sugar') && (ingredientText.includes('flour') || ingredientText.includes('eggs'))) {
    return 'dessert';
  }
  if (titleLower.includes('soup') || titleLower.includes('chowder') || titleLower.includes('broth')) {
    return 'soup';
  }
  if (titleLower.includes('salad') || titleLower.includes('dip') || titleLower.includes('appetizer') ||
      titleLower.includes('croquette') && !titleLower.includes('salmon')) {
    return 'appetizer';
  }
  if (titleLower.includes('bread') || titleLower.includes('roll') || titleLower.includes('biscuit')) {
    return 'bread';
  }
  if (titleLower.includes('casserole') || titleLower.includes('chicken') || titleLower.includes('beef') ||
      titleLower.includes('ham') || titleLower.includes('salmon') || titleLower.includes('catfish') ||
      titleLower.includes('spaghetti') || titleLower.includes('lasagne') || titleLower.includes('loaf') ||
      titleLower.includes('steak') || titleLower.includes('pepper') && titleLower.includes('stuffed') ||
      titleLower.includes('dressing') || titleLower.includes('rice') || titleLower.includes('noodle')) {
    return 'dinner';
  }
  if (titleLower.includes('sauce') || titleLower.includes('gravy') || titleLower.includes('honey')) {
    return 'condiment';
  }

  return 'family-recipe';
}

/**
 * Determine difficulty based on recipe complexity
 */
function determineDifficulty(instructionCount: number, ingredientCount: number): 'Easy' | 'Medium' | 'Hard' {
  const complexity = instructionCount + (ingredientCount * 0.5);
  
  if (complexity <= 8) return 'Easy';
  if (complexity <= 15) return 'Medium';
  return 'Hard';
}

/**
 * Estimate servings based on ingredients
 */
function estimateServings(ingredients: Array<any>): number {
  // Look for clues in ingredients
  for (const ing of ingredients) {
    const ingredient = ing.ingredient.toLowerCase();
    if (ingredient.includes('serves') || ingredient.includes('serving')) {
      const match = ingredient.match(/(\d+)/);
      if (match) return parseInt(match[1]);
    }
  }
  
  // Default estimation based on ingredient count
  if (ingredients.length <= 5) return 4;
  if (ingredients.length <= 10) return 6;
  return 8;
}

/**
 * Generate tags for family recipe
 */
function generateTags(title: string, category: string): string[] {
  const tags = ['family-recipe', 'traditional'];
  
  const titleLower = title.toLowerCase();
  if (titleLower.includes('southern')) tags.push('southern');
  if (titleLower.includes('holiday') || titleLower.includes('christmas')) tags.push('holiday');
  if (titleLower.includes('quick') || titleLower.includes('easy')) tags.push('quick');
  if (titleLower.includes('comfort')) tags.push('comfort-food');
  
  tags.push(category);
  
  return tags;
}

/**
 * Get all family recipes
 */
export async function getAllFamilyRecipes(): Promise<Recipe[]> {
  const files = fs.readdirSync(FAMILY_RECIPES_DIRECTORY);
  const recipes: Recipe[] = [];
  const parsingIssues: string[] = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      try {
        const filePath = path.join(FAMILY_RECIPES_DIRECTORY, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const slug = file.replace(/\.md$/, '');

        const parsed = parseFamilyRecipe(content, file);
        const recipe = familyRecipeToRecipe(parsed, slug);

        // Debug: Check for parsing issues
        if (!parsed.title || parsed.ingredients.length === 0) {
          parsingIssues.push(`${file}: Missing ${!parsed.title ? 'title' : ''} ${parsed.ingredients.length === 0 ? 'ingredients' : ''}`);
        }

        recipes.push(recipe);
      } catch (error) {
        console.error(`Error parsing family recipe ${file}:`, error);
        parsingIssues.push(`${file}: Parse error - ${error}`);
      }
    }
  }

  // Log parsing issues for debugging
  if (parsingIssues.length > 0) {
    console.log('Family recipe parsing issues:', parsingIssues);
  }

  return recipes.sort((a, b) => a.meta.title.localeCompare(b.meta.title));
}

/**
 * Get family recipe by slug
 */
export async function getFamilyRecipeBySlug(slug: string): Promise<Recipe | null> {
  const filePath = path.join(FAMILY_RECIPES_DIRECTORY, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = parseFamilyRecipe(content, `${slug}.md`);
  
  return familyRecipeToRecipe(parsed, slug);
}

/**
 * Convert family recipe to recipe card format
 */
export function familyRecipeToCard(recipe: Recipe): RecipeCard {
  return {
    slug: recipe.slug,
    title: recipe.meta.title,
    description: recipe.meta.description,
    category: recipe.meta.category,
    difficulty: recipe.meta.difficulty,
    totalTime: recipe.meta.times.total,
    servings: recipe.meta.servings,
    image: recipe.meta.image,
    imageAlt: recipe.meta.imageAlt,
    tags: recipe.meta.tags,
    rating: recipe.meta.rating || 5.0,
    reviewCount: recipe.meta.reviewCount || 1
  };
}
