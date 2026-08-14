import React from "react";
import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { AnswerMeta, MasteryRule, Option, Question } from "../../types";
import type { FichaCompetencia } from "../schema";
import { ArrayGrid } from "../../components/primitives/ArrayGrid";
import { InteractiveVertical } from "../../components/primitives/InteractiveVertical";

export const DivisaoLongaMisconception = {
  ZERO_PULADO: "zero-pulado-no-quociente",
  ORDEM_INVERTIDA: "ordem-invertida-na-divisao",
  RESTO_INVALIDO: "resto-maior-ou-igual-divisor",
  NAO_BAIXOU: "nao-baixou-proximo-algarismo",
} as const;
export type DivisaoLongaMisconceptionTag = typeof DivisaoLongaMisconception[keyof typeof DivisaoLongaMisconception];
export type DivisaoLongaModo = "arranjo-exata" | "arranjo-resto" | "ponte-algoritmo" | "algoritmo" | "zero-quociente";

export interface DivisaoLongaF69Spec {
  nivel: number;
  modo: DivisaoLongaModo;
  dividendo: number;
  divisor: number;
  quociente: number;
  resto: number;
  resposta: string;
  opcoes: Array<{ value: string; label: string; misconception?: DivisaoLongaMisconceptionTag }>;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function resposta(q: number, r: number) { return r ? `${q} r ${r}` : String(q); }
function opções(spec: Omit<DivisaoLongaF69Spec, "opcoes">): DivisaoLongaF69Spec["opcoes"] {
  const certa = spec.resposta;
  const candidatas = [certa, resposta(spec.quociente + 1, spec.resto), resposta(Math.max(1, spec.quociente - 1), spec.resto), resposta(spec.quociente, spec.divisor)];
  return [...new Set(candidatas)].slice(0, 4).map(value => ({ value, label: value, ...(value === certa ? {} : { misconception: spec.nivel === 5 ? DivisaoLongaMisconception.ZERO_PULADO : spec.resto ? DivisaoLongaMisconception.RESTO_INVALIDO : DivisaoLongaMisconception.ORDEM_INVERTIDA }) }));
}

export function construirDivisaoLongaSpec(level: number): DivisaoLongaF69Spec {
  const nivel = clamp(level);
  const casos = [
    { modo: "arranjo-exata" as const, dividendo: 24, divisor: 4 },
    { modo: "arranjo-resto" as const, dividendo: 29, divisor: 4 },
    { modo: "ponte-algoritmo" as const, dividendo: 84, divisor: 4 },
    { modo: "algoritmo" as const, dividendo: 156, divisor: 3 },
    { modo: "zero-quociente" as const, dividendo: 612, divisor: 6 },
  ];
  const c = casos[nivel - 1];
  const quociente = Math.floor(c.dividendo / c.divisor);
  const resto = c.dividendo % c.divisor;
  const base = { nivel, ...c, quociente, resto, resposta: resposta(quociente, resto) };
  return { ...base, opcoes: opções(base) };
}

interface Show { dividendo: number; divisor: number; quociente?: number; resto?: number; }
export function construirDivisaoLongaResolucao(spec: DivisaoLongaF69Spec): ResolucaoDeclarativa<Show, string, DivisaoLongaMisconceptionTag> {
  return {
    estadoInicial: { dividendo: spec.dividendo, divisor: spec.divisor },
    passos: [
      { id: "formar-grupos", say: `Veja quantos grupos de ${spec.divisor} cabem no número atual.`, show: { dividendo: spec.dividendo, divisor: spec.divisor }, corrige: [DivisaoLongaMisconception.ORDEM_INVERTIDA], parcial: "grupos" },
      { id: "quociente-e-resto", say: `O quociente é ${spec.quociente}${spec.resto ? ` e sobram ${spec.resto}` : ""}. O resto precisa ser menor que o divisor.`, show: { dividendo: spec.dividendo, divisor: spec.divisor, quociente: spec.quociente, resto: spec.resto }, corrige: [DivisaoLongaMisconception.RESTO_INVALIDO, DivisaoLongaMisconception.NAO_BAIXOU, DivisaoLongaMisconception.ZERO_PULADO], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(m => m.id === id);
  if (!micro) throw new Error(`N4.10 sem micro L${nivel}`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirDivisaoLongaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N4.10") throw new Error(`divisaoLongaContract recebeu ${ficha.id}`);
  const spec = construirDivisaoLongaSpec(level);
  const prompt = `Resolva ${spec.dividendo} ÷ ${spec.divisor}.`;
  const options: Option[] = spec.opcoes;
  return { kind: "divisao-longa-f69", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, resolucao: construirDivisaoLongaResolucao(spec), masteryRule: mastery(ficha, spec.nivel), exigeEvidencia: "divisao-zero-quociente-nivel-5", uiProps: spec, options, answer: spec.resposta, evaluate: a => String(a) === spec.resposta };
}

interface StageProps { spec: DivisaoLongaF69Spec; disabled?: boolean; onAnswer: (valor: string, meta?: AnswerMeta) => void; }
export function DivisaoLongaStage({ spec, disabled, onAnswer }: StageProps) {
  const Grid = ArrayGrid as React.ComponentType<any>;
  const Vertical = InteractiveVertical as React.ComponentType<any>;
  const responder = (o: DivisaoLongaF69Spec["opcoes"][number]) => {
    const correta = o.value === spec.resposta;
    onAnswer(o.value, { ...(o.misconception && !correta ? { misconception: o.misconception } : {}), ...(spec.nivel === 5 && correta ? { evidencias: ["divisao-zero-quociente-nivel-5"] } : {}) });
  };
  const qGrid: any = { kind: "array", a: spec.divisor, b: Math.max(1, Math.min(12, spec.quociente)), uiProps: { rows: spec.divisor, cols: Math.max(1, Math.min(12, spec.quociente)) }, answer: spec.dividendo };
  const qVertical: any = { kind: "vertical", a: spec.dividendo, b: spec.divisor, op: "÷", uiProps: { operacao: "divisao" }, answer: spec.quociente };
  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f69-stage data-f69-level={spec.nivel} data-f69-mode={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white px-3 py-5 shadow-sm sm:px-6">
      {spec.nivel <= 3 && <div data-f69-array className="mb-4 overflow-hidden rounded-2xl border border-slate-200"><Grid q={qGrid} question={qGrid} disabled={true} onAnswer={() => {}} /></div>}
      <div data-f69-vertical className="mb-4 overflow-hidden rounded-2xl border border-slate-200"><Vertical q={qVertical} question={qVertical} disabled={true} onAnswer={() => {}} /></div>
      <div className="mb-4 text-center font-black text-slate-700">{spec.dividendo} ÷ {spec.divisor}{spec.resto ? ` · resto menor que ${spec.divisor}` : ""}</div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{spec.opcoes.map(o => <button key={o.value} type="button" data-f69-option={o.value} disabled={disabled} onClick={() => responder(o)} className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 font-black">{o.label}</button>)}</div>
    </div>
  </section>;
}
