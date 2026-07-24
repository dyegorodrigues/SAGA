const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');
code = code.replace(
  /const subjectTracks = subject\.tracks\[kid\.grade\] \|\| \[\];/,
  'const subjectTracks = ["pre", "ano1", "ano2"].flatMap(g => subject.tracks[g as "pre" | "ano1" | "ano2"] || []);'
);
fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
