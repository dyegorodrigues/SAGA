import React from "react";
import type { AnswerMeta } from "../../types";
import type { FamiliaAditivaF16Spec } from "../../curriculum/procedimentos/familiaAditivaContract";
import { NumberBond } from "./NumberBond";

/**
 * F16 / N3.05 — o triângulo da família de fatos.
 *
 * ## O vértice perguntado não sabe a resposta
 *
 * O `NumberBond` recebe `'?'` naquele lugar, literalmente. O número não chega
 * ao componente, então não há bug de renderização capaz de mostrá-lo. É a mesma
 * disciplina do triângulo multiplicativo da N4.06 e do `BarSlot` da N3.10.
 *
 * ## As contas de apoio ensinam a estrutura, não o resultado
 *
 * Elas aparecem para mostrar que os mesmos três números fazem quatro frases —
 * que é a lição inteira da ficha. Todas mascaradas: escrever `4 + 3 = 7` ao
 * lado de `3 + 4 = ?` entregaria o gabarito só que em outra ordem, e é a
 * CLASS-009 na forma mais fácil de cometer.
 */
interface Props {
  spec: FamiliaAditivaF16Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function FamiliaAditivaStage({ spec, disabled, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f16-stage data-f16-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        Um trio, quatro contas
      </div>

      <div className="flex justify-center" data-f16-oculto={spec.oculto}>
        <NumberBond whole={spec.triangulo.topo} part1={spec.triangulo.esquerda} part2={spec.triangulo.direita} />
      </div>

      {spec.mostrarConta
        ? <p className="mt-4 text-center text-2xl font-black text-slate-800" data-f16-conta>{spec.contaEmAberto}</p>
        : <p className="mt-4 text-center text-lg font-bold text-slate-600" data-f16-sem-conta>
            Olhe o triângulo e descubra qual número falta.
          </p>}

      <div className="mt-3 flex flex-wrap justify-center gap-2" data-f16-apoio>
        {spec.apoio.map(conta => (
          <span key={conta} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 font-bold text-slate-500">{conta}</span>
        ))}
      </div>

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
