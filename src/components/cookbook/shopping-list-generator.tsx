'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Trash2, Download, Check, X } from 'lucide-react';
import { Recipe } from '@/types';

interface ShoppingListGeneratorProps {
  favorites: string[];
  userRecipes: any[];
}

interface ShoppingItem {
  id: string;
  amount: string;
  unit: string;
  ingredient: string;
  checked: boolean;
  recipeTitle: string;
}

export function ShoppingListGenerator({ favorites, userRecipes }: ShoppingListGeneratorProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // No need to load recipes from server in client component

  // Get available recipes (mock favorites + user recipes)
  const mockFavoriteRecipes = favorites.map((slug, index) => ({
    slug,
    meta: {
      title: `Favorite Recipe ${index + 1}`,
      category: ['breakfast', 'italian', 'dessert', 'mexican'][index % 4],
      servings: 4,
    },
    ingredients: [
      { amount: '2', unit: 'cups', ingredient: 'flour' },
      { amount: '1', unit: 'tsp', ingredient: 'salt' },
      { amount: '3', unit: '', ingredient: 'eggs' },
    ],
  }));

  const availableRecipes = [...mockFavoriteRecipes, ...userRecipes];

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const generateShoppingList = () => {
    const items: ShoppingItem[] = [];

    selectedRecipes.forEach((recipeId) => {
      const recipe = availableRecipes.find((r) => r.slug === recipeId || r.id === recipeId);
      if (recipe) {
        recipe.ingredients.forEach((ingredient: any, index: number) => {
          items.push({
            id: `${recipeId}-${index}`,
            amount: ingredient.amount,
            unit: ingredient.unit || '',
            ingredient: ingredient.ingredient,
            checked: false,
            recipeTitle: recipe.meta?.title || recipe.title,
          });
        });
      }
    });

    setShoppingList(items);
  };

  const toggleItemCheck = (itemId: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item))
    );
  };

  const removeItem = (itemId: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearList = () => {
    setShoppingList([]);
    setSelectedRecipes([]);
  };

  const exportList = () => {
    const listText = shoppingList
      .map((item) => `${item.checked ? '✓' : '☐'} ${item.amount} ${item.unit} ${item.ingredient}`)
      .join('\n');

    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const checkedCount = shoppingList.filter((item) => item.checked).length;
  const totalCount = shoppingList.length;

  if (isLoading) {
    return (
      <div className='py-12 text-center'>
        <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-savor-saffron'></div>
        <p className='text-muted-foreground'>Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 flex items-center justify-center gap-2 text-2xl font-bold text-savor-charcoal'>
          <ShoppingCart className='h-6 w-6 text-savor-saffron' />
          Shopping List Generator
        </h2>
        <p className='text-muted-foreground'>
          Select recipes to generate a combined shopping list
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recipe Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Select Recipes</span>
              <Badge variant='secondary'>{selectedRecipes.length} selected</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableRecipes.length === 0 ? (
              <div className='py-8 text-center'>
                <ShoppingCart className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                <p className='mb-4 text-muted-foreground'>
                  No recipes available. Add some favorites or upload your own recipes first.
                </p>
                <Button onClick={() => (window.location.href = '/recipes')}>Browse Recipes</Button>
              </div>
            ) : (
              <div className='max-h-96 space-y-3 overflow-y-auto'>
                {availableRecipes.map((recipe) => (
                  <div
                    key={recipe.slug || recipe.id}
                    className='flex cursor-pointer items-center space-x-3 rounded-lg border p-3 hover:bg-savor-cream/20'
                    onClick={() => toggleRecipeSelection(recipe.slug || recipe.id)}
                  >
                    <Checkbox
                      checked={selectedRecipes.includes(recipe.slug || recipe.id)}
                      onChange={() => {}} // Handled by parent click
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium text-savor-charcoal'>
                        {recipe.meta?.title || recipe.title}
                      </h4>
                      <p className='text-sm text-muted-foreground'>
                        {recipe.meta?.category || recipe.category} • {recipe.ingredients.length}{' '}
                        ingredients
                      </p>
                    </div>
                    <Badge variant='outline'>
                      {recipe.meta?.servings || recipe.servings} servings
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {selectedRecipes.length > 0 && (
              <div className='mt-4 border-t pt-4'>
                <Button
                  onClick={generateShoppingList}
                  className='w-full bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Generate Shopping List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shopping List */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Shopping List</span>
              {totalCount > 0 && (
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>
                    {checkedCount}/{totalCount} checked
                  </Badge>
                  <Button variant='outline' size='sm' onClick={clearList}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shoppingList.length === 0 ? (
              <div className='py-8 text-center'>
                <ShoppingCart className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                <p className='text-muted-foreground'>
                  Select recipes and generate a shopping list to get started.
                </p>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className='mb-4'>
                  <div className='mb-2 flex items-center justify-between text-sm text-muted-foreground'>
                    <span>Progress</span>
                    <span>
                      {checkedCount} of {totalCount} items
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-savor-saffron transition-all duration-300'
                      style={{
                        width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Shopping Items */}
                <div className='max-h-96 space-y-2 overflow-y-auto'>
                  {shoppingList.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center space-x-3 rounded-lg border p-3 ${
                        item.checked ? 'border-green-200 bg-green-50' : 'hover:bg-savor-cream/20'
                      }`}
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItemCheck(item.id)}
                      />
                      <div
                        className={`flex-1 ${item.checked ? 'text-muted-foreground line-through' : ''}`}
                      >
                        <span className='font-medium'>
                          {item.amount} {item.unit} {item.ingredient}
                        </span>
                        <p className='text-xs text-muted-foreground'>from {item.recipeTitle}</p>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeItem(item.id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <Separator className='my-4' />
                <div className='flex gap-2'>
                  <Button variant='outline' onClick={exportList} className='flex-1'>
                    <Download className='mr-2 h-4 w-4' />
                    Export List
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setShoppingList((prev) =>
                        prev.map((item) => ({ ...item, checked: !prev.every((i) => i.checked) }))
                      );
                    }}
                  >
                    {checkedCount === totalCount ? (
                      <X className='h-4 w-4' />
                    ) : (
                      <Check className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
