const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes for PWA
const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 192, 384, 512
];

// Apple touch icon sizes
const appleIconSizes = [
  152, 167, 180
];

// Microsoft tile sizes
const msIconSizes = [
  144
];

async function generateIcons() {
  const inputPath = path.join(__dirname, '../public/images/urbe_logo.jpg');
  const outputDir = path.join(__dirname, '../public/icons');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Generate standard PWA icons with white background and 20% smaller logo
    for (const size of iconSizes) {
      const logoSize = Math.floor(size * 0.8); // 20% smaller
      const padding = Math.floor((size - logoSize) / 2);
      
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        }
      })
      .composite([{
        input: await sharp(inputPath)
          .resize(logoSize, logoSize)
          .png()
          .toBuffer(),
        top: padding,
        left: padding
      }])
      .png()
      .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Generated icon-${size}x${size}.png`);
    }

    // Generate Apple touch icons with white background and 20% smaller logo
    for (const size of appleIconSizes) {
      const logoSize = Math.floor(size * 0.8); // 20% smaller
      const padding = Math.floor((size - logoSize) / 2);
      
      await sharp({
        create: {
          width: size,
          height: size,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        }
      })
      .composite([{
        input: await sharp(inputPath)
          .resize(logoSize, logoSize)
          .png()
          .toBuffer(),
        top: padding,
        left: padding
      }])
      .png()
      .toFile(path.join(outputDir, `apple-touch-icon-${size}x${size}.png`));
      
      console.log(`✅ Generated apple-touch-icon-${size}x${size}.png`);
    }

    // Generate Microsoft tile icons
    for (const size of msIconSizes) {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `ms-icon-${size}x${size}.png`));
      
      console.log(`✅ Generated ms-icon-${size}x${size}.png`);
    }

    // Generate circular favicons with no background
    await sharp(inputPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));

    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));

    // Create a circular favicon.ico (PNG format for simplicity)
    await sharp(inputPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✅ Generated favicon files');

    // Create a simple Safari pinned tab SVG (placeholder)
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="8" fill="#dc2626"/>
  <text x="8" y="11" text-anchor="middle" fill="white" font-size="10" font-family="Arial, sans-serif">U</text>
</svg>`;

    fs.writeFileSync(path.join(outputDir, 'safari-pinned-tab.svg'), svgContent);
    console.log('✅ Generated safari-pinned-tab.svg');

    // Create browserconfig.xml for Microsoft tiles
    const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/icons/ms-icon-144x144.png"/>
            <TileColor>#dc2626</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

    fs.writeFileSync(path.join(outputDir, 'browserconfig.xml'), browserConfig);
    console.log('✅ Generated browserconfig.xml');

    console.log('\n🎉 All PWA icons generated successfully!');
    console.log('📱 Your app is now ready for PWA installation');

  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons(); 