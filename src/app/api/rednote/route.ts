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

    const { url, download } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // If it's a direct media URL and download is requested
    if (download && url.startsWith('http') && (url.includes('.mp4') || url.includes('.jpg') || url.includes('.png'))) {
      console.log('Direct media download:', url);
      const downloadResponse = await fetch(url, {
        headers: {
          'Accept': 'image/*, video/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!downloadResponse.ok) {
        throw new Error('Failed to download media content');
      }

      const contentType = downloadResponse.headers.get('content-type');
      const blob = await downloadResponse.blob();
      
      // Ensure we have the correct content type
      const finalContentType = contentType || (url.includes('.mp4') ? 'video/mp4' : 'image/jpeg');
      
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': finalContentType,
          'Content-Disposition': `attachment; filename="${url.split('/').pop()}"`,
        },
      });
    }

    // Process through Rednote API
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

    // If download is not requested, return the API response
    if (!download) {
      return NextResponse.json(data);
    }

    // If download is requested but no media URLs are present
    if (!data.data?.videourl && !data.data?.download_image && (!data.data?.images || data.data.images.length === 0)) {
      throw new Error('No media content found');
    }

    // Handle media download
    const mediaUrl = data.data.videourl || data.data.download_image || (data.data.images && data.data.images[0]);
    console.log('Downloading media from:', mediaUrl);
    
    const downloadResponse = await fetch(mediaUrl, {
      headers: {
        'Accept': 'image/*, video/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!downloadResponse.ok) {
      throw new Error('Failed to download media content');
    }

    const contentType = downloadResponse.headers.get('content-type');
    const blob = await downloadResponse.blob();
    
    // Determine filename and content type based on URL and actual content
    let filename = mediaUrl.split('/').pop() || '';
    const isVideo = mediaUrl.includes('.mp4') || contentType?.includes('video');
    const finalContentType = contentType || (isVideo ? 'video/mp4' : 'image/jpeg');
    
    if (!filename.includes('.')) {
      filename = `download${isVideo ? '.mp4' : '.jpg'}`;
    }

    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': finalContentType,
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