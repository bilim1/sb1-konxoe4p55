import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { TrendingUp, Save, Plus, Trash2, HelpCircle } from 'lucide-react';

interface Advantage {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const BenefitsManager: React.FC = () => {
  const [benefitsContent, setBenefitsContent] = useState({
    title: '',
    subtitle: '',
    advantages_title: '',
    advantages: [] as Advantage[],
    faq_title: '',
    faq: [] as FAQ[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBenefitsContent();
  }, []);

  const loadBenefitsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'benefits');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      setBenefitsContent({
        title: contentMap.title || 'Экономические выгоды',
        subtitle: contentMap.subtitle || 'Инвестиции в недвижимость посёлка «Билим» — это надёжный способ получения стабильного дохода',
        advantages_title: contentMap.advantages_title || 'Преимущества инвестиций в Билим',
        advantages: contentMap.advantages || [
          {
            icon: 'TrendingUp',
            title: 'Высокая доходность',
            description: '12-15% годовых против 8% по банковским депозитам'
          },
          {
            icon: 'PieChart',
            title: 'Диверсификация',
            description: 'Недвижимость как защита от инфляции и валютных рисков'
          },
          {
            icon: 'HelpCircle',
            title: 'Полная поддержка',
            description: 'Помощь в управлении арендой и обслуживании недвижимости'
          }
        ],
        faq_title: contentMap.faq_title || 'Часто задаваемые вопросы',
        faq: contentMap.faq || [
          {
            question: 'Какая средняя доходность от аренды домов в посёлке?',
            answer: 'Средняя доходность составляет 12-15% годовых при правильном управлении арендой.'
          }
        ]
      });
    } catch (error) {
      console.error('Error loading benefits content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBenefitsContent = async () => {
    setSaving(true);
    try {
      const updates = [
        { section: 'benefits', key: 'title', value: benefitsContent.title },
        { section: 'benefits', key: 'subtitle', value: benefitsContent.subtitle },
        { section: 'benefits', key: 'advantages_title', value: benefitsContent.advantages_title },
        { section: 'benefits', key: 'advantages', value: benefitsContent.advantages },
        { section: 'benefits', key: 'faq_title', value: benefitsContent.faq_title },
        { section: 'benefits', key: 'faq', value: benefitsContent.faq }
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

      alert('Контент раздела "Экономические выгоды" сохранен!');
    } catch (error) {
      console.error('Error saving benefits content:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addAdvantage = () => {
    setBenefitsContent(prev => ({
      ...prev,
      advantages: [...prev.advantages, { icon: 'TrendingUp', title: '', description: '' }]
    }));
  };

  const updateAdvantage = (index: number, field: keyof Advantage, value: string) => {
    setBenefitsContent(prev => ({
      ...prev,
      advantages: prev.advantages.map((adv, i) => 
        i === index ? { ...adv, [field]: value } : adv
      )
    }));
  };

  const removeAdvantage = (index: number) => {
    setBenefitsContent(prev => ({
      ...prev,
      advantages: prev.advantages.filter((_, i) => i !== index)
    }));
  };

  const addFAQ = () => {
    setBenefitsContent(prev => ({
      ...prev,
      faq: [...prev.faq, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: keyof FAQ, value: string) => {
    setBenefitsContent(prev => ({
      ...prev,
      faq: prev.faq.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index: number) => {
    setBenefitsContent(prev => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index)
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
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление разделом "Экономические выгоды"</h2>
          </div>
          <button
            onClick={saveBenefitsContent}
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
                value={benefitsContent.title}
                onChange={(e) => setBenefitsContent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подзаголовок раздела
              </label>
              <textarea
                rows={3}
                value={benefitsContent.subtitle}
                onChange={(e) => setBenefitsContent(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Преимущества */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Преимущества инвестиций</h3>
            <button
              onClick={addAdvantage}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить преимущество</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок блока преимуществ
            </label>
            <input
              type="text"
              value={benefitsContent.advantages_title}
              onChange={(e) => setBenefitsContent(prev => ({ ...prev, advantages_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {benefitsContent.advantages.map((advantage, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Преимущество {index + 1}</h5>
                  <button
                    onClick={() => removeAdvantage(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Иконка (Lucide React)
                    </label>
                    <select
                      value={advantage.icon}
                      onChange={(e) => updateAdvantage(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="TrendingUp">TrendingUp</option>
                      <option value="PieChart">PieChart</option>
                      <option value="HelpCircle">HelpCircle</option>
                      <option value="Shield">Shield</option>
                      <option value="DollarSign">DollarSign</option>
                      <option value="Home">Home</option>
                      <option value="Users">Users</option>
                      <option value="Leaf">Leaf</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Заголовок
                    </label>
                    <input
                      type="text"
                      value={advantage.title}
                      onChange={(e) => updateAdvantage(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Название преимущества"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание
                    </label>
                    <textarea
                      rows={3}
                      value={advantage.description}
                      onChange={(e) => updateAdvantage(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Описание преимущества"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Часто задаваемые вопросы</h3>
            <button
              onClick={addFAQ}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить вопрос</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок блока FAQ
            </label>
            <input
              type="text"
              value={benefitsContent.faq_title}
              onChange={(e) => setBenefitsContent(prev => ({ ...prev, faq_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {benefitsContent.faq.map((faq, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Вопрос {index + 1}</h5>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вопрос
                    </label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Введите вопрос"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ответ
                    </label>
                    <textarea
                      rows={4}
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Введите ответ"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsManager;