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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing Rednote content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process content' },
      { status: 500 }
    );
  }
} 