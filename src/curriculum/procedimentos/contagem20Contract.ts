import { FichaCompetencia } from "../schema";
import { Option, Question } from "../../types";
import { MisconceptionTag } from "../../constants/misconceptions";

const EMOJIS = ["🍎", "🥕", "🐟", "⭐", "🚗", "⚽"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numericOptions(answer: number, min: number, max: number): Option[] {
  const values = [answer, answer - 1, answer + 1, answer - 2, answer + 2]
    .filter(value => value >= min && value <= max);
  return [...new Set(values)].slice(0, 4)
    .map(value => ({
      label: String(value),
      value,
      ...(value !== answer && Math.abs(value - answer) === 1
        ? { misconception: MisconceptionTag.OFF_BY_ONE }
        : {}),
    }))
    .sort(() => Math.random() - 0.5);
}

function sequenceOptions(
  correct: number[],
  distractors: Array<{ sequence: number[]; misconception?: string }>,
): Option[] {
  const correctValue = correct.join(" · ");
  const candidates: Array<{ value: string; misconception?: string }> = [
    { value: correctValue },
    ...distractors.map(({ sequence, misconception }) => ({
      value: sequence.join(" · "),
      misconception,
    })),
  ];
  const seen = new Set<string>();
  return candidates
    .filter(candidate => {
      if (seen.has(candidate.value)) return false;
      seen.add(candidate.value);
      return true;
    })
    .map(candidate => ({
      label: candidate.value,
      value: candidate.value,
      ...(candidate.misconception ? { misconception: candidate.misconception } : {}),
    }))
    .sort(() => Math.random() - 0.5);
}

function base(ficha: FichaCompetencia, level: number) {
  const microId = ficha.niveis[level]?.micro;
  const micro = microId ? ficha.micros.find(candidate => candidate.id === microId) : undefined;
  if (!micro) throw new Error(`N1.09 sem micro do nível ${level}.`);
  return {
    howto: ficha.howto,
    explain: ficha.explain,
    masteryRule: {
      acertos: micro.dominio?.acertos ?? 4,
      de: micro.dominio?.de ?? 5,
      sessoes: micro.dominio?.sessoes ?? 2,
    },
  };
}

function countObjects(ficha: FichaCompetencia, level: number, min: number, max: number): Question {
  const target = randomInt(min, max);
  const emoji = EMOJIS[randomInt(0, EMOJIS.length - 1)];
  return {
    ...base(ficha, level),
    kind: "scattered",
    prompt: "Conte os objetos. Quantos há?",
    audioPrompt: "Conte os objetos. Quantos há?",
    uiProps: { emoji, n: target, ordered: false },
    answer: target,
    n: target,
    emoji,
    options: numericOptions(target, Math.max(0, target - 2), Math.min(20, target + 2)),
    evaluate: answer => Number(answer) === target,
  };
}

function continueFromN(ficha: FichaCompetencia, level: number): Question {
  const start = randomInt(4, 17);
  const correct = [start + 1, start + 2, start + 3];
  const answer = correct.join(" · ");
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: `Comece no ${start}. Qual trilha continua a contagem certinho?`,
    audioPrompt: `Comece no ${start}. Qual trilha continua a contagem certinho?`,
    big: `${start} → …`,
    uiProps: { text: `${start} → …` },
    answer,
    options: sequenceOptions(correct, [
      {
        sequence: [start, start + 1, start + 2],
        misconception: MisconceptionTag.OFF_BY_ONE,
      },
      {
        sequence: [1, 2, 3],
        misconception: MisconceptionTag.NAO_CONTA_A_PARTIR_DE,
      },
      // Ordem quebrada sem hipótese causal segura: registra apenas o erro,
      // sem fabricar diagnóstico no Radar.
      { sequence: [start + 1, start + 3, start + 2] },
    ]),
    evaluate: candidate => String(candidate) === answer,
  };
}

function countdown(ficha: FichaCompetencia, level: number): Question {
  const start = randomInt(3, 10);
  const correct = [start - 1, start - 2, start - 3];
  const answer = correct.join(" · ");
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: `Comece no ${start} e conte para trás. Qual trilha está certa?`,
    audioPrompt: `Comece no ${start} e conte para trás. Qual trilha está certa?`,
    big: `${start} → …`,
    uiProps: { text: `${start} → …` },
    answer,
    options: sequenceOptions(correct, [
      {
        sequence: [start, start - 1, start - 2],
        misconception: MisconceptionTag.OFF_BY_ONE,
      },
      {
        sequence: [start + 1, start + 2, start + 3],
        misconception: MisconceptionTag.DIRECAO_ERRADA,
      },
      { sequence: [start - 1, start - 3, start - 2] },
    ]),
    evaluate: candidate => String(candidate) === answer,
  };
}

/**
 * Builder autoral de N1.09. Ele mora na camada de procedimentos porque a
 * evidência aqui é uma sequência de três passos — não um simples sucessor — e
 * precisa distinguir "partir de N" de voltar ao 1 em silêncio.
 */
export function construirContagem20Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N1.09") throw new Error(`contagem20Contract recebeu ${ficha.id}.`);
  if (level === 1) return countObjects(ficha, level, 10, 15);
  if (level === 2) return countObjects(ficha, level, 10, 20);
  if (level === 3) return continueFromN(ficha, level);
  if (level === 4) return countdown(ficha, level);
  if (level === 5) {
    const family = randomInt(0, 2);
    if (family === 0) return countObjects(ficha, level, 10, 20);
    if (family === 1) return continueFromN(ficha, level);
    return countdown(ficha, level);
  }
  throw new Error(`Nível inválido de N1.09: ${level}.`);
}