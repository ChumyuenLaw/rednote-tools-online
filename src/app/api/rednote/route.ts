import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.REDNOTE_API_BASE_URL;
const API_UID = process.env.REDNOTE_API_UID;
const API_SECRET = process.env.REDNOTE_API_SECRET;

export async function POST(request: Request) {
  try {
    if (!API_BASE_URL || !API_UID || !API_SECRET) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // First check if the URL is a direct media URL
    if (url.startsWith('http') && (url.includes('.mp4') || url.includes('.jpg') || url.includes('.png'))) {
      console.log('Direct media download:', url);
      const downloadResponse = await fetch(url);
      
      if (!downloadResponse.ok) {
        throw new Error('Failed to download media content');
      }

      const contentType = downloadResponse.headers.get('content-type') || 'application/octet-stream';
      const blob = await downloadResponse.blob();
      
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${url.split('/').pop()}"`,
        },
      });
    }

    // If not a direct media URL, process through Rednote API
    const apiUrl = `${API_BASE_URL}/?uid=${API_UID}&my=${API_SECRET}&url=${encodeURIComponent(url)}`;
    console.log('Requesting Rednote API:', apiUrl);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error(`API request failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('Rednote API response:', data);

    // Return the API response data if no media URLs are present
    if (!data.data?.videourl && !data.data?.download_image && (!data.data?.images || data.data.images.length === 0)) {
      return NextResponse.json(data);
    }

    // Handle media download
    const mediaUrl = data.data.videourl || data.data.download_image || (data.data.images && data.data.images[0]);
    console.log('Downloading media from:', mediaUrl);
    
    const downloadResponse = await fetch(mediaUrl);
    
    if (!downloadResponse.ok) {
      throw new Error('Failed to download media content');
    }

    const contentType = downloadResponse.headers.get('content-type') || 'application/octet-stream';
    const blob = await downloadResponse.blob();
    
    // Determine filename from URL or content type
    let filename = mediaUrl.split('/').pop() || '';
    if (!filename.includes('.')) {
      filename = `download${contentType.includes('video') ? '.mp4' : '.jpg'}`;
    }

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error processing Rednote content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process content' },
      { status: 500 }
    );
  }
} 