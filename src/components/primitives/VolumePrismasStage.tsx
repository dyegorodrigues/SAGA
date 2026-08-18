import React, { useMemo, useState } from "react";
import type { AnswerMeta, Option, Question } from "../../types";
import {
  evidenciasVolumePrismasF94,
  type VolumePrismasF94Spec,
} from "../../curriculum/procedimentos/volumePrismasContract";
import { ArrayGrid } from "./ArrayGrid";
import { IsometricConstruction } from "./VolumeVistasStage";

interface Props {
  spec: VolumePrismasF94Spec;
  options: Option[];
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

function baseQuestion(spec: VolumePrismasF94Spec): Question {
  const activeCells: number[] = [];
  spec.baseCells.forEach((row, r) => row.forEach((cell, c) => {
    if (cell) activeCells.push(r * spec.baseCols + c);
  }));
  return {
    kind: "array",
    prompt: "",
    answer: "",
    uiProps: { rows: spec.baseRows, cols: spec.baseCols, activeCells, projectionMode: true },
    options: [],
    evaluate: () => false,
  };
}

function alturasPorCubos(spec: VolumePrismasF94Spec, quantidade: number): number[][] {
  let restantes = Math.max(0, Math.min(spec.volume, Math.floor(quantidade)));
  const alturas = spec.baseCells.map(row => row.map(() => 0));
  for (let camada = 0; camada < spec.altura; camada += 1) {
    for (let r = 0; r < spec.baseRows; r += 1) {
      for (let c = 0; c < spec.baseCols; c += 1) {
        if (!spec.baseCells[r]?.[c] || restantes <= 0) continue;
        alturas[r][c] += 1;
        restantes -= 1;
      }
    }
  }
  return alturas;
}

function alturasPorCamadas(spec: VolumePrismasF94Spec, camadas: number): number[][] {
  const quantidade = Math.max(0, Math.min(spec.altura, Math.floor(camadas)));
  return spec.baseCells.map(row => row.map(cell => cell ? quantidade : 0));
}

export function VolumePrismasStage({ spec, options, disabled = false, onAnswer }: Props): React.ReactElement {
  const [cubos, setCubos] = useState(spec.modo === "contar-cubos" ? 0 : spec.areaBase);
  const [camadas, setCamadas] = useState(spec.modo === "dimensao-faltante" ? 1 : 1);
  const [selecionado, setSelecionado] = useState<string>();

  const alturas = useMemo(() => spec.modo === "contar-cubos"
    ? alturasPorCubos(spec, cubos)
    : alturasPorCamadas(spec, camadas), [spec, cubos, camadas]);

  const responder = (valor: string) => {
    if (disabled) return;
    setSelecionado(valor);
    const option = options.find(item => String(item.value) === valor);
    const correta = valor === spec.resposta;
    const meta: AnswerMeta = {
      source: "array-grid",
      ...(correta ? { evidencias: evidenciasVolumePrismasF94(spec, true) } : option?.misconception ? { misconception: option.misconception } : {}),
    };
    onAnswer(valor, meta);
  };

  const podeAdicionarCubinho = spec.modo === "contar-cubos" && cubos < spec.volume;
  const podeAdicionarCamada = spec.modo !== "contar-cubos" && spec.modo !== "dimensao-faltante" && camadas < spec.altura;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5" data-f94-stage data-f94-mode={spec.modo}>
      <div className="w-full rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-4" data-mode-literacy="arraygrid-3d">
        <p className="text-center text-sm font-black text-indigo-900">Modo 3D: uma camada ocupa a base; camadas idênticas constroem a altura.</p>
        <IsometricConstruction alturas={alturas} orientacao="frente" />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-3" data-f94-base-grid>
          <p className="mb-2 text-center text-sm font-black text-slate-700">Uma camada da base</p>
          <ArrayGrid question={baseQuestion(spec)} onAnswer={() => {}} disabled />
        </div>
        <div className="flex flex-col justify-center rounded-2xl border-2 border-slate-200 bg-white p-4 text-center">
          {spec.modo === "contar-cubos" ? <>
            <p className="text-sm font-bold text-slate-600">Cubos colocados</p>
            <p className="text-3xl font-black text-slate-800" aria-live="polite">{cubos}</p>
            <button type="button" disabled={disabled || !podeAdicionarCubinho} onClick={() => setCubos(value => Math.min(spec.volume, value + 1))}
              className="mt-3 min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white px-4 font-black text-indigo-900 disabled:opacity-50" data-f94-control="adicionar-cubinho">
              Adicionar cubinho
            </button>
          </> : spec.modo === "dimensao-faltante" ? <>
            <p className="text-sm font-bold text-slate-600">A base está visível. Use o volume dado no enunciado para descobrir quantas camadas completam o prisma.</p>
            <p className="mt-2 text-sm font-black text-indigo-900">altura = volume ÷ área da base</p>
          </> : <>
            <p className="text-sm font-bold text-slate-600">Camadas construídas</p>
            <p className="text-3xl font-black text-slate-800" aria-live="polite">{camadas}</p>
            <button type="button" disabled={disabled || !podeAdicionarCamada} onClick={() => setCamadas(value => Math.min(spec.altura, value + 1))}
              className="mt-3 min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white px-4 font-black text-indigo-900 disabled:opacity-50" data-f94-control="adicionar-camada">
              Adicionar camada
            </button>
          </>}
        </div>
      </div>

      {spec.modo === "prisma-nao-retangular" ? <p className="w-full rounded-2xl bg-slate-50 p-3 text-center text-sm font-bold text-slate-700" data-f94-nonrect-note>
        A base não precisa ser retangular: se todas as camadas são idênticas, conte uma camada e repita pela altura.
      </p> : null}

      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Respostas para volume do prisma">
        {options.map(option => (
          <button key={String(option.value)} type="button" disabled={disabled} onClick={() => responder(String(option.value))}
            className={`min-h-20 min-w-20 rounded-2xl border-2 px-3 py-3 font-black ${selecionado === String(option.value) ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"} disabled:opacity-50`}>
            {option.label ?? String(option.value)}
          </button>
        ))}
      </div>
    </section>
  );
}
