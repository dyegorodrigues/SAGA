const DAY_KEY = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Chave de calendário no fuso LOCAL do dispositivo, nunca UTC por acidente. */
export function localDay(dt = new Date()): string {
  return dt.getFullYear()
    + "-" + String(dt.getMonth() + 1).padStart(2, "0")
    + "-" + String(dt.getDate()).padStart(2, "0");
}

/**
 * Variante pura para regressões de fuso sem depender do timezone do runner.
 * `offsetMinutes` segue a convenção UTC+N: Brasília = -180; Tóquio = +540.
 */
export function dayKeyAtOffset(dt: Date, offsetMinutes: number): string {
  const shifted = new Date(dt.getTime() + offsetMinutes * 60_000);
  return shifted.toISOString().slice(0, 10);
}

export function isDayKey(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = DAY_KEY.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, month - 1, day));
  return utc.getUTCFullYear() === year
    && utc.getUTCMonth() === month - 1
    && utc.getUTCDate() === day;
}

/**
 * Distância entre DIAS CIVIS. Usa UTC apenas como eixo aritmético depois que a
 * identidade YYYY-MM-DD já foi decidida; portanto DST não cria dia de 23/25h.
 */
export function calendarDayDistance(fromDay: string | undefined, toDay: string | undefined): number {
  if (!isDayKey(fromDay) || !isDayKey(toDay)) return 0;
  const [fy, fm, fd] = fromDay.split("-").map(Number);
  const [ty, tm, td] = toDay.split("-").map(Number);
  const from = Date.UTC(fy, fm - 1, fd);
  const to = Date.UTC(ty, tm - 1, td);
  return Math.max(0, Math.floor((to - from) / 86_400_000));
}

/**
 * Compatibilidade com callers legados que ainda enviam
 * `new Date().toISOString().slice(0, 10)` no runtime.
 *
 * Se a chave recebida é EXATAMENTE o dia UTC do mesmo instante, converte para
 * o dia local. Datas históricas/injetadas em testes permanecem intactas.
 */
export function normalizeLegacyRuntimeDay(
  day: string | undefined,
  now = new Date(),
  offsetMinutes?: number,
): string | undefined {
  if (!day) return day;
  const utcToday = now.toISOString().slice(0, 10);
  if (day !== utcToday) return day;
  return offsetMinutes === undefined ? localDay(now) : dayKeyAtOffset(now, offsetMinutes);
}

/** Converte instante opcional para a identidade de calendário esperada. */
export function dayKeyFromNowInput(nowIsoOrMs?: string | number): string {
  if (typeof nowIsoOrMs === "string" && isDayKey(nowIsoOrMs)) return nowIsoOrMs;
  const instant = nowIsoOrMs === undefined ? new Date() : new Date(nowIsoOrMs);
  return Number.isFinite(instant.getTime()) ? localDay(instant) : localDay();
}
