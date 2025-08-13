import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from '@/components/ui/recipe-card';
import { RecipeCard as RecipeCardType } from '@/types';

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

const mockRecipe: RecipeCardType = {
  slug: 'test-recipe',
  title: 'Test Recipe',
  description: 'A delicious test recipe for unit testing',
  category: 'test',
  difficulty: 'Easy',
  totalTime: '30 min',
  servings: 4,
  image: '/test-image.jpg',
  imageAlt: 'Test recipe image',
  tags: ['test', 'easy', 'quick'],
  rating: 4.5,
  reviewCount: 10
};

describe('RecipeCard', () => {
  it('renders recipe information correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('A delicious test recipe for unit testing')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    
    const image = screen.getByAltText('Test recipe image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
  });

  it('renders fallback when no image provided', () => {
    const recipeWithoutImage = { ...mockRecipe, image: undefined };
    render(<RecipeCard recipe={recipeWithoutImage} />);
    
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('easy')).toBeInTheDocument();
  });

  it('handles favorite functionality when enabled', () => {
    const mockOnFavoriteClick = jest.fn();
    
    render(
      <RecipeCard 
        recipe={mockRecipe} 
        showFavorite={true}
        onFavoriteClick={mockOnFavoriteClick}
        isFavorited={false}
      />
    );
    
    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);
    
    expect(mockOnFavoriteClick).toHaveBeenCalledWith('test-recipe');
  });

  it('does not show favorite button when disabled', () => {
    render(<RecipeCard recipe={mockRecipe} showFavorite={false} />);
    
    const favoriteButtons = screen.queryAllByRole('button');
    expect(favoriteButtons).toHaveLength(0);
  });

  it('applies correct difficulty styling', () => {
    const { rerender } = render(<RecipeCard recipe={mockRecipe} />);
    
    expect(screen.getByText('Easy')).toHaveClass('border-green-500', 'text-green-700');
    
    const mediumRecipe = { ...mockRecipe, difficulty: 'Medium' as const };
    rerender(<RecipeCard recipe={mediumRecipe} />);
    
    expect(screen.getByText('Medium')).toHaveClass('border-savor-saffron', 'text-savor-saffron');
    
    const hardRecipe = { ...mockRecipe, difficulty: 'Hard' as const };
    rerender(<RecipeCard recipe={hardRecipe} />);
    
    expect(screen.getByText('Hard')).toHaveClass('border-savor-paprika', 'text-savor-paprika');
  });

  it('creates correct link to recipe page', () => {
    render(<RecipeCard recipe={mockRecipe} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/recipes/test-recipe');
  });

  it('shows limited tags with overflow indicator', () => {
    const recipeWithManyTags = {
      ...mockRecipe,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
    };
    
    render(<RecipeCard recipe={recipeWithManyTags} />);
    
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
    expect(screen.getByText('+3')).toBeInTheDocument();
  });

  it('handles missing rating gracefully', () => {
    const recipeWithoutRating = { 
      ...mockRecipe, 
      rating: undefined, 
      reviewCount: undefined 
    };
    
    render(<RecipeCard recipe={recipeWithoutRating} />);
    
    expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    expect(screen.queryByText('(10)')).not.toBeInTheDocument();
  });
});
