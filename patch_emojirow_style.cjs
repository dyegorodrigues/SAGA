const fs = require('fs');
let code = fs.readFileSync('src/components/primitives/EmojiRow.tsx', 'utf8');

code = code.replace(
  'gap-2 relative py-4',
  'gap-x-4 gap-y-12 relative py-6'
);

code = code.replace(
  '<span className="text-3xl font-bold" style={{ color: tokens.cor.texto.secundario }}>\n              📦 Ocultos\n            </span>',
  '<div className="flex flex-col items-center gap-2">\n              <span className="text-5xl">🙈</span>\n              <span className="text-sm font-bold" style={{ color: tokens.cor.texto.secundario }}>Onde foram?</span>\n            </div>'
);

fs.writeFileSync('src/components/primitives/EmojiRow.tsx', code);
