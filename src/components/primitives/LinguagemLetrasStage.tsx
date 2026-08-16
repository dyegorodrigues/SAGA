import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { LinguagemLetrasF89Spec } from "../../curriculum/procedimentos/linguagemLetrasContract";
import { SingaporeFractionBar } from "./SingaporeBars";

interface Props {
  spec: LinguagemLetrasF89Spec;
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

export function LinguagemLetrasStage({ spec, disabled, onAnswer }: Props) {
  const [indisponiveis, setIndisponiveis] = useState<Set<string>>(new Set());
  const responder = (valor: string, misconception?: string) => {
    if (disabled || indisponiveis.has(valor)) return;
    if (valor !== spec.resposta) setIndisponiveis(current => new Set(current).add(valor));
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-5" data-f89-stage data-f89-mode={spec.modo}>
      <div className="rounded-3xl border border-sky-100 bg-sky-50/60 p-4">
        <p className="text-center text-sm font-bold text-slate-700">A barra mostra a quantidade. A escrita mostra a regra que vale quando o número muda.</p>
        <div className="mt-4" data-f89-singapore-bars>
          <SingaporeFractionBar
            denominador={Math.max(2, spec.barraPartes)}
            destacarQuantidade={Math.min(spec.barraDestaque, Math.max(2, spec.barraPartes))}
            destacarPrimeira={false}
            rotulo={spec.letra}
          />
        </div>
      </div>

      <div className="rounded-3xl border-2 border-violet-200 bg-white p-5 text-center" data-f89-plain>
        <div className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">linguagem simbólica</div>
        <div className="mt-2 text-3xl font-black text-slate-900">{spec.expressao}</div>
        {spec.tabela?.length ? (
          <div className="mx-auto mt-4 grid max-w-md grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 text-sm" aria-label="Tabela para testar a regra">
            <div className="bg-slate-100 px-3 py-2 font-black">n</div>
            <div className="bg-slate-100 px-3 py-2 font-black">valor</div>
            {spec.tabela.map(item => (
              <React.Fragment key={`${item.n}-${item.valor}`}>
                <div className="border-t border-slate-200 px-3 py-2 font-bold">{item.n}</div>
                <div className="border-t border-slate-200 px-3 py-2 font-bold">{item.valor}</div>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid w-full grid-cols-2 gap-3" aria-label="Respostas da linguagem algébrica">
        {spec.opcoes.map(option => (
          <button
            key={option.value}
            type="button"
            disabled={disabled || indisponiveis.has(option.value)}
            onClick={() => responder(option.value, option.misconception)}
            className="min-h-16 rounded-2xl border-2 border-violet-200 bg-white px-3 text-xl font-black text-slate-800 disabled:opacity-35"
            data-f89-option={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
