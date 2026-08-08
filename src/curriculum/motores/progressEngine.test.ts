import { describe, expect, it } from "vitest";
import { Progress } from "../../types";
import {
  MasteryAttempt,
  faltaParaCoroa, applyJourneyAnswer, migrateLegacyCrown } from "./progressEngine";

function progress(overrides: Partial<Progress> = {}): Progress {
  return {
    lvl: 1,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 0,
    tot: 0,
    bank: [],
    mast: 0,
    ...overrides,
  };
}

describe("progressEngine", () => {
  it("promotes after the third correct answer and preserves earned maxLvl", () => {
    const result = applyJourneyAnswer(progress({ lvl: 2, streak: 2, maxLvl: 2 }), true, false);

    expect(result.progress).toMatchObject({ lvl: 3, maxLvl: 3, streak: 0, ok: 1, tot: 1 });
    expect(result.transition).toEqual({ type: "level-up", level: 3 });
  });

  it("keeps warmup errors from increasing frustration", () => {
    const result = applyJourneyAnswer(progress({ lvl: 3, streak: 2, bad: 2 }), false, true);

    expect(result.progress).toMatchObject({ lvl: 3, streak: 0, bad: 2, tot: 1 });
    expect(result.transition).toBeNull();
  });

  it("steps back only on the third non-warmup error", () => {
    const result = applyJourneyAnswer(progress({ lvl: 4, bad: 2 }), false, false);

    expect(result.progress).toMatchObject({ lvl: 3, bad: 0, tot: 1 });
    expect(result.transition).toEqual({ type: "level-down", level: 3 });
  });

  it("isolates the current legacy crown rule for the multidimensional migration", () => {
    const result = applyJourneyAnswer(progress({ lvl: 5, maxLvl: 5, streak: 2 }), true, false);

    expect(result.progress.dom).toBe(true);
    expect(result.transition).toEqual({ type: "legacy-crown" });
    expect(result.progress.masteryEvidence?.crownedBy).toBe("legacy");
  });

  it("requires comprehension, independence, fluency and delayed retention for a new crown", () => {
    let current = progress({ lvl: 5, maxLvl: 5 });
    const attempt = {
      durationMs: 1800,
      targetRtMs: 2000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-07-01",
      previousPracticeDay: "2026-07-01",
    };

    for (let i = 0; i < 3; i += 1) {
      current = applyJourneyAnswer(current, true, false, attempt).progress;
    }
    expect(current.dom).not.toBe(true);
    expect(current.masteryEvidence).toMatchObject({
      comprehensionStreak: 3,
      independenceStreak: 3,
      fluencyStreak: 3,
      retentionPasses: 0,
      candidateDay: "2026-07-01",
    });

    let retained = applyJourneyAnswer(current, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).not.toBe(true);
    retained = applyJourneyAnswer(retained.progress, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).not.toBe(true);
    retained = applyJourneyAnswer(retained.progress, true, false, {
      ...attempt,
      isReview: true,
      practiceDay: "2026-07-03",
      previousPracticeDay: "2026-07-01",
    });
    expect(retained.progress.dom).toBe(true);
    expect(retained.progress.masteryEvidence?.crownedBy).toBe("multidimensional");
    expect(retained.transition).toEqual({ type: "multidimensional-crown" });
  });

  it("does not treat aided or slow answers as independent fluent evidence", () => {
    const aided = applyJourneyAnswer(progress({ lvl: 5, maxLvl: 5 }), true, false, {
      durationMs: 1500,
      targetRtMs: 2000,
      helpUsed: true,
      isReview: false,
      practiceDay: "2026-07-01",
    });
    expect(aided.progress.helpClicks).toBe(1);
    expect(aided.progress.masteryEvidence).toMatchObject({ independenceStreak: 0, fluencyStreak: 1 });

    const slow = applyJourneyAnswer(aided.progress, true, false, {
      durationMs: 2500,
      targetRtMs: 2000,
      helpUsed: false,
      isReview: false,
      practiceDay: "2026-07-01",
    });
    expect(slow.progress.masteryEvidence).toMatchObject({ independenceStreak: 1, fluencyStreak: 0 });
    expect(slow.progress.dom).not.toBe(true);
  });

  it("does not mutate the progress or review bank received from React state", () => {
    const original = progress({ bank: [{ sig: "q", hits: 0, q: { kind: "plain", prompt: "?", answer: 1 } }] });
    const result = applyJourneyAnswer(original, true, false);

    expect(result.progress).not.toBe(original);
    expect(result.progress.bank).not.toBe(original.bank);
    expect(original).toMatchObject({ ok: 0, tot: 0, streak: 0 });
  });

  it("preserves old crowns while marking their evidence provenance", () => {
    const migrated = migrateLegacyCrown(progress({ lvl: 5, dom: true }));

    expect(migrated.dom).toBe(true);
    expect(migrated.masteryEvidence?.crownedBy).toBe("legacy");
  });

  it("uses the accelerated two-success staircase only inside a rescue", () => {
    const first = applyJourneyAnswer(
      progress({ lvl: 2, maxLvl: 2 }), true, false, undefined,
      { kind: "rescue", requiredLevel: 3 },
    );
    const second = applyJourneyAnswer(
      first.progress, true, false, undefined,
      { kind: "rescue", requiredLevel: 3 },
    );

    expect(first.progress.lvl).toBe(2);
    expect(second.progress.lvl).toBe(3);
    expect(second.transition).toEqual({ type: "level-up", level: 3 });
  });
});

describe("P13 — a coroa passa a exigir a evidência que a ficha declara", () => {
  const base: Progress = {
    lvl: 5, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 5,
  };
  const tentativa = (extra: Partial<MasteryAttempt> = {}): MasteryAttempt => ({
    durationMs: 60000,          // devagar de propósito: o relógio não pode reprovar
    helpUsed: false,
    isReview: false,
    practiceDay: "2026-08-10",
    ...extra,
  });

  function tresAcertos(exige?: string, evidencias?: string[]): Progress {
    let p = base;
    for (let i = 0; i < 3; i += 1) {
      p = applyJourneyAnswer(p, true, false, tentativa({ exigeEvidencia: exige, evidencias })).progress;
      p = { ...p, lvl: 5 };
    }
    return p;
  }

  it("⚠️ o RELÓGIO não coroa nem reprova mais — §5.1-bis", () => {
    // Antes disto, `fluencyStreak` exigia responder dentro do `rt_alvo` três
    // vezes seguidas, e sem `rt_alvo` declarado a criança NUNCA era coroada.
    // Uma criança que entende tudo e responde devagar ficava sem a coroa.
    const p = tresAcertos();
    expect(p.masteryEvidence?.comprehensionStreak).toBe(3);
    expect(p.masteryEvidence?.independenceStreak).toBe(3);
    expect(p.masteryEvidence?.fluencyStreak).toBe(0);   // devagar, e tudo bem
    expect(p.masteryEvidence?.evidenciaDaFicha).toBe(true);
  });

  it("⚠️ com evidência exigida e nunca demonstrada, a coroa NÃO vem", () => {
    // É o caso que a P13 descreve: a criança acerta tudo, sempre com andaime, e
    // recebia domínio de uma competência que nunca praticou sem apoio.
    const p = tresAcertos("sem-andaime");
    expect(p.masteryEvidence?.evidenciaDaFicha).toBe(false);
    expect(p.dom).toBeFalsy();
  });

  it("demonstrada uma vez, a evidência fica — mesmo errando depois", () => {
    // A §9 diz "pelo menos UM acerto" naquela condição: é fato histórico, não
    // sequência. Errar depois zera as streaks, não desfaz o que ela mostrou.
    let p = applyJourneyAnswer(base, true, false,
      tentativa({ exigeEvidencia: "sem-andaime", evidencias: ["sem-andaime"] })).progress;
    expect(p.masteryEvidence?.evidenciaDaFicha).toBe(true);

    p = applyJourneyAnswer({ ...p, lvl: 5 }, false, false,
      tentativa({ exigeEvidencia: "sem-andaime" })).progress;
    expect(p.masteryEvidence?.comprehensionStreak).toBe(0);
    expect(p.masteryEvidence?.evidenciasVistas).toContain("sem-andaime");
  });

  it("⚠️ a evidência é colhida FORA do nível 5 também", () => {
    // O caso que obriga: a F48 pede um acerto com a forma girada, e o nível 5
    // dela é o dos sólidos, onde giro não existe. Colhida só no topo, seria uma
    // evidência impossível.
    const noNivel2 = applyJourneyAnswer({ ...base, lvl: 2 }, true, false,
      tentativa({ exigeEvidencia: "forma-girada", evidencias: ["forma-girada"] })).progress;
    expect(noNivel2.masteryEvidence?.evidenciasVistas).toContain("forma-girada");
  });

  it("o resposta ERRADA não deixa evidência", () => {
    const p = applyJourneyAnswer(base, false, false,
      tentativa({ exigeEvidencia: "sem-andaime", evidencias: ["sem-andaime"] })).progress;
    expect(p.masteryEvidence?.evidenciasVistas ?? []).not.toContain("sem-andaime");
  });

  it("`faltaParaCoroa` diz em português o que ainda falta", () => {
    // Existe porque esta é a única dimensão que a criança pode não alcançar SEM
    // ERRAR NADA. Sem uma frase, isso vira "o app travou".
    const p = tresAcertos("sem-andaime");
    expect(faltaParaCoroa(p.masteryEvidence, "Produzir sem as vagas fantasma."))
      .toBe("Produzir sem as vagas fantasma.");
  });
});


describe("§9 executavel — acertos/de em sessoes reais", () => {
  const base: Progress = {
    lvl: 5, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 5,
  };

  const tentativa = (day: string, rule = { acertos: 3, de: 3, sessoes: 2 }): MasteryAttempt => ({
    durationMs: 5000, helpUsed: false, isReview: false, practiceDay: day, masteryRule: rule,
  });

  function responder(p: Progress, day: string, respostas: boolean[], rule: { acertos: number; de: number; sessoes: number }) {
    let atual = p;
    for (const right of respostas) {
      atual = applyJourneyAnswer({ ...atual, lvl: 5 }, right, false, tentativa(day, rule)).progress;
    }
    return atual;
  }

  it("4/5 aceita uma falha na janela sem virar quatro seguidas", () => {
    const rule = { acertos: 4, de: 5, sessoes: 2 };
    const p = responder(base, "2026-08-01", [true, false, true, true, true], rule);
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);
    expect(p.dom).toBeFalsy();
  });

  it("4/4 nao fecha a sessao depois de apenas tres", () => {
    const rule = { acertos: 4, de: 4, sessoes: 3 };
    let p = responder(base, "2026-08-01", [true, true, true], rule);
    expect(p.masteryEvidence?.passedSessionDays ?? []).toHaveLength(0);
    p = responder(p, "2026-08-01", [true], rule);
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);
  });

  it("tres sessoes exigem tres sessoes maduras e espacadas", () => {
    const rule = { acertos: 4, de: 4, sessoes: 3 };
    let p = responder(base, "2026-08-01", [true, true, true, true], rule);
    p = responder(p, "2026-08-03", [true, true, true, true], rule);
    expect(p.dom).toBeFalsy();
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01", "2026-08-03"]);
    p = responder(p, "2026-08-05", [true, true, true, true], rule);
    expect(p.dom).toBe(true);
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01", "2026-08-03", "2026-08-05"]);
  });

  it("default 3/3/2 continua funcionando para questao sem regra", () => {
    let p = base;
    const attempt = { durationMs: 5000, helpUsed: false, isReview: false, practiceDay: "2026-08-01" };
    for (let i = 0; i < 3; i += 1) p = applyJourneyAnswer({ ...p, lvl: 5 }, true, false, attempt).progress;
    expect(p.masteryEvidence?.passedSessionDays).toEqual(["2026-08-01"]);
    for (let i = 0; i < 3; i += 1) {
      p = applyJourneyAnswer({ ...p, lvl: 5 }, true, false, { ...attempt, practiceDay: "2026-08-03", isReview: true }).progress;
    }
    expect(p.dom).toBe(true);
  });
});
