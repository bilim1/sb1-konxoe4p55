import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { Save, Edit3, Image, Type } from 'lucide-react';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (item: SiteContent) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({
          id: item.id,
          section: item.section,
          key: item.key,
          value: item.value,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setEditingItem(null);
      await loadContent();
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const updateContentValue = (id: string, newValue: any) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, value: newValue } : item
    ));
  };

  const renderEditor = (item: SiteContent) => {
    const isEditing = editingItem === item.id;
    
    if (!isEditing) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">
              {item.section}.{item.key}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {typeof item.value === 'string' 
                ? item.value.substring(0, 100) + (item.value.length > 100 ? '...' : '')
                : JSON.stringify(item.value).substring(0, 100) + '...'
              }
            </p>
          </div>
          <button
            onClick={() => setEditingItem(item.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Редактировать</span>
          </button>
        </div>
      );
    }

    return (
      <div className="p-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Редактирование: {item.section}.{item.key}
          </h4>
          <div className="flex space-x-2">
            <button
              onClick={() => saveContent(item)}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>

        {/* Different editors based on content type */}
        {item.key === 'slides' ? (
          <SlidesEditor 
            value={item.value} 
            onChange={(newValue) => updateContentValue(item.id, newValue)} 
          />
        ) : typeof item.value === 'string' ? (
          <textarea
            value={item.value}
            onChange={(e) => updateContentValue(item.id, e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Введите текст..."
          />
        ) : (
          <textarea
            value={JSON.stringify(item.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateContentValue(item.id, parsed);
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
            placeholder="JSON данные..."
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Type className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Редактирование контента</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Управляйте текстовым контентом и изображениями на сайте
        </p>
      </div>

      <div className="p-6 space-y-6">
        {content.map((item) => (
          <div key={item.id}>
            {renderEditor(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for editing slides
const SlidesEditor: React.FC<{ value: any; onChange: (value: any) => void }> = ({ value, onChange }) => {
  const slides = Array.isArray(value) ? value : [];

  const updateSlide = (index: number, field: string, newValue: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: newValue };
    onChange(newSlides);
  };

  const addSlide = () => {
    onChange([...slides, { image: '', title: '' }]);
  };

  const removeSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    onChange(newSlides);
  };

  return (
    <div className="space-y-4">
      {slides.map((slide: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-medium text-gray-900">Слайд {index + 1}</h5>
            <button
              onClick={() => removeSlide(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Удалить
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL изображения
              </label>
              <input
                type="url"
                value={slide.image || ''}
                onChange={(e) => updateSlide(index, 'image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Заголовок
              </label>
              <input
                type="text"
                value={slide.title || ''}
                onChange={(e) => updateSlide(index, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Заголовок слайда"
              />
            </div>
          </div>
        </div>
      ))}
      
      <button
        onClick={addSlide}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
      >
        + Добавить слайд
      </button>
    </div>
  );
};

export default ContentEditor;