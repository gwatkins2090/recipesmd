'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Save, Clock, Users } from 'lucide-react';

interface RecipeUploadProps {
  onRecipeUpload: (recipe: any) => void;
}

export function RecipeUpload({ onRecipeUpload }: RecipeUploadProps) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    tags: [] as string[],
    ingredients: [{ amount: '', unit: '', ingredient: '' }],
    instructions: [{ step: 1, instruction: '' }],
    notes: ''
  });

  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'breakfast', 'lunch', 'dinner', 'dessert', 'snack',
    'italian', 'mexican', 'asian', 'american', 'mediterranean',
    'vegetarian', 'vegan', 'gluten-free', 'keto', 'paleo'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { amount: '', unit: '', ingredient: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, { 
        step: prev.instructions.length + 1, 
        instruction: '' 
      }]
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions
        .filter((_, i) => i !== index)
        .map((inst, i) => ({ ...inst, step: i + 1 }))
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? { ...inst, instruction: value } : inst
      )
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
      setRecipe(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newRecipe = {
        ...recipe,
        id: Date.now(),
        dateCreated: new Date().toISOString(),
        slug: recipe.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        image: '/images/recipes/placeholder.svg',
        imageAlt: `${recipe.title} recipe image`,
        rating: 0,
        reviewCount: 0
      };

      onRecipeUpload(newRecipe);
      
      // Reset form
      setRecipe({
        title: '',
        description: '',
        category: '',
        difficulty: '',
        servings: '',
        prepTime: '',
        cookTime: '',
        tags: [],
        ingredients: [{ amount: '', unit: '', ingredient: '' }],
        instructions: [{ step: 1, instruction: '' }],
        notes: ''
      });

      alert('Recipe uploaded successfully!');
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert('Error uploading recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-savor-saffron" />
            Add New Recipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Recipe Title *</Label>
                <Input
                  id="title"
                  value={recipe.title}
                  onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter recipe title"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={recipe.category} 
                  onValueChange={(value) => setRecipe(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={recipe.description}
                onChange={(e) => setRecipe(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your recipe"
                rows={3}
              />
            </div>

            {/* Recipe Details */}
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={recipe.difficulty} 
                  onValueChange={(value) => setRecipe(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="servings" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Servings
                </Label>
                <Input
                  id="servings"
                  type="number"
                  value={recipe.servings}
                  onChange={(e) => setRecipe(prev => ({ ...prev, servings: e.target.value }))}
                  placeholder="4"
                  min="1"
                />
              </div>
              
              <div>
                <Label htmlFor="prepTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Prep Time
                </Label>
                <Input
                  id="prepTime"
                  value={recipe.prepTime}
                  onChange={(e) => setRecipe(prev => ({ ...prev, prepTime: e.target.value }))}
                  placeholder="15 min"
                />
              </div>
              
              <div>
                <Label htmlFor="cookTime" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Cook Time
                </Label>
                <Input
                  id="cookTime"
                  value={recipe.cookTime}
                  onChange={(e) => setRecipe(prev => ({ ...prev, cookTime: e.target.value }))}
                  placeholder="30 min"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Ingredients *</Label>
                <Button type="button" onClick={addIngredient} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                      className="w-24"
                    />
                    <Input
                      placeholder="Unit"
                      value={ingredient.unit}
                      onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                      className="w-24"
                    />
                    <Input
                      placeholder="Ingredient"
                      value={ingredient.ingredient}
                      onChange={(e) => updateIngredient(index, 'ingredient', e.target.value)}
                      className="flex-1"
                      required
                    />
                    {recipe.ingredients.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Instructions *</Label>
                <Button type="button" onClick={addInstruction} size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-savor-saffron text-white font-semibold text-sm">
                      {instruction.step}
                    </div>
                    <Textarea
                      placeholder="Describe this step..."
                      value={instruction.instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="flex-1"
                      rows={2}
                      required
                    />
                    {recipe.instructions.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeInstruction(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={recipe.notes}
                onChange={(e) => setRecipe(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional tips, variations, or notes about this recipe"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting || !recipe.title || !recipe.category}
                className="bg-savor-saffron hover:bg-savor-saffron/90 text-savor-charcoal"
              >
                <Save className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Saving...' : 'Save Recipe'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
