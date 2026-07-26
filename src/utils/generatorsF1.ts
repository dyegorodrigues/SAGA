import { Question } from "../types";
import { ri, pick, shuffle } from "./generators";
import { gVis_TakeApart, gVis_MissingAddendFrame } from "./generatorsVisual";

export const numOpts = (ans: any, ...distractors: any[]) => {
  let res = [ans, ...distractors].filter(x => x != null && x !== ans);
  res = [...new Set(res)];
  while (res.length < 3) {
    const d = ri(ans - 3, ans + 3);
    if (d !== ans && !res.includes(d) && d >= 0) res.push(d);
  }
  return shuffle([ans, ...res.slice(0, 3)]).map(x => ({ label: x, value: x }));
};

export const gN1_10 = (lvl: number): Question => {
  return gVis_TakeApart(lvl);
};

export const gN1_11 = (lvl: number): Question => {
  return gVis_MissingAddendFrame(lvl);
};

export const gN2_02 = (lvl: number): Question => {
  const ans = ri(20, 99);
  return {
    kind: "tens", prompt: `Que número é esse?`,
    t: Math.floor(ans / 10), u: ans % 10,
    options: numOpts(ans, (ans % 10)*10 + Math.floor(ans / 10), ans - 10),
    answer: ans
  };
};

export const gN3_05 = (lvl: number): Question => {
  const a = ri(2, 7);
  const b = ri(1, 6);
  const sum = a + b;
  return {
    kind: "bond", prompt: `Se sabemos que ${a} + ${b} = ${sum}... então ${sum} - ${a} é igual a?`,
    a: sum, b: a, big: "topo_ok",
    howto: `Na família desses números, se você tirar o pedaço ${a} do grandão ${sum}, o que sobra?`,
    explain: `Exato! Os três formam uma família. ${a} e ${b} fazem ${sum}. Tirando ${a}, sobra o ${b}!`,
    options: numOpts(b, sum, sum - b + 1),
    answer: b
  };
};

export const gN3_06 = (lvl: number): Question => {
  const isAlmost = lvl > 2 && ri(0, 1) === 1;
  const n = ri(2, 5);
  if (isAlmost) {
    return {
      kind: "math", prompt: `Pense: o dobro de ${n} é ${n + n}. Então ${n} + ${n + 1} é?`,
      expr: `${n} + ${n + 1} = ?`,
      options: numOpts(n + n + 1, n + n, n + n + 2),
      answer: n + n + 1
    };
  } else {
    return {
      kind: "groups", prompt: `O dobro de ${n} é...`,
      groups: [{ emoji: "🍎", n }, { emoji: "🍎", n }],
      options: numOpts(n + n, n + 1, (n+n)-1),
      answer: n + n
    };
  }
};

export const gN3_07 = (lvl: number): Question => {
  const a = ri(6, 9);
  const comp = 10 - a;
  const rem = ri(1, 4);
  const b = comp + rem;
  
  if (lvl === 1) {
    return {
      kind: "tenframe", prompt: `Complete o 10 primeiro!`,
      n: a, big: "add", u: b,
      options: numOpts(a + b, 10, a + b - 1),
      answer: a + b
    };
  } else {
    return {
      kind: "numberline-interactive", prompt: `Vamos pular até o 10 e depois o resto!`,
      nlStartPos: a, nlStart: a, nlEnd: a + b + 2, nlJumps: [{ val: comp, delay: 0 }, { val: rem, delay: 1 }],
      options: numOpts(a + b, 10, a + b - 1),
      answer: a + b
    };
  }
};

export const gN3_08 = (lvl: number): Question => {
  const a = ri(11, 15);
  const rem = a - 10;
  const b = rem + ri(1, 3);
  
  return {
    kind: "numberline-interactive", prompt: `Vamos voltar até o 10 e depois tirar o resto!`,
    nlStartPos: a, nlStart: a - b - 1, nlEnd: a + 1, nlJumps: [{ val: -rem, delay: 0 }, { val: -(b - rem), delay: 1 }],
    options: numOpts(a - b, 10, a - b - 1, a - b + 1),
    answer: a - b
  };
};

export const gN3_09 = (lvl: number): Question => {
  const top = ri(20, 89);
  const bot = ri(1, Math.min(9, 99 - top));
  const isSub = ri(0,1) === 1;
  const a = isSub ? top + bot : top;
  const b = isSub ? bot : bot;
  const op = isSub ? "-" : "+";
  const ans = isSub ? a - b : a + b;
  
  return {
    kind: "vertical", prompt: `Resolva a conta:`,
    vTop: a, vBot: b, vOp: op,
    options: numOpts(ans, isSub ? a + b : a - b, ans - 1, ans + 1),
    answer: ans
  };
};
