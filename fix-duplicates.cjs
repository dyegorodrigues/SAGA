const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');

// The original ones are right after:
// const subjectIds = new Set(SUBJECTS.flatMap((s) => (s.tracks[kid.grade] || []).map((t) => t.id)));
// const customTracks = tracks.filter((t) => !subjectIds.has(t.id));

// I injected:
/*
  const pickerSamples = useMemo(() => {
    if (!pickerTrack) return [];
    return [1, 2, 3, 4, 5].map((lvl) => {
      try {
        return pickerTrack.gen(lvl).prompt;
      } catch {
        return "";
      }
    });
  }, [pickerTrack]);

  const renderTrackCard = (t: Track) => {
    ...
  };
  // Wardrobe states
*/

// Let's remove the injected ones before "// Wardrobe states"
const toRemove = /const pickerSamples = useMemo\(\(\) => \{[\s\S]*?const renderTrackCard = \(t: Track\) => \{[\s\S]*?<\/button>\n    \);\n  \};\n/m;
code = code.replace(toRemove, '');

fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
