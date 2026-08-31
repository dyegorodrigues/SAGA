import React from "react";
import { Icone } from "../icones/Icone";
import { FONT, sfx } from "../Mascot";
import { AulaPlan, RescuePlanItem, RescueReason } from "../../curriculum/motores/composer";

interface Props {
  aulaPlan: AulaPlan;
  onTrack: (rescue: RescuePlanItem) => void;
}

export function OficinaTab({ aulaPlan, onTrack }: Props) {
  const reasonCopy: Record<RescueReason, { badge: string; detail: string }> = {
    misconception: {
      badge: "Padrão percebido",
      detail: "Vamos reconstruir esta ideia com outro caminho.",
    },
    "prerequisite-gap": {
      badge: "Base para reconstruir",
      detail: "Vamos fortalecer um degrau anterior e voltar ao caminho.",
    },
    "error-bank": {
      badge: "Questão para rever",
      detail: "Uma tentativa antiga voltou para ficar mais fácil.",
    },
    "spaced-review": {
      badge: "Revisão no tempo certo",
      detail: "Uma lembrança importante está pronta para ser fortalecida.",
    },
  };

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-6 mt-2"> 
         <h2 className="text-2xl font-black text-emerald-900" style={{ fontFamily: FONT }}>Oficina</h2> 
         <p className="text-sm font-bold text-slate-500 mt-1">O que vale treinar de novo.</p>
      </div>

      {aulaPlan.resgates.length === 0 ? (
         <div className="text-center p-8 border-4 border-dashed border-slate-200 rounded-3xl bg-slate-50">
           <span className="mb-4 flex justify-center opacity-50"><Icone nome="estrela" tamanho={44} /></span>
           <p className="text-sm font-bold text-slate-400">Nenhuma missão de resgate necessária no momento. Você está indo super bem!</p>
         </div>
      ) : (
         <div className="space-y-4">
           <p className="text-xs font-bold text-center text-slate-500">O Guardião da Ponte precisa de você nestas missões antigas:</p>
           {aulaPlan.resgates.map((rescue) => (
             <button 
                key={`${rescue.reason}-${rescue.track.id}`}
               onClick={() => { sfx.level(); onTrack(rescue); }}
               className="w-full bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex items-center justify-between shadow-sm active:scale-95 transition-all text-left"
             >
                <div>
                  <div className="text-[10px] font-black text-emerald-700 uppercase bg-emerald-200 px-2 py-0.5 rounded-md inline-block mb-1">
                    {reasonCopy[rescue.reason].badge} · {rescue.track.id}
                  </div>
                  <div className="font-black text-emerald-900">{rescue.track.name}</div>
                  <div className="text-xs text-emerald-700 font-bold mt-0.5">
                    {reasonCopy[rescue.reason].detail}
                  </div>
                  {rescue.questionBudget && (
                    <div className="text-[10px] text-emerald-700 mt-1">
                      Missão curta · até {rescue.questionBudget} desafios
                      {rescue.escalated ? " · investigando a base" : ""}
                    </div>
                  )}
                </div>
                <Icone nome="oficina" tamanho={24} />
             </button>
           ))}
         </div>
      )}
    </div>
  );
}
