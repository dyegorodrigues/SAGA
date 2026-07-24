const fs = require('fs');

// 1. Fix MascotEvolution.tsx (Restore TV Screen)
let evoCode = fs.readFileSync('src/components/MascotEvolution.tsx', 'utf-8');
evoCode = evoCode.replace(
  /<div className="sm:col-span-2 relative w-\[160px\] h-\[160px\] mx-auto flex items-center justify-center">/,
  '<div className="sm:col-span-2 relative h-[180px] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-lg flex items-center justify-center">'
);
fs.writeFileSync('src/components/MascotEvolution.tsx', evoCode);

// 2. Fix MascotRenderer.tsx (Remove circular clip-path)
let renCode = fs.readFileSync('src/components/mascots/MascotRenderer.tsx', 'utf-8');
renCode = renCode.replace(
  /<clipPath id="bg-clip"><circle cx="50" cy="50" r="50" \/><\/clipPath>/,
  ''
);
renCode = renCode.replace(/<g clipPath="url\(#bg-clip\)">/g, '<g>');
fs.writeFileSync('src/components/mascots/MascotRenderer.tsx', renCode);

