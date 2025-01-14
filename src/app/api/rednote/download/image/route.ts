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

    // Download image through proxy
    const downloadResponse = await fetch(url, {
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/'
      }
    });

    if (!downloadResponse.ok) {
      throw new Error('Failed to download image content');
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();

    // Ensure we have the correct content type
    const finalContentType = contentType || 'image/jpeg';
    const filename = url.split('/').pop() || 'image.jpg';

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
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