import React, { useMemo, useState } from "react";
import type { AnswerMeta, Option, Question } from "../../types";
import {
  evidenciasMultiplicarFracoesF86,
  type MultiplicarFracoesF86Spec,
} from "../../curriculum/procedimentos/multiplicarFracoesContract";
import { ArrayGrid } from "./ArrayGrid";

interface Props {
  spec: MultiplicarFracoesF86Spec;
  options: Option[];
  disabled?: boolean;
  onAnswer: (valor: string | number, meta?: AnswerMeta) => void;
}

function areaQuestion(spec: MultiplicarFracoesF86Spec): Question {
  return {
    kind: "area",
    prompt: "",
    answer: spec.resposta,
    uiProps: {
      rows: spec.rows,
      cols: spec.cols,
      allowRotate: false,
      requireRotate: false,
      areaMode: true,
      showEquation: false,
      activeCells: spec.activeCells,
      ...(spec.modo === "fracao-fracao-area" ? { fractionRows: 1, fractionCols: 3 } : {}),
    },
    options: [],
    evaluate: () => false,
  };
}

export function MultiplicarFracoesStage({ spec, options, disabled = false, onAnswer }: Props): React.ReactElement {
  const [selecionado, setSelecionado] = useState<string>();
  const grid = useMemo(() => areaQuestion(spec), [spec]);

  const responder = (option: Option) => {
    if (disabled) return;
    const valor = option.value as string | number;
    setSelecionado(String(valor));
    const correta = String(valor) === String(spec.resposta);
    const evidencias = evidenciasMultiplicarFracoesF86(spec, correta);
    onAnswer(valor, {
      source: "array-grid",
      ...(evidencias.length ? { evidencias } : {}),
      ...(!correta && option.misconception ? { misconception: option.misconception } : {}),
    });
  };

  const areaLabel = spec.modo === "fracao-fracao-area"
    ? `${spec.fatorA} numa direção × ${spec.fatorB} na outra: conte somente a interseção`
    : spec.modo === "divisao-fracoes"
      ? "Dois inteiros repartidos em quartos: conte quantos quartos cabem"
      : spec.modo === "fracao-fracao-simbolico"
        ? "A malha mostra apenas as partições; agora calcule sem a área preenchida"
        : `${spec.fatorA} de ${spec.fatorB}: a parte destacada mostra a fração do inteiro`;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5" data-f86-stage data-f86-mode={spec.modo} data-arraygrid-area>
      <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-4" data-mode-literacy="arraygrid-area">
        <p className="text-center text-sm font-black text-indigo-900">Mesmo chão quadriculado da área: agora cada direção pode representar uma fração.</p>
        <p className="mt-2 text-center text-xl font-black text-slate-900">{spec.expressao}</p>
        <p className="mt-1 text-center text-sm font-bold text-slate-700">Leia: {spec.leitura}</p>
      </div>

      {spec.modo === "fracao-fracao-area" ? (
        <div role="group" className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Duas pinturas fracionárias que se cruzam">
          <div className="min-h-20 rounded-2xl border-2 border-sky-300 bg-sky-50 p-3 text-center" data-f86-layer="horizontal">
            <p className="text-sm font-black text-sky-900">Primeira pintura</p>
            <p className="text-2xl font-black text-sky-800">{spec.fatorA}</p>
          </div>
          <div className="min-h-20 rounded-2xl border-2 border-violet-300 bg-violet-50 p-3 text-center" data-f86-layer="vertical">
            <p className="text-sm font-black text-violet-900">Segunda pintura</p>
            <p className="text-2xl font-black text-violet-800">{spec.fatorB}</p>
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border-2 border-slate-200 bg-white p-4" data-f86-area-grid>
        <p className="mb-3 text-center text-sm font-bold text-slate-700">{areaLabel}</p>
        <ArrayGrid question={grid} onAnswer={() => undefined} disabled />
      </div>

      {spec.modo === "fracao-fracao-area" && spec.mostrarIntersecao ? (
        <p className="rounded-2xl bg-emerald-50 p-3 text-center text-sm font-black text-emerald-900" data-f86-intersection>
          A região verde é a interseção: ela pertence às duas frações ao mesmo tempo.
        </p>
      ) : null}

      <div role="group" className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Respostas para multiplicação e divisão de frações">
        {options.map((option, index) => (
          <button
            key={`${String(option.value)}-${index}`}
            type="button"
            disabled={disabled}
            onClick={() => responder(option)}
            className={`min-h-20 min-w-20 rounded-2xl border-2 px-4 py-3 text-lg font-black ${selecionado === String(option.value) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"} disabled:opacity-50`}
          >
            {option.label ?? String(option.value)}
          </button>
        ))}
      </div>
    </section>
  );
}
