import { getCache, setCache, generateCacheKey } from './cache';
import type { RednoteResponse } from '@/types/rednote';

// 请求超时设置
const TIMEOUT_MS = 15000; // 15秒超时
const MAX_RETRIES = 2; // 最大重试次数

/**
 * 带超时的 fetch 函数
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 带重试的 fetch 函数
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, timeout = TIMEOUT_MS) {
  try {
    return await fetchWithTimeout(url, options, timeout);
  } catch (err) {
    if (retries <= 0) throw err;
    
    // 指数退避策略
    const delay = 1000 * Math.pow(2, MAX_RETRIES - retries);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    console.log(`Retrying fetch, attempts left: ${retries-1}`);
    return fetchWithRetry(url, options, retries - 1, timeout);
  }
}

/**
 * 获取小红书内容，带缓存和重试
 */
export async function getRednoteContent(url: string): Promise<RednoteResponse> {
  try {
    // 检查缓存
    const cacheKey = generateCacheKey(url);
    const cachedData = getCache<RednoteResponse>(cacheKey);
    
    if (cachedData) {
      console.log('Using cached data for:', url);
      return cachedData;
    }
    
    // 如果没有缓存，发起请求
    const response = await fetchWithRetry('/api/rednote/parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch content');
    }

    const data = await response.json();
    
    // 缓存成功的响应
    if (data.status === "101" && data.code === "200") {
      setCache(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Rednote content:', error);
    throw error;
  }
}

/**
 * 预加载资源
 */
export function preloadResources() {
  // 预加载 API 端点
  try {
    const controller = new AbortController();
    fetch('/api/rednote/parse', { 
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => {});
    
    // 5秒后中止预加载请求
    setTimeout(() => controller.abort(), 5000);
  } catch (e) {
    // 忽略预加载错误
  }
}

/**
 * 验证 URL 是否是有效的小红书链接
 */
export function isValidRednoteUrl(url: string) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('xiaohongshu.com') || 
      urlObj.hostname.includes('xhslink.com')
    );
  } catch {
    // 尝试添加协议前缀再验证
    if (!url.startsWith('http')) {
      return isValidRednoteUrl(`https://${url}`);
    }
    return false;
  }
}

/**
 * 优化 URL 格式
 */
export function normalizeRednoteUrl(url: string): string {
  if (!url) return '';
  
  // 如果没有协议，添加 https://
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  try {
    const urlObj = new URL(url);
    
    // 移除不必要的查询参数
    if (urlObj.hostname.includes('xiaohongshu.com')) {
      // 保留必要的路径和参数
      return `${urlObj.origin}${urlObj.pathname}`;
    }
    
    return url;
  } catch {
    return url;
  }
}

/**
 * 从文本中提取小红书链接
 * 支持从分享文本中提取链接
 */
export function extractRednoteUrl(text: string): string {
  if (!text) return '';
  
  // 首先检查是否已经是一个纯链接
  if (isValidRednoteUrl(text)) {
    return normalizeRednoteUrl(text);
  }
  
  // 提取小红书短链接 (xhslink.com)
  const xhsLinkRegex = /https?:\/\/xhslink\.com\/\S+/i;
  const xhsLinkMatch = text.match(xhsLinkRegex);
  if (xhsLinkMatch && xhsLinkMatch[0]) {
    // 清理链接结尾可能的标点符号
    return normalizeRednoteUrl(xhsLinkMatch[0].replace(/[,，。.?？!！\s]+$/, ''));
  }
  
  // 提取标准小红书链接
  const standardLinkRegex = /https?:\/\/(www\.)?xiaohongshu\.com\/\S+/i;
  const standardLinkMatch = text.match(standardLinkRegex);
  if (standardLinkMatch && standardLinkMatch[0]) {
    // 清理链接结尾可能的标点符号
    return normalizeRednoteUrl(standardLinkMatch[0].replace(/[,，。.?？!！\s]+$/, ''));
  }
  
  return '';
} 