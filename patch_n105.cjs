const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

code = code.replace(
  'big: groups[0].emoji,',
  'big: wantsMais ? `${n1} ou ${n2}? (Mais)` : `${n1} ou ${n2}? (Menos)`,'
);

fs.writeFileSync('src/utils/generators.ts', code);
