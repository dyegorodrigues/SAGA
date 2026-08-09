import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { defaultState, migrate } from "./migrator";

describe("migrador único de estado", () => {
  it("default inclui todos os contêineres atuais, inclusive dojoTracks", () => {
    expect(defaultState()).toEqual({
      schemaVersion: 1,
      kids: [],
      progress: {},
      dojoTracks: {},
      coins: {},
      album: {},
      log: {},
      sound: true,
      customTracks: [],
    });
  });

  it("schema incompatível mantém a política Fase 1 de reset limpo", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(migrate({ schemaVersion: 999, kids: [{ id: "x" }] }, "2026-08-08")).toEqual(defaultState());
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("migra save v1 antigo sem apagar progresso e completa os contratos atuais", () => {
    const raw: any = {
      schemaVersion: 1,
      kids: [{ id: "k1", name: "Ana", grade: "pre", theme: "dino", petDay: "2026-08-06", petEnergy: 80 }],
      progress: {
        k1: {
          "N1.03": { lvl: 3, streak: 1, bad: 0, stars: 12, ok: 8, tot: 10, mast: 0, dom: true },
        },
      },
      wallet: { k1: 17 },
      sound: true,
    };
    const migrated = migrate(raw, "2026-08-08");
    expect(migrated.kids[0]).toMatchObject({
      age: 4,
      petFood: 3,
      petName: "Dininho",
      petEnergy: 30,
      petDay: "2026-08-08",
    });
    expect(migrated.coins.k1).toBe(17);
    expect(migrated.album.k1).toEqual([]);
    expect(migrated.log.k1).toEqual([]);
    expect(migrated.dojoTracks?.k1).toEqual({});
    expect(migrated.progress.k1["N1.03"]).toMatchObject({
      lvl: 3,
      maxLvl: 3,
      dom: true,
      bank: [],
      masteryEvidence: { schemaVersion: 1, crownedBy: "legacy" },
    });
  });

  it("sem wallet deriva coins das estrelas e preserva dojoTracks existentes", () => {
    const raw: any = {
      schemaVersion: 1,
      kids: [{ id: "k1", name: "Bia", grade: "1", theme: "classico" }],
      progress: { k1: {
        A: { lvl: 1, stars: 4, streak: 0, bad: 0, ok: 0, tot: 0, bank: [], mast: 0 },
        B: { lvl: 2, stars: 7, streak: 0, bad: 0, ok: 0, tot: 0, bank: [], mast: 0 },
      } },
      dojoTracks: { k1: { JD1: { unlocked: true, mastered: false, family: "JD", currentStep: 3, highestStep: 4 } } },
      coins: {}, album: {}, log: {}, sound: true,
    };
    const migrated = migrate(raw, "2026-08-08");
    expect(migrated.coins.k1).toBe(11);
    expect(migrated.dojoTracks?.k1?.JD1).toMatchObject({ currentStep: 3, highestStep: 4 });
  });

  it("não muta o objeto bruto recebido", () => {
    const raw: any = {
      schemaVersion: 1,
      kids: [{ id: "k1", name: "C", grade: "1" }],
      progress: { k1: { A: { lvl: 2, stars: 1, streak: 0, bad: 0, ok: 0, tot: 0 } } },
      coins: {}, album: {}, log: {}, sound: true,
    };
    const before = JSON.stringify(raw);
    migrate(raw, "2026-08-08");
    expect(JSON.stringify(raw)).toBe(before);
  });

  it("App importa o migrador e não volta a declarar uma segunda função migrate", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain('from "./utils/migrator"');
    expect(app).not.toMatch(/function\s+migrate\s*\(/);
    expect(app).not.toMatch(/const\s+defaultState\s*=\s*\(/);
  });

  it("H5: preserva campos pedagógicos atuais em migrate/round-trip", () => {
    const raw: any = {
      schemaVersion: 1,
      updatedAt: "2026-08-09T14:00:00.000Z",
      kids: [{ id: "k1", name: "D", grade: "ano1", theme: "classico", petDay: "2026-08-09" }],
      progress: {
        k1: {
          "N1.04": {
            lvl: 4, maxLvl: 5, streak: 2, bad: 1, stars: 17, ok: 21, tot: 25, mast: 1,
            bank: [{ sig: "n1-04:a", hits: 2, q: { text: "conte", answer: 4, sig: "n1-04:a" } }],
            reviewForce: 4,
            lastDay: "2026-08-08",
            masteryEvidence: {
              schemaVersion: 1,
              comprehensionStreak: 3,
              independenceStreak: 2,
              fluencyStreak: 7,
              retentionPasses: 2,
              evidenciaDaFicha: true,
              evidenciasVistas: ["disperso"],
            },
          },
        },
      },
      dojoTracks: {
        k1: {
          dojo_add: {
            unlocked: true,
            mastered: false,
            family: "FD",
            currentStep: 4,
            highestStep: 5,
            lastDay: "2026-08-08",
            facts: {
              "2+3": { fact_id: "2+3", forca: 4, rt_medio: 820, ultima_vez: "2026-08-08", erros_seguidos: 0 },
            },
            procs: {
              "alg-add": { proc_id: "alg-add", precisao: 0.92, tempo_medio: 2100, forca: 3, ultima_vez: "2026-08-08", erros_seguidos: 1 },
            },
          },
        },
      },
      coins: { k1: 8 }, album: { k1: [] }, log: { k1: [] }, sound: true, customTracks: [],
    };

    const migrated = migrate(JSON.parse(JSON.stringify(raw)), "2026-08-09");

    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.updatedAt).toBe(raw.updatedAt);
    expect(migrated.progress.k1["N1.04"].bank).toEqual(raw.progress.k1["N1.04"].bank);
    expect(migrated.progress.k1["N1.04"].reviewForce).toBe(4);
    expect(migrated.progress.k1["N1.04"].lastDay).toBe("2026-08-08");
    expect(migrated.progress.k1["N1.04"].masteryEvidence).toEqual(raw.progress.k1["N1.04"].masteryEvidence);
    expect(migrated.dojoTracks?.k1?.dojo_add?.facts).toEqual(raw.dojoTracks.k1.dojo_add.facts);
    expect(migrated.dojoTracks?.k1?.dojo_add?.procs).toEqual(raw.dojoTracks.k1.dojo_add.procs);
  });
});
