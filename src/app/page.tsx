import Header  from '@/components/layout/header';
import Footer  from '@/components/layout/footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <main>
Start
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;