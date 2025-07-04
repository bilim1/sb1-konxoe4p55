import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PrivacyPolicy: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Политика конфиденциальности',
    content: 'Загрузка...'
  });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'pages')
        .in('key', ['privacy_policy_title', 'privacy_policy_content']);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      setContent({
        title: contentMap.privacy_policy_title || 'Политика конфиденциальности',
        content: contentMap.privacy_policy_content || `
# Политика конфиденциальности

## 1. Общие положения

Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта посёлка «Билим».

## 2. Сбор персональных данных

Мы собираем следующие персональные данные:
- Имя и фамилия
- Контактный телефон
- Адрес электронной почты
- Другая информация, предоставленная добровольно

## 3. Цели обработки данных

Персональные данные обрабатываются в следующих целях:
- Обработка заявок на бронирование
- Предоставление информации об услугах
- Улучшение качества обслуживания
- Маркетинговые коммуникации (с согласия пользователя)

## 4. Защита данных

Мы принимаем все необходимые меры для защиты персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.

## 5. Права пользователей

Пользователи имеют право:
- Получать информацию об обработке своих данных
- Требовать исправления неточных данных
- Требовать удаления своих данных
- Отозвать согласие на обработку данных

## 6. Контактная информация

По вопросам обработки персональных данных обращайтесь:
Email: info@bilim-village.ru
Телефон: +7 (343) 123-45-67

Дата последнего обновления: ${new Date().toLocaleDateString('ru-RU')}
        `
      });
    } catch (error) {
      console.error('Error loading privacy policy:', error);
      setContent({
        title: 'Политика конфиденциальности',
        content: 'Ошибка загрузки содержимого. Пожалуйста, попробуйте позже.'
      });
    }
  };

  const formatContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold text-gray-900 mb-4 mt-8">{line.substring(3)}</h2>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="text-gray-700 mb-2">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
            
            <h1 className="text-4xl font-bold text-gray-900">{content.title}</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            {formatContent(content.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;