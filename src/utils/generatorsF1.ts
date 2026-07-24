import { Question } from "../types";
import { ri, pick, shuffle } from "./generators";

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
  const whole = ri(3, 10);
  const part = ri(1, whole - 1);
  const missingPart = lvl > 2; // se missing part or not
  if (missingPart) {
    return {
      tutorial: lvl === 1 ? [{say: "Vamos completar o inteiro."}] : undefined,
      kind: lvl <= 2 ? "bond" : "plain",
      prompt: "Qual pedaço está faltando para completar?",
      a: whole, b: part, big: "topo_ok",
      howto: `O número de cima é feito juntando os de baixo. Pense: ${part} mais quanto dá ${whole}?`,
      audioPrompt: "Qual falta?",
      explain: "Olha para o total lá no topo e pense quanto falta juntar ao pedaço de baixo.",
      options: numOpts(whole - part, whole + part, part),
      answer: whole - part
    };
  } else {
    return {
      tutorial: lvl === 1 ? [{say: "Os pedaços formam o todo."}] : undefined,
      kind: lvl <= 2 ? "bond" : "plain",
      prompt: "Qual é o número total lá em cima?",
      a: whole, b: part, big: "topo",
      howto: "Os dois pedaços de baixo se juntam para formar o total lá em cima. É só somar!",
      audioPrompt: "Qual o total?",
      explain: "Junte os dois pedaços de baixo para ver o total que vai no topo.",
      options: numOpts(whole, whole - part, part),
      answer: whole
    };
  }
};

export const gN1_11 = (lvl: number): Question => {
  const ans = ri(1, 9);
  const comp = 10 - ans;
  if (lvl <= 2) {
    return {
      tutorial: lvl === 1 ? [
        { say: "Esta é a caixa mágica: duas fileiras de cinco quadradinhos." },
        { say: "Temos algumas peças. Quantas faltam para completar 10?" }
      ] : undefined,
      kind: "tenframe",
      prompt: "Quantos faltam para completar a caixa de 10?",
      n: comp,
      big: "fill",
      options: numOpts(ans, comp, 10),
      answer: ans,
      howto: "Conte os espaços vazios na caixa mágica.",
      audioPrompt: "Quantos faltam para 10?",
      explain: "Olha os quadradinhos vazios e conte quantos faltam."
    };
  } else if (lvl === 3) {
    return {
      tutorial: undefined,
      kind: "bond",
      prompt: "O topo é 10! Qual pedaço está faltando embaixo?",
      a: 10,
      b: comp,
      big: "topo_ok",
      options: numOpts(ans, comp, 10),
      answer: ans,
      howto: `O número de cima é feito juntando os de baixo. Pense: ${comp} mais quanto dá 10?`,
      audioPrompt: "Qual pedaço está faltando?",
      explain: "Lembre que os dois círculos de baixo se juntam para formar o 10 no topo."
    };
  } else {
    return {
      tutorial: undefined,
      kind: "plain",
      prompt: `Quanto falta para completar 10?`,
      big: `${comp} + ? = 10`,
      options: numOpts(ans, comp, 10),
      answer: ans,
      howto: "Pense nos amigos do 10.",
      audioPrompt: "Quanto falta para 10?",
      explain: "Pense em qual amigo do 10 se junta com este número para fechar 10."
    };
  }
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
