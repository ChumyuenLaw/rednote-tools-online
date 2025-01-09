const sharp = require('sharp');

// Create base icon
async function generateIcons() {
  // Create a modern icon with layered design
  const width = 512;
  const height = 512;
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="overlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:white;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:white;stop-opacity:0.05" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
        </filter>
      </defs>

      <!-- Background with rounded corners -->
      <rect width="100%" height="100%" rx="128" fill="url(#bgGrad)"/>

      <!-- Decorative elements -->
      <path d="M 128 128 L 384 128 L 384 384 L 128 384 Z" 
            fill="none" 
            stroke="white" 
            stroke-width="24"
            stroke-opacity="0.15"/>

      <!-- Main icon shape - abstract arrows forming a cycle -->
      <g transform="translate(256, 256)" filter="url(#shadow)">
        <path d="M -80,-40 L -40,-40 L -40,-80 L 40,-80 L 40,-40 L 80,-40 L 0,40 Z" 
              fill="white" 
              transform="rotate(0)"/>
        <path d="M -80,-40 L -40,-40 L -40,-80 L 40,-80 L 40,-40 L 80,-40 L 0,40 Z" 
              fill="white" 
              opacity="0.85"
              transform="rotate(180)"/>
      </g>

      <!-- Overlay gradient for depth -->
      <rect width="100%" height="100%" rx="128" fill="url(#overlayGrad)"/>
    </svg>
  `;

  // Generate different sizes
  const sizes = {
    16: 'favicon-16x16.png',
    32: 'favicon-32x32.png',
    180: 'apple-touch-icon.png',
    192: 'android-chrome-192x192.png',
    512: 'android-chrome-512x512.png'
  };

  for (const [size, filename] of Object.entries(sizes)) {
    await sharp(Buffer.from(svg))
      .resize(parseInt(size), parseInt(size))
      .png()
      .toFile(`public/${filename}`);
  }

  // Also use 32x32 as favicon.png
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile('public/favicon.png');
}

// Create OG image
async function generateOgImage() {
  const width = 1200;
  const height = 630;
  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#06B6D4;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bgGrad)"/>
      
      <!-- Icon -->
      <g transform="translate(200, 315) scale(0.5)">
        <rect width="512" height="512" rx="128" fill="white" opacity="0.1"/>
        <g transform="translate(256, 256)" filter="url(#shadow)">
          <path d="M -80,-40 L -40,-40 L -40,-80 L 40,-80 L 40,-40 L 80,-40 L 0,40 Z" 
                fill="white" 
                transform="rotate(0)"/>
          <path d="M -80,-40 L -40,-40 L -40,-80 L 40,-80 L 40,-40 L 80,-40 L 0,40 Z" 
                fill="white" 
                opacity="0.85"
                transform="rotate(180)"/>
        </g>
      </g>

      <!-- Text -->
      <text x="450" y="280" 
            font-family="Arial" 
            font-size="72" 
            font-weight="bold" 
            fill="white" 
            text-anchor="start"
            filter="url(#shadow)">
        Image Convert Free
      </text>
      <text x="450" y="380" 
            font-family="Arial" 
            font-size="36" 
            fill="white" 
            text-anchor="start" 
            opacity="0.9">
        Convert WebP, PNG, JPG Online
      </text>
      <text x="450" y="430" 
            font-family="Arial" 
            font-size="36" 
            fill="white" 
            text-anchor="start" 
            opacity="0.9">
        Always Free
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .jpeg({
      quality: 90,
      chromaSubsampling: '4:4:4'
    })
    .toFile('public/og-image.jpg');
}

async function main() {
  try {
    await generateIcons();
    await generateOgImage();
    console.log('Successfully generated all assets!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

main(); 