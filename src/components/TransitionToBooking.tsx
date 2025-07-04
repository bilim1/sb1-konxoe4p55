import React, { useState, useEffect } from 'react';
import { ArrowDown, Calendar, CheckCircle, ShoppingCart } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';
import { supabase } from '../lib/supabase';

const TransitionToBooking: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Готовы начать?',
    subtitle: 'Отлично! Теперь вы знаете все о наших домах, выгодах и услугах.',
    description: 'Давайте сделаем первый шаг — забронируем дом для знакомства или оформим покупку.',
    icon: 'Calendar',
    button_text: 'Оставить заявку',
    target_section: 'booking',
    features: [
      {
        icon: 'Calendar',
        title: 'Аренда для отдыха',
        description: 'Забронируйте дом на выходные или отпуск'
      },
      {
        icon: 'ShoppingCart',
        title: 'Покупка для инвестиций',
        description: 'Приобретите дом и получайте доход'
      }
    ]
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('value')
        .eq('section', 'transitions')
        .eq('key', 'to_booking')
        .single();

      if (error) throw error;
      
      if (data?.value) {
        setContent(prev => ({ ...prev, ...data.value }));
      }
    } catch (error) {
      console.error('Error loading transition content:', error);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Calendar,
      CheckCircle,
      ShoppingCart
    };
    
    const IconComponent = icons[iconName] || Calendar;
    return <IconComponent className="w-8 h-8 text-white" />;
  };

  const getFeatureIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Calendar,
      CheckCircle,
      ShoppingCart
    };
    
    const IconComponent = icons[iconName] || Calendar;
    return <IconComponent className="w-6 h-6 text-emerald-900" />;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-white rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-white rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
            {getIcon(content.icon)}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title}
          </h2>
          
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            {content.subtitle}
          </p>
          
          {content.description && (
            <p className="text-lg text-emerald-100 mb-8">
              {content.description}
            </p>
          )}
        </div>

        {content.features && content.features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-300 rounded-full mb-4 mx-auto">
                  {getFeatureIcon(feature.icon)}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-emerald-100 mb-4">{feature.description}</p>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm">
                    {index === 0 ? 'Быстрое бронирование' : 'Консультация включена'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Что происходит после заявки?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-300 text-emerald-900 w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
              <span>Связываемся в течение часа</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-300 text-emerald-900 w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
              <span>Показываем дом лично или онлайн</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-300 text-emerald-900 w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
              <span>Оформляем все документы</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection(content.target_section)}
          className="inline-flex items-center space-x-3 bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span>{content.button_text}</span>
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default TransitionToBooking;