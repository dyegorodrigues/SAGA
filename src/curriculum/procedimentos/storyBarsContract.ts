import {
  AdditiveSituation,
  AdditiveStructure,
  UnknownSlot,
  isValidTriple,
  showsChangeIllustration,
  solveAdditive,
} from "./additiveProcedure";

/**
 * Contratos de N3.10, deliberadamente separados.
 *
 *   StoryPanel descreve o mundo.
 *   SingaporeBars descreve a matemática.
 *
 * Se a barra carregar personagens, deixa de ser primitiva reutilizável e o
 * diagnóstico não distingue erro de leitura de erro de estrutura. Se o painel
 * desenhar a barra, a narrativa passa a conhecer detalhes internos da primitiva.
 * Por isso os dois specs abaixo não se referenciam: quem os coordena é o Composer.
 */

/** Uma batida da narrativa: o que a cena mostra e o que a voz diz. */
export interface StoryBeat {
  /** `initial` estabelece a situação; `change` mostra o que aconteceu. */
  role: "initial" | "change";
  text: string;
  /** Quantidade visível nesta batida; ausente quando a batida é a incógnita. */
  count?: number;
}

export interface StorySpec {
  subject: string;
  partner?: string;
  objectLabel: string;
  emoji: string;
  beats: [StoryBeat, StoryBeat];
  question: string;
  /** No nível 4 a mudança deixa de ser ilustrada e só a narração sustenta. */
  showChangeIllustration: boolean;
}

/** Um segmento da barra: valor conhecido ou a caixa da incógnita. */
export type BarSlot = { known: true; value: number } | { known: false };

export interface SingaporeBarSpec {
  /**
   * `part-whole` empilha as partes sob o todo — juntar, separar e completar.
   * `comparison` alinha duas barras lado a lado e destaca a diferença.
   */
  layout: "part-whole" | "comparison";
  part1: BarSlot;
  part2: BarSlot;
  whole: BarSlot;
  /** Rótulo semântico de cada segmento, para áudio e leitores de tela. */
  roles: { part1: string; part2: string; whole: string };
}

export interface StoryBarsSpec {
  structure: AdditiveStructure;
  unknown: UnknownSlot;
  story: StorySpec;
  bars: SingaporeBarSpec;
  answer: number;
}

const ROLES: Record<AdditiveStructure, SingaporeBarSpec["roles"]> = {
  join: { part1: "o que tinha", part2: "o que chegou", whole: "o total" },
  separate: { part1: "o que saiu", part2: "o que restou", whole: "o que tinha" },
  compare: { part1: "o menor", part2: "a diferença", whole: "o maior" },
  complete: { part1: "o que já tem", part2: "o que falta", whole: "a meta" },
};

function slot(value: number, hidden: boolean): BarSlot {
  return hidden ? { known: false } : { known: true, value };
}

/** Comparar é a única estrutura que a barra desenha como duas linhas alinhadas. */
export function layoutFor(structure: AdditiveStructure): SingaporeBarSpec["layout"] {
  return structure === "compare" ? "comparison" : "part-whole";
}

export function buildBarSpec(situation: AdditiveSituation): SingaporeBarSpec {
  const { part1, part2, whole, unknown, structure } = situation;
  return {
    layout: layoutFor(structure),
    part1: slot(part1, unknown === "part1"),
    part2: slot(part2, unknown === "part2"),
    whole: slot(whole, unknown === "whole"),
    roles: ROLES[structure],
  };
}

/**
 * Monta o par de specs a partir da situação já resolvida pelo procedimento puro.
 *
 * A narrativa recebe apenas texto e contagem; a barra recebe apenas a relação.
 * Nenhum dos dois decide cor, tamanho ou animação: isso é da camada visual.
 */
export function buildStoryBarsSpec(
  situation: AdditiveSituation,
  narrative: {
    subject: string;
    partner?: string;
    objectLabel: string;
    emoji: string;
    beats: [StoryBeat, StoryBeat];
    question: string;
  },
  level: number,
): StoryBarsSpec {
  if (!isValidTriple(situation)) {
    throw new Error(
      `Tripla aditiva inválida para ${situation.structure}: ${situation.part1} + ${situation.part2} ≠ ${situation.whole}.`,
    );
  }
  if (narrative.beats[0].role !== "initial" || narrative.beats[1].role !== "change") {
    throw new Error("A história precisa de uma batida inicial seguida da mudança.");
  }

  return {
    structure: situation.structure,
    unknown: situation.unknown,
    story: { ...narrative, showChangeIllustration: showsChangeIllustration(level) },
    bars: buildBarSpec(situation),
    answer: solveAdditive(situation),
  };
}

/** A caixa da incógnita aparece exatamente uma vez na barra. */
export function hasSingleUnknown(bars: SingaporeBarSpec): boolean {
  return [bars.part1, bars.part2, bars.whole].filter(s => !s.known).length === 1;
}

/** A narrativa não pode revelar o número que a pergunta pede. */
export function revealsAnswer(spec: StoryBarsSpec): boolean {
  return spec.story.beats.some(beat => beat.count === spec.answer);
}
