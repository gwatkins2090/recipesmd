'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Download,
  Share2,
  Check,
  X,
  Save,
  BookOpen,
  ChefHat,
} from 'lucide-react';
import { ShoppingListContentComponent } from './shopping-list-content';

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
  'Other',
];

export function ShoppingListManager() {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingListName, setEditingListName] = useState('');

  // Load shopping lists from localStorage
  useEffect(() => {
    const savedLists = localStorage.getItem('savor-shopping-lists');
    if (savedLists) {
      const lists = JSON.parse(savedLists);
      setShoppingLists(lists);

      // Check for list parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const listParam = urlParams.get('list');

      if (listParam && lists.find((list: any) => list.id === listParam)) {
        setActiveListId(listParam);
      } else if (lists.length > 0 && !activeListId) {
        setActiveListId(lists[0].id);
      }
    }
  }, [activeListId]);

  // Save shopping lists to localStorage
  const saveShoppingLists = (lists: ShoppingList[]) => {
    setShoppingLists(lists);
    localStorage.setItem('savor-shopping-lists', JSON.stringify(lists));
  };

  const createNewList = () => {
    if (!newListName.trim()) return;

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName.trim(),
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedLists = [...shoppingLists, newList];
    saveShoppingLists(updatedLists);
    setActiveListId(newList.id);
    setNewListName('');
    setIsCreatingList(false);
  };

  const deleteList = (listId: string) => {
    if (confirm('Are you sure you want to delete this shopping list?')) {
      const updatedLists = shoppingLists.filter((list) => list.id !== listId);
      saveShoppingLists(updatedLists);

      if (activeListId === listId) {
        setActiveListId(updatedLists.length > 0 ? updatedLists[0].id : null);
      }
    }
  };

  const updateListName = (listId: string, newName: string) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId ? { ...list, name: newName, updatedAt: new Date().toISOString() } : list
    );
    saveShoppingLists(updatedLists);
    setEditingListId(null);
    setEditingListName('');
  };

  const addItem = (listId: string, item: Omit<ShoppingItem, 'id'>) => {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
    };

    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: [...list.items, newItem],
            updatedAt: new Date().toISOString(),
          }
        : list
    );
    saveShoppingLists(updatedLists);
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
            updatedAt: new Date().toISOString(),
          }
        : list
    );
    saveShoppingLists(updatedLists);
  };

  const removeItem = (listId: string, itemId: string) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === listId
        ? {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        : list
    );
    saveShoppingLists(updatedLists);
  };

  const exportList = (list: ShoppingList) => {
    const listText = [
      `Shopping List: ${list.name}`,
      `Created: ${new Date(list.createdAt).toLocaleDateString()}`,
      '',
      ...STORE_CATEGORIES.map((category) => {
        const categoryItems = list.items.filter((item) => item.category === category);
        if (categoryItems.length === 0) return null;

        return [
          `${category}:`,
          ...categoryItems.map(
            (item) => `  ${item.purchased ? '✓' : '☐'} ${item.quantity} ${item.unit} ${item.name}`
          ),
          '',
        ].join('\n');
      }).filter(Boolean),
    ].join('\n');

    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-shopping-list.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeList = shoppingLists.find((list) => list.id === activeListId);

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-12 lg:py-16'>
        <div className='container'>
          <div className='text-center'>
            <div className='mb-6 flex justify-center'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
                <ShoppingCart className='h-6 w-6 text-white' />
              </div>
            </div>

            <h1 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
              Shopping Lists
            </h1>

            <p className='mx-auto mb-8 max-w-2xl text-lg text-savor-charcoal/80'>
              Create, organize, and manage your shopping lists. Generate lists from recipes,
              organize by store sections, and never forget an ingredient again.
            </p>

            <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
              <Button
                size='lg'
                className='bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
                onClick={() => setIsCreatingList(true)}
              >
                <Plus className='mr-2 h-5 w-5' />
                Create New List
              </Button>
              <Button
                size='lg'
                variant='outline'
                onClick={() => (window.location.href = '/cookbook?tab=shopping')}
              >
                <BookOpen className='mr-2 h-5 w-5' />
                Generate from Recipes
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Lists Content */}
      <section className='py-8 lg:py-12'>
        <div className='container'>
          <div className='grid gap-6 lg:grid-cols-4'>
            {/* Lists Sidebar */}
            <div className='lg:col-span-1'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>My Lists</span>
                    <Button size='sm' onClick={() => setIsCreatingList(true)}>
                      <Plus className='h-4 w-4' />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Create New List Form */}
                  {isCreatingList && (
                    <div className='mb-4 space-y-2 border-b pb-4'>
                      <Input
                        placeholder='List name...'
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                      />
                      <div className='flex gap-2'>
                        <Button size='sm' onClick={createNewList}>
                          <Save className='mr-1 h-3 w-3' />
                          Save
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => {
                            setIsCreatingList(false);
                            setNewListName('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Lists */}
                  <div className='space-y-2'>
                    {shoppingLists.length === 0 ? (
                      <div className='py-8 text-center'>
                        <ShoppingCart className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                        <p className='text-sm text-muted-foreground'>
                          No shopping lists yet. Create your first list to get started.
                        </p>
                      </div>
                    ) : (
                      shoppingLists.map((list) => (
                        <div
                          key={list.id}
                          className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                            activeListId === list.id
                              ? 'border-savor-saffron bg-savor-saffron/10'
                              : 'hover:bg-savor-cream/30'
                          }`}
                          onClick={() => setActiveListId(list.id)}
                        >
                          <div className='flex items-center justify-between'>
                            {editingListId === list.id ? (
                              <Input
                                value={editingListName}
                                onChange={(e) => setEditingListName(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateListName(list.id, editingListName);
                                  }
                                }}
                                onBlur={() => updateListName(list.id, editingListName)}
                                className='h-6 text-sm'
                                autoFocus
                              />
                            ) : (
                              <div className='flex-1'>
                                <h4 className='text-sm font-medium'>{list.name}</h4>
                                <p className='text-xs text-muted-foreground'>
                                  {list.items.length} items
                                </p>
                              </div>
                            )}

                            <div className='flex gap-1'>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='h-6 w-6 p-0'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingListId(list.id);
                                  setEditingListName(list.name);
                                }}
                              >
                                <Edit className='h-3 w-3' />
                              </Button>
                              <Button
                                size='sm'
                                variant='ghost'
                                className='h-6 w-6 p-0 text-red-500'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteList(list.id);
                                }}
                              >
                                <Trash2 className='h-3 w-3' />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className='lg:col-span-3'>
              {activeList ? (
                <ShoppingListContentComponent
                  list={activeList}
                  onAddItem={(item) => addItem(activeList.id, item)}
                  onUpdateItem={(itemId, updates) => updateItem(activeList.id, itemId, updates)}
                  onRemoveItem={(itemId) => removeItem(activeList.id, itemId)}
                  onExport={() => exportList(activeList)}
                />
              ) : (
                <Card className='py-12 text-center'>
                  <CardContent>
                    <ShoppingCart className='mx-auto mb-4 h-16 w-16 text-muted-foreground' />
                    <h3 className='mb-2 text-xl font-semibold text-savor-charcoal'>
                      No List Selected
                    </h3>
                    <p className='mb-6 text-muted-foreground'>
                      Create a new shopping list or select an existing one to get started.
                    </p>
                    <Button onClick={() => setIsCreatingList(true)}>
                      <Plus className='mr-2 h-4 w-4' />
                      Create Your First List
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
