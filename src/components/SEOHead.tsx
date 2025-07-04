import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  canonicalUrl: string;
  robots: string;
  author: string;
  siteName: string;
}

const SEOHead: React.FC = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: 'Посёлок Билим - Экологичные дома для отдыха и инвестиций',
    description: 'Современные экологичные дома в 60 км от Екатеринбурга. Аренда и продажа недвижимости с высокой доходностью. Инвестиции в загородную недвижимость.',
    keywords: 'аренда домов, загородная недвижимость, экологичные дома, инвестиции в недвижимость, посёлок билим, екатеринбург',
    ogTitle: 'Посёлок Билим - Ваш дом у леса',
    ogDescription: 'Экологичные дома для отдыха и инвестиций в живописном месте всего в 60 км от Екатеринбурга',
    ogImage: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    twitterTitle: 'Посёлок Билим - Экологичные дома',
    twitterDescription: 'Современные дома в 60 км от Екатеринбурга для отдыха и инвестиций',
    twitterImage: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    canonicalUrl: '',
    robots: 'index, follow',
    author: 'Посёлок Билим',
    siteName: 'Билим'
  });

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'seo_settings')
        .maybeSingle();

      if (error) throw error;
      
      if (data?.value) {
        setSeoSettings(prev => ({ ...prev, ...data.value }));
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error);
    }
  };

  useEffect(() => {
    // Update document title
    document.title = seoSettings.title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seoSettings.description);
    updateMetaTag('keywords', seoSettings.keywords);
    updateMetaTag('author', seoSettings.author);
    updateMetaTag('robots', seoSettings.robots);

    // Open Graph tags
    updateMetaTag('og:title', seoSettings.ogTitle || seoSettings.title, true);
    updateMetaTag('og:description', seoSettings.ogDescription || seoSettings.description, true);
    updateMetaTag('og:image', seoSettings.ogImage, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', seoSettings.siteName, true);
    
    if (seoSettings.canonicalUrl) {
      updateMetaTag('og:url', seoSettings.canonicalUrl, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoSettings.twitterTitle || seoSettings.title);
    updateMetaTag('twitter:description', seoSettings.twitterDescription || seoSettings.description);
    updateMetaTag('twitter:image', seoSettings.twitterImage || seoSettings.ogImage);

    // Canonical URL
    if (seoSettings.canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', seoSettings.canonicalUrl);
    }

    // Structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": seoSettings.siteName,
      "description": seoSettings.description,
      "url": seoSettings.canonicalUrl || window.location.origin,
      "image": seoSettings.ogImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Первоуральск",
        "addressRegion": "Свердловская область",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "57.0",
        "longitude": "59.9"
      },
      "telephone": "+7 (343) 123-45-67",
      "priceRange": "$$",
      "serviceArea": {
        "@type": "Place",
        "name": "Екатеринбург и область"
      }
    };

    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(structuredData);

  }, [seoSettings]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;