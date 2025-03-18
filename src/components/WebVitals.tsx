'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP, Metric } from 'web-vitals';

// Custom gtag parameter type
interface WebVitalsEventParams {
  event_category: string;
  event_label: string;
  value: number;
  non_interaction: boolean;
  metric_id: string;
  metric_value: number;
  metric_delta: number;
}

// Enhanced metric type
interface MetricWithAttribution extends Record<string, unknown> {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType?: string;
  attribution?: {
    element?: string;
    largestShiftTarget?: string;
    largestShiftTime?: number;
    loadState?: string;
  };
}

// Send performance data to Google Analytics or other analytics services
const sendToAnalytics = (metric: Metric) => {
  const { name, delta, id } = metric;
  
  // If Google Analytics is available
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    // Convert CLS values to milliseconds to match other metrics
    const value = Math.round(name === 'CLS' ? delta * 1000 : delta);
    
    // Create a detailed event object for analytics
    const eventParams: Record<string, any> = {
      event_category: 'Web Vitals',
      event_label: id,
      value: value,
      non_interaction: true,
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
    };
    
    // Add any additional properties from the metric object
    for (const key in metric) {
      // Skip properties we've already handled
      if (!['name', 'value', 'delta', 'id'].includes(key)) {
        eventParams[`metric_${key}`] = (metric as Record<string, any>)[key];
      }
    }
    
    gtag('event', name, eventParams);
  }
  
  // Log to console in development or if debug parameter is present
  if (process.env.NODE_ENV === 'development' || new URLSearchParams(window.location.search).has('debug')) {
    console.log(`Web Vitals: ${name}`, metric);
  }
};

export function WebVitals() {
  useEffect(() => {
    // Only monitor in production or if explicitly enabled
    if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_ENABLE_VITALS === 'true') {
      // Core Web Vitals
      onCLS(sendToAnalytics);  // Cumulative Layout Shift
      onFID(sendToAnalytics);  // First Input Delay
      onLCP(sendToAnalytics);  // Largest Contentful Paint
      
      // Additional useful metrics
      onFCP(sendToAnalytics);  // First Contentful Paint
      onTTFB(sendToAnalytics); // Time to First Byte
      onINP(sendToAnalytics);  // Interaction to Next Paint - important for mobile
      
      // Listen for page visibility changes to track engagement better
      document.addEventListener('visibilitychange', () => {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'visibility_change', {
            event_category: 'Page Visibility',
            event_label: document.visibilityState,
            non_interaction: true
          });
        }
      });
    }
  }, []);

  // This is a non-rendering component
  return null;
}

// Do not add global type for gtag, as it is already defined elsewhere 