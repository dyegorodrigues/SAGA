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
import { N1_09 } from "../fichas/jornada/N1.09";
import { N1_13 } from "../fichas/jornada/N1.13";
import { GE_01 } from "../fichas/jornada/GE.01";
import { GE_02 } from "../fichas/jornada/GE.02";
import { GM_01 } from "../fichas/jornada/GM.01";
import { GM_12 } from "../fichas/jornada/GM.12";
import { N1_10 } from "../fichas/jornada/N1.10";
import { N1_11 } from "../fichas/jornada/N1.11";
import { AL_01 } from "../fichas/jornada/AL.01";
import { AL_02 } from "../fichas/jornada/AL.02";
import { construirContagem20Question } from "../procedimentos/contagem20Contract";
import { Question, Track } from "../../types";
import { DEFAULT_COMPOSER_CANARY_IDS } from "./composerCanaryIds";

type Generator = (level: number) => Question;

export type GeneratorSource = NonNullable<Track["generatorSource"]>;

/**
 * Fichas autorais aptas a substituir um gerador legado em produção.
 *
 * Registrar aqui NÃO ativa nada. A ativação declarativa vive exclusivamente em
 * `composerCanaryIds.ts`, e o estado mutável de runtime fica em
 * `COMPOSER_CANARIES` abaixo.
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

  // Bloco F0 que já possuía ficha autoral ou foi construído nesta linha.
  "N1.01": N1_01,
  "N1.02": N1_02,
  "N1.03": N1_03,
  "N1.04": N1_04,

  // F05: legado escreve o número por extenso; a ficha autoral usa áudio.
  "N1.06": N1_06,
  "N1.07": N1_07,
  "N1.08": N1_08,

  // P22.4: contagem até 20; desligado volta ao gVis_Sequence legado.
  "N1.09": N1_09,

  // F04: novo nó de produzir quantidade; desligado volta ao fallback.
  "N1.13": N1_13,

  // P17 fechou a ponte perceptual→parte-todo de N1.10/N1.11. Estas são as
  // fichas correntes já promovidas; ativação/rollback continuam declarados fora
  // deste registry, em `composerCanaryIds.ts` e `COMPOSER_CANARIES`.
  "N1.10": N1_10,
  "N1.11": N1_11,

  "AL.01": AL_01,
  "AL.02": AL_02,

  // F47/F48 — geometrias F0 corrigidas e observadas antes de promoção.
  "GE.01": GE_01,
  "GE.02": GE_02,

  // F49/F50 — grandezas visíveis e conservação sem unidade.
  "GM.01": GM_01,
  "GM.12": GM_12,
};

/**
 * Nós efetivamente servidos pelo Composer neste processo.
 *
 * O conjunto nasce da lista declarativa versionada, mas continua mutável em
 * runtime para que `enableComposerCanary`/`rollbackComposerCanary` façam a troca
 * na próxima questão sem rebuild. O contrato de canário restaura este conjunto
 * após cada teste.
 */
export const COMPOSER_CANARIES = new Set<string>(DEFAULT_COMPOSER_CANARY_IDS);

export interface GeneratorBinding {
  /** Resolve a origem a cada questão, refletindo o estado atual dos canários. */
  gen: Generator;
  /** Proveniência observável; avaliada na leitura, nunca congelada. */
  source(): GeneratorSource;
}

export function hasComposerFicha(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMPOSER_FICHAS, id);
}

/**
 * Porta única para gerar uma questão autoral registrada.
 *
 * A maioria das fichas usa o Composer genérico. N1.09 exige uma resposta de
 * sequência com três termos para distinguir "partir de N" de um simples
 * sucessor; por isso delega a um contrato procedimental explícito, da mesma
 * forma que outras primitivas autorais delegam seus cálculos a contratos.
 */
export function generateRegisteredFichaQuestion(id: string, level: number): Question {
  const ficha = COMPOSER_FICHAS[id];
  if (!ficha) throw new Error(`Ficha Composer não registrada: ${id}.`);
  if (id === "N1.09") return construirContagem20Question(ficha, level);
  return Composer.generate(ficha, level);
}

function resolveSource(id: string, legacy: Generator | undefined): GeneratorSource {
  if (COMPOSER_CANARIES.has(id) && hasComposerFicha(id)) return "composer";
  return legacy ? "legacy" : "fallback";
}

/**
 * Liga qualquer competência ao gerador que deve atendê-la.
 *
 * Não existe lista paralela de ids privilegiados: uma promoção exige ficha
 * registrada e um id em `composerCanaryIds.ts`; rollback remove o id do conjunto
 * vivo e volta imediatamente ao legado/fallback correspondente.
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
          return generateRegisteredFichaQuestion(id, level);
        case "legacy":
          return (legacy as Generator)(level);
        default:
          return fallback(level);
      }
    },
    source: () => resolveSource(id, legacy),
  };
}

/** Ativa em runtime um nó que já possua ficha autoral registrada. */
export function enableComposerCanary(id: string): void {
  if (!hasComposerFicha(id)) {
    throw new Error(
      `Canário inválido para ${id}: registre a ficha autoral em COMPOSER_FICHAS antes de ativar.`,
    );
  }
  COMPOSER_CANARIES.add(id);
}

/** Rollback explícito: o nó volta ao gerador legado/fallback na próxima questão. */
export function rollbackComposerCanary(id: string): void {
  COMPOSER_CANARIES.delete(id);
}
