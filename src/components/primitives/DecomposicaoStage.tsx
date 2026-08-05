import React from "react";
import { Arranjo } from "./Arranjo";
import {
  AncoraSpec,
  DecomposicaoEscritaSpec,
  DecomposicaoSpec,
} from "../../curriculum/procedimentos/decomposicaoContract";

/**
 * A tela de N4.04 — ficha F43, "dobrar e dobrar de novo".
 *
 * O apoio aqui não é uma ilustração do resultado: é a **âncora**, o fato que a
 * criança já domina. Ela recebe `7 × 2 = 14` e precisa completar a estratégia
 * sozinha. Por isso o componente nunca vê o resultado — o contrato entrega o
 * passo final já cortado no "=".
 */

interface Props {
  spec: DecomposicaoSpec;
  onReplay?: () => void;
}

/** O arranjo do dobro. Contá-lo dá a âncora, não a resposta. */
function AncoraVisual({ ancora }: { ancora: AncoraSpec }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Arranjo linhas={ancora.linhas} colunas={ancora.colunas} descricao={ancora.descricao} />
      <p className="text-lg font-bold text-slate-600" aria-hidden="true">
        {ancora.linhas} × {ancora.colunas} = {ancora.valor}
      </p>
    </div>
  );
}

/** A âncora escrita e o passo em aberto. */
function Escrita({ escrita }: { escrita: DecomposicaoEscritaSpec }) {
  return (
    // `role="math"`: um `aria-label` em div sem papel é atributo ARIA proibido, e
    // o axe pega. O papel certo também melhora a leitura — leitores de tela
    // anunciam "expressão matemática" em vez de despejar o texto solto.
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

export function DecomposicaoStage({ spec, onReplay }: Props) {
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

      {spec.ancoraVisual && <AncoraVisual ancora={spec.ancoraVisual} />}
      {spec.escrita && <Escrita escrita={spec.escrita} />}
    </div>
  );
}
