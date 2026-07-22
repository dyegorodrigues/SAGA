import { State } from "../types";

const CURRENT_SCHEMA_VERSION = 1;

export const defaultState = (): State => ({
  schemaVersion: CURRENT_SCHEMA_VERSION,
  kids: [],
  progress: {},
  dojoTracks: {},
  coins: {},
  album: {},
  log: {},
  sound: true
});

export function migrate(state: State): State {
  if (!state || state.schemaVersion !== CURRENT_SCHEMA_VERSION) {
    console.warn("Versão antiga ou sem schemaVersion detectada. Reset limpo aplicado (Fase 1).");
    return defaultState();
  }
  return state;
}
