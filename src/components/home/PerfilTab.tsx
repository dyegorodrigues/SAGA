import React, { useMemo } from "react";

import { State, Kid } from "../../types";
import { FONT, sfx, TOTAL_STICKERS } from "../Mascot";
import { MascotEvolutionCard } from "../MascotEvolution";

interface Props {
  kid: Kid;
  state: State;
  coins: number;
  albumCount: number;
  onUpdateKid: (k: Kid) => void;
  onAlbum: () => void;
  onBack: () => void;
  setShowWardrobe: (val: boolean) => void;
  setTempBg: (val: string) => void;
  setTempInventory: (val: string[]) => void;
  setTempCoins: (val: number) => void;
  setCoinsSpent: (val: number) => void;
}


export function PerfilTab({ 
  kid, state, coins, albumCount, 
  onUpdateKid, onAlbum, onBack, 
  setShowWardrobe, setTempBg, setTempInventory, setTempCoins, setCoinsSpent 
}: Props) {
  const stats = useMemo(() => {
    const logs = state.log[kid.id] || [];
    const activeDays = logs.length;
    let totQuestions = 0;
    let totStars = 0;
    
    // Sum from progress to get absolute totals, logs might have been truncated? No, logs are per day.
    const kidProg = state.progress[kid.id] || {};
    for (const trackId of Object.keys(kidProg)) {
      if (kidProg[trackId].ok) totQuestions += kidProg[trackId].ok; // only right ones? or tot
    }
    // Alternatively sum from logs
    let logQuestions = 0;
    logs.forEach(l => {
      logQuestions += l.tot || 0;
      totStars += l.stars || 0;
    });

    return { days: activeDays, questions: logQuestions > totQuestions ? logQuestions : totQuestions, stars: totStars };
  }, [kid.id, state.log, state.progress]);

  return (
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
            boxShadow: `0 2px 0 #CA8A04`,
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
  );
}
