import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const svg = fs.readFileSync('public/mascot.svg', 'utf8');

// Render high-res 1024x1024 transparent PNG
const resvg = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 1024,
  },
  background: 'rgba(0, 0, 0, 0)', // 100% transparent background
});

const pngData = resvg.render();
const pngBuffer = pngData.asPng();

fs.writeFileSync('public/mascot.png', pngBuffer);
fs.writeFileSync('public/assets/images/monkey_logo.png', pngBuffer);
fs.writeFileSync('public/logo.png', pngBuffer);

// Also generate smaller 256x256 and 64x64 favicon/logo
const resvgSmall = new Resvg(svg, {
  fitTo: {
    mode: 'width',
    value: 256,
  },
  background: 'rgba(0, 0, 0, 0)',
});
fs.writeFileSync('public/mascot-256.png', resvgSmall.render().asPng());

console.log('PNG successfully rendered with 100% transparent background! Size:', pngBuffer.length, 'bytes');
