// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { PoligonosStage } from "./PoligonosStage";
import { construirPoligonosSpec } from "../../curriculum/procedimentos/poligonosContract";

function montar(nivel: number) {
  const spec = construirPoligonosSpec(nivel);
  const onAnswer = vi.fn();
  const view = render(<PoligonosStage spec={spec} onAnswer={onAnswer} />);
  const opcao = (value: string) => {
    const alvo = [...view.container.querySelectorAll<HTMLButtonElement>("[data-f79-options] button")]
      .find(botao => botao.textContent?.trim() === spec.opcoes.find(item => item.value === value)?.label);
    if (!alvo) throw new Error(`F79 L${nivel} sem botão para ${value}.`);
    return alvo;
  };
  /** Cada toque numa peça seguido de um toque num grupo conclui uma conferência. */
  const conferir = () => {
    const grupos = [...view.container.querySelectorAll<HTMLElement>("[data-f79-draggroup] [data-draggroup-box]")];
    if (!grupos.length) throw new Error(`F79 L${nivel} sem grupos de conferência.`);
    for (let i = 0; i < spec.criterios.length * spec.figuras.length; i += 1) {
      fireEvent.click(grupos[i % grupos.length]);
    }
  };
  const pendencia = () => view.container.querySelector("[data-f79-pendencia]");
  return { spec, onAnswer, view, opcao, conferir, pendencia };
}

describe("CLASS-007 — GE.07/F79: conferir os critérios é condição da resposta", () => {
  it("nenhum nível aceita a resposta antes de a conferência fechar", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const { spec, onAnswer, opcao, conferir, pendencia, view } = montar(nivel);
      expect(pendencia(), `L${nivel} precisa dizer o que falta conferir`).not.toBeNull();

      expect(opcao(spec.resposta).disabled, `L${nivel} respondeu sem conferir — bypass CLASS-007`).toBe(true);
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer, `L${nivel} chamou onAnswer com o DragGroup intocado`).not.toHaveBeenCalled();

      conferir();
      expect(pendencia(), `L${nivel} continuou pendente com tudo conferido`).toBeNull();
      expect(opcao(spec.resposta).disabled, `L${nivel} continuou fechado com tudo conferido`).toBe(false);
      fireEvent.click(opcao(spec.resposta));
      expect(onAnswer).toHaveBeenCalledTimes(1);
      view.unmount();
    }
  });

  it("uma conferência parcial não abre as alternativas", () => {
    const { spec, onAnswer, opcao, view } = montar(5);
    const grupos = [...view.container.querySelectorAll<HTMLElement>("[data-f79-draggroup] [data-draggroup-box]")];
    const total = spec.criterios.length * spec.figuras.length;

    for (let i = 0; i < total - 1; i += 1) fireEvent.click(grupos[i % grupos.length]);
    expect(opcao(spec.resposta).disabled, "L5 abriu com uma conferência a menos").toBe(true);
    fireEvent.click(opcao(spec.resposta));
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it("o DragGroup oferece um grupo por critério e uma peça por figura conferida", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const { spec, view } = montar(nivel);
      const grupos = view.container.querySelectorAll("[data-f79-draggroup] [data-draggroup-box]");
      expect(grupos.length, `L${nivel} precisa de um grupo por critério`).toBe(spec.criterios.length);
      // Cada figura é conferida contra cada critério: é isso que "combinar
      // propriedades" quer dizer, e é o que a ficha manda fazer antes de nomear.
      expect(view.container.querySelectorAll("[data-f79-draggroup] [data-draggroup-item]").length, `L${nivel} peças`)
        .toBe(spec.criterios.length * spec.figuras.length);
      view.unmount();
    }
  });

  it("cada classe sorteada tem traço próprio: nenhuma figura mente sobre si mesma", () => {
    // A CLASS-003 sorteia a classe. Se duas classes dividissem o mesmo
    // polígono, o cartão diria "3 lados iguais" ao lado de um desenho que não
    // os tem.
    const tracos = new Map<string, string>();
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (let i = 0; i < 40; i += 1) {
        const spec = construirPoligonosSpec(nivel);
        const view = render(<PoligonosStage spec={spec} onAnswer={vi.fn()} />);
        const alvo = spec.figuras[0];
        const pontos = view.container.querySelector("polygon")?.getAttribute("points") ?? "";
        const classe = `${alvo.familia}/${alvo.classeLados ?? "-"}/${alvo.classeAngulos ?? "-"}`;
        const jaVisto = tracos.get(pontos);
        if (jaVisto) expect(jaVisto, `${classe} e ${jaVisto} dividem o mesmo traço`).toBe(classe);
        else tracos.set(pontos, classe);
        view.unmount();
      }
    }
    expect(tracos.size, "o palco precisa desenhar mais de uma figura").toBeGreaterThan(3);
  });

  it("a prop disabled continua fechando tudo", () => {
    const spec = construirPoligonosSpec(3);
    const { container } = render(<PoligonosStage spec={spec} onAnswer={vi.fn()} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
