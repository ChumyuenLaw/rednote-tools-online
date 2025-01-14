'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Zap, Lock, Infinity, ChevronDown, ChevronUp, Download, Copy, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRednoteContent, isValidRednoteUrl } from '@/lib/api';
import { getCache, setCache, generateCacheKey } from '@/lib/cache';
import Link from "next/link";
import type { RednoteResponse } from '@/types/rednote';

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

      // If not in cache, fetch from API
      const response = await fetch('/api/rednote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      // Use API proxy for all downloads
      const response = await fetch('/api/rednote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, download: true }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
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
      label: "High Quality Images",
      description: "Download original quality images without watermarks"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      label: "Instant Download",
      description: "Get your images instantly with our optimized processing"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      label: "100% Secure",
      description: "Your data is processed securely and never stored"
    },
    {
      icon: <Infinity className="h-6 w-6" />,
      label: "Reliable Service",
      description: "Professional and stable service at rednote-tools-online"
    }
  ];

  const faqs = [
    {
      question: "What is Rednote Tools?",
      answer: "Rednote Tools is a professional service dedicated to providing high-quality content downloads from Rednote. We focus on delivering the best possible experience with our watermark removal technology."
    },
    {
      question: "How do I get the Rednote link?",
      answer: "Open the Rednote app, find the post you want to download, click the share button, and copy the link. Paste this link into our input box and we'll handle the rest!"
    },
    {
      question: "What content can I download?",
      answer: "You can download images and videos from public Rednote posts. The content will be downloaded in its original quality without watermarks."
    },
    {
      question: "Is there a limit to how many posts I can process?",
      answer: "Currently, you can process one post at a time. Each post can contain multiple images or videos which will all be processed together."
    },
    {
      question: "Are the downloads safe?",
      answer: "Absolutely! Your privacy and security are our top priorities. We only process the public content you request and never store any of your data."
    },
    {
      question: "Why choose our service?",
      answer: "We offer a professional, fast, and reliable way to download Rednote content without watermarks. Our focus on speed, quality, and user privacy makes us the ideal choice."
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
              Rednote Downloader
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Download Rednote images and videos without watermarks.
              <span className="font-semibold text-foreground"> Fast, secure, and reliable.</span>
            </p>
          </div>

          {/* URL Input Section */}
          <div className="mt-12">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Paste your Rednote link here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !url}
                  className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 transition-opacity"
                >
                  {isProcessing ? 'Processing...' : 'Download'}
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
                <div className="space-y-3">
                  {/* Video Download */}
                  {result.data.videourl && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-lg">Video</h4>
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <code className="text-sm text-muted-foreground truncate flex-1 mr-4 font-mono">
                          {result.data.videourl}
                        </code>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(result.data.videourl)}
                            className="shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                            onClick={() => handleDownload(
                              result.data.videourl,
                              `${result.data.title || 'video'}.mp4`
                            )}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cover Image Download */}
                  {result.data.coverurl && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-lg">Cover Image</h4>
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <code className="text-sm text-muted-foreground truncate flex-1 mr-4 font-mono">
                          {result.data.coverurl}
                        </code>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(result.data.coverurl)}
                            className="shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                            onClick={() => handleDownload(
                              result.data.coverurl,
                              `${result.data.title || 'cover'}.jpg`
                            )}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multiple Images Download */}
                  {result.data.images && result.data.images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-lg">Images</h4>
                      <div className="space-y-2">
                        {result.data.images.map((imageUrl, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                            <code className="text-sm text-muted-foreground truncate flex-1 mr-4 font-mono">
                              {imageUrl}
                            </code>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(imageUrl)}
                                className="shrink-0"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                                onClick={() => handleDownload(
                                  imageUrl,
                                  `${result.data.title || 'image'}_${index + 1}.jpg`
                                )}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                        {result.data.images.length > 1 && (
                          <Button
                            className="w-full mt-2 bg-gradient-to-r from-red-500 to-rose-600"
                            onClick={() => {
                              result.data.images.forEach((imageUrl, index) => {
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
                    </div>
                  )}

                  {/* Single Image Download (fallback) */}
                  {result.data.download_image && !result.data.videourl && (!result.data.images || result.data.images.length === 0) && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-lg">Image</h4>
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <code className="text-sm text-muted-foreground truncate flex-1 mr-4 font-mono">
                          {result.data.download_image}
                        </code>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(result.data.download_image)}
                            className="shrink-0"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            className="shrink-0 bg-gradient-to-r from-red-500 to-rose-600"
                            onClick={() => handleDownload(
                              result.data.download_image,
                              `${result.data.title || 'image'}.jpg`
                            )}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
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
