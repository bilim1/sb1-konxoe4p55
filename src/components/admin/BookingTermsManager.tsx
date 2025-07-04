import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { Calendar, Save, Plus, Trash2 } from 'lucide-react';

interface BookingTerm {
  title: string;
  description: string;
  type: 'primary' | 'secondary';
}

interface IncludedItem {
  item: string;
}

const BookingTermsManager: React.FC = () => {
  const [termsContent, setTermsContent] = useState({
    title: 'Условия аренды',
    terms: [
      {
        title: 'Предоплата',
        description: '30% от стоимости аренды при подтверждении бронирования',
        type: 'primary' as const
      },
      {
        title: 'Бесплатная отмена',
        description: 'За 7 дней до заезда без штрафных санкций',
        type: 'primary' as const
      },
      {
        title: 'Время заезда',
        description: 'С 14:00, выезд до 12:00. Возможна договоренность о других временах',
        type: 'primary' as const
      },
      {
        title: 'Поздняя отмена',
        description: 'Менее 7 дней — удерживается 50% от предоплаты',
        type: 'secondary' as const
      },
      {
        title: 'Ограничения',
        description: 'Курение запрещено внутри домов. Разрешено на террасах',
        type: 'secondary' as const
      },
      {
        title: 'Гости',
        description: 'Согласно вместимости дома. Дополнительные гости — доплата',
        type: 'secondary' as const
      }
    ] as BookingTerm[],
    included_title: 'Что включено в стоимость',
    included_items: [
      { item: 'Постельное белье и полотенца' },
      { item: 'Уборка перед заездом' },
      { item: 'Коммунальные услуги' },
      { item: 'Парковочное место' },
      { item: 'Wi-Fi интернет' },
      { item: 'Базовая кухонная утварь' }
    ] as IncludedItem[]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTermsContent();
  }, []);

  const loadTermsContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'booking_terms');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      if (Object.keys(contentMap).length > 0) {
        setTermsContent(prev => ({
          ...prev,
          ...contentMap
        }));
      }
    } catch (error) {
      console.error('Error loading booking terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTermsContent = async () => {
    setSaving(true);
    try {
      const updates = [
        { section: 'booking_terms', key: 'title', value: termsContent.title },
        { section: 'booking_terms', key: 'terms', value: termsContent.terms },
        { section: 'booking_terms', key: 'included_title', value: termsContent.included_title },
        { section: 'booking_terms', key: 'included_items', value: termsContent.included_items }
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

      alert('Условия аренды сохранены!');
    } catch (error) {
      console.error('Error saving booking terms:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addTerm = () => {
    setTermsContent(prev => ({
      ...prev,
      terms: [...prev.terms, { title: '', description: '', type: 'primary' }]
    }));
  };

  const updateTerm = (index: number, field: keyof BookingTerm, value: string) => {
    setTermsContent(prev => ({
      ...prev,
      terms: prev.terms.map((term, i) => 
        i === index ? { ...term, [field]: value } : term
      )
    }));
  };

  const removeTerm = (index: number) => {
    setTermsContent(prev => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index)
    }));
  };

  const addIncludedItem = () => {
    setTermsContent(prev => ({
      ...prev,
      included_items: [...prev.included_items, { item: '' }]
    }));
  };

  const updateIncludedItem = (index: number, value: string) => {
    setTermsContent(prev => ({
      ...prev,
      included_items: prev.included_items.map((item, i) => 
        i === index ? { item: value } : item
      )
    }));
  };

  const removeIncludedItem = (index: number) => {
    setTermsContent(prev => ({
      ...prev,
      included_items: prev.included_items.filter((_, i) => i !== index)
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
            <Calendar className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление условиями аренды</h2>
          </div>
          <button
            onClick={saveTermsContent}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Основной заголовок */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Основной заголовок</h3>
          <input
            type="text"
            value={termsContent.title}
            onChange={(e) => setTermsContent(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Условия аренды"
          />
        </div>

        {/* Условия аренды */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Условия аренды</h3>
            <button
              onClick={addTerm}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить условие</span>
            </button>
          </div>

          <div className="space-y-4">
            {termsContent.terms.map((term, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="font-medium text-gray-900">Условие {index + 1}</h5>
                  <button
                    onClick={() => removeTerm(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Заголовок условия
                    </label>
                    <input
                      type="text"
                      value={term.title}
                      onChange={(e) => updateTerm(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Название условия"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание условия
                    </label>
                    <textarea
                      rows={3}
                      value={term.description}
                      onChange={(e) => updateTerm(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Подробное описание условия"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тип условия
                    </label>
                    <select
                      value={term.type}
                      onChange={(e) => updateTerm(index, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="primary">Основное (зеленые точки)</option>
                      <option value="secondary">Дополнительное (синие точки)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Что включено в стоимость */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Что включено в стоимость</h3>
            <button
              onClick={addIncludedItem}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить пункт</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок блока
            </label>
            <input
              type="text"
              value={termsContent.included_title}
              onChange={(e) => setTermsContent(prev => ({ ...prev, included_title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            {termsContent.included_items.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={item.item}
                  onChange={(e) => updateIncludedItem(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Что включено в стоимость"
                />
                <button
                  onClick={() => removeIncludedItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTermsManager;