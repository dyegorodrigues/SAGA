const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

code = code.replace(/highlightRow=\{/g, 'destacarFileira={');

fs.writeFileSync('src/components/GameLoop.tsx', code);
