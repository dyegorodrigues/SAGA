const fs = require('fs');
let code = fs.readFileSync('src/curriculum/Composer.ts', 'utf8');

code = code.replace(
  /emoji: "🍎",\n          n: target,/,
  `emoji: ["🍎", "🦴", "🥕", "🐟", "🧀", "🏈", "⚽", "🚗", "🐶", "🐱"][Math.floor(Math.random() * 10)],
          n: target,`
);

fs.writeFileSync('src/curriculum/Composer.ts', code);
