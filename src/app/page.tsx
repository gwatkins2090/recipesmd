import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Workflow } from '@/components/sections/workflow';
import { Integration } from '@/components/sections/integration';
import { Footer } from '@/components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Integration />
      </main>
      <Footer />
    </div>
  );
}