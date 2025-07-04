import React, { useState, useEffect } from 'react';
import { ArrowDown, MessageSquare, Star, Users } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';
import { supabase } from '../lib/supabase';

const TransitionToReviews: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Не верите только нашим словам?',
    subtitle: 'Правильно! Лучше послушать тех, кто уже инвестировал в посёлок Билим или отдыхал в наших домах.',
    description: 'Их опыт поможет вам принять решение.',
    icon: 'MessageSquare',
    button_text: 'Читать отзывы клиентов',
    target_section: 'reviews',
    features: [
      {
        icon: 'Star',
        title: '4.8/5',
        description: 'Средняя оценка'
      },
      {
        icon: 'Users',
        title: '150+',
        description: 'Довольных клиентов'
      },
      {
        icon: 'MessageSquare',
        title: '95%',
        description: 'Рекомендуют друзьям'
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
        .eq('key', 'to_reviews')
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
      MessageSquare,
      Star,
      Users
    };
    
    const IconComponent = icons[iconName] || MessageSquare;
    return <IconComponent className="w-8 h-8 text-white" />;
  };

  const getFeatureIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Star,
      Users,
      MessageSquare
    };
    
    const IconComponent = icons[iconName] || Star;
    return <IconComponent className="w-6 h-6 text-emerald-900" />;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-14 right-14 w-36 h-36 border border-white rounded-full"></div>
        <div className="absolute bottom-14 left-14 w-28 h-28 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white rounded-full"></div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {content.features.map((feature, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center justify-center w-12 h-12 bg-emerald-300 rounded-full mb-4 mx-auto">
                  {getFeatureIcon(feature.icon)}
                </div>
                <div className="text-2xl font-bold text-yellow-300 mb-2">{feature.title}</div>
                <p className="text-emerald-100">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm mb-8">
          <p className="text-lg italic text-emerald-100">
            "Реальные отзывы людей, которые уже инвестировали в посёлок Билим 
            или отдыхали в наших домах. Их опыт поможет вам принять решение."
          </p>
        </div>

        <button
          onClick={() => scrollToSection(content.target_section)}
          className="inline-flex items-center space-x-3 bg-white text-emerald-700 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <span>{content.button_text}</span>
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default TransitionToReviews;