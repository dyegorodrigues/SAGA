import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { DinheiroF53Spec } from "../../curriculum/procedimentos/dinheiroContract";
import { escreverValor } from "../../curriculum/procedimentos/dinheiroContract";
import { Moedas } from "./Moedas";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";

/**
 * F53 / GM.03 — o tesouro do pirata.
 *
 * ## O contador acumula, e nunca chega ao fim sozinho
 *
 * Tocar cada moeda soma o valor dela num contador — é a estratégia da ficha
 * acontecendo na tela: começar pela maior e ir somando. Mas o contador conta o
 * que a criança tocou, não o que existe na mesa: se ela parar no meio, ele para
 * no meio. Ler o contador não substitui somar, porque ele só sabe o que ela já
 * somou.
 *
 * ## Por que o total não aparece pronto
 *
 * Escrever o total na tela seria o gabarito impresso. O contador existe para
 * apoiar a ordenação — a estratégia que a ficha ensina —, não para responder.
 */
interface Props {
  spec: DinheiroF53Spec;
  disabled?: boolean;
  /** A voz do app: é ela que lê as alternativas para quem não lê. */
  falar?: (texto: string) => void;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function DinheiroStage({ spec, disabled, falar, onAnswer }: Props) {
  const [contadas, setContadas] = useState<number[]>([]);

  const acumulado = contadas.reduce((soma, indice) => soma + spec.moedas[indice], 0);

  const tocar = (indice: number) => {
    if (disabled) return;
    setContadas(atual => (atual.includes(indice) ? atual.filter(i => i !== indice) : [...atual, indice]));
  };

  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f53-stage data-f53-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        O tesouro do pirata
      </div>

      <Moedas moedas={spec.moedas} contadas={contadas} onTocar={tocar} disabled={Boolean(disabled)} />

      {spec.modo !== "reconhecer" && <p className="mt-4 text-center font-bold text-slate-700" data-f53-acumulado={acumulado}>
        {contadas.length === 0
          ? "Toque nas moedas para ir somando, da maior para a menor."
          : `Já somou: ${escreverValor(acumulado)}.`}
      </p>}

      {/*
        As alternativas passam por `AlternativasQueFalam`: o primeiro toque
        FALA o rótulo e arma, e só o ✓ responde. A criança da Jornada pode
        não ler — escolher entre símbolos que ela não lê é cara ou coroa, e o
        app anotava o cara ou coroa como erro de matemática.
      */}
      <AlternativasQueFalam
        alternativas={spec.opcoes.map(o => ({ valor: o.value, rotulo: String(o.label) }))}
        onEscolher={valor => {
          const escolhida = spec.opcoes.find(o => o.value === valor);
          responder(valor as never, escolhida?.misconception);
        }}
        falar={falar}
        disabled={Boolean(disabled)}
        className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
      />
    </div>
  </section>;
}
