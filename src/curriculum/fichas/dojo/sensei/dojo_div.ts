import { Question, Track } from "../../../../types";
import { ri, pick } from "../../../../utils/generators";
import { fisherYates } from "../../../../utils/shuffle";
import { stampSenseiDojoQuestion } from "../../../motores/senseiDojoPolicy";

export const gDojoDiv = (lvl: number): Question => {
  const step = Math.min(10, Math.max(1, Math.round(lvl)));
  let a = 0, b = 0;
  let ans = 0;

  if (step === 1) {
    b = 2;
    ans = ri(1, 9);
  } else if (step === 2) {
    b = 3;
    ans = ri(1, 9);
  } else if (step === 3) {
    b = 4;
    ans = ri(1, 9);
  } else if (step === 4) {
    b = 5;
    ans = ri(1, 9);
  } else if (step === 5) {
    b = ri(2, 5);
    ans = ri(1, 9);
  } else if (step === 6) {
    b = pick([6, 7]);
    ans = ri(1, 9);
  } else if (step === 7) {
    b = pick([8, 9]);
    ans = ri(1, 9);
  } else if (step === 8) {
    b = ri(6, 9);
    ans = ri(1, 9);
  } else if (step === 9) {
    b = 10;
    ans = ri(1, 10);
  } else {
    b = ri(2, 5);
    ans = ri(1, 9) * 10;
  }

  a = b * ans;

  const false1 = ans + ri(1, 2);
  const false2 = ans > 2 ? ans - ri(1, 2) : ans + 3;
  let false3 = ans + b;
  if (ans >= 10 && ans % 10 === 0) false3 = ans + 10;

  const opts = fisherYates([
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 },
  ]);

  return stampSenseiDojoQuestion("dojo_div", step, {
    kind: "rapid-fire",
    prompt: "",
    expr: `${a} ÷ ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} ÷ ${b} = ${ans}`,
    rt_max_s: step <= 5 ? 10 : 15,
  });
};

export const dojo_div: Track = {
  id: "dojo_div",
  name: "Academia da Divisão",
  icon: "➗",
  color: "#a7f3d0",
  dark: "#047857",
  gen: gDojoDiv,
  totalQ: 10,
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
    "Dezenas Exatas",
  ],
  prereqs: [],
  dominio: "automaticidade separada: 2 rounds ≥80% de precisão E fluência para subir; <60% de precisão em 2 rounds recua só o treino",
};
