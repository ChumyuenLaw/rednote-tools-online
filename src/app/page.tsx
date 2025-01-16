'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Zap, Lock, Infinity, ChevronDown, ChevronUp, Download, Copy, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/logo';
import { isValidRednoteUrl } from '@/lib/api';
import { getCache, setCache, generateCacheKey } from '@/lib/cache';
import Link from "next/link";
import type { RednoteResponse } from '@/types/rednote';
import { generateSign } from '@/lib/sign';

export default function Home() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<RednoteResponse | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsProcessing(true);
      setResult(null);
      
      if (!isValidRednoteUrl(url)) {
        toast({
          variant: 'destructive',
          title: 'Invalid URL',
          description: 'Please enter a valid Rednote URL.',
        });
        return;
      }

      // Try to get from cache first
      const cacheKey = generateCacheKey(url);
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
        body: JSON.stringify({ url }),
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
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: 'Link copied to clipboard.',
      });
    });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
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

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      
      // Append to body, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

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
  };

  const features = [
    {
      icon: <Sparkles className="h-6 w-6" />,
      label: "HD Quality",
      description: "Download original quality content without watermarks"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Lightning Fast",
      description: "Instant downloads with optimized processing"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      label: "Secure & Safe",
      description: "Your data is protected and never stored"
    },
    {
      icon: <Infinity className="h-6 w-6" />,
      label: "Reliable Service",
      description: "Professional and stable service with 99.9% uptime"
    }
  ];

  const faqs = [
    {
      question: "How to download from RedNote?",
      answer: "Simply copy the RedNote link, paste it here, and click Download. We'll process your request instantly and provide HD quality content without watermarks."
    },
    {
      question: "What can I download?",
      answer: "You can download any public videos and images from RedNote in their original HD quality, completely free and without watermarks."
    },
    {
      question: "Is it safe to use?",
      answer: "Absolutely! We prioritize your security and privacy. We don't store any of your data and provide secure, direct downloads."
    },
    {
      question: "Why choose our service?",
      answer: "We offer instant downloads, HD quality, no watermarks, and completely free service. Our platform is fast, reliable, and available 24/7."
    },
    {
      question: "How to get API access?",
      answer: "We offer a paid API plan at $19.90 for 1,000 API calls with no expiration. Visit our purchase page at https://buy.stripe.com/4gw1584Hf8r6adOdQR. After payment, we'll send your API key to your email. For API documentation, visit https://api.rednotetoolsonline.com/docs"
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
              <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground">
                API
              </Link>
              <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center p-8 md:p-24 pt-24">
        <div className="max-w-5xl w-full space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
              RedNote HD Downloader
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download HD videos and images from RedNote without watermark.
              <span className="font-semibold text-foreground"> Professional, Fast & Free.</span>
            </p>
          </div>

          {/* URL Input Section */}
          <div className="mt-12">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Paste your RedNote link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !url}
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-opacity"
                >
                  {isProcessing ? 'Processing...' : 'Download HD'}
                </Button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-card p-6 rounded-lg shadow-sm border">
                <h3 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
                  Download Links
                </h3>
                
                {/* Title */}
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-2">Title</h4>
                  <p className="text-muted-foreground">{result.data.title}</p>
                </div>

                {/* Download Links */}
                <div className="space-y-6">
                  {/* Video Download */}
                  {result.data.videoUrl && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Video</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        {/* Video Preview */}
                        <div className="relative rounded-lg overflow-hidden bg-secondary group">
                          <div className="w-full aspect-[16/9] relative">
                            {result.data.coverUrl && (
                              <img
                                src={result.data.coverUrl}
                                alt="Video Preview"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                              <Button
                                size="sm"
                                className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                                onClick={() => result.data.videoUrl && handleDownload(
                                  result.data.videoUrl,
                                  `${result.data.title || 'video'}.mp4`
                                )}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Video
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Video URL and Actions */}
                        <div className="flex flex-col space-y-2">
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="text-sm font-medium mb-2">Video URL:</p>
                            <code className="text-sm text-muted-foreground break-all font-mono">
                              {result.data.videoUrl}
                            </code>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => result.data.videoUrl && handleCopy(result.data.videoUrl)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button
                              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600"
                              onClick={() => result.data.videoUrl && handleDownload(
                                result.data.videoUrl,
                                `${result.data.title || 'video'}.mp4`
                              )}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Images Section */}
                  {result.data.images && result.data.images.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-lg">Images</h4>
                      
                      {/* Image Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {result.data.images.map((imageUrl, index) => (
                          <div key={index} className="space-y-2">
                            <div className="relative rounded-lg overflow-hidden bg-secondary group">
                              <div className="w-full aspect-[16/9] relative">
                                <img
                                  src={imageUrl}
                                  alt={`Image ${index + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
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
                                      `${result.data.title || 'image'}_${index + 1}.jpg`
                                    )}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-center text-muted-foreground">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Download All Images Button */}
                      {result.data.images.length > 1 && (
                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-red-500 to-rose-600"
                          onClick={() => {
                            result.data.images?.forEach((imageUrl, index) => {
                              handleDownload(
                                imageUrl,
                                `${result.data.title || 'image'}_${index + 1}.jpg`
                              );
                            });
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download All Images
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="font-semibold mb-2">{feature.label}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 space-y-4">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg"
              >
                <button
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                >
                  <span className="font-medium text-left">{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
