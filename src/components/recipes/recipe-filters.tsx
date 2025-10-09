'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { Recipe } from '@/types';
import { parseTimeToMinutes, getFilterOptions } from '@/lib/recipe-utils';

interface RecipeFiltersProps {
  recipes: Recipe[];
  onFiltersChange?: (filters: any) => void;
}

export function RecipeFilters({ recipes, onFiltersChange }: RecipeFiltersProps) {
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
  const [maxTime, setMaxTime] = useState<number[]>([120]); // Default to 2 hours
  const [isExpanded, setIsExpanded] = useState(false);

  // Get filter options from recipes
  const filterOptions = useMemo(() => getFilterOptions(recipes), [recipes]);

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    const newDifficulties = checked
      ? [...selectedDifficulties, difficulty]
      : selectedDifficulties.filter(d => d !== difficulty);

    setSelectedDifficulties(newDifficulties);
    onFiltersChange?.({
      difficulties: newDifficulties,
      tags: selectedTags,
      generations: selectedGenerations,
      maxTime: maxTime[0]
    });
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter(t => t !== tag);

    setSelectedTags(newTags);
    onFiltersChange?.({
      difficulties: selectedDifficulties,
      tags: newTags,
      generations: selectedGenerations,
      maxTime: maxTime[0]
    });
  };

  const handleGenerationChange = (generation: string, checked: boolean) => {
    const newGenerations = checked
      ? [...selectedGenerations, generation]
      : selectedGenerations.filter(g => g !== generation);

    setSelectedGenerations(newGenerations);
    onFiltersChange?.({
      difficulties: selectedDifficulties,
      tags: selectedTags,
      generations: newGenerations,
      maxTime: maxTime[0]
    });
  };

  const handleTimeChange = (value: number[]) => {
    setMaxTime(value);
    onFiltersChange?.({
      difficulties: selectedDifficulties,
      tags: selectedTags,
      generations: selectedGenerations,
      maxTime: value[0]
    });
  };

  const clearAllFilters = () => {
    setSelectedDifficulties([]);
    setSelectedTags([]);
    setSelectedGenerations([]);
    setMaxTime([120]);
    onFiltersChange?.({
      difficulties: [],
      tags: [],
      generations: [],
      maxTime: 120
    });
  };

  const hasActiveFilters = selectedDifficulties.length > 0 || selectedTags.length > 0 || selectedGenerations.length > 0 || maxTime[0] < 120;

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
              {selectedDifficulties.length + selectedTags.length + selectedGenerations.length + (maxTime[0] < 120 ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Active filters */}
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
                {selectedGenerations.map((generation) => (
                  <Badge key={generation} variant="secondary" className="text-xs">
                    {generation}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleGenerationChange(generation, false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {selectedDifficulties.map((difficulty) => (
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
                {selectedTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0"
                      onClick={() => handleTagChange(tag, false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                {maxTime[0] < 120 && (
                  <Badge variant="secondary" className="text-xs">
                    Under {formatTime(maxTime[0])}
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

        {/* Tags filter - Show ALL tags */}
        {filterOptions.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filterOptions.tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) =>
                        handleTagChange(tag, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                    >
                      {tag.replace(/-/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generation filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { value: 'great-grandma', label: "Great Grandma's Recipes" },
                { value: 'grandma', label: "Grandma's Recipes" },
                { value: 'mom', label: "Mom's Recipes" },
                { value: 'modern', label: 'Modern Family Additions' }
              ].map((generation) => (
                <div key={generation.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`generation-${generation.value}`}
                    checked={selectedGenerations.includes(generation.value)}
                    onCheckedChange={(checked) =>
                      handleGenerationChange(generation.value, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`generation-${generation.value}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {generation.label}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cooking Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={maxTime}
                onValueChange={handleTimeChange}
                max={Math.min(filterOptions.maxTime, 180)}
                min={15}
                step={15}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>15 min</span>
                <span className="font-medium text-foreground">
                  {formatTime(maxTime[0])}
                </span>
                <span>{formatTime(Math.min(filterOptions.maxTime, 180))}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filterOptions.difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={selectedDifficulties.includes(difficulty)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(difficulty, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {difficulty}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
