// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { FamiliaStage } from "./FamiliaStage";
import { Composer } from "../../curriculum/Composer";
import { N4_06 } from "../../curriculum/fichas/jornada/N4.06";
import { FamiliaSpec } from "../../curriculum/procedimentos/familiaContract";

const spec = (lvl: number) => Composer.generate(N4_06, lvl).uiProps as FamiliaSpec;

describe("FamiliaStage — a tela de N4.06", () => {
  it("mostra a conta com a fala para quem não lê", () => {
    const s = spec(1);
    render(<FamiliaStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("o triângulo se identifica e traz uma interrogação", () => {
    const { container } = render(<FamiliaStage spec={spec(1)} />);
    expect(container.querySelector('[aria-label^="Triângulo da família"]')).not.toBeNull();
    expect(container.textContent).toContain("?");
  });

  it("as contas de apoio somem no nível 4", () => {
    const um = render(<FamiliaStage spec={spec(1)} />);
    expect(um.container.querySelector('[role="math"]')).not.toBeNull();
    um.unmount();
    const quatro = render(<FamiliaStage spec={spec(4)} />);
    expect(quatro.container.querySelector('[role="math"]')).toBeNull();
    quatro.unmount();
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const s = spec((i % 5) + 1);
      const { container, unmount } = render(<FamiliaStage spec={s} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      const numeros = (`${container.textContent ?? ""} ${rotulos}`.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `nível ${(i % 5) + 1} falou ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<FamiliaStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
