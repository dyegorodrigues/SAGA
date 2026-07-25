const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf8');

code = code.replace(
  '<FichaRenderer question={q} onAnswer={handlePick} disabled={status !== null} />',
  '<FichaRenderer key={idx} question={q} onAnswer={handlePick} disabled={status !== null} />'
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
