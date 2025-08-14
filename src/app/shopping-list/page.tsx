import { Metadata } from 'next';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ShoppingListManager } from '@/components/shopping-list/shopping-list-manager';

export const metadata: Metadata = {
  title: 'Shopping Lists - Savor',
  description: 'Create, manage, and organize your shopping lists. Generate lists from recipes, organize by store sections, and never forget an ingredient again.',
  keywords: ['shopping list', 'grocery list', 'recipe ingredients', 'meal planning', 'grocery shopping'],
  openGraph: {
    title: 'Shopping Lists - Savor',
    description: 'Create, manage, and organize your shopping lists. Generate lists from recipes, organize by store sections, and never forget an ingredient again.',
    type: 'website',
  },
};

export default function ShoppingListPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ShoppingListManager />
      </main>
      <Footer />
    </div>
  );
}
