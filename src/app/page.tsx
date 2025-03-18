'use client';

import { useState, useCallback, useMemo, useEffect, Suspense, lazy } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Zap, Lock, Infinity, ChevronDown, ChevronUp, Download, Copy, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/logo';
import { isValidRednoteUrl, normalizeRednoteUrl, preloadResources } from '@/lib/api';
import { getCache, setCache, generateCacheKey } from '@/lib/cache';
import Link from "next/link";
import type { RednoteResponse } from '@/types/rednote';
import { generateSign } from '@/lib/sign';
import { debounce } from '@/lib/utils';

// Lazy loaded components
const ResultSection = lazy(() => import('@/components/ResultSection'));
const HeroSection = lazy(() => import('@/components/home/HeroSection'));

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
      
      // Normalize URL
      const normalizedUrl = normalizeRednoteUrl(url);
      
      if (!isValidRednoteUrl(normalizedUrl)) {
        toast({
          variant: 'destructive',
          title: 'Invalid URL',
          description: 'Please enter a valid Rednote URL.',
        });
        return;
      }

      // Try to get from cache first
      const cacheKey = generateCacheKey(normalizedUrl);
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
        body: JSON.stringify({ url: normalizedUrl }),
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

  // Handle URL input with debounce
  const debouncedSetUrl = useMemo(
    () => debounce((value: string) => setUrl(value), 300),
    []
  );

  // Handle copy action
  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard.',
      });
    });
  }, [toast]);

  // Handle download action
  const handleDownload = useCallback(async (url: string, filename: string) => {
    try {
      // Show download start toast on mobile
      if (isMobile) {
        toast({
          title: 'Download Starting',
          description: 'Your download will begin shortly',
        });
      }
      
      const response = await fetch('/api/rednote/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get blob and create download
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      
      // Perform download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up after download
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

      toast({
        title: 'Download Started',
        description: 'Your file will be downloaded shortly',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Please try again later',
      });
    }
  }, [toast, isMobile]);

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

  // URL Input section
  const urlInputSection = useMemo(() => (
    <div className="mt-6 sm:mt-12 animate-in fade-in duration-500">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-200 ${inputFocused ? 'scale-[1.02]' : ''}`}>
          <Input
            type="text"
            placeholder="Paste your RedNote link here..."
            defaultValue={url}
            onChange={(e) => debouncedSetUrl(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            className="flex-1 h-12 text-base focus-visible:ring-red-500"
            data-testid="url-input"
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !url}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-opacity h-12 px-6 font-medium"
            data-testid="download-button"
          >
            {isProcessing ? 'Processing...' : 'Download HD'}
          </Button>
        </div>
      </form>
    </div>
  ), [handleSubmit, url, isProcessing, inputFocused, debouncedSetUrl]);

  return (
    <>
      <Navigation />

      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 pt-20 sm:pt-24">
        <div className="max-w-5xl w-full space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <Suspense fallback={
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
                Free Online Rednote Video Downloader
              </h1>
            </div>
          }>
            <HeroSection />
          </Suspense>

          {/* URL Input Section */}
          {urlInputSection}

          {/* Results Section - lazy loaded */}
          {result && (
            <Suspense fallback={
              <div className="w-full h-40 animate-pulse bg-card rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Loading results...</p>
              </div>
            }>
              <ResultSection 
                result={result} 
                handleCopy={handleCopy} 
                handleDownload={handleDownload} 
                isMobile={isMobile}
              />
            </Suspense>
          )}

          {/* Features Section */}
          {renderedFeatures}

          {/* FAQ Section */}
          {renderedFaqs}
        </div>
      </main>
    </>
  );
}
