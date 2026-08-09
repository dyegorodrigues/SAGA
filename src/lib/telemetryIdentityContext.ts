import type { TelemetryLog } from "../types";

let activeAulaSourceTrackId: string | null = null;

/**
 * Boundary efêmero entre a questão respondida e o despacho atômico de
 * telemetria. A UI é single-session: uma resposta terminal é despachada antes
 * de a próxima questão substituir esta identidade.
 */
export function setTelemetryAulaSource(sourceTrackId?: string): void {
  activeAulaSourceTrackId = sourceTrackId && sourceTrackId !== "aula"
    ? sourceTrackId
    : null;
}

/**
 * Eventos v1 gravavam `trackId="aula"` nas questões compostas. Em v2 `trackId`
 * significa a competência realmente praticada. O envelope continua existindo
 * no estado/UI, mas não deve poluir séries longitudinais por habilidade.
 */
export function normalizeTelemetryIdentity(log: TelemetryLog): TelemetryLog {
  if (log.trackId !== "aula" || !activeAulaSourceTrackId) return log;
  return { ...log, trackId: activeAulaSourceTrackId };
}

export function clearTelemetryAulaSource(): void {
  activeAulaSourceTrackId = null;
}
