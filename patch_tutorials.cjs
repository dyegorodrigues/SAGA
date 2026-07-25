const fs = require('fs');
let code = fs.readFileSync('src/utils/tutorials.ts', 'utf8');

code = code.replace(
  'export const hasTutorial = (kind: string): boolean => kind in LEGACY_CHOREOGRAPHIES;',
  `export const hasTutorial = (q: Question | string): boolean => {
  if (typeof q === 'string') return q in LEGACY_CHOREOGRAPHIES;
  return (q.tutorial && q.tutorial.length > 0) || q.kind in LEGACY_CHOREOGRAPHIES;
};`
);

code = code.replace(
  'export const hasAulinha = (kind: string): boolean => hasTutorial(kind);',
  'export const hasAulinha = (q: Question | string): boolean => hasTutorial(q);'
);

fs.writeFileSync('src/utils/tutorials.ts', code);
