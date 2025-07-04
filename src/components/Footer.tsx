import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, Globe, MessageCircle, Send, MessageSquare, Play } from 'lucide-react';
import { scrollToSection } from '../utils/navigation';
import { supabase } from '../lib/supabase';

interface FooterLink {
  text: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

const Footer: React.FC = () => {
  const [footerContent, setFooterContent] = useState({
    brand_title: 'Билим',
    brand_description: 'Экологичные дома для отдыха и инвестиций в живописном месте всего в 60 км от Екатеринбурга.',
    navigation_title: 'Навигация',
    navigation_links: [
      { text: 'Главная', url: '#hero' },
      { text: 'Проекты домов', url: '#projects' },
      { text: 'О проекте', url: '#about' },
      { text: 'Бронирование', url: '#booking' },
      { text: 'Выгоды', url: '#benefits' }
    ] as FooterLink[],
    services_title: 'Услуги',
    services_list: [
      'Аренда домов',
      'Продажа недвижимости',
      'Управление арендой',
      'Консультации по инвестициям',
      'Обслуживание домов'
    ],
    contact_title: 'Контакты',
    contact_phone: '+7 (343) 123-45-67',
    contact_email: 'info@bilim-village.ru',
    contact_address: '60 км от Екатеринбурга\n9 км от Первоуральска',
    social_links: [
      { platform: 'Facebook', url: '#', icon: 'Facebook' },
      { platform: 'Instagram', url: '#', icon: 'Instagram' },
      { platform: 'Twitter', url: '#', icon: 'Twitter' }
    ] as SocialLink[],
    copyright_text: '© 2024 Посёлок «Билим». Все права защищены.',
    privacy_policy_text: 'Политика конфиденциальности',
    terms_text: 'Пользовательское соглашение'
  });

  useEffect(() => {
    loadFooterContent();
  }, []);

  const loadFooterContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section', 'footer');

      if (error) throw error;

      const contentMap: any = {};
      data?.forEach(item => {
        contentMap[item.key] = typeof item.value === 'string' ? item.value : item.value;
      });

      if (Object.keys(contentMap).length > 0) {
        setFooterContent(prev => ({
          ...prev,
          ...contentMap
        }));
      }
    } catch (error) {
      console.error('Error loading footer content:', error);
    }
  };

  const handleNavigation = (url: string) => {
    if (url.startsWith('#')) {
      scrollToSection(url.substring(1));
    } else {
      window.location.href = url;
    }
  };

  const getSocialIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Facebook,
      Instagram,
      Twitter,
      Youtube,
      Linkedin,
      MessageCircle, // ВКонтакте
      Send, // Telegram
      MessageSquare, // WhatsApp
      Play, // RuTube
      Globe
    };
    
    const IconComponent = icons[iconName] || Globe;
    return <IconComponent size={20} />;
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-emerald-400 mb-4">{footerContent.brand_title}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {footerContent.brand_description}
            </p>
            <div className="flex space-x-4">
              {footerContent.social_links.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                  aria-label={social.platform}
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerContent.navigation_title}</h4>
            <ul className="space-y-2">
              {footerContent.navigation_links.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleNavigation(link.url)}
                    className="text-gray-300 hover:text-emerald-400 transition-colors text-left"
                  >
                    {link.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerContent.services_title}</h4>
            <ul className="space-y-2 text-gray-300">
              {footerContent.services_list.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{footerContent.contact_title}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-emerald-400" />
                <a 
                  href={`tel:${footerContent.contact_phone.replace(/\s/g, '')}`}
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  {footerContent.contact_phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-emerald-400" />
                <a 
                  href={`mailto:${footerContent.contact_email}`}
                  className="text-gray-300 hover:text-emerald-400 transition-colors"
                >
                  {footerContent.contact_email}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-emerald-400 mt-1" />
                <span className="text-gray-300">
                  {footerContent.contact_address.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < footerContent.contact_address.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              {footerContent.copyright_text}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy-policy" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                {footerContent.privacy_policy_text}
              </a>
              <a href="/terms-of-service" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">
                {footerContent.terms_text}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;