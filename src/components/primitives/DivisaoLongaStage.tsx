import React, { useState } from "react";
import type { AnswerMeta, Question } from "../../types";
import type { DivisaoLongaF69Spec } from "../../curriculum/procedimentos/divisaoLongaContract";
import { evidenciasDivisaoLonga } from "../../curriculum/procedimentos/divisaoLongaProcedure";
import { ArrayGrid } from "./ArrayGrid";
import { InteractiveVerticalDivisionSurface } from "./InteractiveVertical";

interface Props { spec: DivisaoLongaF69Spec; disabled: boolean; onAnswer: (value: string, meta?: AnswerMeta) => void; }

export function DivisaoLongaStage({ spec, disabled, onAnswer }: Props) {
  const [indisponiveis, setIndisponiveis] = useState<Set<string>>(new Set());
  const gridQuestion = { kind: "array", prompt: "", uiProps: { rows: spec.divisor, cols: spec.quociente, allowRotate: false, requireRotate: false, areaMode: true, showEquation: false }, evaluate: () => false } as unknown as Question;
  const responder = (value: string, misconception?: string) => {
    if (disabled || indisponiveis.has(value)) return;
    const correta = value === spec.resposta;
    if (!correta) setIndisponiveis(current => new Set(current).add(value));
    onAnswer(value, { source: "divisao-longa-f69", misconception, evidencias: evidenciasDivisaoLonga({ nivel: spec.nivel, resposta: value, respostaCorreta: spec.resposta }) });
  };
  return <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5" data-f69-stage data-mode={spec.modo}>
    {spec.nivel <= 3 && <section className="w-full rounded-3xl border border-indigo-100 bg-indigo-50/60 p-3" data-f69-array>
      <p className="mb-3 text-center text-sm font-bold text-indigo-900">Cada linha representa um grupo de {spec.divisor}.</p>
      <div className="overflow-x-auto"><ArrayGrid question={gridQuestion} onAnswer={() => undefined} disabled /></div>
      {spec.resto > 0 && <div className="mt-3 flex items-center justify-center gap-2" aria-label={`Resto ${spec.resto}`}><span className="font-bold text-slate-700">Sobrou:</span>{Array.from({ length: spec.resto }, (_, i) => <span key={i} className="h-6 w-6 rounded-md bg-amber-300" aria-hidden="true" />)}</div>}
    </section>}
    {spec.nivel >= 3 && <section className="w-full" data-f69-vertical><InteractiveVerticalDivisionSurface dividendo={spec.dividendo} divisor={spec.divisor} quociente={spec.quociente} resto={spec.resto} destacarZero={spec.nivel === 5} /></section>}
    <div className="grid w-full grid-cols-2 gap-3" aria-label="Alternativas da divisão">{spec.opcoes.map(option => <button key={option.value} type="button" data-f69-option={option.value} disabled={disabled || indisponiveis.has(option.value)} onClick={() => responder(option.value, option.misconception)} className="min-h-16 rounded-2xl border-2 border-indigo-200 bg-white px-3 text-lg font-black text-slate-800 disabled:opacity-35">{option.label}</button>)}</div>
  </div>;
}
