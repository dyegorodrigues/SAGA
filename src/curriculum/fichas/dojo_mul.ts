import { Question, Track } from "../../types";
import { ri, pick } from "../../utils/generators";

export const gDojoMul = (lvl: number): Question => {
  let a = 0, b = 0;
  
  if (lvl === 1) {
    // Lvl 1: Tabuada do 2 (Dobros)
    a = 2;
    b = ri(1, 9);
  } else if (lvl === 2) {
    // Lvl 2: Tabuada do 3
    a = 3;
    b = ri(1, 9);
  } else if (lvl === 3) {
    // Lvl 3: Tabuada do 4
    a = 4;
    b = ri(1, 9);
  } else if (lvl === 4) {
    // Lvl 4: Tabuada do 5
    a = 5;
    b = ri(1, 9);
  } else if (lvl === 5) {
    // Lvl 5: Tabuadas 2 a 5 Misto
    a = ri(2, 5);
    b = ri(1, 9);
  } else if (lvl === 6) {
    // Lvl 6: Tabuada do 6 e 7
    a = pick([6, 7]);
    b = ri(1, 9);
  } else if (lvl === 7) {
    // Lvl 7: Tabuada do 8 e 9
    a = pick([8, 9]);
    b = ri(1, 9);
  } else if (lvl === 8) {
    // Lvl 8: Misto 6 a 9
    a = ri(6, 9);
    b = ri(1, 9);
  } else if (lvl === 9) {
    // Lvl 9: Tabuada do 10, 11
    a = pick([10, 11]);
    b = ri(1, 9);
  } else {
    // Lvl 10: Multiplicação com dezenas exatas (ex: 20 x 3)
    a = ri(2, 9) * 10;
    b = ri(2, 5);
  }

  if (Math.random() > 0.5) {
    const temp = a;
    a = b;
    b = temp;
  }

  const ans = a * b;

  let false1 = ans + a;
  let false2 = ans > b ? ans - b : ans + b + a;
  let false3 = ans + ri(1, 3);
  if (ans % 10 === 0) {
    false1 = ans + 10;
    false2 = ans > 10 ? ans - 10 : ans + 20;
    false3 = ans + 5;
  }

  const opts = [
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 }
  ].sort(() => Math.random() - 0.5);

  return {
    kind: "rapid-fire", prompt: "",
    expr: `${a} × ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} × ${b} = ${ans}`,
    rt_max_s: lvl <= 5 ? 8 : (lvl <= 8 ? 10 : 15)
  };
};

export const dojo_mul: Track = {
  id: "dojo_mul",
  name: "Academia da Multiplicação",
  icon: "✖️",
  color: "#fde68a",
  dark: "#b45309",
  gen: gDojoMul,
  lvlSkills: [
    "Tabuada do 2",
    "Tabuada do 3",
    "Tabuada do 4",
    "Tabuada do 5",
    "Misto 2 ao 5",
    "Tabuadas do 6 e 7",
    "Tabuadas do 8 e 9",
    "Misto 6 ao 9",
    "Tabuadas do 10 e 11",
    "Dezenas Exatas"
  ],
  prereqs: []
};
