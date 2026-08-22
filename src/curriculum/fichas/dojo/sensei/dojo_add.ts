import { Question, Track } from "../../../../types";
import { ri } from "../../../../utils/generators";
import { fisherYates } from "../../../../utils/shuffle";
import { stampSenseiDojoQuestion } from "../../../motores/senseiDojoPolicy";

export const gDojoAdd = (lvl: number): Question => {
  const step = Math.min(10, Math.max(1, Math.round(lvl)));
  let a = 0, b = 0;

  if (step === 1) {
    a = ri(1, 4);
    b = ri(1, 5 - a);
  } else if (step === 2) {
    a = ri(1, 9);
    b = ri(1, 10 - a);
  } else if (step === 3) {
    a = ri(1, 9);
    b = 10 - a;
  } else if (step === 4) {
    a = ri(6, 9);
    b = ri(11 - a, 9);
  } else if (step === 5) {
    a = ri(1, 9) * 10;
    b = ri(1, 9);
  } else if (step === 6) {
    // Sem reagrupamento: a unidade nunca pode ser 9, senão não existe b>=1 válido.
    const tens = ri(1, 8);
    const units = ri(1, 8);
    a = tens * 10 + units;
    b = ri(1, 9 - units);
  } else if (step === 7) {
    // Com reagrupamento: unidade 1..9 garante 10-units <= 9.
    const tens = ri(1, 8);
    const units = ri(1, 9);
    a = tens * 10 + units;
    b = ri(10 - units, 9);
  } else if (step === 8) {
    a = ri(1, 8) * 10;
    b = ri(1, 9 - Math.floor(a / 10)) * 10;
  } else if (step === 9) {
    const aTens = ri(1, 7);
    const aUnits = ri(1, 8);
    const bTens = ri(1, 8 - aTens);
    const bUnits = ri(1, 9 - aUnits);
    a = aTens * 10 + aUnits;
    b = bTens * 10 + bUnits;
  } else {
    const aTens = ri(1, 7);
    const aUnits = ri(1, 9);
    const bTens = ri(1, 8 - aTens);
    const bUnits = ri(10 - aUnits, 9);
    a = aTens * 10 + aUnits;
    b = bTens * 10 + bUnits;
  }

  if (Math.random() > 0.5) [a, b] = [b, a];

  const ans = a + b;
  const false1 = ans + ri(1, 3);
  const false2 = ans > 3 ? ans - ri(1, 3) : ans + 4;
  let false3 = ans + 10;
  if (ans >= 10 && Math.random() > 0.5) false3 = ans - 10;

  const opts = fisherYates([
    { label: `${ans}`, value: ans },
    { label: `${false1}`, value: false1 },
    { label: `${false2}`, value: false2 },
    { label: `${false3}`, value: false3 },
  ]);

  return stampSenseiDojoQuestion("dojo_add", step, {
    kind: "rapid-fire",
    prompt: "",
    expr: `${a} + ${b} = ?`,
    options: opts,
    answer: ans,
    explain: `${a} + ${b} = ${ans}`,
    rt_max_s: step <= 3 ? 6 : (step <= 6 ? 8 : (step <= 8 ? 10 : 15)),
  });
};

export const dojo_add: Track = {
  id: "dojo_add",
  name: "Academia da Adição",
  icon: "➕",
  color: "#fda4af",
  dark: "#be123c",
  gen: gDojoAdd,
  totalQ: 10,
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
    "2D + 2D (Com Vai 1)",
  ],
  prereqs: [],
  dominio: "automaticidade separada: 2 rounds ≥80% de precisão E fluência para subir; <60% de precisão em 2 rounds recua só o treino",
};
