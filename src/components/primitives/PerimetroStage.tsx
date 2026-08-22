import React, { useState } from "react";
import type { AnswerMeta, Question } from "../../types";
import type { PerimetroF63Spec } from "../../curriculum/procedimentos/perimetroContract";
import { evidenciasPerimetro } from "../../curriculum/procedimentos/perimetroContract";
import { ArrayGrid } from "./ArrayGrid";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: PerimetroF63Spec;
  disabled: boolean;
  onAnswer: (value: number, meta?: AnswerMeta) => void;
}

export function PerimetroStage({ spec, disabled, onAnswer }: Props) {
  const [indisponiveis, setIndisponiveis] = useState<Set<number>>(new Set());
  const gridQuestion = {
    kind: "area",
    prompt: "",
    uiProps: {
      rows: spec.altura,
      cols: spec.largura,
      allowRotate: false,
      requireRotate: false,
      areaMode: true,
      showEquation: false,
    },
    evaluate: () => false,
  } as unknown as Question;

  const responder = (value: number, misconception?: string) => {
    if (disabled || indisponiveis.has(value)) return;
    const correta = value === spec.resposta;
    if (!correta) setIndisponiveis(current => new Set(current).add(value));
    onAnswer(value, { misconception, evidencias: evidenciasPerimetro(spec.nivel, correta) });
  };

  const larguraPx = Math.min(180, spec.largura * 32);
  const alturaPx = Math.min(128, spec.altura * 32);
  const ladosVisiveis = spec.nivel === 5
    ? spec.lados.map((lado, index) => index === spec.lados.length - 1 ? "?" : String(lado))
    : spec.lados.map(String);

  return <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5" data-f63-stage data-mode={spec.modo}>
    <section className="grid w-full gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4 md:grid-cols-2">
      <div className="flex flex-col items-center gap-2" data-f63-grid>
        <p className="text-center text-sm font-bold text-emerald-900">O chão fica dentro; o perímetro acompanha somente a borda.</p>
        <div className="overflow-x-auto"><ArrayGrid question={gridQuestion} onAnswer={() => undefined} disabled /></div>
        {spec.nivel === 4 && <p className="text-sm font-black text-slate-700">Área: {spec.area} quadradinhos. Isso não é a volta.</p>}
      </div>
      <div className="flex flex-col items-center gap-2" data-f63-outline>
        <p className="text-center text-sm font-bold text-indigo-900">Dê uma volta completa e conte cada trecho uma vez.</p>
        {spec.modo === "figura-irregular"
          ? <svg viewBox="0 0 180 140" width="180" height="140" role="img" aria-label="Figura irregular na malha com a borda destacada">
              <path d="M20 20 H140 V70 H110 V100 H20 Z" fill="rgba(99,102,241,.12)" stroke="currentColor" strokeWidth="7" strokeLinejoin="round" className="text-indigo-600" />
              <path d="M20 20 H140 M140 20 V70 M140 70 H110 M110 70 V100 M110 100 H20 M20 100 V20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" className="text-emerald-700" />
            </svg>
          : <ShapeCanvas cena={{
              largura: 220,
              altura: 150,
              pecas: [{ forma: "rectangle", x: 110, y: 75, largura: larguraPx, altura: alturaPx, cor: "#4f46e5", contorno: true }],
            }} />}
        <div className="flex flex-wrap justify-center gap-2" aria-label="Comprimentos dos lados">
          {ladosVisiveis.map((lado, index) => <span key={`${index}-${lado}`} className="rounded-full bg-white px-3 py-1 text-base font-black text-slate-800 shadow-sm">lado {index + 1}: {lado}</span>)}
        </div>
        {spec.nivel === 5 && <p className="text-center text-sm font-black text-indigo-800">Perímetro total: {spec.perimetro}. Descubra o trecho que falta.</p>}
      </div>
    </section>

    <div className="grid w-full grid-cols-2 gap-3" aria-label="Alternativas do perímetro">
      {spec.opcoes.map(option => <button
        key={option.value}
        type="button"
        data-f63-option={option.value}
        disabled={disabled || indisponiveis.has(option.value)}
        onClick={() => responder(option.value, option.misconception)}
        className="min-h-16 rounded-2xl border-2 border-emerald-200 bg-white px-3 text-xl font-black text-slate-800 disabled:opacity-35"
      >{option.label}</button>)}
    </div>
  </div>;
}
