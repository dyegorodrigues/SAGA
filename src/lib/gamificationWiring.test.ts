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

  it("valor mostrado de moedas vem da mesma política que persiste o Misto 2x", () => {
    expect(gameLoopSource).toContain("missionCoins(ok, completionRewardMode");
    expect(gameLoopSource).toContain('track.id === "mista" || track.id === "mixed"');
    expect(gameLoopSource).not.toContain("const coinsEarned = ok + 3");
  });

  it("fallback não anuncia XP nem moeda como se fosse conteúdo real", () => {
    expect(gameLoopSource).toContain("const starGain = q.isFallback ? 0");
    expect(gameLoopSource).toContain('track.contentStatus === "fallback"');
    expect(gameLoopSource).toContain("const rewardEligible = !q.isFallback");
  });

  it("double tap e retries intermediários permanecem antes do terminal premiável", () => {
    expect(gameLoopSource).toContain("if (status || answeredRef.current) return;");
    expect(gameLoopSource).toContain("return; // não avança, não marca answeredRef");
    expect(gameLoopSource).toContain("answeredRef.current = true;");
  });

  it("bônus da primeira missão é congelado na sessão e replay não o reaplica", () => {
    expect(gameLoopSource).toContain("const firstMissionRewardRef = useRef(firstMissionToday)");
    expect(gameLoopSource).toContain("const firstMissionReward = firstMissionRewardRef.current && replays === 0");
    expect(gameLoopSource).not.toContain("missionCoins(ok, completionRewardMode, firstMissionToday && replays === 0)");
  });
});
