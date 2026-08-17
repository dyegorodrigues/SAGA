import React, { useMemo, useState } from "react";
import type { AnswerMeta, Option, Question } from "../../types";
import type { PrimosDivisoresF70Spec } from "../../curriculum/procedimentos/primosDivisoresContract";
import { riscadosDoCrivo } from "../../curriculum/procedimentos/primosDivisoresContract";
import { tentativaRetangulo } from "../../curriculum/procedimentos/fatoresRetangulosProcedure";
import { ArrayGrid } from "./ArrayGrid";
import { Quadrado100 } from "./Quadrado100";

interface Props {
  spec: PrimosDivisoresF70Spec;
  options: Option[];
  disabled?: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

/** F70 coordena duas primitivas canônicas. Explorar divisor/crivo não conta como resposta nem misconception. */
export function PrimosDivisoresStage({ spec, options, disabled = false, onAnswer }: Props): React.ReactElement {
  const [divisor, setDivisor] = useState(spec.divisorInicial);
  const [basesAplicadas, setBasesAplicadas] = useState<number[]>([]);
  const tentativa = tentativaRetangulo(spec.total, divisor);
  const mostraArray = spec.modo === "divisores-retangulo" || spec.modo === "distinguir" || spec.modo === "identificar-primos";
  const mostraQuadro = spec.modo === "multiplos-quadro" || spec.modo === "distinguir" || spec.modo === "crivo-eratostenes";
  const riscados = useMemo(() => riscadosDoCrivo(basesAplicadas), [basesAplicadas]);

  const gridQuestion: Question = {
    kind: "array",
    prompt: "",
    answer: spec.total,
    uiProps: {
      rows: Math.max(1, tentativa.linhasCompletas),
      cols: divisor,
      allowRotate: false,
      requireRotate: false,
      areaMode: false,
      showEquation: true,
    },
    options: [],
    evaluate: () => true,
  };

  const aplicarCrivo = (base: number) => {
    if (disabled || basesAplicadas.includes(base)) return;
    const anterior = spec.crivoBases[spec.crivoBases.indexOf(base) - 1];
    if (anterior && !basesAplicadas.includes(anterior)) return;
    setBasesAplicadas(prev => [...prev, base]);
  };

  const responder = (option: Option) => {
    if (disabled) return;
    const value = Number(option.value);
    const source = spec.modo === "multiplos-quadro" || spec.modo === "crivo-eratostenes"
      ? "quadrado100"
      : spec.modo === "distinguir"
        ? "array-grid+quadrado100"
        : "array-grid";
    onAnswer(value, {
      source,
      evidencias: [`f70-${spec.modo}`],
      ...(option.misconception ? { misconception: option.misconception } : {}),
    });
  };

  return <section className="mx-auto w-full max-w-4xl px-2" data-primos-divisores-stage="" data-modo={spec.modo}>
    <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-center" data-mode-literacy={spec.modo}>
      {spec.modo === "multiplos-quadro" ? <p className="font-bold text-slate-700">Múltiplo é onde o salto chega. Observe o mesmo salto repetindo no quadro.</p> : null}
      {spec.modo === "divisores-retangulo" ? <p className="font-bold text-slate-700">Divisor é uma medida que fecha o retângulo sem sobra.</p> : null}
      {spec.modo === "distinguir" ? <p className="font-bold text-slate-700">Retângulo mostra quem cabe; quadro mostra onde os saltos chegam.</p> : null}
      {spec.modo === "identificar-primos" ? <p className="font-bold text-slate-700">Teste divisores. Lembre: 1 sempre divide, mas 1 não é primo.</p> : null}
      {spec.modo === "crivo-eratostenes" ? <p className="font-bold text-slate-700">Crivo: preserve o primo e risque seus múltiplos maiores. Depois vá ao próximo número não riscado.</p> : null}
    </div>

    {mostraQuadro ? <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-3" data-quadrado100-f70="">
      {spec.modo === "crivo-eratostenes" ? <div className="mb-3 flex flex-wrap justify-center gap-3" aria-label="Passos do Crivo de Eratóstenes">
        {spec.crivoBases.map(base => <button
          key={base}
          type="button"
          disabled={disabled || basesAplicadas.includes(base) || Boolean(spec.crivoBases[spec.crivoBases.indexOf(base) - 1] && !basesAplicadas.includes(spec.crivoBases[spec.crivoBases.indexOf(base) - 1]))}
          onClick={() => aplicarCrivo(base)}
          className="min-h-20 min-w-28 rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-4 py-3 font-black text-indigo-800 disabled:opacity-50"
          data-f70-motor-control="crivo"
        >Aplicar crivo do {base}</button>)}
      </div> : null}
      <Quadrado100
        highlightedNumbers={spec.modo === "crivo-eratostenes" ? [] : spec.quadroDestacados}
        crossedNumbers={spec.modo === "crivo-eratostenes" ? riscados : []}
        interactive={false}
      />
      {spec.modo === "crivo-eratostenes" ? <p className="mt-3 text-center text-sm font-semibold text-slate-600" aria-live="polite" data-sieve-f70="">Casas riscadas são múltiplos compostos; o primo usado no passo permanece visível.</p> : null}
    </div> : null}

    {mostraArray ? <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4" data-arraygrid-f70="">
      <p className="mb-3 text-center font-bold text-slate-700">Total: {spec.total}. Largura em teste: {divisor}.</p>
      <ArrayGrid question={gridQuestion} onAnswer={() => undefined} disabled />
      {tentativa.sobra > 0 ? <div className="mt-3" data-f70-remainder={tentativa.sobra} aria-label={`${tentativa.sobra} quadradinhos de sobra`}>
        <p className="text-center font-black text-rose-700">Ainda não fechou: sobraram {tentativa.sobra}.</p>
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
          {Array.from({ length: tentativa.sobra }, (_, index) => <span key={index} className="h-8 w-8 rounded-md border-2 border-rose-500 bg-rose-100" />)}
        </div>
      </div> : <p className="mt-3 text-center font-black text-emerald-700" data-f70-complete-rectangle="">Fecha sem sobra: esta largura é divisor.</p>}

      {spec.divisoresTeste.length ? <div className="mt-4 flex flex-wrap justify-center gap-3" aria-label="Testar larguras no retângulo">
        {spec.divisoresTeste.map(valor => <button
          key={valor}
          type="button"
          disabled={disabled}
          onClick={() => setDivisor(valor)}
          className="min-h-20 min-w-24 rounded-2xl border-2 border-slate-300 bg-white px-4 py-3 font-black text-slate-800 disabled:opacity-50"
          data-f70-motor-control="divisor"
        >Testar divisor {valor}</button>)}
      </div> : null}
    </div> : null}

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Alternativas de Primos e Divisores">
      {options.map((option, index) => <button
        key={`${String(option.value)}-${index}`}
        type="button"
        disabled={disabled}
        onClick={() => responder(option)}
        className="min-h-20 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-black text-slate-800 disabled:opacity-50"
        data-f70-option={String(option.value)}
      >{option.label ?? String(option.value)}</button>)}
    </div>
  </section>;
}