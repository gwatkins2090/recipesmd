import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeNutrition as RecipeNutritionType } from '@/types';

interface RecipeNutritionProps {
  nutrition: RecipeNutritionType;
}

export function RecipeNutrition({ nutrition }: RecipeNutritionProps) {
  const nutritionItems = [
    { label: 'Calories', value: nutrition.calories, unit: '', highlight: true },
    { label: 'Protein', value: nutrition.protein, unit: '', color: 'text-blue-600' },
    { label: 'Carbs', value: nutrition.carbs, unit: '', color: 'text-orange-600' },
    { label: 'Fat', value: nutrition.fat, unit: '', color: 'text-green-600' },
    { label: 'Fiber', value: nutrition.fiber, unit: '', color: 'text-purple-600' },
    { label: 'Sugar', value: nutrition.sugar, unit: '', color: 'text-pink-600' },
    { label: 'Sodium', value: nutrition.sodium, unit: '', color: 'text-red-600' },
  ].filter(item => item.value !== undefined);

  if (nutritionItems.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Nutrition Facts</span>
          <Badge variant="secondary" className="text-xs">
            Per serving
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Calories - highlighted */}
          {nutrition.calories && (
            <div className="p-3 bg-savor-saffron/10 rounded-lg border border-savor-saffron/20">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-savor-charcoal">Calories</span>
                <span className="text-2xl font-bold text-savor-saffron">
                  {nutrition.calories}
                </span>
              </div>
            </div>
          )}
          
          {/* Other nutrition info */}
          <div className="grid grid-cols-2 gap-3">
            {nutritionItems.slice(1).map((item) => (
              <div key={item.label} className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </div>
                <div className={`font-semibold ${item.color || 'text-foreground'}`}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          
          {/* Disclaimer */}
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground leading-relaxed">
              * Nutritional values are approximate and may vary depending on the specific 
              ingredients and brands used.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
