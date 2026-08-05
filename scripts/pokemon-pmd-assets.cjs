const fs = require('node:fs');
const path = require('node:path');

const assetDir = path.join(process.cwd(), 'public/assets/creatures/pokemon-pmd');
const slugs = ['bulbasaur', 'charmander', 'squirtle'];
const png1x1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lWZk9QAAAABJRU5ErkJggg==',
  'base64',
);

function ensureDir() {
  fs.mkdirSync(assetDir, { recursive: true });
}

function generate() {
  ensureDir();
  for (const slug of slugs) {
    fs.writeFileSync(path.join(assetDir, `${slug}.png`), png1x1);
  }
  console.log(`Generated ${slugs.length} local PMD PNG assets in ${assetDir}`);
}

function clean() {
  if (!fs.existsSync(assetDir)) {
    console.log('No PMD asset directory to clean.');
    return;
  }
  for (const file of fs.readdirSync(assetDir)) {
    if (file.endsWith('.png')) fs.unlinkSync(path.join(assetDir, file));
  }
  console.log(`Removed PMD PNG assets from ${assetDir}`);
}

const command = process.argv[2];
if (command === 'generate') generate();
else if (command === 'clean') clean();
else {
  console.error('Usage: node scripts/pokemon-pmd-assets.cjs <generate|clean>');
  process.exit(1);
}
