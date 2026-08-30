import React from "react";
import type { AnswerMeta } from "../../types";
import type { PictogramaF56Spec } from "../../curriculum/procedimentos/pictogramaContract";

/**
 * F56 / PE.01 — o pictograma em modo ícones.
 *
 * ## O que a tela mostra, e o que ela recusa mostrar
 *
 * Cada linha tem rótulo à esquerda e desenhos repetidos à direita — a tabela
 * que a criança precisa aprender a LER, não a calcular. Os totais por linha
 * ficam de fora até a resposta: escrevê-los ao lado apagaria a pergunta, que é
 * exatamente contar os desenhos e aplicar a legenda.
 *
 * ## A legenda é texto, e é de propósito
 *
 * Quando a escala é dois, a legenda diz "cada desenho vale 2" em palavras. O
 * degrau da ficha é a criança LER essa frase e agir sobre ela; escondê-la atrás
 * de um ícone tornaria o erro `IGNORA_ESCALA` inevitável em vez de
 * diagnosticável.
 */
interface Props {
  spec: PictogramaF56Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function PictogramaStage({ spec, disabled, onAnswer }: Props) {
  const responder = (valor: number, misconception?: string) => {
    if (disabled) return;
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f56-stage data-f56-modo={spec.modo}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        O contador de animais
      </div>

      <div className="mx-auto flex max-w-xl flex-col gap-2" role="table" aria-label="Pictograma da turma">
        {spec.linhas.map((linha, indice) => (
          <div
            key={linha.rotulo}
            role="row"
            data-f56-linha={linha.rotulo}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${indice === spec.perguntada ? "bg-sky-50 ring-2 ring-sky-300" : "bg-slate-50"}`}
          >
            <span role="rowheader" className="w-28 shrink-0 font-black text-slate-700">{linha.rotulo}</span>
            <span role="cell" aria-label={`${linha.icones} desenhos`} className="text-2xl tracking-widest">
              {linha.emoji.repeat(linha.icones)}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center font-bold text-slate-700" data-f56-legenda={spec.escala}>
        Legenda: cada desenho vale {spec.escala === 1 ? "um" : "dois"}.
      </p>

      {spec.modo === "construir" && <p className="mt-2 text-center text-lg font-black text-slate-800">
        Dados soltos: {spec.quantidadeDada} no total.
      </p>}

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
