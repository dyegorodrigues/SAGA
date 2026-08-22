import React from "react";
import type { AnswerMeta } from "../../types";
import type { OperarNegativosF85Spec } from "../../curriculum/procedimentos/operarNegativosContract";
import { InteractiveNumberLineSurface } from "./InteractiveNumberLine";

interface Props {
  spec: OperarNegativosF85Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function OperarNegativosStage({ spec, disabled, onAnswer }: Props) {
  const send = (value: number, misconception?: string) => onAnswer(
    value,
    misconception && value !== spec.resposta ? { misconception } : undefined,
  );
  const contexto = spec.contexto === "divida"
    ? "Dívida: retirar uma dívida aumenta o saldo."
    : spec.contexto === "saldo"
      ? "Saldo: positivo e negativo indicam movimentos opostos."
      : "Leia cada operação na ordem, preservando o sinal.";

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f85-stage data-f85-mode={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 text-center text-sm font-black uppercase tracking-widest text-slate-500">Operar com negativos</div>
      <div className="mb-1 text-center text-2xl font-black text-slate-800">{spec.expressao}</div>
      <div className="mb-4 text-center text-sm font-bold text-slate-600">{contexto}</div>
      <InteractiveNumberLineSurface
        start={spec.inicio}
        end={spec.fim}
        position={spec.posicaoInicial}
        disabled={true}
        interactionDisabled={true}
        numeraisVisiveis={Array.from({ length: spec.fim - spec.inicio + 1 }, (_, index) => spec.inicio + index)}
        target={spec.resposta}
        pulsarTarget={false}
      />
      {spec.cruzaZero && <div className="mt-2 text-center text-sm font-black text-slate-600">Este movimento atravessa o zero.</div>}
      {spec.modo === "subtracao-negativo" && <div className="mt-2 text-center text-sm font-black text-slate-700">−(−5) cancela uma dívida de 5.</div>}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {spec.opcoes.map(opcao => <button
          key={String(opcao.value)}
          type="button"
          disabled={disabled}
          onClick={() => send(opcao.value, opcao.misconception)}
          className="min-h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-black text-slate-800 hover:border-sky-400 disabled:opacity-40"
        >{opcao.label}</button>)}
      </div>
    </div>
  </section>;
}
