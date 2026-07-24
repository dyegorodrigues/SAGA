const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  /const unlockedTracks = allTracks; \/\/ Return all tracks to show them in the map/,
  `const unlockedTracks = Array.from(new Map(allTracks.map(t => [t.id, t])).values()); // Deduplicate`
);
fs.writeFileSync('src/App.tsx', code);
