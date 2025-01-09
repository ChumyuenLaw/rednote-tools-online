const sharp = require('sharp');
const fs = require('fs');

async function generateFavicon() {
  try {
    // Read the PNG file
    const pngBuffer = await fs.promises.readFile('public/favicon-32x32.png');
    
    // Convert to ICO format
    const icoBuffer = await sharp(pngBuffer)
      .resize(32, 32)
      .toFormat('ico')
      .toBuffer();

    // Write the ICO file
    await fs.promises.writeFile('public/favicon.ico', icoBuffer);
    
    console.log('Successfully generated favicon.ico');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 