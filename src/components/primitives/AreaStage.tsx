import React from "react";
import { ModeloDeArea } from "./ModeloDeArea";
import { PalcoEscalado } from "./PalcoEscalado";
import { OPERACAO } from "../../styles/coresDeOperacao";
import { AreaSpec } from "../../curriculum/procedimentos/areaContract";

/**
 * A tela de N4.09 — ficha F68, o Modelo de Área.
 *
 * ---
 *
 * **A conta armada aparece ao lado, com as parcelas e sem o total.** É a
 * sincronia entre a região do retângulo e a linha do algoritmo que dá sentido ao
 * "zero da segunda linha": a criança vê que aquela linha é o retângulo das
 * dezenas. Uma conta já somada seria o gabarito com cara de andaime (§6.14) —
 * por isso o traço final fica em aberto.
 */

interface Props {
  spec: AreaSpec;
  onReplay?: () => void;
  /**
   * O que o passo atual da micro-aula manda mostrar.
   *
   * Vem do `tutShow` do GameLoop, alimentado pela coreografia declarada na
   * ficha F68 §8. Sem este fio ligado, declarar coreografia não produz nada na
   * tela — o defeito que atingiu as seis primeiras competências (§6.23).
   */
  mostrar?: {
    cortarRetangulo?: boolean;
    destacarRegiao?: number;
    destacarMedida?: "cima" | "lado";
    juntarRegioes?: boolean;
  } | null;
}

export function AreaStage({ spec, onReplay, mostrar }: Props) {
  const { cor } = OPERACAO.multiplicacao;
  // Durante a aula o corte aparece mesmo nos níveis em que a criança o faria
  // sozinha: é justamente o que se está ensinando.
  const corteMarcado = spec.corteMarcado || Boolean(mostrar?.cortarRetangulo);

  return (
    <PalcoEscalado>
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <p className="text-4xl font-black" style={{ color: cor }} aria-label={spec.falado}>
          {spec.pergunta}
        </p>
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Ouvir a conta de novo"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-300 bg-indigo-50 text-2xl"
          >
            🔊
          </button>
        )}
      </div>

      {/* O número se ABRINDO, antes do retângulo.
          A tela mostrava o resultado da partição sem mostrar a partição
          acontecendo: a criança via dois quadrados prontos e não via de onde
          eles saíram. Esta linha é o começo do caminho — 15 vira 10 e 5, cada
          parte já na cor da coluna que vai ocupar. Ver §6.35. */}
      {spec.abertura && (
        <p
          role="math"
          aria-label={spec.abertura.falado}
          className="flex items-center gap-1 text-xl font-black text-slate-500"
        >
          <span aria-hidden="true">{spec.abertura.inteiro}</span>
          <span aria-hidden="true" className="text-slate-600">=</span>
          <span aria-hidden="true" style={{ color: "#3730A3" }}>{spec.abertura.dezenas}</span>
          <span aria-hidden="true" className="text-slate-600">+</span>
          <span aria-hidden="true" style={{ color: "#92400E" }}>{spec.abertura.unidades}</span>
        </p>
      )}

      {/* A abertura do MULTIPLICADOR, quando ele também se parte.
          Sem ela o `3` das fileiras aparece do nada, e `10 × 3 = 30` vira um
          número sem origem no meio da tela. Ver §6.35. */}
      {spec.aberturaDoMultiplicador && (
        <p
          role="math"
          aria-label={spec.aberturaDoMultiplicador.falado}
          className="-mt-2 flex items-center gap-1 text-xl font-black text-slate-500"
        >
          <span aria-hidden="true">{spec.aberturaDoMultiplicador.inteiro}</span>
          <span aria-hidden="true" className="text-slate-600">=</span>
          <span aria-hidden="true">{spec.aberturaDoMultiplicador.dezenas}</span>
          <span aria-hidden="true" className="text-slate-600">+</span>
          <span aria-hidden="true">{spec.aberturaDoMultiplicador.unidades}</span>
        </p>
      )}

      {spec.regioes.length > 0 && (
        <ModeloDeArea
          regioes={spec.regioes}
          corteMarcado={corteMarcado}
          regioesSeparadas={spec.regioesSeparadas || Boolean(mostrar?.cortarRetangulo)}
          destacada={mostrar?.destacarRegiao ?? null}
          destacarMedida={mostrar?.destacarMedida ?? null}
          juntando={Boolean(mostrar?.juntarRegioes)}
        />
      )}

      {/* No nível 4 a conta armada fica só na aula: quatro regiões MAIS o
          algoritmo na mesma tela são cinco representações simultâneas, que a
          Bíblia §12.3-bis classifica como boas para ensinar e péssimas para
          avaliar. A sincronia região↔linha continua — acontece na aula. */}
      {spec.algoritmo && (!spec.algoritmoSoNaAula || Boolean(mostrar)) && (
        <div
          role="math"
          aria-label={`Conta armada: ${spec.algoritmo.map(l => `${l.conta} dá ${l.parcela}`).join(", ")}. Falta somar.`}
          className="rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-2 font-mono text-lg font-black text-slate-700"
        >
          {spec.algoritmo.map(l => (
            <div key={l.conta} className="flex justify-between gap-6" aria-hidden="true">
              <span>{l.conta}</span>
              <span>{l.parcela}</span>
            </div>
          ))}
          {/* O traço fica em aberto de propósito: somar é o trabalho da criança. */}
          <div aria-hidden="true" className="mt-1 border-t-2 border-slate-400 pt-1 text-right">?</div>
        </div>
      )}

      {spec.corte && (
        <p className="max-w-[320px] text-center text-sm font-bold text-slate-500">
          {spec.corte}
        </p>
      )}
    </div>
    </PalcoEscalado>
  );
}
