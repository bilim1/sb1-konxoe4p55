import { useEffect, useState } from 'react';

interface UseImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export const useImagePreloader = ({ images, priority = false }: UseImagePreloaderProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!priority || images.length === 0) {
      setIsLoading(false);
      return;
    }

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src));
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    const preloadImages = async () => {
      try {
        await Promise.allSettled(images.map(preloadImage));
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    preloadImages();
  }, [images, priority]);

  return { loadedImages, isLoading };
};