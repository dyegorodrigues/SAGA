const fs = require('fs');
let code = fs.readFileSync('src/utils/generators.ts', 'utf8');

code = code.replace('import { N1_01 } from "../curriculum/fichas/N1.01";\nimport { Composer } from "../curriculum/Composer";\n\n', '');

code = 'import { N1_01 } from "../curriculum/fichas/N1.01";\nimport { Composer } from "../curriculum/Composer";\n' + code;

fs.writeFileSync('src/utils/generators.ts', code);
