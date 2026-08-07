import { Question } from "../types";
import { numOpts, pickEmo } from "../utils/generators";

export function gVis_VisualAddition(lvl: number): Question {
  const a = Math.floor(Math.random() * 4) + 1;
  const b = Math.floor(Math.random() * 4) + 1;
  const total = a + b;
  const emojis = ["🐦", "🐨", "🐸", "🐳", "🐢", "🐙", "🐞", "🐛", "🦋", "🐌", "🍎", "🍕", "🍔", "🎈"];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return {
    kind: "visual-addition",
    a,
    b,
    emoji,
    n: total, // we use this for internal consistency or answer
    prompt: `Quanto é ${a} + ${b}?`,
    audioPrompt: `Quanto é ${a} mais ${b}?`,
    options: numOpts(total, 4, 2, 8),
    answer: total,
    uiProps: {
      showNumbers: true
    }
  };
}

export function gVis_Scattered(lvl: number): Question {
  const n = Math.floor(Math.random() * 6) + 3;
  const categories = [
    { items: ["🐵", "🦁", "🐯", "🐼", "🐶", "🐱", "🦊", "🐻", "🐸"], name: "animais" },
    { items: ["🍌", "🍎", "🍓", "🍇", "🍉", "🍍", "🍒", "🥝"], name: "frutas" },
    { items: ["🚗", "🚕", "🚙", "🚌", "🚒", "🚑", "🚜"], name: "veículos" },
    { items: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉"], name: "bolas" },
    { items: ["🍩", "🍪", "🎂", "🍰", "🧁", "🍫", "🍬", "🍭"], name: "doces" },
    { items: ["🌺", "🌻", "🌹", "🌷", "🌼", "🌸"], name: "flores" }
  ];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const emoji = cat.items[Math.floor(Math.random() * cat.items.length)];
  const name = cat.name;

  return {
    kind: "scattered",
    n,
    emoji,
    prompt: `Quantos(as) ${name} tem?`,
    audioPrompt: "Conte. Quantos tem no total?",
    options: numOpts(n, 6, 2, 10),
    answer: n,
    uiProps: {
      ordered: false // scattered
    }
  };
}

export function gVis_LinkingCubesSentence(lvl: number): Question {
  const a = Math.floor(Math.random() * 4) + 1;
  const b = Math.floor(Math.random() * 4) + 1;
  const total = a + b;
  
  // Options will be image of cubes! We want the user to pick which image matches "a + b = total"
  const makeWrongGroups = () => {
    let wrongA = a, wrongB = b;
    while(wrongA === a && wrongB === b) {
      wrongA = Math.floor(Math.random() * 4) + 1;
      wrongB = Math.floor(Math.random() * 4) + 1;
    }
    return [{ n: wrongA, color: "bg-blue-400" }, { n: wrongB, color: "bg-rose-400" }];
  };
  
  const rightGroups = [{ n: a, color: "bg-blue-400" }, { n: b, color: "bg-rose-400" }];
  
  return {
    kind: "plain",  
    prompt: `Qual imagem mostra ${a} + ${b} = ${total}?`,
    audioPrompt: `Ache a imagem que mostra ${a} mais ${b} igual a ${total}.`,
    options: [
      { label: "", value: "right", groups: rightGroups },
      { label: "", value: "wrong1", groups: makeWrongGroups() },
    ].sort(() => Math.random() - 0.5),
    answer: "right"
  };
}

export function gVis_TakeApart(lvl: number): Question {
  const total = Math.floor(Math.random() * 4) + 4; // 4 to 7
  let a = Math.floor(Math.random() * (total - 1)) + 1;
  const b = total - a;
  
  // They need to pick another combination
  let newA = a, newB = b;
  while(newA === a || newA === 0 || newA === total) {
    newA = Math.floor(Math.random() * (total - 1)) + 1;
    newB = total - newA;
  }
  
  let wrongA = newA, wrongB = newB;
  while((wrongA === newA && wrongB === newB) || (wrongA === a && wrongB === b) || (wrongA + wrongB === total)) {
    // Generate a wrong combination that still sums to total? No, generate a wrong combination that doesn't sum to total, or sums to total but is the same as the original.
    // IXL shows different block combinations.
    wrongA = Math.floor(Math.random() * total) + 1;
    wrongB = Math.floor(Math.random() * total) + 1;
  }
  
  return {
    kind: "take-apart",
    a,
    b,
    n: total,
    prompt: `Mostre uma maneira diferente de separar ${total}.`,
    audioPrompt: "Qual é a outra maneira de separar os blocos?",
    options: [
      { 
        label: "", 
        value: "right",
        groups: [{ n: newA, color: "bg-blue-400" }, { n: newB, color: "bg-rose-400" }]
      },
      { 
        label: "", 
        value: "wrong",
        groups: [{ n: wrongA, color: "bg-blue-400" }, { n: wrongB, color: "bg-rose-400" }]
      }
    ].sort(() => Math.random() - 0.5),
    answer: "right"
  };
}

/**
 * A N1.09 — *"contagem até 20 e a partir de qualquer número"*.
 *
 * ⚠️ **Ainda é legado**, e ainda pede leitura. Mas o escopo estava absurdo: o
 * início era sorteado entre 10 e 89, então uma criança de faixa **F0** — quatro
 * anos, que ainda não lê — recebia *"conte a partir do 87"* e três listas de
 * números até 119 para escolher.
 *
 * O `GRAFO_DE_CONHECIMENTO_SAGA.md` escreve as micros desta competência: contar
 * objetos de 10 a 15, de 10 a 20, *"continue: 8, 9, __, __"* e a regressiva de
 * 10 a 0. Nada passa de vinte.
 *
 * Este conserto é de ESCOPO, não de forma: a competência continua sem ficha no
 * cânone, e é isso que a pendência registra. Mas um nó de F0 servindo números
 * até 119 é um defeito por si só, e ele some numa linha.
 */
export function gVis_Sequence(lvl: number): Question {
  // Até 20, como as micros do grafo dizem. O teto do início deixa espaço para
  // os três números seguintes caberem dentro do vinte.
  const start = Math.floor(Math.random() * 9) + 8;
  return {
    kind: "plain",
    prompt: `Conte a partir do ${start}. Quais números vêm depois?`,
    audioPrompt: "Quais números vêm depois?",
    options: [
      { label: `${start+1}, ${start+2}, ${start+3}`, value: "right" },
      // O distrator do salto de dez sairia de 20 no escopo novo; o de pular de
      // dois em dois mora dentro dele e é o erro real desta idade.
      { label: `${start+2}, ${start+4}, ${start+6}`, value: "wrong1" },
      { label: `${start+1}, ${start+3}, ${start+5}`, value: "wrong2" },
    ].sort(() => Math.random() - 0.5),
    answer: "right",
    uiProps: { text: `${start}, ___, ___, ___` }
  };
}

export function gVis_MissingAddendFrame(lvl: number): Question {
  const current = Math.floor(Math.random() * 9) + 1;
  const missing = 10 - current;
  return {
    kind: "tenframe",
    n: current,
    prompt: `Um quadro cheio tem 10 formas. Quantas formas a mais você precisa para fazer 10?`,
    audioPrompt: "Quantas formas faltam para completar dez?",
    options: numOpts(missing, 4, 1, 9),
    answer: missing,
  };
}
