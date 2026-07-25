const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf8');

code = code.replace(
  'const [autoAula, setAutoAula] = useState(() => hasAulinha(q.kind) && !aulaSeen(kid.id, q.kind));',
  'const [autoAula, setAutoAula] = useState(() => hasAulinha(q) && !aulaSeen(kid.id, q.kind));'
);

code = code.replace(
  '{hasTutorial(q.kind) && !status && (',
  '{hasTutorial(q) && !status && ('
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
