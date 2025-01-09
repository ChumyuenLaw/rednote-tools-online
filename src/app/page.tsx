'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadDropzone } from '@/components/upload-dropzone';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Zap, Lock, Infinity, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setSelectedFormat(null);
  };

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
  };

  const handleConvert = async () => {
    if (!selectedFiles.length || !selectedFormat) return;

    try {
      setIsConverting(true);
      setConvertProgress(0);
      
      const results = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('format', selectedFormat.toLowerCase());

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to convert image');
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const originalName = file.name.split('.').slice(0, -1).join('.');
          const targetFormat = selectedFormat.toLowerCase();
          const actualFormat = targetFormat === 'raw' ? 'tiff' : targetFormat;
          a.download = `${originalName}_converted.${actualFormat}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          // Update progress
          setConvertProgress(((index + 1) / selectedFiles.length) * 100);
          
          return true;
        })
      );

      const successCount = results.filter(Boolean).length;
      
      toast({
        title: 'Success!',
        description: `Converted ${successCount} image${successCount !== 1 ? 's' : ''}.`,
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to convert some images. Please try again.',
      });
    } finally {
      setIsConverting(false);
      setConvertProgress(0);
    }
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      label: "High Quality Conversion",
      description: "Maintain original image quality with our advanced conversion technology"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Lightning Fast",
      description: "Convert your images instantly with our optimized processing"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      label: "100% Secure",
      description: "Your images are processed locally and never stored on our servers"
    },
    {
      icon: <Infinity className="h-6 w-6" />,
      label: "Forever Free",
      description: "No hidden fees, batch support - free forever at imageconvertfree.com"
    }
  ];

  const faqs = [
    {
      question: "Is imageconvertfree.com really free?",
      answer: "Yes! We are committed to providing our image conversion service completely free of charge, forever. No hidden fees, no premium features, just simple and effective image conversion for everyone."
    },
    {
      question: "What image formats do you support?",
      answer: "We support conversion between WebP, PNG, JPG, JPEG, and GIF formats. For RAW format conversion, we use high-quality TIFF format to preserve maximum image quality and data. We maintain high quality during conversion while optimizing file sizes."
    },
    {
      question: "Can I convert multiple images at once?",
      answer: "Yes! Our batch conversion feature allows you to convert up to 5 images simultaneously while maintaining high quality and fast conversion speeds."
    },
    {
      question: "Is there a file size limit?",
      answer: "We support images up to 50MB in size. This generous limit allows you to convert high-resolution images and RAW files while maintaining fast conversion speeds."
    },
    {
      question: "Are my images safe?",
      answer: "Absolutely! Your privacy and security are our top priorities. All image processing is done in your browser - we never store or transmit your images to any server."
    },
    {
      question: "Why choose imageconvertfree.com?",
      answer: "We offer a simple, fast, and completely free image conversion service with no strings attached. Our focus on privacy, speed, and quality makes us the ideal choice for all your image conversion needs."
    }
  ];

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              <a 
                href="https://x.com/arkyu2077" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center p-8 md:p-24 pt-24">
        <div className="max-w-5xl w-full space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Free Image Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Convert images between WebP, PNG, JPG, JPEG, GIF, and RAW formats with high quality.
              <span className="font-semibold text-foreground"> Support batch conversion up to 5 images.</span>
            </p>
          </div>

          {/* Upload Section */}
          <div className="mt-12">
            <UploadDropzone onFileSelect={handleFileSelect} />
          </div>

          {/* Format Selection */}
          {selectedFiles.length > 0 && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Select Output Format
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {['WebP', 'PNG', 'JPG', 'JPEG', 'GIF', 'RAW'].map((format) => (
                    <TooltipProvider key={format}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={selectedFormat === format ? 'default' : 'outline'}
                            className={cn(
                              "min-w-[120px] h-12 relative overflow-hidden transition-all duration-300",
                              selectedFormat === format && "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-0",
                              !selectedFormat && "hover:border-blue-500/50",
                              selectedFormat && selectedFormat !== format && "opacity-50 hover:opacity-75"
                            )}
                            onClick={() => handleFormatSelect(format)}
                            disabled={isConverting}
                          >
                            <span className="flex items-center gap-1">
                              {format}
                              {format === 'RAW' && <Info className="h-4 w-4" />}
                            </span>
                            {selectedFormat === format && (
                              <div className="absolute inset-0 bg-white/10 animate-pulse" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format === 'RAW' ? (
                            <p className="max-w-xs">RAW format will be converted to high-quality TIFF format to preserve maximum image data and quality.</p>
                          ) : (
                            <p>Convert to {format} format</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                {selectedFormat && (
                  <div className="mt-8 text-center space-y-4">
                    {selectedFormat === 'RAW' && (
                      <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="flex items-center gap-2">
                          <Info className="h-4 w-4 shrink-0" />
                          Your image will be converted to TIFF format to maintain maximum quality and compatibility.
                        </p>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className={cn(
                        "w-full md:w-auto min-w-[200px] bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 transition-opacity",
                        isConverting && "opacity-50"
                      )}
                      onClick={handleConvert}
                      disabled={isConverting}
                    >
                      {isConverting ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Converting... {convertProgress > 0 && `(${Math.round(convertProgress)}%)`}
                        </span>
                      ) : (
                        `Convert ${selectedFiles.length} image${selectedFiles.length !== 1 ? 's' : ''} to ${selectedFormat}`
                      )}
                    </Button>
                    {isConverting && convertProgress > 0 && (
                      <div className="w-full max-w-md mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                          style={{ width: `${convertProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="mt-20 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Why Choose imageconvertfree.com?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.label}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-4 bg-muted/30 border-t">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 border-t">
            <div className="max-w-7xl mx-auto py-8">
              <div className="grid grid-cols-12 gap-8 px-4">
                {/* Logo and Copyright */}
                <div className="col-span-12 md:col-span-5 space-y-3">
                  <Logo />
                  <p className="text-sm text-muted-foreground">
                    Convert your images to any type online
                  </p>
                  <p className="text-sm text-muted-foreground">
                    © Copyright 2025 imageconvertfree.com. All Rights Reserved.
                  </p>
                </div>

                {/* Spacer */}
                <div className="hidden md:block md:col-span-3" />

                {/* Product */}
                <div className="col-span-6 md:col-span-2">
                  <h3 className="font-semibold text-sm">Product</h3>
                  <ul className="mt-3 space-y-1.5">
                    <li>
                      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Image Convert</Link>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div className="col-span-6 md:col-span-2">
                  <h3 className="font-semibold text-sm">Legal</h3>
                  <ul className="mt-3 space-y-1.5">
                    <li>
                      <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
