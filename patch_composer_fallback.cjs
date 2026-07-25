const fs = require('fs');
let code = fs.readFileSync('src/curriculum/Composer.ts', 'utf8');

// replace throw Error with fallback
code = code.replace(
  /const micro = ficha\.micros\.find\(m => m\.id === microId\);\n    if \(\!micro\) \{\n      throw new Error\(\`Micro \$\{microId\} not found in Ficha \$\{ficha\.id\}\`\);\n    \}/,
  `let micro = ficha.micros.find(m => m.id === microId);
    if (!micro) {
      console.warn(\`Micro \${microId} not found in Ficha \${ficha.id}, falling back to first micro.\`);
      micro = ficha.micros[0];
    }`
);

fs.writeFileSync('src/curriculum/Composer.ts', code);
