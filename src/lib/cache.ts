interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// 缓存配置
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24小时，单位毫秒
const MEMORY_CACHE_SIZE = 20; // 内存缓存最大项数

// 内存缓存，用于快速访问
const memoryCache = new Map<string, CacheItem<any>>();

/**
 * 检查浏览器存储可用性
 */
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type] as Storage;
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 设置缓存，同时写入内存和localStorage
 */
export function setCache<T>(key: string, data: T): void {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  
  // 先写入内存缓存
  memoryCache.set(key, cacheItem);
  
  // 限制内存缓存大小
  if (memoryCache.size > MEMORY_CACHE_SIZE) {
    // 删除最早添加的项
    const iterator = memoryCache.keys();
    const firstResult = iterator.next();
    if (!firstResult.done && firstResult.value) {
      memoryCache.delete(firstResult.value);
    }
  }
  
  // 再写入localStorage（如果可用）
  if (isStorageAvailable('localStorage')) {
    try {
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('localStorage write failed, falling back to memory cache only:', error);
      // 如果localStorage写入失败（如配额超出），仍然保留内存缓存
    }
  }
}

/**
 * 获取缓存，优先从内存缓存获取，然后是localStorage
 */
export function getCache<T>(key: string): T | null {
  try {
    // 先检查内存缓存
    if (memoryCache.has(key)) {
      const cacheItem = memoryCache.get(key) as CacheItem<T>;
      const now = Date.now();
      
      // 检查缓存是否过期
      if (now - cacheItem.timestamp <= CACHE_EXPIRY) {
        return cacheItem.data;
      } else {
        // 过期则删除
        memoryCache.delete(key);
      }
    }
    
    // 如果内存缓存没有，检查localStorage
    if (isStorageAvailable('localStorage')) {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const cacheItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();
      
      // 检查缓存是否过期
      if (now - cacheItem.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(key);
        return null;
      }
      
      // 将localStorage中的数据也加入内存缓存
      memoryCache.set(key, cacheItem);
      
      return cacheItem.data;
    }
    
    return null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

/**
 * 清除指定键的缓存
 */
export function clearCache(key: string): void {
  memoryCache.delete(key);
  
  if (isStorageAvailable('localStorage')) {
    localStorage.removeItem(key);
  }
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  memoryCache.clear();
  
  if (isStorageAvailable('localStorage')) {
    // 只清除我们的缓存前缀的项
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rednote_cache_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

/**
 * 生成缓存键
 */
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
      // 如果无法提取noteId，使用URL的哈希
      return `rednote_cache_${hashString(url)}`;
    }
    
    return `rednote_cache_${noteId}`;
  } catch (error) {
    // 如果解析失败，回退到使用完整 URL 的哈希
    console.warn('Failed to parse note ID, using full URL hash');
    return `rednote_cache_${hashString(url)}`;
  }
}

/**
 * 简单的字符串哈希函数
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
} 