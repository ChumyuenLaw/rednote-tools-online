interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

export function setCache<T>(key: string, data: T): void {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
}

export function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const cacheItem: CacheItem<T> = JSON.parse(item);
    const now = Date.now();

    // Check if cache has expired
    if (now - cacheItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }

    return cacheItem.data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

export function clearCache(key: string): void {
  localStorage.removeItem(key);
}

export function generateCacheKey(url: string): string {
  try {
    // 提取 URL 中的 note ID
    // 支持以下格式：
    // - https://www.xiaohongshu.com/explore/[noteId]
    // - https://www.xiaohongshu.com/discovery/item/[noteId]
    // - https://xhslink.com/[shortCode]
    
    let noteId = '';
    
    if (url.includes('xhslink.com')) {
      // 短链接格式，使用最后一段作为标识
      noteId = url.split('/').pop() || '';
    } else {
      // 标准链接格式，提取 noteId
      const matches = url.match(/\/(?:explore|discovery\/item)\/([a-zA-Z0-9]+)/);
      noteId = matches ? matches[1] : '';
    }
    
    if (!noteId) {
      throw new Error('Invalid URL format');
    }
    
    return `rednote_cache_${noteId}`;
  } catch (error) {
    // 如果解析失败，回退到使用完整 URL 的哈希
    console.warn('Failed to parse note ID, using full URL hash');
    return `rednote_cache_${url}`;
  }
} 