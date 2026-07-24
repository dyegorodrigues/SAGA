const fs = require('fs');
const content = fs.readFileSync('src/components/mascots/MascotRenderer.tsx', 'utf-8');
const replaced = content.replace(/\{\/\* PNG definitivo.*?\n      <\/g>\n      \{pngUrl \&\& \(\n      <\/g>/g, '{/* PNG definitivo (pipeline de arte): quando existir, vence qualquer desenho SVG */}\n      {pngUrl && (');
fs.writeFileSync('src/components/mascots/MascotRenderer.tsx', replaced);
