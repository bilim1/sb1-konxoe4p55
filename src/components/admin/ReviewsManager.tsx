import React, { useState, useEffect } from 'react';
import { supabase, Review } from '../../lib/supabase';
import { MessageSquare, Check, X, Trash2, Star } from 'lucide-react';

const ReviewsManager: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (review: Review) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: !review.is_approved })
        .eq('id', review.id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error toggling review approval:', error);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Ошибка при удалении');
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

  const approvedReviews = reviews.filter(r => r.is_approved);
  const pendingReviews = reviews.filter(r => !r.is_approved);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-6 h-6 text-emerald-600" />
          <h2 className="text-xl font-semibold text-gray-900">Управление отзывами</h2>
        </div>
        <p className="text-gray-600 mt-2">
          Всего отзывов: {reviews.length} | Одобрено: {approvedReviews.length} | На модерации: {pendingReviews.length}
        </p>
      </div>

      <div className="p-6">
        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              На модерации ({pendingReviews.length})
            </h3>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  onToggleApproval={toggleApproval}
                  onDelete={deleteReview}
                  renderStars={renderStars}
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Reviews */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Одобренные отзывы ({approvedReviews.length})
          </h3>
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onToggleApproval={toggleApproval}
                onDelete={deleteReview}
                renderStars={renderStars}
              />
            ))}
          </div>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Отзывов пока нет</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{
  review: Review;
  onToggleApproval: (review: Review) => void;
  onDelete: (id: string) => void;
  renderStars: (rating: number) => React.ReactNode;
}> = ({ review, onToggleApproval, onDelete, renderStars }) => {
  return (
    <div className={`border rounded-lg p-6 ${
      review.is_approved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
            <div className="flex space-x-1">
              {renderStars(review.rating)}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              review.is_approved 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {review.is_approved ? 'Одобрен' : 'На модерации'}
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">{review.text}</p>
          
          <div className="text-sm text-gray-500">
            {new Date(review.created_at).toLocaleDateString('ru-RU', {
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
            onClick={() => onToggleApproval(review)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
              review.is_approved
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {review.is_approved ? (
              <>
                <X className="w-4 h-4" />
                <span>Скрыть</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Одобрить</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => onDelete(review.id)}
            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsManager;