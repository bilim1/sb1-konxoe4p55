import React, { useState, useEffect } from 'react';
import { ArrowDown, Calculator, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';
import { supabase } from '../lib/supabase';

const TransitionToBenefits: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Но насколько это выгодно?',
    subtitle: 'Отличный вопрос! Давайте разберем цифры и покажем, почему инвестиции в наши дома — это не просто покупка недвижимости, а умное финансовое решение.',
    description: '',
    icon: 'Calculator',
    button_text: 'Посчитать доходность',
    target_section: 'benefits',
    features: [
      {
        icon: 'TrendingUp',
        title: '12-15%',
        description: 'годовых доходности'
      },
      {
        icon: 'Clock',
        title: '7-8 лет',
        description: 'окупаемость'
      },
      {
        icon: 'DollarSign',
        title: '+',
        description: 'рост стоимости'
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
        .eq('key', 'to_benefits')
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
      Calculator,
      TrendingUp,
      Clock,
      DollarSign
    };
    
    const IconComponent = icons[iconName] || Calculator;
    return <IconComponent className="w-8 h-8 text-white" />;
  };

  const getFeatureIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      TrendingUp,
      Clock,
      DollarSign
    };
    
    const IconComponent = icons[iconName] || TrendingUp;
    return <IconComponent className="w-8 h-8 text-yellow-300" />;
  };

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 right-16 w-40 h-40 border border-white rounded-full"></div>
        <div className="absolute bottom-16 left-16 w-28 h-28 border border-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border border-white rounded-full"></div>
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
                <div className="flex items-center justify-center mb-2">
                  {feature.icon === 'DollarSign' ? (
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-yellow-300" />
                      <span className="text-3xl font-bold text-yellow-300">+</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-yellow-300">{feature.title}</div>
                  )}
                </div>
                <p className="text-emerald-100">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

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

export default TransitionToBenefits;