// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { StoryBarsStage } from "./StoryBarsStage";
import { Composer } from "../../curriculum/Composer";
import { N3_10 } from "../../curriculum/fichas/jornada/N3.10";
import { StoryBarsSpec } from "../../curriculum/procedimentos/storyBarsContract";

const gerar = (lvl: number) => Composer.generate(N3_10, lvl);

describe("StoryBarsStage — a tela completa de N3.10", () => {
  it("compõe história e barra a partir do que o Composer produziu", () => {
    const q = gerar(3);
    const spec = q.uiProps as StoryBarsSpec;
    render(<StoryBarsStage spec={spec} />);

    expect(screen.getByText(spec.story.beats[0].text)).toBeTruthy();
    expect(screen.getByText(spec.story.question)).toBeTruthy();
    expect(screen.getAllByLabelText(/quantidade desconhecida$/)).toHaveLength(1);
  });

  it("mantém uma pergunta só na tela", () => {
    const spec = gerar(3).uiProps as StoryBarsSpec;
    const { container } = render(<StoryBarsStage spec={spec} />);
    const interrogacoes = (container.textContent ?? "").match(/\?/g) ?? [];
    // A caixa da incógnita usa "?" e a pergunta termina em "?": duas ocorrências,
    // uma única pergunta.
    expect(interrogacoes.length).toBeLessThanOrEqual(2);
  });

  it("a barra só entra depois que a história se contou", () => {
    const spec = gerar(3).uiProps as StoryBarsSpec;
    const parcial = render(<StoryBarsStage spec={spec} step={2} />);
    expect(parcial.queryByLabelText(/Barra/)).toBeNull();
    parcial.unmount();

    const completo = render(<StoryBarsStage spec={spec} step={3} />);
    expect(completo.getByLabelText(/Barra/)).toBeTruthy();
  });

  it("nunca mostra na tela o número que a pergunta pede, em 200 amostras", () => {
    for (let i = 0; i < 200; i += 1) {
      const lvl = (i % 5) + 1;
      const q = gerar(lvl);
      const spec = q.uiProps as StoryBarsSpec;
      const { container, unmount } = render(<StoryBarsStage spec={spec} />);

      // Números visíveis na história e nos segmentos conhecidos da barra.
      const visiveis = [
        ...spec.story.beats.map(b => b.count),
        ...[spec.bars.part1, spec.bars.part2, spec.bars.whole]
          .filter(s => s.known)
          .map(s => (s as { value: number }).value),
      ];
      expect(visiveis, `nível ${lvl}`).not.toContain(spec.answer);
      expect(container.textContent).toBeTruthy();
      unmount();
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const spec = gerar(lvl).uiProps as StoryBarsSpec;
      const { container, unmount } = render(<StoryBarsStage spec={spec} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
