// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { VolumePrismasStage } from "./VolumePrismasStage";
import { GM_11 } from "../../curriculum/fichas/jornada/GM.11";
import {
  construirVolumePrismasF94Spec,
  construirVolumePrismasQuestion,
  type VolumePrismasF94Spec,
} from "../../curriculum/procedimentos/volumePrismasContract";

const opcoesDe = (nivel: number) => construirVolumePrismasQuestion(GM_11, nivel).options ?? [];

function montar(nivel: number) {
  const spec = construirVolumePrismasF94Spec(nivel);
  const onAnswer = vi.fn();
  const view = render(<VolumePrismasStage spec={spec} options={opcoesDe(nivel)} onAnswer={onAnswer} />);
  const respostaCerta = () => {
    const alvo = [...view.container.querySelectorAll("button")]
      .find(botao => botao.textContent?.trim() === spec.respostaLabel);
    if (!alvo) throw new Error(`F94 L${nivel} sem botão para ${spec.respostaLabel}.`);
    return alvo as HTMLButtonElement;
  };
  const controle = (nome: string) => view.container.querySelector<HTMLButtonElement>(`[data-f94-control="${nome}"]`);
  return { spec, onAnswer, view, respostaCerta, controle };
}

describe("CLASS-007 — GM.11/F94: construir é condição da resposta", () => {
  it("L1 não aceita resposta com o prisma vazio; aceita depois do último cubinho", () => {
    const { spec, onAnswer, respostaCerta, controle } = montar(1);
    const adicionar = controle("adicionar-cubinho");
    expect(adicionar, "L1 precisa oferecer a construção por cubinhos").not.toBeNull();

    expect(respostaCerta().disabled, "acertar sem colocar um cubo sequer é bypass CLASS-007").toBe(true);
    fireEvent.click(respostaCerta());
    expect(onAnswer).not.toHaveBeenCalled();

    // Um cubo a menos que o volume ainda não é o prisma construído.
    for (let i = 0; i < spec.volume - 1; i += 1) fireEvent.click(adicionar!);
    expect(respostaCerta().disabled).toBe(true);

    fireEvent.click(adicionar!);
    expect(respostaCerta().disabled).toBe(false);
    fireEvent.click(respostaCerta());
    expect(onAnswer).toHaveBeenCalledWith(spec.resposta, expect.objectContaining({ source: "array-grid" }));
  });

  it("L2, L3 e L5 só liberam a resposta quando todas as camadas existem", () => {
    for (const nivel of [2, 3, 5]) {
      const { spec, onAnswer, respostaCerta, controle, view } = montar(nivel);
      const adicionar = controle("adicionar-camada");
      expect(adicionar, `L${nivel} precisa oferecer a construção por camadas`).not.toBeNull();

      expect(respostaCerta().disabled, `L${nivel} respondeu antes de empilhar as camadas`).toBe(true);
      fireEvent.click(respostaCerta());
      expect(onAnswer).not.toHaveBeenCalled();

      // O palco já começa com uma camada; faltam as demais até a altura.
      // A penúltima camada ainda não é o prisma: parar aqui mantém tudo fechado.
      for (let i = 1; i < spec.altura - 1; i += 1) fireEvent.click(adicionar!);
      expect(respostaCerta().disabled, `L${nivel} abriu com ${spec.altura - 1} de ${spec.altura} camadas`).toBe(true);

      fireEvent.click(adicionar!);
      expect(respostaCerta().disabled, `L${nivel} continuou fechado com o prisma completo`).toBe(false);
      fireEvent.click(respostaCerta());
      expect(onAnswer).toHaveBeenCalledTimes(1);
      view.unmount();
    }
  });

  it("L4 não tem construção a exigir, então a resposta continua aberta e a evidência é emitida", () => {
    const { spec, onAnswer, respostaCerta, controle } = montar(4);
    expect(spec.modo).toBe("dimensao-faltante");
    expect(controle("adicionar-cubinho"), "L4 não constrói por cubinhos").toBeNull();
    expect(controle("adicionar-camada"), "L4 não constrói por camadas").toBeNull();

    expect(respostaCerta().disabled).toBe(false);
    fireEvent.click(respostaCerta());
    expect(onAnswer).toHaveBeenCalledWith(spec.resposta, expect.objectContaining({
      evidencias: ["dimensao-faltante-f94"],
    }));
  });

  it("a prop disabled continua fechando tudo, mesmo com o prisma construído", () => {
    const spec: VolumePrismasF94Spec = construirVolumePrismasF94Spec(4);
    const onAnswer = vi.fn();
    const { container } = render(<VolumePrismasStage spec={spec} options={opcoesDe(4)} onAnswer={onAnswer} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
