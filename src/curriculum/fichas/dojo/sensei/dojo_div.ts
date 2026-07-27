import { Question, Track } from "../../../../types";
import { ri, pick } from "../../../../utils/generators";

export const gDojoDiv = (lvl: number): Question => {
  let a = 0, b = 0; // a / b = ans
  let ans = 0;
  
  if (lvl === 1) {
    // Lvl 1: Divisão por 2
    b = 2;
    ans = ri(1, 9);
  } else if (lvl === 2) {
    // Lvl 2: Divisão por 3
    b = 3;
    ans = ri(1, 9);
  } else if (lvl === 3) {
    // Lvl 3: Divisão por 4
    b = 4;
    ans = ri(1, 9);
  } else if (lvl === 4) {
    // Lvl 4: Divisão por 5
    b = 5;
    ans = ri(1, 9);
  } else if (lvl === 5) {
    // Lvl 5: Misto 2 ao 5
    b = ri(2, 5);
    ans = ri(1, 9);
  } else if (lvl === 6) {
    // Lvl 6: Divisão por 6 e 7
    b = pick([6, 7]);
    ans = ri(1, 9);
  } else if (lvl === 7) {
    // Lvl 7: Divisão por 8 e 9
    b = pick([8, 9]);
    ans = ri(1, 9);
  } else if (lvl === 8) {
    // Lvl 8: Misto 6 ao 9
    b = ri(6, 9);
    ans = ri(1, 9);
  } else if (lvl === 9) {
    // Lvl 9: Divisão por 10
    b = 10;
    ans = ri(1, 10);
  } else {
    // Lvl 10: Divisão de dezenas exatas
    b = ri(2, 5);
    ans = ri(1, 9) * 10;
  }

  a = b * ans;

  const false1 = ans + ri(1, 2);
  const false2 = ans > 2 ? ans - ri(1, 2) : ans + 3;
  let false3 = ans + b;
  if (ans >= 10 && ans % 10 === 0) {
    false3 = ans + 10;
  }

  const opts = [
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 }
  ].sort(() => Math.random() - 0.5);

  return {
    kind: "rapid-fire", prompt: "",
    expr: `${a} ÷ ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} ÷ ${b} = ${ans}`,
    rt_max_s: lvl <= 5 ? 10 : 15
  };
};

export const dojo_div: Track = {
  id: "dojo_div",
  name: "Academia da Divisão",
  icon: "➗",
  color: "#a7f3d0",
  dark: "#047857",
  gen: gDojoDiv,
  lvlSkills: [
    "Dividir por 2",
    "Dividir por 3",
    "Dividir por 4",
    "Dividir por 5",
    "Misto 2 ao 5",
    "Dividir por 6 e 7",
    "Dividir por 8 e 9",
    "Misto 6 ao 9",
    "Dividir por 10",
    "Dezenas Exatas"
  ],
  prereqs: []
};
