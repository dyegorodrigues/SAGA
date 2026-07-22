import { Question, Option } from "../types";
import { ri, pick, shuffle } from "./generators";
import { numOpts } from "./generatorsF1";
import { MisconceptionTag } from "../constants/misconceptions";

// ================= F2 GENERATORS ================= //

// N2.04 — Centena e números até 1000
export const gN2_04 = (lvl: number): Question => {
  const isCdu = lvl > 2;
  const c = ri(1, 9);
  const d = ri(1, 9);
  const u = ri(1, 9);
  
  if (isCdu) {
    const val = c * 100 + d * 10 + u;
    return {
      kind: "plain",
      prompt: `Que número é formado por ${c} centenas, ${d} dezenas e ${u} unidades?`,
      big: "base10",
      options: numOpts(val, val + 10, val - 100, c * 100 + u),
      answer: val
    };
  } else {
    const val = c * 100;
    return {
      kind: "plain",
      prompt: `Quantas unidades tem em ${c} centenas?`,
      big: "base10",
      options: numOpts(val, val + 10, val / 10),
      answer: val
    };
  }
};

// N3.11 — Adição com reagrupamento
export const gN3_11 = (lvl: number): Question => {
  // We force a carry in the ones column
  const u1 = ri(5, 9);
  const u2 = ri(10 - u1, 9); // Ensures u1 + u2 >= 10
  
  const d1 = ri(1, 4);
  const d2 = ri(1, 4); // Keep sum of tens < 9 to avoid hundreds carry for now
  
  const a = d1 * 10 + u1;
  const b = d2 * 10 + u2;
  const sum = a + b;
  
  const opts = new Set<string>();
  const options: Option[] = [];
  
  // Resposta certa
  options.push({ label: sum.toString(), right: true });
  opts.add(sum.toString());
  
  // Misconception 1: Esqueceu o vai um (ex: 27+15 = 32 em vez de 42)
  const esqueceuVaiUm = (d1 + d2) * 10 + (u1 + u2 - 10);
  if (!opts.has(esqueceuVaiUm.toString())) {
    options.push({ label: esqueceuVaiUm.toString(), misconception: MisconceptionTag.ESQUECEU_VAI_UM });
    opts.add(esqueceuVaiUm.toString());
  }
  
  // Misconception 2: Concatenou tudo em vez de reagrupar (ex: 27+15 = 312)
  const concatenou = parseInt(`${d1+d2}${u1+u2}`);
  if (!opts.has(concatenou.toString())) {
    options.push({ label: concatenou.toString(), misconception: MisconceptionTag.CONCATENOU_DIGITOS });
    opts.add(concatenou.toString());
  }
  
  // Misconception 3: Off-by-one (um a mais ou a menos no cálculo mental das unidades)
  const offByOne = sum + pick([-1, 1]);
  if (!opts.has(offByOne.toString())) {
    options.push({ label: offByOne.toString(), misconception: MisconceptionTag.OFF_BY_ONE });
    opts.add(offByOne.toString());
  }
  
  // Preencher até ter 4 opções
  while (options.length < 4) {
    const v = sum + pick([-10, 10, -2, 2, -3, 3]);
    if (v > 0 && !opts.has(v.toString())) {
      options.push({ label: v.toString() });
      opts.add(v.toString());
    }
  }

  return {
    kind: "vertical",
    prompt: "Resolva a conta armada:",
    vTop: a,
    vBot: b,
    vOp: "+",
    options: shuffle(options),
    answer: sum
  };
};

export const gN3_12 = (lvl: number): Question => {
  // Subtração com reagrupamento (ex: 42 - 15)
  // Force a borrow in the ones column: u1 < u2
  const d1 = ri(3, 9);
  const u1 = ri(1, 6);
  const d2 = ri(1, d1 - 1);
  const u2 = ri(u1 + 1, 9); // u2 > u1 ensures borrow is needed
  
  const a = d1 * 10 + u1;
  const b = d2 * 10 + u2;
  const ans = a - b;
  
  const opts = new Set<string>();
  const options: Option[] = [];
  
  // Right answer
  options.push({ label: ans.toString(), right: true });
  opts.add(ans.toString());
  
  // Misconception 1: Inverteu a coluna (Sempre subtrai o menor do maior: 2-5 -> 5-2 = 3)
  const invU = u2 - u1;
  const invAns = (d1 - d2) * 10 + invU;
  if (!opts.has(invAns.toString())) {
    options.push({ label: invAns.toString(), misconception: "inverte-coluna" });
    opts.add(invAns.toString());
  }
  
  // Misconception 2: Emprestou mas esqueceu de tirar 1 da dezena (ex: 42 - 15 = 37 em vez de 27)
  const esqueceuD = d1 * 10 + u1 - b + 10 - 10; // wait, if d1 is 4, 12-5=7, but 4-1=3 (forgets to decrement 4 to 3, so 37)
  const ansEsq = (d1 - d2) * 10 + (u1 + 10 - u2);
  if (!opts.has(ansEsq.toString())) {
    options.push({ label: ansEsq.toString(), misconception: "esqueceu-desconto-dezena" });
    opts.add(ansEsq.toString());
  }
  
  // Misconception 3: Off-by-one (um a mais ou a menos)
  const offByOne = ans + pick([-1, 1]);
  if (!opts.has(offByOne.toString())) {
    options.push({ label: offByOne.toString(), misconception: "off-by-one" });
    opts.add(offByOne.toString());
  }
  
  // Preencher até 4 opções
  while (options.length < 4) {
    const v = ans + pick([-10, 10, -2, 2, -3, 3]);
    if (v > 0 && !opts.has(v.toString())) {
      options.push({ label: v.toString() });
      opts.add(v.toString());
    }
  }

  return {
    kind: "vertical",
    prompt: "Resolva a conta armada:",
    vTop: a,
    vBot: b,
    vOp: "-",
    options: shuffle(options),
    answer: ans
  };
};

// N4.01 — Multiplicação: grupos iguais
export const gN4_01 = (lvl: number): Question => {
  const groups = ri(2, 5);
  const perGroup = ri(2, 5);
  const total = groups * perGroup;
  
  if (lvl === 1) {
    return {
      kind: "groups",
      prompt: `Temos ${groups} grupos com ${perGroup} frutinhas cada. Quantas frutinhas tem no total?`,
      groups: Array.from({ length: groups }, () => ({ emoji: pick(["🍎", "🍓", "🍊"]), n: perGroup })),
      options: numOpts(total, total - perGroup, total + perGroup, groups + perGroup),
      answer: total
    };
  } else {
    return {
      kind: "math",
      prompt: `Se temos ${groups} caixas e cada uma tem ${perGroup} brinquedos, qual é o total?`,
      expr: `${groups} × ${perGroup} = ?`,
      options: numOpts(total, total - perGroup, total + perGroup, groups + perGroup),
      answer: total
    };
  }
};

// N4.02 — Arranjos retangulares e comutatividade
export const gN4_02 = (lvl: number): Question => {
  const rows = ri(2, 5);
  const cols = ri(2, 5);
  const total = rows * cols;
  
  if (lvl === 1) {
    return {
      kind: "array",
      prompt: `Quantos bloquinhos tem no total? (Conte as ${rows} linhas de ${cols})`,
      a: rows, b: cols,
      emoji: pick(["🟦", "🟩", "🟨", "⭐", "📦"]),
      options: numOpts(total, total - rows, total + cols, rows + cols),
      answer: total
    };
  } else {
    return {
      kind: "array",
      prompt: `O retângulo tem ${rows} linhas e ${cols} colunas. Qual conta mostra o total?`,
      a: rows, b: cols,
      nlEnd: 1, // hack to show rotate button
      options: [
        { label: `${rows} × ${cols}`, value: `${rows} × ${cols}` },
        { label: `${rows} + ${cols}`, value: `${rows} + ${cols}` },
        { label: `${cols} - ${rows}`, value: `${cols} - ${rows}` }
      ],
      answer: `${rows} × ${cols}`
    };
  }
};

// N4.05 — Divisão: repartir e medir
export const gN4_05 = (lvl: number): Question => {
  const divisor = ri(2, 4);
  const quotient = ri(2, 6);
  const dividend = divisor * quotient;
  
  if (lvl <= 2) {
    return {
      kind: "drag-group",
      prompt: `Reparta ${dividend} doces igualmente em ${divisor} caixas. Quantos cada uma recebe?`,
      dividend,
      divisor,
      emoji: pick(["🍬", "🍩", "🍪"]),
      answer: quotient
    };
  } else {
    return {
      kind: "math",
      prompt: `Se você repartir ${dividend} doces igualmente para ${divisor} amigos, quantos doces cada um ganha?`,
      expr: `${dividend} ÷ ${divisor} = ?`,
      options: numOpts(quotient, quotient + 1, quotient - 1, dividend - divisor),
      answer: quotient
    };
  }
};

