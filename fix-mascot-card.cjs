const fs = require('fs');
let code = fs.readFileSync('src/components/MascotEvolution.tsx', 'utf-8');

code = code.replace(
  /className="sm:col-span-2 relative h-\[180px\] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-lg flex items-center justify-center"/,
  'className="sm:col-span-2 relative w-[160px] h-[160px] mx-auto rounded-full overflow-hidden border-4 border-slate-900 shadow-lg flex items-center justify-center"'
);

fs.writeFileSync('src/components/MascotEvolution.tsx', code);
