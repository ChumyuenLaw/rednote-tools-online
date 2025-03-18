import { useEffect, useState } from 'react';
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

export function RedNoteImage({ 
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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadImage = async () => {
      try {
        const cachedImage = sessionStorage.getItem(`img_${src}`);
        
        if (cachedImage) {
          if (isMounted) {
            setImageSrc(cachedImage);
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch('/api/rednote/download', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: src }),
        });

        if (!response.ok) {
          throw new Error('Failed to load image');
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        if (isMounted) {
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      // We don't revoke object URLs here as they might be cached in sessionStorage
    };
  }, [src]);

  if (isLoading) {
    return (
      <div 
        className={`${className} animate-pulse bg-secondary`} 
        style={{ aspectRatio: '16/9' }}
      />
    );
  }

  // For Next.js Image component, we would use:
  // return (
  //   <Image
  //     src={imageSrc}
  //     alt={alt}
  //     className={className}
  //     fill={true}
  //     sizes={sizes}
  //     quality={quality}
  //     loading={loading}
  //     priority={priority}
  //   />
  // );
  
  // Since we're using blob URLs, we'll stick with the img tag for now
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
} 