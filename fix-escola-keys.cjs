const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');
code = code.replace(
  /const subjectTracks = \["pre", "ano1", "ano2"\]\.flatMap\(g => subject\.tracks\[g as "pre" \| "ano1" \| "ano2"\] \|\| \[\]\);/,
  `const allSubjectTracks = ["pre", "ano1", "ano2"].flatMap(g => subject.tracks[g as "pre" | "ano1" | "ano2"] || []);
              const subjectTracks = Array.from(new Map(allSubjectTracks.map(t => [t.id, t])).values());`
);
fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
