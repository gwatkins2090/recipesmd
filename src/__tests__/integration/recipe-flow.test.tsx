import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RecipeGrid } from '@/components/recipes/recipe-grid';
import { Recipe } from '@/types';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  );
});

const mockRecipes: Recipe[] = [
  {
    slug: 'chocolate-chip-cookies',
    meta: {
      title: 'Chocolate Chip Cookies',
      description: 'Classic chocolate chip cookies',
      category: 'dessert',
      difficulty: 'Easy',
      servings: 24,
      times: {
        prep: '15 min',
        cook: '12 min',
        total: '27 min'
      },
      tags: ['cookies', 'dessert', 'baking'],
      rating: 4.9,
      reviewCount: 342
    },
    ingredients: [
      { amount: '2¼', unit: 'cups', ingredient: 'all-purpose flour' },
      { amount: '1', unit: 'tsp', ingredient: 'baking soda' },
      { amount: '2', unit: 'cups', ingredient: 'chocolate chips' }
    ],
    instructions: [
      { step: 1, instruction: 'Preheat oven to 375°F' },
      { step: 2, instruction: 'Mix dry ingredients' },
      { step: 3, instruction: 'Bake for 9-11 minutes' }
    ]
  },
  {
    slug: 'spaghetti-carbonara',
    meta: {
      title: 'Spaghetti Carbonara',
      description: 'Authentic Italian carbonara',
      category: 'italian',
      difficulty: 'Medium',
      servings: 4,
      times: {
        prep: '10 min',
        cook: '15 min',
        total: '25 min'
      },
      tags: ['pasta', 'italian', 'dinner'],
      rating: 4.8,
      reviewCount: 156
    },
    ingredients: [
      { amount: '1', unit: 'pound', ingredient: 'spaghetti' },
      { amount: '6', unit: 'ounces', ingredient: 'pancetta' },
      { amount: '4', unit: 'large', ingredient: 'egg yolks' }
    ],
    instructions: [
      { step: 1, instruction: 'Cook spaghetti according to package directions' },
      { step: 2, instruction: 'Cook pancetta until crispy' },
      { step: 3, instruction: 'Combine with egg mixture' }
    ]
  }
];

describe('Recipe Flow Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('displays recipes in grid format', () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    expect(screen.getByText('Chocolate Chip Cookies')).toBeInTheDocument();
    expect(screen.getByText('Spaghetti Carbonara')).toBeInTheDocument();
    expect(screen.getByText('2 Recipes')).toBeInTheDocument();
  });

  it('sorts recipes by different criteria', async () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    // Find and click the sort dropdown
    const sortSelect = screen.getByDisplayValue('Name');
    fireEvent.click(sortSelect);
    
    // Select difficulty sorting
    const difficultyOption = screen.getByText('Difficulty');
    fireEvent.click(difficultyOption);
    
    await waitFor(() => {
      const recipeCards = screen.getAllByRole('link');
      // Easy difficulty should come first
      expect(recipeCards[0]).toHaveAttribute('href', '/recipes/chocolate-chip-cookies');
    });
  });

  it('handles favorite functionality', async () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    // Find favorite buttons
    const favoriteButtons = screen.getAllByRole('button');
    const firstFavoriteButton = favoriteButtons[0];
    
    // Click to favorite
    fireEvent.click(firstFavoriteButton);
    
    await waitFor(() => {
      // Check if localStorage was called
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'savor-favorites',
        expect.stringContaining('chocolate-chip-cookies')
      );
    });
  });

  it('shows empty state when no recipes', () => {
    render(<RecipeGrid recipes={[]} />);
    
    expect(screen.getByText('No recipes found')).toBeInTheDocument();
    expect(screen.getByText('We\'re working on adding more delicious recipes to this category. Check back soon!')).toBeInTheDocument();
  });

  it('displays recipe metadata correctly', () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    // Check for time display
    expect(screen.getByText('27 min')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    
    // Check for servings
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    
    // Check for ratings
    expect(screen.getByText('4.9')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
  });

  it('creates correct links to recipe pages', () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/recipes/chocolate-chip-cookies');
    expect(links[1]).toHaveAttribute('href', '/recipes/spaghetti-carbonara');
  });

  it('displays difficulty badges with correct styling', () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    const easyBadge = screen.getByText('Easy');
    const mediumBadge = screen.getByText('Medium');
    
    expect(easyBadge).toHaveClass('border-green-500', 'text-green-700');
    expect(mediumBadge).toHaveClass('border-savor-saffron', 'text-savor-saffron');
  });

  it('handles recipe tags display', () => {
    render(<RecipeGrid recipes={mockRecipes} />);
    
    expect(screen.getByText('cookies')).toBeInTheDocument();
    expect(screen.getByText('dessert')).toBeInTheDocument();
    expect(screen.getByText('pasta')).toBeInTheDocument();
    expect(screen.getByText('italian')).toBeInTheDocument();
  });
});
