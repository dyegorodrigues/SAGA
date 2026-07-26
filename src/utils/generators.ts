import { N1_01 } from "../curriculum/fichas/N1.01";
import { Composer } from "../curriculum/Composer";

import { N1_02 } from "../curriculum/fichas/N1.02";
import { N1_03 } from "../curriculum/fichas/N1.03";
import { N1_04 } from "../curriculum/fichas/N1.04";
import { N1_07 } from "../curriculum/fichas/N1.07";
import { N1_10 } from "../curriculum/fichas/N1.10";
import { Question, Track } from "../types";
import {
  C,
  PATPOOL,
  PATSETS,
  EMO,
  THEMES,
} from "../components/Mascot";

/* ---------------- categorias para intruso e tabelas ---------------- */
export const CATS: Record<string, string[]> = {
  frutas: ["🍎", "🍌", "🍇", "🍓", "🍉", "🍍"],
  legumes: ["🥕", "🥦", "🌽", "🍅", "🥔", "🍆"],
  animais: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻"],
  passaros: ["🦅", "🦆", "🦉", "🐦", "🦜", "🐧"],
  veiculos: ["🚗", "🚌", "🚓", "🚚", "🚜", "✈️"],
  instrumentos: ["🎸", "🥁", "🎹", "🎺", "🎻", "🪗"],
  brinquedos: ["🧸", "🪁", "🎲", "🚂", "🪀", "🎈"],
};

export const CATS_RELACIONADAS = [["frutas", "legumes"], ["animais", "passaros"]];

export const ONDE_ANIM = ["🐱", "🐶", "🐰", "🐢", "🐥", "🦊"];
export const ONDE_FRASE: Record<string, string> = {
  cima: "EM CIMA da mesa",
  baixo: "EMBAIXO da mesa",
  esq: "do lado ESQUERDO da mesa",
  dir: "do lado DIREITO da mesa",
  lado: "AO LADO da mesa"
};

export const NOMES = ["Ana", "Bia", "Leo", "João", "Duda", "Cauã", "Sofia", "Davi"];
export const OBJS = [
  { n: "balas", e: "🍬", f: true },
  { n: "bolinhas", e: "⚪", f: true },
  { n: "maçãs", e: "🍎", f: true },
  { n: "carrinhos", e: "🚗", f: false },
  { n: "adesivos", e: "⭐", f: false },
  { n: "biscoitos", e: "🍪", f: false },
];

export const PICTO_SETS = [
  { title: "Fruta favorita da turma", cats: [["🍎", "a maçã"], ["🍌", "a banana"], ["🍇", "a uva"]] },
  { title: "Bichinho preferido", cats: [["🐶", "o cachorro"], ["🐱", "o gato"], ["🐰", "o coelho"]] },
  { title: "Esporte favorito", cats: [["⚽", "o futebol"], ["🏀", "o basquete"], ["🎾", "o tênis"]] },
  { title: "Como a turma chega na escola", cats: [["🚗", "de carro"], ["🚌", "de ônibus"], ["🚲", "de bicicleta"]] },
];

export const SHAPES = [
  { id: "circ", name: "círculo", art: "no" },
  { id: "quad", name: "quadrado", art: "no" },
  { id: "tri", name: "triângulo", art: "no" },
  { id: "ret", name: "retângulo", art: "no" },
  { id: "est", name: "estrela", art: "na" },
  { id: "cor", name: "coração", art: "no" },
  { id: "los", name: "losango", art: "no" },
];
export const SHAPE_COLORS = [C.sun, C.mint, C.melon, C.grape, C.ocean, C.pink];

/* ---------------- helpers ---------------- */
export const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = <T>(arr: T[]): T => arr[ri(0, arr.length - 1)];
export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const pickEmo = () => {
  const defaultEmojis = THEMES.classico.emojis || EMO;
  return pick(defaultEmojis);
};

export function numOpts(ans: number, count: number, min: number, max: number) {
  const lo = Math.min(min, ans);
  const hi = Math.max(max, ans);
  const d = new Set<number>();
  let guard = 0;
  while (d.size < count - 1 && guard++ < 400) {
    const v = Math.random() < 0.7 ? ans + pick([-3, -2, -1, 1, 2, 3]) : ri(lo, hi);
    if (v !== ans && v >= lo && v <= hi) d.add(v);
  }
  let v = lo;
  while (d.size < count - 1) {
    if (v !== ans) d.add(v);
    v++;
  }
  return shuffle([ans, ...d]).map((n) => ({ label: String(n), value: n }));
}

export const plainQ = (prompt: string, big: string | null, ans: any, count: number, min: number, max: number, explain?: string): Question => ({
  kind: "plain",
  prompt,
  big,
  options: numOpts(Number(ans), count, Math.max(0, min), max),
  answer: ans,
  ...(explain ? { explain } : {}),
});

export const mathQ = (expr: string, ans: number, min: number, max: number, explain?: string): Question => ({
  kind: "math",
  prompt: "Quanto é?",
  expr,
  options: numOpts(ans, 4, Math.max(0, min), max),
  answer: ans,
  ...(explain ? { explain } : {}),
});

export const fmtMoney = (c: number) =>
  c < 100 ? `${c} centavos` : c % 100 === 0 ? `R$ ${c / 100}` : `R$ ${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`;

export function moneyOpts(ans: number, count: number, step: number) {
  const d = new Set<number>();
  let guard = 0;
  while (d.size < count - 1 && guard++ < 200) {
    const v = ans + pick([-3, -2, -1, 1, 2, 3]) * step;
    if (v > 0 && v !== ans) d.add(v);
  }
  let v = step;
  while (d.size < count - 1) {
    if (v !== ans) d.add(v);
    v += step;
  }
  return shuffle([ans, ...d]).map((c) => ({ label: fmtMoney(c), value: c }));
}

/* ---------------- geradores: PRÉ-ESCOLA (4 anos) ---------------- */










export function gN3_01(lvl: number): Question {
  return gVis_VisualAddition(lvl);
}

/* ---------------- geradores: 1º ANO (6 anos) ---------------- */
export function gN1_12(lvl: number): Question {
  if (lvl === 1) {
    const n = ri(1, 19);
    const start = Math.max(1, n - 2);
    return { tutorial: [{say: "A reta numérica nos ajuda a ver a ordem. O que vem depois?"}], kind: "numberline", prompt: `O que vem DEPOIS de ${n}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n + 1, explain: "Dê um salto para a frente na reta para encontrar o próximo número.", howto: 'Conte para frente!', audioPrompt: 'O que vem depois?' };
  }
  if (lvl === 2) {
    const n = ri(2, 20);
    const start = Math.max(1, n - 4);
    return { kind: "numberline", prompt: `O que vem ANTES de ${n}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n - 1, explain: "Dê um salto para trás na reta para ver qual número vem primeiro.", howto: 'Conte para trás!', audioPrompt: 'O que vem antes?' };
  }
  if (lvl === 3) {
    const n = ri(1, 48);
    const start = Math.max(1, n - 2);
    return { kind: "numberline", prompt: `Que número fica ENTRE ${n} e ${n + 2}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n + 1, explain: "Olhe na reta o número que fica exatamente no meio entre os dois.", howto: "Encontre o número do meio.", audioPrompt: "Quem fica no meio?" };
  }
  if (lvl === 4) {
    const dep = Math.random() < 0.5;
    const n = ri(10, 98);
    return dep
      ? plainQ(`O que vem DEPOIS de ${n}?`, `${n} ➜ ?`, n + 1, 4, n - 4, n + 5, "Pense no número que vem logo a seguir na contagem.")
      : plainQ(`O que vem ANTES de ${n}?`, `? ➜ ${n}`, n - 1, 4, n - 5, n + 4, "Pense no número que vem um passo antes na contagem.");
  }
  const plus = Math.random() < 0.5;
  const n = ri(11, 88);
  return plainQ(
    plus ? `Quanto é 10 A MAIS que ${n}?` : `Quanto é 10 A MENOS que ${n}?`,
    String(n),
    plus ? n + 10 : n - 10,
    4,
    Math.max(0, n - 15),
    n + 15,
    plus
      ? `10 a mais é uma dezena a mais: ${n} vira ${n + 10}!`
      : `10 a menos é uma dezena a menos: ${n} vira ${n - 10}!`
  );
}

export function gN3_03(lvl: number): Question {
  return gVis_LinkingCubesSentence(lvl);
}

export function gN3_04(lvl: number): Question {
  if (lvl === 1) {
    const a = ri(3, 8), b = ri(1, a - 1);
    return {
      kind: "subvis",
      prompt: "Quantos sobram?",
      emoji: pickEmo(),
      a,
      b,
      expr: `${a} − ${b} = ?`,
      options: numOpts(a - b, 4, 0, 10),
      answer: a - b,
      explain: `Tire ${b} e conte o que sobrou: ${a - b}!`,
    };
  }
  // estratégia ao errar: contar para trás a partir do número maior
  const eSub = (a: number, b: number) => `Comece no ${a} e volte ${b} passinhos: dá ${a - b}!`;
  if (lvl === 2) {
    const a = ri(2, 10), b = ri(1, a);
    return mathQ(`${a} − ${b} = ?`, a - b, 0, 12, eSub(a, b));
  }
  if (lvl === 3) {
    const a = ri(5, 20), b = ri(1, a);
    return mathQ(`${a} − ${b} = ?`, a - b, 0, 20, eSub(a, b));
  }
  if (lvl === 4) {
    const a = ri(5, 12);
    const take = ri(1, a - 1);
    return {
      kind: "math",
      prompt: "Qual número falta?",
      expr: `${a} − ▢ = ${a - take}`,
      options: numOpts(take, 4, 1, 12),
      answer: take,
      explain: `Do ${a - take} até o ${a} são ${take} passinhos: tiramos ${take}!`,
    };
  }
  const a = ri(20, 50), b = ri(1, 9);
  return mathQ(`${a} − ${b} = ?`, a - b, a - 15, a + 5, eSub(a, b));
}

export function gN2_03(lvl: number): Question {
  if (lvl <= 2) {
    const max = lvl === 1 ? 20 : 99;
    const maior = Math.random() < 0.6;
    let a = ri(1, max), b = ri(1, max);
    while (b === a) b = ri(1, max);
    const answer = maior ? Math.max(a, b) : Math.min(a, b);
    return {
      kind: "plain",
      prompt: `Toque no número ${maior ? "MAIOR" : "MENOR"}`,
      big: `${a} ou ${b}?`,
      options: shuffle([{ label: String(a), value: a }, { label: String(b), value: b }]),
      answer,
      explain: `Na contagem, o ${Math.min(a, b)} vem antes — então ${Math.max(a, b)} é o maior!`,
    };
  }
  // o truque clássico: a boca do jacaré sempre abre para o número maior
  const eSimbolo = (x: number, y: number, ans: string) =>
    ans === "="
      ? `Os dois lados valem a mesma coisa: usamos o igual!`
      : `A boca do jacaré abre para o maior: ${Math.max(x, y)} é maior, então é ${ans}!`;
  if (lvl <= 4) {
    const max = lvl === 3 ? 30 : 99;
    const a = ri(1, max);
    const b = Math.random() < 0.2 ? a : ri(1, max);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      kind: "plain",
      prompt: "Qual símbolo completa?",
      big: `${a} ▢ ${b}`,
      options: shuffle([{ label: ">", value: ">" }, { label: "<", value: "<" }, { label: "=", value: "=" }]),
      answer,
      explain: eSimbolo(a, b, answer),
    };
  }
  const a = ri(1, 6), b = ri(1, 6), c = ri(2, 12);
  const s = a + b;
  const answer = s > c ? ">" : s < c ? "<" : "=";
  return {
    kind: "plain",
    prompt: "Qual símbolo completa?",
    big: `${a} + ${b} ▢ ${c}`,
    options: shuffle([{ label: ">", value: ">" }, { label: "<", value: "<" }, { label: "=", value: "=" }]),
    answer,
    explain: `${a} mais ${b} fazem ${s}. ${eSimbolo(s, c, answer)}`,
  };
}

export function gAL_03(lvl: number): Question {
  const step = lvl === 1 ? 2 : lvl === 2 ? 10 : lvl === 3 ? 5 : pick([2, 5, 10]);
  const desc = lvl === 5;
  let s0;
  if (desc) s0 = step * ri(5, step === 2 ? 12 : 9);
  else s0 = step * ri(1, step === 2 ? 6 : step === 5 ? 8 : 5);
  const d = desc ? -step : step;
  const seq = [s0, s0 + d, s0 + 2 * d];
  const ans = s0 + 3 * d;
  return {
    kind: "plain",
    prompt: desc ? "Continue contando para trás" : "Continue a contagem",
    big: seq.join(", ") + ", ?",
    options: numOpts(ans, 4, Math.max(0, ans - step * 2), ans + step * 2),
    answer: ans,
    explain: desc
      ? `Estamos voltando de ${step} em ${step}: ${seq[2]} menos ${step} dá ${ans}!`
      : `Estamos pulando de ${step} em ${step}: ${seq[2]} mais ${step} dá ${ans}!`,
  };
}

export function gN2_01(lvl: number): Question {
  const eDez = (t: number, u: number) =>
    `${t} dezenas são ${t * 10}. Com mais ${u} unidades... ${t * 10 + u}!`;
  if (lvl === 1) {
    const t = ri(1, 9);
    return plainQ("Quanto vale?", `${t} dezenas`, t * 10, 4, 10, 99,
      `Cada dezena vale 10! Conte de 10 em 10: ${t} dezenas são ${t * 10}.`);
  }
  if (lvl === 2) {
    const t = ri(1, 5), u = ri(1, 9);
    return plainQ("Quanto vale?", `${t} dezenas e ${u} unidades`, t * 10 + u, 4, 10, 69, eDez(t, u));
  }
  if (lvl === 3) {
    const t = ri(1, 4), u = ri(0, 9);
    return {
      tutorial: [{ say: "Lembre-se que cada barra grande vale 10!" }],
      kind: "tens",
      prompt: "Quantos blocos temos aqui no total?",
      audioPrompt: "Quantos blocos temos aqui no total?",
      t,
      u,
      options: numOpts(t * 10 + u, 4, 10, 59),
      answer: t * 10 + u,
      explain: u === 0
        ? `Cada barra tem 10 cubinhos! ${t} barras são ${t * 10}.`
        : `Cada barra tem 10 cubinhos: ${t * 10}. Com os ${u} soltos... ${t * 10 + u}!`,
    };
  }
  if (lvl === 4) {
    const n = ri(21, 99);
    const t = Math.floor(n / 10);
    return plainQ(`O número ${n} tem quantas DEZENAS?`, String(n), t, 4, 1, 9,
      `O primeiro algarismo do ${n} conta as dezenas: são ${t}!`);
  }
  const t = ri(2, 9), u = ri(1, 9);
  return plainQ("Quanto vale?", `${t} dezenas e ${u} unidades`, t * 10 + u, 4, 20, 99, eDez(t, u));
}

/* ---------------- geradores: FASE 1 (novas trilhas) ---------------- */




export function gN3_02(lvl: number): Question {
  const maxa = [3, 4, 5, 6, 6][(lvl - 1) % 5];
  const a = ri(2, maxa);
  const b = ri(1, a - 1);
  return {
    kind: "subvis",
    prompt: "Quantos sobram?",
    emoji: pickEmo(),
    a,
    b,
    expr: `${a} − ${b} = ?`,
    options: numOpts(a - b, 3, 0, maxa + 1),
    answer: a - b,
    explain: `Tire ${b} e conte os que sobraram: ${a - b}!`,
  };
}

/* Dinheirinho 💰 RESEQUENCIADO (crítica do Zeus + blueprint: "contar centavos com
   números grandes buga a cabeça"). A escada agora respeita o que a criança JÁ soma:
   N1 = só moedas de 1 REAL (contar = reais; o pré-conceito "100 centavos = 1 real"
        entra pela voz, nunca pela conta) →
   N2 = UMA cédula redonda (reconhecer 2/5/10) →
   N3 = JUNTAR cédulas (somas ≤ 20, números redondos) →
   N4 = equivalências simples ("2 notas de 5 valem quanto?") + misto nota+moeda de 1 →
   N5 = centavos SÓ COMO INTRODUÇÃO (50¢ = metade; 50+50 = 1 real). */
export function gGM_03(lvl: number): Question {
  if (lvl === 1) {
    // contar moedas de 1 real — número pequeno, resposta em reais inteiros
    const n = ri(1, 5);
    const coins = Array(n).fill(100);
    return {
      kind: "money",
      prompt: "Quantos reais tem aqui?",
      coins,
      notes: [],
      howto: "Cada moeda dessas vale 1 real inteirinho. Conte uma por uma!",
      explain: `São ${n} moedas de 1 real: ${n} ${n === 1 ? "real" : "reais"}! (Cada uma vale 100 centavinhos juntos.)`,
      options: moneyOpts(n * 100, 4, 100),
      answer: n * 100,
    };
  }
  if (lvl === 2) {
    // reconhecer UMA cédula redonda
    const v = pick([2, 5, 10]);
    return {
      kind: "money",
      prompt: "Quanto vale esta cédula?",
      coins: [],
      notes: [v],
      explain: `É uma cédula de ${v} reais — está escrito nela!`,
      options: moneyOpts(v * 100, 4, 100),
      answer: v * 100,
    };
  }
  if (lvl === 3) {
    // juntar cédulas redondas (soma ≤ 20)
    let notes: number[] = [];
    let guard = 0;
    do {
      notes = Array.from({ length: ri(2, 3) }, () => pick([2, 5, 10]));
      guard++;
    } while (notes.reduce((s, v) => s + v, 0) > 20 && guard < 40);
    const total = notes.reduce((s, v) => s + v, 0);
    return {
      kind: "money",
      prompt: "Quantos reais ao todo?",
      coins: [],
      notes,
      explain: `Some as cédulas: ${notes.join(" + ")} = ${total} reais! Comece pela maior.`,
      options: moneyOpts(total * 100, 4, 100),
      answer: total * 100,
    };
  }
  if (lvl === 4) {
    if (Math.random() < 0.5) {
      // equivalência simples: "N notas de V valem quanto?"
      const v = pick([2, 5, 10]);
      const n = v === 10 ? 2 : ri(2, 3);
      return {
        kind: "math",
        prompt: `${n} cédulas de ${v} reais valem quantos reais?`,
        expr: `${Array(n).fill(v).join(" + ")} = ?`,
        explain: `${n} vezes ${v}: some ${v} ${n} vezes e dá ${n * v} reais!`,
        options: numOpts(n * v, 4, 2, 30),
        answer: n * v,
      };
    }
    // misto: cédulas + moedas de 1 real (tudo redondo, ≤ 20)
    let notes: number[] = [];
    let guard = 0;
    do {
      notes = Array.from({ length: ri(1, 2) }, () => pick([2, 5, 10]));
      guard++;
    } while (notes.reduce((s, v) => s + v, 0) > 17 && guard < 40);
    const coins = Array(ri(1, 3)).fill(100);
    const cents = coins.reduce((s: number, v: number) => s + v, 0) + notes.reduce((s, v) => s + v * 100, 0);
    return {
      kind: "money",
      prompt: "Quantos reais ao todo?",
      coins,
      notes,
      explain: `Primeiro as cédulas, depois as moedas de 1 real. Tudo junto: ${cents / 100} reais!`,
      options: moneyOpts(cents, 4, 100),
      answer: cents,
    };
  }
  // N5 — a PORTA dos centavos (introdução gentil, nada de contagem maluca)
  const modo = ri(0, 2);
  if (modo === 0) {
    return {
      kind: "plain",
      prompt: "1 real inteiro tem quantos centavos?",
      big: "🪙 = ？¢",
      explain: "1 real é feito de 100 centavinhos juntos!",
      options: shuffle([
        { label: "100", value: 100 },
        { label: "10", value: 10 },
        { label: "50", value: 50 },
        { label: "25", value: 25 },
      ]),
      answer: 100,
    };
  }
  if (modo === 1) {
    // 50 + 50 = 1 real (a METADE — o único fato de centavos que importa agora)
    return {
      kind: "money",
      prompt: "Duas moedas de 50 centavos formam quanto?",
      coins: [50, 50],
      notes: [],
      explain: "50 é a METADE de 100. Duas metades formam 1 real inteiro!",
      options: moneyOpts(100, 4, 50),
      answer: 100,
    };
  }
  // 1 real + 50 centavos (ler valor misto simples)
  return {
    kind: "money",
    prompt: "Quanto tem aqui?",
    coins: [100, 50],
    notes: [],
    explain: "1 real e mais a metade (50 centavos): 1 real e cinquenta!",
    options: moneyOpts(150, 4, 50),
    answer: 150,
  };
}

export function gN3_10(lvl: number): Question {
  const X = pick(NOMES);
  let Y = pick(NOMES);
  while (Y === X) Y = pick(NOMES);
  const o = pick(OBJS);
  const Q = o.f ? "Quantas" : "Quantos";
  let story, ans, explain;
  if (lvl === 1) {
    const a = ri(2, 6), b = ri(1, 5);
    ans = a + b;
    story = `${X} tinha ${a} ${o.n} ${o.e}. Ganhou mais ${b}. ${Q} ${o.n} ${X} tem agora?`;
    explain = `"Ganhou mais" é JUNTAR! Some ${a} + ${b} e dá ${ans}.`;
  } else if (lvl === 2) {
    const a = ri(4, 10), b = ri(1, a - 1);
    ans = a - b;
    story = `${X} tinha ${a} ${o.n} ${o.e}. Deu ${b} para ${Y}. ${Q} ${o.n} sobraram?`;
    explain = `"Deu para alguém" é TIRAR! Comece no ${a} e volte ${b}: sobra ${ans}.`;
  } else if (lvl === 3) {
    const a = ri(3, 10), b = ri(3, 10);
    ans = a + b;
    story = `${X} tem ${a} ${o.n} ${o.e} e ${Y} tem ${b}. ${Q} ${o.n} os dois têm juntos?`;
    explain = `"Juntos" é somar os dois! ${a} + ${b} dá ${ans}.`;
  } else if (lvl === 4) {
    const b = ri(2, 9), a = b + ri(1, 8);
    ans = a - b;
    story = `${X} tem ${a} ${o.n} ${o.e} e ${Y} tem ${b}. ${Q} ${o.n} ${X} tem a mais que ${Y}?`;
    explain = `"Quantos a mais" é a diferença: tire ${b} de ${a} e sobra ${ans}.`;
  } else {
    const a = ri(3, 9), c = a + ri(2, 9);
    ans = c - a;
    story = `${X} tinha ${a} ${o.n} ${o.e}. Ganhou algumas e ficou com ${c}. ${Q} ${o.n} ${X} ganhou?`;
    explain = `Do ${a} até o ${c}, conte quanto falta: ${X} ganhou ${ans}.`;
  }
  return { kind: "story", prompt: "Escute e responda 👂", story, emoji: o.e, options: numOpts(ans, 4, 0, 20), answer: ans, explain };
}

export function gPE_01(lvl: number): Question {
  const s = pick(PICTO_SETS);
  const maxN = lvl <= 2 ? 5 : 6;
  let counts: number[] = [], guard = 0;
  do {
    counts = s.cats.map(() => ri(1, maxN));
    guard++;
  } while (guard < 60 && new Set(counts).size < 3);
  if (new Set(counts).size < 3) counts = shuffle([1, 3, 5]);
  const rows = s.cats.map(([e], i) => ({ e, n: counts[i] }));
  if (lvl <= 2) {
    const i = ri(0, 2);
    return { kind: "picto", title: s.title, rows, prompt: `Quantos votos teve ${s.cats[i][1]} ${s.cats[i][0]}?`, options: numOpts(rows[i].n, 4, 0, maxN + 2), answer: rows[i].n, explain: `Conte os ${s.cats[i][0]} da linha, um por um: são ${rows[i].n}.` };
  }
  if (lvl === 3) {
    const mi = counts.indexOf(Math.max(...counts));
    return { kind: "picto", title: s.title, rows, prompt: "Quem teve MAIS votos?", options: shuffle(rows.map((r) => ({ label: r.e, value: r.e }))), answer: rows[mi].e, explain: `A linha MAIS comprida ganhou! É o ${s.cats[mi][0]}, com ${counts[mi]}.` };
  }
  if (lvl === 4) {
    const idx = [0, 1, 2].sort((x, y) => counts[y] - counts[x]);
    const A = idx[0], B = idx[2];
    return { kind: "picto", title: s.title, rows, prompt: `${s.cats[A][1]} ${s.cats[A][0]} teve quantos votos a MAIS que ${s.cats[B][1]} ${s.cats[B][0]}?`, options: numOpts(counts[A] - counts[B], 4, 0, maxN), answer: counts[A] - counts[B], explain: `${counts[A]} menos ${counts[B]}: a diferença é ${counts[A] - counts[B]}.` };
  }
  const total = counts[0] + counts[1] + counts[2];
  return { kind: "picto", title: s.title, rows, prompt: "Quantos votos ao todo?", options: numOpts(total, 4, 3, 20), answer: total, explain: `Some todas as linhas: ${counts[0]} + ${counts[1]} + ${counts[2]} dá ${total}.` };
}

/* ---------------- novas trilhas: calendário e horas ---------------- */


export function gGM_04(lvl: number): Question {
  if (lvl === 1) {
    const hour = ri(1, 12);
    const ans = `${String(hour).padStart(2, "0")}:00`;
    const opts = shuffle([
      { label: ans, value: ans },
      { label: `${String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}:00`, value: `${String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}:00` },
      { label: `${String(hour === 1 ? 12 : hour - 1).padStart(2, "0")}:00`, value: `${String(hour === 1 ? 12 : hour - 1).padStart(2, "0")}:00` },
      { label: `${String(hour).padStart(2, "0")}:30`, value: `${String(hour).padStart(2, "0")}:30` }
    ]);
    return {
      kind: "clock",
      prompt: "Que horas o reloginho está marcando?",
      hour,
      minute: 0,
      options: opts,
      answer: ans,
    };
  }

  if (lvl === 2) {
    const hour = ri(1, 12);
    const ans = `${String(hour).padStart(2, "0")}:30`;
    const opts = shuffle([
      { label: ans, value: ans },
      { label: `${String(hour).padStart(2, "0")}:00`, value: `${String(hour).padStart(2, "0")}:00` },
      { label: `${String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}:30`, value: `${String(hour === 12 ? 1 : hour + 1).padStart(2, "0")}:30` },
      { label: `${String(hour === 1 ? 12 : hour - 1).padStart(2, "0")}:00`, value: `${String(hour === 1 ? 12 : hour - 1).padStart(2, "0")}:00` }
    ]);
    return {
      kind: "clock",
      prompt: "O ponteiro maior está no 6 (meia hora). Que horas são?",
      hour,
      minute: 30,
      options: opts,
      answer: ans,
    };
  }

  const pad = (x: number) => String(x).padStart(2, "0");

  if (lvl === 3) {
    // MISTURA hora cheia/meia hora — mas SEMPRE com o relógio VISUAL (não texto)
    const hour = ri(1, 12);
    const half = Math.random() < 0.5;
    const minute = half ? 30 : 0;
    const ans = `${pad(hour)}:${half ? "30" : "00"}`;
    const distr = new Set<string>();
    distr.add(`${pad(hour)}:${half ? "00" : "30"}`);
    distr.add(`${pad(hour === 12 ? 1 : hour + 1)}:${half ? "30" : "00"}`);
    distr.add(`${pad(hour === 1 ? 12 : hour - 1)}:00`);
    distr.delete(ans);
    const opts = shuffle([{ label: ans, value: ans }, ...[...distr].slice(0, 3).map((v) => ({ label: v, value: v }))]);
    return {
      kind: "clock",
      prompt: "Que horas são?",
      hour, minute,
      options: opts,
      answer: ans,
      explain: half ? "O ponteiro grande no 6 é meia hora!" : "O ponteiro grande no 12 é hora cheia!",
    };
  }

  if (lvl === 4) {
    // probleminha de tempo — a VOZ lê o problema inteiro (não fica escondido no visual)
    const h0 = ri(1, 8);
    const delta = ri(1, 4);
    const ansNum = h0 + delta;
    const ans = `${pad(ansNum)}:00`;
    const distr = new Set<string>();
    distr.add(`${pad(ansNum - 1)}:00`);
    distr.add(`${pad(ansNum + 1)}:00`);
    distr.add(`${pad(h0)}:00`);
    distr.add(`${pad(ansNum + 2)}:00`);
    distr.delete(ans);
    const opts = shuffle([{ label: ans, value: ans }, ...[...distr].slice(0, 3).map((v) => ({ label: v, value: v }))]);
    return {
      kind: "clock",
      prompt: `Agora são ${h0} horas. Daqui a ${delta} horas, que horas serão?`,
      hour: h0, minute: 0,
      options: opts,
      answer: ans,
      explain: `${h0} mais ${delta} é ${ansNum}: serão ${ansNum} horas!`,
    };
  }

  // N5 — ler o relógio em PALAVRAS (o auge, mas visual e na idade; sem formato 24h)
  const hour = ri(1, 12);
  const half = Math.random() < 0.5;
  const minute = half ? 30 : 0;
  const word = (h: number, hf: boolean) => (hf ? `${h} e meia` : `${h} horas`);
  const ans = word(hour, half);
  const distr = new Set<string>();
  distr.add(word(hour, !half));
  distr.add(word(hour === 12 ? 1 : hour + 1, half));
  distr.add(word(hour === 1 ? 12 : hour - 1, half));
  distr.delete(ans);
  const opts = shuffle([{ label: ans, value: ans }, ...[...distr].slice(0, 3).map((v) => ({ label: v, value: v }))]);
  return {
    kind: "clock",
    prompt: "Que horas são?",
    hour, minute,
    options: opts,
    answer: ans,
    explain: half ? `O ponteiro pequeno passou do ${hour} e o grande no 6: ${hour} e meia!` : `Ponteiro pequeno no ${hour}, grande no 12: ${hour} horas!`,
  };
}

/* ---------------- Registro de Trilhas Integradas ---------------- */







export function gAL_02(lvl: number): Question {
  return gPrePadrao(lvl);
}
export function gGE_01(lvl: number): Question {
  return gPreOnde(lvl);
}
export function gGE_02(lvl: number): Question {
  return gPreFormas(lvl);
}
export function gGM_02(lvl: number): Question {
  return gPreCalendario(lvl);
}

// --- FUNDAÇÃO SAGA: N1.01 a N1.09 ---
export function gN1_01(lvl: number): Question {
  const microId = lvl <= 2 ? "a" : "b";
  return Composer.generate(N1_01, microId);
}

export function gN1_02(lvl: number): Question {
  return gVis_Scattered(lvl);
}

export function gN1_03(lvl: number): Question {
  return Composer.generate(N1_03, lvl <= 2 ? "a" : "b");
}

export function gN1_04(lvl: number): Question {
  return Composer.generate(N1_04, lvl <= 2 ? "a" : "b");
}

export function gN1_05(lvl: number): Question {
  const isMais = Math.random() < 0.5;
  const n1 = ri(2, 5);
  let n2 = ri(2, 5);
  while (n1 === n2) n2 = ri(2, 5);

  const groups = [
    { n: n1, emoji: pickEmo() },
    { n: n2, emoji: pickEmo() }
  ];
  const wantsMais = isMais;
  const idxBig = n1 > n2 ? 0 : 1;
  const ansIdx = wantsMais ? idxBig : (1 - idxBig);

  if (lvl <= 2) {
    return {
      tutorial: lvl === 1 ? [{say: "Toque no grupo que tem a quantidade pedida."}] : undefined,
      kind: "groups",
      groups: groups,
      prompt: wantsMais ? "Toque no que tem MAIS." : "Toque no que tem MENOS.",
      options: [
        { label: "1", value: 0 },
        { label: "2", value: 1 }
      ],
      answer: ansIdx,
      howto: "Compare as quantidades.",
      audioPrompt: wantsMais ? "Qual tem mais?" : "Qual tem menos?",
      explain: wantsMais ? "Encontre o grupo com o maior número de coisas." : "Encontre o grupo com o menor número de coisas."
    };
  } else {
    // plain text comparison
    return {
      tutorial: undefined,
      kind: "plain",
      big: wantsMais ? "📈 MAIS" : "📉 MENOS",
      prompt: wantsMais ? `Escolha o número MAIOR` : `Escolha o número MENOR`,
      options: [
        { label: `${n1}`, value: n1 },
        { label: `${n2}`, value: n2 }
      ],
      answer: wantsMais ? (n1 > n2 ? n1 : n2) : (n1 < n2 ? n1 : n2),
      howto: "Compare os números.",
      audioPrompt: wantsMais ? "Qual é maior?" : "Qual é menor?",
      explain: "Lembre da ordem de contagem para saber qual é maior ou menor."
    };
  }
}

export function gN1_06(lvl: number): Question {
  const ans = ri(1, 9);
  const words = ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez"];
  return {
    tutorial: lvl === 1 ? [{say: "Ouça o número e toque nele!"}] : undefined,
    kind: "plain",
    prompt: "Ouça com atenção 👂",
    big: "🔊 " + words[ans].toUpperCase(),
    options: numOpts(ans, 3, 1, 9),
    answer: ans,
    howto: "Ligue o som ao símbolo.",
    audioPrompt: `Encontre o ${ans}!`,
    explain: "Ligue o som ao formato do número.",
  };
}

export function gN1_07(lvl: number): Question {
  return Composer.generate(N1_07, "a");
}

import { N1_08 } from "../curriculum/fichas/N1.08";
import { N1_09 } from "../curriculum/fichas/N1.09";
export function gN1_09(lvl: number): Question {
  return gVis_Sequence(lvl);
}
export function gN1_08(lvl: number): Question {
  const n = ri(5, 10);
  return {
    tutorial: lvl === 1 ? [{ say: "Esta é a caixa mágica! Se a primeira linha estiver cheia, tem 5!" }] : undefined,
    excecaoCPA: "perceptual",
    kind: "tenframe",
    uiProps: { flashDurationMs: 1500 },
    prompt: "A Caixa Mágica abriu e fechou! Quantos você viu?",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, 1, 8),
    answer: n,
    howto: "Preste muita atenção e tente não contar um por um.",
    audioPrompt: "Quantos viu?",
    explain: "Tente lembrar da imagem que piscou na caixa sem contar de um em um.",
  };
}

export function gAL_01(lvl: number): Question {
  return gPreIntruso(lvl);
}


export function gPrePadrao(lvl: number): any {
  const isCores = Math.random() > 0.5;
  const A = isCores ? "🔴" : "🍎";
  const B = isCores ? "🔵" : "🍌";
  return { kind: "pattern", prompt: "O que vem a seguir?", shown: [A, B, A, B, A], options: [{label:A, value:A}, {label:B, value:B}], answer: B };
}
export function gPreOnde(lvl: number): any {
  return { kind: "plain", big: "📦", prompt: "O gato está EM CIMA ou EMBAIXO da caixa?", options: [{label:"Em cima", value:"Em cima"}, {label:"Embaixo", value:"Embaixo"}], answer: "Em cima" };
}
export function gPreFormas(lvl: number): any {
  return { kind: "shapes", prompt: "Qual é o círculo?", options: [{label:"🔴", shape:"circ", color:"red", value:"circ"}, {label:"🟥", shape:"quad", color:"red", value:"quad"}], answer: "circ" };
}
export function gPreCalendario(lvl: number): any {
  return { kind: "daypart", big: "morning", prompt: "Qual parte do dia é agora?", options: [{label:"Manhã", value:"morning"}, {label:"Noite", value:"night"}], answer: "morning" };
}
export function gPreMais(lvl: number): any {
  return { kind: "plain", big: "🍎", prompt: "Qual é mais: 5 maçãs ou 3 maçãs?", options: [{label:"5 maçãs", value:5}, {label:"3 maçãs", value:3}], answer: 5 };
}
export function gPreIntruso(lvl: number): any {
  return { kind: "plain", big: "🐶", prompt: "Quem não é animal?", options: [{label:"Gato", value:"gato"}, {label:"Carro", value:"carro"}], answer: "carro" };
}
