import { Composer } from "../Composer";
import { FichaCompetencia } from "../schema";
import { N3_09 } from "../fichas/jornada/N3.09";
import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_03 } from "../fichas/jornada/N4.03";
import { N4_04 } from "../fichas/jornada/N4.04";
import { N4_07 } from "../fichas/jornada/N4.07";
import { N4_06 } from "../fichas/jornada/N4.06";
import { N4_08 } from "../fichas/jornada/N4.08";
import { N4_09 } from "../fichas/jornada/N4.09";
import { N1_01 } from "../fichas/jornada/N1.01";
import { N1_02 } from "../fichas/jornada/N1.02";
import { N1_03 } from "../fichas/jornada/N1.03";
import { N1_04 } from "../fichas/jornada/N1.04";
import { N1_06 } from "../fichas/jornada/N1.06";
import { N1_07 } from "../fichas/jornada/N1.07";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_13 } from "../fichas/jornada/N1.13";
import { GE_01 } from "../fichas/jornada/GE.01";
import { GE_02 } from "../fichas/jornada/GE.02";
import { GM_01 } from "../fichas/jornada/GM.01";
import { N1_10 } from "../fichas/jornada/N1.10";
import { N1_11 } from "../fichas/jornada/N1.11";
import { AL_01 } from "../fichas/jornada/AL.01";
import { AL_02 } from "../fichas/jornada/AL.02";
import { Question, Track } from "../../types";

type Generator = (level: number) => Question;

export type GeneratorSource = NonNullable<Track["generatorSource"]>;

/**
 * Fichas autorais aptas a substituir um gerador legado em produção.
 *
 * Registrar aqui não ativa nada: implementação e ativação são passos distintos.
 * A ativação é a entrada no conjunto de canários abaixo.
 */
const COMPOSER_FICHAS: Record<string, FichaCompetencia> = {
  "N3.09": N3_09,
  "N3.10": N3_10,
  "N4.03": N4_03,
  "N4.04": N4_04,
  "N4.07": N4_07,
  "N4.06": N4_06,
  "N4.08": N4_08,
  "N4.09": N4_09,

  // Bloco F0. Estes sete serviam ficha autoral chamando `Composer.generate`
  // direto de dentro do gerador "legado" — o que fazia `selectGenerator`
  // classificá-los como `legacy` enquanto entregava conteúdo de ficha, e
  // transformava o rollback num no-op. Registrados aqui, passam pela mesma
  // ponte que todos os outros. Ver PLANO_DO_BLOCO_F0.md §1.
  "N1.01": N1_01,
  "N1.02": N1_02,
  "N1.03": N1_03,
  "N1.04": N1_04,

  // N1.06 nunca teve ficha em runtime, e o gerador dela ESCREVIA o número por
  // extenso na tela ("🔊 TRÊS"): a única competência do app que existe para não
  // depender de leitura era resolvida lendo. Registrada aqui e NÃO ativada.
  "N1.06": N1_06,
  "N1.07": N1_07,
  "N1.08": N1_08,

  // N1.13 — a F04, "produzir quantidade". O nó é NOVO: a ficha reivindicava a
  // N1.09, mas quatro arestas do grafo dependem da N1.09 significar "contar até
  // 20". São duas competências reais; cada uma ganhou seu nó (P12, §13 do
  // plano). Registrada aqui e NÃO ativada.
  "N1.13": N1_13,
  // N1.10 foi REESCRITA: servia `bond` (o diagrama parte-todo, simbólico) nos
  // cinco níveis, e a JD5 pede a tampa deslizando sobre o grupo — a operação
  // mental ANTES do símbolo. Estava ativa; saiu dos canários por isso.
  "N1.10": N1_10,

  // N1.11 não tinha ficha nenhuma, e tem DUAS no cânone (F28 e JD3). Esta é a
  // JD3 — os amigos do 10 como percepção do vazio, antes de virarem conta.
  "N1.11": N1_11,
  "AL.01": AL_01,

  // AL.02 nunca teve ficha em runtime: era servida por `gAL_02`, que devolve
  // sempre `🔴🔵🔴🔵🔴` com duas alternativas, ignorando o nível. Os cinco
  // degraus da F52 §5 não existiam. Registrada aqui e NÃO ativada.
  "AL.02": AL_02,

  // GE.01 era servida por `gGE_01`, que desenhava "🐈\n📦" num bloco de texto e
  // pedia a resposta em PALAVRAS ("Em cima"/"Embaixo") — leitura, numa
  // competência de faixa F0. Registrada aqui e NÃO ativada.
  "GE.01": GE_01,

  // GE.02 era servida por `gGE_02`, uma questão fixa com dois emojis: "🔴 ou
  // 🟥?". Emoji NÃO GIRA — a única coisa que a F48 existe para ensinar não
  // tinha como acontecer na tela. Registrada aqui e NÃO ativada.
  "GE.02": GE_02,

  // GM.01 não tinha gerador NENHUM: não está em `curriculum.ts`, e caía no
  // fallback genérico. Uma competência de faixa F0 com duas fichas escritas no
  // cânone e zero código. Registrada aqui e NÃO ativada.
  "GM.01": GM_01,
};

/**
 * Nós efetivamente servidos pelo Composer em produção.
 *
 * O rollback é a retirada do id deste conjunto e passa a valer na próxima questão
 * gerada, sem exigir rebuild: a decisão é resolvida a cada chamada, não na carga
 * do módulo.
 */
export const COMPOSER_CANARIES = new Set<string>([
  "N3.09", "N3.10", "N4.03", "N4.04", "N4.07", "N4.06", "N4.08",
  "N1.07",

  // A N1.10 SAIU daqui: a ficha dela foi reescrita de `bond` (diagrama
  // parte-todo, com números escritos) para a JD5 de verdade — a tampa que cobre
  // parte do grupo, sem símbolo nenhum. É tela nova, e tela nova não estreia no
  // PR que a escreve. O rollback cai em `gN1_10`, que é o bond que ela serve
  // hoje.

  // A AL.01 SAIU daqui: a ficha dela foi reescrita de `intruso_math` ("qual é
  // o diferente?", múltipla escolha) para a F51 de verdade — separar peças em
  // laços, com o "não pertence" como resposta. É tela nova, e tela nova não
  // estreia no PR que a escreve. O rollback cai em `legadoAL_01`, que é o
  // intruso que ela serve hoje.

  // ---- ATIVAÇÃO do bloco F0 ----------------------------------------
  //
  // Estas seis foram escritas, medidas e olhadas nos passos 0 a 2, e ficaram
  // desligadas o tempo todo — a regra do Padrão Ouro §7 diz que tela nova não
  // estreia no PR que a escreve, e ela existe porque eu já a quebrei uma vez.
  //
  // O intervalo cumpriu o papel: foi com elas desligadas que apareceram o
  // canhão que faltava na F27, a barra de alternativas duplicada do N1.01, o
  // enunciado saindo duas vezes em três palcos, a mão que não parecia mão e o
  // banco do padrão sem o distrator que o diagnóstico precisa.
  //
  // O que cada uma passa a servir:
  //   N1.01  pareamento (F07)      — comparar sem contar, sem numeral nenhum
  //   N1.02  canhão de balões (F27)— um tiro, um balão, um número
  //   N1.03  olhômetro (JD1)       — reconhecer sem contar
  //   N1.04  contar tocando (F01)  — o último número dito É o total
  //   N1.08  a mão + a moldura     — a âncora do 5 (JD2 nos níveis 1-2, F02 no resto)
  //   AL.02  padrões (F52)         — a regra de repetição, cinco degraus de verdade
  "N1.01", "N1.02", "N1.03", "N1.04", "N1.08", "AL.02",
]);

export interface GeneratorBinding {
  /** Resolve a origem a cada questão, refletindo o estado atual dos canários. */
  gen: Generator;
  /** Proveniência observável; avaliada na leitura, nunca congelada. */
  source(): GeneratorSource;
}

export function hasComposerFicha(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMPOSER_FICHAS, id);
}

function resolveSource(id: string, legacy: Generator | undefined): GeneratorSource {
  if (COMPOSER_CANARIES.has(id) && hasComposerFicha(id)) return "composer";
  return legacy ? "legacy" : "fallback";
}

/**
 * Liga um nó do grafo ao gerador que deve atendê-lo.
 *
 * Vale para qualquer competência: não existe lista de ids privilegiados, de modo
 * que promover um novo canário exige apenas registrar a ficha e ativar o id.
 */
export function selectGenerator(
  id: string,
  legacy: Generator | undefined,
  fallback: Generator,
): GeneratorBinding {
  return {
    gen: level => {
      switch (resolveSource(id, legacy)) {
        case "composer":
          return Composer.generate(COMPOSER_FICHAS[id], level);
        case "legacy":
          return (legacy as Generator)(level);
        default:
          return fallback(level);
      }
    },
    source: () => resolveSource(id, legacy),
  };
}

/** Ativa o canário de um nó que já possua ficha autoral registrada. */
export function enableComposerCanary(id: string): void {
  if (!hasComposerFicha(id)) {
    throw new Error(
      `Canário inválido para ${id}: registre a ficha autoral em COMPOSER_FICHAS antes de ativar.`,
    );
  }
  COMPOSER_CANARIES.add(id);
}

/** Rollback explícito: o nó volta ao gerador legado na próxima questão. */
export function rollbackComposerCanary(id: string): void {
  COMPOSER_CANARIES.delete(id);
}
