import { NextResponse } from 'next/server';
import { checkSignValid } from '@/lib/sign';

const API_KEY = process.env.REDNOTE_API_KEY || '1234';
const FIXED_SIGN = process.env.FIXED_SIGN || '';

export async function POST(request: Request) {
  try {
    // 获取并验证 sign
    const sign = request.headers.get('X-Sign');
    if (!sign) {
      return NextResponse.json(
        { error: 'Missing X-Sign header' },
        { status: 401 }
      );
    }

    const isSignValid = await checkSignValid(sign, FIXED_SIGN);
    if (!isSignValid) {
      return NextResponse.json(
        { error: 'Invalid sign' },
        { status: 401 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check if API key is properly configured
    if (!API_KEY || API_KEY === '1234' || API_KEY === 'your_valid_api_key_here') {
      console.error('Invalid API key configuration');
      return NextResponse.json(
        { 
          error: 'API not properly configured', 
          message: 'Please configure your API_KEY in .env.local file'
        },
        { status: 500 }
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
      
      // Check if this is an authorization error
      if (response.status === 401) {
        return NextResponse.json(
          { 
            error: 'API Authorization failed', 
            message: 'Invalid API key. Please check your REDNOTE_API_KEY configuration.'
          },
          { status: 401 }
        );
      }
      
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