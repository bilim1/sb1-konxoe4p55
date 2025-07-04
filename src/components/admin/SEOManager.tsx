import React, { useState, useEffect } from 'react';
import { supabase, SiteSettings } from '../../lib/supabase';
import { Search, Save, Globe, FileText } from 'lucide-react';

const SEOManager: React.FC = () => {
  const [seoSettings, setSeoSettings] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: 'index, follow',
    author: '',
    siteName: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'seo_settings')
        .maybeSingle();

      if (error) throw error;
      
      if (data?.value) {
        setSeoSettings({ ...seoSettings, ...data.value });
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSEOSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'seo_settings',
          value: seoSettings,
          description: 'SEO настройки сайта',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('SEO настройки сохранены!');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSeoSettings(prev => ({ ...prev, [key]: value }));
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
            <Search className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">SEO настройки</h2>
          </div>
          <button
            onClick={saveSEOSettings}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Основные SEO настройки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Основные настройки
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок сайта (Title)
              </label>
              <input
                type="text"
                value={seoSettings.title}
                onChange={(e) => updateSetting('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Посёлок Билим - Экологичные дома для отдыха и инвестиций"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание сайта (Description)
              </label>
              <textarea
                rows={3}
                value={seoSettings.description}
                onChange={(e) => updateSetting('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Современные экологичные дома в 60 км от Екатеринбурга. Аренда и продажа недвижимости с высокой доходностью."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ключевые слова (Keywords)
              </label>
              <input
                type="text"
                value={seoSettings.keywords}
                onChange={(e) => updateSetting('keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="аренда домов, загородная недвижимость, экологичные дома, инвестиции в недвижимость"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Автор
                </label>
                <input
                  type="text"
                  value={seoSettings.author}
                  onChange={(e) => updateSetting('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Посёлок Билим"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название сайта
                </label>
                <input
                  type="text"
                  value={seoSettings.siteName}
                  onChange={(e) => updateSetting('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Билим"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Open Graph настройки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Open Graph (Facebook, LinkedIn)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Заголовок
              </label>
              <input
                type="text"
                value={seoSettings.ogTitle}
                onChange={(e) => updateSetting('ogTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Посёлок Билим - Ваш дом у леса"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Описание
              </label>
              <textarea
                rows={3}
                value={seoSettings.ogDescription}
                onChange={(e) => updateSetting('ogDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Экологичные дома для отдыха и инвестиций в живописном месте"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                OG Изображение (URL)
              </label>
              <input
                type="url"
                value={seoSettings.ogImage}
                onChange={(e) => updateSetting('ogImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/og-image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Twitter настройки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Twitter Card
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Заголовок
              </label>
              <input
                type="text"
                value={seoSettings.twitterTitle}
                onChange={(e) => updateSetting('twitterTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Посёлок Билим - Экологичные дома"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Описание
              </label>
              <textarea
                rows={3}
                value={seoSettings.twitterDescription}
                onChange={(e) => updateSetting('twitterDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Современные дома в 60 км от Екатеринбурга"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Изображение (URL)
              </label>
              <input
                type="url"
                value={seoSettings.twitterImage}
                onChange={(e) => updateSetting('twitterImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/twitter-image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Технические настройки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Технические настройки
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canonical URL
              </label>
              <input
                type="url"
                value={seoSettings.canonicalUrl}
                onChange={(e) => updateSetting('canonicalUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://bilim-village.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Robots
              </label>
              <select
                value={seoSettings.robots}
                onChange={(e) => updateSetting('robots', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="index, follow">index, follow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, follow">noindex, follow</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;