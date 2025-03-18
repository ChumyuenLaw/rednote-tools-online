'use client';

import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { RedNoteImage } from '@/components/RedNoteImage';
import type { RednoteResponse } from '@/types/rednote';
import { useInView } from 'react-intersection-observer';

interface ResultSectionProps {
  result: RednoteResponse;
  handleCopy: (text: string) => void;
  handleDownload: (url: string, filename: string) => void;
  isMobile: boolean;
}

// Image item component with optimizations
const ImageItem = memo(({ 
  imageUrl, 
  index, 
  title, 
  handleCopy, 
  handleDownload,
  isMobile
}: { 
  imageUrl: string; 
  index: number; 
  title: string; 
  handleCopy: (text: string) => void; 
  handleDownload: (url: string, filename: string) => void;
  isMobile: boolean;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    threshold: 0.1
  });

  // Memoized event handlers for better performance
  const onCopy = useCallback(() => handleCopy(imageUrl), [imageUrl, handleCopy]);
  const onDownload = useCallback(async () => {
    try {
      // Use the specific image download endpoint for better reliability
      const response = await fetch('/api/rednote/download/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status}`);
      }
      
      // Get the blob and create object URL
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'image'}_${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Image download error:', error);
      // Fall back to the original method if proxy fails
      handleDownload(imageUrl, `${title || 'image'}_${index + 1}.jpg`);
    }
  }, [imageUrl, title, index, handleDownload]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-secondary group h-full">
        <div className="w-full aspect-[16/9] relative">
          {inView && (
            <>
              <RedNoteImage
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={isMobile ? 60 : 75}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-black/60 ${isMobile ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300 flex items-center justify-center gap-2`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopy}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                  onClick={onDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="text-xs sm:text-sm font-medium text-center text-muted-foreground">
        Image {index + 1}
      </div>
    </div>
  );
});

ImageItem.displayName = 'ImageItem';

// Video section component
const VideoSection = memo(({ 
  videoUrl, 
  coverUrl, 
  title, 
  handleCopy, 
  handleDownload,
  isMobile
}: { 
  videoUrl: string; 
  coverUrl?: string; 
  title: string; 
  handleCopy: (text: string) => void; 
  handleDownload: (url: string, filename: string) => void;
  isMobile: boolean;
}) => {
  // Memoized event handlers
  const onCopy = useCallback(() => handleCopy(videoUrl), [videoUrl, handleCopy]);
  const onDownload = useCallback(async () => {
    // Use the specific video download endpoint for better reliability
    try {
      const response = await fetch('/api/rednote/download/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status}`);
      }
      
      // Get the blob and create object URL
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'video'}.mp4`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Video download error:', error);
      // Fall back to the original method if proxy fails
      handleDownload(videoUrl, `${title || 'video'}.mp4`);
    }
  }, [videoUrl, title, handleDownload]);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-base sm:text-lg">Video</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Video Preview */}
        <div className="relative rounded-lg overflow-hidden bg-secondary group">
          <div className="w-full aspect-[16/9] relative">
            {coverUrl && (
              <>
                <RedNoteImage
                  src={coverUrl}
                  alt="Video Preview"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={true}
                  loading="eager"
                  quality={isMobile ? 60 : 80}
                />
                <div className={`absolute inset-0 bg-black/60 ${isMobile ? 'opacity-30' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300 flex items-center justify-center`}>
                  <Button
                    size="sm"
                    className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                    onClick={onDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Video URL and Actions */}
        <div className="flex flex-col space-y-2">
          <div className="p-2 sm:p-3 bg-secondary rounded-lg">
            <p className="text-xs sm:text-sm font-medium mb-1 sm:mb-2">Video URL:</p>
            <code className="text-xs sm:text-sm text-muted-foreground break-all font-mono">
              {videoUrl.length > 60 && isMobile 
                ? `${videoUrl.substring(0, 60)}...` 
                : videoUrl}
            </code>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-xs sm:text-sm py-1 sm:py-2"
              onClick={onCopy}
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Copy Link
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-xs sm:text-sm py-1 sm:py-2"
              onClick={onDownload}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoSection.displayName = 'VideoSection';

// Image grid component with virtualization for optimized loading
const ImageGrid = memo(({ 
  images, 
  title, 
  handleCopy, 
  handleDownload,
  isMobile
}: { 
  images: string[]; 
  title: string; 
  handleCopy: (text: string) => void; 
  handleDownload: (url: string, filename: string) => void;
  isMobile: boolean;
}) => {
  // For mobile devices, initially only load a smaller batch
  const initialCount = isMobile ? 4 : 6;
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  });
  
  // Load more images when user scrolls near the bottom or clicks
  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + (isMobile ? 4 : 6), images.length));
  }, [images.length, isMobile]);
  
  // Auto-load more images when scrolling to the bottom of current images
  useEffect(() => {
    if (inView && visibleCount < images.length) {
      loadMore();
    }
  }, [inView, visibleCount, images.length, loadMore]);
  
  // Start batch download process
  const downloadAll = useCallback(() => {
    // For mobile devices, confirm before downloading many images
    if (isMobile && images.length > 3) {
      if (!confirm(`You are about to download ${images.length} images. Continue?`)) {
        return;
      }
    }
    
    // Batch download with delay to prevent overwhelming mobile browsers
    const batchSize = isMobile ? 2 : 8;
    const downloadBatch = async (startIndex: number) => {
      const endIndex = Math.min(startIndex + batchSize, images.length);
      
      for (let i = startIndex; i < endIndex; i++) {
        try {
          // Use the specific image download endpoint for better reliability
          const response = await fetch('/api/rednote/download/image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: images[i] }),
          });
          
          if (!response.ok) {
            throw new Error(`Failed to download image: ${response.status}`);
          }
          
          // Get the blob and create object URL
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          
          // Create download link and click it
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title || 'image'}_${i + 1}.jpg`;
          document.body.appendChild(a);
          a.click();
          
          // Clean up
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Image download error:', error);
          // Fall back to the original method if proxy fails
          handleDownload(images[i], `${title || 'image'}_${i + 1}.jpg`);
        }
      }
      
      // If more images remain, schedule next batch
      if (endIndex < images.length) {
        setTimeout(() => downloadBatch(endIndex), isMobile ? 3000 : 1500);
      }
    };
    
    downloadBatch(0);
  }, [images, title, handleDownload, isMobile]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-base sm:text-lg">Images</h4>
        <span className="text-xs text-muted-foreground">
          {visibleCount} of {images.length}
        </span>
      </div>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.slice(0, visibleCount).map((imageUrl, index) => (
          <ImageItem
            key={`img-${index}`}
            imageUrl={imageUrl}
            index={index}
            title={title}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      {/* Load more sentinel and button */}
      {visibleCount < images.length && (
        <>
          <div ref={ref} className="h-4" aria-hidden="true" />
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={loadMore}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Load More Images ({visibleCount} of {images.length})
          </Button>
        </>
      )}
      
      {/* Download all button - only show for multiple images */}
      {images.length > 1 && (
        <Button
          className="w-full mt-2 bg-gradient-to-r from-red-500 to-rose-600"
          onClick={downloadAll}
        >
          <Download className="h-4 w-4 mr-2" />
          Download All Images
        </Button>
      )}
    </div>
  );
});

ImageGrid.displayName = 'ImageGrid';

// Main result component
function ResultSection({ result, handleCopy, handleDownload, isMobile }: ResultSectionProps) {
  // Track component mount for analytics
  useEffect(() => {
    // Report success to analytics
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'content_loaded', {
        event_category: 'Results',
        event_label: result.data.title || 'content',
        non_interaction: false
      });
    }
  }, [result.data.title]);

  // Check if we have valid data
  if (!result.data) {
    return (
      <div className="mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-red-500">
            No Results Found
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Unable to retrieve content. Please try another URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
          Download Links
        </h3>
        
        {/* Title */}
        {result.data.title && (
          <div className="mb-4 sm:mb-6">
            <h4 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">Title</h4>
            <p className="text-sm text-muted-foreground">{result.data.title}</p>
          </div>
        )}

        {/* Download Links */}
        <div className="space-y-4 sm:space-y-6">
          {/* Video Download */}
          {result.data.videoUrl && (
            <VideoSection 
              videoUrl={result.data.videoUrl}
              coverUrl={result.data.coverUrl}
              title={result.data.title || 'video'}
              handleCopy={handleCopy}
              handleDownload={handleDownload}
              isMobile={isMobile}
            />
          )}

          {/* Images Section */}
          {result.data.images && result.data.images.length > 0 && (
            <ImageGrid 
              images={result.data.images}
              title={result.data.title || 'image'}
              handleCopy={handleCopy}
              handleDownload={handleDownload}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ResultSection); 