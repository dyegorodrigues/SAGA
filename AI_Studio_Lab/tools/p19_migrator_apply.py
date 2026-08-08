from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {count}x")
    p.write_text(text.replace(old, new))


Path("src/utils/migrator.ts").write_text('''import type { State } from "../types";
import { migrateLegacyCrown } from "../curriculum/motores/progressEngine";

export const CURRENT_SCHEMA_VERSION = 1;

export function localDay(dt = new Date()): string {
  return dt.getFullYear()
    + "-" + String(dt.getMonth() + 1).padStart(2, "0")
    + "-" + String(dt.getDate()).padStart(2, "0");
}

const PET_NAMES: Record<string, string> = {
  classico: "Mago",
  homem_aranha: "Teioso",
  batman: "Morceguinho",
  elsa: "Floquinho",
  pikachu: "Faísca",
  heroi: "Super-Pet",
  futebol: "Golzinho",
  musica: "Batuque",
  dino: "Dininho",
  pantera_negra: "Panterinha",
  thor: "Trovenho",
  goku: "Gokuzinho",
  homem_ferro_pixel: "Retro-Tin",
  homem_aranha_pixel: "Retro-Teia",
  hulk_pixel: "Retro-Hulk",
  trex: "T-Rex God",
};

function defaultPetName(theme: string): string {
  return PET_NAMES[theme] || "Bichinho";
}

export const defaultState = (): State => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  kids: [],
  progress: {},
  dojoTracks: {},
  coins: {},
  album: {},
  log: {},
  sound: true,
  customTracks: [],
});

/**
 * ÚNICA migração de save do app.
 *
 * O parâmetro `today` torna a regra de energia determinística em teste sem
 * mudar o comportamento de produção. Schema incompatível continua usando a
 * política Fase 1 já existente: reset limpo; esta tarefa não sobe a versão.
 */
export function migrate(input: unknown, today = localDay()): State {
  const state = input as any;
  if (!state || state.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    console.warn("Versão antiga ou sem schemaVersion detectada. Reset limpo aplicado (Fase 1).");
    return defaultState();
  }

  // Clone por mapa antes de completar defaults: migrar um payload carregado não
  // pode alterar o objeto bruto que ainda pode estar sendo comparado/logado.
  const m: any = {
    ...state,
    kids: (state.kids || []).map((kid: any) => ({ ...kid })),
    progress: { ...(state.progress || {}) },
    dojoTracks: { ...(state.dojoTracks || {}) },
    coins: { ...(state.coins || {}) },
    album: { ...(state.album || {}) },
    log: { ...(state.log || {}) },
    customTracks: [...(state.customTracks || [])],
  };

  m.kids = m.kids.map((kid: any) => {
    const updated: any = {
      theme: "classico",
      age: kid.grade === "pre" ? 4 : 6,
      petEnergy: kid.petEnergy != null ? kid.petEnergy : 80,
      petFood: kid.petFood != null ? kid.petFood : 3,
      ...kid,
    };
    if (!updated.petName) updated.petName = defaultPetName(updated.theme);

    // Decaimento gentil: 25/dia, sem morte/doença/regressão do mascote.
    const lastDay = updated.petDay || today;
    const lastTime = new Date(lastDay).getTime();
    const todayTime = new Date(today).getTime();
    const days = Number.isFinite(lastTime) && Number.isFinite(todayTime)
      ? Math.max(0, Math.round((todayTime - lastTime) / 86400000))
      : 0;
    if (days > 0) {
      updated.petEnergy = Math.max(0, (updated.petEnergy ?? 80) - 25 * days);
    }
    updated.petDay = today;
    return updated;
  });

  if (m.sound == null) m.sound = true;

  for (const kid of m.kids) {
    m.dojoTracks[kid.id] = { ...(m.dojoTracks[kid.id] || {}) };
    const rawProgress = m.progress[kid.id] || {};
    const progress: Record<string, any> = {};

    for (const [trackId, raw] of Object.entries(rawProgress)) {
      let p: any = { ...(raw as any) };
      if (!p.bank) p = { ...p, bank: [], mast: p.mast || 0 };
      if (p.maxLvl == null) {
        p = { ...p, maxLvl: p.lvl || 1, dom: p.dom || false };
      }
      if (p.dom && !p.masteryEvidence) p = migrateLegacyCrown(p);
      progress[trackId] = p;
    }
    m.progress[kid.id] = progress;

    // Economia dupla: wallet antigo vence; senão estrelas acumuladas viram o
    // saldo inicial. Depois da migração, coins é a única carteira gastável.
    if (m.coins[kid.id] == null) {
      m.coins[kid.id] = state.wallet?.[kid.id] != null
        ? state.wallet[kid.id]
        : Object.values(progress).reduce((sum: number, p: any) => sum + (p.stars || 0), 0);
    }
    m.album[kid.id] = [...(m.album[kid.id] || [])];
    m.log[kid.id] = [...(m.log[kid.id] || [])];
  }

  return m as State;
}
''')

app = Path("src/App.tsx")
s = app.read_text()
import_anchor = 'import { shellRootClass } from "./components/layout/shellLayout";\n'
if s.count(import_anchor) != 1:
    raise SystemExit("App: ancora de import inesperada")
s = s.replace(
    import_anchor,
    import_anchor + 'import { defaultState, localDay, migrate } from "./utils/migrator";\n',
)

start = s.find('const getDefaultPetName = (theme: string) => {')
end_marker = 'const calcStreak = (log: any[]) => {'
end = s.find(end_marker, start)
if start < 0 or end < 0:
    raise SystemExit(f"App: bloco migrador local nao localizado ({start}, {end})")
# Preserva calcStreak e tudo depois; defaultPetName/defaultState/migrate/localDay saem.
s = s[:start] + s[end:]
app.write_text(s)

Path("src/utils/migrator.test.ts").write_text('''import { readFileSync } from "node:fs";
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
});
''')

print("P19 migrator patch preparado")
