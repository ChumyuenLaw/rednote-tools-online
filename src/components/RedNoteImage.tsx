import { useEffect, useState, memo, useRef } from 'react';
import Image from 'next/image';

interface RedNoteImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
}

export const RedNoteImage = memo(function RedNoteImage({ 
  src, 
  alt, 
  className = '',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  quality = 75,
  loading = 'lazy'
}: RedNoteImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    // Function to get image from cache or download it
    const loadImage = async () => {
      try {
        // Try to get from session storage first
        const cachedImage = sessionStorage.getItem(`img_${src}`);
        
        if (cachedImage) {
          if (isMounted.current) {
            setImageSrc(cachedImage);
            setIsLoading(false);
          }
          return;
        }

        // Fetch with timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('/api/rednote/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: src }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('Failed to load image');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        if (isMounted.current) {
          setImageSrc(objectUrl);
          setIsLoading(false);
          
          // Cache in session storage
          try {
            sessionStorage.setItem(`img_${src}`, objectUrl);
          } catch (e) {
            console.warn('Session storage failed, likely due to quota exceeded');
          }
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted.current) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    // For priority images, load immediately
    // For non-priority images, use requestIdleCallback or setTimeout
    if (priority) {
      loadImage();
    } else if ('requestIdleCallback' in window) {
      const idleCallbackId = window.requestIdleCallback(() => loadImage(), { timeout: 2000 });
      return () => window.cancelIdleCallback(idleCallbackId);
    } else {
      const timeoutId = setTimeout(loadImage, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [src, priority]);

  if (isLoading) {
    return (
      <div 
        className={`${className} animate-pulse bg-secondary`} 
        style={{ aspectRatio: '16/9' }}
        role="progressbar"
        aria-busy="true"
        aria-label={`Loading ${alt}`}
      />
    );
  }

  if (error) {
    return (
      <div 
        className={`${className} bg-secondary flex items-center justify-center`} 
        style={{ aspectRatio: '16/9' }}
      >
        <span className="text-xs text-muted-foreground">Failed to load image</span>
      </div>
    );
  }

  // Use native img with performance optimizations
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}); 