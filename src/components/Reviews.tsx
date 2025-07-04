import React, { useState, useEffect } from 'react';
import { Star, Send, User, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  created_at: string;
  is_approved: boolean;
}

const Reviews: React.FC = () => {
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    text: ''
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.text) {
      try {
        const { error } = await supabase
          .from('reviews')
          .insert({
            name: newReview.name,
            rating: newReview.rating,
            text: newReview.text,
            is_approved: false // Требует модерации
          });

        if (error) throw error;

        setNewReview({ name: '', rating: 5, text: '' });
        alert('Спасибо за ваш отзыв! Он будет опубликован после модерации.');
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Ошибка при отправке отзыва. Попробуйте еще раз.');
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Показываем только первые 4 отзыва, если не нажата кнопка "показать все"
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  if (loading) {
    return (
      <section id="reviews" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка отзывов...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы наших гостей</h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex space-x-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {averageRating.toFixed(1)} из 5
              </span>
              <span className="text-gray-500">({reviews.length} отзывов)</span>
            </div>
          )}
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Мнения реальных гостей и инвесторов о посёлке «Билим»
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-emerald-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.text}</p>
              </div>
            ))}

            {/* Show More Button */}
            {reviews.length > 4 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <span>{showAllReviews ? 'Скрыть отзывы' : 'Читать все отзывы'}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
                </button>
              </div>
            )}

            {reviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">
                  Станьте первым, кто оставит отзыв!
                </p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="bg-emerald-50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Оставить отзыв</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reviewName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="reviewName"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Оценка *
                </label>
                <div className="flex space-x-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={24}
                        className={`${
                          i < newReview.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 hover:text-yellow-200'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
                  Ваш отзыв *
                </label>
                <textarea
                  id="reviewText"
                  required
                  rows={4}
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Поделитесь своим опытом..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send size={18} />
                <span>Отправить отзыв</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;