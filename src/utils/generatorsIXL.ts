import { Question } from "../types";
import { numOpts, pickEmo } from "./generators";

export function gIXL_VisualAddition(lvl: number): Question {
  const a = Math.floor(Math.random() * 4) + 1;
  const b = Math.floor(Math.random() * 4) + 1;
  const total = a + b;
  const isBirds = Math.random() > 0.5;
  return {
    kind: "visual-addition",
    a,
    b,
    emoji: isBirds ? "🐦" : "🐨",
    n: total, // we use this for internal consistency or answer
    prompt: `Some. Quanto é ${a} + ${b}?`,
    audioPrompt: "Junte os grupos. Quantos tem no total?",
    options: numOpts(total, 4, 2, 8),
    answer: total,
    uiProps: {
      showNumbers: true
    }
  };
}

export function gIXL_Scattered(lvl: number): Question {
  const n = Math.floor(Math.random() * 6) + 3;
  const isStars = Math.random() > 0.5;
  return {
    kind: "scattered",
    n,
    emoji: isStars ? "⭐" : "✏️",
    prompt: isStars ? "Quantas estrelas tem?" : "Quantos lápis tem?",
    audioPrompt: "Conte. Quantos tem no total?",
    options: numOpts(n, 6, 2, 10),
    answer: n,
    uiProps: {
      ordered: !isStars // pencils are ordered, stars are scattered
    }
  };
}

export function gIXL_LinkingCubesSentence(lvl: number): Question {
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
    return [{ n: wrongA, color: "bg-emerald-400" }, { n: wrongB, color: "bg-indigo-400" }];
  };
  
  const rightGroups = [{ n: a, color: "bg-emerald-400" }, { n: b, color: "bg-indigo-400" }];
  
  return {
    kind: "plain", // We just use plain to show the prompt and the options will have the groups
    prompt: `Qual imagem mostra ${a} + ${b} = ${total}?`,
    audioPrompt: `Ache a imagem que mostra ${a} mais ${b} igual a ${total}.`,
    options: [
      { label: `a`, value: "right", groups: rightGroups },
      { label: `b`, value: "wrong1", groups: makeWrongGroups() },
    ].sort(() => Math.random() - 0.5),
    answer: "right"
  };
}

export function gIXL_TakeApart(lvl: number): Question {
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
  while((wrongA === newA && wrongB === newB) || (wrongA === a && wrongB === b) || (wrongA + wrongB !== total)) {
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
        label: `${newA} + ${newB}`, 
        value: "right",
        groups: [{ n: newA, color: "bg-emerald-400" }, { n: newB, color: "bg-indigo-400" }]
      },
      { 
        label: `${wrongA} + ${wrongB}`, 
        value: "wrong",
        groups: [{ n: wrongA, color: "bg-emerald-400" }, { n: wrongB, color: "bg-indigo-400" }]
      }
    ].sort(() => Math.random() - 0.5),
    answer: "right"
  };
}

export function gIXL_Sequence(lvl: number): Question {
  const start = Math.floor(Math.random() * 80) + 10;
  return {
    kind: "plain",
    prompt: `Conte a partir do ${start}. Quais números vêm depois?\n${start}, __, __, __`,
    audioPrompt: "Quais números vêm depois?",
    options: [
      { label: `${start+1}, ${start+2}, ${start+3}`, value: "right" },
      { label: `${start+10}, ${start+20}, ${start+30}`, value: "wrong1" },
      { label: `${start+1}, ${start+3}, ${start+5}`, value: "wrong2" },
    ].sort(() => Math.random() - 0.5),
    answer: "right"
  };
}

export function gIXL_MissingAddendFrame(lvl: number): Question {
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
