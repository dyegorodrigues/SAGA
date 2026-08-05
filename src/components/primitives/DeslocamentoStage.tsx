import React from "react";
import { MaterialDourado } from "./MaterialDourado";
import { PromocaoDeOrdem } from "./PromocaoDeOrdem";
import { OPERACAO } from "../../styles/coresDeOperacao";
import { DeslocamentoSpec, MaterialSpec } from "../../curriculum/procedimentos/deslocamentoContract";

/**
 * A tela de N4.08 — ficha F67, "multiplicar por dez desloca uma ordem".
 *
 * O material mostra o número de PARTIDA. A criança vê de onde as peças saem e
 * precisa imaginar para onde sobem — que é a competência. Mostrar o material do
 * resultado entregaria a resposta em peças.
 */

interface Props {
  spec: DeslocamentoSpec;
  onReplay?: () => void;
  /**
   * O que o passo atual da micro-aula manda mostrar.
   *
   * Vem do `tutShow` do GameLoop, que é alimentado pela coreografia declarada
   * na ficha. Sem este fio ligado, declarar coreografia não produz nada — foi
   * exatamente o que aconteceu nas seis primeiras competências que construí.
   */
  mostrar?: { promoverOrdens?: boolean } | null;
}

function Material({ material }: { material: MaterialSpec }) {
  return (
    <div role="img" aria-label={`Material de partida: ${material.descricao}`}>
      <MaterialDourado
        unidades={material.unidades}
        dezenas={material.dezenas}
        centenas={material.centenas}
        compact
      />
    </div>
  );
}

export function DeslocamentoStage({ spec, onReplay, mostrar }: Props) {
  const { cor } = OPERACAO.multiplicacao;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <p className="text-4xl font-black" style={{ color: cor }} aria-label={spec.falado}>
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

      {/* Durante a micro-aula, a demonstração da promoção SUBSTITUI o material:
          duas coisas ao mesmo tempo dividiriam a atenção justamente no momento
          em que a criança precisa olhar para uma. */}
      {mostrar?.promoverOrdens
        ? <PromocaoDeOrdem ordens={spec.ordensDeslocadas} />
        : spec.material && <Material material={spec.material} />}

      {spec.promocao && (
        <p className="max-w-[320px] text-center text-sm font-bold text-slate-500">
          {spec.promocao}
        </p>
      )}
    </div>
  );
}
