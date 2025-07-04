import React from 'react';
import { MapPin, Home, Users, ShoppingCart } from 'lucide-react';
import { House } from '../types';
import OptimizedImage from './OptimizedImage';
import { scrollToSection } from '../utils/navigation';

interface HouseCardProps {
  house: House;
  priceType: 'rent' | 'buy';
  onSelect: () => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ house, priceType, onSelect }) => {
  const formatPrice = (price: number, type: 'rent' | 'buy') => {
    if (type === 'rent') {
      return `${price.toLocaleString('ru-RU')} ₽/мес`;
    }
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  const handleBookingClick = (type: 'rent' | 'buy') => {
    // Сохраняем выбранный дом и тип в localStorage для автозаполнения формы
    localStorage.setItem('selectedHouse', house.name);
    localStorage.setItem('bookingType', type);
    scrollToSection('booking');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl group">
      <div className="relative h-64">
        <OptimizedImage
          src={house.images[0]}
          alt={house.name}
          className="w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          {formatPrice(house.price[priceType], priceType)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {house.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{house.description}</p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Home size={16} className="text-emerald-600" />
            <span className="font-medium">{house.area} м²</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} className="text-emerald-600" />
            <span className="font-medium">{house.rooms} комн.</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Особенности:</h4>
          <div className="flex flex-wrap gap-2">
            {house.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {feature}
              </span>
            ))}
            {house.features.length > 3 && (
              <span className="text-emerald-600 text-xs font-medium">+{house.features.length - 3} ещё</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onSelect}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Подробнее
          </button>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleBookingClick('rent')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
            >
              Забронировать
            </button>
            <button
              onClick={() => handleBookingClick('buy')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center justify-center space-x-1"
            >
              <ShoppingCart size={14} />
              <span>Купить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;