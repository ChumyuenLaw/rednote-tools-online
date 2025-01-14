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

    // Download video through proxy
    const downloadResponse = await fetch(url, {
      headers: {
        'Accept': 'video/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/'
      }
    });

    if (!downloadResponse.ok) {
      throw new Error('Failed to download video content');
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();

    // Ensure we have the correct content type
    const finalContentType = contentType || 'video/mp4';
    const filename = url.split('/').pop() || 'video.mp4';

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
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