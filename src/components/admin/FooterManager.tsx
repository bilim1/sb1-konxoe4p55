import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { Layout, Save, Plus, Trash2 } from 'lucide-react';

interface FooterLink {
  text: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const FooterManager: React.FC = () => {
  const [footerContent, setFooterContent] = useState({
    brand_title: '',
    brand_description: '',
    navigation_title: '',
    navigation_links: [] as FooterLink[],
    services_title: '',
    services_list: [] as string[],
    contact_title: '',
    contact_phone: '',
    contact_email: '',
    contact_address: '',
    social_links: [] as SocialLink[],
    copyright_text: '',
    privacy_policy_text: '',
    terms_text: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'footer');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      setFooterContent({
        brand_title: contentMap.brand_title || 'Билим',
        brand_description: contentMap.brand_description || 'Экологичные дома для отдыха и инвестиций в живописном месте всего в 60 км от Екатеринбурга.',
        navigation_title: contentMap.navigation_title || 'Навигация',
        navigation_links: contentMap.navigation_links || [
          { text: 'Главная', url: '#hero' },
          { text: 'Проекты домов', url: '#projects' },
          { text: 'О проекте', url: '#about' },
          { text: 'Бронирование', url: '#booking' },
          { text: 'Выгоды', url: '#benefits' }
        ],
        services_title: contentMap.services_title || 'Услуги',
        services_list: contentMap.services_list || [
          'Аренда домов',
          'Продажа недвижимости',
          'Управление арендой',
          'Консультации по инвестициям',
          'Обслуживание домов'
        ],
        contact_title: contentMap.contact_title || 'Контакты',
        contact_phone: contentMap.contact_phone || '+7 (343) 123-45-67',
        contact_email: contentMap.contact_email || 'info@bilim-village.ru',
        contact_address: contentMap.contact_address || '60 км от Екатеринбурга\n9 км от Первоуральска',
        social_links: contentMap.social_links || [
          { platform: 'Facebook', url: '#', icon: 'Facebook' },
          { platform: 'Instagram', url: '#', icon: 'Instagram' },
          { platform: 'Twitter', url: '#', icon: 'Twitter' }
        ],
        copyright_text: contentMap.copyright_text || '© 2024 Посёлок «Билим». Все права защищены.',
        privacy_policy_text: contentMap.privacy_policy_text || 'Политика конфиденциальности',
        terms_text: contentMap.terms_text || 'Пользовательское соглашение'
      });
    } catch (error) {
      console.error('Error loading footer content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFooterContent = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(footerContent).map(([key, value]) => ({
        section: 'footer',
        key,
        value
      }));

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

      alert('Контент футера сохранен!');
    } catch (error) {
      console.error('Error saving footer content:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addNavigationLink = () => {
    setFooterContent(prev => ({
      ...prev,
      navigation_links: [...prev.navigation_links, { text: '', url: '' }]
    }));
  };

  const updateNavigationLink = (index: number, field: keyof FooterLink, value: string) => {
    setFooterContent(prev => ({
      ...prev,
      navigation_links: prev.navigation_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeNavigationLink = (index: number) => {
    setFooterContent(prev => ({
      ...prev,
      navigation_links: prev.navigation_links.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    setFooterContent(prev => ({
      ...prev,
      services_list: [...prev.services_list, '']
    }));
  };

  const updateService = (index: number, value: string) => {
    setFooterContent(prev => ({
      ...prev,
      services_list: prev.services_list.map((service, i) => 
        i === index ? value : service
      )
    }));
  };

  const removeService = (index: number) => {
    setFooterContent(prev => ({
      ...prev,
      services_list: prev.services_list.filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = () => {
    setFooterContent(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: '', url: '', icon: 'Globe' }]
    }));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    setFooterContent(prev => ({
      ...prev,
      social_links: prev.social_links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index: number) => {
    setFooterContent(prev => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index)
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
            <Layout className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление футером</h2>
          </div>
          <button
            onClick={saveFooterContent}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Брендинг */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Брендинг</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название бренда
              </label>
              <input
                type="text"
                value={footerContent.brand_title}
                onChange={(e) => setFooterContent(prev => ({ ...prev, brand_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание бренда
              </label>
              <textarea
                rows={3}
                value={footerContent.brand_description}
                onChange={(e) => setFooterContent(prev => ({ ...prev, brand_description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Навигация */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Навигация</h3>
            <button
              onClick={addNavigationLink}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить ссылку</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок навигации
            </label>
            <input
              type="text"
              value={footerContent.navigation_title}
              onChange={(e) => setFooterContent(prev => ({ ...prev, navigation_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {footerContent.navigation_links.map((link, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Ссылка {index + 1}</h5>
                  <button
                    onClick={() => removeNavigationLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Текст ссылки
                    </label>
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => updateNavigationLink(index, 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Название раздела"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL или якорь
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateNavigationLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="#section или /page"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Услуги */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Услуги</h3>
            <button
              onClick={addService}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить услугу</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок услуг
            </label>
            <input
              type="text"
              value={footerContent.services_title}
              onChange={(e) => setFooterContent(prev => ({ ...prev, services_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {footerContent.services_list.map((service, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={service}
                  onChange={(e) => updateService(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Название услуги"
                />
                <button
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Контакты */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Контакты</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок контактов
              </label>
              <input
                type="text"
                value={footerContent.contact_title}
                onChange={(e) => setFooterContent(prev => ({ ...prev, contact_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={footerContent.contact_phone}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={footerContent.contact_email}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <textarea
                rows={3}
                value={footerContent.contact_address}
                onChange={(e) => setFooterContent(prev => ({ ...prev, contact_address: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Социальные сети</h3>
            <button
              onClick={addSocialLink}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить соцсеть</span>
            </button>
          </div>

          <div className="space-y-4">
            {footerContent.social_links.map((social, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Соцсеть {index + 1}</h5>
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Платформа
                    </label>
                    <input
                      type="text"
                      value={social.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Facebook"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL
                    </label>
                    <input
                      type="url"
                      value={social.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="https://facebook.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Иконка
                    </label>
                    <select
                      value={social.icon}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Twitter">Twitter</option>
                      <option value="Youtube">Youtube</option>
                      <option value="Linkedin">Linkedin</option>
                      <option value="MessageCircle">ВКонтакте</option>
                      <option value="Send">Telegram</option>
                      <option value="MessageSquare">WhatsApp</option>
                      <option value="Play">RuTube</option>
                      <option value="Globe">Globe</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Копирайт и ссылки */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Копирайт и ссылки</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст копирайта
              </label>
              <input
                type="text"
                value={footerContent.copyright_text}
                onChange={(e) => setFooterContent(prev => ({ ...prev, copyright_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст ссылки на политику конфиденциальности
                </label>
                <input
                  type="text"
                  value={footerContent.privacy_policy_text}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, privacy_policy_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Текст ссылки на пользовательское соглашение
                </label>
                <input
                  type="text"
                  value={footerContent.terms_text}
                  onChange={(e) => setFooterContent(prev => ({ ...prev, terms_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManager;