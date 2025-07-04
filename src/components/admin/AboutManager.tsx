import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { Info, Save, Plus, Trash2, Image } from 'lucide-react';

const AboutManager: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
    title: '',
    subtitle: '',
    concept_title: '',
    concept_text: '',
    location_title: '',
    location_text: '',
    gallery_title: '',
    gallery_images: [] as Array<{url: string, title: string}>,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      setAboutContent({
        title: contentMap.title || 'О проекте Билим',
        subtitle: contentMap.subtitle || 'Посёлок «Билим» — это уникальный проект экологичного загородного жилья',
        concept_title: contentMap.concept_title || 'Концепция проекта',
        concept_text: contentMap.concept_text || 'Наш посёлок создан для тех, кто ценит качество жизни...',
        location_title: contentMap.location_title || 'Расположение',
        location_text: contentMap.location_text || 'Посёлок расположен в 60 километрах к северо-западу от Екатеринбурга...',
        gallery_title: contentMap.gallery_title || 'Территория посёлка',
        gallery_images: contentMap.gallery_images || [
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
        // Загружаем новые поля
        ecology_title: contentMap.ecology_title || 'Экологичность',
        ecology_description: contentMap.ecology_description || 'Использование только экологически чистых материалов',
        security_title: contentMap.security_title || 'Безопасность',
        security_description: contentMap.security_description || 'Круглосуточная охрана и видеонаблюдение',
        community_title: contentMap.community_title || 'Сообщество',
        community_description: contentMap.community_description || 'Дружелюбное сообщество единомышленников',
        location_icon_title: contentMap.location_icon_title || 'Расположение',
        location_icon_description: contentMap.location_icon_description || 'Удобное расположение рядом с городом'
      });
    } catch (error) {
      console.error('Error loading about content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAboutContent = async () => {
    setSaving(true);
    try {
      const updates = [
        { section: 'about', key: 'title', value: aboutContent.title },
        { section: 'about', key: 'subtitle', value: aboutContent.subtitle },
        { section: 'about', key: 'concept_title', value: aboutContent.concept_title },
        { section: 'about', key: 'concept_text', value: aboutContent.concept_text },
        { section: 'about', key: 'location_title', value: aboutContent.location_title },
        { section: 'about', key: 'location_text', value: aboutContent.location_text },
        { section: 'about', key: 'gallery_title', value: aboutContent.gallery_title },
        { section: 'about', key: 'gallery_images', value: aboutContent.gallery_images },
        // Сохраняем новые поля
        { section: 'about', key: 'ecology_title', value: aboutContent.ecology_title },
        { section: 'about', key: 'ecology_description', value: aboutContent.ecology_description },
        { section: 'about', key: 'security_title', value: aboutContent.security_title },
        { section: 'about', key: 'security_description', value: aboutContent.security_description },
        { section: 'about', key: 'community_title', value: aboutContent.community_title },
        { section: 'about', key: 'community_description', value: aboutContent.community_description },
        { section: 'about', key: 'location_icon_title', value: aboutContent.location_icon_title },
        { section: 'about', key: 'location_icon_description', value: aboutContent.location_icon_description }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_content')
          .upsert({
            section: update.section,
            key: update.key,
            value: update.value,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'section,key'
          });

        if (error) throw error;
      }

      alert('Контент раздела "О проекте" сохранен!');
    } catch (error) {
      console.error('Error saving about content:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addGalleryImage = () => {
    setAboutContent(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, { url: '', title: '' }]
    }));
  };

  const updateGalleryImage = (index: number, field: 'url' | 'title', value: string) => {
    setAboutContent(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const removeGalleryImage = (index: number) => {
    setAboutContent(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление разделом "О проекте"</h2>
          </div>
          <button
            onClick={saveAboutContent}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Основные заголовки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные заголовки</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок раздела
              </label>
              <input
                type="text"
                value={aboutContent.title}
                onChange={(e) => setAboutContent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подзаголовок раздела
              </label>
              <textarea
                rows={3}
                value={aboutContent.subtitle}
                onChange={(e) => setAboutContent(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Концепция проекта */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Концепция проекта</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок концепции
              </label>
              <input
                type="text"
                value={aboutContent.concept_title}
                onChange={(e) => setAboutContent(prev => ({ ...prev, concept_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст концепции
              </label>
              <textarea
                rows={6}
                value={aboutContent.concept_text}
                onChange={(e) => setAboutContent(prev => ({ ...prev, concept_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Иконки преимуществ */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Иконки преимуществ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Экологичность</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={aboutContent.ecology_title}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, ecology_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    rows={2}
                    value={aboutContent.ecology_description}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, ecology_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Безопасность</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={aboutContent.security_title}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, security_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    rows={2}
                    value={aboutContent.security_description}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, security_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Сообщество</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={aboutContent.community_title}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, community_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    rows={2}
                    value={aboutContent.community_description}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, community_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Расположение</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={aboutContent.location_icon_title}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, location_icon_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                  <textarea
                    rows={2}
                    value={aboutContent.location_icon_description}
                    onChange={(e) => setAboutContent(prev => ({ ...prev, location_icon_description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Расположение */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Расположение</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок расположения
              </label>
              <input
                type="text"
                value={aboutContent.location_title}
                onChange={(e) => setAboutContent(prev => ({ ...prev, location_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст о расположении
              </label>
              <textarea
                rows={4}
                value={aboutContent.location_text}
                onChange={(e) => setAboutContent(prev => ({ ...prev, location_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Галерея территории */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Территория посёлка</h3>
            <button
              onClick={addGalleryImage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить фото</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок галереи
            </label>
            <input
              type="text"
              value={aboutContent.gallery_title}
              onChange={(e) => setAboutContent(prev => ({ ...prev, gallery_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {aboutContent.gallery_images.map((image, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Изображение {index + 1}</h5>
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL изображения
                    </label>
                    <input
                      type="url"
                      value={image.url}
                      onChange={(e) => updateGalleryImage(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Подпись к изображению
                    </label>
                    <input
                      type="text"
                      value={image.title}
                      onChange={(e) => updateGalleryImage(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Описание изображения"
                    />
                  </div>
                </div>

                {image.url && (
                  <div className="mt-4">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;