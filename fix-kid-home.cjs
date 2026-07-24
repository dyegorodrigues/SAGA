const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');

// I'll add an "Outros Mundos" section to render other subjects.
const outrosMundos = `
            {/* Outros Mundos / Matérias */}
            <div className="mt-12 mb-10">
               <div className="text-center mb-6 mt-8">
                 <h2 className="text-2xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Outros Mundos</h2>
                 <p className="text-sm font-bold text-slate-500 mt-1">Explore novos conhecimentos!</p>
               </div>
               {SUBJECTS.filter(s => s.id !== 'mat').map(subj => {
                 const tks = subj.tracks[kid.grade];
                 if (!tks || tks.length === 0) return null;
                 return (
                   <div key={subj.id} className="mb-8">
                     <h3 className="text-lg font-bold text-slate-700 mb-3 px-2 flex items-center gap-2">
                       <span>{subj.icon}</span> {subj.nome}
                     </h3>
                     <LearningPath
                         tracks={tks}
                        progOf={(id) => prog[id] || FRESH()}
                        onSelectTrack={onTrack}
                     />
                   </div>
                 );
               })}
            </div>
`;

code = code.replace(
  /(\<LearningPath[\s\S]*?onSelectTrack=\{onTrack\}\s*\/\>\s*<\/div>)/,
  '$1\n' + outrosMundos
);

fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
