const fs = require('fs');
let types = fs.readFileSync('src/types.ts', 'utf8');

// Add uiProps and evaluate to Question interface
types = types.replace(
  'answer: any;',
  'answer: any;\n  uiProps?: any;\n  evaluate?: (ans: any) => boolean;'
);

fs.writeFileSync('src/types.ts', types);
