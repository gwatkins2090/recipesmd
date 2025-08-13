'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseInt(e.target.value)];
      onValueChange?.(newValue);
    };

    return (
      <div className={cn('relative flex w-full touch-none select-none items-center', className)}>
        <input
          type='range'
          className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-secondary'
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: hsl(var(--primary));
            cursor: pointer;
          }

          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: hsl(var(--primary));
            cursor: pointer;
            border: none;
          }
        `}</style>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
