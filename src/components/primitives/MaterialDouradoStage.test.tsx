// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { MaterialDouradoStage } from "./MaterialDouradoStage";
import { construirMaterialDouradoSpec } from "../../curriculum/procedimentos/materialDouradoContract";

function rngConstante(valor: number) { return () => valor; }

function arrastarUma(container: HTMLElement) {
  const cubo = container.querySelector<HTMLElement>("[data-material-unidade-solta]");
  const alvo = container.querySelector<HTMLElement>("[data-material-alvo-troca]");
  expect(cubo).not.toBeNull();
  expect(alvo).not.toBeNull();
  fireEvent.dragStart(cubo!);
  fireEvent.dragOver(alvo!);
  fireEvent.drop(alvo!);
}

describe("MaterialDouradoStage — F21 / N2.01", () => {
  it("L1 funde exatamente no décimo cubo e só então nomeia a dezena", () => {
    const spec = construirMaterialDouradoSpec(1, rngConstante(0)); // 10
    const { container } = render(<MaterialDouradoStage spec={spec} />);

    expect(container.querySelectorAll("[data-material-unidade-solta]")).toHaveLength(spec.total);
    expect(container.querySelector("[data-material-tenframe]")).not.toBeNull();
    expect(container.querySelector("[data-material-equivalencia]")).toBeNull();

    for (let i = 0; i < 9; i += 1) arrastarUma(container);
    expect(container.querySelector("[data-material-dezena-fundida]")).toBeNull();
    expect(container.querySelector("[data-material-equivalencia]")).toBeNull();

    arrastarUma(container);
    expect(container.querySelectorAll("[data-material-dezena-fundida]")).toHaveLength(1);
    expect(container.querySelector("[data-material-equivalencia]")?.textContent).toContain("10 unidades = 1 dezena");
  });

  it("L2 repete a troca até não restarem dez unidades soltas", () => {
    const spec = construirMaterialDouradoSpec(2, rngConstante(0.5));
    const { container } = render(<MaterialDouradoStage spec={spec} />);

    const trocas = Math.floor(spec.total / 10);
    for (let i = 0; i < trocas * 10; i += 1) arrastarUma(container);

    expect(container.querySelectorAll("[data-material-dezena-fundida]")).toHaveLength(trocas);
    expect(container.querySelectorAll("[data-material-unidade-solta]")).toHaveLength(spec.total % 10);
    expect(container.querySelectorAll("[data-material-resposta]").length).toBeGreaterThanOrEqual(2);
  });

  it("L3 ainda exige agrupamento manual, mas sem TenFrame", () => {
    const spec = construirMaterialDouradoSpec(3, rngConstante(0.12));
    const { container } = render(<MaterialDouradoStage spec={spec} />);
    expect(container.querySelector("[data-material-tenframe]")).toBeNull();
    expect(container.querySelector("[data-material-alvo-troca]")).not.toBeNull();
    expect(container.querySelectorAll("[data-material-unidade-solta]")).toHaveLength(spec.total);
  });

  it("inspecionar/recontar a barra fica observável como gesto de não agrupamento", () => {
    const spec = construirMaterialDouradoSpec(3, rngConstante(0.12));
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);
    for (let i = 0; i < Math.floor(spec.total / 10) * 10; i += 1) arrastarUma(container);

    const barra = container.querySelector<HTMLButtonElement>("[data-material-inspect-ten]");
    expect(barra).not.toBeNull();
    fireEvent.click(barra!);
    const certa = [...container.querySelectorAll<HTMLButtonElement>("[data-material-resposta]")]
      .find(button => Number(button.textContent) === spec.total);
    fireEvent.click(certa!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.total,
      expect.objectContaining({ modo: "agrupar", contouUmAUm: true }),
    );
  });

  it("L4 monta barras e cubinhos a partir do numeral e emite a composição", () => {
    const spec = construirMaterialDouradoSpec(4, rngConstante(0.13));
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);
    const addD = container.querySelector<HTMLButtonElement>("[data-material-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-material-add-unidade]")!;
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU);
    fireEvent.click(container.querySelector<HTMLButtonElement>("[data-material-pronto]")!);

    expect(onAnswer).toHaveBeenCalledWith(spec.total, expect.objectContaining({
      modo: "montar",
      dezenasProduzidas: spec.dezenas,
      unidadesProduzidas: spec.unidades,
    }));
  });

  it("L5 mostra apenas decomposição D/U, sem material de apoio", () => {
    const spec = construirMaterialDouradoSpec(5, rngConstante(0.37));
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-material-dourado-visual]")).toBeNull();
    const addD = container.querySelector<HTMLButtonElement>("[data-decompor-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-decompor-add-unidade]")!;
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU);
    fireEvent.click(container.querySelector<HTMLButtonElement>("[data-decompor-pronto]")!);

    expect(onAnswer).toHaveBeenCalledWith(spec.total, expect.objectContaining({
      modo: "decompor",
      dezenasProduzidas: spec.dezenas,
      unidadesProduzidas: spec.unidades,
    }));
  });

  it("executa a coreografia sem alterar a tentativa real", () => {
    const spec = construirMaterialDouradoSpec(1, rngConstante(0.2));
    const { container, rerender } = render(<MaterialDouradoStage spec={spec} mostrar={{ preencherAte: 10 }} />);
    expect(container.querySelectorAll("[data-tutorial-frame-filled]")).toHaveLength(10);
    rerender(<MaterialDouradoStage spec={spec} />);
    expect(container.querySelectorAll("[data-material-unidade-solta]")).toHaveLength(spec.total);
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const spec = construirMaterialDouradoSpec(nivel, rngConstante(0.2));
      const { container, unmount } = render(<MaterialDouradoStage spec={spec} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 20_000);
});