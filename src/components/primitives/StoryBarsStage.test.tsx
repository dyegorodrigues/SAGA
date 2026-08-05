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

  // A varredura larga não precisa de React: ela interroga o que o Composer
  // produziu. Rodar 200 renders para inspecionar uma estrutura de dados só
  // gastava tempo — e estourava o limite quando a suíte roda em paralelo.
  it("o Composer nunca entrega a resposta entre os números conhecidos, em 500 amostras", () => {
    for (let i = 0; i < 500; i += 1) {
      const lvl = (i % 5) + 1;
      const spec = gerar(lvl).uiProps as StoryBarsSpec;

      const visiveis = [
        ...spec.story.beats.map(b => b.count),
        ...[spec.bars.part1, spec.bars.part2, spec.bars.whole]
          .filter(s => s.known)
          .map(s => (s as { value: number }).value),
      ];
      expect(visiveis, `nível ${lvl}`).not.toContain(spec.answer);
    }
  });

  it("a tela renderizada não diz o número que a pergunta pede", () => {
    // O teste anterior verificava a ESTRUTURA e se chamava "não mostra na tela".
    // Este lê a tela de verdade — inclusive os rótulos de acessibilidade, que
    // são o que a criança não-leitora efetivamente ouve.
    for (let i = 0; i < 25; i += 1) {
      const lvl = (i % 5) + 1;
      const spec = gerar(lvl).uiProps as StoryBarsSpec;
      const { container, unmount } = render(<StoryBarsStage spec={spec} />);

      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "")
        .join(" ");
      const falado = `${container.textContent ?? ""} ${rotulos}`;

      // Comparação numérica, não textual: com resposta 3, o "13" da história é
      // legítimo e um `includes("3")` acusaria falso positivo.
      const numeros = (falado.match(/\d+/g) ?? []).map(Number);

      expect(container.textContent, `nível ${lvl} renderizou vazio`).toBeTruthy();
      expect(numeros, `nível ${lvl} falou a resposta ${spec.answer}`)
        .not.toContain(spec.answer);
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
