import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { FileText, Save } from 'lucide-react';

interface PageData {
  id?: string;
  title: string;
  content: string;
}

const PagesManager: React.FC = () => {
  const [pages, setPages] = useState({
    privacy_policy: {
      id: undefined,
      title: '',
      content: ''
    } as PageData,
    terms_of_service: {
      id: undefined,
      title: '',
      content: ''
    } as PageData
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('privacy_policy');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'pages');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        if (item.key === 'privacy_policy_title') {
          contentMap.privacy_policy_title = { id: item.id, value: item.value };
        } else if (item.key === 'privacy_policy_content') {
          contentMap.privacy_policy_content = { id: item.id, value: item.value };
        } else if (item.key === 'terms_of_service_title') {
          contentMap.terms_of_service_title = { id: item.id, value: item.value };
        } else if (item.key === 'terms_of_service_content') {
          contentMap.terms_of_service_content = { id: item.id, value: item.value };
        }
      });

      setPages({
        privacy_policy: {
          id: contentMap.privacy_policy_title?.id,
          title: contentMap.privacy_policy_title?.value || 'Политика конфиденциальности',
          content: contentMap.privacy_policy_content?.value || 'Здесь будет содержание политики конфиденциальности...'
        },
        terms_of_service: {
          id: contentMap.terms_of_service_title?.id,
          title: contentMap.terms_of_service_title?.value || 'Пользовательское соглашение',
          content: contentMap.terms_of_service_content?.value || 'Здесь будет содержание пользовательского соглашения...'
        }
      });
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePages = async () => {
    setSaving(true);
    try {
      const updates = [
        { section: 'pages', key: 'privacy_policy_title', value: pages.privacy_policy.title },
        { section: 'pages', key: 'privacy_policy_content', value: pages.privacy_policy.content },
        { section: 'pages', key: 'terms_of_service_title', value: pages.terms_of_service.title },
        { section: 'pages', key: 'terms_of_service_content', value: pages.terms_of_service.content }
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

      alert('Страницы сохранены!');
    } catch (error) {
      console.error('Error saving pages:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const updatePage = (pageKey: 'privacy_policy' | 'terms_of_service', field: 'title' | 'content', value: string) => {
    setPages(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value
      }
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
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление страницами</h2>
          </div>
          <button
            onClick={savePages}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('privacy_policy')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'privacy_policy'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Политика конфиденциальности
          </button>
          <button
            onClick={() => setActiveTab('terms_of_service')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'terms_of_service'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Пользовательское соглашение
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'privacy_policy' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок страницы
              </label>
              <input
                type="text"
                value={pages.privacy_policy.title}
                onChange={(e) => updatePage('privacy_policy', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Политика конфиденциальности"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Содержание страницы
              </label>
              <textarea
                rows={20}
                value={pages.privacy_policy.content}
                onChange={(e) => updatePage('privacy_policy', 'content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Введите текст политики конфиденциальности..."
              />
            </div>
          </div>
        )}

        {activeTab === 'terms_of_service' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок страницы
              </label>
              <input
                type="text"
                value={pages.terms_of_service.title}
                onChange={(e) => updatePage('terms_of_service', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Пользовательское соглашение"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Содержание страницы
              </label>
              <textarea
                rows={20}
                value={pages.terms_of_service.content}
                onChange={(e) => updatePage('terms_of_service', 'content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Введите текст пользовательского соглашения..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesManager;