import React, { useState } from "react";
import type { AnswerMeta } from "../../types";
import type { RepartirMedirF99Spec, SentidoDaDivisao } from "../../curriculum/procedimentos/repartirMedirContract";
import { DragGroup } from "./DragGroup";

/**
 * F99 / N4.05 — o DragGroup nos dois modos.
 *
 * ## O mesmo componente, duas perguntas
 *
 * - **partição**: o número de caixas é conhecido (o divisor) e a criança
 *   distribui um a um até acabar. O que ela descobre é quanto coube em cada uma;
 * - **medida**: o TAMANHO da caixa é conhecido, e o que ela descobre é quantas
 *   caixas deu. O `boxCapacity` é o divisor, e as caixas vão sendo preenchidas.
 *
 * Não são dois componentes: é o mesmo, com o parâmetro no outro lugar. Essa é
 * exatamente a lição da ficha, e desenhá-la com duas telas diferentes ensinaria
 * que são duas contas diferentes.
 *
 * ## O portão do L4
 *
 * O nível em que a criança identifica o sentido antes de resolver tem a barra
 * fechada até ela dizer qual é. Sem isso, `SO_UM_SENTIDO` — o alvo da ficha —
 * fica invisível: quem só conhece partição resolve tudo como partição e acerta
 * metade por sorte, sem nunca declarar o que achou que estava fazendo.
 */
interface Props {
  spec: RepartirMedirF99Spec;
  disabled?: boolean;
  onAnswer: (valor: number, meta?: AnswerMeta) => void;
}

export function RepartirMedirStage({ spec, disabled, onAnswer }: Props) {
  const [identificado, setIdentificado] = useState<SentidoDaDivisao | null>(null);
  const respostasFechadas = Boolean(disabled) || (spec.exigeIdentificar && identificado === null);

  const responder = (valor: number, misconception?: string) => {
    if (respostasFechadas) return;
    // Identificar o sentido errado é diagnóstico próprio: a criança pode
    // acertar a conta tendo lido a pergunta ao contrário.
    const doSentido = spec.exigeIdentificar && identificado !== spec.sentido
      ? { misconception: "ignora-tamanho" }
      : undefined;
    const daAlternativa = misconception && valor !== spec.resposta ? { misconception } : undefined;
    onAnswer(valor, daAlternativa ?? doSentido);
  };

  return <section className="mx-auto w-full max-w-3xl px-1 py-2" data-f99-stage data-f99-modo={spec.modo} data-f99-sentido={spec.sentido}>
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-3 text-center text-sm font-black uppercase tracking-widest text-slate-500">
        {spec.sentido === "particao" ? "Repartir igualmente" : "Medir em grupos"}
      </div>

      <DragGroup
        sourceCount={spec.total}
        destCount={spec.sentido === "particao" ? spec.divisor : Math.max(1, spec.quociente + (spec.resto > 0 ? 1 : 0))}
        boxCapacity={spec.sentido === "particao" ? Math.max(1, spec.quociente) : spec.divisor}
        sourceEmoji="🍎"
        destEmoji="🧺"
        disabled={true}
      />

      {spec.exigeIdentificar && <div className="mt-4 grid grid-cols-2 gap-3" data-f99-identificar>
        {(["particao", "medida"] as const).map(sentido => (
          <button
            key={sentido}
            type="button"
            disabled={Boolean(disabled)}
            onClick={() => setIdentificado(sentido)}
            aria-pressed={identificado === sentido}
            data-f99-escolha={sentido}
            className={`min-h-14 rounded-2xl border-2 px-4 py-3 font-black ${identificado === sentido ? "border-sky-500 bg-sky-50 text-sky-900" : "border-slate-200 bg-slate-50 text-slate-800"} disabled:opacity-40`}
          >
            {sentido === "particao" ? "Sei quantos grupos" : "Sei o tamanho do grupo"}
          </button>
        ))}
      </div>}

      {respostasFechadas && !disabled && <p className="mt-3 text-center font-bold text-sky-800">
        Diga primeiro o que a pergunta já conta.
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
