const fs = require('fs');
let content = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf8');

const startIndex = content.indexOf('{/* Dojo Matemático 🥋 */}');
const endIndex = content.indexOf('{pickerTrack && (');

if (startIndex === -1 || endIndex === -1) {
    console.log('Not found');
    process.exit(1);
}

const replacement = `{/* Dojo Matemático 🥋 */}
            <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: "#E11D48", boxShadow: "0 6px 0 #9F1239" }}>
              <button
                onClick={() => {
                  sfx.level();
                  onDojo();
                }}
                className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-rose-900/60 bg-rose-900/10 px-2 py-0.5 rounded-full">
                    ⚡ Foco & Velocidade
                  </span>
                  <span className="text-2xl animate-pulse">🥋</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#9F1239" }}>
                  Modo Dojo Livre
                </div>
                <div className="text-xs font-bold mt-1 leading-snug text-rose-900/80">
                  Treine sua velocidade e reflexos! Responda o mais rápido que puder para ganhar o título de Gênio. ⚡
                </div>
              </button>
            </div>
          </div>
        )}

        {activeShellTab === "oficina" && (
          <div className="animate-[mkPop_0.25s_ease-out_1]">
            <div className="text-center mb-6 mt-2">
               <h2 className="text-2xl font-black text-emerald-900" style={{ fontFamily: FONT }}>Oficina</h2>
               <p className="text-sm font-bold text-slate-500 mt-1">Aventura e Recuperação 🔧</p>
            </div>
            {aulaPlan.resgates.length === 0 ? (
               <div className="text-center p-8 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                 <span className="text-4xl mb-4 block opacity-50">✨</span>
                 <p className="text-sm font-bold text-slate-400">Nenhuma missão de resgate necessária no momento. Você está indo super bem!</p>
               </div>
            ) : (
               <div className="space-y-4">
                 <p className="text-xs font-bold text-center text-slate-500">O Guardião da Ponte precisa de você nestas missões antigas:</p>
                 {aulaPlan.resgates.map((r, i) => (
                   <button 
                     key={i}
                     onClick={() => { sfx.level(); onTrack(r.track); }}
                     className="w-full bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-95 transition-all text-left"
                   >
                      <div>
                        <div className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-200 px-2 py-0.5 rounded-md inline-block mb-1">
                          Revisão {r.track.id}
                        </div>
                        <div className="font-black text-emerald-900">{r.track.name}</div>
                        <div className="text-xs text-emerald-700 font-bold mt-0.5">Recupere suas estrelas!</div>
                      </div>
                      <span className="text-2xl">🔧</span>
                   </button>
                 ))}
               </div>
            )}
          </div>
        )}

        {activeShellTab === "perfil" && (
          <div className="animate-[mkPop_0.25s_ease-out_1]">
            <div className="text-center mb-6 mt-2">
               <h2 className="text-2xl font-black text-amber-900" style={{ fontFamily: FONT }}>Meu Perfil</h2>
               <p className="text-sm font-bold text-slate-500 mt-1">Sua coleção e mascote 🌟</p>
            </div>
            
            <div className="mb-4">
              <MascotEvolutionCard 
                 kid={kid} 
                 state={state} 
                 onUpdateKid={onUpdateKid} 
                 coins={coins} 
               />
            </div>
            
            <div className="mb-4">
              <button
                onClick={() => {
                  sfx.level();
                  setTempBg(kid.bgAccessory || "none");
                  setTempInventory(kid.inventory || []);
                  setTempCoins(coins);
                  setCoinsSpent(0);
                  setShowWardrobe(true);
                }}
                className="w-full select-none transition-all active:translate-y-1 active:scale-[0.98] py-3.5 text-sm font-black text-amber-950 cursor-pointer flex items-center justify-center gap-2 border-b-4 border-amber-600 rounded-2xl animate-pulse"
                style={{
                  fontFamily: FONT,
                  background: "linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)",
                  boxShadow: \`0 2px 0 #CA8A04\`,
                }}
              >
                <span>🎨 Mudar Cenário do Mascote 🌟</span>
              </button>
            </div>

            <button
              onClick={() => {
                sfx.tick();
                onAlbum();
              }}
              className="w-full text-left p-4 select-none relative cursor-pointer active:translate-y-0.5 transition-all mb-4 card-block border-2"
              style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)", borderColor: "#F472B6", boxShadow: "0 6px 0 #DB2777" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 text-pink-900 bg-pink-200 border-2 border-pink-300 rounded-md inline-block">
                  Sua Coleção
                </span>
                <span className="text-2xl">📖</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#831843" }}>
                Álbum de Figurinhas
              </div>
              <div className="text-xs font-bold mt-1 text-pink-900/80">
                Você tem {albumCount} de {TOTAL_STICKERS} figurinhas! Complete as páginas.
              </div>
            </button>
            
            <button
              onClick={() => {
                sfx.tick();
                onBack();
              }}
              className="w-full text-center p-3 mt-4 text-sm font-black text-slate-400 active:text-slate-600"
            >
              Sair
            </button>
          </div>
        )}

      </div>

      <div className="bg-white border-t-2 border-slate-100 flex p-2 pb-5 shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        {[
          { id: "sensei", label: "Tutor", icon: "🦊", color: "text-blue-600", activeBg: "bg-blue-50" },
          { id: "jornada", label: "Jornada", icon: "🗺️", color: "text-indigo-600", activeBg: "bg-indigo-50" },
          { id: "dojo", label: "Dojo", icon: "🥋", color: "text-purple-600", activeBg: "bg-purple-50" },
          { id: "oficina", label: "Oficina", icon: "🔧", color: "text-emerald-600", activeBg: "bg-emerald-50" },
        ].map(tab => {
          const isActive = activeShellTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sfx.tick(); setActiveShellTab(tab.id); }}
              className={\`flex-1 flex flex-col items-center justify-center py-2 transition-all rounded-xl \${isActive ? tab.activeBg : "opacity-60 grayscale"}\`}
            >
              <span className={\`text-2xl mb-1 \${isActive ? "animate-bounce" : ""}\`}>{tab.icon}</span>
              <span className={\`text-[10px] font-black uppercase \${isActive ? tab.color : "text-slate-500"}\`}>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Trazemos o Picker modal e Wardrobe modal (igual estava) */}
      `;

content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
fs.writeFileSync('src/components/KidHomeScreen.tsx', content);
console.log('done replacing block properly');
