const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

// Replace all these specific blocks
code = code.replace(/\{guidedIdx === null && !status && \([\s\S]*?<\/button>\s*\)\}/g, '');

fs.writeFileSync('src/components/GameLoop.tsx', code);
