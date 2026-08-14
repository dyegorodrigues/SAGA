import React from "react";
import type { AnswerMeta } from "../../types";
import type { RetaCompletaF84Spec } from "../../curriculum/procedimentos/retaCompletaContract";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";

interface Props { spec:RetaCompletaF84Spec; disabled?:boolean; onAnswer:(valor:string|number,meta?:AnswerMeta)=>void; }
export function RetaCompletaStage({spec,disabled,onAnswer}:Props){
  const send=(value:string|number,misconception?:string)=>onAnswer(value,misconception&&String(value)!==String(spec.resposta)?{misconception}:undefined);
  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f84-stage data-f84-mode={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">A reta continua</div>
      <div className="mb-4 text-center text-xl font-black text-slate-800">0 é a origem, não o fim</div>
      <InteractiveNumberLineSurface start={spec.inicio} end={spec.fim} position={0} disabled={true} interactionDisabled={true} numeraisVisiveis={Array.from({length:spec.fim-spec.inicio+1},(_,i)=>spec.inicio+i)} target={spec.pontos[0]} pulsarTarget={false}/>
      {spec.pontos.length>1&&<div className="mt-2 text-center text-sm font-bold text-slate-600">Pontos em foco: {spec.pontos.join(" · ")}</div>}
      {spec.modo==="ordenar-mistos"&&<div className="mt-2 text-center font-black text-slate-700">Ordene: −3, 2, −7, 5</div>}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{spec.opcoes.map(opcao=><button key={String(opcao.value)} type="button" disabled={disabled} onClick={()=>send(opcao.value,opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40">{opcao.label}</button>)}</div>
    </div>
  </section>;
}
