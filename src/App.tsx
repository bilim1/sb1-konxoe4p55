import React, { useState, Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import TransitionToProjects from './components/TransitionToProjects';
import ProjectsSection from './components/ProjectsSection';
import TransitionToBenefits from './components/TransitionToBenefits';
import EconomicBenefits from './components/EconomicBenefits';
import TransitionToManagement from './components/TransitionToManagement';
import ManagementServices from './components/ManagementServices';
import TransitionToBooking from './components/TransitionToBooking';
import BookingSection from './components/BookingSection';
import TransitionToReviews from './components/TransitionToReviews';
import Reviews from './components/Reviews';
import Blog from './components/Blog';
import Footer from './components/Footer';
import HouseModal from './components/HouseModal';
import SEOHead from './components/SEOHead';
import LazySection from './components/LazySection';
import { House } from './types';

// Lazy load admin and policy components
const AdminRoute = lazy(() => import('./components/admin/AdminRoute'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Загрузка...</p>
    </div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Что-то пошло не так</h1>
            <p className="text-gray-600 mb-4">Произошла ошибка при загрузке страницы.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function MainSite() {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем переменные окружения
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase environment variables are missing');
      // Показываем сообщение об ошибке, но не блокируем загрузку
    }
    
    // Имитируем загрузку
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-stone-50">
        <SEOHead />
        <Header />
        <main>
          {/* 1. Главная секция - знакомство */}
          <Hero />
          
          {/* 2. О проекте - кто мы такие */}
          <LazySection sectionId="about">
            <AboutSection />
          </LazySection>
          
          {/* Переход к проектам */}
          <LazySection sectionId="transition-projects">
            <TransitionToProjects />
          </LazySection>
          
          {/* 3. Проекты домов - что можно приобрести */}
          <LazySection sectionId="projects">
            <ProjectsSection onHouseSelect={setSelectedHouse} />
          </LazySection>
          
          {/* Переход к выгодам */}
          <LazySection sectionId="transition-benefits">
            <TransitionToBenefits />
          </LazySection>
          
          {/* 4. Экономические выгоды - почему это выгодно */}
          <LazySection sectionId="benefits">
            <EconomicBenefits />
          </LazySection>
          
          {/* Переход к управлению */}
          <LazySection sectionId="transition-management">
            <TransitionToManagement />
          </LazySection>
          
          {/* 5. Услуги управления - мы поможем с арендой */}
          <LazySection sectionId="management">
            <ManagementServices />
          </LazySection>
          
          {/* Переход к бронированию */}
          <LazySection sectionId="transition-booking">
            <TransitionToBooking />
          </LazySection>
          
          {/* 6. Бронирование - как начать */}
          <LazySection sectionId="booking">
            <BookingSection />
          </LazySection>
          
          {/* Переход к отзывам */}
          <LazySection sectionId="transition-reviews">
            <TransitionToReviews />
          </LazySection>
          
          {/* 7. Отзывы - социальное доказательство */}
          <LazySection sectionId="reviews">
            <Reviews />
          </LazySection>
          
          {/* 8. Блог - дополнительная информация */}
          <LazySection sectionId="blog">
            <Blog />
          </LazySection>
        </main>
        
        <Footer />
        
        {selectedHouse && (
          <HouseModal 
            house={selectedHouse} 
            onClose={() => setSelectedHouse(null)} 
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route 
              path="/admin" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <AdminRoute />
                </Suspense>
              } 
            />
            <Route 
              path="/privacy-policy" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
              } 
            />
            <Route 
              path="/terms-of-service" 
              element={
                <Suspense fallback={<PageLoader />}>
                  <TermsOfService />
                </Suspense>
              } 
            />
          </Routes>
        </Router>
      </AdminProvider>
    </ErrorBoundary>
  );
}

export default App;