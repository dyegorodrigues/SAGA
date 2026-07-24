const fs = require('fs');

let gameCode = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');
gameCode = gameCode.replace(/state="correto"/g, 'state="acerto"');
fs.writeFileSync('src/components/GameLoop.tsx', gameCode);

