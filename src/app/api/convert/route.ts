import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// 50MB in bytes
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;

    if (!file || !format) {
      return NextResponse.json(
        { error: 'File and format are required' },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Convert format to lowercase and remove dot if present
    const targetFormat = format.toLowerCase().replace('jpeg', 'jpg').replace('.', '');

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert image
    let convertedBuffer: Buffer;
    const sharpInstance = sharp(buffer);

    switch (targetFormat) {
      case 'webp':
        convertedBuffer = await sharpInstance.webp({ quality: 80 }).toBuffer();
        break;
      case 'png':
        convertedBuffer = await sharpInstance.png({ quality: 80 }).toBuffer();
        break;
      case 'jpg':
        convertedBuffer = await sharpInstance.jpeg({ quality: 80 }).toBuffer();
        break;
      case 'gif':
        convertedBuffer = await sharpInstance.gif().toBuffer();
        break;
      case 'raw':
        // For RAW format, we'll use TIFF format with maximum quality settings
        convertedBuffer = await sharpInstance
          .tiff({
            compression: 'none',
            quality: 100,
            xres: 300,
            yres: 300,
            resolutionUnit: 'inch'
          })
          .toBuffer();
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    // Create response headers
    const headers = new Headers();
    // Set appropriate content type
    headers.set('Content-Type', `image/${targetFormat === 'raw' ? 'tiff' : targetFormat}`);
    
    // Get original filename without extension
    const originalName = file.name.split('.').slice(0, -1).join('.');
    
    // Set filename in content disposition
    headers.set(
      'Content-Disposition',
      `attachment; filename="${originalName}_converted${targetFormat === 'raw' ? '.tiff' : '.' + targetFormat}"`
    );

    // Return the converted image
    return new NextResponse(convertedBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
} 