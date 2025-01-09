import { UploadCloud, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface UploadDropzoneProps {
  onFileSelect: (files: File[]) => void;
}

const MAX_FILES = 5;

export function UploadDropzone({ onFileSelect }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([]);
  const [isHovering, setIsHovering] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    if (previews.length + files.length > MAX_FILES) {
      toast({
        variant: "destructive",
        title: "Too many files",
        description: `You can only upload up to ${MAX_FILES} images at a time.`
      });
      return;
    }

    // First update parent's state
    onFileSelect(files);

    // Then update local previews
    Promise.all(
      files.map(file => new Promise<{ file: File; preview: string }>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
      }))
    ).then(newPreviews => {
      setPreviews(prev => [...prev, ...newPreviews]);
    });
  }, [onFileSelect, previews.length, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleRemoveFile = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      onFileSelect(newPreviews.map(p => p.file));
      return newPreviews;
    });
  }, [onFileSelect]);

//   const handleReset = useCallback(() => {
//     setPreviews([]);
//     if (document.getElementById('file-upload')) {
//       (document.getElementById('file-upload') as HTMLInputElement).value = '';
//     }
//     onFileSelect([]);
//     // Trigger file input click after a short delay to ensure reset is complete
//     setTimeout(() => {
//       document.getElementById('file-upload')?.click();
//     }, 0);
//   }, [onFileSelect]);

  return (
    <div
      className={cn(
        'relative border-2 border-dashed border-input rounded-lg p-12 text-center transition-all duration-300 ease-in-out',
        isDragging && 'border-primary',
        previews.length > 0 && 'p-6',
        !previews.length && 'cursor-pointer hover:border-primary/50'
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !previews.length && document.getElementById('file-upload')?.click()}
    >
      <div className="space-y-4">
        {previews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((item, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                  onMouseEnter={() => setIsHovering(index)}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-300",
                      isHovering === index && "scale-105"
                    )}
                  />
                  <div 
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 flex flex-col items-center justify-center gap-2 transition-all duration-300",
                      isHovering === index ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {previews.length < MAX_FILES && (
                <div 
                  className="relative aspect-square rounded-lg border-2 border-dashed border-input flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Add More Images</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {MAX_FILES - previews.length} remaining
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg">Drag and drop your images here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Supports WebP, PNG, JPG, JPEG, GIF, and RAW formats (max {MAX_FILES} images)
              </p>
            </div>
          </>
        )}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/webp,image/png,image/jpeg,image/jpg,image/gif,image/x-raw"
          onChange={handleFileSelect}
          multiple
        />
      </div>
    </div>
  );
} 