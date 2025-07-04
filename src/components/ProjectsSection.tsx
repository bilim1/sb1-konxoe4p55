import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import HouseCard from './HouseCard';

interface House {
  id: string;
  name: string;
  area: number;
  rooms: number;
  rent_price: number;
  buy_price: number;
  images: string[];
  description: string;
  materials: string[];
  features: string[];
  is_active: boolean;
}

interface ProjectsSectionProps {
  onHouseSelect: (house: any) => void;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onHouseSelect }) => {
  const [filters, setFilters] = useState({
    area: { min: '', max: '' },
    rooms: '',
    priceType: 'rent' as 'rent' | 'buy'
  });

  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setHouses(data || []);
    } catch (error) {
      console.error('Error loading houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHouses = houses.filter((house) => {
    const minArea = filters.area.min ? parseInt(filters.area.min) : 0;
    const maxArea = filters.area.max ? parseInt(filters.area.max) : Infinity;
    const roomsFilter = filters.rooms ? parseInt(filters.rooms) : 0;
    
    return (
      house.area >= minArea &&
      house.area <= maxArea &&
      (roomsFilter === 0 || house.rooms === roomsFilter)
    );
  });

  // Преобразуем данные из базы в формат, ожидаемый HouseCard
  const transformedHouses = filteredHouses.map(house => ({
    ...house,
    price: {
      rent: house.rent_price,
      buy: house.buy_price
    }
  }));

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка проектов...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Проекты домов</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Выберите идеальный дом для отдыха или инвестиций. Каждый проект создан 
            с заботой о комфорте и экологичности.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Площадь (м²)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="От"
                  value={filters.area.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    area: { ...filters.area, min: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  placeholder="До"
                  value={filters.area.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    area: { ...filters.area, max: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество комнат
              </label>
              <select
                value={filters.rooms}
                onChange={(e) => setFilters({ ...filters, rooms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Все</option>
                <option value="1">1 комната</option>
                <option value="2">2 комнаты</option>
                <option value="3">3 комнаты</option>
                <option value="4">4 комнаты</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип цены
              </label>
              <select
                value={filters.priceType}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  priceType: e.target.value as 'rent' | 'buy' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="rent">Аренда</option>
                <option value="buy">Покупка</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  area: { min: '', max: '' },
                  rooms: '',
                  priceType: 'rent'
                })}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Сбросить фильтры
              </button>
            </div>
          </div>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformedHouses.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              priceType={filters.priceType}
              onSelect={() => onHouseSelect(house)}
            />
          ))}
        </div>

        {transformedHouses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              По выбранным фильтрам домов не найдено. Попробуйте изменить параметры поиска.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;