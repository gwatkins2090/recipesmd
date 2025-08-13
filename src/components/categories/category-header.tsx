import { ChefHat } from 'lucide-react';

interface CategoryHeaderProps {
  title: string;
  description: string;
  emoji: string;
  color: string;
  recipeCount: number;
}

export function CategoryHeader({ 
  title, 
  description, 
  emoji, 
  color, 
  recipeCount 
}: CategoryHeaderProps) {
  return (
    <section className={`bg-gradient-to-br ${color} py-16 lg:py-24 text-white relative overflow-hidden`}>
      {/* Background decorations */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"></div>
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5"></div>
      <div className="absolute right-1/4 top-1/4 h-16 w-16 rounded-full bg-white/5"></div>
      
      <div className="container relative z-10">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-4xl">{emoji}</span>
            </div>
          </div>
          
          <h1 className="mb-4 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
            {title} Recipes
          </h1>
          
          <p className="mx-auto mb-6 max-w-2xl text-lg opacity-90 sm:text-xl">
            {description}
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-5 w-5" />
              <span>{recipeCount} recipes</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div>
              <span>All skill levels</span>
            </div>
            <div className="h-4 w-px bg-white/30"></div>
            <div>
              <span>Family tested</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
