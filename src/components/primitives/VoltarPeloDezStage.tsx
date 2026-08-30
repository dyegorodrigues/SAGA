import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { CaminhoDaSubtracao, VoltarPeloDezF34Spec } from "../../curriculum/procedimentos/voltarPeloDezContract";
import { metaDoCaminhoF34 } from "../../curriculum/procedimentos/voltarPeloDezContract";
import { TenFrame } from "./TenFrame";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";

/**
 * F34 / N3.08 — o espelho do fazer dez, com as duas molduras e a reta.
 *
 * ## As duas primitivas fazem trabalhos diferentes
 *
 * A ficha nomeia `TenFrame` duplo **e** `NumberLine`, e não é redundância:
 *
 * - as **molduras** mostram a decomposição como quantidade — os soltos saem
 *   primeiro, a caixa cheia se abre depois. É onde a criança vê POR QUE se
 *   passa pelo dez;
 * - a **reta** mostra o mesmo percurso como distância, e é o suporte do erro
 *   suave que a ficha pede: refazer o caminho passo a passo. Ela sobrevive até
 *   o L4, quando as molduras já saíram.
 *
 * ## Dois portões, um por degrau
 *
 * Onde as molduras existem, chegar ao dez é a ação probatória — tirar os soltos
 * é o primeiro passo da estratégia e a tela não aceita o total antes dele. Do
 * L3 em diante as molduras somem e entra o outro portão: escolher o caminho,
 * porque `13 − 8` é mais curto completando e avaliar isso é a competência.
 */
interface Props {
  spec: VoltarPeloDezF34Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function VoltarPeloDezStage({ spec, disabled, onAnswer }: Props) {
  const [tirados, setTirados] = useState(0);
  const [escolhido, setEscolhido] = useState<CaminhoDaSubtracao | null>(null);

  const chegouAoDez = tirados >= spec.soltos;
  const respostasFechadas = Boolean(disabled)
    || (spec.exigeChegarAoDez && !chegouAoDez)
    || (spec.exigeEscolha && escolhido === null);

  const responder = (valor: number, misconception?: string) => {
    if (respostasFechadas) return;
    const doCaminho = escolhido ? metaDoCaminhoF34(spec, escolhido) : undefined;
    const daAlternativa = misconception && valor !== spec.resposta ? { misconception } : undefined;
    onAnswer(valor, daAlternativa ?? doCaminho);
  };

  const casas = (n: number) => Array.from({ length: n }, (_, i) => i);
  const soltosNaTela = Math.max(0, spec.soltos - tirados);

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f34-stage data-f34-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {spec.mostrarMolduras && <>
        <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">Volte até o dez</div>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <div className="flex flex-col items-center gap-1" data-f34-caixa="cheia">
            <TenFrame moldura={{ casas: 10, ocupadas: casas(10), emoji: "🔵" }} />
            {chegouAoDez && <p className="font-black text-emerald-700">Chegamos no dez!</p>}
          </div>
          <div className="flex flex-col items-center gap-1" data-f34-soltos={soltosNaTela}>
            <TenFrame moldura={{ casas: 10, ocupadas: casas(soltosNaTela), emoji: "🟢" }} />
            <p className="font-bold text-slate-700">Soltos: {soltosNaTela}</p>
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            disabled={Boolean(disabled) || soltosNaTela === 0}
            onClick={() => setTirados(atual => Math.min(spec.soltos, atual + 1))}
            className="min-h-14 rounded-2xl border-2 border-sky-400 bg-sky-50 px-6 font-black text-sky-900 disabled:opacity-40"
          >
            👆 Tirar um solto
          </button>
        </div>
      </>}

      {spec.mostrarReta && <div className="mt-4">
        <InteractiveNumberLineSurface
          start={0}
          end={20}
          position={0}
          disabled={true}
          interactionDisabled={true}
          numeraisVisiveis={Array.from({ length: 21 }, (_, i) => i)}
          target={spec.total}
          pulsarTarget={false}
        />
      </div>}

      {spec.exigeEscolha && <div className="mt-4 grid grid-cols-2 gap-3" data-f34-caminhos>
        {(["voltar", "completar"] as const).map(caminho => (
          <button
            key={caminho}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => setEscolhido(caminho)}
            aria-pressed={escolhido === caminho}
            data-f34-caminho={caminho}
            className={`min-h-14 rounded-2xl border-2 px-4 py-3 font-black ${escolhido === caminho ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-slate-50 text-slate-800"} disabled:opacity-40`}
          >
            {caminho === "voltar" ? "↩️ Voltar pelo dez" : "➡️ Completar até o total"}
          </button>
        ))}
      </div>}

      {respostasFechadas && !disabled && <p className="mt-3 text-center font-bold text-sky-800">
        {spec.exigeChegarAoDez && !chegouAoDez ? "Tire os soltos até chegar no dez." : "Escolha um caminho antes de responder."}
      </p>}

      <div role="group" aria-label="Alternativas" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spec.opcoes.map(opcao => (
          <button
            key={String(opcao.value)}
            type="button"
            disabled={respostasFechadas}
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
