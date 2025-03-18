'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip animation on first render for better performance
  if (!mounted) {
    return (
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
          Free Online Rednote Video Downloader
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          The best free online tool to download HD videos from RedNote without watermark.
          <span className="font-semibold text-foreground"> Fast, secure, and 100% free forever.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
          Free Online Rednote Video Downloader
        </h1>
      </motion.div>

      <motion.p 
        className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        The best free online tool to download HD videos from RedNote without watermark.
        <span className="font-semibold text-foreground"> Fast, secure, and 100% free forever.</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex justify-center mt-4 sm:mt-6"
      >
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-bounce" />
      </motion.div>
    </div>
  );
} 