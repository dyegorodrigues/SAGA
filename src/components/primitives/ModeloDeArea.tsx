import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Arranjo } from "./Arranjo";
import { RegiaoSpec } from "../../curriculum/procedimentos/areaContract";

/**
 * O retângulo partido — ficha F68, "modo área" do arranjo.
 *
 * ---
 *
 * **Por que composto de `Arranjo`, e não desenhado do zero.** A ficha pede
 * `ArrayGrid` em modo área, e a razão é pedagógica antes de ser técnica: as
 * regiões **são** arranjos. A criança que chegou aqui já leu `7 × 2` como sete
 * fileiras de dois em N4.03; ver o mesmo quadriculado partido em duas mantém a
 * continuidade. Um desenho novo faria a área parecer outro assunto.
 *
 * **O corte é o vão, não uma linha por cima.** Separar as regiões por um espaço
 * com um traço no meio mostra que o retângulo foi PARTIDO. Uma linha desenhada
 * sobre um bloco contínuo mostraria um retângulo com um risco.
 *
 * **Cada região anuncia o próprio produto parcial, nunca o total.** É a soma
 * que se pede à criança; escrever `52` em qualquer canto transformaria a aula
 * em leitura.
 */

interface Props {
  regioes: RegiaoSpec[];
  /** O corte já vem desenhado (nível 1) ou fica implícito? */
  corteMarcado: boolean;
  /**
   * Qual região a micro-aula está acendendo agora.
   *
   * `null` acende todas por igual. Vem do `tutShow` do GameLoop, alimentado
   * pela coreografia da ficha — sem este fio, declarar coreografia não produz
   * nada na tela (§6.23).
   */
  destacada?: number | null;
  /** O passo final da aula: as regiões deslizam juntando-se. */
  juntando?: boolean;
}

/** O que sobra da tela de 390px depois das margens do palco. */
const LARGURA_UTIL = 300;
/** Teto do quadradinho: acima disso o retângulo fica maior que a atenção. */
const LADO_MAX = 18;
/** Piso: abaixo disso o quadriculado vira textura e some a ideia de contar. */
const LADO_MIN = 5;

export function ModeloDeArea({ regioes, corteMarcado, destacada = null, juntando = false }: Props) {
  const reduzido = Boolean(useReducedMotion());

  // As fileiras do retângulo: com multiplicador de dois dígitos são duas, e é
  // isso que faz as quatro regiões do nível 4 se lerem como um retângulo só.
  const fileiras = [...new Set(regioes.map(r => r.linhas))];

  // UM lado para todas as regiões. Cada arranjo calculando o próprio fazia a
  // região de 5 colunas sair com células menores que a de 10, e o retângulo
  // partido virava quatro grades soltas — as bordas não encostavam. É o
  // retângulo INTEIRO que manda no tamanho, não cada pedaço. Ver §6.33.
  const colunasTotais = regioes
    .filter(r => r.linhas === fileiras[0])
    .reduce((s, r) => s + r.colunas, 0);
  const linhasTotais = fileiras.reduce((s, n) => s + n, 0);
  const lado = Math.max(
    LADO_MIN,
    Math.min(
      LADO_MAX,
      Math.floor(LARGURA_UTIL / Math.max(colunasTotais, 1)),
      // Altura também limita: um retângulo de 13 fileiras não pode empurrar as
      // alternativas para fora da tela.
      Math.floor(260 / Math.max(linhasTotais, 1)),
    ),
  );

  const rotulo = juntando
    ? `As partes do retângulo se juntam: ${regioes.map(r => r.valor).join(" mais ")}.`
    : `Retângulo partido em ${regioes.length} ${regioes.length === 1 ? "parte" : "partes"}: `
      + regioes.map(r => `${r.descricao}, que vale ${r.valor}`).join("; ");

  return (
    <div role="group" aria-label={rotulo} className="w-full overflow-hidden">
      <div className="mx-auto flex w-fit flex-col" style={{ gap: corteMarcado ? 10 : 4 }}>
        {fileiras.map(linhas => (
          <div key={linhas} className="flex items-start" style={{ gap: corteMarcado ? 10 : 4 }}>
            {regioes
              .map((r, i) => ({ r, i }))
              .filter(({ r }) => r.linhas === linhas)
              .map(({ r, i }, iColuna) => (
                <React.Fragment key={i}>
                  {iColuna > 0 && corteMarcado && (
                    // O traço do corte mora NO VÃO. É o que mostra que o
                    // retângulo foi partido, em vez de riscado por cima.
                    <div
                      aria-hidden="true"
                      className="self-stretch border-l-2 border-dashed border-purple-400"
                    />
                  )}
                  <motion.div
                    className="flex flex-col items-center gap-1"
                    animate={juntando && !reduzido ? { x: iColuna > 0 ? -6 : 6 } : { x: 0 }}
                    transition={{ duration: reduzido ? 0 : 0.5, ease: "easeOut" }}
                    style={{ opacity: destacada === null || destacada === i ? 1 : 0.3 }}
                  >
                    <Arranjo
                      linhas={r.linhas}
                      colunas={r.colunas}
                      descricao={r.descricao}
                      lado={lado}
                    />
                    <span
                      aria-hidden="true"
                      className="text-sm font-black"
                      style={{ color: destacada === i ? "#7E22CE" : "#64748B" }}
                    >
                      {r.valor}
                    </span>
                  </motion.div>
                </React.Fragment>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
