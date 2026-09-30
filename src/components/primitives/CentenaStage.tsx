import React from "react";
import type { AnswerMeta } from "../../types";
import type { CentenaF37Spec } from "../../curriculum/procedimentos/centenaContract";
import { MaterialDourado } from "./MaterialDourado";
import { Quadrado100 } from "./Quadrado100";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";

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
  /** A voz do app: é ela que lê as alternativas para quem não lê. */
  falar?: (texto: string) => void;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function CentenaStage({ spec, disabled, falar, onAnswer }: Props) {
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
        className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"
      />
    </div>
  </section>;
}
