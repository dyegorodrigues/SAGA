import { describe, expect, it } from "vitest";
import type { Progress, State, Track } from "../types";
import { deriveSkillAtlas, deriveSkillInsignia } from "./skillAtlas";

const track = (id: string, island = "N1", ready = true): Track => ({
  id,
  name: `Habilidade ${id}`,
  icon: "🏅",
  color: "#000",
  dark: "#000",
  island,
  contentStatus: ready ? "explicit" : "fallback",
  gen: () => ({ kind: "plain", prompt: "?", answer: 1 }),
});

const progress = (patch: Partial<Progress> = {}): Progress => ({
  lvl: 1,
  maxLvl: 1,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...patch,
});

const state = (p: Record<string, Progress>): State => ({
  schemaVersion: 1,
  kids: [{ id: "kid", name: "Kid", avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: { kid: p },
  dojoTracks: {},
  coins: { kid: 0 },
  album: { kid: [] },
  log: { kid: [] },
  sound: true,
  customTracks: [],
});

describe("Atlas de Habilidades — insígnias são verdade pedagógica", () => {
  it("XP e moedas isoladamente não conseguem fabricar domínio", () => {
    const t = track("N1.01");
    const lowMeta = state({ "N1.01": progress({ stars: 0, tot: 3, lvl: 2 }) });
    const hugeMeta = state({ "N1.01": progress({ stars: 999_999, tot: 3, lvl: 2 }) });
    hugeMeta.coins.kid = 999_999;

    expect(deriveSkillAtlas([t], lowMeta, "kid")).toEqual(deriveSkillAtlas([t], hugeMeta, "kid"));
    expect(deriveSkillInsignia(t, hugeMeta.progress.kid["N1.01"]).status).toBe("learning");
  });

  it("nível 5 sem evidência madura aparece como consolidação, não domínio", () => {
    const badge = deriveSkillInsignia(track("N1.01"), progress({ lvl: 5, maxLvl: 5, tot: 30, dom: false }));
    expect(badge.status).toBe("consolidating");
    expect(badge.absoluteMastery).toBe(false);
  });

  it("somente dom=true produz a insígnia curricular máxima", () => {
    const badge = deriveSkillInsignia(track("N1.01"), progress({ lvl: 5, maxLvl: 5, dom: true }));
    expect(badge.status).toBe("mastered");
    expect(badge.absoluteMastery).toBe(true);
  });

  it("fallback fica explicitamente em construção e não bloqueia a conclusão do conteúdo real atual", () => {
    const tracks = [track("N1.01"), track("N1.02"), track("N1.99", "N1", false)];
    const atlas = deriveSkillAtlas(tracks, state({
      "N1.01": progress({ dom: true, lvl: 5, maxLvl: 5 }),
      "N1.02": progress({ dom: true, lvl: 5, maxLvl: 5 }),
    }), "kid");

    expect(atlas.skills.find(skill => skill.id === "N1.99")?.status).toBe("coming-soon");
    expect(atlas.domains[0]).toMatchObject({ totalReady: 2, mastered: 2, currentlyComplete: true });
  });

  it("resumo de domínio mostra progresso real por ilha sem olhar meta-jogo", () => {
    const tracks = [track("N1.01"), track("N1.02"), track("N2.01", "N2")];
    const atlas = deriveSkillAtlas(tracks, state({
      "N1.01": progress({ dom: true, lvl: 5, maxLvl: 5 }),
      "N1.02": progress({ lvl: 3, maxLvl: 3, tot: 10 }),
    }), "kid");

    expect(atlas.domains.find(domain => domain.island === "N1")).toMatchObject({
      totalReady: 2,
      started: 2,
      mastered: 1,
      currentlyComplete: false,
      currentCompletion01: 0.5,
    });
    expect(atlas.domains.find(domain => domain.island === "N2")).toMatchObject({
      totalReady: 1,
      started: 0,
      mastered: 0,
    });
  });
});
