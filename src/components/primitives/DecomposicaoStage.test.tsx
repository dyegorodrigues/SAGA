// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { DecomposicaoStage } from "./DecomposicaoStage";
import { Composer } from "../../curriculum/Composer";
import { N4_04 } from "../../curriculum/fichas/jornada/N4.04";
import { DecomposicaoSpec } from "../../curriculum/procedimentos/decomposicaoContract";

const spec = (lvl: number) => Composer.generate(N4_04, lvl).uiProps as DecomposicaoSpec;

describe("DecomposicaoStage — a tela de N4.04", () => {
  it("mostra o enunciado com a fala para quem não lê", () => {
    const s = spec(1);
    render(<DecomposicaoStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("o arranjo da âncora anuncia a forma do dobro, não o total", () => {
    const s = spec(1);
    const { container } = render(<DecomposicaoStage spec={s} />);
    const arranjo = container.querySelector('[role="img"]');
    expect(arranjo?.getAttribute("aria-label")).toBe(s.ancoraVisual!.descricao);
    expect(arranjo?.getAttribute("aria-label")).not.toContain(String(s.resposta));
  });

  it("a decomposição escrita convida a completar, sem dizer o resultado", () => {
    const s = spec(2);
    const { container } = render(<DecomposicaoStage spec={s} />);
    const rotulo = container.querySelector('[aria-label^="Você já sabe"]')
      ?.getAttribute("aria-label") ?? "";
    expect(rotulo).toContain(s.escrita!.ancora);
    expect(rotulo).toContain("?");
    // O leitor de tela é o que a criança não-leitora ouve: se a resposta
    // estivesse aqui, a ficha inteira perderia o sentido.
    expect((rotulo.match(/\d+/g) ?? []).map(Number)).not.toContain(s.resposta);
  });

  it("o apoio troca de forma e depois some", () => {
    const um = render(<DecomposicaoStage spec={spec(1)} />);
    expect(um.container.querySelector('[role="img"]')).not.toBeNull();
    expect(um.container.querySelector('[aria-label^="Você já sabe"]')).toBeNull();
    um.unmount();

    const dois = render(<DecomposicaoStage spec={spec(2)} />);
    expect(dois.container.querySelector('[role="img"]')).toBeNull();
    expect(dois.container.querySelector('[aria-label^="Você já sabe"]')).not.toBeNull();
    dois.unmount();

    const quatro = render(<DecomposicaoStage spec={spec(4)} />);
    expect(quatro.container.querySelector('[role="img"]')).toBeNull();
    expect(quatro.container.querySelector('[aria-label^="Você já sabe"]')).toBeNull();
    expect(quatro.container.textContent?.replace(/\s/g, "")).toMatch(/^\d+×\d+$/);
    quatro.unmount();
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const s = spec((i % 5) + 1);
      const { container, unmount } = render(<DecomposicaoStage spec={s} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      const tudo = `${container.textContent ?? ""} ${rotulos}`;
      const numeros = (tudo.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `nível ${(i % 5) + 1} falou ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(
        <DecomposicaoStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
