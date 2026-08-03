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
  { plural: "estrelas", singular: "estrela", emoji: "⭐", feminino: true },
  { plural: "dinos", singular: "dino", emoji: "🦕", feminino: false },
  { plural: "maçãs", singular: "maçã", emoji: "🍎", feminino: true },
  { plural: "peixes", singular: "peixe", emoji: "🐟", feminino: false },
  { plural: "flores", singular: "flor", emoji: "🌸", feminino: true },
  { plural: "bolinhas", singular: "bolinha", emoji: "🔵", feminino: true },
] as const;

type Objeto = (typeof OBJETOS)[number];

/** "1 estrela" e não "1 estrelas": concordância de número. */
function nomear(objeto: Objeto, quantidade: number): string {
  return quantidade === 1 ? objeto.singular : objeto.plural;
}

/** "Quantos peixes" e "Quantas flores": concordância de gênero. */
function quantos(objeto: Objeto): string {
  return objeto.feminino ? "Quantas" : "Quantos";
}

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
  objeto: Objeto,
): { fala: Record<Slot, Phrase>; ordem: [Slot, Slot, Slot] } {
  const obj = (n: number) => nomear(objeto, n);
  switch (structure) {
    case "join":
      return {
        fala: {
          part1: n => `${subject} tinha ${n} ${obj(n)}.`,
          part2: n => `Então chegaram mais ${n}.`,
          whole: n => `Agora ${subject} tem ${n}.`,
        },
        ordem: ["part1", "part2", "whole"],
      };
    case "separate":
      return {
        fala: {
          whole: n => `${subject} tinha ${n} ${obj(n)}.`,
          part1: n => `Então ${n} foram embora.`,
          part2: n => `Sobraram ${n}.`,
        },
        ordem: ["whole", "part1", "part2"],
      };
    case "compare":
      return {
        fala: {
          whole: n => `${subject} tem ${n} ${obj(n)}.`,
          part1: n => `${partner} tem ${n}.`,
          part2: n => `${subject} tem ${n} a mais que ${partner}.`,
        },
        ordem: ["whole", "part1", "part2"],
      };
    default:
      return {
        fala: {
          part1: n => `${subject} tem ${n} ${obj(n)}.`,
          part2: n => `Faltam ${n} para a meta.`,
          whole: n => `A meta é ${n}.`,
        },
        ordem: ["part1", "part2", "whole"],
      };
  }
}

/**
 * Um conectivo de sequência não pode abrir a história: "Então 2 foram embora"
 * pressupõe uma cena anterior que a criança não viu. Quando a fala de
 * transformação cai na primeira batida, o conectivo sai.
 */
function semConectivo(texto: string): string {
  const semEntao = texto.replace(/^Então\s+/, "");
  return semEntao === texto ? texto : semEntao.charAt(0).toUpperCase() + semEntao.slice(1);
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
  objeto: Objeto,
): [StoryBeat, StoryBeat] {
  const { fala, ordem } = phrasesFor(structure, subject, partner, objeto);
  const conhecidos = ordem.filter(slot => slot !== situation.unknown);
  const [primeiro, segundo] = conhecidos;
  return [
    { role: "initial", text: semConectivo(fala[primeiro](situation[primeiro])), count: situation[primeiro] },
    { role: "change", text: fala[segundo](situation[segundo]), count: situation[segundo] },
  ];
}

/** A pergunta muda com a estrutura e com a posição da incógnita. */
function questionFor(situation: AdditiveSituation, subject: string, objeto: Objeto): string {
  const { structure, unknown } = situation;
  const q = quantos(objeto);
  const nome = objeto.plural;
  if (unknown === "part1") {
    return structure === "join"
      ? `Com ${q.toLowerCase()} ${nome} ${subject} começou?`
      : `${q} ${nome} havia no começo?`;
  }
  if (unknown === "whole") {
    return structure === "separate"
      ? `${q} ${nome} ${subject} tinha antes?`
      : `${q} ${nome} há ao todo?`;
  }
  switch (structure) {
    case "join":
      return `${q} ${nome} chegaram?`;
    case "separate":
      return `${q} ${nome} sobraram?`;
    case "compare":
      return `${q} ${nome} a mais?`;
    default:
      return `${q} ${nome} faltam?`;
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
    objectLabel: objeto.plural,
    emoji: objeto.emoji,
    beats: beatsFor(situation.structure, situation, subject, partner, objeto),
    question: questionFor(situation, subject, objeto),
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
