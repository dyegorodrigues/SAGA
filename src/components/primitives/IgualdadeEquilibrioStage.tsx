import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import {
  evidenciasIgualdadeEquilibrio,
  type IgualdadeEquilibrioF46Spec,
  type IgualdadeTermo,
} from "../../curriculum/procedimentos/igualdadeEquilibrioContract";
import { Balanca, type BalancaItem } from "./Balanca";

interface Props {
  spec: IgualdadeEquilibrioF46Spec;
  disabled: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

function itens(termos: IgualdadeTermo[], candidato?: number): BalancaItem[] {
  return termos.map((termo, index) => {
    const valor = termo.oculto && candidato !== undefined ? candidato : termo.valor;
    const label = termo.oculto ? (candidato === undefined ? (termo.saco ? "🎒 ?" : "?") : String(candidato)) : String(termo.valor);
    return { id: `${index}-${label}`, weight: termo.oculto && candidato === undefined ? 0 : valor, label };
  });
}

export function IgualdadeEquilibrioStage({ spec, disabled, onAnswer }: Props) {
  const [selecionado, setSelecionado] = useState<number | undefined>();
  const [indisponiveis, setIndisponiveis] = useState<Set<number>>(new Set());
  const esquerda = useMemo(() => itens(spec.esquerda, selecionado), [spec.esquerda, selecionado]);
  const direita = useMemo(() => itens(spec.direita, selecionado), [spec.direita, selecionado]);

  const responder = (value: number, misconception?: string) => {
    if (disabled || indisponiveis.has(value)) return;
    setSelecionado(value);
    const correta = value === spec.resposta;
    if (!correta) setIndisponiveis(current => new Set(current).add(value));
    onAnswer(value, {
      misconception,
      evidencias: evidenciasIgualdadeEquilibrio(spec, correta),
    });
  };

  return <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5" data-f46-stage data-mode={spec.modo}>
    <div className="w-full rounded-3xl border border-amber-100 bg-amber-50/50 px-5 pt-4">
      <p className="text-center text-sm font-bold text-amber-950">O sinal <span className="text-xl">=</span> fica no meio porque os dois lados precisam valer o mesmo.</p>
      <div className="w-full px-[62px] sm:px-16" data-f46-balance-safe-area>
        <Balanca leftItems={esquerda} rightItems={direita} state={selecionado === spec.resposta ? "acerto" : "ocioso"} />
      </div>
      <p className="pb-4 text-center text-2xl font-black tracking-wide text-slate-800" aria-label="equação da balança">{spec.equacao}</p>
    </div>

    <div className="grid w-full grid-cols-2 gap-3" aria-label="Pesos disponíveis">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        disabled={disabled || indisponiveis.has(option.value)}
        onClick={() => responder(option.value, option.misconception)}
        className="min-h-16 rounded-2xl border-2 border-amber-200 bg-white px-3 text-xl font-black text-slate-800 disabled:opacity-35"
        data-f46-option={option.value}
      >
        {spec.nivel === 5 ? `${option.label} kg` : option.label}
      </button>)}
    </div>
  </div>;
}
