import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  created_at: string;
  is_published: boolean;
}

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllPosts, setShowAllPosts] = useState(false);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Показываем только первые 6 статей, если не нажата кнопка "показать все"
  const displayedPosts = showAllPosts ? blogPosts : blogPosts.slice(0, 6);

  const formatContent = (content: string) => {
    // Простая обработка markdown и HTML
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка статей...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Блог</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Новости посёлка, советы по аренде и инвестициям в недвижимость
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar size={16} className="mr-1" />
                  <span>{new Date(post.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <button
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  Читать статью
                  <ArrowRight size={16} className="ml-1" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              Статьи скоро появятся
            </p>
          </div>
        )}

        {/* Show More Button */}
        {blogPosts.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAllPosts(!showAllPosts)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <span>{showAllPosts ? 'Скрыть статьи' : 'Больше статей'}</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showAllPosts ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}

        {/* Blog Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-all"
                >
                  <X size={24} />
                </button>

                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-t-xl"
                />

                <div className="p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar size={16} className="mr-1" />
                    <span>{new Date(selectedPost.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    {selectedPost.title}
                  </h1>

                  <div 
                    className="prose prose-lg max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: formatContent(selectedPost.content) }}
                  />

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;