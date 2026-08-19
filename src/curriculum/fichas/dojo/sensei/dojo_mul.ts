import { Question, Track } from "../../../../types";
import { ri, pick } from "../../../../utils/generators";
import { fisherYates } from "../../../../utils/shuffle";
import { stampSenseiDojoQuestion } from "../../../motores/senseiDojoPolicy";

export const gDojoMul = (lvl: number): Question => {
  const step = Math.min(10, Math.max(1, Math.round(lvl)));
  let a = 0, b = 0;

  if (step === 1) {
    a = 2;
    b = ri(1, 9);
  } else if (step === 2) {
    a = 3;
    b = ri(1, 9);
  } else if (step === 3) {
    a = 4;
    b = ri(1, 9);
  } else if (step === 4) {
    a = 5;
    b = ri(1, 9);
  } else if (step === 5) {
    a = ri(2, 5);
    b = ri(1, 9);
  } else if (step === 6) {
    a = pick([6, 7]);
    b = ri(1, 9);
  } else if (step === 7) {
    a = pick([8, 9]);
    b = ri(1, 9);
  } else if (step === 8) {
    a = ri(6, 9);
    b = ri(1, 9);
  } else if (step === 9) {
    a = pick([10, 11]);
    b = ri(1, 9);
  } else {
    a = ri(2, 9) * 10;
    b = ri(2, 5);
  }

  if (Math.random() > 0.5) [a, b] = [b, a];

  const ans = a * b;
  let false1 = ans + a;
  let false2 = ans > b ? ans - b : ans + b + a;
  let false3 = ans + ri(1, 3);
  if (ans % 10 === 0) {
    false1 = ans + 10;
    false2 = ans > 10 ? ans - 10 : ans + 20;
    false3 = ans + 5;
  }

  const opts = fisherYates([
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 },
  ]);

  return stampSenseiDojoQuestion("dojo_mul", step, {
    kind: "rapid-fire",
    prompt: "",
    expr: `${a} × ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} × ${b} = ${ans}`,
    rt_max_s: step <= 5 ? 8 : (step <= 8 ? 10 : 15),
  });
};

export const dojo_mul: Track = {
  id: "dojo_mul",
  name: "Academia da Multiplicação",
  icon: "✖️",
  color: "#fde68a",
  dark: "#b45309",
  gen: gDojoMul,
  totalQ: 10,
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
    "Dezenas Exatas",
  ],
  prereqs: [],
  dominio: "automaticidade separada: 2 rounds ≥80% de precisão E fluência para subir; <60% de precisão em 2 rounds recua só o treino",
};
