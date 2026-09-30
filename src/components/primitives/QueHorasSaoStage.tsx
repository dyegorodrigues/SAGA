import React from "react";
import type { AnswerMeta } from "../../types";
import type { QueHorasSaoF55Spec } from "../../curriculum/procedimentos/queHorasSaoContract";
import { Relogio } from "./Relogio";
import { AlternativasQueFalam } from "../gameloop/AlternativasQueFalam";

/**
 * F55 / GM.04 — o mostrador, e os dois ponteiros que fazem coisas diferentes.
 *
 * ## A diferença visual entre os ponteiros é obrigatória
 *
 * A ficha canônica é explícita: curto e grosso para as horas, longo e fino para
 * os minutos, cores distintas. Sem isso a criança não sabe qual olhar, e o erro
 * `PONTEIRO_TROCADO` deixa de ser diagnóstico para virar consequência do
 * desenho. Quem garante isso é a primitiva `Relogio`.
 *
 * ## O relógio não é interativo aqui
 *
 * Arrastar ponteiro é a competência da GM.06, que trabalha o minuto. Nesta
 * ficha a criança LÊ, e é por isso que o mostrador entra travado: uma tela que
 * aceita arrastar ensina a produzir a hora antes de saber ler uma.
 *
 * ## O digital só aparece depois
 *
 * A ficha canônica põe o horário em digital no FECHO, depois do acerto. Antes
 * dele seria o gabarito impresso ao lado da pergunta.
 */
interface Props {
  spec: QueHorasSaoF55Spec;
  disabled?: boolean;
  /** A voz do app: é ela que lê as alternativas para quem não lê. */
  falar?: (texto: string) => void;
  onAnswer: (valor: string, meta?: AnswerMeta) => void;
}

export function QueHorasSaoStage({ spec, disabled, falar, onAnswer }: Props) {
  const responder = (valor: string, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f55-stage data-f55-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        O ponteiro pequeno mostra a hora
      </div>

      <div className="flex justify-center" data-f55-relogio={`${spec.horas}:${spec.minutos}`}>
        <Relogio initialHours={spec.horas} initialMinutes={spec.minutos} interactive={false} />
      </div>

      {spec.minutos === 30 && <p className="mt-3 text-center font-bold text-amber-700" data-f55-meia-hora>
        Repare: o ponteiro pequeno está entre dois números.
      </p>}

      {/*
        As alternativas passam por `AlternativasQueFalam`: o primeiro toque
        FALA o rótulo e arma, e só o ✓ responde. Escolher entre símbolos que a
        criança não lê é cara ou coroa — e o app anotava como erro de conta.
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
