import React, { useState } from "react";
import type { AnswerMeta, Option, Question } from "../../types";
import type { FatoresRetangulosF66Spec } from "../../curriculum/procedimentos/fatoresRetangulosContract";
import { tentativaRetangulo } from "../../curriculum/procedimentos/fatoresRetangulosProcedure";
import { ArrayGrid } from "./ArrayGrid";

interface Props {
  spec: FatoresRetangulosF66Spec;
  options: Option[];
  disabled?: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

/** F66 preserva ArrayGrid como superfície física; o palco só coordena pares, varredura e sobra. */
export function FatoresRetangulosStage({ spec, options, disabled, onAnswer }: Props): React.ReactElement {
  const [divisor, setDivisor] = useState(spec.divisorInicial);
  const tentativa = tentativaRetangulo(spec.total, divisor);
  const rows = Math.max(1, tentativa.linhasCompletas);

  const gridQuestion: Question = {
    kind: "array",
    prompt: "",
    answer: spec.total,
    uiProps: {
      rows,
      cols: divisor,
      allowRotate: false,
      requireRotate: false,
      areaMode: false,
      showEquation: true,
    },
    options: [],
    evaluate: () => true,
  };

  const choose = (option: Option) => {
    if (disabled) return;
    const value = Number(option.value);
    const nextDivisor = spec.previewDivisorByValue[String(option.value)] ?? spec.divisorInicial;
    setDivisor(nextDivisor);
    onAnswer(value, {
      source: "array-grid",
      ...(option.misconception ? { misconception: option.misconception } : {}),
    });
  };

  return <section className="mx-auto w-full max-w-4xl" data-fatores-retangulos-stage="" data-modo={spec.modo}>
    <div className="mb-4 text-center">
      <p className="text-lg font-bold text-slate-700">Mesmo total: <strong>{spec.total}</strong> quadradinhos</p>
      {spec.dicaQuantidadePares ? <p className="mt-1 text-sm font-semibold text-indigo-700">Dica: existem {spec.dicaQuantidadePares} formações retangulares sem repetir a rotação.</p> : null}
      {spec.segundoTotal ? <p className="mt-1 text-sm font-semibold text-slate-600">Compare também os fatores de {spec.segundoTotal}.</p> : null}
    </div>

    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4" data-array-grid-f66="">
      <ArrayGrid question={gridQuestion} onAnswer={() => undefined} disabled={Boolean(disabled)} />
      {tentativa.sobra > 0 ? <div className="mt-4" data-f66-invalid-remainder="" aria-label={`${tentativa.sobra} quadradinhos de sobra`}>
        <p className="mb-2 text-center font-black text-rose-700">Não fechou: sobraram {tentativa.sobra}.</p>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: tentativa.sobra }, (_, index) => <span key={index} aria-hidden="true" className="h-8 w-8 rounded-md border-2 border-rose-500 bg-rose-100" />)}
        </div>
      </div> : <p className="mt-3 text-center font-black text-emerald-700" data-f66-complete-rectangle="">Retângulo completo: sem sobra.</p>}
    </div>

    {spec.pares.length ? <p className="mt-4 text-center text-sm font-semibold text-slate-600" data-f66-pairs="">
      Formações do total: {spec.pares.map(par => `${par.linhas}×${par.colunas}`).join(" · ")}
    </p> : null}

    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Alternativas da Fábrica de Retângulos">
      {options.map((option, index) => <button
        key={`${String(option.value)}-${index}`}
        type="button"
        disabled={disabled}
        onClick={() => choose(option)}
        className="min-h-14 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-800 disabled:opacity-50"
        data-f66-option={String(option.value)}
      >{option.label ?? String(option.value)}</button>)}
    </div>
  </section>;
}
