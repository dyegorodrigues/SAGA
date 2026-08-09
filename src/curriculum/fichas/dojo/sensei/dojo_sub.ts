import { Question, Track } from "../../../../types";
import { ri } from "../../../../utils/generators";
import { stampSenseiDojoQuestion } from "../../../motores/senseiDojoPolicy";

export const gDojoSub = (lvl: number): Question => {
  const step = Math.min(10, Math.max(1, Math.round(lvl)));
  let a = 0, b = 0;

  if (step === 1) {
    a = ri(2, 5);
    b = ri(1, a - 1);
  } else if (step === 2) {
    a = ri(6, 10);
    b = ri(1, a - 1);
  } else if (step === 3) {
    a = 10;
    b = ri(1, 9);
  } else if (step === 4) {
    a = ri(11, 18);
    b = ri(a - 9, 9);
  } else if (step === 5) {
    a = ri(2, 9) * 10;
    b = ri(1, 9);
  } else if (step === 6) {
    // Sem empréstimo: garante unidade >=1 para existir subtraendo positivo.
    const tens = ri(1, 8);
    const units = ri(1, 9);
    a = tens * 10 + units;
    b = ri(1, units);
  } else if (step === 7) {
    const tens = ri(1, 8);
    const units = ri(0, 8);
    a = tens * 10 + units;
    b = ri(units + 1, 9);
  } else if (step === 8) {
    a = ri(2, 9) * 10;
    b = ri(1, (a / 10) - 1) * 10;
  } else if (step === 9) {
    // Sem empréstimo: ambas as casas de b cabem nas de a.
    const aTens = ri(2, 9);
    const aUnits = ri(1, 9);
    const bTens = ri(1, aTens - 1);
    const bUnits = ri(0, aUnits);
    a = aTens * 10 + aUnits;
    b = bTens * 10 + bUnits;
  } else {
    const aTens = ri(3, 9);
    const aUnits = ri(0, 8);
    const bTens = ri(1, aTens - 2);
    const bUnits = ri(aUnits + 1, 9);
    a = aTens * 10 + aUnits;
    b = bTens * 10 + bUnits;
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
    { label: `${false3}`, value: false3 },
  ].sort(() => Math.random() - 0.5);

  return stampSenseiDojoQuestion("dojo_sub", step, {
    kind: "rapid-fire",
    prompt: "",
    expr: `${a} - ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} - ${b} = ${ans}`,
    rt_max_s: step <= 3 ? 6 : (step <= 6 ? 8 : (step <= 8 ? 10 : 15)),
  });
};

export const dojo_sub: Track = {
  id: "dojo_sub",
  name: "Academia da Subtração",
  icon: "➖",
  color: "#c7d2fe",
  dark: "#4338ca",
  gen: gDojoSub,
  totalQ: 10,
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
    "2D - 2D (Com Emprest.)",
  ],
  prereqs: [],
  dominio: "automaticidade separada: 2 rounds ≥80% de precisão E fluência para subir; <60% de precisão em 2 rounds recua só o treino",
};
