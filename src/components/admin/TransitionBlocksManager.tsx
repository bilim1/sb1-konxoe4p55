import React, { useState, useEffect } from 'react';
import { supabase, SiteContent } from '../../lib/supabase';
import { ArrowRight, Save, Plus, Trash2 } from 'lucide-react';

interface TransitionBlock {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  button_text: string;
  target_section: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const TransitionBlocksManager: React.FC = () => {
  const [transitionBlocks, setTransitionBlocks] = useState<TransitionBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTransitionBlocks();
  }, []);

  const loadTransitionBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'transitions');

      if (error) throw error;

      const blocks: TransitionBlock[] = [];
      data?.forEach(item => {
        if (typeof item.value === 'object' && item.value !== null) {
          blocks.push({
            id: item.key,
            ...item.value
          });
        }
      });

      // Если блоков нет, создаем дефолтные
      if (blocks.length === 0) {
        const defaultBlocks: TransitionBlock[] = [
          {
            id: 'to_projects',
            title: 'Готовы увидеть ваш будущий дом?',
            subtitle: 'Теперь, когда вы знаете о нашем проекте, давайте покажем вам конкретные варианты домов.',
            description: 'Каждый проект создан с любовью к деталям и заботой о вашем комфорте.',
            icon: 'Home',
            button_text: 'Смотреть проекты домов',
            target_section: 'projects',
            features: [
              {
                icon: 'Home',
                title: 'Для отдыха',
                description: 'Уютные дома для семейного отдыха и восстановления сил на природе'
              },
              {
                icon: 'TrendingUp',
                title: 'Для инвестиций',
                description: 'Доходная недвижимость с высокой рентабельностью и ростом стоимости'
              }
            ]
          },
          {
            id: 'to_benefits',
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
          },
          {
            id: 'to_management',
            title: 'А кто будет этим заниматься?',
            subtitle: 'Понимаем ваши сомнения! Управление арендной недвижимостью — это работа.',
            description: 'Но что если мы скажем, что можем взять все заботы на себя?',
            icon: 'Settings',
            button_text: 'Узнать об услугах управления',
            target_section: 'management',
            features: [
              {
                icon: 'Users',
                title: 'Поиск гостей',
                description: 'Мы найдем и проверим арендаторов'
              },
              {
                icon: 'Shield',
                title: 'Обслуживание',
                description: 'Уборка, ремонт, техподдержка'
              },
              {
                icon: 'Settings',
                title: 'Отчетность',
                description: 'Полная финансовая прозрачность'
              }
            ]
          },
          {
            id: 'to_booking',
            title: 'Готовы начать?',
            subtitle: 'Отлично! Теперь вы знаете все о наших домах, выгодах и услугах.',
            description: 'Давайте сделаем первый шаг — забронируем дом для знакомства или оформим покупку.',
            icon: 'Calendar',
            button_text: 'Оставить заявку',
            target_section: 'booking',
            features: [
              {
                icon: 'Calendar',
                title: 'Аренда для отдыха',
                description: 'Забронируйте дом на выходные или отпуск'
              },
              {
                icon: 'ShoppingCart',
                title: 'Покупка для инвестиций',
                description: 'Приобретите дом и получайте доход'
              }
            ]
          },
          {
            id: 'to_reviews',
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
          }
        ];
        setTransitionBlocks(defaultBlocks);
      } else {
        setTransitionBlocks(blocks);
      }
    } catch (error) {
      console.error('Error loading transition blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTransitionBlocks = async () => {
    setSaving(true);
    try {
      // Удаляем все существующие блоки переходов
      await supabase
        .from('site_content')
        .delete()
        .eq('section', 'transitions');

      // Сохраняем новые блоки
      for (const block of transitionBlocks) {
        const { id, ...blockData } = block;
        const { error } = await supabase
          .from('site_content')
          .insert({
            section: 'transitions',
            key: id,
            value: blockData,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      alert('Переходные блоки сохранены!');
    } catch (error) {
      console.error('Error saving transition blocks:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const updateBlock = (index: number, field: string, value: any) => {
    setTransitionBlocks(prev => prev.map((block, i) => 
      i === index ? { ...block, [field]: value } : block
    ));
  };

  const updateFeature = (blockIndex: number, featureIndex: number, field: string, value: string) => {
    setTransitionBlocks(prev => prev.map((block, i) => 
      i === blockIndex ? {
        ...block,
        features: block.features?.map((feature, j) => 
          j === featureIndex ? { ...feature, [field]: value } : feature
        )
      } : block
    ));
  };

  const addFeature = (blockIndex: number) => {
    setTransitionBlocks(prev => prev.map((block, i) => 
      i === blockIndex ? {
        ...block,
        features: [...(block.features || []), { icon: 'Star', title: '', description: '' }]
      } : block
    ));
  };

  const removeFeature = (blockIndex: number, featureIndex: number) => {
    setTransitionBlocks(prev => prev.map((block, i) => 
      i === blockIndex ? {
        ...block,
        features: block.features?.filter((_, j) => j !== featureIndex)
      } : block
    ));
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
            <ArrowRight className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление переходными блоками</h2>
          </div>
          <button
            onClick={saveTransitionBlocks}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
        <p className="text-gray-600 mt-2">
          Блоки, которые ведут пользователя по сайту между основными секциями
        </p>
      </div>

      <div className="p-6 space-y-8">
        {transitionBlocks.map((block, blockIndex) => (
          <div key={block.id} className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Переход к секции: {block.target_section}
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Заголовок
                </label>
                <input
                  type="text"
                  value={block.title}
                  onChange={(e) => updateBlock(blockIndex, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Подзаголовок
                </label>
                <textarea
                  rows={3}
                  value={block.subtitle}
                  onChange={(e) => updateBlock(blockIndex, 'subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дополнительное описание
                </label>
                <textarea
                  rows={2}
                  value={block.description}
                  onChange={(e) => updateBlock(blockIndex, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Иконка
                  </label>
                  <select
                    value={block.icon}
                    onChange={(e) => updateBlock(blockIndex, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Calculator">Calculator</option>
                    <option value="Settings">Settings</option>
                    <option value="Calendar">Calendar</option>
                    <option value="MessageSquare">MessageSquare</option>
                    <option value="TrendingUp">TrendingUp</option>
                    <option value="Users">Users</option>
                    <option value="Shield">Shield</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текст кнопки
                  </label>
                  <input
                    type="text"
                    value={block.button_text}
                    onChange={(e) => updateBlock(blockIndex, 'button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Целевая секция
                  </label>
                  <select
                    value={block.target_section}
                    onChange={(e) => updateBlock(blockIndex, 'target_section', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="projects">projects</option>
                    <option value="benefits">benefits</option>
                    <option value="management">management</option>
                    <option value="booking">booking</option>
                    <option value="reviews">reviews</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Особенности блока</h4>
                  <button
                    onClick={() => addFeature(blockIndex)}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Добавить</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {block.features?.map((feature, featureIndex) => (
                    <div key={featureIndex} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Особенность {featureIndex + 1}</h5>
                        <button
                          onClick={() => removeFeature(blockIndex, featureIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Иконка
                          </label>
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(blockIndex, featureIndex, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          >
                            <option value="Home">Home</option>
                            <option value="TrendingUp">TrendingUp</option>
                            <option value="Users">Users</option>
                            <option value="Shield">Shield</option>
                            <option value="Settings">Settings</option>
                            <option value="Calendar">Calendar</option>
                            <option value="ShoppingCart">ShoppingCart</option>
                            <option value="Star">Star</option>
                            <option value="MessageSquare">MessageSquare</option>
                            <option value="Clock">Clock</option>
                            <option value="DollarSign">DollarSign</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Заголовок
                          </label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateFeature(blockIndex, featureIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание
                          </label>
                          <input
                            type="text"
                            value={feature.description}
                            onChange={(e) => updateFeature(blockIndex, featureIndex, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransitionBlocksManager;