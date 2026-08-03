import { AdditiveSituation, AdditiveStructure, knownTerms } from "./additiveProcedure";
import { StoryBeat } from "./storyBarsContract";

/**
 * Conteúdo narrativo de N3.10, separado do procedimento e do Composer.
 *
 * A história é texto e quantidade; ela não decide cor, tamanho nem animação.
 * Manter este módulo fora do Composer evita que o builder cresça com decisões de
 * conteúdo e torna a narrativa testável isoladamente.
 */

export interface NarrativeContent {
  subject: string;
  partner?: string;
  objectLabel: string;
  emoji: string;
  beats: [StoryBeat, StoryBeat];
  question: string;
}

const NOMES = ["Lia", "Caio", "Nina", "Téo", "Bia", "Davi", "Mel", "Rui"] as const;

const OBJETOS = [
  { label: "estrelas", emoji: "⭐", feminino: true },
  { label: "dinos", emoji: "🦕", feminino: false },
  { label: "maçãs", emoji: "🍎", feminino: true },
  { label: "peixes", emoji: "🐟", feminino: false },
  { label: "flores", emoji: "🌸", feminino: true },
  { label: "bolinhas", emoji: "🔵", feminino: true },
] as const;

export interface NarrativeSeed {
  subjectIndex: number;
  partnerIndex: number;
  objectIndex: number;
}

type Slot = "part1" | "part2" | "whole";
type Phrase = (n: number) => string;

/**
 * Cada estrutura descreve seus três termos em linguagem própria e declara a
 * ordem em que a história os apresenta.
 *
 * O verbo é o que ensina: a criança precisa ouvir "chegaram" ou "foram embora"
 * e reconhecer a estrutura, em vez de caçar a palavra "ao todo".
 */
function phrasesFor(
  structure: AdditiveStructure,
  subject: string,
  partner: string,
  objectLabel: string,
): { fala: Record<Slot, Phrase>; ordem: [Slot, Slot, Slot] } {
  switch (structure) {
    case "join":
      return {
        fala: {
          part1: n => `${subject} tinha ${n} ${objectLabel}.`,
          part2: n => `Então chegaram mais ${n}.`,
          whole: n => `Agora ${subject} tem ${n}.`,
        },
        ordem: ["part1", "part2", "whole"],
      };
    case "separate":
      return {
        fala: {
          whole: n => `${subject} tinha ${n} ${objectLabel}.`,
          part1: n => `Então ${n} foram embora.`,
          part2: n => `Sobraram ${n}.`,
        },
        ordem: ["whole", "part1", "part2"],
      };
    case "compare":
      return {
        fala: {
          whole: n => `${subject} tem ${n} ${objectLabel}.`,
          part1: n => `${partner} tem ${n}.`,
          part2: n => `${subject} tem ${n} a mais que ${partner}.`,
        },
        ordem: ["whole", "part1", "part2"],
      };
    default:
      return {
        fala: {
          part1: n => `${subject} tem ${n} ${objectLabel}.`,
          part2: n => `Faltam ${n} para a meta.`,
          whole: n => `A meta é ${n}.`,
        },
        ordem: ["part1", "part2", "whole"],
      };
  }
}

/**
 * A história narra exclusivamente os dois termos conhecidos.
 *
 * Narrar o termo perguntado entregaria a resposta — falha que aparecia sempre
 * que a incógnita saía da posição direta, ou seja, em todo o nível 5.
 */
function beatsFor(
  structure: AdditiveStructure,
  situation: AdditiveSituation,
  subject: string,
  partner: string,
  objectLabel: string,
): [StoryBeat, StoryBeat] {
  const { fala, ordem } = phrasesFor(structure, subject, partner, objectLabel);
  const conhecidos = ordem.filter(slot => slot !== situation.unknown);
  const [primeiro, segundo] = conhecidos;
  return [
    { role: "initial", text: fala[primeiro](situation[primeiro]), count: situation[primeiro] },
    { role: "change", text: fala[segundo](situation[segundo]), count: situation[segundo] },
  ];
}

/** A pergunta muda com a estrutura e com a posição da incógnita. */
function questionFor(situation: AdditiveSituation, subject: string, objectLabel: string): string {
  const { structure, unknown } = situation;
  if (unknown === "part1") {
    return structure === "join"
      ? `Com quantas ${objectLabel} ${subject} começou?`
      : `Quantas ${objectLabel} havia no começo?`;
  }
  if (unknown === "whole") {
    return structure === "separate"
      ? `Quantas ${objectLabel} ${subject} tinha antes?`
      : `Quantas ${objectLabel} há ao todo?`;
  }
  switch (structure) {
    case "join":
      return `Quantas ${objectLabel} chegaram?`;
    case "separate":
      return `Quantas ${objectLabel} sobraram?`;
    case "compare":
      return `Quantas ${objectLabel} a mais?`;
    default:
      return `Quantas ${objectLabel} faltam?`;
  }
}

export function buildNarrative(
  situation: AdditiveSituation,
  seed: NarrativeSeed,
): NarrativeContent {
  const subject = NOMES[seed.subjectIndex % NOMES.length];
  let partner = NOMES[seed.partnerIndex % NOMES.length];
  if (partner === subject) partner = NOMES[(seed.partnerIndex + 1) % NOMES.length];
  const objeto = OBJETOS[seed.objectIndex % OBJETOS.length];

  return {
    subject,
    partner: situation.structure === "compare" ? partner : undefined,
    objectLabel: objeto.label,
    emoji: objeto.emoji,
    beats: beatsFor(situation.structure, situation, subject, partner, objeto.label),
    question: questionFor(situation, subject, objeto.label),
  };
}

/**
 * A narrativa nunca pode enunciar o número que a pergunta pede: se isso ocorre,
 * a criança lê a resposta em vez de reconhecer a estrutura.
 */
export function narrativeHidesAnswer(
  narrative: NarrativeContent,
  situation: AdditiveSituation,
): boolean {
  const [first, second] = knownTerms(situation);
  const contados = narrative.beats.map(b => b.count);
  return contados.every(c => c === first || c === second);
}
