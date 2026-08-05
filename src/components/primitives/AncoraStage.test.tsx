// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { AncoraStage } from "./AncoraStage";
import { Composer } from "../../curriculum/Composer";
import { N4_07 } from "../../curriculum/fichas/jornada/N4.07";
import { AncoraSpec } from "../../curriculum/procedimentos/ancoraContract";

const spec = (lvl: number) => Composer.generate(N4_07, lvl).uiProps as AncoraSpec;

describe("AncoraStage — a tela de N4.07", () => {
  it("mostra o enunciado com a fala para quem não lê", () => {
    const s = spec(1);
    render(<AncoraStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("o arranjo descreve o fato FÁCIL, não o perguntado", () => {
    // Em 7×9 aparece o arranjo de 7×10. O rótulo diz "7 fileiras de 10" — se
    // dissesse o total, entregaria a âncora pronta a quem usa leitor de tela.
    const s = spec(1);
    const { container } = render(<AncoraStage spec={s} />);
    const rotulo = container.querySelector('[role="img"]')?.getAttribute("aria-label") ?? "";
    expect(rotulo).toBe(s.visual!.descricao);
    expect((rotulo.match(/\d+/g) ?? []).map(Number)).not.toContain(s.resposta);
  });

  it("a estratégia escrita convida a completar, sem dizer o resultado", () => {
    const s = spec(1);
    const { container } = render(<AncoraStage spec={s} />);
    const rotulo = container.querySelector('[role="math"]')?.getAttribute("aria-label") ?? "";
    expect(rotulo).toContain(s.escrita!.ancora);
    expect(rotulo).toContain("?");
    expect((rotulo.match(/\d+/g) ?? []).map(Number)).not.toContain(s.resposta);
  });

  it("o apoio some no nível 4", () => {
    const quatro = render(<AncoraStage spec={spec(4)} />);
    expect(quatro.container.querySelector('[role="img"]')).toBeNull();
    expect(quatro.container.querySelector('[role="math"]')).toBeNull();
    expect(quatro.container.textContent?.replace(/\s/g, "")).toMatch(/^\d+×\d+$/);
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const s = spec((i % 5) + 1);
      const { container, unmount } = render(<AncoraStage spec={s} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      const numeros = (`${container.textContent ?? ""} ${rotulos}`.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `nível ${(i % 5) + 1} falou ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<AncoraStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
