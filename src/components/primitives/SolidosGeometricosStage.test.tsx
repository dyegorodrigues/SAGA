// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { SolidosGeometricosStage } from "./SolidosGeometricosStage";
import { construirSolidosGeometricosF59Spec } from "../../curriculum/procedimentos/solidosGeometricosContract";

function montar(nivel: number) {
  const spec = construirSolidosGeometricosF59Spec(nivel);
  const onAnswer = vi.fn();
  const view = render(<SolidosGeometricosStage spec={spec} onAnswer={onAnswer} />);
  const opcao = (value: number) => {
    const alvo = view.container.querySelector<HTMLButtonElement>(`[data-f59-option="${value}"]`);
    if (!alvo) throw new Error(`F59 L${nivel} sem botão para ${value}.`);
    return alvo;
  };
  const experimento = () => view.container.querySelector<HTMLButtonElement>("[data-f59-experiment]");
  const resultado = () => view.container.querySelector("[role=status]")?.textContent ?? null;
  return { spec, onAnswer, view, opcao, experimento, resultado };
}

describe("CLASS-007 — GE.04/F59: prever e testar", () => {
  it("L3 e L4 não enviam resposta enquanto o experimento não roda", () => {
    for (const nivel of [3, 4]) {
      const { spec, onAnswer, opcao, experimento, view } = montar(nivel);
      expect(experimento(), `L${nivel} precisa oferecer o experimento`).not.toBeNull();

      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer, `L${nivel} comprou mastery sem testar — bypass CLASS-007`).not.toHaveBeenCalled();

      fireEvent.click(experimento()!);
      expect(onAnswer).toHaveBeenCalledTimes(1);
      expect(onAnswer).toHaveBeenCalledWith(spec.resposta, undefined);
      view.unmount();
    }
  });

  it("o experimento fica fechado até existir uma previsão, e por isso não conta o resultado antes", () => {
    for (const nivel of [3, 4]) {
      const { spec, opcao, experimento, resultado, view } = montar(nivel);
      // O texto do resultado diz qual é a resposta. Se o botão abrir antes da
      // previsão, o experimento deixa de testar a criança e passa a informá-la.
      expect(experimento()!.disabled, `L${nivel} deixou testar antes de prever`).toBe(true);
      fireEvent.click(experimento()!);
      expect(resultado(), `L${nivel} imprimiu o resultado sem previsão nenhuma`).toBeNull();

      fireEvent.click(opcao(spec.resposta));
      expect(experimento()!.disabled).toBe(false);
      expect(resultado(), `L${nivel} revelou o resultado só por escolher a previsão`).toBeNull();

      fireEvent.click(experimento()!);
      expect(resultado()).toContain("O teste");
      view.unmount();
    }
  });

  it("a previsão errada chega ao motor com a misconception, depois do teste", () => {
    const { spec, onAnswer, opcao, experimento } = montar(3);
    const errada = spec.opcoes.find(item => item.misconception)!;

    fireEvent.click(opcao(errada.value));
    expect(onAnswer).not.toHaveBeenCalled();

    fireEvent.click(experimento()!);
    expect(onAnswer).toHaveBeenCalledWith(errada.value, { misconception: errada.misconception });
  });

  it("L1, L2 e L5 não têm experimento a exigir, então respondem direto", () => {
    for (const nivel of [1, 2, 5]) {
      const { spec, onAnswer, opcao, experimento, view } = montar(nivel);
      expect(experimento(), `L${nivel} não deveria oferecer experimento`).toBeNull();
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer).toHaveBeenCalledWith(spec.resposta, undefined);
      view.unmount();
    }
  });

  it("a prop disabled continua fechando tudo", () => {
    const spec = construirSolidosGeometricosF59Spec(3);
    const { container } = render(<SolidosGeometricosStage spec={spec} onAnswer={vi.fn()} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
