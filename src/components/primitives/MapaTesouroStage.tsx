import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import type { MapaTesouroF60Spec } from "../../curriculum/procedimentos/mapaTesouroContract";
import { ShapeCanvas } from "./ShapeCanvas";

interface Props {
  spec: MapaTesouroF60Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

const cellValue = (coluna: number, linha: number) => coluna * 10 + linha;

export function MapaTesouroStage({ spec, disabled, onAnswer }: Props) {
  const [selecionado, setSelecionado] = useState<number | undefined>();
  const optionByValue = useMemo(() => new Map(spec.opcoes.map(option => [option.value, option])), [spec.opcoes]);
  const cells = useMemo(() => Array.from({ length: spec.gradeSize * spec.gradeSize }, (_, index) => ({ coluna: index % spec.gradeSize + 1, linha: Math.floor(index / spec.gradeSize) + 1 })), [spec.gradeSize]);

  const responder = (valor: number) => {
    if (disabled) return;
    setSelecionado(valor);
    const option = optionByValue.get(valor);
    const misconception = valor === spec.resposta ? undefined : option?.misconception;
    onAnswer(valor, misconception ? { misconception } : undefined);
  };

  const board = (
    <div className="absolute inset-0" data-f60-grid-size={spec.gradeSize}>
      <div className="absolute left-10 right-3 top-8 bottom-8 grid" style={{ gridTemplateColumns: `repeat(${spec.gradeSize}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${spec.gradeSize}, minmax(0, 1fr))` }}>
        {cells.map(cell => {
          const value = cellValue(cell.coluna, cell.linha);
          const alvo = cell.coluna === spec.alvoColuna && cell.linha === spec.alvoLinha;
          const selecionada = selecionado === value;
          const interactive = spec.modo === "colocar-objeto";
          return (
            <button
              key={`${cell.coluna}-${cell.linha}`}
              type="button"
              disabled={disabled || !interactive}
              aria-label={`coluna ${spec.colunas[cell.coluna - 1]}, linha ${spec.linhas[cell.linha - 1]}`}
              onClick={() => interactive && responder(value)}
              className={`relative min-h-10 border border-slate-300 bg-white/70 p-0 ${interactive ? "cursor-pointer" : "cursor-default"} ${selecionada ? "ring-4 ring-inset ring-violet-500" : ""}`}
              data-f60-cell={value}
            >
              {alvo && spec.modo !== "colocar-objeto" && <span aria-label="tesouro" className="absolute inset-0 flex items-center justify-center text-2xl">★</span>}
              {selecionada && spec.modo === "colocar-objeto" && <span aria-hidden className="absolute inset-0 flex items-center justify-center text-2xl">★</span>}
            </button>
          );
        })}
      </div>
      <div className="absolute left-10 right-3 top-1 grid text-center text-xs font-black text-slate-700" style={{ gridTemplateColumns: `repeat(${spec.gradeSize}, minmax(0, 1fr))` }}>
        {spec.colunas.map(coluna => <span key={coluna}>{coluna}</span>)}
      </div>
      <div className="absolute bottom-8 left-1 top-8 grid items-center text-center text-xs font-black text-slate-700" style={{ gridTemplateRows: `repeat(${spec.gradeSize}, minmax(0, 1fr))`, width: 32 }}>
        {spec.linhas.map(linha => <span key={linha}>{linha}</span>)}
      </div>
    </div>
  );

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 overflow-x-hidden" data-f60-stage data-f60-mode={spec.modo}>
      <p className="text-center text-sm font-bold text-slate-700">{spec.objetivo}</p>
      <div className="max-w-full overflow-hidden rounded-2xl">
        <ShapeCanvas cena={{ pecas: [], largura: 280, altura: 280 }} fundo={board} />
      </div>
      {spec.modo !== "colocar-objeto" && (
        <div className="grid w-full grid-cols-2 gap-3" aria-label="Respostas do mapa">
          {spec.opcoes.map(option => (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => responder(option.value)}
              className={`min-h-14 rounded-2xl border-2 px-3 py-2 font-black ${selecionado === option.value ? "border-violet-500 bg-violet-50 text-violet-900" : "border-slate-200 bg-white text-slate-800"} disabled:opacity-50`}
              data-f60-option={option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {spec.modo === "colocar-objeto" && <p className="text-center text-xs font-semibold text-slate-600">Toque na célula onde o tesouro deve ficar.</p>}
    </section>
  );
}
