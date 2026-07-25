const fs = require('fs');
let code = fs.readFileSync('src/components/primitives/EmojiRow.tsx', 'utf8');

code = code.replace(
  'if (onItemTouch) onItemTouch(newCount);',
  'if (onItemTouch && newCount === n) { setTimeout(() => onItemTouch(newCount), 800); }'
);

fs.writeFileSync('src/components/primitives/EmojiRow.tsx', code);
