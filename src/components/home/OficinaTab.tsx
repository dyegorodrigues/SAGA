import React from "react";
import { Track } from "../../types";
import { FONT, sfx } from "../Mascot";

interface Props {
  aulaPlan: any;
  onTrack: (t: Track) => void;
}

export function OficinaTab({ aulaPlan, onTrack }: Props) {
  return (
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
           {aulaPlan.resgates.map((r: any, i: number) => (
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
  );
}
