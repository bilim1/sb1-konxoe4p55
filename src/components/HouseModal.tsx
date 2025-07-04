import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Home, Users, MapPin } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';
import { House } from '../types';

interface HouseModalProps {
  house: House;
  onClose: () => void;
}

const HouseModal: React.FC<HouseModalProps> = ({ house, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % house.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + house.images.length) % house.images.length);
  };

  const handleBookingClick = () => {
    onClose();
    scrollToSection('booking');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>

          {/* Image Gallery */}
          <div className="relative">
            <img
              src={house.images[currentImageIndex]}
              alt={house.name}
              className="w-full h-96 object-cover rounded-t-xl"
            />
            
            {house.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-90 rounded-full p-2 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-90 rounded-full p-2 transition-all"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {house.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{house.name}</h2>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Home size={20} />
                  <span>{house.area} м²</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={20} />
                  <span>{house.rooms} комнат</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{house.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Materials */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Материалы</h3>
                <ul className="space-y-2">
                  {house.materials.map((material, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                      {material}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Особенности</h3>
                <ul className="space-y-2">
                  {house.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Стоимость</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">
                    {house.price.rent.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-gray-600">в месяц</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-700">
                    {house.price.buy.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-gray-600">за покупку</div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleBookingClick}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Забронировать
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseModal;