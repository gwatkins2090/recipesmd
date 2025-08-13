'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Thermometer, CheckCircle } from 'lucide-react';
import { RecipeInstruction } from '@/types';

interface RecipeInstructionsProps {
  instructions: RecipeInstruction[];
}

export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const handleStepComplete = (stepNumber: number, checked: boolean) => {
    const newCompleted = new Set(completedSteps);
    if (checked) {
      newCompleted.add(stepNumber);
    } else {
      newCompleted.delete(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  const handleStepFocus = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const resetProgress = () => {
    setCompletedSteps(new Set());
    setCurrentStep(null);
  };

  const progressPercentage = (completedSteps.size / instructions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Instructions</span>
            <Badge variant="secondary" className="ml-2">
              {instructions.length} steps
            </Badge>
          </CardTitle>
          
          {completedSteps.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetProgress}
              className="text-xs"
            >
              Reset Progress
            </Button>
          )}
        </div>
        
        {/* Progress bar */}
        {completedSteps.size > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Progress: {completedSteps.size} of {instructions.length} steps
              </span>
              <span className="font-medium text-savor-sage">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-savor-sage h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {instructions.map((instruction, index) => {
            const stepNumber = instruction.step || index + 1;
            const isCompleted = completedSteps.has(stepNumber);
            const isCurrent = currentStep === stepNumber;
            
            return (
              <div
                key={stepNumber}
                className={`relative p-4 rounded-lg border transition-all duration-200 ${
                  isCurrent 
                    ? 'border-savor-saffron bg-savor-saffron/5' 
                    : isCompleted
                    ? 'border-savor-sage bg-savor-sage/5'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
                onClick={() => handleStepFocus(stepNumber)}
              >
                <div className="flex items-start space-x-4">
                  {/* Step number and checkbox */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold text-sm ${
                      isCompleted 
                        ? 'bg-savor-sage text-white'
                        : isCurrent
                        ? 'bg-savor-saffron text-savor-charcoal'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    
                    <Checkbox
                      id={`step-${stepNumber}`}
                      checked={isCompleted}
                      onCheckedChange={(checked) => handleStepComplete(stepNumber, checked as boolean)}
                    />
                  </div>
                  
                  {/* Instruction content */}
                  <div className="flex-1 space-y-3">
                    <p className={`leading-relaxed ${
                      isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}>
                      {instruction.instruction}
                    </p>
                    
                    {/* Time and temperature indicators */}
                    {(instruction.time || instruction.temperature) && (
                      <div className="flex items-center space-x-4">
                        {instruction.time && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{instruction.time}</span>
                          </div>
                        )}
                        
                        {instruction.temperature && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Thermometer className="h-3 w-3" />
                            <span>{instruction.temperature}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Current step indicator */}
                {isCurrent && (
                  <div className="absolute -left-1 top-1/2 h-6 w-1 bg-savor-saffron rounded-r transform -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Completion message */}
        {completedSteps.size === instructions.length && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="font-medium text-green-700 dark:text-green-300">
                🎉 Recipe completed! Enjoy your delicious creation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
