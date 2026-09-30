import React from "react";
import type { AnswerMeta, Question } from "../../types";
import type { DezenaDesmontaF40Spec } from "../../curriculum/procedimentos/dezenaDesmontaContract";
import { InteractiveVertical } from "./InteractiveVertical";
import { MaterialDourado } from "./MaterialDourado";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";

/**
 * F40 / N3.12 — a conta armada e o material que a explica.
 *
 * ## As duas primitivas, e a ponte entre elas
 *
 * - o **InteractiveVertical** mostra a conta armada, que é onde o algoritmo
 *   mora e onde a criança vai registrar o empréstimo;
 * - o **MaterialDourado** mostra o minuendo em barras e cubinhos, e é onde
 *   "desmontar uma dezena" deixa de ser uma marquinha em cima do algarismo e
 *   vira uma barra virando dez cubinhos.
 *
 * O material sai do L4 em diante: a ponte já foi atravessada, e mantê-la seria
 * negar o degrau que o nível oferece.
 *
 * ## A conta armada não resolve sozinha
 *
 * O `InteractiveVertical` entra sem `onAnswer`: quem responde é a barra deste
 * palco. Duas superfícies aceitando a resposta dariam dois caminhos para o
 * mesmo acerto — CLASS-010 — e a conta armada aqui existe para ser LIDA, não
 * para ser preenchida.
 */
interface Props {
  spec: DezenaDesmontaF40Spec;
  disabled?: boolean;
  /** A voz do app: é ela que lê as alternativas para quem não lê. */
  falar?: (texto: string) => void;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function DezenaDesmontaStage({ spec, disabled, falar, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  const contaArmada = {
    kind: "vertical",
    prompt: "",
    vTop: spec.topo,
    vBot: spec.base,
    vOp: "-",
    uiProps: { vTop: spec.topo, vBot: spec.base, vOp: "-", showPlaceValue: spec.mostrarMaterial },
    evaluate: () => false,
  } as unknown as Question;

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f40-stage data-f40-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        {spec.zeroNoMeio ? "Zero no meio: duas quebras" : "Quando não dá para tirar, quebre uma dezena"}
      </div>

      <div className="flex justify-center">
        <InteractiveVertical q={contaArmada} onAnswer={() => undefined} disabled={true} showAlgorithm />
      </div>

      {spec.mostrarMaterial && <div className="mt-4 flex flex-col items-center gap-2" data-f40-material>
        <p className="text-sm font-bold uppercase tracking-widest text-slate-500">O de cima, em barras e cubinhos</p>
        <MaterialDourado
          centenas={Math.floor(spec.topo / 100)}
          dezenas={Math.floor((spec.topo % 100) / 10)}
          unidades={spec.topo % 10}
          compact
        />
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
