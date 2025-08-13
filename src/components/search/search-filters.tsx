'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Recipe, RecipeSearchFilters } from '@/types';
import { getFilterOptions } from '@/lib/recipe-utils';

interface SearchFiltersProps {
  recipes: Recipe[];
  filters: RecipeSearchFilters;
  onFiltersChange: (filters: Partial<RecipeSearchFilters>) => void;
}

export function SearchFilters({ recipes, filters, onFiltersChange }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    difficulty: true,
    time: true,
    cuisine: false,
    tags: false
  });

  const filterOptions = getFilterOptions(recipes);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category === 'all' ? undefined : category });
  };

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...(filters.difficulty || []), difficulty]
      : (filters.difficulty || []).filter(d => d !== difficulty);
    
    onFiltersChange({ difficulty: newDifficulties });
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    const newCuisines = checked
      ? [...(filters.cuisine || []), cuisine]
      : (filters.cuisine || []).filter(c => c !== cuisine);
    
    onFiltersChange({ cuisine: newCuisines });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...(filters.tags || []), tag]
      : (filters.tags || []).filter(t => t !== tag);
    
    onFiltersChange({ tags: newTags });
  };

  const handleTimeChange = (value: number[]) => {
    onFiltersChange({ maxTime: value[0] });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: undefined,
      difficulty: [],
      maxTime: undefined,
      tags: [],
      cuisine: []
    });
  };

  const hasActiveFilters = 
    filters.category ||
    (filters.difficulty && filters.difficulty.length > 0) ||
    filters.maxTime ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.cuisine && filters.cuisine.length > 0);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Active filters summary */}
        {hasActiveFilters && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Active Filters</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <Badge variant="secondary" className="text-xs">
                    {filters.category}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleCategoryChange('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.difficulty?.map((difficulty) => (
                  <Badge key={difficulty} variant="secondary" className="text-xs">
                    {difficulty}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleDifficultyChange(difficulty, false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {filters.maxTime && (
                  <Badge variant="secondary" className="text-xs">
                    Under {formatTime(filters.maxTime)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleTimeChange([120])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category filter */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Category</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('category')}
                className="h-auto p-0"
              >
                {expandedSections.category ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.category && (
            <CardContent className="pt-0">
              <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="desert">Desserts</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="soups">Soups</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          )}
        </Card>

        {/* Difficulty filter */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Difficulty</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('difficulty')}
                className="h-auto p-0"
              >
                {expandedSections.difficulty ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.difficulty && (
            <CardContent className="pt-0">
              <div className="space-y-3">
                {filterOptions.difficulties.map((difficulty) => (
                  <div key={difficulty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`difficulty-${difficulty}`}
                      checked={filters.difficulty?.includes(difficulty) || false}
                      onCheckedChange={(checked) => 
                        handleDifficultyChange(difficulty, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`difficulty-${difficulty}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {difficulty}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Time filter */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Max Cook Time</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('time')}
                className="h-auto p-0"
              >
                {expandedSections.time ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.time && (
            <CardContent className="pt-0">
              <div className="space-y-4">
                <Slider
                  value={[filters.maxTime || 120]}
                  onValueChange={handleTimeChange}
                  max={180}
                  min={15}
                  step={15}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15 min</span>
                  <span className="font-medium text-foreground">
                    {formatTime(filters.maxTime || 120)}
                  </span>
                  <span>3 hours</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
