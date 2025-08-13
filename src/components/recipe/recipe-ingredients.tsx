'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Users } from 'lucide-react';
import { RecipeIngredient } from '@/types';
import { scaleRecipe } from '@/lib/recipe-utils';

interface RecipeIngredientsProps {
  ingredients: RecipeIngredient[];
  servings: number;
}

export function RecipeIngredients({ ingredients, servings }: RecipeIngredientsProps) {
  const [currentServings, setCurrentServings] = useState(servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const scalingFactor = currentServings / servings;
  
  const scaledIngredients = ingredients.map(ingredient => {
    const amount = parseFloat(ingredient.amount);
    if (isNaN(amount)) {
      return ingredient; // Return as-is if amount is not numeric
    }
    
    const scaledAmount = (amount * scalingFactor).toFixed(2);
    return {
      ...ingredient,
      amount: scaledAmount.endsWith('.00') ? scaledAmount.slice(0, -3) : scaledAmount
    };
  });

  const handleServingsChange = (newServings: number) => {
    if (newServings > 0 && newServings <= 20) {
      setCurrentServings(newServings);
    }
  };

  const handleIngredientCheck = (index: number, checked: boolean) => {
    const newChecked = new Set(checkedIngredients);
    if (checked) {
      newChecked.add(index);
    } else {
      newChecked.delete(index);
    }
    setCheckedIngredients(newChecked);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Ingredients</span>
            <Badge variant="secondary" className="ml-2">
              {ingredients.length} items
            </Badge>
          </CardTitle>
          
          {/* Serving size adjuster */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-muted-foreground">Servings:</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleServingsChange(currentServings - 1)}
                disabled={currentServings <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="flex items-center space-x-1 min-w-[60px] justify-center">
                <Users className="h-4 w-4 text-savor-sage" />
                <span className="font-medium">{currentServings}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleServingsChange(currentServings + 1)}
                disabled={currentServings >= 20}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {scalingFactor !== 1 && (
          <p className="text-sm text-muted-foreground">
            Ingredients scaled for {currentServings} serving{currentServings !== 1 ? 's' : ''} 
            (original recipe serves {servings})
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {scaledIngredients.map((ingredient, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`ingredient-${index}`}
                checked={checkedIngredients.has(index)}
                onCheckedChange={(checked) => handleIngredientCheck(index, checked as boolean)}
                className="mt-1"
              />
              
              <label
                htmlFor={`ingredient-${index}`}
                className={`flex-1 cursor-pointer text-sm leading-relaxed ${
                  checkedIngredients.has(index) 
                    ? 'line-through text-muted-foreground' 
                    : 'text-foreground'
                }`}
              >
                <span className="font-medium text-savor-saffron">
                  {ingredient.amount}
                  {ingredient.unit && ` ${ingredient.unit}`}
                </span>
                {' '}
                <span>{ingredient.ingredient}</span>
                {ingredient.notes && (
                  <span className="text-muted-foreground italic">
                    {' '}({ingredient.notes})
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
        
        {/* Shopping list helper */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {checkedIngredients.size} of {ingredients.length} ingredients checked
            </span>
            
            {checkedIngredients.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCheckedIngredients(new Set())}
                className="text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
          
          {checkedIngredients.size === ingredients.length && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                🎉 All ingredients ready! You're set to start cooking.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
