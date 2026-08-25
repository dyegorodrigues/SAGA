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

const fecha = (total: number, divisor: number) => tentativaRetangulo(total, divisor).sobra === 0;
const formacao = (total: number, divisor: number) => `${tentativaRetangulo(total, divisor).linhasCompletas}×${divisor}`;

/** F66 preserva ArrayGrid como superfície física; o palco só coordena pares, varredura e sobra. */
export function FatoresRetangulosStage({ spec, options, disabled, onAnswer }: Props): React.ReactElement {
  const [divisor, setDivisor] = useState(spec.divisorInicial);
  // A fábrica só conhece o que a criança fechou. Imprimir spec.pares aqui era
  // entregar o gabarito: em L1-L4 a alternativa correta se lia da lista.
  const [encontradas, setEncontradas] = useState<number[]>(() => fecha(spec.total, spec.divisorInicial) ? [spec.divisorInicial] : []);
  const tentativa = tentativaRetangulo(spec.total, divisor);
  const rows = Math.max(1, tentativa.linhasCompletas);

  const irPara = (proximo: number) => {
    if (disabled) return;
    const alvo = Math.max(1, Math.min(spec.total, proximo));
    setDivisor(alvo);
    if (fecha(spec.total, alvo)) setEncontradas(atual => atual.includes(alvo) ? atual : [...atual, alvo].sort((a, b) => a - b));
  };

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
      {/* Superfície de leitura: F66 não dá opções à grade, então ela não tem
          alvo próprio. Quem manipula é o controle de colunas abaixo. */}
      <ArrayGrid question={gridQuestion} onAnswer={() => undefined} disabled />
      {tentativa.sobra > 0 ? <div className="mt-4" data-f66-invalid-remainder="" aria-label={`${tentativa.sobra} quadradinhos de sobra`}>
        <p className="mb-2 text-center font-black text-rose-700">Não fechou: sobraram {tentativa.sobra}.</p>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: tentativa.sobra }, (_, index) => <span key={index} aria-hidden="true" className="h-8 w-8 rounded-md border-2 border-rose-500 bg-rose-100" />)}
        </div>
      </div> : <p className="mt-3 text-center font-black text-emerald-700" data-f66-complete-rectangle="">Retângulo completo: sem sobra.</p>}

      <div className="mt-4 flex items-center justify-center gap-3" aria-label="Colunas do retângulo">
        <button type="button" disabled={disabled || divisor <= 1} onClick={() => irPara(divisor - 1)}
          className="min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white text-2xl font-black text-indigo-900 disabled:opacity-50"
          data-f66-control="menos-colunas" aria-label="Uma coluna a menos">−</button>
        <p className="min-w-32 text-center text-lg font-black text-slate-800" aria-live="polite">{divisor} colunas</p>
        <button type="button" disabled={disabled || divisor >= spec.total} onClick={() => irPara(divisor + 1)}
          className="min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white text-2xl font-black text-indigo-900 disabled:opacity-50"
          data-f66-control="mais-colunas" aria-label="Uma coluna a mais">+</button>
      </div>
    </div>

    <p className="mt-4 text-center text-sm font-semibold text-slate-600" data-f66-pairs="" aria-live="polite">
      {encontradas.length
        ? `Formações que você fechou: ${encontradas.map(item => formacao(spec.total, item)).join(" · ")}`
        : "Nenhuma formação fechada ainda. Mude as colunas até não sobrar nenhum quadradinho."}
    </p>

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
