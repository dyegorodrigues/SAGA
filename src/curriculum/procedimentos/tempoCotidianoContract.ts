import { MisconceptionTag } from "../../constants/misconceptions";
import { Option, Question } from "../../types";
import { FichaCompetencia } from "../schema";

const PARTES_DO_DIA = [
  { value: "manha", label: "🌅", say: "manhã" },
  { value: "tarde", label: "☀️", say: "tarde" },
  { value: "noite", label: "🌙", say: "noite" },
] as const;

const CENAS_DIA = [
  { value: "manha", big: "🌅  🛏️➡️🪥", audio: "O sol está nascendo e é hora de acordar. Que parte do dia é?" },
  { value: "tarde", big: "☀️  🏫➡️⚽", audio: "O sol está alto e a brincadeira acontece depois do almoço. Que parte do dia é?" },
  { value: "noite", big: "🌙  🍽️➡️🛏️", audio: "A lua apareceu e está chegando a hora de dormir. Que parte do dia é?" },
] as const;

const EVENTOS_RELATIVOS = [
  [
    { icon: "🛝", say: "parque" },
    { icon: "🏫", say: "escola" },
    { icon: "🏊", say: "natação" },
  ],
  [
    { icon: "🎂", say: "aniversário" },
    { icon: "📚", say: "biblioteca" },
    { icon: "⚽", say: "futebol" },
  ],
  [
    { icon: "🎨", say: "pintura" },
    { icon: "🎹", say: "piano" },
    { icon: "🚲", say: "bicicleta" },
  ],
] as const;

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"] as const;

const ROTINAS = [
  {
    name: "manhã",
    steps: [
      { icon: "🛏️", say: "acordar" },
      { icon: "🪥", say: "escovar os dentes" },
      { icon: "🥣", say: "tomar café da manhã" },
    ],
  },
  {
    name: "dia de aula",
    steps: [
      { icon: "🎒", say: "arrumar a mochila" },
      { icon: "🏫", say: "ir para a escola" },
      { icon: "🏠", say: "voltar para casa" },
    ],
  },
  {
    name: "refeição",
    steps: [
      { icon: "🥕", say: "preparar os alimentos" },
      { icon: "🍲", say: "cozinhar" },
      { icon: "🍽️", say: "comer" },
    ],
  },
] as const;

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = randomInt(0, index);
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
}

function base(ficha: FichaCompetencia, level: number) {
  const microId = ficha.niveis[level]?.micro;
  const micro = microId ? ficha.micros.find(candidate => candidate.id === microId) : undefined;
  if (!micro) throw new Error(`GM.02 sem micro do nível ${level}.`);
  return {
    howto: ficha.howto,
    explain: ficha.explain,
    audibleOptions: true,
    masteryRule: {
      acertos: micro.dominio?.acertos ?? 4,
      de: micro.dominio?.de ?? 5,
      sessoes: micro.dominio?.sessoes ?? 2,
    },
  };
}

function dayPartQuestion(ficha: FichaCompetencia, level: number): Question {
  const scene = CENAS_DIA[randomInt(0, CENAS_DIA.length - 1)];
  const options: Option[] = shuffled(PARTES_DO_DIA).map(option => ({ ...option }));
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: "Ouça a cena e escolha a parte do dia.",
    audioPrompt: scene.audio,
    big: scene.big,
    uiProps: { text: scene.big },
    answer: scene.value,
    options,
    sig: `gm02:daypart:${scene.value}`,
    evaluate: candidate => String(candidate) === scene.value,
  };
}

function relativeDayQuestion(ficha: FichaCompetencia, level: number): Question {
  const events = EVENTOS_RELATIVOS[randomInt(0, EVENTOS_RELATIVOS.length - 1)];
  const targetIndex = randomInt(0, 2);
  const relation = ["ontem", "hoje", "amanhã"][targetIndex];
  const answer = events[targetIndex].say;
  const [yesterday, today, tomorrow] = events;
  const audioPrompt = `Ontem foi ${yesterday.say}. Hoje é ${today.say}. Amanhã será ${tomorrow.say}. O que é ${relation}?`;
  const options: Option[] = shuffled(events).map(event => ({
    value: event.say,
    label: event.icon,
    say: event.say,
  }));
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: "Ouça ontem, hoje e amanhã. Escolha o evento pedido.",
    audioPrompt,
    big: `${yesterday.icon}  ←  ${today.icon}  →  ${tomorrow.icon}`,
    uiProps: { text: `${yesterday.icon}  ←  ${today.icon}  →  ${tomorrow.icon}` },
    answer,
    options,
    sig: `gm02:relative:${relation}`,
    evaluate: candidate => String(candidate) === answer,
  };
}

function weekdayQuestion(ficha: FichaCompetencia, level: number): Question {
  const currentIndex = randomInt(0, DIAS.length - 1);
  const asksNext = Math.random() >= 0.5;
  const direction = asksNext ? 1 : -1;
  const targetIndex = (currentIndex + direction + DIAS.length) % DIAS.length;
  const oppositeIndex = (currentIndex - direction + DIAS.length) % DIAS.length;
  const twoStepsIndex = (currentIndex + direction * 2 + DIAS.length * 2) % DIAS.length;
  const current = DIAS[currentIndex];
  const answer = DIAS[targetIndex];
  const relation = asksNext ? "depois" : "antes";
  const values = [answer, DIAS[oppositeIndex], DIAS[twoStepsIndex]];
  const options: Option[] = shuffled(values).map(value => ({
    value,
    label: value,
    say: value,
    ...(value === DIAS[oppositeIndex]
      ? { misconception: MisconceptionTag.DIRECAO_ERRADA }
      : value === DIAS[twoStepsIndex]
        ? { misconception: MisconceptionTag.OFF_BY_ONE }
        : {}),
  }));
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: "Ouça os dias. Você pode tocar no alto-falante de cada opção.",
    audioPrompt: `Hoje é ${current}. Que dia vem ${relation}?`,
    big: `📅  ${current}`,
    uiProps: { text: `📅  ${current}` },
    answer,
    options,
    sig: `gm02:weekday:${asksNext ? "next" : "previous"}`,
    evaluate: candidate => String(candidate) === answer,
  };
}

function eventOrderQuestion(ficha: FichaCompetencia, level: number): Question {
  const routine = ROTINAS[randomInt(0, ROTINAS.length - 1)];
  const correct = routine.steps.map(step => step.icon).join(" → ");
  const correctSay = routine.steps.map(step => step.say).join(", depois ");
  const reversed = [...routine.steps].reverse();
  const swapped = [routine.steps[1], routine.steps[0], routine.steps[2]];
  const candidates = [
    { value: correct, say: correctSay },
    {
      value: reversed.map(step => step.icon).join(" → "),
      say: reversed.map(step => step.say).join(", depois "),
      misconception: MisconceptionTag.ORDEM_ERRADA,
    },
    {
      value: swapped.map(step => step.icon).join(" → "),
      say: swapped.map(step => step.say).join(", depois "),
      misconception: MisconceptionTag.ORDEM_ERRADA,
    },
  ];
  const options: Option[] = shuffled(candidates).map(candidate => ({
    label: candidate.value,
    value: candidate.value,
    say: candidate.say,
    ...(candidate.misconception ? { misconception: candidate.misconception } : {}),
  }));
  return {
    ...base(ficha, level),
    kind: "plain",
    prompt: "Qual sequência de acontecimentos faz sentido?",
    audioPrompt: `Pense na ordem de uma ${routine.name}. Qual sequência acontece primeiro, depois e por último?`,
    big: "1️⃣  →  2️⃣  →  3️⃣",
    uiProps: { text: "1️⃣  →  2️⃣  →  3️⃣" },
    answer: correct,
    options,
    sig: `gm02:order:${routine.name}`,
    evaluate: candidate => String(candidate) === correct,
  };
}

/**
 * P22.5 — GM.02 é uma competência temporal pré-leitora. O texto visível é
 * apoio; `audioPrompt`, `audibleOptions` e `Option.say` carregam a linguagem
 * necessária para que a criança consiga responder sem decodificar palavras.
 */
export function construirTempoCotidianoQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.02") throw new Error(`tempoCotidianoContract recebeu ${ficha.id}.`);
  if (level === 1) return dayPartQuestion(ficha, level);
  if (level === 2) return relativeDayQuestion(ficha, level);
  if (level === 3) return weekdayQuestion(ficha, level);
  if (level === 4) return eventOrderQuestion(ficha, level);
  if (level === 5) {
    const family = randomInt(0, 3);
    if (family === 0) return dayPartQuestion(ficha, level);
    if (family === 1) return relativeDayQuestion(ficha, level);
    if (family === 2) return weekdayQuestion(ficha, level);
    return eventOrderQuestion(ficha, level);
  }
  throw new Error(`Nível inválido de GM.02: ${level}.`);
}