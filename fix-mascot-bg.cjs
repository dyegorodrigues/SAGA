const fs = require('fs');
let code = fs.readFileSync('src/components/mascots/MascotRenderer.tsx', 'utf-8');

// Add clipPath definition inside <defs>
code = code.replace(
  /<defs>/,
  '<defs>\n        <clipPath id="bg-clip"><circle cx="50" cy="50" r="50" /></clipPath>'
);

// Wrap backgrounds in clipPath
code = code.replace(
  /\{activeBg === "castelo" && \(/,
  '<g clipPath="url(#bg-clip)">\n        {activeBg === "castelo" && ('
);

code = code.replace(
  /\{activeBg === "parque" && \([\s\S]*?<\/g>\n        \)\}/,
  match => match + '\n        </g>'
);

fs.writeFileSync('src/components/mascots/MascotRenderer.tsx', code);
