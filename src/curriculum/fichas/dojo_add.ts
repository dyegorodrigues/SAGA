import { Question, Track } from "../../types";
import { ri } from "../../utils/generators"; // using random int

export const gDojoAdd = (lvl: number): Question => {
  let a = 0, b = 0;
  
  if (lvl === 1) {
    // Lvl 1: 1 digit + 1 digit (sum up to 5)
    a = ri(1, 4);
    b = ri(1, 5 - a);
  } else if (lvl === 2) {
    // Lvl 2: 1 digit + 1 digit (sum up to 10)
    a = ri(1, 9);
    b = ri(1, 10 - a);
  } else if (lvl === 3) {
    // Lvl 3: Amigos do 10 (always sum to 10)
    a = ri(1, 9);
    b = 10 - a;
  } else if (lvl === 4) {
    // Lvl 4: 1 digit + 1 digit (sum up to 18, cross 10)
    a = ri(6, 9);
    b = ri(10 - a + 1, 9);
  } else if (lvl === 5) {
    // Lvl 5: 10 + 1 digit (Dezenas exatas + unidade)
    a = ri(1, 9) * 10;
    b = ri(1, 9);
  } else if (lvl === 6) {
    // Lvl 6: 2 digits + 1 digit (no grouping)
    a = ri(11, 88);
    b = ri(1, 9 - (a % 10)); // guarantee no grouping
  } else if (lvl === 7) {
    // Lvl 7: 2 digits + 1 digit (with grouping)
    a = ri(11, 88);
    b = ri(10 - (a % 10), 9);
  } else if (lvl === 8) {
    // Lvl 8: Dezenas exatas + Dezenas exatas
    a = ri(1, 8) * 10;
    b = ri(1, 9 - Math.floor(a/10)) * 10;
  } else if (lvl === 9) {
    // Lvl 9: 2 digits + 2 digits (no grouping)
    a = ri(11, 77);
    b = ri(1, 8 - Math.floor(a/10)) * 10 + ri(1, 9 - (a % 10));
  } else {
    // Lvl 10: 2 digits + 2 digits (with grouping)
    a = ri(11, 88);
    let maxDez = 8 - Math.floor(a/10);
    if (maxDez < 1) maxDez = 1;
    let bDez = ri(1, maxDez);
    let bUni = ri(10 - (a % 10), 9);
    b = bDez * 10 + bUni;
  }

  // Randomize a and b for display
  if (Math.random() > 0.5) {
    const temp = a;
    a = b;
    b = temp;
  }

  const ans = a + b;

  // Generate false options (off by 1, off by 10, etc.)
  const false1 = ans + ri(1, 3);
  const false2 = ans > 3 ? ans - ri(1, 3) : ans + 4;
  let false3 = ans + 10;
  if (ans >= 10 && Math.random() > 0.5) {
    false3 = ans - 10;
  }

  const opts = [
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 }
  ].sort(() => Math.random() - 0.5);

  return {
    kind: "rapid-fire", prompt: "",
    expr: `${a} + ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} + ${b} = ${ans}`,
    rt_max_s: lvl <= 3 ? 6 : (lvl <= 6 ? 8 : (lvl <= 8 ? 10 : 15))
  };
};

export const dojo_add: Track = {
  id: "dojo_add",
  name: "Academia da Adição",
  icon: "➕",
  color: "#fda4af",
  dark: "#be123c",
  gen: gDojoAdd,
  lvlSkills: [
    "Até 5",
    "Até 10",
    "Amigos do 10",
    "Passando de 10",
    "Dezena + Unidade",
    "2D + 1D (Sem Vai 1)",
    "2D + 1D (Com Vai 1)",
    "Dezenas Exatas",
    "2D + 2D (Sem Vai 1)",
    "2D + 2D (Com Vai 1)"
  ],
  prereqs: []
};
