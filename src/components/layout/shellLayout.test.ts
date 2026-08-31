import { describe, expect, it } from "vitest";
import { shellBoxClass, shellRootClass, telaDeAppInteiro } from "./shellLayout";

describe("Shell na viewport infantil", () => {
  it("não soma padding ao 100dvh durante o jogo", () => {
    expect(shellRootClass("game")).toContain("h-[100dvh] pb-0");
    expect(shellRootClass("game")).not.toContain("pb-16");
  });

  it("preserva o respiro nas telas navegáveis", () => {
    expect(shellRootClass("login")).toContain("min-h-screen pb-16");
    expect(shellRootClass("parent")).toContain("min-h-screen pb-16");
  });

  it("a casa da criança também é o aplicativo inteiro, não uma página que rola", () => {
    // Medido na janela de 940px antes desta correção: 1056px de documento, e a
    // página descia 64px sozinha levando o cabeçalho — nome, ofensiva e
    // moedinhas — para fora da tela. A casa já se declara `h-screen` por
    // dentro; a moldura somava padding por fora.
    expect(telaDeAppInteiro("home")).toBe(true);
    expect(shellRootClass("home")).toContain("h-[100dvh] pb-0");
    expect(shellBoxClass("home")).not.toContain("pt-5");
    expect(shellBoxClass("home")).not.toContain("pb-8");
    expect(shellBoxClass("home")).toContain("overflow-hidden");
  });

  it("a página navegável mantém o padding que a casa não pode ter", () => {
    expect(shellBoxClass("login")).toContain("px-4 pt-5 pb-8");
  });
});
