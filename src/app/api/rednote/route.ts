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

    const apiUrl = `${API_BASE_URL}/?uid=${API_UID}&my=${API_SECRET}&url=${encodeURIComponent(url)}`;
    console.log('Requesting URL:', apiUrl);

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error(`API request failed: ${errorText}`);
    }

    const data = await response.json();

    // 如果是视频或图片链接，我们需要代理下载
    if (data.data?.videourl || data.data?.download_image || (data.data?.images && data.data.images.length > 0)) {
      const downloadUrl = data.data.videourl || data.data.download_image || data.data.images[0];
      const downloadResponse = await fetch(downloadUrl);
      
      if (!downloadResponse.ok) {
        throw new Error('Failed to download content');
      }

      const contentType = downloadResponse.headers.get('content-type') || 'application/octet-stream';
      const contentDisposition = downloadResponse.headers.get('content-disposition');

      const headers = new Headers();
      headers.set('Content-Type', contentType);
      if (contentDisposition) {
        headers.set('Content-Disposition', contentDisposition);
      }

      const blob = await downloadResponse.blob();
      return new NextResponse(blob, {
        status: 200,
        headers,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing Rednote content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process content' },
      { status: 500 }
    );
  }
} 