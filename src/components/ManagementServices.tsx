import React, { useState } from 'react';
import { Users, Shield, Settings, DollarSign, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';

const ManagementServices: React.FC = () => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: Users,
      title: 'Поиск и проверка гостей',
      description: 'Мы найдем надежных арендаторов, проверим их документы и репутацию',
      details: [
        'Размещение объявлений на популярных площадках',
        'Профессиональная фотосъемка',
        'Проверка документов арендаторов',
        'Заключение договоров аренды',
        'Сбор залоговых депозитов'
      ],
      price: '15% от дохода'
    },
    {
      icon: Shield,
      title: 'Обслуживание и уборка',
      description: 'Поддерживаем ваш дом в идеальном состоянии между заездами гостей',
      details: [
        'Профессиональная уборка после каждого гостя',
        'Смена постельного белья и полотенец',
        'Проверка технического состояния',
        'Мелкий ремонт и устранение неисправностей',
        'Контроль за состоянием мебели и техники'
      ],
      price: '2000-3000₽ за заезд'
    },
    {
      icon: Settings,
      title: 'Техническое обслуживание',
      description: 'Регулярное обслуживание всех систем дома для бесперебойной работы',
      details: [
        'Обслуживание отопительной системы',
        'Проверка электрики и сантехники',
        'Уход за территорией и ландшафтом',
        'Подготовка к сезонам',
        'Экстренный ремонт 24/7'
      ],
      price: '5000₽ в месяц'
    },
    {
      icon: DollarSign,
      title: 'Финансовое управление',
      description: 'Полная прозрачность доходов и расходов с детальной отчетностью',
      details: [
        'Ежемесячные финансовые отчеты',
        'Перечисление доходов на ваш счет',
        'Ведение налогового учета',
        'Оптимизация ценообразования',
        'Анализ рентабельности'
      ],
      price: 'Включено в базовый тариф'
    }
  ];

  return (
    <section id="management" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Услуги управления недвижимостью
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Мы берем на себя все заботы по управлению вашей недвижимостью, 
            а вы получаете стабильный доход без лишних хлопот
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    activeService === index
                      ? 'bg-emerald-50 border-2 border-emerald-200 shadow-lg'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveService(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      activeService === index ? 'bg-emerald-600' : 'bg-gray-400'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      <div className="text-emerald-600 font-semibold">{service.price}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Service Details */}
          <div className="bg-emerald-50 rounded-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              {React.createElement(services[activeService].icon, {
                className: "w-8 h-8 text-emerald-600"
              })}
              <h3 className="text-2xl font-bold text-gray-900">
                {services[activeService].title}
              </h3>
            </div>
            
            <p className="text-gray-700 mb-6">{services[activeService].description}</p>
            
            <div className="space-y-3">
              {services[activeService].details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{detail}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Стоимость:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {services[activeService].price}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Остались вопросы об управлении?
          </h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Наши специалисты готовы ответить на все ваши вопросы и подобрать 
            оптимальный пакет услуг для вашей недвижимости
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+73431234567"
              className="inline-flex items-center space-x-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>+7 (343) 123-45-67</span>
            </a>
            <a
              href="mailto:info@bilim-village.ru"
              className="inline-flex items-center space-x-2 bg-emerald-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>info@bilim-village.ru</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManagementServices;