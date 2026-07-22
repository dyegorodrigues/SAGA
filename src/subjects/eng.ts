import { Question, Track } from "../types";
import { ri, pick, shuffle } from "../utils/generators";

/**
 * INGLÊS 🇺🇸 (4+) — catálogo linhas 189-208.
 * Método TPR: compreensão antes de produção, imagem↔som DIRETO, zero tradução.
 * O trunfo técnico: o motor de voz fala inglês de graça (lang: "en-US" na fala).
 * Toda questão marca `lang: "en-US"` → a criança OUVE inglês e associa à imagem.
 * Kind "story": a fala (q.story) é a frase em inglês; as opções são emojis.
 */

const EN = "en-US";
type Item = { en: string; emo: string };

function listenTouch(prompt: string, phrase: (it: Item) => string, alvo: Item, pool: Item[], nOpts: number): Question {
  const distr = shuffle(pool.filter((x) => x.emo !== alvo.emo)).slice(0, nOpts - 1);
  return {
    kind: "story",
    prompt, // instrução curta em pt-BR (não é falada em inglês)
    story: phrase(alvo), // fala CURTA em inglês — a palavra-chave, sem repetição
    emoji: "🇺🇸",
    lang: EN,
    // sem `explain`: em inglês, o reforço falado sairia com voz pt-BR (soa mal).
    // A criança já ouviu a palavra inglesa no enunciado; o elogio pt-BR basta.
    // Cada opção tem 🔊 que fala a palavra em inglês (say) — ouvir até decorar!
    audibleOptions: true,
    options: shuffle([alvo, ...distr]).map((x) => ({ label: x.emo, value: x.emo, say: x.en })),
    answer: alvo.emo,
  };
}

/* ---------------- Hello! 👋 (saudações) ---------------- */
const GREETINGS: Item[] = [
  { en: "Hello!", emo: "👋" },
  { en: "Good morning!", emo: "☀️" },
  { en: "Good night!", emo: "🌙" },
  { en: "Thank you!", emo: "🙏" },
  { en: "I love you!", emo: "❤️" },
];
export function gEngHello(lvl: number): Question {
  const nOpts = lvl <= 1 ? 3 : 4;
  const alvo = pick(GREETINGS);
  return listenTouch("👂 Escute e toque!", (it) => it.en, alvo, GREETINGS, nOpts);
}

/* ---------------- Colors 🌈 ---------------- */
const COLORS: Item[] = [
  { en: "red", emo: "🔴" },
  { en: "blue", emo: "🔵" },
  { en: "green", emo: "🟢" },
  { en: "yellow", emo: "🟡" },
  { en: "purple", emo: "🟣" },
  { en: "orange", emo: "🟠" },
];
export function gEngColors(lvl: number): Question {
  const nOpts = [2, 3, 4, 5, 6][Math.min(4, lvl - 1)];
  const alvo = pick(COLORS);
  return listenTouch("👂 Toque na cor!", (it) => `Touch ${it.en}!`, alvo, COLORS, nOpts);
}

/* ---------------- Animals 🐶 ---------------- */
const ANIMALS: Item[] = [
  { en: "dog", emo: "🐶" },
  { en: "cat", emo: "🐱" },
  { en: "bird", emo: "🐦" },
  { en: "fish", emo: "🐟" },
  { en: "cow", emo: "🐄" },
  { en: "horse", emo: "🐴" },
  { en: "duck", emo: "🦆" },
];
export function gEngAnimals(lvl: number): Question {
  const nOpts = [2, 3, 4, 4, 5][Math.min(4, lvl - 1)];
  const alvo = pick(ANIMALS);
  return listenTouch("👂 Ache o bichinho!", (it) => `Where is the ${it.en}?`, alvo, ANIMALS, nOpts);
}

/* ---------------- Numbers 1-10 🔢 (🧠 fio com a matemática) ---------------- */
const NUM_WORDS = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
export function gEngNumbers(lvl: number): Question {
  const max = lvl <= 1 ? 3 : lvl <= 2 ? 5 : lvl <= 3 ? 7 : 10;
  const n = ri(1, max);
  // distratores: números vizinhos
  const distr = new Set<number>();
  let guard = 0;
  while (distr.size < 2 && guard++ < 40) {
    const d = n + pick([-2, -1, 1, 2]);
    if (d >= 1 && d <= 10 && d !== n) distr.add(d);
  }
  return {
    kind: "story",
    prompt: "👂 Toque no número!",
    story: `Number ${NUM_WORDS[n]}!`,
    emoji: "🔢",
    lang: EN,
    audibleOptions: true,
    options: shuffle([n, ...distr]).map((x) => ({ label: String(x), value: x, say: NUM_WORDS[x] })),
    answer: n,
  };
}

const SK_HELLO = ["Ouvir e reconhecer 3 saudações", "Reconhecer 4 saudações", "Todas as saudações", "Revisão rápida", "Domínio das saudações"];
const SK_COLORS = ["2 cores por som", "3 cores por som", "4 cores por som", "5 cores por som", "Todas as 6 cores"];
const SK_ANIMALS = ["2 bichinhos por som", "3 bichinhos por som", "4 bichinhos por som", "Frase completa (Where is...?)", "5 bichinhos, só de ouvido"];
const SK_NUMBERS = ["Números 1 a 3", "Números 1 a 5", "Números 1 a 7", "Números 1 a 10", "Todos, só de ouvido"];

export const TRACKS_ENG_PRE: Track[] = [
  { id: "eng_hello", name: "Hello!", icon: "👋", color: "#0EA5E9", dark: "#0369A1", gen: gEngHello, prereqs: [], lvlSkills: SK_HELLO },
  { id: "eng_colors", name: "Colors", icon: "🌈", color: "#F43F5E", dark: "#BE123C", gen: gEngColors, prereqs: [], lvlSkills: SK_COLORS },
  { id: "eng_animals", name: "Animals", icon: "🐶", color: "#10B981", dark: "#047857", gen: gEngAnimals, prereqs: [], lvlSkills: SK_ANIMALS },
];

export const TRACKS_ENG_ANO1: Track[] = [
  { id: "eng_hello", name: "Hello!", icon: "👋", color: "#0EA5E9", dark: "#0369A1", gen: gEngHello, prereqs: [], lvlSkills: SK_HELLO },
  { id: "eng_colors", name: "Colors", icon: "🌈", color: "#F43F5E", dark: "#BE123C", gen: gEngColors, prereqs: [], lvlSkills: SK_COLORS },
  { id: "eng_numbers", name: "Numbers", icon: "🔢", color: "#0EA5E9", dark: "#0369A1", gen: gEngNumbers, prereqs: [], lvlSkills: SK_NUMBERS },
  { id: "eng_animals", name: "Animals", icon: "🐶", color: "#10B981", dark: "#047857", gen: gEngAnimals, prereqs: [], lvlSkills: SK_ANIMALS },
];
