import { describe, expect, it } from "vitest";
import {
  calendarDayDistance,
  dayKeyAtOffset,
  isDayKey,
  normalizeLegacyRuntimeDay,
} from "./calendarDay";

describe("calendarDay — identidade civil do dia", () => {
  it("UTC−3 ainda está no dia anterior quando UTC já virou", () => {
    const instant = new Date("2026-08-10T01:30:00.000Z");
    expect(dayKeyAtOffset(instant, -180)).toBe("2026-08-09");
    expect(normalizeLegacyRuntimeDay("2026-08-10", instant, -180)).toBe("2026-08-09");
  });

  it("offset positivo já pode estar no dia seguinte antes da virada UTC", () => {
    const instant = new Date("2026-08-09T18:30:00.000Z");
    expect(dayKeyAtOffset(instant, 540)).toBe("2026-08-10");
    expect(normalizeLegacyRuntimeDay("2026-08-09", instant, 540)).toBe("2026-08-10");
  });

  it("data histórica injetada não é reinterpretada como agora", () => {
    const instant = new Date("2026-08-10T01:30:00.000Z");
    expect(normalizeLegacyRuntimeDay("2026-07-01", instant, -180)).toBe("2026-07-01");
  });

  it("distância usa dias civis, inclusive atravessando datas de DST", () => {
    expect(calendarDayDistance("2026-03-07", "2026-03-08")).toBe(1);
    expect(calendarDayDistance("2026-10-31", "2026-11-01")).toBe(1);
    expect(calendarDayDistance("2026-08-09", "2026-08-30")).toBe(21);
  });

  it("valida YYYY-MM-DD real e rejeita datas impossíveis", () => {
    expect(isDayKey("2026-02-28")).toBe(true);
    expect(isDayKey("2026-02-30")).toBe(false);
    expect(isDayKey("09/08/2026")).toBe(false);
  });
});
