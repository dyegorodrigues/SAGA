import React from "react";
import type { AnswerMeta } from "../../types";
import type { NumerosGrandesF65Spec } from "../../curriculum/procedimentos/numerosGrandesContract";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";
import { Quadrado100 } from "./Quadrado100";

/**
 * F65 / N2.05 — a reta com as duas marcas, e o número entre elas.
 *
 * ## Por que a reta é a ficha inteira
 *
 * Arredondar, na reta, é ver de qual marca o número está mais perto. O "cinco
 * arredonda para cima" para de ser regra decorada quando a criança VÊ que ali o
 * número está exatamente no meio — e que subir é convenção, não distância.
 *
 * A reta é desenhada com as duas marcas que cercam o número, não com a escala
 * inteira: o que importa é a vizinhança, e uma reta de zero a nove mil
 * esconderia justamente a distância que se quer medir.
 *
 * ## O Quadrado100 nos níveis da centena
 *
 * A segunda primitiva que a ficha nomeia aparece onde a ordem é a centena: ele
 * dá tamanho ao cem, para que "arredondar para a centena" não vire manipulação
 * de dígitos.
 */
interface Props {
  spec: NumerosGrandesF65Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function NumerosGrandesStage({ spec, disabled, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  // A reta mostra só a vizinhança, em passos de um décimo da ordem: onze marcas
  // entre uma marca redonda e a seguinte.
  const passo = spec.ordem / 10;
  const marcas = Array.from({ length: 11 }, (_, i) => spec.marcaAbaixo + i * passo);

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f65-stage data-f65-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        Entre duas marcas
      </div>

      <InteractiveNumberLineSurface
        start={spec.marcaAbaixo}
        end={spec.marcaAcima}
        position={0}
        disabled={true}
        interactionDisabled={true}
        numeraisVisiveis={marcas}
        target={spec.numero}
        pulsarTarget={false}
      />

      {spec.bemNoMeio && <p className="mt-3 text-center font-black text-amber-700" data-f65-meio>
        Este está bem no meio das duas marcas.
      </p>}

      {spec.ordem === 100 && <div className="mt-4 flex flex-col items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Uma centena é este quadrado inteiro</p>
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
