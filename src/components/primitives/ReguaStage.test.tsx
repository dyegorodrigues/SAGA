// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import axe from "axe-core";
import { Evidencia } from "../../constants/evidencias";
import { construirReguaSpec } from "../../curriculum/procedimentos/reguaContract";
import { ReguaStage } from "./ReguaStage";

const meio = () => 0.5;

describe("ReguaStage — F61 / GM.05", () => {
  it("oferece alinhamento por toque equivalente ao arrasto e colhe evidência real", () => {
    const spec = construirReguaSpec(3, meio);
    const onAnswer = vi.fn();
    const { container, getByRole } = render(<ReguaStage spec={spec} onAnswer={onAnswer} />);

    expect(container.querySelector("[data-regua-stage]")?.getAttribute("data-regua-aligned")).toBe("false");
    fireEvent.click(getByRole("button", { name: /alinhar o zero sem arrastar/i }));
    expect(container.querySelector("[data-regua-stage]")?.getAttribute("data-regua-aligned")).toBe("true");

    fireEvent.click(getByRole("button", { name: `${spec.valorCerto} cm` }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][0]).toBe(spec.resposta);
    expect(onAnswer.mock.calls[0][1]).toEqual(expect.objectContaining({
      source: "medidas",
      evidencias: expect.arrayContaining([Evidencia.ALINHOU_ZERO]),
    }));
  });

  it("renderiza o próprio objeto proporcional, sem cápsula/emoji como substituto", () => {
    const spec = construirReguaSpec(3, meio);
    const { container } = render(<ReguaStage spec={spec} />);
    const objeto = container.querySelector("[data-regua-object]");
    const desenho = objeto?.querySelector("[data-regua-measure-object]");

    expect(objeto).not.toBeNull();
    expect(desenho).not.toBeNull();
    expect(desenho?.getAttribute("data-regua-object-kind")).toBeTruthy();
    expect(desenho?.textContent).toBe("");
  });

  it("pointercancel aborta o arrasto e não publica tentativa", () => {
    const spec = construirReguaSpec(3, meio);
    const onAnswer = vi.fn();
    const { container } = render(<ReguaStage spec={spec} onAnswer={onAnswer} />);
    const draggable = container.querySelector<HTMLElement>("[data-regua-draggable]")!;

    fireEvent.pointerDown(draggable, { pointerId: 4, clientX: 100 });
    fireEvent.pointerMove(draggable, { pointerId: 4, clientX: 130 });
    fireEvent.pointerCancel(draggable, { pointerId: 4, clientX: 130 });

    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("L5 obriga estimativa antes de liberar a régua", () => {
    const spec = construirReguaSpec(5, meio);
    const { container, getByRole } = render(<ReguaStage spec={spec} />);

    expect(container.querySelector("[data-regua-estimate-phase]")).not.toBeNull();
    expect(container.querySelector("[data-regua-draggable]")).toBeNull();

    const estimativa = spec.estimativas![0];
    fireEvent.click(getByRole("button", { name: `${estimativa} cm` }));
    expect(container.querySelector("[data-regua-estimate-phase]")).toBeNull();
    expect(container.querySelector("[data-regua-draggable]")).not.toBeNull();
  });

  it("L4 usa dois objetos distintos e só permite comparar depois de medir ambos", () => {
    const spec = construirReguaSpec(4, meio);
    const { container, getAllByRole } = render(<ReguaStage spec={spec} />);
    const itens = [...container.querySelectorAll("[data-regua-compare-item]")];
    const tipos = itens.map(item => item.getAttribute("data-regua-compare-kind"));
    expect(new Set(tipos).size).toBe(2);

    const medir = getAllByRole("button", { name: /^Medir / });
    expect(medir).toHaveLength(2);
    expect(container.querySelector('[aria-label="Escolha o objeto mais comprido"]')).toBeNull();

    fireEvent.click(medir[0]);
    expect(container.querySelector('[aria-label="Escolha o objeto mais comprido"]')).toBeNull();
    fireEvent.click(getAllByRole("button", { name: /^Medir / })[0]);

    const escolhas = container.querySelector<HTMLElement>('[aria-label="Escolha o objeto mais comprido"]');
    expect(escolhas).not.toBeNull();
    expect(within(escolhas!).getAllByRole("button")).toHaveLength(2);
  });

  it("tutorial pode alinhar visualmente sem fabricar evidência da criança", () => {
    const spec = construirReguaSpec(3, meio);
    const onAnswer = vi.fn();
    const { getByRole } = render(
      <ReguaStage spec={spec} onAnswer={onAnswer} mostrar={{ alinharRegua: true }} />,
    );

    fireEvent.click(getByRole("button", { name: `${spec.valorCerto} cm` }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][1]?.evidencias ?? []).not.toContain(Evidencia.ALINHOU_ZERO);
  });

  it("não apresenta violações WCAG nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirReguaSpec(nivel, meio);
      const { container, unmount } = render(<ReguaStage spec={spec} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 15_000);
});