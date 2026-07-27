import { Question, Track } from "../../types";
import { ri } from "../../utils/generators"; 

export const gDojoSub = (lvl: number): Question => {
  let a = 0, b = 0;
  
  if (lvl === 1) {
    // Lvl 1: Subtração simples até 5
    a = ri(2, 5);
    b = ri(1, a - 1);
  } else if (lvl === 2) {
    // Lvl 2: Subtração até 10
    a = ri(6, 10);
    b = ri(1, a - 1);
  } else if (lvl === 3) {
    // Lvl 3: Amigos do 10 reversos (10 - X)
    a = 10;
    b = ri(1, 9);
  } else if (lvl === 4) {
    // Lvl 4: Passando do 10 (ex: 12 - 3)
    a = ri(11, 18);
    b = ri(a - 9, 9);
  } else if (lvl === 5) {
    // Lvl 5: Dezenas exatas menos unidade (ex: 20 - 3)
    a = ri(2, 9) * 10;
    b = ri(1, 9);
  } else if (lvl === 6) {
    // Lvl 6: 2D - 1D sem empréstimo (ex: 25 - 3)
    a = ri(12, 89);
    b = ri(1, a % 10);
  } else if (lvl === 7) {
    // Lvl 7: 2D - 1D com empréstimo (ex: 23 - 5)
    a = ri(11, 88);
    if (a % 10 === 9) a--;
    b = ri((a % 10) + 1, 9);
  } else if (lvl === 8) {
    // Lvl 8: Dezenas exatas menos dezenas exatas
    a = ri(2, 9) * 10;
    b = ri(1, (a/10) - 1) * 10;
  } else if (lvl === 9) {
    // Lvl 9: 2D - 2D sem empréstimo
    a = ri(21, 99);
    let aDez = Math.floor(a/10);
    let aUni = a % 10;
    let bDez = ri(1, aDez - 1);
    let bUni = ri(1, aUni); // ensure bUni <= aUni
    b = bDez * 10 + bUni;
  } else {
    // Lvl 10: 2D - 2D com empréstimo
    a = ri(31, 98);
    let aDez = Math.floor(a/10);
    let aUni = a % 10;
    if (aUni === 9) {
      a--;
      aUni--;
    }
    let bDez = ri(1, aDez - 2); 
    let bUni = ri(aUni + 1, 9);
    b = bDez * 10 + bUni;
  }

  const ans = a - b;

  const false1 = ans + ri(1, 3);
  const false2 = ans > 3 ? ans - ri(1, 3) : ans + 4;
  let false3 = ans + 10;
  if (ans >= 10 && Math.random() > 0.5) false3 = ans - 10;

  const opts = [
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 }
  ].sort(() => Math.random() - 0.5);

  return {
    kind: "rapid-fire", prompt: "",
    expr: `${a} - ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} - ${b} = ${ans}`,
    rt_max_s: lvl <= 3 ? 6 : (lvl <= 6 ? 8 : (lvl <= 8 ? 10 : 15))
  };
};

export const dojo_sub: Track = {
  id: "dojo_sub",
  name: "Academia da Subtração",
  icon: "➖",
  color: "#c7d2fe",
  dark: "#4338ca",
  gen: gDojoSub,
  lvlSkills: [
    "Até 5",
    "Até 10",
    "Tirando de 10",
    "Cruzando o 10",
    "Tirando de Dezenas",
    "2D - 1D (Sem Emprest.)",
    "2D - 1D (Com Emprest.)",
    "Dezenas Exatas",
    "2D - 2D (Sem Emprest.)",
    "2D - 2D (Com Emprest.)"
  ],
  prereqs: []
};
