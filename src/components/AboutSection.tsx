import React, { useState, useEffect } from 'react';
import { Leaf, Shield, Users, MapPin, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AboutSection: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
    title: 'О проекте Билим',
    subtitle: 'Посёлок «Билим» — это уникальный проект экологичного загородного жилья, сочетающий комфорт современной жизни с гармонией природной среды.',
    concept_title: 'Концепция проекта',
    concept_text: 'Наш посёлок создан для тех, кто ценит качество жизни и стремится к гармонии с природой. Каждый дом построен из экологически чистых материалов с применением современных энергосберегающих технологий.\n\nБилим идеально подходит как для постоянного проживания, так и для сезонного отдыха. Развитая инфраструктура и близость к Екатеринбургу делают наш посёлок привлекательным для инвестиций в недвижимость.',
    location_title: 'Расположение',
    location_text: 'Посёлок расположен в 60 километрах к северо-западу от Екатеринбурга, в 9 километрах от города Первоуральска. Удобное транспортное сообщение обеспечивает быстрый доступ к городской инфраструктуре.',
    gallery_title: 'Территория посёлка',
    gallery_images: [
      {
        url: 'https://i.postimg.cc/HsjFNj6D/b0a9cc98528511f0801db6d248c3352f-1.webp',
        title: 'Природа вокруг'
      },
      {
        url: 'https://i.postimg.cc/7YcjrDRC/a55eaef7528511f0b3489add488638a2-1.webp',
        title: 'Архитектура'
      },
      {
        url: 'https://i.postimg.cc/Dz3Dm6nn/79636e31528511f0ac9cfe37e9fc4774-1.webp',
        title: 'Инфраструктура'
      }
    ],
    // Новые поля для иконок
    ecology_title: 'Экологичность',
    ecology_description: 'Использование только экологически чистых материалов',
    security_title: 'Безопасность',
    security_description: 'Круглосуточная охрана и видеонаблюдение',
    community_title: 'Сообщество',
    community_description: 'Дружелюбное сообщество единомышленников',
    location_icon_title: 'Расположение',
    location_icon_description: 'Удобное расположение рядом с городом'
  });

  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);

  useEffect(() => {
    loadAboutContent();
  }, []);

  const loadAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'about');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      if (Object.keys(contentMap).length > 0) {
        setAboutContent(prev => ({
          ...prev,
          ...contentMap
        }));
      }
    } catch (error) {
      console.error('Error loading about content:', error);
    }
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{aboutContent.title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {aboutContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{aboutContent.concept_title}</h3>
              {aboutContent.concept_text.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Leaf className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">{aboutContent.ecology_title}</div>
                <div className="text-xs text-gray-600 mt-1">{aboutContent.ecology_description}</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Shield className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">{aboutContent.security_title}</div>
                <div className="text-xs text-gray-600 mt-1">{aboutContent.security_description}</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">{aboutContent.community_title}</div>
                <div className="text-xs text-gray-600 mt-1">{aboutContent.community_description}</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900">{aboutContent.location_icon_title}</div>
                <div className="text-xs text-gray-600 mt-1">{aboutContent.location_icon_description}</div>
              </div>
            </div>
          </div>

          {/* Location and Map */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{aboutContent.location_title}</h3>
            <p className="text-gray-700 mb-6">
              {aboutContent.location_text}
            </p>
            
            {/* Интерактивная карта */}
            <div className="bg-gray-200 rounded-lg h-64 mb-4 overflow-hidden">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A66%3A58%3A2901002%3A1279&amp;source=constructor"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 'none', borderRadius: '8px' }}
                title="Карта посёлка Билим"
                loading="lazy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>До Екатеринбурга:</strong> 60 км
              </div>
              <div>
                <strong>До Первоуральска:</strong> 9 км
              </div>
              <div>
                <strong>Время в пути:</strong> 45 мин
              </div>
              <div>
                <strong>Транспорт:</strong> автомобиль
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">{aboutContent.gallery_title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutContent.gallery_images.map((image, index) => (
              <div 
                key={index} 
                className="relative group overflow-hidden rounded-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white font-semibold">{image.title}</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Screen Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-7xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-20  hover:bg-opacity-30 rounded-full p-2 transition-all"
              >
                <X size={24} className="text-white" />
              </button>
              
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <span className="font-semibold">{selectedImage.title}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;