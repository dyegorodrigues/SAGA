import React from "react";
import type { AnswerMeta } from "../../types";
import type { AngulosF78Spec } from "../../curriculum/procedimentos/angulosContract";

interface Props { spec: AngulosF78Spec; disabled?: boolean; onAnswer: (valor: string | number, meta?: AnswerMeta) => void; }
function rayEnd(graus: number, raio: number) {
  const rad = (-graus * Math.PI) / 180;
  return { x: 120 + Math.cos(rad) * raio, y: 120 + Math.sin(rad) * raio };
}
function AnglePicture({ graus, raio = 78, rotulo }: { graus: number; raio?: number; rotulo?: string }) {
  const fim = rayEnd(graus, raio);
  return <div className="flex flex-col items-center gap-1">
    {rotulo && <div className="text-sm font-black text-slate-600">{rotulo}</div>}
    <svg width="220" height="150" viewBox="0 0 240 160" role="img" aria-label={`ângulo de abertura ${graus} graus`}>
      <line x1="120" y1="120" x2={120 + raio} y2="120" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <line x1="120" y1="120" x2={fim.x} y2={fim.y} stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d={`M ${120 + 34} 120 A 34 34 0 0 0 ${rayEnd(graus, 34).x} ${rayEnd(graus, 34).y}`} fill="none" stroke="currentColor" strokeWidth="5" opacity="0.55" />
      <circle cx="120" cy="120" r="6" fill="currentColor" />
    </svg>
  </div>;
}

export function AngulosStage({ spec, disabled, onAnswer }: Props) {
  const send = (value: string | number, misconception?: string) => onAnswer(value, misconception && String(value) !== String(spec.resposta) ? { misconception } : undefined);
  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f78-stage data-f78-mode={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">Ângulo = abertura</div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-slate-800">
        <AnglePicture graus={spec.anguloA} raio={spec.ladoA ?? 78} rotulo={spec.anguloB !== undefined ? "A" : undefined} />
        {spec.anguloB !== undefined && <AnglePicture graus={spec.anguloB} raio={spec.ladoB ?? 78} rotulo="B" />}
      </div>
      {spec.nivel >= 4 && <div className="mb-3 text-center text-xs font-bold text-slate-500">Leia a abertura a partir do zero correto do transferidor.</div>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {spec.opcoes.map(opcao => <button key={String(opcao.value)} type="button" disabled={disabled} onClick={() => send(opcao.value, opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40">{opcao.label}</button>)}
      </div>
    </div>
  </section>;
}
