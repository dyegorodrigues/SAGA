// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { SingaporeBarsStage } from "./SingaporeBarsStage";
import { buildBarSpec } from "../../curriculum/procedimentos/storyBarsContract";
import { ADDITIVE_STRUCTURES, AdditiveSituation } from "../../curriculum/procedimentos/additiveProcedure";

const situacao = (over: Partial<AdditiveSituation> = {}): AdditiveSituation => ({
  structure: "join",
  part1: 3,
  part2: 4,
  whole: 7,
  unknown: "whole",
  ...over,
});

describe("SingaporeBarsStage", () => {
  it("mostra a caixa da incógnita e nunca o valor oculto", () => {
    for (const unknown of ["part1", "part2", "whole"] as const) {
      const { unmount } = render(<SingaporeBarsStage bars={buildBarSpec(situacao({ unknown }))} />);
      expect(screen.getAllByLabelText(/quantidade desconhecida$/)).toHaveLength(1);
      expect(screen.getByText("?")).toBeTruthy();
      unmount();
    }
  });

  it("desenha comparação como duas linhas e parte-todo como todo sobre partes", () => {
    const comparar = render(
      <SingaporeBarsStage bars={buildBarSpec(situacao({ structure: "compare", unknown: "part2" }))} />,
    );
    expect(comparar.getByLabelText("Barras comparadas")).toBeTruthy();
    comparar.unmount();

    const juntar = render(<SingaporeBarsStage bars={buildBarSpec(situacao())} />);
    expect(juntar.getByLabelText("Barra de parte e todo")).toBeTruthy();
  });

  it("nomeia os segmentos conforme a estrutura, para leitor de tela", () => {
    render(<SingaporeBarsStage bars={buildBarSpec(situacao({ structure: "compare", unknown: "part2" }))} />);
    // Cada segmento anuncia o próprio papel, não apenas o número.
    expect(screen.getByLabelText("a diferença: quantidade desconhecida")).toBeTruthy();
    expect(screen.getByLabelText("o maior: 7")).toBeTruthy();
    expect(screen.getByLabelText("o menor: 3")).toBeTruthy();
  });

  it("não conhece narrativa: nenhum personagem ou emoji chega até a barra", () => {
    const { container } = render(<SingaporeBarsStage bars={buildBarSpec(situacao())} />);
    expect(container.textContent).not.toContain("Lia");
    expect(container.textContent).not.toContain("⭐");
  });

  it("a caixa desconhecida tem largura fixa, sem telegrafar a resposta", () => {
    const pequena = render(
      <SingaporeBarsStage bars={buildBarSpec(situacao({ part1: 1, part2: 1, whole: 2, unknown: "part2" }))} />,
    );
    const larguraPequena = (pequena.getAllByLabelText(/quantidade desconhecida$/)[0] as HTMLElement).style.width;
    pequena.unmount();

    const grande = render(
      <SingaporeBarsStage bars={buildBarSpec(situacao({ part1: 2, part2: 9, whole: 11, unknown: "part2" }))} />,
    );
    const larguraGrande = (grande.getAllByLabelText(/quantidade desconhecida$/)[0] as HTMLElement).style.width;

    expect(larguraPequena).toBe(larguraGrande);
  });

  it("não apresenta violações de acessibilidade em nenhuma das quatro estruturas", async () => {
    for (const structure of ADDITIVE_STRUCTURES) {
      const { container, unmount } = render(
        <SingaporeBarsStage bars={buildBarSpec(situacao({ structure, unknown: "part2" }))} />,
      );
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `${structure} ${v.id}`)).toEqual([]);
      unmount();
    }
  });
});
