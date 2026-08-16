import React from "react";
import { Balanca } from "./Balanca";
import { NumberLine } from "./NumberLine";
import { tokens } from "../../styles/tokens";
import type { ConversaoUnidadesF93Spec } from "../../curriculum/procedimentos/conversaoUnidadesContract";
import type { AnswerMeta } from "../../types";

interface Props { spec:ConversaoUnidadesF93Spec; disabled?:boolean; onAnswer:(answer:string|number,meta?:AnswerMeta)=>void; }
export function ConversaoUnidadesStage({spec,disabled=false,onAnswer}:Props){
  const origemLabel=`${spec.equivalencia.origem} ${spec.equivalencia.unidadeOrigem}`;
  const destinoLabel=`${spec.equivalencia.destino} ${spec.equivalencia.unidadeDestino}`;
  return <section className="mx-auto w-full max-w-3xl space-y-5 px-1 py-2" data-f93-stage data-f93-level={spec.nivel} data-f93-mode={spec.modo}>
    <header className="rounded-2xl border p-4" style={{backgroundColor:tokens.cor.superficie.cartao,borderColor:tokens.cor.elementos.borda}}>
      <p className="text-sm font-bold" style={{color:tokens.cor.texto.secundario}}>A quantidade física não muda</p>
      <p className="text-xl font-black" style={{color:tokens.cor.texto.principal}}>{origemLabel} = {destinoLabel}</p>
      <p className="mt-2 text-sm" style={{color:tokens.cor.texto.secundario}}>Unidade menor exige mais unidades; unidade maior exige menos.</p>
    </header>
    <div className="rounded-2xl border p-4" style={{backgroundColor:tokens.cor.superficie.fundo,borderColor:tokens.cor.elementos.borda}} data-f93-balance>
      <Balanca leftItems={[{id:"origem",weight:1,label:origemLabel}]} rightItems={[{id:"destino",weight:1,label:destinoLabel}]} />
    </div>
    <div className="rounded-2xl border p-3 min-w-0 overflow-x-auto" style={{backgroundColor:tokens.cor.superficie.fundo,borderColor:tokens.cor.elementos.borda}} data-f93-scales>
      <p className="px-2 font-bold" style={{color:tokens.cor.texto.principal}}>Escalas alinhadas — a faixa inteira representa a mesma quantidade</p>
      <NumberLine min={0} max={10} step={1} targetValue={10} larguraPorPonto={44}/>
      <div className="mt-2 grid grid-cols-2 gap-2 px-2 text-sm font-bold" style={{color:tokens.cor.texto.secundario}}><span>0 → {origemLabel}</span><span className="text-right">10 → {destinoLabel}</span></div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" data-f93-options>{spec.opcoes.map(option=><button key={`${option.value}-${option.label}`} type="button" disabled={disabled} onClick={()=>onAnswer(option.value,option.misconception?{misconception:option.misconception}:undefined)} className="min-h-14 rounded-2xl border px-4 py-3 font-black disabled:opacity-50" style={{backgroundColor:tokens.cor.superficie.cartao,borderColor:tokens.cor.elementos.borda,color:tokens.cor.texto.principal}} data-misconception={option.misconception}>{option.label}</button>)}</div>
  </section>;
}
