import React from "react";
import type { AnswerMeta } from "../../types";
import type { CentenaF37Spec } from "../../curriculum/procedimentos/centenaContract";
import { MaterialDourado } from "./MaterialDourado";
import { Quadrado100 } from "./Quadrado100";

/**
 * F37 / N2.04 — a centena nas três ordens.
 *
 * ## O palco composto que a ficha nomeia
 *
 * `MaterialDourado` + `Quadrado100`, cada um com trabalho próprio:
 *
 * - o **material dourado** mostra as três ordens como quantidade física —
 *   placas, barras, cubinhos. É onde "dez barras viram uma placa" acontece;
 * - o **quadrado de cem** aparece nos níveis em que a pergunta parte do
 *   numeral, como a régua de cem que dá tamanho à centena. Uma placa é ISSO —
 *   e é essa ligação que impede a centena de virar mais um símbolo decorado.
 *
 * ## O numeral não aparece quando é ele que se pergunta
 *
 * Nos níveis em que a criança lê o material e diz o número, o número não está
 * escrito em lugar nenhum da tela. Nos níveis que partem do numeral, ele está
 * no enunciado — e aí o que se pergunta é outra coisa: quantas placas, ou
 * quantas de uma ordem.
 */
interface Props {
  spec: CentenaF37Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function CentenaStage({ spec, disabled, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f37-stage data-f37-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        Placas, barras e cubinhos
      </div>

      <div className="flex justify-center" data-f37-material={`${spec.centenas}-${spec.dezenas}-${spec.unidades}`}>
        <MaterialDourado centenas={spec.centenas} dezenas={spec.dezenas} unidades={spec.unidades} compact />
      </div>

      {spec.partirDoNumeral && <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Uma placa é este quadrado inteiro</p>
        <Quadrado100 />
      </div>}

      <div role="group" aria-label="Alternativas" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spec.opcoes.map(opcao => (
          <button
            key={String(opcao.value)}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => responder(opcao.value, opcao.misconception)}
            className="min-h-16 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-xl font-black text-slate-800 hover:border-sky-400 disabled:opacity-40"
          >
            {opcao.label}
          </button>
        ))}
      </div>
    </div>
  </section>;
}
