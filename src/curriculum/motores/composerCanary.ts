import { Composer } from "../Composer";
import { FichaCompetencia } from "../schema";
import { N3_09 } from "../fichas/jornada/N3.09";
import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_03 } from "../fichas/jornada/N4.03";
import { N4_04 } from "../fichas/jornada/N4.04";
import { N4_07 } from "../fichas/jornada/N4.07";
import { N4_06 } from "../fichas/jornada/N4.06";
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
  // Implementada e verificada, NÃO ativada: a estreia é outro PR.
  "N4.06": N4_06,
};

/**
 * Nós efetivamente servidos pelo Composer em produção.
 *
 * O rollback é a retirada do id deste conjunto e passa a valer na próxima questão
 * gerada, sem exigir rebuild: a decisão é resolvida a cada chamada, não na carga
 * do módulo.
 */
export const COMPOSER_CANARIES = new Set<string>(["N3.09", "N3.10", "N4.03", "N4.04", "N4.07"]);

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
