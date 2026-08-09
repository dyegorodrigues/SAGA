import type { State } from "../types";
import { migrateLegacyCrown } from "../curriculum/motores/progressEngine";
import { calendarDayDistance, localDay } from "./calendarDay";

export { localDay } from "./calendarDay";

export const CURRENT_SCHEMA_VERSION = 1;

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
    // A diferença é por DIAS CIVIS; DST não cria um "dia" de 23/25 horas.
    const lastDay = updated.petDay || today;
    const days = calendarDayDistance(lastDay, today);
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
