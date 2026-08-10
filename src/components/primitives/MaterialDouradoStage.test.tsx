// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import axe from "axe-core";
import { MaterialDouradoStage } from "./MaterialDouradoStage";
import { construirMaterialDouradoSpec } from "../../curriculum/procedimentos/materialDouradoContract";

const zero = () => 0;

describe("MaterialDouradoStage — F21 / N2.01", () => {
  it("L1 só revela 10 unidades = 1 dezena depois de agrupar as dez", () => {
    const spec = construirMaterialDouradoSpec(1, zero);
    const { container } = render(<MaterialDouradoStage spec={spec} />);

    expect(container.querySelector("[data-material-equivalencia]")).toBeNull();
    expect(container.querySelectorAll("[data-material-unidade-solta]")).toHaveLength(10);

    const agrupar = () => container.querySelector<HTMLButtonElement>("[data-material-unidade-solta]");
    for (let i = 0; i < 9; i += 1) fireEvent.click(agrupar()!);
    expect(container.querySelector("[data-material-equivalencia]")).toBeNull();
    expect(container.querySelector("[data-material-dezena-fundida]")).toBeNull();

    fireEvent.click(agrupar()!);
    expect(container.querySelector("[data-material-equivalencia]")?.textContent).toContain("10 unidades = 1 dezena");
    expect(container.querySelector("[data-material-dezena-fundida]")).not.toBeNull();
    expect(container.querySelectorAll("[data-material-resposta]").length).toBeGreaterThanOrEqual(2);
  });

  it("tocar subdivisões da barra fica observável para o diagnóstico CONTA_TUDO", () => {
    const spec = construirMaterialDouradoSpec(3, zero);
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);
    const sub = container.querySelector<HTMLButtonElement>("[data-material-subunidade]");
    expect(sub).not.toBeNull();
    fireEvent.click(sub!);
    const errada = container.querySelector<HTMLButtonElement>("[data-material-resposta-errada]");
    fireEvent.click(errada!);
    expect(onAnswer).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({ modo: "ler", contouSubdivisoes: true }),
    );
  });

  it("L4 produz dezenas e unidades a partir do numeral e emite a composição feita", () => {
    const spec = construirMaterialDouradoSpec(4, zero);
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);

    const addD = container.querySelector<HTMLButtonElement>("[data-material-add-dezena]");
    const addU = container.querySelector<HTMLButtonElement>("[data-material-add-unidade]");
    const pronto = container.querySelector<HTMLButtonElement>("[data-material-pronto]");
    expect(addD).not.toBeNull();
    expect(addU).not.toBeNull();
    expect(pronto).not.toBeNull();

    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addD!);
    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addU!);
    fireEvent.click(pronto!);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.resposta,
      expect.objectContaining({
        modo: "produzir",
        dezenasProduzidas: spec.dezenas,
        unidadesProduzidas: spec.unidades,
      }),
    );
  });

  it("produção trocada D↔U chega ao boundary sem ser corrigida pela UI", () => {
    const spec = construirMaterialDouradoSpec(4, () => 0.25);
    const onAnswer = vi.fn();
    const { container } = render(<MaterialDouradoStage spec={spec} onAnswer={onAnswer} />);
    const addD = container.querySelector<HTMLButtonElement>("[data-material-add-dezena]")!;
    const addU = container.querySelector<HTMLButtonElement>("[data-material-add-unidade]")!;
    const pronto = container.querySelector<HTMLButtonElement>("[data-material-pronto]")!;

    for (let i = 0; i < spec.unidades; i += 1) fireEvent.click(addD);
    for (let i = 0; i < spec.dezenas; i += 1) fireEvent.click(addU);
    fireEvent.click(pronto);

    expect(onAnswer).toHaveBeenCalledWith(
      spec.unidades * 10 + spec.dezenas,
      expect.objectContaining({
        dezenasProduzidas: spec.unidades,
        unidadesProduzidas: spec.dezenas,
      }),
    );
  });

  it("não apresenta violações de acessibilidade nos modos leitura, troca e produção", async () => {
    for (const nivel of [1, 3, 4]) {
      const spec = construirMaterialDouradoSpec(nivel, zero);
      const { container, unmount } = render(<MaterialDouradoStage spec={spec} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 15_000);
});