import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { FazerDezF33Spec } from "../../curriculum/procedimentos/fazerDezContract";
import { TenFrame } from "./TenFrame";

/**
 * F33 / N3.07 — as duas caixas, e a peça que atravessa de uma para a outra.
 *
 * ## O portão é a caixa fechada
 *
 * Onde as molduras existem (L1 a L3), a barra de respostas só abre depois que a
 * primeira caixa chega a dez. Não é enfeite: a ficha inteira existe para que a
 * criança FEÇHE o dez antes de somar o resto, e uma tela que aceita o total sem
 * isso mede soma, não a estratégia. O `NAO_FAZ_DEZ` que a ficha nomeia como
 * erro-alvo é exatamente contar tudo do início — e um botão que aceita a
 * resposta antes da caixa fechar convida a fazer isso.
 *
 * ## Toque, nunca arrasto
 *
 * O adendo §8.3-bis da Bíblia é explícito: erro de arrasto não vira
 * misconception, todo arrasto tem alternativa por toque, e precisão de dedo
 * nunca é requisito para demonstrar compreensão. Aqui não há arrasto nenhum —
 * uma peça por toque, alvo grande. Quem entende a estratégia não pode ser
 * reprovado pela coordenação motora.
 *
 * ## O que a tela não conta
 *
 * A segunda caixa recebe a sobra à medida que a criança coloca, e nunca aparece
 * um numeral do total: contar as peças é a estratégia, ler o resultado pronto
 * seria o gabarito impresso.
 */
interface Props {
  spec: FazerDezF33Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function FazerDezStage({ spec, disabled, onAnswer }: Props) {
  // Quantas peças da bandeja já saíram. As primeiras fecham a caixa; as
  // seguintes começam a segunda.
  const [colocadas, setColocadas] = useState(0);
  const naPrimeira = Math.min(spec.a + colocadas, 10);
  const naSegunda = Math.max(0, spec.a + colocadas - 10);
  const naBandeja = spec.b - colocadas;
  const caixaFechada = naPrimeira === 10;
  const respostasFechadas = Boolean(disabled) || (spec.exigeFecharACaixa && !caixaFechada);

  const responder = (valor: number, misconception?: string) => {
    if (respostasFechadas) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  const casas = (n: number) => Array.from({ length: n }, (_, i) => i);

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f33-stage data-f33-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {spec.mostrarMolduras ? <>
        <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">Feche a caixa primeiro</div>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <div className="flex flex-col items-center gap-1" data-f33-caixa="primeira" data-f33-fechada={caixaFechada ? "true" : "false"}>
            <TenFrame moldura={{ casas: 10, ocupadas: casas(naPrimeira), emoji: "🔵" }} />
            {caixaFechada && <p className="font-black text-emerald-700">Fechou! Dez!</p>}
          </div>
          <div className="flex flex-col items-center gap-1" data-f33-caixa="segunda">
            <TenFrame moldura={{ casas: 10, ocupadas: casas(naSegunda), emoji: "🟢" }} />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2" data-f33-bandeja={naBandeja}>
          <p className="font-bold text-slate-700">Na bandeja: {naBandeja}</p>
          <button
            type="button"
            disabled={Boolean(disabled) || naBandeja === 0}
            onClick={() => setColocadas(atual => Math.min(spec.b, atual + 1))}
            className="min-h-14 rounded-2xl border-2 border-sky-400 bg-sky-50 px-6 font-black text-sky-900 disabled:opacity-40"
          >
            👆 Colocar uma peça
          </button>
        </div>
      </> : <p className="py-3 text-center text-lg font-black text-slate-700">
        Sem as caixas: faça dez de cabeça.
      </p>}

      {spec.mostrarDecomposicao && <p className="mt-4 text-center text-xl font-black text-slate-800" data-f33-decomposicao>
        {spec.a} + {spec.faltamParaDez} = 10
      </p>}

      {respostasFechadas && !disabled && <p className="mt-3 text-center font-bold text-sky-800">
        Complete a primeira caixa antes de responder.
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
