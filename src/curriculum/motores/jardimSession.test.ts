import { describe, expect, it } from "vitest";
import { JARDIM } from "../fichas/dojo/jardim";
import {
  JARDIM_ROUND_ITENS,
  jardimProgressProjection,
  jardimTrack,
  resolveJardimState,
  tentativaJardimDoTerminal,
} from "./jardimSession";

const p = (lvl: number, maxLvl = lvl) => ({
  lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});

describe("P8 — adapter de sessão do Jardim", () => {
  it("gera Track explícito de oito itens e preserva rt_alvo dos cinco degraus", () => {
    for (const trilha of JARDIM) {
      const track = jardimTrack(trilha);
      expect(track.id).toBe(trilha.ficha.id);
      expect(track.totalQ).toBe(JARDIM_ROUND_ITENS);
      expect(track.contentStatus).toBe("explicit");
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        expect(track.gen(lvl).rt_max_s).toBe((trilha.ficha.niveis[lvl].rt_alvo as number) / 1000);
      }
    }
  });

  it("estado salvo nunca sobrepõe a regra de unlock da mãe", () => {
    const trilha = JARDIM[0];
    const locked = resolveJardimState(trilha, p(2), {
      unlocked: true, mastered: false, family: "JD", currentStep: 4, highestStep: 4,
    });
    expect(locked.unlocked).toBe(false);
    expect(locked.currentStep).toBe(4); // treino fica guardado, só a porta fecha

    const open = resolveJardimState(trilha, p(1, 3), locked);
    expect(open.unlocked).toBe(true);
    expect(open.currentStep).toBe(4);
  });

  it("projeção visual não cria domínio curricular nem banco de revisão", () => {
    const state = resolveJardimState(JARDIM[0], p(3), {
      unlocked: true, mastered: true, family: "JD", currentStep: 3, highestStep: 5,
      rounds: 9, attempts: 72, correct: 61,
    });
    const projection = jardimProgressProjection(state);
    expect(projection.lvl).toBe(3);
    expect(projection.maxLvl).toBe(5);
    expect(projection.dom).toBe(false);
    expect(projection.bank).toEqual([]);
  });

  it("recuperar após erro real não vira acerto de automaticidade", () => {
    expect(tentativaJardimDoTerminal({
      terminalRight: true, attemptCount: 2, durationMs: 3200, targetRtMs: 4000,
      misconceptionTags: ["OFF_BY_ONE"],
    })).toMatchObject({ right: false, misconception: "OFF_BY_ONE" });
    expect(tentativaJardimDoTerminal({
      terminalRight: true, attemptCount: 1, durationMs: 1800, targetRtMs: 4000,
    }).right).toBe(true);
  });
});
