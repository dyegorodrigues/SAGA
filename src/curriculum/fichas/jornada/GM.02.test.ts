import { describe, expect, it } from "vitest";
import { misconceptionForAnswer } from "../../../components/gameloop/answerPolicy";
import { MisconceptionTag } from "../../../constants/misconceptions";
import { generateRegisteredFichaQuestion } from "../../motores/composerCanary";
import { GM_02 } from "./GM.02";

const sample = (level: number, count = 120) =>
  Array.from({ length: count }, () => generateRegisteredFichaQuestion("GM.02", level));

describe("P22.5 — GM.02 Tempo cotidiano pré-leitor", () => {
  it("preserva o nó canônico e os cinco micros temporais", () => {
    expect(GM_02.faixa).toBe("F0");
    expect(GM_02.prereqs).toEqual([]);
    expect(GM_02.micros.map(micro => micro.id)).toEqual([
      "partes_dia",
      "relativos",
      "semana",
      "ordem_eventos",
      "misto",
    ]);
    expect(GM_02.niveis[5].rt_alvo).toBe(12000);
  });

  it("todas as questões são pré-leitoras e o acerto não carrega misconception", () => {
    for (let level = 1; level <= 5; level += 1) {
      for (const question of sample(level, 80)) {
        expect(question.kind).toBe("plain");
        expect(question.audioPrompt?.length).toBeGreaterThan(10);
        expect(question.audibleOptions).toBe(true);
        expect(question.options?.length).toBeGreaterThanOrEqual(3);
        expect(question.options?.every(option => Boolean(option.say))).toBe(true);
        expect(question.options?.map(option => String(option.value))).toContain(String(question.answer));
        expect(question.evaluate?.(question.answer)).toBe(true);
        expect(misconceptionForAnswer(question, question.answer)).toBeUndefined();
      }
    }
  });

  it("L1 cobre manhã, tarde e noite", () => {
    const seen = new Set(sample(1, 180).map(question => question.sig?.split(":").at(-1)));
    expect(seen).toEqual(new Set(["manha", "tarde", "noite"]));
  });

  it("L2 cobre ontem, hoje e amanhã sem exigir leitura das alternativas", () => {
    const seen = new Set(sample(2, 180).map(question => question.sig?.split(":").at(-1)));
    expect(seen).toEqual(new Set(["ontem", "hoje", "amanhã"]));
    for (const question of sample(2, 80)) {
      expect(question.options?.every(option => /\p{Extended_Pictographic}/u.test(String(option.label)))).toBe(true);
    }
  });

  it("L3 observa as duas direções e diagnostica apenas contraprovas causais", () => {
    let next = 0;
    let previous = 0;
    for (const question of sample(3, 220)) {
      if (question.sig?.endsWith(":next")) next += 1;
      if (question.sig?.endsWith(":previous")) previous += 1;
      const tagged = question.options?.filter(option => option.misconception) ?? [];
      expect(tagged.some(option => option.misconception === MisconceptionTag.DIRECAO_ERRADA)).toBe(true);
      expect(tagged.some(option => option.misconception === MisconceptionTag.OFF_BY_ONE)).toBe(true);
    }
    expect(next).toBeGreaterThan(0);
    expect(previous).toBeGreaterThan(0);
  });

  it("L4 usa ordem de eventos e marca inversões como ORDEM_ERRADA", () => {
    for (const question of sample(4, 100)) {
      expect(question.sig?.startsWith("gm02:order:")).toBe(true);
      const wrong = question.options?.filter(option => option.value !== question.answer) ?? [];
      expect(wrong.length).toBe(2);
      expect(wrong.every(option => misconceptionForAnswer(question, option.value) === MisconceptionTag.ORDEM_ERRADA)).toBe(true);
    }
  });

  it("L5 mistura as quatro famílias sem transformar tempo de resposta em domínio", () => {
    const families = new Set<string>();
    for (const question of sample(5, 480)) {
      families.add(question.sig?.split(":")[1] ?? "");
      expect(question.evaluate?.(question.answer)).toBe(true);
    }
    expect(families).toEqual(new Set(["daypart", "relative", "weekday", "order"]));
    expect(GM_02.niveis[5].rt_alvo).toBe(12000);
  });
});