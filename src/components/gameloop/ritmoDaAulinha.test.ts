import { describe, expect, it } from "vitest";
import { PISO_DO_PASSO_MS, TETO_DA_FALA_MS, podeSeguir, tempoMinimoDoPasso } from "./ritmoDaAulinha";

describe("o ritmo da aulinha", () => {
  it("o tempo declarado pela ficha manda", () => {
    expect(tempoMinimoDoPasso({ ms: 3500, say: "oi" })).toBe(3500);
  });

  it("sem tempo declarado, a frase decide — e nunca abaixo do piso", () => {
    expect(tempoMinimoDoPasso({ say: "Assim, ó." })).toBe(PISO_DO_PASSO_MS);
    const longa = "Olha quem está esperando, cada um precisa de um pedaço.";
    expect(tempoMinimoDoPasso({ say: longa })).toBeGreaterThan(PISO_DO_PASSO_MS);
  });

  it("passo sem fala nenhuma ainda dura o piso", () => {
    // O passo pode ser só cena — a mão que move a banana, sem narração.
    expect(tempoMinimoDoPasso({ say: "" })).toBe(PISO_DO_PASSO_MS);
    expect(tempoMinimoDoPasso({} as never)).toBe(PISO_DO_PASSO_MS);
  });

  it("nenhum passo dura zero — era esse o defeito", () => {
    // Sem voz instalada, a fala "acabava" no mesmo quadro e os quatro passos
    // da N1.01 passavam num piscar.
    for (const passo of [{ say: "" }, { say: "UM!" }, { ms: 0, say: "x" }]) {
      expect(tempoMinimoDoPasso(passo as never)).toBeGreaterThanOrEqual(PISO_DO_PASSO_MS);
    }
  });

  it("só avança quando a fala acabou E o tempo passou", () => {
    expect(podeSeguir(false, false)).toBe(false);
    expect(podeSeguir(true, false), "fala rápida não pode atropelar a cena").toBe(false);
    expect(podeSeguir(false, true), "cena pronta não pode cortar a fala").toBe(false);
    expect(podeSeguir(true, true)).toBe(true);
  });

  it("o teto existe para a aula não travar se a fala não avisar que acabou", () => {
    expect(TETO_DA_FALA_MS).toBeGreaterThan(0);
  });
});
