import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const gameLoopSource = readFileSync(new URL("../components/GameLoop.tsx", import.meta.url), "utf8");

describe("Wiring da gamificação", () => {
  it("GameLoop usa a política central e não recompensa velocidade com multiplicador de XP", () => {
    expect(gameLoopSource).toContain("rewardForTerminalAnswer");
    expect(gameLoopSource).toContain("perfectMissionXpBonus");
    expect(gameLoopSource).not.toMatch(/starGain\s*=\s*15/);
    expect(gameLoopSource).not.toMatch(/starGain\s*=\s*5/);
    expect(gameLoopSource).not.toMatch(/starGain\s*=\s*2/);
  });

  it("GameLoop não pode acelerar streak curricular por velocidade de rapid-fire", () => {
    expect(gameLoopSource).not.toContain("Speed bonus helps level up faster");
    expect(gameLoopSource).not.toMatch(/durationMs\s*<=\s*3000\s*&&\s*p\.lvl\s*<\s*5/);
  });
});
