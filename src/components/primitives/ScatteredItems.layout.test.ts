import { describe, expect, it } from "vitest";
import { buildScatteredPositions } from "./ScatteredItems";

function expectNoNormalizedCollision(n: number, emoji: string) {
  const positions = buildScatteredPositions(n, emoji);
  expect(positions).toHaveLength(n);

  for (const position of positions) {
    expect(position.x).toBeGreaterThan(5);
    expect(position.x).toBeLessThan(95);
    expect(position.y).toBeGreaterThan(5);
    expect(position.y).toBeLessThan(95);
  }

  // Limites conservadores para a menor largura suportada pela sonda. O palco
  // usa 4:3; até 15 itens o box móvel tem 40px, e de 16–20 tem 32px.
  const minDx = n >= 16 ? 13 : 15;
  const minDy = n >= 16 ? 17 : 20;

  for (let left = 0; left < positions.length; left += 1) {
    for (let right = left + 1; right < positions.length; right += 1) {
      const dx = Math.abs(positions[left].x - positions[right].x);
      const dy = Math.abs(positions[left].y - positions[right].y);
      expect(
        dx >= minDx || dy >= minDy,
        `itens ${left}/${right} próximos demais em n=${n}: dx=${dx.toFixed(2)} dy=${dy.toFixed(2)}`,
      ).toBe(true);
    }
  }
}

describe("P22.4 — geometria determinística do ScatteredItems", () => {
  it("é estável para a mesma questão", () => {
    expect(buildScatteredPositions(20, "🐟")).toEqual(buildScatteredPositions(20, "🐟"));
  });

  it("mantém 10–20 objetos em territórios não sobrepostos", () => {
    for (let n = 10; n <= 20; n += 1) {
      expectNoNormalizedCollision(n, "🐟");
      expectNoNormalizedCollision(n, "⭐");
    }
  });

  it("não perde nem inventa objetos", () => {
    for (let n = 1; n <= 25; n += 1) {
      expect(buildScatteredPositions(n, "🍎")).toHaveLength(n);
    }
  });
});