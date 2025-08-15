import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Shield, Star, Lightbulb, ChefHat, Download, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Savor - Every Recipe Tells a Story',
  description:
    "Learn about Savor's mission to connect people through cooking. Discover authentic recipes, share your culinary adventures, and join a community of passionate food lovers.",
  keywords: [
    'about savor',
    'recipe community',
    'cooking platform',
    'food stories',
    'culinary mission',
  ],
  openGraph: {
    title: 'About Savor - Every Recipe Tells a Story',
    description:
      "Learn about Savor's mission to connect people through cooking. Discover authentic recipes, share your culinary adventures, and join a community of passionate food lovers.",
    type: 'website',
  },
};

const values = [
  {
    icon: Shield,
    title: 'Authentic',
    description: 'Real recipes from real people, with genuine stories and honest reviews.',
  },
  {
    icon: Users,
    title: 'Inclusive',
    description: 'Every cuisine, every skill level, and every dietary need is welcome here.',
  },
  {
    icon: Heart,
    title: 'Connected',
    description: 'Building community through shared meals and culinary experiences.',
  },
  {
    icon: Star,
    title: 'Trustworthy',
    description: 'Reliable recipes that work every time, tested by our community.',
  },
  {
    icon: Lightbulb,
    title: 'Inspiring',
    description: 'Encouraging culinary creativity and fearless exploration in the kitchen.',
  },
];

const team = [
  {
    name: 'George Watkins',
    role: 'Founder & Head of Product',
    description: "The boss. I run the show here what I say goes. VC's can suck a fat one.",
    avatar: '👨‍💼',
  },
  {
    name: 'Digital Alchemyst',
    role: 'Lead Developer',
    description:
      'Full-stack engineer who believes the best code is like a good recipe—simple, elegant, and reliable.',
    avatar: '👨‍💻',
  },
  {
    name: 'Augusta Ment',
    role: 'Design Lead',
    description:
      'Visual designer with a love for minimalist interfaces and maximum flavor in every interaction.',
    avatar: '👩‍🎨',
  },
  {
    name: 'Jamie Thompson',
    role: 'Community Manager',
    description:
      'Food enthusiast and community builder who ensures every voice in our platform is heard and valued.',
    avatar: '👥',
  },
];

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main>
        {/* Hero Section */}
        <section className='bg-gradient-to-br from-savor-cream via-savor-mint/20 to-savor-sage/10 py-16 lg:py-24'>
          <div className='container'>
            <div className='text-center'>
              <div className='mb-8 flex justify-center'>
                <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika shadow-lg'>
                  <ChefHat className='h-8 w-8 text-white' />
                </div>
              </div>

              <h1 className='mb-4 font-heading text-4xl font-bold text-savor-charcoal sm:text-5xl lg:text-6xl'>
                Savor
              </h1>

              <p className='mb-6 text-xl text-savor-charcoal/80 sm:text-2xl'>
                Every recipe tells a story
              </p>

              <p className='mx-auto max-w-3xl text-lg text-savor-charcoal/70 sm:text-xl'>
                We're on a mission to connect people through the shared joy of cooking, preserving
                family traditions, and discovering new flavors from around the world.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className='py-16 lg:py-20'>
          <div className='container'>
            <div className='mx-auto max-w-4xl'>
              <h2 className='mb-8 text-center font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
                Our Mission
              </h2>

              <div className='space-y-6 text-lg leading-relaxed text-savor-charcoal/80'>
                <p>
                  Food has an incredible power to bring people together. Whether it's a
                  grandmother's secret recipe passed down through generations, a friend's
                  recommendation that becomes your new favorite dish, or that perfect meal you
                  discovered while traveling, every recipe carries with it a story worth sharing.
                </p>

                <p>
                  At Savor, we believe that cooking is more than just following instructions—it's
                  about connection, creativity, and community. Our platform is designed to help you
                  discover authentic recipes from real people, share your own culinary adventures,
                  and build meaningful connections with fellow food lovers around the world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className='bg-savor-cream/30 py-16 lg:py-20'>
          <div className='container'>
            <div className='mb-12 text-center'>
              <h2 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
                Our Values
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-savor-charcoal/70'>
                Everything we do is guided by these core principles that shape how we think about
                food, community, and cooking.
              </p>
            </div>

            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {values.map((value, index) => (
                <Card
                  key={index}
                  className='border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl'
                >
                  <CardContent className='p-6 text-center'>
                    <div className='mb-4 flex justify-center'>
                      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-savor-saffron to-savor-paprika'>
                        <value.icon className='h-6 w-6 text-white' />
                      </div>
                    </div>
                    <h3 className='mb-3 font-heading text-xl font-semibold text-savor-charcoal'>
                      {value.title}
                    </h3>
                    <p className='text-savor-charcoal/70'>{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className='py-16 lg:py-20'>
          <div className='container'>
            <div className='mx-auto max-w-4xl'>
              <h2 className='mb-8 text-center font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
                Our Story
              </h2>

              <div className='space-y-6 text-lg leading-relaxed text-savor-charcoal/80'>
                <p>
                  Savor was born from a simple observation: the best recipes aren't found in
                  cookbooks or celebrity chef shows—they come from the kitchens of friends, family,
                  and passionate home cooks who pour their heart into every dish.
                </p>

                <p>
                  We started this journey because we were tired of sifting through endless recipe
                  blogs filled with life stories just to find the ingredients list. We wanted a
                  place where the food came first, where recipes were shared with genuine
                  enthusiasm, and where every cook—from complete beginners to seasoned chefs—could
                  find their place.
                </p>

                <p>
                  Today, Savor is home to thousands of recipes shared by our amazing community of
                  food lovers. Each recipe is more than just a list of instructions—it's an
                  invitation to experience someone else's culinary passion and make it your own.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <section className='bg-savor-sage/10 py-16 lg:py-20'>
          <div className='container'>
            <div className='mb-12 text-center'>
              <h2 className='mb-4 font-heading text-3xl font-bold text-savor-charcoal sm:text-4xl'>
                Meet the Team
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-savor-charcoal/70'>
                We're a small but passionate team of food lovers, designers, and engineers who
                believe that great software should be as satisfying as a perfectly cooked meal.
              </p>
            </div>

            <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {team.map((member, index) => (
                <Card
                  key={index}
                  className='border-0 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl'
                >
                  <CardContent className='p-6 text-center'>
                    <div className='mb-4 text-4xl'>{member.avatar}</div>
                    <h3 className='mb-1 font-heading text-lg font-semibold text-savor-charcoal'>
                      {member.name}
                    </h3>
                    <p className='mb-3 text-sm font-medium text-savor-saffron'>{member.role}</p>
                    <p className='text-sm text-savor-charcoal/70'>{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className='bg-gradient-to-br from-savor-saffron to-savor-paprika py-16 lg:py-20'>
          <div className='container'>
            <div className='text-center'>
              <h2 className='mb-4 font-heading text-3xl font-bold text-white sm:text-4xl'>
                Ready to Start Your Culinary Journey?
              </h2>

              <p className='mx-auto mb-8 max-w-2xl text-lg text-white/90'>
                Join thousands of home cooks who are already sharing their favorite recipes and
                discovering new flavors on Savor.
              </p>

              <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                <Link href='/recipes'>
                  <Button size='lg' className='bg-white text-savor-charcoal hover:bg-white/90'>
                    <Search className='mr-2 h-5 w-5' />
                    Explore Recipes
                  </Button>
                </Link>
                <Link href='/cookbook'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white hover:text-savor-charcoal'
                  >
                    <Download className='mr-2 h-5 w-5' />
                    Start Cooking
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
