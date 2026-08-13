import { Composer } from "../Composer";
import { FichaCompetencia } from "../schema";
import { N3_01 } from "../fichas/jornada/N3.01";
import { N3_02 } from "../fichas/jornada/N3.02";
import { N3_03 } from "../fichas/jornada/N3.03";
import { N3_09 } from "../fichas/jornada/N3.09";
import { N3_10 } from "../fichas/jornada/N3.10";
import { N4_01 } from "../fichas/jornada/N4.01";
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
import { N1_05 } from "../fichas/jornada/N1.05";
import { N1_06 } from "../fichas/jornada/N1.06";
import { N1_07 } from "../fichas/jornada/N1.07";
import { N1_08 } from "../fichas/jornada/N1.08";
import { N1_09 } from "../fichas/jornada/N1.09";
import { N1_12 } from "../fichas/jornada/N1.12";
import { N1_13 } from "../fichas/jornada/N1.13";
import { N2_01 } from "../fichas/jornada/N2.01";
import { N2_02 } from "../fichas/jornada/N2.02";
import { N2_03 } from "../fichas/jornada/N2.03";
import { GE_01 } from "../fichas/jornada/GE.01";
import { GE_02 } from "../fichas/jornada/GE.02";
import { GM_01 } from "../fichas/jornada/GM.01";
import { GM_02 } from "../fichas/jornada/GM.02";
import { GM_05 } from "../fichas/jornada/GM.05";
import { GM_12 } from "../fichas/jornada/GM.12";
import { N1_10 } from "../fichas/jornada/N1.10";
import { N1_11 } from "../fichas/jornada/N1.11";
import { AL_01 } from "../fichas/jornada/AL.01";
import { AL_02 } from "../fichas/jornada/AL.02";
import { AL_03 } from "../fichas/jornada/AL.03";
import { construirComparacaoQuantidadeQuestion } from "../procedimentos/comparacaoQuantidadeContract";
import { construirComparacaoSimbolicaQuestion } from "../procedimentos/comparacaoSimbolicaContract";
import { construirContagem20Question } from "../procedimentos/contagem20Contract";
import { construirReta20Question } from "../procedimentos/reta20Contract";
import { construirReguaQuestion } from "../procedimentos/reguaContract";
import { construirDezenaUnidadesQuestion } from "../procedimentos/materialDouradoContract";
import { construirQuadrado100Question } from "../procedimentos/quadrado100Contract";
import { construirTempoCotidianoQuestion } from "../procedimentos/tempoCotidianoContract";
import { construirVisualAdditionQuestion } from "../procedimentos/visualAdditionContract";
import { construirEmojiRowRiscarQuestion } from "../procedimentos/emojiRowRiscarContract";
import { construirCountingOnQuestion } from "../procedimentos/countingOnContract";
import { construirSkipCountF30Question } from "../procedimentos/skipCountContract";
import { construirEqualGroupsQuestion } from "../procedimentos/equalGroupsContract";
import { Question, Track } from "../../types";
import { DEFAULT_COMPOSER_CANARY_IDS } from "./composerCanaryIds";

type Generator = (level: number) => Question;
type SpecializedBuilder = (ficha: FichaCompetencia, level: number) => Question;

export type GeneratorSource = NonNullable<Track["generatorSource"]>;

/**
 * Fichas autorais aptas a substituir um gerador legado em produção.
 *
 * Registrar aqui NÃO ativa nada. A ativação declarativa vive exclusivamente em
 * `composerCanaryIds.ts`, e o estado mutável de runtime fica em
 * `COMPOSER_CANARIES` abaixo.
 */
const COMPOSER_FICHAS: Record<string, FichaCompetencia> = {
  "N3.01": N3_01,
  // W9: F15 registrada e INATIVA. O modo riscar só substitui `subvis` depois
  // de alfabetização do X, Stage autoral, domínio limpo, a11y e Chrome real.
  "N3.02": N3_02,
  // W10: F14 registrada e INATIVA. É a primeira família de produção que nasce
  // com `resolucao()` calculada do item sob o contrato R0-A.
  "N3.03": N3_03,
  "N3.09": N3_09,
  "N3.10": N3_10,
  // W12: F97 registrada e INATIVA. Grupos iguais reutiliza Grupo e só substitui
  // gN4_01 após gates + Chrome real no mesmo SHA.
  "N4.01": N4_01,
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
  "N1.05": N1_05,
  // F05: legado escreve o número por extenso; a ficha autoral usa áudio.
  "N1.06": N1_06,
  "N1.07": N1_07,
  "N1.08": N1_08,
  // P22.4: contagem até 20; desligado volta ao gVis_Sequence legado.
  "N1.09": N1_09,
  // W4: F19 registrada sem ativação. Só entra em produção após contract/palco,
  // filtro motor, evidência, conformidade e CI inativo integralmente verdes.
  "N1.12": N1_12,
  // F04: novo nó de produzir quantidade; desligado volta ao fallback.
  "N1.13": N1_13,
  // P17 fechou a ponte perceptual→parte-todo de N1.10/N1.11.
  "N1.10": N1_10,
  "N1.11": N1_11,
  "N2.01": N2_01,
  // W7: F36 registrada e INATIVA. A estreia de Quadrado100 só pode substituir
  // o legado depois de onboarding, palco, a11y e Chrome real no mesmo contrato.
  "N2.02": N2_02,
  // W6: F29 registrada, mas INATIVA. Reusa Grupo aprendido em N1.05 e só
  // será promovida após suíte, a11y e Chrome real no mesmo contrato.
  "N2.03": N2_03,
  "AL.01": AL_01,
  "AL.02": AL_02,
  // W11: F30 registrada e INATIVA. A mesma reta compartilhada sustenta os
  // degraus iniciais; L3 compõe Quadrado100 e a promoção só ocorre após gates
  // + Chrome real no mesmo SHA.
  "AL.03": AL_03,
  // F47/F48 — geometrias F0 corrigidas e observadas antes de promoção.
  "GE.01": GE_01,
  "GE.02": GE_02,
  // Grandezas F0: comparação, tempo cotidiano e conservação sem unidade.
  "GM.01": GM_01,
  "GM.02": GM_02,
  "GM.12": GM_12,
  // W5 — F61 registrada, mas INATIVA. Só pode ser promovida depois que
  // contrato/palco/filtro motor/a11y/sonda real e CI inativo ficarem verdes.
  "GM.05": GM_05,
};

/** Builders especializados ainda passam pela MESMA porta de registro/ativação. */
const SPECIALIZED_BUILDERS: Partial<Record<string, SpecializedBuilder>> = {
  "N1.05": construirComparacaoQuantidadeQuestion,
  "N1.09": construirContagem20Question,
  "N1.12": construirReta20Question,
  "N2.01": construirDezenaUnidadesQuestion,
  "N2.02": construirQuadrado100Question,
  "N2.03": construirComparacaoSimbolicaQuestion,
  "N3.01": construirVisualAdditionQuestion,
  "N3.02": construirEmojiRowRiscarQuestion,
  "N3.03": construirCountingOnQuestion,
  "N4.01": construirEqualGroupsQuestion,
  "AL.03": construirSkipCountF30Question,
  "GM.02": construirTempoCotidianoQuestion,
  "GM.05": construirReguaQuestion,
};

/**
 * Alguns builders especializados encapsulam uma interação procedural e,
 * portanto, emitem um `Question.kind` deliberadamente diferente da família
 * autoral usada na ficha. Isto é contrato de runtime, não exceção de teste.
 */
const SPECIALIZED_RUNTIME_KIND: Partial<Record<string, string>> = {
  "N1.12": "numberline-f19",
  "N2.01": "material-dourado",
  "N2.02": "quadrado100-f36",
  "N2.03": "comparacao-simbolica",
  "N3.01": "visual-addition-f13",
  "N3.02": "emojirow-riscar-f15",
  "N3.03": "counting-on-f14",
  "N4.01": "equal-groups-f97",
  "AL.03": "skip-count-f30",
  "GM.05": "regua-f61",
};

export function registeredFichaRuntimeKindOverride(id: string): string | undefined {
  return SPECIALIZED_RUNTIME_KIND[id];
}

/** Nós efetivamente servidos pelo Composer neste processo. */
export const COMPOSER_CANARIES = new Set<string>(DEFAULT_COMPOSER_CANARY_IDS);

export interface GeneratorBinding {
  gen: Generator;
  source(): GeneratorSource;
}

export function hasComposerFicha(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(COMPOSER_FICHAS, id);
}

/** Porta única para gerar uma questão autoral registrada. */
export function generateRegisteredFichaQuestion(id: string, level: number): Question {
  const ficha = COMPOSER_FICHAS[id];
  if (!ficha) throw new Error(`Ficha Composer não registrada: ${id}.`);
  const specialized = SPECIALIZED_BUILDERS[id];
  if (specialized) return specialized(ficha, level);
  return Composer.generate(ficha, level);
}

function resolveSource(id: string, legacy: Generator | undefined): GeneratorSource {
  if (COMPOSER_CANARIES.has(id) && hasComposerFicha(id)) return "composer";
  return legacy ? "legacy" : "fallback";
}

/** Liga qualquer competência ao gerador que deve atendê-la. */
export function selectGenerator(id: string, legacy: Generator | undefined, fallback: Generator): GeneratorBinding {
  return {
    gen: level => {
      switch (resolveSource(id, legacy)) {
        case "composer": return generateRegisteredFichaQuestion(id, level);
        case "legacy": return (legacy as Generator)(level);
        default: return fallback(level);
      }
    },
    source: () => resolveSource(id, legacy),
  };
}

/** Ativa em runtime um nó que já possua ficha autoral registrada. */
export function enableComposerCanary(id: string): void {
  if (!hasComposerFicha(id)) {
    throw new Error(`Canário inválido para ${id}: registre a ficha autoral em COMPOSER_FICHAS antes de ativar.`);
  }
  COMPOSER_CANARIES.add(id);
}

/** Rollback explícito: o nó volta ao gerador legado/fallback na próxima questão. */
export function rollbackComposerCanary(id: string): void {
  COMPOSER_CANARIES.delete(id);
}
