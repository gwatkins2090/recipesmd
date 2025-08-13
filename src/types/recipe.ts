export interface RecipeIngredient {
  amount: string;
  unit?: string;
  ingredient: string;
  notes?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
  time?: string;
  temperature?: string;
}

export interface RecipeNutrition {
  calories?: number;
  protein?: string;
  carbs?: string;
  fat?: string;
  fiber?: string;
  sugar?: string;
  sodium?: string;
}

export interface RecipeTimes {
  prep: string;
  cook: string;
  total: string;
  rest?: string;
}

export interface RecipeMeta {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  cuisine?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  times: RecipeTimes;
  tags: string[];
  author?: string;
  dateCreated?: string;
  dateModified?: string;
  image?: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Recipe {
  slug: string;
  meta: RecipeMeta;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  nutrition?: RecipeNutrition;
  notes?: string[];
  variations?: string[];
  storage?: string;
  content?: string; // Raw markdown content
}

export interface RecipeCategory {
  name: string;
  slug: string;
  description: string;
  image?: string;
  recipeCount: number;
}

export interface RecipeSearchFilters {
  category?: string;
  difficulty?: string[];
  maxTime?: number;
  tags?: string[];
  cuisine?: string[];
  query?: string;
}

export interface RecipeSearchResult {
  recipes: Recipe[];
  totalCount: number;
  categories: RecipeCategory[];
  availableFilters: {
    difficulties: string[];
    cuisines: string[];
    tags: string[];
    maxTime: number;
  };
}

// Utility types for recipe scaling
export interface ScaledRecipe extends Recipe {
  scalingFactor: number;
  originalServings: number;
}

// Type for recipe card display
export interface RecipeCard {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  totalTime: string;
  servings: number;
  image?: string;
  imageAlt?: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
}

// Type for featured recipes on homepage
export interface FeaturedRecipe extends RecipeCard {
  featured: true;
  featuredReason?: string;
}
