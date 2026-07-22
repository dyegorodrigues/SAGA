import { Question, Track } from "../types";
import { CATS, CATS_RELACIONADAS, ri, pick, shuffle } from "../utils/generators";
import { PATPOOL, PATSETS, C } from "../components/Mascot";

/**
 * DETETIVE LÓGICO 🕵️ (matemática, ano1 — raciocínio puro)
 * Catálogo linhas 120-123: a habilidade que TRANSFERE para tudo; onde os
 * superdotados prosperam e todos se beneficiam. Reusa kinds existentes
 * (pattern, plain) — nenhum renderizador novo, risco baixo.
 * Progressão: qual não pertence → padrão AB/AAB → analogia → intruso sutil →
 * sequência lógica de 3 elementos. (Sudoku 4×4 fica p/ quando houver grid.)
 * 📚 Raciocínio fluido; matrizes tipo Raven adaptadas.
 */

/** Analogias visuais claras para 6-7 anos: "A → B, C → ?" */
const ANALOGIAS: { a: string; b: string; c: string; d: string; distr: string[] }[] = [
  { a: "🐄", b: "🥛", c: "🐔", d: "🥚", distr: ["🍞", "🐟", "🧀"] }, // o que cada um dá
  { a: "🐝", b: "🍯", c: "🐄", d: "🥛", distr: ["🥚", "🍎", "🧃"] }, // o que produz
  { a: "🐟", b: "💧", c: "🐦", d: "🪹", distr: ["🌳", "🏠", "☁️"] }, // onde vive
  { a: "🐶", b: "🦴", c: "🐰", d: "🥕", distr: ["🍖", "🐟", "🍎"] }, // o que come
  { a: "🐛", b: "🦋", c: "🐣", d: "🐔", distr: ["🥚", "🐤", "🦅"] }, // no que se transforma
  { a: "🌧️", b: "☔", c: "☀️", d: "🕶️", distr: ["🧤", "🧣", "🧥"] }, // do que a gente usa
  { a: "🔑", b: "🔒", c: "✏️", d: "📄", distr: ["📚", "✂️", "🖍️"] }, // com o que combina
];

function buildPattern(unit: string[], reps: number): Question {
  let seq: string[] = [];
  for (let i = 0; i < reps; i++) seq = seq.concat(unit);
  const answer = seq[seq.length - 1];
  const shown = seq.slice(0, seq.length - 1);
  const uniq = [...new Set(unit)];
  const extra = pick(PATPOOL.filter((e) => !uniq.includes(e)));
  const optVals = uniq.length >= 3 ? uniq : [...uniq, extra];
  return {
    kind: "pattern",
    prompt: "Qual continua a sequência? 🕵️",
    shown,
    options: shuffle(optVals).map((e) => ({ label: e, value: e })),
    answer,
  };
}

export function gLogicaDetetive(lvl: number): Question {
  // N1 — qual NÃO pertence (categorias bem diferentes)
  if (lvl === 1) {
    const keys = Object.keys(CATS);
    const catA = pick(keys);
    let catB = pick(keys);
    while (catB === catA) catB = pick(keys);
    const tres = shuffle(CATS[catA]).slice(0, 3);
    const intruso = pick(CATS[catB]);
    return {
      kind: "plain",
      prompt: "Qual NÃO combina com os outros? 🕵️",
      big: null,
      options: shuffle([...tres, intruso].map((e) => ({ label: e, value: e }))),
      answer: intruso,
    };
  }

  // N2 — completar padrão AB / AAB
  if (lvl === 2) {
    const s = pick(PATSETS);
    const unit = Math.random() < 0.5 ? [s[0], s[1]] : [s[0], s[0], s[1]];
    return buildPattern(unit, unit.length === 2 ? 3 : 2);
  }

  // N3 — analogia visual
  if (lvl === 3) {
    const an = pick(ANALOGIAS);
    return {
      kind: "plain",
      prompt: "Complete: pense na regra! 🕵️",
      big: `${an.a} → ${an.b}\n${an.c} → ?`,
      options: shuffle([an.d, ...an.distr].map((e) => ({ label: e, value: e }))),
      answer: an.d,
    };
  }

  // N4 — intruso SUTIL (categorias relacionadas: fruta vs legume, ave vs mamífero)
  if (lvl === 4) {
    const par = pick(CATS_RELACIONADAS);
    const [catA, catB] = Math.random() < 0.5 ? par : [par[1], par[0]];
    const tres = shuffle(CATS[catA]).slice(0, 3);
    const intruso = pick(CATS[catB]);
    return {
      kind: "plain",
      prompt: "Olho de detetive! Qual é o intruso? 🕵️",
      big: null,
      options: shuffle([...tres, intruso].map((e) => ({ label: e, value: e }))),
      answer: intruso,
    };
  }

  // N5 — sequência lógica de 3 elementos (ABC / AAB), mais difícil
  const all = shuffle(PATPOOL);
  const unit = Math.random() < 0.5 ? [all[0], all[1], all[2]] : [all[0], all[1], all[1]];
  return buildPattern(unit, 2);
}

export const TRACKS_LOGICA_ANO1: Track[] = [
  { id: "detetive", name: "Detetive Lógico", icon: "🕵️", color: C.ink, dark: "#0F172A", gen: gLogicaDetetive, prereqs: ["padroes", "intruso"], lvlSkills: ["Qual não pertence?", "Padrões AB e AAB", "Analogias (isto está para aquilo)", "O intruso sutil", "Sequências lógicas"] },
];
