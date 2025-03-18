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

    console.log('Attempting to download content from:', url);

    // Download file through proxy with enhanced headers
    const downloadResponse = await fetch(url, {
      headers: {
        'Accept': 'image/*, video/*, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/',
        'Origin': 'https://www.xiaohongshu.com',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'cross-site',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      referrerPolicy: 'unsafe-url',
      cache: 'no-cache',
      redirect: 'follow'
    });

    if (!downloadResponse.ok) {
      console.error('Content download failed with status:', downloadResponse.status);
      throw new Error(`Failed to download content: ${downloadResponse.status} ${downloadResponse.statusText}`);
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();

    console.log('Downloaded content successfully, content-type:', contentType, 'size:', blob.size);

    // Determine content type and filename based on URL and response
    const isVideo = url.includes('.mp4') || contentType?.includes('video');
    const finalContentType = contentType || (isVideo ? 'video/mp4' : 'image/jpeg');
    const defaultExt = isVideo ? '.mp4' : '.jpg';
    let filename = url.split('/').pop() || `download${defaultExt}`;
    if (!filename.includes('.')) {
      filename += defaultExt;
    }

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
    console.error('Error downloading content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download content' },
      { status: 500 }
    );
  }
} 