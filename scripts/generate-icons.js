const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateIcons() {
  const inputSvg = path.join(__dirname, '../public/icon.svg');
  const publicDir = path.join(__dirname, '../public');

  // Read the SVG file
  const svgBuffer = await fs.readFile(inputSvg);

  // Generate different sizes
  const sizes = {
    'icon.png': 32,
    'favicon.png': 32,
    'apple-icon.png': 180,
    'og-image.png': 1200,
  };

  // Generate PNG files
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, filename));
    console.log(`Generated ${filename}`);
  }
}

generateIcons().catch(console.error); 