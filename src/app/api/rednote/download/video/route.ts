import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to download video from:', url);

    // Try direct download first
    try {
      // Download video through proxy with enhanced headers
      const downloadResponse = await fetch(url, {
        headers: {
          'Accept': 'video/*, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Referer': 'https://www.xiaohongshu.com/',
          'Origin': 'https://www.xiaohongshu.com',
          'Sec-Fetch-Dest': 'video',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        referrerPolicy: 'unsafe-url',
        cache: 'no-cache',
        redirect: 'follow'
      });

      if (downloadResponse.ok) {
        const contentType = downloadResponse.headers.get('content-type');
        const blob = await downloadResponse.blob();

        console.log('Downloaded video successfully, content-type:', contentType, 'size:', blob.size);

        // Ensure we have the correct content type
        const finalContentType = contentType || 'video/mp4';
        const filename = url.split('/').pop() || 'video.mp4';

        return new NextResponse(blob, {
          status: 200,
          headers: {
            'Content-Type': finalContentType,
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
      
      console.log('Direct download failed, trying with CORS proxy');
    } catch (error) {
      console.log('Error in direct download, trying with CORS proxy:', error);
    }
    
    // If direct download fails, try with a CORS proxy
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    console.log('Attempting to download via CORS proxy:', corsProxyUrl);
    
    const proxyResponse = await fetch(corsProxyUrl, {
      headers: {
        'Accept': 'video/*, */*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
      cache: 'no-cache',
      redirect: 'follow'
    });

    if (!proxyResponse.ok) {
      console.error('Proxy download failed with status:', proxyResponse.status);
      throw new Error(`Failed to download video content via proxy: ${proxyResponse.status} ${proxyResponse.statusText}`);
    }

    const contentType = proxyResponse.headers.get('content-type');
    const blob = await proxyResponse.blob();

    console.log('Downloaded video via proxy successfully, content-type:', contentType, 'size:', blob.size);

    // Ensure we have the correct content type
    const finalContentType = contentType || 'video/mp4';
    const filename = url.split('/').pop() || 'video.mp4';

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download video' },
      { status: 500 }
    );
  }
} 