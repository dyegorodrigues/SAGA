const fs = require('fs');
let config = fs.readFileSync('vite.config.ts', 'utf8');

if (!config.includes('test: {')) {
  config = config.replace('server: {', 'test: {\n      exclude: [\'AI_Studio_Lab/**\', \'src/subjects/**\', \'node_modules/**\'],\n    },\n    server: {');
  fs.writeFileSync('vite.config.ts', config);
}
console.log('updated vite.config.ts');
