import React, { useState, useEffect } from 'react';
import { supabase, House } from '../../lib/supabase';
import { Home, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

const HousesManager: React.FC = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      const { data, error } = await supabase
        .from('houses')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setHouses(data || []);
    } catch (error) {
      console.error('Error loading houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHouse = async (house: Partial<House>) => {
    try {
      if (house.id) {
        // Update existing house
        const { error } = await supabase
          .from('houses')
          .update({
            name: house.name,
            area: house.area,
            rooms: house.rooms,
            rent_price: house.rent_price,
            buy_price: house.buy_price,
            images: house.images,
            description: house.description,
            materials: house.materials,
            features: house.features,
            is_active: house.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', house.id);

        if (error) throw error;
      } else {
        // Create new house
        const { error } = await supabase
          .from('houses')
          .insert({
            name: house.name,
            area: house.area,
            rooms: house.rooms,
            rent_price: house.rent_price,
            buy_price: house.buy_price,
            images: house.images || [],
            description: house.description,
            materials: house.materials || [],
            features: house.features || [],
            is_active: house.is_active ?? true,
            sort_order: houses.length
          });

        if (error) throw error;
      }

      setEditingHouse(null);
      setIsCreating(false);
      await loadHouses();
    } catch (error) {
      console.error('Error saving house:', error);
      alert('Ошибка при сохранении');
    }
  };

  const deleteHouse = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот дом?')) return;

    try {
      const { error } = await supabase
        .from('houses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadHouses();
    } catch (error) {
      console.error('Error deleting house:', error);
      alert('Ошибка при удалении');
    }
  };

  const toggleActive = async (house: House) => {
    try {
      const { error } = await supabase
        .from('houses')
        .update({ is_active: !house.is_active })
        .eq('id', house.id);

      if (error) throw error;
      await loadHouses();
    } catch (error) {
      console.error('Error toggling house status:', error);
    }
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
            <Home className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление домами</h2>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить дом</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {(isCreating || editingHouse) && (
          <HouseForm
            house={editingHouse}
            onSave={saveHouse}
            onCancel={() => {
              setEditingHouse(null);
              setIsCreating(false);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <div key={house.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={house.images[0] || '/placeholder-house.jpg'}
                alt={house.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{house.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    house.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {house.is_active ? 'Активен' : 'Скрыт'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{house.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{house.area} м²</span>
                  <span>{house.rooms} комн.</span>
                  <span>{house.rent_price.toLocaleString()} ₽/мес</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingHouse(house)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Редактировать</span>
                  </button>
                  
                  <button
                    onClick={() => toggleActive(house)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      house.is_active
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {house.is_active ? 'Скрыть' : 'Показать'}
                  </button>
                  
                  <button
                    onClick={() => deleteHouse(house.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HouseForm: React.FC<{
  house: House | null;
  onSave: (house: Partial<House>) => void;
  onCancel: () => void;
}> = ({ house, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: house?.name || '',
    area: house?.area || 0,
    rooms: house?.rooms || 1,
    rent_price: house?.rent_price || 0,
    buy_price: house?.buy_price || 0,
    description: house?.description || '',
    images: house?.images?.join('\n') || '',
    materials: house?.materials?.join('\n') || '',
    features: house?.features?.join('\n') || '',
    is_active: house?.is_active ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const houseData = {
      ...house,
      name: formData.name,
      area: Number(formData.area),
      rooms: Number(formData.rooms),
      rent_price: Number(formData.rent_price),
      buy_price: Number(formData.buy_price),
      description: formData.description,
      images: formData.images.split('\n').filter(img => img.trim()),
      materials: formData.materials.split('\n').filter(mat => mat.trim()),
      features: formData.features.split('\n').filter(feat => feat.trim()),
      is_active: formData.is_active
    };

    onSave(houseData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {house ? 'Редактировать дом' : 'Добавить новый дом'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название дома *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Площадь (м²) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Количество комнат *
              </label>
              <input
                type="number"
                required
                min="1"
                max="10"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена аренды (₽/мес) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.rent_price}
                onChange={(e) => setFormData({ ...formData, rent_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена покупки (₽) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.buy_price}
                onChange={(e) => setFormData({ ...formData, buy_price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium text-gray-700">Активен (показывать на сайте)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Описание дома..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL изображений (по одному на строку)
            </label>
            <textarea
              rows={4}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Материалы (по одному на строку)
              </label>
              <textarea
                rows={4}
                value={formData.materials}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Клееный брус&#10;Натуральный камень"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Особенности (по одной на строку)
              </label>
              <textarea
                rows={4}
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Панорамные окна&#10;Терраса&#10;Камин"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HousesManager;