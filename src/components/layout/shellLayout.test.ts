import { describe, expect, it } from "vitest";
import { shellRootClass } from "./shellLayout";

describe("Shell na viewport infantil", () => {
  it("não soma padding ao 100dvh durante o jogo", () => {
    expect(shellRootClass("game")).toContain("h-[100dvh] pb-0");
    expect(shellRootClass("game")).not.toContain("pb-16");
  });

  it("preserva o respiro nas telas navegáveis", () => {
    expect(shellRootClass("home")).toContain("min-h-screen pb-16");
  });
});
