'use client';

import { memo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, ExternalLink } from 'lucide-react';
import { RedNoteImage } from '@/components/RedNoteImage';
import type { RednoteResponse } from '@/types/rednote';
import { useInView } from 'react-intersection-observer';

interface ResultSectionProps {
  result: RednoteResponse;
  handleCopy: (text: string) => void;
  handleDownload: (url: string, filename: string) => void;
  isMobile: boolean;
}

// 图片项组件
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
  });

  return (
    <div ref={ref} className="space-y-2">
      <div className="relative rounded-lg overflow-hidden bg-secondary group">
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
                  onClick={() => handleCopy(imageUrl)}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                  onClick={() => handleDownload(
                    imageUrl,
                    `${title || 'image'}_${index + 1}.jpg`
                  )}
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

// 视频部分组件
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
                    onClick={() => handleDownload(
                      videoUrl,
                      `${title || 'video'}.mp4`
                    )}
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
              onClick={() => handleCopy(videoUrl)}
            >
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Copy Link
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-xs sm:text-sm py-1 sm:py-2"
              onClick={() => handleDownload(
                videoUrl,
                `${title || 'video'}.mp4`
              )}
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

// 图片网格组件 - 使用虚拟化渲染优化大量图片
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
  // 对于移动设备，初始只加载前6张图片
  const [visibleCount, setVisibleCount] = useState(isMobile ? 6 : images.length);
  
  // 加载更多图片
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, images.length));
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-base sm:text-lg">Images</h4>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {images.slice(0, visibleCount).map((imageUrl, index) => (
          <ImageItem
            key={index}
            imageUrl={imageUrl}
            index={index}
            title={title}
            handleCopy={handleCopy}
            handleDownload={handleDownload}
            isMobile={isMobile}
          />
        ))}
      </div>
      
      {/* 加载更多按钮 */}
      {visibleCount < images.length && (
        <Button
          variant="outline"
          className="w-full mt-2"
          onClick={loadMore}
        >
          Load More Images ({visibleCount} of {images.length})
        </Button>
      )}
      
      {/* 下载所有图片按钮 */}
      {images.length > 1 && (
        <Button
          className="w-full mt-2 bg-gradient-to-r from-red-500 to-rose-600"
          onClick={() => {
            // 对于移动设备，提示用户将下载多个文件
            if (isMobile && images.length > 3) {
              if (!confirm(`You are about to download ${images.length} images. Continue?`)) {
                return;
              }
            }
            
            // 分批下载，避免移动设备过载
            const batchSize = isMobile ? 3 : 10;
            const downloadBatch = (startIndex: number) => {
              const endIndex = Math.min(startIndex + batchSize, images.length);
              
              for (let i = startIndex; i < endIndex; i++) {
                handleDownload(
                  images[i],
                  `${title || 'image'}_${i + 1}.jpg`
                );
              }
              
              // 如果还有更多图片，设置延迟下载
              if (endIndex < images.length) {
                setTimeout(() => downloadBatch(endIndex), 2000);
              }
            };
            
            downloadBatch(0);
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download All Images
        </Button>
      )}
    </div>
  );
});

ImageGrid.displayName = 'ImageGrid';

// 主结果组件
function ResultSection({ result, handleCopy, handleDownload, isMobile }: ResultSectionProps) {
  return (
    <div className="mt-6 sm:mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
          Download Links
        </h3>
        
        {/* Title */}
        <div className="mb-4 sm:mb-6">
          <h4 className="font-medium text-base sm:text-lg mb-1 sm:mb-2">Title</h4>
          <p className="text-sm text-muted-foreground">{result.data.title}</p>
        </div>

        {/* Download Links */}
        <div className="space-y-4 sm:space-y-6">
          {/* Video Download */}
          {result.data.videoUrl && (
            <VideoSection 
              videoUrl={result.data.videoUrl}
              coverUrl={result.data.coverUrl}
              title={result.data.title}
              handleCopy={handleCopy}
              handleDownload={handleDownload}
              isMobile={isMobile}
            />
          )}

          {/* Images Section */}
          {result.data.images && result.data.images.length > 0 && (
            <ImageGrid 
              images={result.data.images}
              title={result.data.title}
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