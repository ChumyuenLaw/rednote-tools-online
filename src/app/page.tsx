'use client';

import { useState, useCallback, useMemo, useEffect, Suspense, lazy, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Zap, Lock, Infinity, ChevronDown, ChevronUp, Download, Copy, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/logo';
import { isValidRednoteUrl, normalizeRednoteUrl, preloadResources, extractRednoteUrl } from '@/lib/api';
import { getCache, setCache, generateCacheKey } from '@/lib/cache';
import Link from "next/link";
import type { RednoteResponse } from '@/types/rednote';
import { generateSign } from '@/lib/sign';
import { debounce } from '@/lib/utils';

// Lazy loaded components
const ResultSection = lazy(() => import('@/components/ResultSection'));
const HeroSection = lazy(() => import('@/components/home/HeroSection'));
const UserGuideSection = lazy(() => import('@/components/home/UserGuideSection'));

// Feature card component
const FeatureCard = ({ icon, label, description }: { icon: React.ReactNode, label: string, description: string }) => (
  <div className="p-4 sm:p-6 rounded-lg border bg-card hover:shadow-md transition-shadow">
    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      <div className="text-primary">{icon}</div>
    </div>
    <h3 className="font-semibold mb-2 text-sm sm:text-base">{label}</h3>
    <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
  </div>
);

// FAQ item component
const FaqItem = ({ 
  question, 
  answer, 
  isOpen, 
  onToggle 
}: { 
  question: string, 
  answer: React.ReactNode, 
  isOpen: boolean, 
  onToggle: () => void 
}) => (
  <div className="border rounded-lg overflow-hidden">
    <button
      className="w-full px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span className="font-medium text-sm sm:text-base">{question}</span>
      {isOpen ? (
        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
      ) : (
        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
      )}
    </button>
    {isOpen && (
      <div className="px-4 py-3 sm:px-6 sm:py-4 text-muted-foreground text-sm border-t">
        {answer}
      </div>
    )}
  </div>
);

// Navigation component
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-14 sm:h-16">
        <Logo />
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link href="/" className="text-xs sm:text-sm font-medium text-foreground">
            Home
          </Link>
          <Link href="/api" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            API
          </Link>
          <Link href="/contact" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

// Features and FAQs data
const features = [
  {
    icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />,
    label: "HD Video Quality",
    description: "Download Rednote videos in original HD quality, completely free and without watermarks"
  },
  {
    icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
    label: "Fast & Free Online",
    description: "Instant online video downloads with optimized processing speed"
  },
  {
    icon: <Lock className="h-5 w-5 sm:h-6 sm:w-6" />,
    label: "Secure Downloads",
    description: "Your online video downloads are protected and never stored"
  },
  {
    icon: <Infinity className="h-5 w-5 sm:h-6 sm:w-6" />,
    label: "Unlimited Free Downloads",
    description: "Download unlimited Rednote videos online with 99.9% uptime"
  }
];

const faqs = [
  {
    question: "How to download videos from RedNote for free?",
    answer: "Simply copy the RedNote video link, paste it in our free online downloader, and click Download. We'll process your request instantly and provide HD quality videos without watermarks."
  },
  {
    question: "What video quality can I download from RedNote?",
    answer: "Our free online tool lets you download Rednote videos in their original HD quality, completely free and without watermarks. We ensure the highest possible video quality for all downloads."
  },
  {
    question: "Is it safe to use this free Rednote video downloader?",
    answer: "Absolutely! Our free online Rednote video downloader prioritizes your security and privacy. Your video downloads are protected, and we don't store any of your data."
  },
  {
    question: "Why choose our free Rednote video downloader?",
    answer: "We offer instant video downloads, HD quality, no watermarks, and completely free online service. Our Rednote video downloader is fast, reliable, and available 24/7."
  },
  {
    question: "How to get API access for video downloads?",
    answer: (
      <>
        We offer two API plans: Basic Plan at $9.90 for 600 API calls, and Pro Plan at $19.90 for 1,000 API calls, both with no expiration.{' '}
        <Link href="/api" className="text-primary hover:underline">
          Visit our API page
        </Link>
        {' '}for more details and to purchase. After payment, we'll send your API key to your email.
      </>
    )
  }
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RednoteResponse | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const { toast } = useToast();

  // Detect mobile device
  const [isMobile, setIsMobile] = useState(false);
  
  // Add a new state to track text area height
  const [textAreaHeight, setTextAreaHeight] = useState('56px');
  
  // Add a ref for the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    
    // Debounced resize handler for better performance
    const handleResize = debounce(checkMobile, 200);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload resources
  useEffect(() => {
    // Use requestIdleCallback for better performance on initial load
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => preloadResources(), { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(preloadResources, 2000);
    }
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsProcessing(true);
      setResult(null);
      
      // 从文本中提取链接，支持分享文本中的链接
      const extractedUrl = extractRednoteUrl(url);
      
      if (!extractedUrl) {
        toast({
          variant: 'destructive',
          title: 'No valid URL found',
          description: 'Could not find a valid Rednote URL in your text. Please check and try again.',
        });
        return;
      }

      // Try to get from cache first
      const cacheKey = generateCacheKey(extractedUrl);
      const cachedData = getCache<RednoteResponse>(cacheKey);
      
      if (cachedData) {
        setResult(cachedData);
        toast({
          title: 'Success!',
          description: 'Retrieved content from cache.',
        });
        return;
      }

      // Generate sign for API request
      const sign = await generateSign();

      // If not in cache, fetch from parse API
      const response = await fetch('/api/rednote/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Sign': sign,
        },
        body: JSON.stringify({ url: extractedUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      
      // Check for points exhausted error
      if (data.status === "301" || data.code === "301") {
        toast({
          variant: 'destructive',
          title: 'Service Unavailable',
          description: 'API points exhausted. Please try again later.',
        });
        return;
      }
      
      setResult(data);
      
      // Only cache successful responses
      if (data.status === "101" && data.code === "200") {
        setCache(cacheKey, data);
      }
      
      toast({
        title: 'Success!',
        description: 'Successfully retrieved content without watermark.',
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to process the URL. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [url, toast]);

  // Function to dynamically resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUrl(e.target.value);
    resizeTextarea();
  };

  // Extract resizing logic to a separate function for reuse
  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    
    // Reset height to auto first to get accurate scrollHeight
    textareaRef.current.style.height = 'auto';
    
    // Add extra padding to prevent text from touching the bottom edge
    const extraPadding = 8;
    const newHeight = Math.max(textareaRef.current.scrollHeight + extraPadding, 56);
    textareaRef.current.style.height = `${newHeight}px`;
  };

  // Resize on mount and when URL changes
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(resizeTextarea, 0);
    
    // Also add a resize observer for better responsiveness
    if (textareaRef.current && window.ResizeObserver) {
      const observer = new ResizeObserver(() => resizeTextarea());
      observer.observe(textareaRef.current);
      return () => observer.disconnect();
    }
  }, [url]);

  // Handle copy action
  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard.'
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        variant: 'destructive',
        title: 'Copy failed',
        description: 'Please try again or copy manually.'
      });
    }
  }, [toast]);

  // Handle download action
  const handleDownload = useCallback(async (url: string, filename: string) => {
    try {
      // Instead of direct download, use our proxy API endpoint
      const response = await fetch('/api/rednote/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      
      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Please try again or download manually.'
      });
    }
  }, [toast]);

  // Toggle FAQ item
  const toggleFaq = useCallback((index: number) => {
    setOpenFaqIndex(current => current === index ? null : index);
  }, []);

  // Memoized Feature section for better performance
  const renderedFeatures = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-16">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          label={feature.label}
          description={feature.description}
        />
      ))}
    </div>
  ), []);

  // Memoized FAQ section for better performance
  const renderedFaqs = useMemo(() => (
    <div className="mt-8 sm:mt-16 space-y-3 sm:space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <FaqItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openFaqIndex === index}
          onToggle={() => toggleFaq(index)}
        />
      ))}
    </div>
  ), [openFaqIndex, toggleFaq]);

  return (
    <>
      <Navigation />
      
      <div className="pb-16 pt-24 sm:pt-32">
        {/* Main container */}
        <div className="container px-4 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* Hero section */}
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <HeroSection />
          </Suspense>
          
          {/* Input form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className={`rounded-lg border ${
                inputFocused ? 'ring-2 ring-red-400 border-red-400' : 'border-slate-200'
              } shadow-sm transition-all overflow-hidden`}>
                {/* Input Container */}
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    placeholder="Paste Rednote video link here..."
                    className="w-full border-0 p-4 focus:outline-none focus:ring-0 resize-none text-sm sm:text-base leading-relaxed placeholder:text-slate-400"
                    value={url}
                    onChange={handleTextareaChange}
                    onInput={(e) => {
                      // Immediate resize on input for faster response
                      setUrl((e.target as HTMLTextAreaElement).value);
                      resizeTextarea();
                    }}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(false)}
                    disabled={isProcessing}
                    style={{
                      minHeight: '56px',
                      height: 'auto',
                      overflow: 'hidden',
                      transition: 'height 0.1s ease'
                    }}
                  />
                  
                  {/* Clear button */}
                  {url && (
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                      onClick={() => {
                        setUrl('');
                        if (textareaRef.current) {
                          textareaRef.current.style.height = '56px';
                          textareaRef.current.focus();
                        }
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Button */}
                <div className="p-3 bg-slate-50 border-t border-slate-200">
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white hover:opacity-90 shadow-sm"
                    type="submit"
                    disabled={isProcessing || !url}
                  >
                    {isProcessing ? 
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div> : 'Download'
                    }
                  </Button>
                </div>
              </div>
              <div className="mt-3 text-xs text-center text-slate-500">
                By using our service, you agree to our{' '}
                <Link href="/privacy" className="text-red-500 hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </form>
          </div>
          
          {/* Results section - Moved above UserGuideSection */}
          {result && (
            <Suspense fallback={<div className="text-center py-10">Loading results...</div>}>
              <ResultSection 
                result={result}
                handleCopy={handleCopy}
                handleDownload={handleDownload}
                isMobile={isMobile}
              />
            </Suspense>
          )}
          
          {/* User Guide Section */}
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <UserGuideSection />
          </Suspense>
          
          {/* Features section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why Choose Our Rednote Downloader</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  label={feature.label}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
          
          {/* FAQ Section */}
          {renderedFaqs}
        </div>
      </div>
    </>
  );
}
