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
export function gPreContar(lvl: number): Question {
  // N4 — CONSERVAÇÃO (Piaget/Gelman): mesma quantidade, uma fileira JUNTA e outra
  // ESPALHADA. Quebra o erro clássico de achar que espalhado = mais.
  if (lvl === 4) {
    const n = ri(4, 6);
    return {
      kind: "conserv",
      prompt: "Qual linha tem MAIS?",
      emoji: pickEmo(),
      n,
      howto: "Conte as duas linhas: espalhar bem longe não muda a quantidade!",
      explain: `As duas têm ${n}! Espalhar não faz ter mais — é só olhar mais longe. 🟰`,
      options: [
        { label: "A de Cima ⬆️", value: "cima" },
        { label: "A de Baixo ⬇️", value: "baixo" },
        { label: "Iguais 🟰", value: "igual" },
      ],
      answer: "igual",
    };
  }
  // N5 — CONTAR A PARTIR DE (Gelman): continuar a contagem sem voltar ao 1.
  if (lvl === 5) {
    const s = ri(3, 9);
    return {
      kind: "plain",
      prompt: "Continue contando!",
      big: `${s}, ${s + 1}, ${s + 2}, ...`,
      howto: "Não volte pro um! Continue de onde a contagem parou.",
      explain: `Depois do ${s + 2} vem o ${s + 3}. É só seguir contando! 🔢`,
      options: numOpts(s + 3, 3, Math.max(1, s), s + 5),
      answer: s + 3,
    };
  }
  // N1-N3 — contar (correspondência 1-a-1); a faixa cresce, N3 já espalhado.
  const ranges = [[1, 3], [2, 5], [4, 8]];
  const R = ranges[(lvl - 1) % ranges.length];
  const n = ri(R[0], R[1]);
  return {
    kind: "count",
    prompt: "Quantos tem aqui?",
    emoji: pickEmo(),
    n,
    options: numOpts(n, 3, Math.max(1, n - 4), n + 4),
    answer: n,
    explain: `Conte com o dedinho, um por um... são ${n}!`,
  };
}

export function gPreMais(lvl: number): Question {
  const more = lvl < 3 ? true : Math.random() < 0.6;
  const maxes = [5, 6, 7, 8, 9];
  const max = maxes[(lvl - 1) % maxes.length];
  const minDiff = lvl < 4 ? 2 : 1;
  let a = ri(1, max), b = ri(1, max), g = 0;
  while ((a === b || Math.abs(a - b) < minDiff) && g++ < 60) {
    a = ri(1, max);
    b = ri(1, max);
  }
  if (a === b) b = a > 1 ? a - 1 : a + 1;
  const ea = pickEmo();
  let eb = pickEmo();
  while (eb === ea) eb = pickEmo();
  const answer = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
  const hi = Math.max(a, b), lo = Math.min(a, b);
  return {
    kind: "groups",
    prompt: more ? "Toque no grupo com MAIS figuras" : "Toque no grupo com MENOS figuras",
    groups: [{ emoji: ea, n: a }, { emoji: eb, n: b }],
    options: [{ value: 0 }, { value: 1 }],
    answer,
    explain: more
      ? `Conte os dois grupos: ${hi} é mais que ${lo}!`
      : `Conte os dois grupos: ${lo} é menos que ${hi}!`,
  };
}

export function gPreFormas(lvl: number): Question {
  const poolSize = [3, 4, 5, 6, 7][(lvl - 1) % 5];
  const pool = SHAPES.slice(0, poolSize);
  const target = pick(pool);
  const count = lvl < 3 ? 3 : 4;
  const others = shuffle(pool.filter((s) => s.id !== target.id)).slice(0, count - 1);
  const colors = shuffle(SHAPE_COLORS);
  const options = shuffle([target, ...others]).map((s, i) => ({
    shape: s.id,
    color: colors[i % colors.length],
    value: s.id,
  }));
  return {
    kind: "shapes",
    prompt: `Toque ${target.art} ${target.name}`,
    options,
    answer: target.id,
    explain: `Essa é a ${target.name}! Olhe bem o formato dela e toque. ${target.art}`,
  };
}

export function gPrePadrao(lvl: number): Question {
  let unit: string[], distract: string;
  if (lvl <= 2) {
    const s = pick(PATSETS);
    unit = [s[0], s[1]];
    distract = pick(PATPOOL.filter((e) => !unit.includes(e)));
  } else if (lvl === 3) {
    const s = pick(PATSETS);
    unit = [s[0], s[0], s[1]];
    distract = pick(PATPOOL.filter((e) => !unit.includes(e)));
  } else {
    const all = shuffle(PATPOOL);
    unit = lvl === 4 ? [all[0], all[1], all[2]] : pick([[all[0], all[1], all[1]], [all[0], all[1], all[2]]]);
    distract = all[3];
  }
  const reps = unit.length === 2 ? 3 : 2;
  let seq: string[] = [];
  for (let i = 0; i < reps; i++) seq = seq.concat(unit);
  const answer = seq[seq.length - 1];
  const shown = seq.slice(0, seq.length - 1);
  const uniq = [...new Set(unit)];
  const optVals = uniq.length >= 3 ? uniq : [...uniq, distract];
  return {
    kind: "pattern",
    prompt: "O que vem agora?",
    shown,
    options: shuffle(optVals).map((e) => ({ label: e, value: e })),
    answer,
    // ensina a achar a UNIDADE que se repete (o "segredo" do padrão)
    explain: `Procure o segredo que se repete: ${unit.join(", ")}... de novo! Então vem ${answer}.`,
  };
}

export function gPreVizinho(lvl: number): Question {
  // explicações (só ao errar): sempre a ESTRATÉGIA de contar, não só a resposta
  const eDepois = (n: number) => `Conte comigo: ${n}... e depois vem o ${n + 1}!`;
  const eAntes = (n: number) => `Antes do ${n} vem o ${n - 1}. Conte: ${n - 1}, ${n}!`;
  if (lvl === 1) {
    const n = ri(1, 4);
    return plainQ(`O que vem DEPOIS do ${n}?`, `${n} ➜ ?`, n + 1, 3, 1, n + 4, eDepois(n));
  }
  if (lvl === 2) {
    const n = ri(1, 8);
    return plainQ(`O que vem DEPOIS do ${n}?`, `${n} ➜ ?`, n + 1, 3, 1, n + 4, eDepois(n));
  }
  if (lvl === 3) {
    const n = ri(2, 9);
    return plainQ(`O que vem ANTES do ${n}?`, `? ➜ ${n}`, n - 1, 3, Math.max(0, n - 4), n + 3, eAntes(n));
  }
  if (lvl === 4) {
    const dep = Math.random() < 0.5;
    const n = dep ? ri(1, 11) : ri(2, 12);
    return dep
      ? plainQ(`O que vem DEPOIS do ${n}?`, `${n} ➜ ?`, n + 1, 3, 1, n + 4, eDepois(n))
      : plainQ(`O que vem ANTES do ${n}?`, `? ➜ ${n}`, n - 1, 3, Math.max(0, n - 4), n + 3, eAntes(n));
  }
  const n = ri(1, 13);
  return plainQ(
    `Que número fica ENTRE ${n} e ${n + 2}?`,
    `${n} ➜ ? ➜ ${n + 2}`,
    n + 1, 3, Math.max(1, n - 2), n + 4,
    `Conte: ${n}, ${n + 1}, ${n + 2} — o ${n + 1} fica no meio!`
  );
}

export function gPreSoma(lvl: number): Question {
  const totals = [4, 5, 7, 10, 10];
  const tot = totals[(lvl - 1) % totals.length];
  const a = ri(1, tot - 1);
  const b = ri(1, tot - a);
  return {
    kind: "sum",
    prompt: "Quantos ficam juntos?",
    emoji: pickEmo(),
    a,
    b,
    options: numOpts(a + b, 3, 1, tot + 2),
    answer: a + b,
    explain: `Junte tudo e conte: ${a} e mais ${b} fazem ${a + b}!`,
  };
}

/* ---------------- geradores: 1º ANO (6 anos) ---------------- */
export function gA1Seq(lvl: number): Question {
  const eDepois = (n: number) => `Conte comigo: ${n}... e depois vem o ${n + 1}!`;
  const eAntes = (n: number) => `Antes do ${n} vem o ${n - 1}. Conte: ${n - 1}, ${n}!`;
  if (lvl === 1) {
    const n = ri(1, 19);
    const start = Math.max(1, n - 2);
    return { kind: "numberline-interactive", prompt: `O que vem DEPOIS de ${n}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n + 1, explain: eDepois(n) };
  }
  if (lvl === 2) {
    const n = ri(2, 20);
    const start = Math.max(1, n - 4);
    return { kind: "numberline-interactive", prompt: `O que vem ANTES de ${n}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n - 1, explain: eAntes(n) };
  }
  if (lvl === 3) {
    const n = ri(1, 48);
    const start = Math.max(1, n - 2);
    return { kind: "numberline-interactive", prompt: `Que número fica ENTRE ${n} e ${n + 2}?`, nlStart: start, nlEnd: start + 5, nlStartPos: n, answer: n + 1, explain: `Conte: ${n}, ${n + 1}, ${n + 2} — o ${n + 1} fica no meio!` };
  }
  if (lvl === 4) {
    const dep = Math.random() < 0.5;
    const n = ri(10, 98);
    return dep
      ? plainQ(`O que vem DEPOIS de ${n}?`, `${n} ➜ ?`, n + 1, 4, n - 4, n + 5, eDepois(n))
      : plainQ(`O que vem ANTES de ${n}?`, `? ➜ ${n}`, n - 1, 4, n - 5, n + 4, eAntes(n));
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

export function gA1Soma(lvl: number): Question {
  if (lvl === 1) {
    const a = ri(1, 5), b = ri(1, 5);
    return {
      kind: "sum",
      prompt: "Quanto é a soma?",
      emoji: pickEmo(),
      a,
      b,
      options: numOpts(a + b, 4, 1, 12),
      answer: a + b,
      explain: `Junte tudo e conte: ${a} e mais ${b} fazem ${a + b}!`,
    };
  }
  // estratégia ensinada ao errar: começar do maior e contar nos dedos (counting on)
  const eSoma = (a: number, b: number) =>
    `Guarde o ${Math.max(a, b)} na cabeça e conte mais ${Math.min(a, b)} nos dedos: dá ${a + b}!`;
  if (lvl === 2) {
    const a = ri(1, 9), b = ri(1, Math.max(1, 10 - a));
    return {
      kind: "singapore-bars",
      prompt: "Junte os blocos!",
      a,
      b,
      options: numOpts(a + b, 3, 0, 15),
      answer: a + b,
      explain: eSoma(a, b)
    };
  }
  if (lvl === 3) {
    const a = ri(3, 15), b = ri(2, Math.max(2, 20 - a));
    return mathQ(`${a} + ${b} = ?`, a + b, 2, 22, eSoma(a, b));
  }
  if (lvl === 4) {
    const a = ri(1, 9);
    const total = ri(a + 1, 12);
    return {
      kind: "math",
      prompt: "Qual número falta?",
      expr: `${a} + ▢ = ${total}`,
      options: numOpts(total - a, 4, 1, 12),
      answer: total - a,
      explain: `Do ${a} até o ${total}, conte nos dedos: faltam ${total - a}!`,
    };
  }
  const a = ri(2, 20), b = ri(1, 9);
  return {
    kind: "rapid-fire",
    prompt: "Dojo de Velocidade!",
    expr: `${a} + ${b}`,
    options: numOpts(a + b, 3, a, a + 15),
    answer: a + b,
    explain: eSoma(a, b)
  };
}

export function gA1Sub(lvl: number): Question {
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

export function gA1Comp(lvl: number): Question {
  if (lvl <= 2) {
    const max = lvl === 1 ? 20 : 99;
    const maior = Math.random() < 0.6;
    let a = ri(1, max), b = ri(1, max);
    while (b === a) b = ri(1, max);
    const answer = maior ? Math.max(a, b) : Math.min(a, b);
    return {
      kind: "plain",
      prompt: `Toque no número ${maior ? "MAIOR" : "MENOR"}`,
      big: null,
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

export function gA1Pular(lvl: number): Question {
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

export function gA1Dez(lvl: number): Question {
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
      kind: "tens",
      prompt: "Quantos cubinhos temos ao todo no Material Dourado?",
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
export function gPreIntruso(lvl: number): Question {
  const keys = Object.keys(CATS);
  let a: string, b: string;
  if (lvl >= 4) {
    const par = pick(CATS_RELACIONADAS);
    a = par[0]; b = par[1];
    if (Math.random() < 0.5) { const t = a; a = b; b = t; }
  } else {
    a = pick(keys);
    b = pick(keys);
    while (b === a || (lvl < 4 && CATS_RELACIONADAS.some((p) => p.includes(a) && p.includes(b)))) b = pick(keys);
  }
  const tres = shuffle(CATS[a]).slice(0, 3);
  const intruso = pick(CATS[b]);
  return {
    kind: "plain",
    prompt: "Toque no que NÃO combina com os outros",
    big: null,
    options: shuffle([...tres.map((e) => ({ label: e, value: e })), { label: intruso, value: intruso }]),
    answer: intruso,
  };
}

export function gPreOnde(lvl: number): Question {
  let slots: string[];
  if (lvl === 1) slots = ["cima", "baixo"];
  else if (lvl === 2) slots = ["cima", "baixo", pick(["esq", "dir"])];
  else if (lvl === 3) slots = ["esq", "dir", "cima"];
  else slots = ["cima", "baixo", "esq", "dir"];
  const anims = shuffle(ONDE_ANIM).slice(0, slots.length);
  const items = slots.map((pos, i) => ({ e: anims[i], pos }));
  let ti = ri(0, items.length - 1);
  if (lvl >= 3) {
    const lat = items.filter((it) => it.pos === "esq" || it.pos === "dir");
    if (lat.length && Math.random() < (lvl === 5 ? 0.9 : 0.6)) ti = items.indexOf(pick(lat));
  }
  const target = items[ti];
  const fr = lvl === 2 && (target.pos === "esq" || target.pos === "dir") ? ONDE_FRASE.lado : ONDE_FRASE[target.pos];
  return {
    kind: "scene",
    prompt: `Toque no bichinho que está ${fr}`,
    items,
    options: shuffle(items.map((it) => ({ label: it.e, value: it.e }))),
    answer: target.e,
  };
}

export function gPreTirar(lvl: number): Question {
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
export function gA1Dinheiro(lvl: number): Question {
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

export function gA1Problemas(lvl: number): Question {
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

export function gA1Graficos(lvl: number): Question {
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
export function gPreCalendario(lvl: number): Question {
  const dias = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  
  if (lvl === 1) {
    const cycleType = Math.floor(Math.random() * 3); // 0: manhã, 1: tarde, 2: noite
    if (cycleType === 0) {
      return {
        kind: "plain",
        prompt: "O que vem depois da Manhã? ☀️ ➔ ❓",
        big: "☀️ Manhã ➔ ❓",
        options: shuffle([
          { label: "Tarde 🌤️", value: "Tarde" },
          { label: "Noite 🌙", value: "Noite" },
          { label: "Ontem 📅", value: "Ontem" }
        ]),
        answer: "Tarde",
      };
    } else if (cycleType === 1) {
      return {
        kind: "plain",
        prompt: "O que vem depois da Tarde? 🌤️ ➔ ❓",
        big: "🌤️ Tarde ➔ ❓",
        options: shuffle([
          { label: "Noite 🌙", value: "Noite" },
          { label: "Manhã ☀️", value: "Manhã" },
          { label: "Semana 📅", value: "Semana" }
        ]),
        answer: "Noite",
      };
    } else {
      return {
        kind: "plain",
        prompt: "O que vem depois da Noite? 🌙 ➔ ❓",
        big: "🌙 Noite ➔ ❓",
        options: shuffle([
          { label: "Manhã ☀️", value: "Manhã" },
          { label: "Tarde 🌤️", value: "Tarde" },
          { label: "Mês 📅", value: "Mês" }
        ]),
        answer: "Manhã",
      };
    }
  }
  
  if (lvl === 2) {
    const idx = ri(1, 5); // Segunda a Sexta
    const diaHoje = dias[idx];
    const diaAmanha = dias[idx + 1];
    const opts = shuffle([
      { label: diaAmanha, value: diaAmanha },
      { label: dias[(idx + 2) % 7], value: dias[(idx + 2) % 7] },
      { label: dias[idx - 1], value: dias[idx - 1] }
    ]);
    return {
      kind: "plain",
      prompt: `Se hoje é ${diaHoje}, amanhã será...?`,
      big: `📅 Hoje: ${diaHoje}`,
      options: opts,
      answer: diaAmanha,
    };
  }
  
  if (lvl === 3) {
    const idx = ri(1, 5);
    const diaHoje = dias[idx];
    const diaOntem = dias[idx - 1];
    const opts = shuffle([
      { label: diaOntem, value: diaOntem },
      { label: dias[idx + 1], value: dias[idx + 1] },
      { label: dias[(idx + 3) % 7], value: dias[(idx + 3) % 7] }
    ]);
    return {
      kind: "plain",
      prompt: `Se hoje é ${diaHoje}, ontem foi...?`,
      big: `📅 Hoje: ${diaHoje}`,
      options: opts,
      answer: diaOntem,
    };
  }

  if (lvl === 4) {
    const isFim = Math.random() < 0.5;
    const prompt = isFim ? "Qual dia é parte do Fim de Semana? 🎉" : "Qual dia é um dia de Aula/Trabalho? 🏫";
    const ans = isFim ? pick(["Sábado", "Domingo"]) : pick(["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"]);
    const others = isFim 
      ? ["Segunda-feira", "Terça-feira", "Quarta-feira"] 
      : ["Sábado", "Domingo", "Feriado"];
    const opts = shuffle([
      { label: ans, value: ans },
      { label: others[0], value: others[0] },
      { label: others[1], value: others[1] }
    ]);
    return {
      kind: "plain",
      prompt,
      big: isFim ? "🍿 Descanso!" : "🎒 Estudo!",
      options: opts,
      answer: ans,
    };
  }

  const idx = ri(1, 5);
  const ontem = dias[idx - 1];
  const amanha = dias[idx + 1];
  const hoje = dias[idx];
  const qType = Math.random() < 0.5;
  const prompt = qType ? `Se ontem foi ${ontem}, amanhã será...?` : `Se amanhã for ${amanha}, ontem foi...?`;
  const ans = qType ? amanha : ontem;
  const opts = shuffle([
    { label: ontem, value: ontem },
    { label: amanha, value: amanha },
    { label: hoje, value: hoje }
  ]);
  return {
    kind: "plain",
    prompt,
    big: qType ? `👈 Ontem: ${ontem}` : `👉 Amanhã: ${amanha}`,
    options: opts,
    answer: ans,
  };
}

export function gA1Horas(lvl: number): Question {
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

export function gPreSimbolos(lvl: number): Question {
  // Nível 0: Reconhecimento de Símbolos
  const ans = ri(1, lvl <= 2 ? 5 : 10);
  return {
    kind: "plain",
    prompt: `Toque no número ${ans}!`,
    big: "?",
    options: numOpts(ans, 3, 1, 10),
    answer: ans,
    explain: `Esse é o número ${ans}!`
  };
}


export function gPreCanto(lvl: number): Question {
  // Nível 0: Canto Numérico (Rote Counting) - Tocar na ordem correta
  const start = lvl <= 2 ? 1 : lvl <= 4 ? 4 : 7;
  const count = lvl <= 3 ? 3 : 4;
  const nums = Array.from({ length: count }, (_, i) => start + i);
  return {
    kind: "order",
    prompt: "Toque nos números na ordem certa!",
    big: "contar",
    options: shuffle(nums).map((n) => ({ label: String(n), value: n })),
    answer: nums, // O componente order valida se a criança toca na sequência dessa array
    explain: `A ordem certa é ${nums.join(', ')}!`
  };
}


// --- DECOUPLED F0 GENERATORS (M3 PHASE) ---
export function gN1_01(lvl: number): Question {
  return gPreContar(lvl === 1 ? 1 : 2);
}
export function gN1_02(lvl: number): Question {
  return gPreCanto(lvl);
}
export function gN1_03(lvl: number): Question {
  return gPreContar(3);
}
export function gN1_04(lvl: number): Question {
  return gPreContar(lvl > 2 ? 4 : 2);
}
export function gN1_05(lvl: number): Question {
  return gPreMais(lvl);
}
export function gN1_06(lvl: number): Question {
  return gPreSimbolos(lvl);
}
export function gN1_07(lvl: number): Question {
  return gPreVizinho(lvl);
}
export function gN1_09(lvl: number): Question {
  return gPreContar(5);
}
export function gAL_01(lvl: number): Question {
  return gPreIntruso(lvl);
}
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
