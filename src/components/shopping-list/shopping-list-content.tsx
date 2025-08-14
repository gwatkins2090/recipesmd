'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Download, 
  Share2,
  Check,
  X,
  ShoppingCart,
  Package
} from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  purchased: boolean;
  recipeSource?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
  updatedAt: string;
}

interface ShoppingListContentProps {
  list: ShoppingList;
  onAddItem: (item: Omit<ShoppingItem, 'id'>) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onRemoveItem: (itemId: string) => void;
  onExport: () => void;
}

const STORE_CATEGORIES = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Pantry & Dry Goods',
  'Frozen',
  'Bakery',
  'Beverages',
  'Snacks',
  'Health & Beauty',
  'Other'
];

export function ShoppingListContentComponent({ 
  list, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem, 
  onExport 
}: ShoppingListContentProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'Other'
  });
  const [viewMode, setViewMode] = useState<'all' | 'category'>('category');

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;

    onAddItem({
      name: newItem.name.trim(),
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
      purchased: false
    });

    setNewItem({ name: '', quantity: '', unit: '', category: 'Other' });
    setIsAddingItem(false);
  };

  const toggleItemPurchased = (itemId: string, purchased: boolean) => {
    onUpdateItem(itemId, { purchased });
  };

  const purchasedCount = list.items.filter(item => item.purchased).length;
  const totalCount = list.items.length;
  const progressPercentage = totalCount > 0 ? (purchasedCount / totalCount) * 100 : 0;

  // Group items by category
  const itemsByCategory = STORE_CATEGORIES.reduce((acc, category) => {
    acc[category] = list.items.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="space-y-6">
      {/* List Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-savor-charcoal">{list.name}</h2>
              <p className="text-sm text-muted-foreground">
                {purchasedCount} of {totalCount} items completed
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingItem(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Shopping Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-savor-saffron h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={viewMode === 'category' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('category')}
            >
              <Package className="mr-2 h-4 w-4" />
              By Category
            </Button>
            <Button
              variant={viewMode === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('all')}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              All Items
            </Button>
          </div>

          {/* Add Item Form */}
          {isAddingItem && (
            <Card className="mb-4 border-savor-saffron/20 bg-savor-saffron/5">
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-4">
                  <Input
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="sm:col-span-2"
                  />
                  <Input
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                  <Select 
                    value={newItem.category} 
                    onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STORE_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={handleAddItem}>
                    <Check className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setIsAddingItem(false);
                      setNewItem({ name: '', quantity: '', unit: '', category: 'Other' });
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Shopping Items */}
      {totalCount === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-savor-charcoal mb-2">
              Empty Shopping List
            </h3>
            <p className="text-muted-foreground mb-6">
              Add items to your shopping list to get started.
            </p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'category' ? (
        // Category View
        <div className="space-y-4">
          {STORE_CATEGORIES.map(category => {
            const categoryItems = itemsByCategory[category];
            if (categoryItems.length === 0) return null;

            const categoryPurchased = categoryItems.filter(item => item.purchased).length;
            
            return (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{category}</span>
                    <Badge variant="secondary">
                      {categoryPurchased}/{categoryItems.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryItems.map(item => (
                      <div 
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          item.purchased 
                            ? 'bg-green-50 border-green-200' 
                            : 'hover:bg-savor-cream/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={item.purchased}
                            onCheckedChange={(checked) => 
                              toggleItemPurchased(item.id, checked as boolean)
                            }
                          />
                          <div className={item.purchased ? 'line-through text-muted-foreground' : ''}>
                            <span className="font-medium">{item.name}</span>
                            {item.quantity && (
                              <span className="text-sm text-muted-foreground ml-2">
                                {item.quantity} {item.unit}
                              </span>
                            )}
                            {item.recipeSource && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                from {item.recipeSource}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        // All Items View
        <Card>
          <CardHeader>
            <CardTitle>All Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {list.items.map(item => (
                <div 
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.purchased 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-savor-cream/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={item.purchased}
                      onCheckedChange={(checked) => 
                        toggleItemPurchased(item.id, checked as boolean)
                      }
                    />
                    <div className={item.purchased ? 'line-through text-muted-foreground' : ''}>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {item.quantity} {item.unit}
                        </span>
                      )}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {item.category}
                      </Badge>
                      {item.recipeSource && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          from {item.recipeSource}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
