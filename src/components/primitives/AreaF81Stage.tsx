import React from "react";
import type { AnswerMeta, Question } from "../../types";
import type { AreaF81Regiao, AreaF81Spec } from "../../curriculum/procedimentos/areaF81Contract";
import { ArrayGrid } from "./ArrayGrid";

interface Props {
  spec: AreaF81Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

function visualQuestion(regiao: AreaF81Regiao): Question {
  return {
    kind: "array",
    prompt: "",
    uiProps: {
      rows: regiao.rows,
      cols: regiao.cols,
      allowRotate: false,
      requireRotate: false,
      areaMode: true,
      showEquation: false,
      answerMode: "total",
    },
    options: [],
    answer: regiao.rows * regiao.cols,
    evaluate: value => Number(value) === regiao.rows * regiao.cols,
  };
}

export function AreaF81Stage({ spec, disabled, onAnswer }: Props) {
  const send = (value: number, misconception?: string) =>
    onAnswer(value, misconception && value !== spec.resposta ? { misconception } : undefined);

  return (
    <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f81-stage data-array-grid data-f81-mode={spec.modo}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-1 text-center text-sm font-black uppercase tracking-widest text-slate-500">Área</div>
        <div className="mb-4 text-center text-xl font-black text-slate-800">Área é o chão; perímetro é a volta.</div>

        <div className={`flex items-end justify-center gap-3 ${spec.regioes.length > 1 ? "flex-wrap" : ""}`} aria-label={`representação em ArrayGrid, unidade ${spec.unidade}`}>
          {spec.regioes.map((regiao, index) => (
            <div key={`${regiao.rows}x${regiao.cols}-${index}`} className="rounded-2xl bg-slate-50 p-2" data-f81-region={index}>
              <ArrayGrid question={visualQuestion(regiao)} onAnswer={() => undefined} disabled />
              {spec.modo === "compor-areas" && (
                <div className="mt-1 text-center text-xs font-black text-slate-500">parte {index + 1}: {regiao.rows} × {regiao.cols}</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 text-center text-sm font-bold text-slate-600">
          {spec.modo === "area-vs-perimetro"
            ? `A mesma figura tem perímetro ${spec.perimetro} cm e área em ${spec.unidade}.`
            : spec.modo === "compor-areas"
              ? "Duas partes retangulares: calcule cada chão e depois some."
              : `${spec.rows} linhas × ${spec.cols} colunas · responda em ${spec.unidade}`}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {spec.opcoes.map(opcao => (
            <button
              key={String(opcao.value)}
              type="button"
              disabled={disabled}
              onClick={() => send(opcao.value, opcao.misconception)}
              className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-indigo-400 disabled:opacity-40"
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
