import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, BookOpen, Award } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Every recipe is crafted with care and tested by real home cooks who understand the joy of cooking.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Our recipes come from a vibrant community of food lovers sharing their family traditions and discoveries.'
  },
  {
    icon: BookOpen,
    title: 'Story Behind Every Dish',
    description: 'We believe every recipe has a story - from grandma\'s secret ingredients to modern kitchen innovations.'
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'All recipes are thoroughly tested and rated by our community to ensure delicious results every time.'
  }
];

export function AboutSection() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="mb-6 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-savor-saffron to-savor-paprika bg-clip-text text-transparent">
                Savor
              </span>
            </h2>
            
            <p className="mb-8 text-lg text-muted-foreground">
              At Savor, we believe that food is more than just sustenance—it's a way to connect, 
              create memories, and share love. Our platform brings together passionate home cooks, 
              family recipes, and culinary adventures from around the world.
            </p>

            <p className="mb-8 text-muted-foreground">
              Whether you're looking for your grandmother's comfort food classics or exploring 
              exciting new flavors, Savor is your trusted companion in the kitchen. Every recipe 
              tells a story, and we're here to help you discover yours.
            </p>

            {/* Values grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-savor-saffron/20">
                    <value.icon className="h-5 w-5 text-savor-saffron" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-savor-charcoal">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            {/* Main image placeholder */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-savor-sage/20 to-savor-saffron/20 flex items-center justify-center">
                  {/* Placeholder for hero image */}
                  <div className="text-center">
                    <div className="text-6xl mb-4">👨‍🍳</div>
                    <p className="text-savor-charcoal/70 font-medium">
                      Passionate cooks sharing their stories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating stats cards */}
            <Card className="absolute -bottom-6 -left-6 bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-savor-saffron">4.9★</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </CardContent>
            </Card>

            <Card className="absolute -top-6 -right-6 bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-savor-sage">500+</div>
                  <div className="text-xs text-muted-foreground">Recipes</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
