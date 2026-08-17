import React, { useMemo, useState } from "react";
import type { AnswerMeta, Question } from "../../types";
import type { VolumeVista, VolumeVistaGrid, VolumeVistasF92Spec } from "../../curriculum/procedimentos/volumeVistasContract";
import { VolumeVistasMisconception } from "../../curriculum/procedimentos/volumeVistasContract";
import { ArrayGrid } from "./ArrayGrid";

interface Props {
  spec: VolumeVistasF92Spec;
  disabled?: boolean;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

const vistas: VolumeVista[] = ["frente", "lado", "cima"];
const nomes: Record<VolumeVista, string> = { frente: "frente", lado: "lado", cima: "cima" };

function projectionQuestion(grid: VolumeVistaGrid): Question {
  return {
    kind: "array",
    prompt: "",
    answer: "",
    uiProps: { rows: grid.rows, cols: grid.cols, activeCells: grid.activeCells, projectionMode: true },
    options: [],
    evaluate: () => false,
  };
}

function VistaArrayGrid({ grid, label }: { grid: VolumeVistaGrid; label: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white p-3" data-f92-view={label}>
      <span className="text-sm font-black text-slate-700">{label}</span>
      <ArrayGrid question={projectionQuestion(grid)} onAnswer={() => {}} disabled />
    </div>
  );
}

function IsometricConstruction({ alturas, orientacao }: { alturas: number[][]; orientacao: VolumeVista }) {
  const cubes = useMemo(() => {
    const result: Array<{ x: number; y: number; z: number }> = [];
    alturas.forEach((row, y) => row.forEach((height, x) => {
      for (let z = 0; z < height; z += 1) result.push({ x, y, z });
    }));
    return result;
  }, [alturas]);
  const transform = orientacao === "frente" ? "rotate(0 110 90)" : orientacao === "lado" ? "rotate(12 110 90)" : "rotate(-12 110 90)";
  return (
    <svg viewBox="0 0 220 180" role="img" aria-label={`Construção tridimensional vista de ${nomes[orientacao]}`} className="h-48 w-full max-w-sm text-indigo-600" data-f92-3d data-f92-orientation={orientacao}>
      <g transform={transform}>
        {cubes.map(({ x, y, z }) => {
          const cx = 110 + (x - y) * 28;
          const cy = 132 + (x + y) * 14 - z * 28;
          return (
            <g key={`${x}-${y}-${z}`} transform={`translate(${cx} ${cy})`}>
              <polygon points="0,-14 24,-2 0,10 -24,-2" fill="currentColor" opacity="0.88" />
              <polygon points="-24,-2 0,10 0,38 -24,26" fill="currentColor" opacity="0.62" />
              <polygon points="24,-2 0,10 0,38 24,26" fill="currentColor" opacity="0.76" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function sameHeights(a: number[][], b: number[][]) {
  return a.length === b.length && a.every((row, r) => row.length === b[r]?.length && row.every((value, c) => value === b[r][c]));
}

function transpose(alturas: number[][]) {
  const width = Math.max(...alturas.map(row => row.length));
  return Array.from({ length: width }, (_, col) => alturas.map(row => row[col] ?? 0));
}

function activeKey(grid: VolumeVistaGrid, activeCells: Set<number>) {
  return `${grid.rows}x${grid.cols}:${[...activeCells].sort((a, b) => a - b).join(".")}`;
}

export function VolumeVistasStage({ spec, disabled = false, onAnswer }: Props) {
  const [orientacao, setOrientacao] = useState<VolumeVista>(spec.orientacaoInicial);
  const [selecionado, setSelecionado] = useState<string>();
  const [draft, setDraft] = useState<number[][]>(() => spec.alturas.map(row => row.map(() => 0)));
  const [desenhos, setDesenhos] = useState<Record<VolumeVista, Set<number>>>(() => ({ frente: new Set(), lado: new Set(), cima: new Set() }));

  const responder = (valor: string) => {
    if (disabled) return;
    setSelecionado(valor);
    const option = spec.opcoes.find(item => item.value === valor);
    const misconception = valor === spec.resposta ? undefined : option?.misconception;
    onAnswer(valor, misconception ? { misconception } : undefined);
  };

  const conferirReconstrucao = () => {
    const correto = sameHeights(draft, spec.alturas);
    const girado = sameHeights(draft, transpose(spec.alturas));
    const valor = correto ? spec.resposta : girado ? "reconstruir:2-1-1-0" : "reconstruir:1-1-0-1";
    const misconception = correto ? undefined : girado ? VolumeVistasMisconception.VISTA_TROCADA : VolumeVistasMisconception.SEM_ROTACAO_MENTAL;
    onAnswer(valor, correto ? { evidencias: ["reconstrucao-f92"], source: "array-grid" } : { misconception, source: "array-grid" });
  };

  const conferirDesenhos = () => {
    const keys = vistas.map(vista => activeKey(spec.vistas[vista], desenhos[vista]));
    const esperado = vistas.map(vista => activeKey(spec.vistas[vista], new Set(spec.vistas[vista].activeCells)));
    const correto = keys.every((value, index) => value === esperado[index]);
    const trocou = keys[0] === esperado[1] && keys[1] === esperado[0] && keys[2] === esperado[2];
    const valor = correto ? spec.resposta : trocou ? spec.opcoes[1].value : spec.opcoes[2].value;
    onAnswer(valor, correto ? { evidencias: ["desenho-tres-vistas-f92"], source: "array-grid" } : { misconception: trocou ? VolumeVistasMisconception.VISTA_TROCADA : VolumeVistasMisconception.SEM_ROTACAO_MENTAL, source: "array-grid" });
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5" data-f92-stage data-f92-mode={spec.modo}>
      <div className="w-full rounded-3xl border-2 border-indigo-200 bg-indigo-50 p-4" data-mode-literacy="arraygrid-3d">
        <p className="text-center text-sm font-black text-indigo-900">Modo 3D: a mesma grade agora tem altura. Gire para ler frente, lado e cima.</p>
        <IsometricConstruction alturas={spec.modo === "reconstruir-vistas" ? draft : spec.alturas} orientacao={orientacao} />
        <div className="grid grid-cols-3 gap-2" aria-label="Girar a construção por toque">
          {vistas.map(vista => (
            <button key={vista} type="button" disabled={disabled} onClick={() => setOrientacao(vista)}
              className={`min-h-20 rounded-2xl border-2 px-2 font-black ${orientacao === vista ? "border-indigo-600 bg-white text-indigo-900" : "border-indigo-200 bg-indigo-100 text-indigo-800"} disabled:opacity-50`}>
              {vista === "frente" ? "Frente" : vista === "lado" ? "Lado" : "Cima"}
            </button>
          ))}
        </div>
      </div>

      {spec.modo !== "reconstruir-vistas" && spec.modo !== "desenhar-vistas" && (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Projeções em ArrayGrid">
          {vistas.map((vista, index) => <VistaArrayGrid key={vista} grid={spec.vistas[vista]} label={spec.modo === "vista-frontal" ? `Vista ${String.fromCharCode(65 + index)}` : nomes[vista]} />)}
        </div>
      )}

      {spec.modo === "reconstruir-vistas" && (
        <div className="flex w-full flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Três vistas-alvo para reconstrução">
            {vistas.map(vista => <VistaArrayGrid key={vista} grid={spec.vistas[vista]} label={nomes[vista]} />)}
          </div>
          <p className="text-center text-sm font-bold text-slate-700">Toque em cada posição para empilhar cubos. Cada toque acrescenta um cubo e volta a zero depois da altura máxima.</p>
          <div className="mx-auto grid gap-3" style={{ gridTemplateColumns: `repeat(${spec.alturas[0].length}, minmax(80px, 1fr))` }} aria-label="Base para reconstruir por toque">
            {draft.flatMap((row, r) => row.map((height, c) => (
              <button key={`${r}-${c}`} type="button" disabled={disabled} onClick={() => setDraft(current => current.map((line, rr) => line.map((value, cc) => rr === r && cc === c ? (value + 1) % 4 : value)))}
                className="min-h-20 min-w-20 rounded-2xl border-2 border-indigo-300 bg-white text-xl font-black text-indigo-900 disabled:opacity-50" aria-label={`posição ${r + 1}, ${c + 1}: ${height} cubos`}>
                {height}
              </button>
            )))}
          </div>
          <button type="button" disabled={disabled} onClick={conferirReconstrucao} className="min-h-20 rounded-2xl bg-indigo-700 px-6 font-black text-white disabled:opacity-50">Conferir reconstrução</button>
        </div>
      )}

      {spec.modo === "desenhar-vistas" && (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Desenhar as três vistas por toque">
          {vistas.map(vista => {
            const grid = spec.vistas[vista];
            const active = desenhos[vista];
            return (
              <div key={vista} className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white p-3">
                <span className="font-black text-slate-800">{nomes[vista]}</span>
                <ArrayGrid question={projectionQuestion({ ...grid, activeCells: [...active] })} onAnswer={() => {}} disabled />
                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grid.cols}, 80px)` }}>
                  {Array.from({ length: grid.rows * grid.cols }, (_, index) => (
                    <button key={index} type="button" disabled={disabled} aria-pressed={active.has(index)}
                      onClick={() => setDesenhos(current => {
                        const next = new Set(current[vista]);
                        if (next.has(index)) next.delete(index); else next.add(index);
                        return { ...current, [vista]: next };
                      })}
                      className={`h-20 w-20 rounded-2xl border-2 font-black ${active.has(index) ? "border-indigo-600 bg-indigo-100 text-indigo-900" : "border-slate-300 bg-white text-slate-600"} disabled:opacity-50`}>
                      {active.has(index) ? "●" : "○"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <button type="button" disabled={disabled} onClick={conferirDesenhos} className="min-h-20 rounded-2xl bg-indigo-700 px-6 font-black text-white disabled:opacity-50 sm:col-span-3">Conferir três vistas</button>
        </div>
      )}

      {spec.modo !== "reconstruir-vistas" && spec.modo !== "desenhar-vistas" && (
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Respostas de volume e vistas">
          {spec.opcoes.map(option => (
            <button key={option.value} type="button" disabled={disabled} onClick={() => responder(option.value)}
              className={`min-h-20 min-w-20 rounded-2xl border-2 px-3 py-3 font-black ${selecionado === option.value ? "border-indigo-600 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"} disabled:opacity-50`}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
