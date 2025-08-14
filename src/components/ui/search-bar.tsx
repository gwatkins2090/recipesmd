'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  placeholder = 'Search recipes...',
  value = '',
  onChange,
  onSearch,
  onClear,
  className,
  size = 'md',
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(currentValue);
    } else {
      // Default behavior: navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(currentValue)}`;
    }
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('');
    }
    onChange?.('');
    onClear?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='text'
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'pl-10 pr-10',
            sizeClasses[size],
            'focus:border-savor-saffron focus:ring-2 focus:ring-savor-saffron'
          )}
        />
        {currentValue && (
          <Button
            variant='ghost'
            size='sm'
            className='absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent'
            onClick={handleClear}
          >
            <X className='h-3 w-3' />
          </Button>
        )}
      </div>

      <Button
        onClick={handleSearch}
        className='ml-2 bg-savor-saffron text-savor-charcoal hover:bg-savor-saffron/90'
        size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}
      >
        <Search className='h-4 w-4' />
        <span className='sr-only'>Search</span>
      </Button>
    </div>
  );
}

// Compact search bar for headers/navigation
export function CompactSearchBar({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  className,
}: Omit<SearchBarProps, 'size'>) {
  return (
    <SearchBar
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      size='sm'
      className={cn('max-w-xs', className)}
    />
  );
}

// Hero search bar for landing pages
export function HeroSearchBar({
  placeholder = 'What would you like to cook today?',
  value,
  onChange,
  onSearch,
  className,
}: Omit<SearchBarProps, 'size'>) {
  return (
    <SearchBar
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onSearch={onSearch}
      size='lg'
      className={cn('max-w-2xl', className)}
    />
  );
}
