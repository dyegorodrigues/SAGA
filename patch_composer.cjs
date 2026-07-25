const fs = require('fs');
let code = fs.readFileSync('src/curriculum/Composer.ts', 'utf8');

// replace emojirow options behavior
code = code.replace(
  /evaluate = \(ans\) => true;[\s]*answer = target;/,
  `evaluate = (ans) => true; answer = target; options = [{ label: "Continuar 👍", value: target }];`
);

// replace draggroup emojis
code = code.replace(
  /uiProps = {[\s]*sourceCount: target \+ sobra,[\s]*destCount: target,[\s]*sourceEmoji: "🍎",[\s]*destEmoji: "🐰"[\s]*};/,
  `
        const pairs = [
          { s: "🍎", d: "🐰" },
          { s: "🦴", d: "🐶" },
          { s: "🥕", d: "🐎" },
          { s: "🐟", d: "🐱" },
          { s: "🧀", d: "🐭" }
        ];
        const pair = pairs[Math.floor(Math.random() * pairs.length)];
        uiProps = {
          sourceCount: target + sobra,
          destCount: target,
          sourceEmoji: pair.s,
          destEmoji: pair.d
        };
  `
);

fs.writeFileSync('src/curriculum/Composer.ts', code);
