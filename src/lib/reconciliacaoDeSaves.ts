import { State } from "../types";

/**
 * Reconciliação entre dispositivos e entre sessões offline.
 *
 * O app grava em dois lugares: armazenamento local (instantâneo, sempre
 * disponível) e Firestore (compartilhado entre aparelhos). Na abertura, os dois
 * podem discordar — e quem discorda precisa de um critério, não de uma ordem
 * de preferência fixa.
 *
 * O defeito que isto corrige: a nuvem vencia o local **incondicionalmente**.
 * Bastava uma sessão gravada só localmente — Firestore sem cache persistente
 * (navegação privada no tablet), cache despejado, escrita que nunca subiu — e a
 * abertura seguinte trocava o progresso novo pelo antigo, em silêncio. Perder
 * progresso é a única falha que a criança percebe imediatamente e que nenhuma
 * dica conserta.
 *
 * Critério: vence o carimbo mais recente. Save sem carimbo é anterior ao
 * carimbo existir, logo perde para qualquer save carimbado.
 */

export type OrigemDoSave = "nuvem" | "local" | "nenhum";

export interface EscolhaDeSave {
  estado: State | null;
  origem: OrigemDoSave;
  /** Verdadeiro quando os dois lados existiam e um deles foi descartado. */
  houveConflito: boolean;
}

/** Carimba o estado com o instante da gravação. */
export function carimbar(estado: State, agora: Date = new Date()): State {
  return { ...estado, updatedAt: agora.toISOString() };
}

function instanteDe(estado: State | null | undefined): number {
  if (!estado?.updatedAt) return Number.NEGATIVE_INFINITY;
  const ms = Date.parse(estado.updatedAt);
  return Number.isFinite(ms) ? ms : Number.NEGATIVE_INFINITY;
}

/**
 * Escolhe entre o save da nuvem e o save local.
 *
 * Empate técnico — mesmo carimbo, ou nenhum dos dois carimbado — resolve pela
 * nuvem, que é o lado compartilhado entre aparelhos.
 */
export function escolherSaveMaisRecente(
  nuvem: State | null | undefined,
  local: State | null | undefined,
): EscolhaDeSave {
  if (!nuvem && !local) return { estado: null, origem: "nenhum", houveConflito: false };
  if (!nuvem) return { estado: local!, origem: "local", houveConflito: false };
  if (!local) return { estado: nuvem, origem: "nuvem", houveConflito: false };

  const localVence = instanteDe(local) > instanteDe(nuvem);
  return {
    estado: localVence ? local : nuvem,
    origem: localVence ? "local" : "nuvem",
    houveConflito: true,
  };
}
