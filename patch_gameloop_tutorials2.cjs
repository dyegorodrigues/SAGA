const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf8');

code = code.replace(
  'setAutoAula(idx === 0 ? (hasAulinha(q.kind) && !aulaSeen(kid.id, q.kind)) : false);',
  'setAutoAula(idx === 0 ? (hasAulinha(q) && !aulaSeen(kid.id, q.kind)) : false);'
);

code = code.replace(
  'if (wrongStreakRef.current >= 2 && hasAulinha(q.kind)) setAulaSuggest(true);',
  'if (wrongStreakRef.current >= 2 && hasAulinha(q)) setAulaSuggest(true);'
);

code = code.replace(
  '{aulaSuggest && !status && hasAulinha(q.kind) && guidedIdx === null && guidedNarr === null && (',
  '{aulaSuggest && !status && hasAulinha(q) && guidedIdx === null && guidedNarr === null && ('
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
