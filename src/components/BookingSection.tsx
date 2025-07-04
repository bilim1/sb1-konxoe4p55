import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Send, Home, ShoppingCart } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingTerm {
  title: string;
  description: string;
  type: 'primary' | 'secondary';
}

interface IncludedItem {
  item: string;
}

interface House {
  id: string;
  name: string;
  is_active: boolean;
}

const BookingSection: React.FC = () => {
  const [bookingType, setBookingType] = useState<'rent' | 'buy'>('rent');
  const [formData, setFormData] = useState({
    house: '',
    checkIn: '',
    checkOut: '',
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [houses, setHouses] = useState<House[]>([]);
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

  useEffect(() => {
    loadTermsContent();
    loadHouses();
    
    // Проверяем localStorage для автозаполнения
    const selectedHouse = localStorage.getItem('selectedHouse');
    const savedBookingType = localStorage.getItem('bookingType') as 'rent' | 'buy';
    
    if (selectedHouse) {
      setFormData(prev => ({ ...prev, house: selectedHouse }));
      localStorage.removeItem('selectedHouse');
    }
    
    if (savedBookingType) {
      setBookingType(savedBookingType);
      localStorage.removeItem('bookingType');
    }
  }, []);

  const loadHouses = async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('id, name, is_active')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setHouses(data || []);
    } catch (error) {
      console.error('Error loading houses:', error);
    }
  };

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          house: formData.house,
          check_in: bookingType === 'rent' ? formData.checkIn : null,
          check_out: bookingType === 'rent' ? formData.checkOut : null,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message || null,
          booking_type: bookingType,
          status: 'new'
        });

      if (error) throw error;

      const successMessage = bookingType === 'rent' 
        ? 'Заявка на бронирование успешно отправлена! Мы свяжемся с вами в ближайшее время.'
        : 'Заявка на покупку успешно отправлена! Наш менеджер свяжется с вами для консультации.';
      
      alert(successMessage);
      setFormData({
        house: '',
        checkIn: '',
        checkOut: '',
        name: '',
        phone: '',
        email: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const primaryTerms = termsContent.terms.filter(term => term.type === 'primary');
  const secondaryTerms = termsContent.terms.filter(term => term.type === 'secondary');

  return (
    <section id="booking" className="py-20 bg-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Бронирование</h2>
          <p className="text-lg text-gray-600">
            Заполните форму ниже, и мы свяжемся с вами для подтверждения
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Переключатель типа заявки */}
          <div className="bg-gray-50 p-6 border-b">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg p-1 flex">
                <button
                  onClick={() => setBookingType('rent')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    bookingType === 'rent'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Аренда для отдыха</span>
                </button>
                <button
                  onClick={() => setBookingType('buy')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                    bookingType === 'buy'
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:text-emerald-600'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Покупка для инвестиций</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* House Selection */}
              <div>
                <label htmlFor="house" className="block text-sm font-medium text-gray-700 mb-2">
                  Выберите дом *
                </label>
                <select
                  id="house"
                  name="house"
                  required
                  value={formData.house}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Выберите дом...</option>
                  {houses.map((house) => (
                    <option key={house.id} value={house.name}>{house.name}</option>
                  ))}
                </select>
              </div>

              {/* Dates - только для аренды */}
              {bookingType === 'rent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Дата заезда *
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      required
                      value={formData.checkIn}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      Дата выезда *
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      required
                      value={formData.checkOut}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Введите ваше имя"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="inline w-4 h-4 mr-1" />
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {bookingType === 'rent' ? 'Дополнительные пожелания' : 'Вопросы по покупке'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder={
                    bookingType === 'rent' 
                      ? 'Расскажите о ваших пожеланиях...'
                      : 'Задайте вопросы о покупке, инвестициях, управлении...'
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>
                  {isSubmitting 
                    ? 'Отправка...' 
                    : bookingType === 'rent' 
                      ? 'Отправить заявку на бронирование'
                      : 'Отправить заявку на покупку'
                  }
                </span>
              </button>
            </form>
          </div>

          {/* Terms - управляемые через админку */}
          <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 p-8 border-t border-emerald-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{termsContent.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {primaryTerms.map((term, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{term.title}</h4>
                        <p className="text-gray-600 mt-1">{term.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  {secondaryTerms.map((term, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{term.title}</h4>
                        <p className="text-gray-600 mt-1">{term.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-emerald-500">
                <h4 className="font-bold text-gray-900 text-lg mb-2">{termsContent.included_title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  {termsContent.included_items.map((item, index) => (
                    <div key={index}>• {item.item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;