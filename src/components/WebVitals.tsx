'use client';

import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

// 自定义 gtag 参数类型
interface WebVitalsEventParams {
  event_category: string;
  event_label: string;
  value: number;
  non_interaction: boolean;
}

// 发送性能数据到 Google Analytics 或其他分析服务
const sendToAnalytics = ({ name, delta, id }: { name: string, delta: number, id: string }) => {
  // 如果有 Google Analytics
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
    });
  }
  
  // 记录到控制台（开发环境）
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vitals: ${name}`, { delta, id });
  }
};

export function WebVitals() {
  useEffect(() => {
    // 只在生产环境或明确启用时监控
    if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_ENABLE_VITALS === 'true') {
      // 核心 Web Vitals
      onCLS(sendToAnalytics);  // 累积布局偏移
      onFID(sendToAnalytics);  // 首次输入延迟
      onLCP(sendToAnalytics);  // 最大内容绘制
      
      // 其他有用的指标
      onFCP(sendToAnalytics);  // 首次内容绘制
      onTTFB(sendToAnalytics); // 首字节时间
    }
  }, []);

  // 这是一个无渲染组件
  return null;
}

// 不要为 gtag 添加全局类型，因为它已经在其他地方定义 