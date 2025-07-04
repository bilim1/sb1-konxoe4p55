import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Home, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  BarChart3,
  Users,
  Info,
  TrendingUp,
  Layout,
  Search,
  Calendar,
  ExternalLink,
  Bell,
  X,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ContentEditor from './ContentEditor';
import HousesManager from './HousesManager';
import BlogManager from './BlogManager';
import ReviewsManager from './ReviewsManager';
import SettingsManager from './SettingsManager';
import AboutManager from './AboutManager';
import BenefitsManager from './BenefitsManager';
import FooterManager from './FooterManager';
import PagesManager from './PagesManager';
import SEOManager from './SEOManager';
import BookingsManager from './BookingsManager';
import BookingTermsManager from './BookingTermsManager';
import TransitionBlocksManager from './TransitionBlocksManager';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('bookings');
  const [notifications, setNotifications] = useState<{
    newReviews: number;
    newBookings: number;
  }>({
    newReviews: 0,
    newBookings: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);

  const tabs = [
    { id: 'bookings', label: 'Заявки', icon: Calendar },
    { id: 'content', label: 'Контент сайта', icon: FileText },
    { id: 'houses', label: 'Проекты домов', icon: Home },
    { id: 'about', label: 'О проекте', icon: Info },
    { id: 'benefits', label: 'Экономические выгоды', icon: TrendingUp },
    { id: 'booking-terms', label: 'Условия аренды', icon: Calendar },
    { id: 'transitions', label: 'Переходные блоки', icon: ArrowRight },
    { id: 'footer', label: 'Футер', icon: Layout },
    { id: 'blog', label: 'Блог', icon: MessageSquare },
    { id: 'reviews', label: 'Отзывы', icon: Users },
    { id: 'pages', label: 'Страницы', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'settings', label: 'Настройки', icon: Settings }
  ];

  useEffect(() => {
    loadNotifications();
    // Обновляем уведомления каждые 30 секунд
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      // Получаем количество новых отзывов (не одобренных)
      const { count: newReviews } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      // Получаем количество новых заявок (со статусом 'new')
      const { count: newBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new');

      setNotifications({
        newReviews: newReviews || 0,
        newBookings: newBookings || 0
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const totalNotifications = notifications.newReviews + notifications.newBookings;

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsManager />;
      case 'content':
        return <ContentEditor />;
      case 'houses':
        return <HousesManager />;
      case 'about':
        return <AboutManager />;
      case 'benefits':
        return <BenefitsManager />;
      case 'booking-terms':
        return <BookingTermsManager />;
      case 'transitions':
        return <TransitionBlocksManager />;
      case 'footer':
        return <FooterManager />;
      case 'blog':
        return <BlogManager />;
      case 'reviews':
        return <ReviewsManager />;
      case 'pages':
        return <PagesManager />;
      case 'seo':
        return <SEOManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <BookingsManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Админ-панель</h1>
                <p className="text-sm text-gray-500">Посёлок «Билим»</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="w-6 h-6" />
                  {totalNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalNotifications > 9 ? '9+' : totalNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {notifications.newBookings > 0 && (
                        <div 
                          className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => {
                            setActiveTab('bookings');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-900">
                                Новые заявки на бронирование
                              </p>
                              <p className="text-sm text-blue-700">
                                {notifications.newBookings} новых заявок
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {notifications.newReviews > 0 && (
                        <div 
                          className="p-3 bg-green-50 border border-green-200 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                          onClick={() => {
                            setActiveTab('reviews');
                            setShowNotifications(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">
                                Новые отзывы на модерации
                              </p>
                              <p className="text-sm text-green-700">
                                {notifications.newReviews} отзывов ожидают одобрения
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {totalNotifications === 0 && (
                        <div className="text-center py-4 text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>Новых уведомлений нет</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Перейти на сайт</span>
              </a>
              
              <span className="text-sm text-gray-700">
                Добро пожаловать, {user?.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const hasNotification = 
                  (tab.id === 'bookings' && notifications.newBookings > 0) ||
                  (tab.id === 'reviews' && notifications.newReviews > 0);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {hasNotification && (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {tab.id === 'bookings' ? notifications.newBookings : notifications.newReviews}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;