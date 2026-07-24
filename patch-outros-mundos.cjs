const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');

// Replace the Outros Mundos filtering logic to include all grades and deduplicate
code = code.replace(
  /const tks = subj\.tracks\[kid\.grade\];/g,
  `const allTks = ["pre", "ano1", "ano2"].flatMap(g => subj.tracks[g as "pre" | "ano1" | "ano2"] || []);
                 const tks = Array.from(new Map(allTks.map(t => [t.id, t])).values());`
);

// Also fix the Mundo SAGA filtering
code = code.replace(
  /tracks=\{SUBJECTS\.find\(s => s\.id === 'mat'\)\?\.tracks\[kid\.grade\] \|\| \[\]\}/g,
  `tracks={(() => {
                    const mat = SUBJECTS.find(s => s.id === 'mat');
                    if (!mat) return [];
                    const allMat = ["pre", "ano1", "ano2"].flatMap(g => mat.tracks[g as "pre" | "ano1" | "ano2"] || []);
                    return Array.from(new Map(allMat.map(t => [t.id, t])).values());
                  })()}`
);

fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
