import {
  scaleRecipe,
  recipeToCard,
  parseTimeToMinutes,
  formatTime,
  calculateTotalTime,
  filterRecipes,
  getFilterOptions,
  generateSlug,
  validateRecipe
} from '@/lib/recipe-utils';
import { Recipe, RecipeSearchFilters } from '@/types';

// Mock recipe data for testing
const mockRecipe: Recipe = {
  slug: 'test-recipe',
  meta: {
    title: 'Test Recipe',
    description: 'A test recipe for unit testing',
    category: 'test',
    difficulty: 'Easy',
    servings: 4,
    times: {
      prep: '15 min',
      cook: '30 min',
      total: '45 min'
    },
    tags: ['test', 'easy', 'quick'],
    author: 'Test Chef',
    dateCreated: '2024-01-01',
    image: '/test-image.jpg',
    imageAlt: 'Test recipe image',
    rating: 4.5,
    reviewCount: 10
  },
  ingredients: [
    { amount: '2', unit: 'cups', ingredient: 'flour' },
    { amount: '1', unit: 'tsp', ingredient: 'salt' },
    { amount: '0.5', unit: 'cup', ingredient: 'sugar' }
  ],
  instructions: [
    { step: 1, instruction: 'Mix dry ingredients' },
    { step: 2, instruction: 'Add wet ingredients' },
    { step: 3, instruction: 'Bake for 30 minutes' }
  ]
};

describe('recipe-utils', () => {
  describe('scaleRecipe', () => {
    it('should scale recipe ingredients correctly', () => {
      const scaledRecipe = scaleRecipe(mockRecipe, 8);
      
      expect(scaledRecipe.meta.servings).toBe(8);
      expect(scaledRecipe.scalingFactor).toBe(2);
      expect(scaledRecipe.originalServings).toBe(4);
      expect(scaledRecipe.ingredients[0].amount).toBe('4'); // 2 * 2
      expect(scaledRecipe.ingredients[2].amount).toBe('1'); // 0.5 * 2
    });

    it('should handle non-numeric amounts', () => {
      const recipeWithTextAmount: Recipe = {
        ...mockRecipe,
        ingredients: [
          { amount: 'a pinch', ingredient: 'salt' }
        ]
      };
      
      const scaledRecipe = scaleRecipe(recipeWithTextAmount, 8);
      expect(scaledRecipe.ingredients[0].amount).toBe('a pinch');
    });
  });

  describe('recipeToCard', () => {
    it('should convert recipe to card format', () => {
      const card = recipeToCard(mockRecipe);
      
      expect(card.slug).toBe(mockRecipe.slug);
      expect(card.title).toBe(mockRecipe.meta.title);
      expect(card.description).toBe(mockRecipe.meta.description);
      expect(card.category).toBe(mockRecipe.meta.category);
      expect(card.difficulty).toBe(mockRecipe.meta.difficulty);
      expect(card.totalTime).toBe(mockRecipe.meta.times.total);
      expect(card.servings).toBe(mockRecipe.meta.servings);
      expect(card.tags).toEqual(mockRecipe.meta.tags);
    });
  });

  describe('parseTimeToMinutes', () => {
    it('should parse various time formats', () => {
      expect(parseTimeToMinutes('30 min')).toBe(30);
      expect(parseTimeToMinutes('1 hour')).toBe(60);
      expect(parseTimeToMinutes('1h 30m')).toBe(90);
      expect(parseTimeToMinutes('2 hours 15 minutes')).toBe(135);
    });

    it('should handle edge cases', () => {
      expect(parseTimeToMinutes('')).toBe(0);
      expect(parseTimeToMinutes('invalid')).toBe(0);
    });
  });

  describe('formatTime', () => {
    it('should format minutes correctly', () => {
      expect(formatTime(30)).toBe('30 min');
      expect(formatTime(60)).toBe('1 hr');
      expect(formatTime(90)).toBe('1 hr 30 min');
      expect(formatTime(120)).toBe('2 hr');
    });
  });

  describe('calculateTotalTime', () => {
    it('should calculate total time from prep and cook times', () => {
      expect(calculateTotalTime('15 min', '30 min')).toBe('45 min');
      expect(calculateTotalTime('1 hour', '30 min')).toBe('1 hr 30 min');
    });
  });

  describe('filterRecipes', () => {
    const recipes = [mockRecipe];

    it('should filter by category', () => {
      const filters: RecipeSearchFilters = { category: 'test' };
      const filtered = filterRecipes(recipes, filters);
      expect(filtered).toHaveLength(1);

      const noMatchFilters: RecipeSearchFilters = { category: 'nonexistent' };
      const noMatch = filterRecipes(recipes, noMatchFilters);
      expect(noMatch).toHaveLength(0);
    });

    it('should filter by difficulty', () => {
      const filters: RecipeSearchFilters = { difficulty: ['Easy'] };
      const filtered = filterRecipes(recipes, filters);
      expect(filtered).toHaveLength(1);

      const noMatchFilters: RecipeSearchFilters = { difficulty: ['Hard'] };
      const noMatch = filterRecipes(recipes, noMatchFilters);
      expect(noMatch).toHaveLength(0);
    });

    it('should filter by max time', () => {
      const filters: RecipeSearchFilters = { maxTime: 60 };
      const filtered = filterRecipes(recipes, filters);
      expect(filtered).toHaveLength(1);

      const noMatchFilters: RecipeSearchFilters = { maxTime: 30 };
      const noMatch = filterRecipes(recipes, noMatchFilters);
      expect(noMatch).toHaveLength(0);
    });

    it('should filter by tags', () => {
      const filters: RecipeSearchFilters = { tags: ['easy'] };
      const filtered = filterRecipes(recipes, filters);
      expect(filtered).toHaveLength(1);

      const noMatchFilters: RecipeSearchFilters = { tags: ['difficult'] };
      const noMatch = filterRecipes(recipes, noMatchFilters);
      expect(noMatch).toHaveLength(0);
    });

    it('should filter by search query', () => {
      const filters: RecipeSearchFilters = { query: 'test' };
      const filtered = filterRecipes(recipes, filters);
      expect(filtered).toHaveLength(1);

      const noMatchFilters: RecipeSearchFilters = { query: 'nonexistent' };
      const noMatch = filterRecipes(recipes, noMatchFilters);
      expect(noMatch).toHaveLength(0);
    });
  });

  describe('getFilterOptions', () => {
    it('should extract filter options from recipes', () => {
      const options = getFilterOptions([mockRecipe]);
      
      expect(options.difficulties).toContain('Easy');
      expect(options.tags).toEqual(expect.arrayContaining(['test', 'easy', 'quick']));
      expect(options.maxTime).toBeGreaterThan(0);
    });
  });

  describe('generateSlug', () => {
    it('should generate valid slugs', () => {
      expect(generateSlug('Test Recipe')).toBe('test-recipe');
      expect(generateSlug('Recipe with Special Characters!')).toBe('recipe-with-special-characters');
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces');
    });
  });

  describe('validateRecipe', () => {
    it('should validate complete recipe', () => {
      const errors = validateRecipe(mockRecipe);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for incomplete recipe', () => {
      const incompleteRecipe = {
        meta: {
          title: '',
          category: '',
          difficulty: 'Easy',
          servings: 0,
          description: '',
          times: {
            prep: '',
            cook: '',
            total: ''
          },
          tags: []
        },
        ingredients: [],
        instructions: []
      } as Partial<Recipe>;

      const errors = validateRecipe(incompleteRecipe);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Category is required');
      expect(errors).toContain('Valid servings count is required');
      expect(errors).toContain('At least one ingredient is required');
      expect(errors).toContain('At least one instruction is required');
    });
  });
});
