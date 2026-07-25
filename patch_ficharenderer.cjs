const fs = require('fs');
let code = fs.readFileSync('src/components/FichaRenderer.tsx', 'utf8');
code = code.replace(
  /<EmojiRow \{\.\.\.uiProps\} \/>/,
  '<EmojiRow {...uiProps} onItemTouch={handleInteract} disabled={disabled} />'
);
fs.writeFileSync('src/components/FichaRenderer.tsx', code);
