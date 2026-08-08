import { describe, expect, it } from "vitest";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { generateRegisteredFichaQuestion } from "../../motores/composerCanary";

describe("P22.4 — telemetria causal de N1.09", () => {
  it("reiniciar no 1 diagnostica dependência de contar a partir do começo", () => {
    for (let i = 0; i < 80; i += 1) {
      const q = generateRegisteredFichaQuestion("N1.09", 3);
      const restart = q.options?.find(option => String(option.value) === "1 · 2 · 3");
      expect(restart, "L3 precisa carregar a contraprova de reiniciar no 1").toBeDefined();
      expect(misconceptionForAnswer(q, restart!.value)).toBe(MisconceptionTag.NAO_CONTA_A_PARTIR_DE);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
    }
  });

  it("andar para frente na regressiva diagnostica direção errada", () => {
    for (let i = 0; i < 80; i += 1) {
      const q = generateRegisteredFichaQuestion("N1.09", 4);
      const start = Number(String(q.big).split("→")[0].trim());
      const forward = [start + 1, start + 2, start + 3].join(" · ");
      const option = q.options?.find(candidate => String(candidate.value) === forward);
      expect(option, "L4 precisa contrastar explicitamente a direção").toBeDefined();
      expect(misconceptionForAnswer(q, option!.value)).toBe(MisconceptionTag.DIRECAO_ERRADA);
      expect(misconceptionForAnswer(q, q.answer)).toBeUndefined();
    }
  });

  it("ordem quebrada sem hipótese segura não fabrica diagnóstico", () => {
    for (let i = 0; i < 80; i += 1) {
      const q = generateRegisteredFichaQuestion("N1.09", 3);
      const start = Number(String(q.big).split("→")[0].trim());
      const broken = [start + 1, start + 3, start + 2].join(" · ");
      const option = q.options?.find(candidate => String(candidate.value) === broken);
      expect(option).toBeDefined();
      expect(misconceptionForAnswer(q, option!.value)).toBeUndefined();
    }
  });
});
