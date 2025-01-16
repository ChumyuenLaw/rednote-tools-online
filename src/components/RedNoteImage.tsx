import { useEffect, useState } from 'react';

interface RedNoteImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function RedNoteImage({ src, alt, className = '' }: RedNoteImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      try {
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
        setImageSrc(objectUrl);

        // Clean up
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    loadImage();
  }, [src]);

  if (!imageSrc) {
    return <div className={`${className} animate-pulse bg-secondary`} />;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
    />
  );
} 