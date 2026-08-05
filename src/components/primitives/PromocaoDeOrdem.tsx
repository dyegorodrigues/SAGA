import React from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * A micro-aula do deslocamento — ficha F67, coreografia `promoverOrdens`.
 *
 * ---
 *
 * **O problema que ela resolve.** Mostrar o material parado e dizer "cada peça
 * sobe uma casa" pede que a criança IMAGINE a promoção. Quem está aprendendo
 * multiplicação agora não tem essa imagem — ela olha os cubinhos, conta, e a
 * frase passa por cima. O material vira decoração.
 *
 * ---
 *
 * ### Duas versões descartadas, e por quê
 *
 * **1ª — dois passos lado a lado** (cubinho→barra, barra→placa). Tecnicamente
 * certa e ilegível: a barra aparecia DUAS vezes, uma como resultado do primeiro
 * passo e outra como origem do segundo, e o olho lia "duas barras" sem entender
 * por quê.
 *
 * **2ª — escada de três casas.** Resolveu a ambiguidade, mas mentia no ×100. O
 * texto prometia "**cada** peça sobe duas casas" e o desenho mostrava **uma**:
 * o cubinho ia da unidade à centena, e a viagem da barra — dezena para milhar —
 * caía fora da escada. Numa pergunta como `33 × 100`, metade do material da
 * criança ficava sem explicação.
 *
 * ### A forma atual: quatro casas, e TODAS as viagens desenhadas
 *
 * UNIDADE · DEZENA · CENTENA · MILHAR. Com quatro casas, "cada peça sobe N
 * casas" passa a ser verdade no desenho:
 *
 * - **×10** — três saltos de um degrau: unidade→dezena, dezena→centena,
 *   centena→milhar. Cada peça para na casa seguinte.
 * - **×100** — dois saltos de dois degraus: unidade→centena e dezena→milhar. As
 *   peças pulam uma casa, e o arco mostra isso por cima.
 *
 * **Nenhum número aparece.** A demonstração ensina a REGRA; aplicá-la às peças
 * da questão é o trabalho da criança. Mostrar o material já promovido entregaria
 * a resposta com aparência de aula.
 */

interface Props {
  /** Quantas ordens sobem: uma para ×10, duas para ×100. */
  ordens: number;
}

const CASAS = [
  { nome: "UNIDADE", peca: "cubinho" },
  { nome: "DEZENA", peca: "barra" },
  { nome: "CENTENA", peca: "placa" },
  { nome: "MILHAR", peca: "cubao" },
] as const;

type TipoDePeca = (typeof CASAS)[number]["peca"];

const ACESA = "#B45309";
const APAGADA = "#D9BE93";

/** Largura de cada coluna. Quatro cabem em 240px, dentro dos 320 disponíveis. */
const COLUNA = 60;

/** Lado da placa: 10 quadradinhos de 3px + 9 vãos de 1px + 2px de moldura. */
export const PLACA = 10 * 3 + 9 + 2;
/** Recuo entre as placas empilhadas do cubão, nos dois eixos. */
export const PROFUNDIDADE = 8;
/** Altura da faixa das peças: a maior delas é o cubão. */
export const FAIXA = PLACA + PROFUNDIDADE;

/**
 * Onde fica cada uma das três placas do cubão.
 *
 * Exportada para ser MEDIDA por teste. O jsdom não faz layout, então nenhum
 * teste de render pega uma peça vazando da caixa dela — e foi isso que
 * aconteceu: a caixa tinha a altura de uma placa só, as de trás vazavam por
 * baixo e o rótulo MILHAR saía impresso por cima da peça. Só a captura de tela
 * mostrou. Com a geometria em função, a continência vira aritmética verificável.
 */
export function placasDoCubao(): { left: number; top: number }[] {
  return [0, 1, 2].map(i => ({ left: (2 - i) * 4, top: i * 4 }));
}

function Peca({ tipo }: { tipo: TipoDePeca }) {
  if (tipo === "cubinho") {
    return <div className="h-4 w-4 rounded-sm border border-amber-600 bg-amber-400" />;
  }
  if (tipo === "barra") {
    return (
      <div className="flex flex-col gap-[1px] rounded-sm bg-amber-600 p-[1px]">
        {Array.from({ length: 10 }, (_, i) => <div key={i} className="h-[3px] w-4 bg-amber-400" />)}
      </div>
    );
  }
  if (tipo === "placa") {
    return (
      <div className="grid grid-cols-10 gap-[1px] rounded-sm bg-amber-600 p-[1px]">
        {Array.from({ length: 100 }, (_, i) => <div key={i} className="h-[3px] w-[3px] bg-amber-400" />)}
      </div>
    );
  }
  // O cubão do milhar: dez placas empilhadas. O deslocamento em profundidade é
  // o que faz a criança ler volume em vez de "outra placa".
  //
  // A caixa tem PLACA + DESLOCAMENTO em cada eixo. Na primeira versão ela tinha
  // a altura de uma placa só, as de trás vazavam por baixo, e o rótulo MILHAR
  // ficava impresso por cima da peça — ilegível justamente na casa nova.
  return (
    <div className="relative" style={{ width: FAIXA, height: FAIXA }}>
      {placasDoCubao().map(({ left, top }, i) => (
        <div
          key={i}
          className="absolute grid grid-cols-10 gap-[1px] rounded-sm bg-amber-600 p-[1px]"
          // A da frente (i=2) embaixo e à esquerda; as de trás sobem e recuam.
          style={{ left, top, opacity: i === 2 ? 1 : 0.5 }}
        >
          {Array.from({ length: 100 }, (_, j) => <div key={j} className="h-[3px] w-[3px] bg-amber-400" />)}
        </div>
      ))}
    </div>
  );
}

export function PromocaoDeOrdem({ ordens }: Props) {
  const reduzido = Boolean(useReducedMotion());
  /** Um degrau para ×10, dois para ×100. */
  const degraus = Math.min(Math.max(ordens, 1), 2);

  /**
   * As viagens que o desenho precisa mostrar.
   *
   * Toda peça que TEM para onde ir dentro da escada aparece. É isso que torna
   * "cada peça sobe N casas" uma frase verdadeira em vez de uma promessa que o
   * desenho não cumpre.
   */
  const viagens = CASAS
    .map((_, origem) => ({ origem, destino: origem + degraus }))
    .filter(v => v.destino < CASAS.length);

  const largura = CASAS.length * COLUNA;
  const centroDaColuna = (i: number) => i * COLUNA + COLUNA / 2;

  const pulso = reduzido
    ? { duration: 0 }
    : { duration: 0.8, ease: "easeOut" as const, repeat: Infinity, repeatDelay: 1.1 };

  return (
    <div
      role="img"
      // Nomeia a PEÇA e a CASA, e descreve TODAS as viagens. Só as casas seria
      // abstrato demais para quem ouve; só uma viagem repetiria o erro da versão
      // anterior, em que o texto prometia mais do que o desenho mostrava.
      aria-label={degraus === 2
        ? "Demonstração: cada peça sobe duas casas de uma vez, pulando uma casa no caminho. O cubinho da unidade vira placa na centena, e a barra da dezena vira cubão no milhar."
        : "Demonstração: cada peça sobe uma casa. O cubinho da unidade vira barra na dezena, a barra vira placa na centena, e a placa vira cubão no milhar."}
      className="w-full overflow-hidden rounded-xl bg-amber-50 py-2"
    >
      <div className="relative mx-auto" style={{ width: largura }}>
        {/* Os arcos das viagens, por cima das casas. */}
        <svg width={largura} height={32} aria-hidden="true" className="block">
          {viagens.map(({ origem, destino }) => {
            const x1 = centroDaColuna(origem);
            const x2 = centroDaColuna(destino);
            // O salto de duas casas sobe MUITO mais alto que o de uma. É o único
            // sinal do desenho que separa "pula uma casa" de "vai para a
            // vizinha" — sem ele o ×100 vira o ×10 com outra legenda.
            const altura = degraus === 2 ? 1 : 16;
            return (
              <motion.path
                key={`${origem}-${destino}`}
                d={`M ${x1} 28 Q ${(x1 + x2) / 2} ${altura} ${x2} 28`}
                fill="none"
                stroke={ACESA}
                strokeWidth={2.5}
                strokeLinecap="round"
                markerEnd="url(#ponta)"
                initial={reduzido ? false : { pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ ...pulso, delay: reduzido ? 0 : origem * 0.22 }}
              />
            );
          })}
          <defs>
            <marker id="ponta" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill={ACESA} />
            </marker>
          </defs>
        </svg>

        {/* As casas, cada peça uma vez só, no lugar dela. */}
        <div className="flex items-end">
          {CASAS.map((casa, i) => {
            const participa = viagens.some(v => v.origem === i || v.destino === i);
            return (
              <div key={casa.nome} className="flex flex-col items-center gap-1" style={{ width: COLUNA }}>
                <div className="flex items-end justify-center" style={{ height: FAIXA }}>
                  <motion.div
                    initial={reduzido ? false : { opacity: 0.35, scale: 0.9 }}
                    animate={{ opacity: participa ? 1 : 0.35, scale: 1 }}
                    transition={{ ...pulso, delay: reduzido ? 0 : i * 0.22 }}
                  >
                    <Peca tipo={casa.peca} />
                  </motion.div>
                </div>
                <span
                  aria-hidden="true"
                  className="text-[8px] font-black tracking-wide"
                  style={{ color: participa ? ACESA : APAGADA }}
                >
                  {casa.nome}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
