const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

code = code.replace(
  /const shouldScaffold = !isAuto && total > 2;/,
  'const shouldScaffold = !isAuto && total > 2 && !isMock;'
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
