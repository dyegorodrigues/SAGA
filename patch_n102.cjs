const fs = require('fs');
let code = fs.readFileSync('src/curriculum/fichas/N1.02.ts', 'utf8');

code = code.replace(
  'audio_prompt: "Vamos contar juntos? Um, dois, três, quatro, cinco!"',
  'audio_prompt: "Vamos contar juntos? Toque em um de cada vez!", tutorial: [{ say: "Toque nas figuras para cantarmos juntos!" }], interactive_count: true'
);

fs.writeFileSync('src/curriculum/fichas/N1.02.ts', code);
