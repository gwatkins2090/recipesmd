'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Printer, Download, FileText, Eye, Check, X } from 'lucide-react';
import { Recipe } from '@/types';

interface PrintableRecipesProps {
  favorites: string[];
  userRecipes: any[];
}

export function PrintableRecipes({ favorites, userRecipes }: PrintableRecipesProps) {
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    instructions: [
      { instruction: 'Mix all ingredients together' },
      { instruction: 'Cook until done' },
    ],
  }));

  const availableRecipes = [...mockFavoriteRecipes, ...userRecipes];

  const selectedRecipeData = availableRecipes.filter((recipe) =>
    selectedRecipes.includes(recipe.slug || recipe.id)
  );

  const toggleRecipeSelection = (recipeId: string) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  const selectAll = () => {
    setSelectedRecipes(availableRecipes.map((recipe) => recipe.slug || recipe.id));
  };

  const clearSelection = () => {
    setSelectedRecipes([]);
  };

  const handlePrint = () => {
    if (selectedRecipeData.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = generatePrintHTML(selectedRecipeData);
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    // For a real implementation, you'd use a library like jsPDF or Puppeteer
    // For now, we'll create a downloadable HTML file
    const htmlContent = generatePrintHTML(selectedRecipeData);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'savor-recipes.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrintHTML = (recipesToPrint: any[]) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Savor Recipes</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        .recipe { page-break-after: always; margin-bottom: 40px; }
        .recipe:last-child { page-break-after: auto; }
        .recipe-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #E8B86D; padding-bottom: 10px; }
        .recipe-meta { display: flex; gap: 20px; margin-bottom: 20px; font-size: 14px; color: #666; }
        .recipe-description { margin-bottom: 20px; font-style: italic; }
        .section-title { font-size: 18px; font-weight: bold; margin: 20px 0 10px 0; color: #8B7355; }
        .ingredients { list-style: none; padding: 0; }
        .ingredients li { margin-bottom: 5px; padding-left: 20px; position: relative; }
        .ingredients li:before { content: "•"; position: absolute; left: 0; color: #E8B86D; font-weight: bold; }
        .instructions { list-style: none; padding: 0; }
        .instructions li { margin-bottom: 15px; padding-left: 30px; position: relative; }
        .instructions .step-number { position: absolute; left: 0; top: 0; background: #E8B86D; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
        .tags { margin-top: 20px; }
        .tag { display: inline-block; background: #f0f0f0; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; }
        .notes { background: #f9f9f9; padding: 15px; border-left: 4px solid #E8B86D; margin-top: 20px; }
        @media print {
            body { margin: 20px; }
            .recipe { page-break-after: always; }
        }
    </style>
</head>
<body>
    <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #8B7355; margin-bottom: 5px;">Savor</h1>
        <p style="color: #666; font-style: italic;">Every recipe tells a story</p>
        <p style="color: #666; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    ${recipesToPrint
      .map(
        (recipe) => `
        <div class="recipe">
            <h2 class="recipe-title">${recipe.meta?.title || recipe.title}</h2>
            
            <div class="recipe-meta">
                <span><strong>Category:</strong> ${recipe.meta?.category || recipe.category}</span>
                <span><strong>Difficulty:</strong> ${recipe.meta?.difficulty || recipe.difficulty}</span>
                <span><strong>Servings:</strong> ${recipe.meta?.servings || recipe.servings}</span>
                <span><strong>Prep:</strong> ${recipe.meta?.times?.prep || recipe.prepTime || 'N/A'}</span>
                <span><strong>Cook:</strong> ${recipe.meta?.times?.cook || recipe.cookTime || 'N/A'}</span>
            </div>
            
            ${
              recipe.meta?.description || recipe.description
                ? `
                <div class="recipe-description">
                    ${recipe.meta?.description || recipe.description}
                </div>
            `
                : ''
            }
            
            <h3 class="section-title">Ingredients</h3>
            <ul class="ingredients">
                ${recipe.ingredients
                  .map(
                    (ing) => `
                    <li>${ing.amount} ${ing.unit || ''} ${ing.ingredient}</li>
                `
                  )
                  .join('')}
            </ul>
            
            <h3 class="section-title">Instructions</h3>
            <ol class="instructions">
                ${recipe.instructions
                  .map(
                    (inst, index) => `
                    <li>
                        <span class="step-number">${index + 1}</span>
                        ${inst.instruction}
                    </li>
                `
                  )
                  .join('')}
            </ol>
            
            ${
              recipe.meta?.tags?.length || recipe.tags?.length
                ? `
                <div class="tags">
                    <strong>Tags:</strong>
                    ${(recipe.meta?.tags || recipe.tags || []).map((tag) => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `
                : ''
            }
            
            ${
              recipe.notes
                ? `
                <div class="notes">
                    <strong>Notes:</strong><br>
                    ${recipe.notes}
                </div>
            `
                : ''
            }
        </div>
    `
      )
      .join('')}
</body>
</html>`;
  };

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
          <Printer className='h-6 w-6 text-savor-saffron' />
          Print & Export Recipes
        </h2>
        <p className='text-muted-foreground'>
          Create kitchen-friendly printouts of your favorite recipes
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Recipe Selection */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Select Recipes to Print</span>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>{selectedRecipes.length} selected</Badge>
                {availableRecipes.length > 0 && (
                  <div className='flex gap-1'>
                    <Button variant='outline' size='sm' onClick={selectAll}>
                      <Check className='h-4 w-4' />
                    </Button>
                    <Button variant='outline' size='sm' onClick={clearSelection}>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableRecipes.length === 0 ? (
              <div className='py-8 text-center'>
                <FileText className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
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
          </CardContent>
        </Card>

        {/* Print Options */}
        <Card>
          <CardHeader>
            <CardTitle>Print Options</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRecipes.length === 0 ? (
              <div className='py-8 text-center'>
                <Printer className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                <p className='text-muted-foreground'>Select recipes to see print options.</p>
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='rounded-lg bg-savor-cream/20 p-4'>
                  <h4 className='mb-2 font-medium text-savor-charcoal'>Ready to Print</h4>
                  <p className='mb-3 text-sm text-muted-foreground'>
                    {selectedRecipes.length} recipe{selectedRecipes.length !== 1 ? 's' : ''}{' '}
                    selected for printing
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {selectedRecipeData.slice(0, 3).map((recipe) => (
                      <Badge key={recipe.slug || recipe.id} variant='secondary'>
                        {recipe.meta?.title || recipe.title}
                      </Badge>
                    ))}
                    {selectedRecipeData.length > 3 && (
                      <Badge variant='secondary'>+{selectedRecipeData.length - 3} more</Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <Button
                    onClick={handlePrint}
                    className='w-full bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                  >
                    <Printer className='mr-2 h-4 w-4' />
                    Print Recipes
                  </Button>

                  <Button variant='outline' onClick={handleDownloadPDF} className='w-full'>
                    <Download className='mr-2 h-4 w-4' />
                    Download as HTML
                  </Button>

                  <Button
                    variant='outline'
                    onClick={() => setShowPreview(!showPreview)}
                    className='w-full'
                  >
                    <Eye className='mr-2 h-4 w-4' />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>

                {showPreview && (
                  <div className='mt-4 max-h-96 overflow-y-auto rounded-lg border bg-white p-4'>
                    <h4 className='mb-3 font-medium text-savor-charcoal'>Print Preview</h4>
                    <div className='space-y-4 text-sm'>
                      {selectedRecipeData.slice(0, 2).map((recipe, index) => (
                        <div key={recipe.slug || recipe.id} className='border-b pb-3'>
                          <h5 className='font-medium'>{recipe.meta?.title || recipe.title}</h5>
                          <p className='text-xs text-muted-foreground'>
                            {recipe.meta?.category || recipe.category} •{' '}
                            {recipe.ingredients.length} ingredients
                          </p>
                        </div>
                      ))}
                      {selectedRecipeData.length > 2 && (
                        <p className='text-xs text-muted-foreground'>
                          ...and {selectedRecipeData.length - 2} more recipes
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
