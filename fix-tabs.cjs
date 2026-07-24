const fs = require('fs');
let code = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');

const ESCOLA_TAB_CONTENT = `
        {activeShellTab === "escola" && (
          <div className="animate-[mkPop_0.25s_ease-out_1]">
            <div className="text-center mb-6 mt-2"> 
               <h2 className="text-2xl font-black text-sky-900" style={{ fontFamily: FONT }}>Modo Escola</h2>
               <p className="text-sm font-bold text-slate-500 mt-1">Todas as matérias e exercícios 📚</p>
            </div>
            
            {/* As aventuras, organizadas por matéria (SUBJECTS = cartuchos do console) */}
            {SUBJECTS.map((subject) => {
              const subjectTracks = subject.tracks[kid.grade] || [];
              if (!subjectTracks.length) return null;
              return (
                <div key={subject.id} className="mb-6">
                  <div className="flex items-center gap-2 mb-3 pl-1">
                    <span className="text-xl">{subject.icon}</span>
                    <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
                      {subject.nome}
                    </span>
                    {subject.novo && (
                      <span className="text-[10px] font-black text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        Novo! ✨
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3.5">
                    {subjectTracks.map((t) => renderTrackCard(t))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
`;

const TAB_BUTTONS_REPLACEMENT = `
        {[
          { id: "jornada", label: "Jornada", icon: "🗺️", color: "text-indigo-600", activeBg: "bg-indigo-50" },
          { id: "escola", label: "Escola", icon: "📚", color: "text-sky-600", activeBg: "bg-sky-50" },
          { id: "dojo", label: "Dojo", icon: "🥋", color: "text-purple-600", activeBg: "bg-purple-50" },
          { id: "oficina", label: "Oficina", icon: "🔧", color: "text-emerald-600", activeBg: "bg-emerald-50" },
          { id: "perfil", label: "Perfil", icon: "👤", color: "text-amber-600", activeBg: "bg-amber-50" },
        ].map(tab => {
`;

code = code.replace(
  /\{activeShellTab === "oficina" && \(/,
  ESCOLA_TAB_CONTENT + '\n        {activeShellTab === "oficina" && ('
);

code = code.replace(
  /\{\[\s*\{\s*id:\s*"jornada"[^\]]+\]\.map\(tab => \{/,
  TAB_BUTTONS_REPLACEMENT
);

// We need to add the activeShellTab type to include 'escola'
code = code.replace(
  /const \[activeShellTab, setActiveShellTab\] = useState<"jornada" | "dojo" | "oficina" | "perfil">/,
  'const [activeShellTab, setActiveShellTab] = useState<"jornada" | "escola" | "dojo" | "oficina" | "perfil">'
);

// We also need to add renderTrackCard back to the component since we are using it
const RENDER_TRACK_CARD_CODE = `
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
    const p = prog[t.id] || FRESH();
    return (
      <button
        key={t.id}
        onClick={() => {
          sfx.tick();
          onTrack(t);
        }}
        className="relative select-none transition-all cursor-pointer active:translate-y-1 text-center flex flex-col items-center justify-between"
        style={{
          background: C.card,
          border: "none",
          borderRadius: 24,
          boxShadow: \`0 6px 0 \${C.line}\`,
          padding: "16px 12px",
          minHeight: 154,
        }}
      >
        <span
          role="button"
          aria-label={\`Escolher nível de \${t.name}\`}
          onClick={(e) => {
            e.stopPropagation();
            sfx.tick();
            setPickerTrack(t);
          }}
          className="absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center text-base rounded-full bg-slate-50 border-2 border-slate-100 hover:bg-slate-100 transition-all"
        >
          🎯
        </span>
        <div
          className="flex items-center justify-center text-3xl filter drop-shadow-sm"
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: t.color,
            boxShadow: \`0 4px 0 \${t.dark}\`,
          }}
        >
          {t.icon}
        </div>
        <div className="mt-2 text-xs font-black uppercase text-slate-600 tracking-wider">
          {t.name}
        </div>
        <div className="mt-1">
          <LevelDots p={p} />
        </div>
      </button>
    );
  };
`;

// Insert it before the return statement of KidHomeScreen
code = code.replace(
  /\/\/ Wardrobe states/,
  RENDER_TRACK_CARD_CODE + '\n  // Wardrobe states'
);

fs.writeFileSync('src/components/KidHomeScreen.tsx', code);
