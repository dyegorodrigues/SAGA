import React, { useMemo, useState } from "react";
import type { AnswerMeta } from "../../types";
import type { ExpressaoF77Spec } from "../../curriculum/procedimentos/expressaoF77Contract";
import { Balanca, type BalancaItem } from "./Balanca";

interface Props {
  spec: ExpressaoF77Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function ExpressaoF77Stage({ spec, disabled, onAnswer }: Props) {
  const [selecionado, setSelecionado] = useState<number | undefined>();
  const [indisponiveis, setIndisponiveis] = useState<Set<number>>(new Set());

  const { esquerda, direita } = useMemo(() => {
    let pesoEsquerda = spec.resposta;
    let pesoDireita = spec.resposta;
    let labelEsquerda = spec.expressao;
    let labelDireita = spec.ladoDireito;

    if (["mesma-ordem", "precedencia", "parenteses"].includes(spec.modo)) {
      pesoDireita = selecionado ?? 0;
      labelDireita = selecionado === undefined ? "?" : String(selecionado);
    } else if (spec.modo === "incognita-meio") {
      const candidato = selecionado ?? 0;
      pesoEsquerda = 3 + candidato * 2;
      labelEsquerda = spec.expressao.replace("□", selecionado === undefined ? "?" : String(selecionado));
      pesoDireita = 11;
    }

    const leftItems: BalancaItem[] = [{ id: `f77-left-${labelEsquerda}`, weight: pesoEsquerda, label: labelEsquerda }];
    const rightItems: BalancaItem[] = [{ id: `f77-right-${labelDireita}`, weight: pesoDireita, label: labelDireita }];
    return { esquerda: leftItems, direita: rightItems };
  }, [selecionado, spec]);

  const responder = (valor: number, misconception?: string) => {
    if (disabled || indisponiveis.has(valor)) return;
    setSelecionado(valor);
    if (valor !== spec.resposta) setIndisponiveis(current => new Set(current).add(valor));
    onAnswer(valor, misconception && valor !== spec.resposta ? { misconception } : undefined);
  };

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 overflow-x-hidden" data-f77-stage data-f77-mode={spec.modo}>
      <div className="w-full overflow-hidden rounded-3xl border border-amber-100 bg-amber-50/50 px-4 pt-4">
        <p className="text-center text-sm font-bold text-amber-950">Resolva primeiro o pacote destacado; depois preserve o equilíbrio.</p>
        <div className="mt-3 rounded-2xl bg-white px-3 py-3 text-center">
          <span className="text-2xl font-black text-slate-800">{spec.expressao}</span>
          <div className="mt-2 text-xs font-black uppercase tracking-widest text-amber-700" data-f77-priority>primeiro: {spec.prioridade}</div>
        </div>
        <div className="w-full px-[62px] sm:px-16" data-f77-balance-safe-area>
          <Balanca leftItems={esquerda} rightItems={direita} state={selecionado === spec.resposta ? "acerto" : "ocioso"} />
        </div>
        {spec.modo === "propriedades" && <p className="pb-4 text-center text-sm font-bold text-slate-600">A balança mostra duas escritas diferentes com o mesmo valor.</p>}
      </div>

      <div className="grid w-full grid-cols-2 gap-3" aria-label="Respostas da expressão">
        {spec.opcoes.map(option => (
          <button
            key={option.value}
            type="button"
            disabled={disabled || indisponiveis.has(option.value)}
            onClick={() => responder(option.value, option.misconception)}
            className="min-h-16 rounded-2xl border-2 border-amber-200 bg-white px-3 text-xl font-black text-slate-800 disabled:opacity-35"
            data-f77-option={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
}
