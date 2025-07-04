import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TermsOfService: React.FC = () => {
  const [content, setContent] = useState({
    title: 'Пользовательское соглашение',
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
        .in('key', ['terms_of_service_title', 'terms_of_service_content']);

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      setContent({
        title: contentMap.terms_of_service_title || 'Пользовательское соглашение',
        content: contentMap.terms_of_service_content || `
# Пользовательское соглашение

## 1. Общие положения

Настоящее Пользовательское соглашение регулирует отношения между администрацией сайта посёлка «Билим» и пользователями сайта.

## 2. Предмет соглашения

Сайт предоставляет пользователям доступ к информации о:
- Проектах домов для аренды и покупки
- Услугах по управлению недвижимостью
- Инвестиционных возможностях
- Новостях и событиях посёлка

## 3. Права и обязанности пользователей

Пользователи имеют право:
- Получать актуальную информацию об услугах
- Подавать заявки на бронирование
- Оставлять отзывы о качестве услуг

Пользователи обязуются:
- Предоставлять достоверную информацию
- Не нарушать работу сайта
- Соблюдать законодательство РФ

## 4. Ответственность сторон

Администрация сайта:
- Обеспечивает работоспособность сайта
- Защищает персональные данные пользователей
- Предоставляет актуальную информацию

## 5. Условия бронирования

- Бронирование осуществляется через форму на сайте
- Подтверждение бронирования происходит в течение 24 часов
- Отмена бронирования возможна не позднее чем за 7 дней

## 6. Интеллектуальная собственность

Все материалы сайта защищены авторским правом. Использование материалов без письменного согласия запрещено.

## 7. Изменение соглашения

Администрация оставляет за собой право изменять условия соглашения. Изменения вступают в силу с момента публикации на сайте.

## 8. Контактная информация

По вопросам соглашения обращайтесь:
Email: info@bilim-village.ru
Телефон: +7 (343) 123-45-67

Дата последнего обновления: ${new Date().toLocaleDateString('ru-RU')}
        `
      });
    } catch (error) {
      console.error('Error loading terms of service:', error);
      setContent({
        title: 'Пользовательское соглашение',
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

export default TermsOfService;