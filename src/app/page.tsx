import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedRecipes } from '@/components/home/featured-recipes';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { AboutSection } from '@/components/home/about-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import {
  WebsiteStructuredData,
  OrganizationStructuredData,
} from '@/components/seo/structured-data';

const HomePage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <Header />
      <main>
        <HeroSection />
        <FeaturedRecipes />
        <CategoryShowcase />
        <AboutSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
