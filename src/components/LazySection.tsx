import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  sectionId?: string; // Добавляем ID секции для принудительной загрузки
}

const LazySection: React.FC<LazySectionProps> = ({
  children,
  fallback = <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
  sectionId
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [forceLoad, setForceLoad] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    // Слушаем события принудительной загрузки
    const handleForceLoad = (event: CustomEvent) => {
      if (event.detail?.sectionId === sectionId || event.type === 'forceLoadAllSections') {
        setForceLoad(true);
        setIsVisible(true);
      }
    };

    const handleForceLoadSection = (event: Event) => handleForceLoad(event as CustomEvent);
    const handleForceLoadAll = () => {
      setForceLoad(true);
      setIsVisible(true);
    };

    window.addEventListener('forceLoadSection', handleForceLoadSection);
    window.addEventListener('forceLoadAllSections', handleForceLoadAll);

    return () => {
      window.removeEventListener('forceLoadSection', handleForceLoadSection);
      window.removeEventListener('forceLoadAllSections', handleForceLoadAll);
    };
  }, [sectionId]);

  const shouldRender = isVisible || forceLoad;

  return (
    <div ref={sectionRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
};

export default LazySection;