const fs = require('fs');
let content = fs.readFileSync('src/components/mascots/MascotRenderer.tsx', 'utf-8');
content = content.replace(/\{\/\* PNG definitivo[\s\S]*?\{pngUrl \&\& \([\s\S]*?<\/g>/, '{/* PNG definitivo (pipeline de arte): quando existir, vence qualquer desenho SVG */}\n      {pngUrl && (');
fs.writeFileSync('src/components/mascots/MascotRenderer.tsx', content);
