export async function getRednoteContent(url: string) {
  try {
    const response = await fetch('/api/rednote', {
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
    return data;
  } catch (error) {
    console.error('Error fetching Rednote content:', error);
    throw error;
  }
}

// 验证 URL 是否是有效的小红书链接
export function isValidRednoteUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('xiaohongshu.com') || urlObj.hostname.includes('xhslink.com');
  } catch {
    return false;
  }
} 