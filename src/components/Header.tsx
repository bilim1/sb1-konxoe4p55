import React, { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+73431234567';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('hero')}
              className="text-2xl font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              Билим
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleNavigation('hero')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Главная
            </button>
            <button 
              onClick={() => handleNavigation('about')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              О проекте
            </button>
            <button 
              onClick={() => handleNavigation('projects')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Проекты домов
            </button>
            <button 
              onClick={() => handleNavigation('benefits')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Выгоды
            </button>
            <button 
              onClick={() => handleNavigation('management')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Управление
            </button>
            <button 
              onClick={() => handleNavigation('booking')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Бронирование
            </button>
            <button 
              onClick={() => handleNavigation('booking')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Купить
            </button>
            <button 
              onClick={() => handleNavigation('reviews')}
              className="text-gray-700 hover:text-emerald-600 transition-colors font-medium"
            >
              Отзывы
            </button>
          </nav>

          {/* Phone number - improved design with animation */}
          <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer group"
               onClick={handlePhoneClick}>
            <div className="bg-emerald-600 p-2 rounded-full group-hover:bg-emerald-700 transition-colors duration-300 group-hover:scale-110 transform">
              <Phone size={16} className="text-white animate-pulse" />
            </div>
            <div>
              <div className="text-xs text-emerald-600 font-medium group-hover:text-emerald-700 transition-colors">
                Звоните сейчас
              </div>
              <div className="text-emerald-700 font-bold group-hover:text-emerald-800 transition-colors">
                +7 (343) 123-45-67
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => handleNavigation('hero')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Главная
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                О проекте
              </button>
              <button 
                onClick={() => handleNavigation('projects')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Проекты домов
              </button>
              <button 
                onClick={() => handleNavigation('benefits')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Выгоды
              </button>
              <button 
                onClick={() => handleNavigation('management')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Управление
              </button>
              <button 
                onClick={() => handleNavigation('booking')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Бронирование
              </button>
              <button 
                onClick={() => handleNavigation('booking')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Купить
              </button>
              <button 
                onClick={() => handleNavigation('reviews')}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
              >
                Отзывы
              </button>
              <button 
                onClick={handlePhoneClick}
                className="flex items-center space-x-2 px-3 py-2 text-emerald-700 font-semibold border-t w-full hover:bg-emerald-50 rounded-md transition-colors"
              >
                <Phone size={18} />
                <span>+7 (343) 123-45-67</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;