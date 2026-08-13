import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import { FiguraDesenhada } from "./ShapeCanvas";
import {
  DetetiveFormasEvidence,
  DetetiveFormasMisconception,
  type DetetiveFormasEixo,
  type DetetiveFormasF58Spec,
} from "../../curriculum/procedimentos/detetiveFormasContract";

interface DetetiveFormasStageProps {
  spec: DetetiveFormasF58Spec;
  onAnswer: (value: string, meta?: AnswerMeta) => void;
  disabled?: boolean;
  mostrar?: unknown;
}

const ANGULO_POR_EIXO: Record<DetetiveFormasEixo, number> = {
  vertical: 0,
  diagonal: 45,
  horizontal: 90,
  "diagonal-oposta": 135,
};

const EIXO_POR_ANGULO: Record<number, DetetiveFormasEixo> = {
  0: "vertical",
  45: "diagonal",
  90: "horizontal",
  135: "diagonal-oposta",
};

const canonicalSelection = (ids: string[]) => [...ids].sort().join("|");

function ShapePreview({ spec, axisAngle }: { spec: DetetiveFormasF58Spec; axisAngle?: number }) {
  return (
    <div className="relative flex h-56 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50" data-f58-shape>
      <FiguraDesenhada figura={spec.figura} giro={spec.giro} tamanho={132} cor="#38BDF8" />
      {typeof axisAngle === "number" && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[190px] w-1 origin-center -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500"
            style={{ transform: `translate(-50%, -50%) rotate(${axisAngle}deg)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 opacity-20"
            style={{ transform: `translate(-50%, -50%) rotate(${axisAngle * 2}deg) scaleX(-1)` }}
          >
            <FiguraDesenhada figura={spec.figura} giro={spec.giro} tamanho={132} cor="#8B5CF6" />
          </div>
        </>
      )}
    </div>
  );
}

function AttributeMode({ spec, onAnswer, disabled }: DetetiveFormasStageProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const afirmacoes = spec.afirmacoes ?? [];

  const toggle = (id: string) => {
    if (disabled) return;
    setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
    setFeedback("");
  };

  const submit = () => {
    if (disabled) return;
    const value = canonicalSelection(selected);
    const correto = value === spec.resposta;
    const misconception = correto
      ? undefined
      : spec.nivel === 1
        ? DetetiveFormasMisconception.CONTA_ERRADO_LADOS
        : spec.nivel === 2
          ? DetetiveFormasMisconception.CONFUNDE_LADO_CANTO
          : undefined;
    setFeedback(correto ? "Isso! Você descreveu a forma pelas propriedades." : "Confira a figura e tente novamente.");
    onAnswer(value, misconception ? { misconception } : undefined);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <ShapePreview spec={spec} />
      <div className="grid w-full max-w-xl gap-3" role="group" aria-label="Afirmações sobre a forma">
        {afirmacoes.map(afirmacao => {
          const active = selected.includes(afirmacao.id);
          return (
            <button
              key={afirmacao.id}
              type="button"
              aria-pressed={active}
              disabled={disabled}
              data-f58-option={afirmacao.id}
              data-f58-correct={afirmacao.correta ? "true" : "false"}
              onClick={() => toggle(afirmacao.id)}
              className={`min-h-12 rounded-xl border-2 px-4 py-3 text-left text-base font-bold transition ${active ? "border-violet-500 bg-violet-50 text-violet-900" : "border-slate-200 bg-white text-slate-700"}`}
            >
              <span aria-hidden className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded border-2 border-current">{active ? "✓" : ""}</span>
              {afirmacao.texto}
            </button>
          );
        })}
      </div>
      <button type="button" disabled={disabled} onClick={submit} data-f58-submit className="min-h-12 min-w-36 rounded-xl bg-violet-600 px-6 py-3 font-black text-white disabled:opacity-50">
        Conferir
      </button>
      <p aria-live="polite" className="min-h-6 text-center font-semibold text-slate-700">{feedback}</p>
    </div>
  );
}

function SymmetryAxisMode({ spec, onAnswer, disabled }: DetetiveFormasStageProps) {
  const [angle, setAngle] = useState(0);
  const [feedback, setFeedback] = useState("");
  const selectedAxis = EIXO_POR_ANGULO[angle] ?? "vertical";
  const correctAngle = spec.eixoCorreto ? ANGULO_POR_EIXO[spec.eixoCorreto] : 0;

  const fold = () => {
    if (disabled || !spec.eixoCorreto) return;
    const correto = selectedAxis === spec.eixoCorreto;
    const misconception = correto
      ? undefined
      : selectedAxis === "vertical" && spec.eixoCorreto !== "vertical"
        ? DetetiveFormasMisconception.SO_EIXO_VERTICAL
        : DetetiveFormasMisconception.EIXO_ERRADO;
    setFeedback(correto ? "As duas metades coincidem!" : "A dobra não coincide. Ajuste o eixo.");
    onAnswer(selectedAxis, correto
      ? { evidencias: [DetetiveFormasEvidence.SIMETRIA_NIVEL_4] }
      : { misconception });
  };

  return (
    <div className="flex w-full flex-col items-center gap-5" data-f58-correct-angle={correctAngle}>
      <ShapePreview spec={spec} axisAngle={angle} />
      <label className="w-full max-w-sm font-bold text-slate-700">
        Arraste o eixo de simetria
        <input
          className="mt-3 w-full"
          type="range"
          min={0}
          max={135}
          step={45}
          value={angle}
          disabled={disabled}
          aria-label="Ângulo do eixo de simetria"
          onChange={event => { setAngle(Number(event.target.value)); setFeedback(""); }}
        />
      </label>
      <div className="text-sm font-semibold text-slate-600" aria-live="polite">Eixo escolhido: {selectedAxis}</div>
      <button type="button" disabled={disabled} onClick={fold} data-f58-fold className="min-h-12 min-w-36 rounded-xl bg-violet-600 px-6 py-3 font-black text-white disabled:opacity-50">
        Dobrar
      </button>
      <p aria-live="polite" className="min-h-6 text-center font-semibold text-slate-700">{feedback}</p>
    </div>
  );
}

function SymmetryCompleteMode({ spec, onAnswer, disabled }: DetetiveFormasStageProps) {
  const [feedback, setFeedback] = useState("");
  const pointsByCell = useMemo(() => new Map((spec.pontos ?? []).map(point => [`${point.x}:${point.y}`, point])), [spec.pontos]);
  const cells = Array.from({ length: 35 }, (_, index) => ({ x: index % 7, y: Math.floor(index / 7) }));

  const choose = (id: string) => {
    if (disabled) return;
    const correto = id === spec.resposta;
    setFeedback(correto ? "Perfeito! O ponto completou o reflexo." : "Esse ponto não fica à mesma distância da dobra.");
    onAnswer(id, correto ? undefined : { misconception: DetetiveFormasMisconception.EIXO_ERRADO });
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="grid w-full max-w-sm grid-cols-7 overflow-hidden rounded-2xl border-2 border-slate-300 bg-white" aria-label="Grade de simetria" data-f58-grid>
        {cells.map(cell => {
          const point = pointsByCell.get(`${cell.x}:${cell.y}`);
          const candidate = Boolean(point?.id.startsWith("candidato"));
          return (
            <div key={`${cell.x}:${cell.y}`} className={`relative flex aspect-square items-center justify-center border-b border-r border-slate-200 ${cell.x === spec.eixoGrade ? "border-l-4 border-l-violet-500" : ""}`}>
              {point && (candidate ? (
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Completar simetria no ponto ${point.x}, ${point.y}`}
                  data-f58-point={point.id}
                  data-f58-correct={point.resposta ? "true" : "false"}
                  onClick={() => choose(point.id)}
                  className="h-11 w-11 rounded-full border-2 border-dashed border-violet-400 bg-violet-50 disabled:opacity-50"
                />
              ) : (
                <span aria-hidden className={`h-5 w-5 rounded-full ${point.origem ? "bg-sky-500" : "bg-violet-500"}`} />
              ))}
            </div>
          );
        })}
      </div>
      <p className="max-w-md text-center text-sm font-semibold text-slate-600">A linha roxa é a dobra. Toque onde deve aparecer o ponto que falta.</p>
      <p aria-live="polite" className="min-h-6 text-center font-semibold text-slate-700">{feedback}</p>
    </div>
  );
}

export function DetetiveFormasStage(props: DetetiveFormasStageProps) {
  const { spec } = props;
  return (
    <section
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 overflow-hidden rounded-3xl bg-white p-4 sm:p-6"
      data-f58-stage
      data-f58-mode={spec.modo}
      data-f58-answer={spec.resposta}
      aria-label={`Detetive de Formas, nível ${spec.nivel}`}
    >
      {spec.modo.startsWith("atributos-") && <AttributeMode {...props} />}
      {spec.modo === "simetria-eixo" && <SymmetryAxisMode {...props} />}
      {spec.modo === "simetria-completar" && <SymmetryCompleteMode {...props} />}
    </section>
  );
}
