import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { scrollToSection } from '../utils/navigation';
import OptimizedImage from './OptimizedImage';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    {
      image: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Билим — ваш доходный дом у леса'
    },
    {
      image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Экологичное жильё в гармонии с природой'
    },
    {
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
      title: 'Инвестиции в будущее'
    }
  ]);
  const [subtitle, setSubtitle] = useState('Современные экологичные дома в живописном месте всего в 60 км от Екатеринбурга. Идеальное место для отдыха и стабильного дохода от аренды.');

  // Предзагружаем изображения слайдера
  const { isLoading } = useImagePreloader({
    images: slides.map(slide => slide.image),
    priority: true
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      // Загружаем слайды
      const { data: slidesData } = await supabase
        .from('site_content')
        .select('value')
        .eq('section', 'hero')
        .eq('key', 'slides')
        .single();

      if (slidesData?.value) {
        setSlides(Array.isArray(slidesData.value) ? slidesData.value : JSON.parse(slidesData.value));
      }

      // Загружаем подзаголовок
      const { data: subtitleData } = await supabase
        .from('site_content')
        .select('value')
        .eq('section', 'hero')
        .eq('key', 'subtitle')
        .single();

      if (subtitleData?.value) {
        setSubtitle(typeof subtitleData.value === 'string' ? subtitleData.value : subtitleData.value);
      }
    } catch (error) {
      console.error('Error loading hero content:', error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isLoading]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <section id="hero" className="relative h-screen overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-blue-900/50 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <div className="h-16 bg-white/20 rounded-lg mb-6 animate-pulse" />
            <div className="h-8 bg-white/10 rounded-lg mb-8 animate-pulse" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 w-48 bg-white/20 rounded-lg animate-pulse" />
              <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <OptimizedImage
              src={slide.image}
              alt={slide.title}
              className="w-full h-full"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ))}

        {/* Slide indicators - clickable */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            {slides[currentSlide]?.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <button
              onClick={() => scrollToSection('projects')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Смотреть проекты домов
            </button>
            <button
              onClick={() => scrollToSection('booking')}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Забронировать/Купить
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - positioned above the center indicator and clickable */}
      <button
        onClick={() => scrollToSection('projects')}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-x-2 animate-bounce hover:scale-110 transition-transform cursor-pointer"
        aria-label="Прокрутить к проектам"
      >
        <ArrowDown size={24} className="text-white opacity-70 hover:opacity-100" />
      </button>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;