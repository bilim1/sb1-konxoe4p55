import React, { useState, useEffect } from 'react';
import { supabase, BlogPost } from '../../lib/supabase';
import { FileText, Plus, Edit3, Trash2, Save, X, Eye, EyeOff, Bold, Italic, Underline, Type, Palette } from 'lucide-react';

const BlogManager: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (post: Partial<BlogPost>) => {
    try {
      if (post.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            is_published: post.is_published,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);

        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            image: post.image,
            is_published: post.is_published ?? true,
            sort_order: posts.length
          });

        if (error) throw error;
      }

      setEditingPost(null);
      setIsCreating(false);
      await loadPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Ошибка при сохранении');
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту статью?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Ошибка при удалении');
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: !post.is_published })
        .eq('id', post.id);

      if (error) throw error;
      await loadPosts();
    } catch (error) {
      console.error('Error toggling post status:', error);
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
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold text-gray-900">Управление блогом</h2>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить статью</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {(isCreating || editingPost) && (
          <PostForm
            post={editingPost}
            onSave={savePost}
            onCancel={() => {
              setEditingPost(null);
              setIsCreating(false);
            }}
          />
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {post.is_published ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  
                  <div className="text-sm text-gray-500">
                    Создано: {new Date(post.created_at).toLocaleDateString('ru-RU')}
                    {post.updated_at !== post.created_at && (
                      <span className="ml-4">
                        Обновлено: {new Date(post.updated_at).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Редактировать</span>
                  </button>
                  
                  <button
                    onClick={() => togglePublished(post)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      post.is_published
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{post.is_published ? 'Скрыть' : 'Опубликовать'}</span>
                  </button>
                  
                  <button
                    onClick={() => deletePost(post.id)}
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

const PostForm: React.FC<{
  post: BlogPost | null;
  onSave: (post: Partial<BlogPost>) => void;
  onCancel: () => void;
}> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    image: post?.image || '',
    is_published: post?.is_published ?? true
  });

  const [selectedText, setSelectedText] = useState('');
  const contentRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...post,
      ...formData
    };

    onSave(postData);
  };

  const applyFormatting = (tag: string, style?: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      
      switch (tag) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'underline':
          formattedText = `<u>${selectedText}</u>`;
          break;
        case 'color':
          formattedText = `<span style="color: ${style}">${selectedText}</span>`;
          break;
        case 'h1':
          formattedText = `# ${selectedText}`;
          break;
        case 'h2':
          formattedText = `## ${selectedText}`;
          break;
        case 'h3':
          formattedText = `### ${selectedText}`;
          break;
        default:
          formattedText = selectedText;
      }

      const newContent = 
        textarea.value.substring(0, start) + 
        formattedText + 
        textarea.value.substring(end);
      
      setFormData({ ...formData, content: newContent });
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }, 0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {post ? 'Редактировать статью' : 'Добавить новую статью'}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок статьи *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Введите заголовок статьи"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Краткое описание *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Краткое описание статьи для превью"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL изображения
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Содержание статьи *
            </label>
            
            {/* Toolbar */}
            <div className="border border-gray-300 rounded-t-lg p-3 bg-gray-50 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyFormatting('bold')}
                className="p-2 hover:bg-gray-200 rounded"
                title="Жирный"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('italic')}
                className="p-2 hover:bg-gray-200 rounded"
                title="Курсив"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('underline')}
                className="p-2 hover:bg-gray-200 rounded"
                title="Подчеркнутый"
              >
                <Underline className="w-4 h-4" />
              </button>
              
              <div className="w-px bg-gray-300 mx-1"></div>
              
              <button
                type="button"
                onClick={() => applyFormatting('h1')}
                className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                title="Заголовок 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('h2')}
                className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                title="Заголовок 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => applyFormatting('h3')}
                className="px-3 py-2 hover:bg-gray-200 rounded text-sm font-bold"
                title="Заголовок 3"
              >
                H3
              </button>
              
              <div className="w-px bg-gray-300 mx-1"></div>
              
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-gray-600" />
                <select
                  onChange={(e) => applyFormatting('color', e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                  defaultValue=""
                >
                  <option value="">Цвет текста</option>
                  <option value="#ef4444">Красный</option>
                  <option value="#3b82f6">Синий</option>
                  <option value="#10b981">Зеленый</option>
                  <option value="#f59e0b">Оранжевый</option>
                  <option value="#8b5cf6">Фиолетовый</option>
                  <option value="#6b7280">Серый</option>
                </select>
              </div>
            </div>
            
            <textarea
              ref={contentRef}
              required
              rows={20}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-b-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
              placeholder="Полный текст статьи... Используйте панель инструментов для форматирования."
            />
            
            <div className="mt-2 text-sm text-gray-500">
              <p><strong>Подсказки по форматированию:</strong></p>
              <p>• Выделите текст и используйте кнопки форматирования</p>
              <p>• **жирный**, *курсив*, # Заголовок 1, ## Заголовок 2</p>
              <p>• HTML теги: &lt;u&gt;подчеркнутый&lt;/u&gt;, &lt;span style="color: red"&gt;цветной&lt;/span&gt;</p>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-gray-700">Опубликовать статью</span>
            </label>
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

export default BlogManager;