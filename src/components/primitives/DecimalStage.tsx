import React from "react";
import type { AnswerMeta } from "../../types";
import type { DecimalF75Spec } from "../../curriculum/procedimentos/decimalContract";
import { evidenciasDecimais } from "../../curriculum/procedimentos/decimalProcedure";
import { Quadrado100 } from "./Quadrado100";

interface Props { spec: DecimalF75Spec; disabled?: boolean; onAnswer: (valor: string, meta?: AnswerMeta) => void; }
const pintados = (n: number) => Array.from({ length: Math.max(0, Math.min(100, Math.round(n))) }, (_, i) => i + 1);
const fmt = (n: number) => n.toString().replace(".", ",");

function MiniReta({ valores }: { valores: number[] }) {
  return (
    <div className="relative mx-auto mt-5 h-16 w-[88%]" data-f75-line>
      <div className="absolute left-0 right-0 top-6 h-1 rounded bg-slate-700" />
      {[0, .25, .5, .75, 1].map(v => <span key={v} className="absolute top-3 h-7 w-0.5 bg-slate-700" style={{ left: `${v * 100}%` }} />)}
      {valores.map(v => <span key={v} className="absolute top-0 -translate-x-1/2 rounded-full bg-sky-200 px-2 py-1 text-xs font-black" style={{ left: `${v * 100}%` }}>{fmt(v)}</span>)}
    </div>
  );
}

export function DecimalStage({ spec, disabled, onAnswer }: Props) {
  const responder = (value: string, misconception?: string) => {
    const correta = value === spec.resposta;
    onAnswer(value, {
      ...(misconception && !correta ? { misconception } : {}),
      ...(evidenciasDecimais(spec.nivel, correta).length ? { evidencias: evidenciasDecimais(spec.nivel, correta) } : {}),
    });
  };
  const esquerda = spec.comparar?.esquerda ?? 0;
  const direita = spec.comparar?.direita ?? 0;

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f75-stage data-f75-level={spec.nivel} data-f75-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6">
        <div className="mb-4 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500">O mesmo quadro: antes 100, agora</div>
          <div className="text-4xl font-black text-sky-700" data-f75-unit>1 inteiro</div>
          <div className="mt-1 text-sm font-bold text-slate-600">1 coluna = 0,1 · 1 quadradinho = 0,01</div>
        </div>

        {spec.modo === "comparar" ? (
          <div className="grid grid-cols-2 gap-2 sm:gap-6" data-f75-compare>
            <div><Quadrado100 showNumbers={false} highlightedNumbers={pintados(esquerda * 100)} /><div className="text-center font-black">{fmt(esquerda)}</div></div>
            <div><Quadrado100 showNumbers={false} highlightedNumbers={pintados(direita * 100)} /><div className="text-center font-black">{fmt(direita)}</div></div>
          </div>
        ) : (
          <Quadrado100 showNumbers={false} highlightedNumbers={pintados(spec.pintados)} />
        )}

        {spec.fracao && <p className="mt-2 text-center text-xl font-black" data-f75-fraction>{spec.fracao} = {spec.opcoes.find(o => o.value === spec.resposta)?.label}</p>}
        {spec.ordenar && <MiniReta valores={spec.ordenar} />}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3" data-f75-options>
          {spec.opcoes.map(opcao => (
            <button key={opcao.value} type="button" disabled={disabled} data-f75-option={opcao.value} onClick={() => responder(opcao.value, opcao.misconception)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-3 text-base font-black text-slate-800 shadow-sm hover:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-200 disabled:opacity-40">
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
