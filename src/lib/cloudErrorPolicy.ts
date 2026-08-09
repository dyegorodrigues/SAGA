/**
 * Classifica somente falhas em que repetir o mesmo write faz sentido.
 *
 * Esta política é deliberadamente independente de Firebase para que o
 * sincronizador continue testável com fakes e para que reader/writer usem a
 * mesma definição de indisponibilidade temporária.
 */
export function isTransientCloudError(err: unknown): boolean {
  const code = err && typeof err === "object" ? (err as any).code : undefined;
  const message = err instanceof Error ? err.message : String(err ?? "");
  return code === "unavailable"
    || code === "failed-precondition"
    || message.includes("unavailable")
    || message.includes("network")
    || message.includes("Could not reach")
    || message.includes("offline");
}
