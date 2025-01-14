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

    // Download file through proxy
    const downloadResponse = await fetch(url, {
      headers: {
        'Accept': 'image/*, video/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/'
      }
    });

    if (!downloadResponse.ok) {
      throw new Error('Failed to download content');
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();

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