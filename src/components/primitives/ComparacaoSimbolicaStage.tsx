import React, { useState } from "react";
import { AnswerMeta } from "../../types";
import {
  ComparacaoSimbolicaSpec,
  LadoComparacaoSimbolica,
  SimboloComparacao,
} from "../../curriculum/procedimentos/comparacaoSimbolicaContract";
import {
  AcaoDeComparacaoSimbolica,
  metaComparacaoSimbolica,
} from "../../curriculum/procedimentos/comparacaoSimbolicaProcedure";
import { Grupo } from "./Grupo";

export interface ComparacaoSimbolicaStageProps {
  spec: ComparacaoSimbolicaSpec;
  disabled?: boolean;
  onAnswer: (valor: SimboloComparacao, meta?: AnswerMeta) => void;
}

function bolinhas(quantidade: number) {
  return Array.from({ length: quantidade }, (_, index) => (
    <span
      key={index}
      aria-hidden
      className="inline-block h-5 w-5 rounded-full border-2 border-slate-600 bg-amber-300"
    />
  ));
}

function Lado({
  lado,
  indice,
  disabled,
  onInspect,
}: {
  lado: LadoComparacaoSimbolica;
  indice: 0 | 1;
  disabled?: boolean;
  onInspect: (indice: 0 | 1) => void;
}) {
  if (lado.tipo === "grupo") {
    return (
      <div className="flex min-w-0 justify-center" data-lado-tipo="grupo">
        <div className="origin-center scale-[0.72] sm:scale-90">
          <Grupo
            items={bolinhas(lado.valor)}
            disabled={disabled}
            onClick={() => onInspect(indice)}
            rotulo={`Grupo com ${lado.valor} itens. Toque para observar este lado.`}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onInspect(indice)}
      data-lado-tipo={lado.tipo}
      aria-label={`${lado.tipo === "expressao" ? "Expressão" : "Numeral"} ${lado.texto}. Toque para observar este lado.`}
      className="flex min-h-28 w-full min-w-0 items-center justify-center rounded-3xl border-2 border-slate-300 bg-white px-3 text-center text-4xl font-black text-slate-800 shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 disabled:opacity-70 sm:min-h-36 sm:text-5xl"
    >
      {lado.texto}
    </button>
  );
}

function AndaimeJacare({ spec }: { spec: ComparacaoSimbolicaSpec }) {
  if (spec.andaime === "nenhum") return <span aria-hidden className="text-3xl font-black text-slate-400">□</span>;
  const animado = spec.andaime === "jacare-animado";
  const rotulo = spec.resposta === "="
    ? "Andaime do jacaré: os dois lados têm o mesmo valor."
    : "Andaime do jacaré: a boca aberta deve ficar virada para o lado de maior valor.";

  return (
    <div
      data-andaime-jacare={spec.andaime}
      role="img"
      aria-label={rotulo}
      className={`select-none text-center text-4xl ${animado ? "animate-pulse" : ""}`}
    >
      <span aria-hidden>🐊</span>
    </div>
  );
}

/**
 * Palco especializado F29. `Grupo` representa a quantidade concreta; o palco
 * só adiciona a ponte para numeral/símbolo e coleta evidência de processo.
 */
export function ComparacaoSimbolicaStage({ spec, disabled, onAnswer }: ComparacaoSimbolicaStageProps) {
  const [ordemDeToques, setOrdemDeToques] = useState<Array<0 | 1>>([]);
  const [ultimaEscolha, setUltimaEscolha] = useState<SimboloComparacao | null>(null);
  const [revisoesDeSimbolo, setRevisoesDeSimbolo] = useState(0);

  const registrarLado = (indice: 0 | 1) => {
    if (disabled) return;
    setOrdemDeToques(atual => [...atual, indice]);
  };

  const responder = (escolha: SimboloComparacao) => {
    if (disabled) return;
    const revisoes = ultimaEscolha && ultimaEscolha !== escolha
      ? revisoesDeSimbolo + 1
      : revisoesDeSimbolo;
    setUltimaEscolha(escolha);
    setRevisoesDeSimbolo(revisoes);

    const acao: AcaoDeComparacaoSimbolica = {
      nivel: spec.nivel,
      ordemDeToques: [...ordemDeToques],
      revisoesDeSimbolo: revisoes,
      escolha,
      correta: escolha === spec.resposta,
    };
    onAnswer(escolha, metaComparacaoSimbolica(acao, spec));
  };

  return (
    <section
      aria-label="Comparação maior, menor ou igual"
      data-comparacao-simbolica
      data-nivel={spec.nivel}
      className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-2 py-3"
    >
      <div className="grid w-full grid-cols-[minmax(0,1fr)_3.25rem_minmax(0,1fr)] items-center gap-1 sm:gap-3">
        <Lado lado={spec.lados[0]} indice={0} disabled={disabled} onInspect={registrarLado} />
        <AndaimeJacare spec={spec} />
        <Lado lado={spec.lados[1]} indice={1} disabled={disabled} onInspect={registrarLado} />
      </div>

      <fieldset className="flex w-full justify-center gap-3" disabled={disabled}>
        <legend className="sr-only">Escolha o símbolo que compara os dois lados</legend>
        {([">", "<", "="] as SimboloComparacao[]).map(simbolo => (
          <button
            key={simbolo}
            type="button"
            data-simbolo={simbolo}
            aria-label={simbolo === ">" ? "maior que" : simbolo === "<" ? "menor que" : "igual a"}
            onClick={() => responder(simbolo)}
            className="min-h-20 min-w-20 rounded-3xl border-2 border-slate-300 bg-white text-4xl font-black text-slate-900 shadow-sm transition-transform active:scale-95 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600 disabled:opacity-60"
          >
            {simbolo}
          </button>
        ))}
      </fieldset>
    </section>
  );
}
