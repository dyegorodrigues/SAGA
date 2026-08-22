import React from "react";
import type { AnswerMeta } from "../../types";
import type { JornalTurmaF64Spec } from "../../curriculum/procedimentos/jornalTurmaContract";

interface Props {
  spec: JornalTurmaF64Spec;
  disabled?: boolean;
  onAnswer: (valor: string | number, meta?: AnswerMeta) => void;
}

export function JornalTurmaStage({ spec, disabled, onAnswer }: Props) {
  const max = Math.max(...spec.valores, 1);
  const send = (value: string | number, misconception?: string) =>
    onAnswer(value, misconception && String(value) !== String(spec.resposta) ? { misconception } : undefined);

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f64-stage data-singapore-bars-vertical data-f64-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-1 text-center text-sm font-black uppercase tracking-widest text-slate-500">Jornal da turma</div>
        <div className="mb-4 text-center text-xl font-black text-slate-800">Cada barra nasce de um dado da tabela</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-[minmax(180px,1fr)_2fr]">
          <div className="rounded-2xl bg-slate-50 p-3">
            <div className="mb-2 text-xs font-black uppercase text-slate-500">Tabela</div>
            {spec.categorias.map((categoria, i) => (
              <div key={categoria} className="flex justify-between border-b border-slate-200 py-2 text-sm font-bold">
                <span>{categoria}</span><span>{spec.valores[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex min-h-48 items-end justify-around gap-2 rounded-2xl border-l-2 border-b-2 border-slate-500 bg-slate-50 p-3 pt-6" aria-label={`gráfico de barras verticais; escala ${spec.escala}`}>
            {spec.categorias.map((categoria, i) => (
              <div key={categoria} className="flex h-40 flex-1 flex-col items-center justify-end gap-1">
                <div className="w-full max-w-16 rounded-t-xl bg-sky-300 border-2 border-sky-700" style={{ height: `${Math.max(8, (spec.valores[i] / max) * 125)}px` }} aria-label={`${categoria}: ${spec.valores[i]}`} />
                <span className="text-[10px] font-black text-slate-600 sm:text-xs">{categoria}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 text-center text-xs font-bold text-slate-500">Escala: cada marca vale {spec.escala}</div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.opcoes.map(opcao => (
            <button key={String(opcao.value)} type="button" disabled={disabled} onClick={() => send(opcao.value, opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40">
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
