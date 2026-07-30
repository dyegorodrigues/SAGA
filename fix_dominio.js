const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/curriculum/fichas/**/*.ts', { ignore: 'src/curriculum/fichas/index.ts' });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // We look for the "micros: [" array, and inside it, objects that don't have "dominio:".
  // A regex replacement might be tricky for nested braces, so let's do a simple one:
  // If we find `params: { ... }` or `params: { ... },` before a `}` or another `id:`, we inject `dominio: { acertos: 3, de: 3, sessoes: 2 }`.
  
  // Actually, since these files are relatively simple, let's just do it manually with regex.
  // We can look for `params: {[^}]*}(?!\s*,\s*dominio)` wait, `params` might span multiple lines and have nested braces.
  // Instead, let's use a simpler approach. We know all `FichaMicro` have `params: {...}`.
  
  // Let's print out files that don't have enough `dominio:` matches compared to `id:` matches in the `micros` array.
  
  console.log(file);
});
