'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Check, ChefHat } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-br from-savor-charcoal to-savor-sage py-16 lg:py-24">
      <div className="container">
        <Card className="mx-auto max-w-4xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-left">
                <div className="mb-6 flex justify-center lg:justify-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h2 className="mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl">
                  Never Miss a Recipe
                </h2>
                
                <p className="mb-6 text-lg text-muted-foreground">
                  Join our community of food lovers and get weekly recipe inspiration, 
                  cooking tips, and exclusive content delivered straight to your inbox.
                </p>

                <div className="mb-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center lg:justify-start">
                    <Check className="mr-2 h-4 w-4 text-savor-sage" />
                    Weekly recipe collections
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <Check className="mr-2 h-4 w-4 text-savor-sage" />
                    Seasonal cooking guides
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <Check className="mr-2 h-4 w-4 text-savor-sage" />
                    Exclusive chef tips & tricks
                  </div>
                  <div className="flex items-center justify-center lg:justify-start">
                    <Check className="mr-2 h-4 w-4 text-savor-sage" />
                    Early access to new features
                  </div>
                </div>
              </div>

              {/* Newsletter form */}
              <div>
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 text-base"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-savor-saffron hover:bg-savor-saffron/90 text-savor-charcoal font-semibold text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-savor-charcoal border-t-transparent"></div>
                          Subscribing...
                        </div>
                      ) : (
                        'Subscribe to Newsletter'
                      )}
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      No spam, unsubscribe at any time. We respect your privacy.
                    </p>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-savor-charcoal">
                      Welcome to the Savor Family!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for subscribing. Check your email for a welcome message 
                      with your first recipe collection.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
