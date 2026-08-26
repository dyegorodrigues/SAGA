// @vitest-environment jsdom
import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import { Evidencia } from "../../constants/evidencias";
import { N5_05 } from "../../curriculum/fichas/jornada/N5.05";
import { construirMultiplicarFracoesQuestion, MultiplicarFracoesMisconception } from "../../curriculum/procedimentos/multiplicarFracoesContract";
import { MultiplicarFracoesStage } from "./MultiplicarFracoesStage";

describe("MultiplicarFracoesStage — F86 / N5.05", () => {
  // A conta de L3 é sorteada (CLASS-003): faixas e interseção saem do spec.
  const numeradorDe = (texto: string) => Number(texto.split("/")[0]);

  it("L3 mostra as duas faixas no ArrayGrid e a interseção que a conta pede", () => {
    const q = construirMultiplicarFracoesQuestion(N5_05, 3);
    const spec = q.uiProps as any;
    const { container } = render(<MultiplicarFracoesStage spec={spec} options={q.options ?? []} onAnswer={() => undefined} />);

    expect(container.querySelector('[data-arraygrid-fraction-bands="true"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-arraygrid-intersection="true"]'))
      .toHaveLength(numeradorDe(spec.fatorA) * numeradorDe(spec.fatorB));
    expect(container.querySelector('[data-f86-layer="horizontal"]')?.textContent).toContain(spec.fatorA);
    expect(container.querySelector('[data-f86-layer="vertical"]')?.textContent).toContain(spec.fatorB);
    expect(container.querySelector("[data-f86-intersection]")?.textContent).toMatch(/interseção/i);
  });

  it("acerto L3 publica evidência conceitual; erro publica misconception sem evidência", () => {
    const q = construirMultiplicarFracoesQuestion(N5_05, 3);
    const spec = q.uiProps as any;
    const onAnswer = vi.fn();
    const { getByRole, unmount } = render(<MultiplicarFracoesStage spec={spec} options={q.options ?? []} onAnswer={onAnswer} />);

    fireEvent.click(getByRole("button", { name: spec.respostaLabel }));
    expect(onAnswer).toHaveBeenCalledWith(spec.resposta, expect.objectContaining({
      source: "array-grid",
      evidencias: [Evidencia.FRACAO_VEZES_FRACAO_F86],
    }));
    unmount();

    // O distrator de somar-em-vez-de-multiplicar também sai da conta sorteada.
    const somou = (q.options ?? []).find(o => o.misconception === MultiplicarFracoesMisconception.SOMA_EM_VEZ_DE_MULTIPLICAR)!;
    const errado = vi.fn();
    const telaErrada = render(<MultiplicarFracoesStage spec={spec} options={q.options ?? []} onAnswer={errado} />);
    fireEvent.click(telaErrada.getByRole("button", { name: String(somou.label) }));
    expect(errado).toHaveBeenCalledWith(somou.value, expect.objectContaining({
      source: "array-grid",
      misconception: "soma-em-vez-de-multiplicar",
    }));
    expect(errado.mock.calls[0][1]?.evidencias ?? []).toEqual([]);
  });

  it("L4 retira o preenchimento-resposta e mantém a linguagem de área como andaime estrutural", () => {
    const q = construirMultiplicarFracoesQuestion(N5_05, 4);
    const spec = q.uiProps as any;
    const { container } = render(<MultiplicarFracoesStage spec={spec} options={q.options ?? []} onAnswer={() => undefined} />);

    expect(container.querySelector('[data-arraygrid-fraction-bands="true"]')).toBeNull();
    expect(container.querySelectorAll('[data-arraygrid-intersection="true"]')).toHaveLength(0);
    expect(container.querySelector("[data-f86-area-grid]")?.textContent).toMatch(/calcule sem a área preenchida/i);
  });

  it("oferece resposta por toque amplo nos cinco níveis e não exige arrasto", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = construirMultiplicarFracoesQuestion(N5_05, nivel);
      const spec = q.uiProps as any;
      expect(spec.acessibilidade).toMatchObject({ toqueAlternativo: true, semArrastoObrigatorio: true, alvoMinPx: 80, erroMotorNaoTag: true });
      const { getAllByRole, unmount } = render(<MultiplicarFracoesStage spec={spec} options={q.options ?? []} onAnswer={() => undefined} />);
      const botoes = getAllByRole("button");
      expect(botoes.length).toBeGreaterThanOrEqual(2);
      for (const botao of botoes) expect(botao.className).toMatch(/min-h-20|min-w-20/);
      unmount();
    }
  });

  it("não apresenta violações WCAG nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const q = construirMultiplicarFracoesQuestion(N5_05, nivel);
      const { container, unmount } = render(<MultiplicarFracoesStage spec={q.uiProps as any} options={q.options ?? []} onAnswer={() => undefined} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 15_000);
});
