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
import { N1_07 } from "../fichas/jornada/N1.07";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_10 } from "../fichas/jornada/N1.10";
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
  "N1.07": N1_07,
  "N1.08": N1_08,
  "N1.10": N1_10,
  "AL.01": AL_01,

  // AL.02 nunca teve ficha em runtime: era servida por `gAL_02`, que devolve
  // sempre `🔴🔵🔴🔵🔴` com duas alternativas, ignorando o nível. Os cinco
  // degraus da F52 §5 não existiam. Registrada aqui e NÃO ativada.
  "AL.02": AL_02,
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

  // Estes JÁ eram servidos por ficha em produção antes do commit que fechou a
  // porta dos fundos. Ativá-los lá não mudou uma tela sequer: regularizou um
  // estado que já existia e passou a permitir rollback, que antes não existia.
  // Não confundir com ativação de canário novo — essa continua exigindo PR
  // próprio, e é por isso que o N1.01 NÃO está nesta lista.
  "N1.07", "N1.10", "AL.01",

  // O N1.04 SAIU daqui quando a ficha dele foi reescrita para `TouchCount`
  // (F01) e a tela virou outra: ativá-la no mesmo commit que a escreveu é
  // exatamente o que a regra dos PRs separados impede — e é o erro que eu já
  // cometi uma vez com o N1.01. Enquanto isso a produção serve o legado.
  // O N1.02 nasce registrado e desativado, pelo mesmo motivo.
  //
  // **N1.03 e N1.08 SAEM daqui neste commit, e pela mesma regra.** As duas
  // passaram a ser servidas pelo palco novo da fileira (`EmojiRowStage`), com o
  // roteiro da §4, a coreografia da §8 e — no N1.08 — a mão da JD2 nos níveis 1
  // e 2. É tela nova; tela nova não estreia no PR que a escreve.
  //
  // O rollback delas cai em `legadoN1_03` e `legadoN1_08`, que são as telas de
  // relance que a produção servia até aqui — mesmo patamar, não regressão.
  //
  // A AL.02 nasce registrada e desativada: nunca foi canário.
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
