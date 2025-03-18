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

    console.log('Attempting to download image from:', url);

    // Download image through proxy with enhanced headers
    const downloadResponse = await fetch(url, {
      headers: {
        'Accept': 'image/*, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/',
        'Origin': 'https://www.xiaohongshu.com',
        'Sec-Fetch-Dest': 'image',
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
      console.error('Image download failed with status:', downloadResponse.status);
      throw new Error(`Failed to download image content: ${downloadResponse.status} ${downloadResponse.statusText}`);
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();

    console.log('Downloaded image successfully, content-type:', contentType, 'size:', blob.size);

    // Ensure we have the correct content type
    const finalContentType = contentType || 'image/jpeg';
    const filename = url.split('/').pop() || 'image.jpg';

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
    console.error('Error downloading image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download image' },
      { status: 500 }
    );
  }
} 