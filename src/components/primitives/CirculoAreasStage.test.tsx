// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { CirculoAreasStage } from "./CirculoAreasStage";
import { construirCirculoAreasSpec } from "../../curriculum/procedimentos/circuloAreasContract";

function montar(nivel: number) {
  const spec = construirCirculoAreasSpec(nivel);
  const onAnswer = vi.fn();
  const view = render(<CirculoAreasStage spec={spec} onAnswer={onAnswer} />);
  const opcao = (value: string) => {
    const alvo = view.container.querySelector<HTMLButtonElement>(`[data-f91-option="${value}"]`);
    if (!alvo) throw new Error(`F91 L${nivel} sem botão para ${value}.`);
    return alvo;
  };
  const transformar = () => view.container.querySelector<HTMLButtonElement>("[data-f91-transform]");
  return { spec, onAnswer, view, opcao, transformar };
}

describe("CLASS-007 — GE.09/F91: transformar é condição da resposta", () => {
  it("L1, L3 e L5 mantêm as alternativas fechadas até a transformação acontecer", () => {
    for (const nivel of [1, 3, 5]) {
      const { spec, onAnswer, opcao, transformar, view } = montar(nivel);
      const botao = transformar();
      expect(botao, `L${nivel} precisa oferecer a transformação`).not.toBeNull();

      expect(opcao(spec.resposta).disabled, `L${nivel} respondeu sem transformar — bypass CLASS-007`).toBe(true);
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer).not.toHaveBeenCalled();

      fireEvent.click(botao!);
      expect(opcao(spec.resposta).disabled, `L${nivel} continuou fechado depois de transformar`).toBe(false);
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer).toHaveBeenCalledTimes(1);
      expect(onAnswer).toHaveBeenCalledWith(spec.resposta, undefined);
      view.unmount();
    }
  });

  it("o distrator só vira misconception depois da transformação, e não antes", () => {
    const { spec, onAnswer, opcao, transformar } = montar(3);
    const errada = spec.opcoes.find(item => item.misconception)!;

    fireEvent.click(opcao(errada.value));
    expect(onAnswer, "distrator comprado antes da transformação").not.toHaveBeenCalled();

    fireEvent.click(transformar()!);
    fireEvent.click(opcao(errada.value));
    expect(onAnswer).toHaveBeenCalledWith(errada.value, { misconception: errada.misconception });
  });

  it("L2 e L4 não têm transformação a exigir, então respondem direto", () => {
    for (const nivel of [2, 4]) {
      const { spec, onAnswer, opcao, transformar, view } = montar(nivel);
      // A figura já nasce transformada (L2) ou não há corte/rearranjo a fazer (L4):
      // fechar as alternativas aqui pediria um gesto que a tela não oferece.
      expect(transformar(), `L${nivel} não deveria oferecer transformação`).toBeNull();
      expect(opcao(spec.resposta).disabled).toBe(false);
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer).toHaveBeenCalledTimes(1);
      view.unmount();
    }
  });

  it("a prop disabled continua fechando tudo, mesmo depois de transformar", () => {
    const spec = construirCirculoAreasSpec(1);
    const { container } = render(<CirculoAreasStage spec={spec} onAnswer={vi.fn()} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
