import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Calendar, User, Phone, Mail, Eye, Check, X, Trash2 } from 'lucide-react';

interface Booking {
  id: string;
  house: string;
  check_in: string;
  check_out: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  status: 'new' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

const BookingsManager: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Ошибка при удалении');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'confirmed': return 'Подтверждена';
      case 'cancelled': return 'Отменена';
      case 'completed': return 'Завершена';
      default: return status;
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
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Заявки на бронирование</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Всего заявок: {bookings.length} | Новых: {bookings.filter(b => b.status === 'new').length}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(booking.check_in).toLocaleDateString('ru-RU')} - {new Date(booking.check_out).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{booking.email}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Дом:</strong> {booking.house}
                      </div>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Сообщение:</strong> {booking.message}
                      </p>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Создана: {new Date(booking.created_at).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Детали</span>
                  </button>
                  
                  {booking.status === 'new' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Подтвердить</span>
                    </button>
                  )}
                  
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Отменить</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Заявок на бронирование пока нет</p>
          </div>
        )}

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Детали заявки</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Информация о клиенте</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Имя:</strong> {selectedBooking.name}</p>
                      <p><strong>Телефон:</strong> {selectedBooking.phone}</p>
                      <p><strong>Email:</strong> {selectedBooking.email}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Детали бронирования</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Дом:</strong> {selectedBooking.house}</p>
                      <p><strong>Заезд:</strong> {new Date(selectedBooking.check_in).toLocaleDateString('ru-RU')}</p>
                      <p><strong>Выезд:</strong> {new Date(selectedBooking.check_out).toLocaleDateString('ru-RU')}</p>
                      <p><strong>Статус:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusText(selectedBooking.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Дополнительные пожелания</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {selectedBooking.message}
                    </p>
                  </div>
                )}

                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  {selectedBooking.status === 'new' && (
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'confirmed');
                        setSelectedBooking(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Подтвердить</span>
                    </button>
                  )}
                  
                  {selectedBooking.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        updateBookingStatus(selectedBooking.id, 'cancelled');
                        setSelectedBooking(null);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Отменить</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManager;