import React from "react";
import { Arranjo } from "./Arranjo";
import {
  AncoraSpec,
  AncoraVisualSpec,
  EstrategiaEscritaSpec,
} from "../../curriculum/procedimentos/ancoraContract";

/**
 * A tela de N4.07 — ficha F44, "as difíceis, com estratégia viram poucas".
 *
 * O apoio é o fato FÁCIL, com a parte que sai destacada. Em 7×9 aparece o
 * arranjo de 7×10 com a última coluna em outra cor: é ela que será removida.
 * Sem esse destaque, mostrar 70 quadradinhos numa pergunta de 7×9 confundiria.
 *
 * O componente nunca recebe o resultado — o contrato corta o ajuste no "=".
 */

interface Props {
  spec: AncoraSpec;
  onReplay?: () => void;
}

function Visual({ visual }: { visual: AncoraVisualSpec }) {
  return (
    <Arranjo
      linhas={visual.linhas}
      colunas={visual.colunas}
      descricao={visual.descricao}
      colunasQueSaem={visual.colunasQueSaem}
    />
  );
}

function Escrita({ escrita }: { escrita: EstrategiaEscritaSpec }) {
  return (
    <div
      role="math"
      className="flex flex-col items-center gap-1"
      aria-label={`Você já sabe: ${escrita.ancora}. Agora complete: ${escrita.emAberto}`}
    >
      <p className="text-2xl font-bold text-slate-500" aria-hidden="true">{escrita.ancora}</p>
      <p className="text-3xl font-black text-indigo-700" aria-hidden="true">{escrita.emAberto}</p>
    </div>
  );
}

export function AncoraStage({ spec, onReplay }: Props) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <p className="text-4xl font-black text-slate-800" aria-label={spec.falado}>
          {spec.pergunta}
        </p>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Ouvir a conta de novo"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-50 text-2xl"
          >
            🔊
          </button>
        )}
      </div>

      {spec.visual && <Visual visual={spec.visual} />}
      {spec.escrita && <Escrita escrita={spec.escrita} />}
    </div>
  );
}
