import { NextResponse } from 'next/server';

const API_KEY = process.env.REDNOTE_API_KEY || '1234';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Process through new API
    const apiUrl = 'https://api.rednotetoolsonline.com/v1/api/rednote-downloader';
    console.log('Requesting API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Authorization': `KEY ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API response error:', errorText);
      throw new Error(`API request failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('API response:', data);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error processing content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process content' },
      { status: 500 }
    );
  }
} 