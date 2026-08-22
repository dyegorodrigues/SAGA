// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { ContasVirgulaStage } from "../components/primitives/ContasVirgulaStage";
import { N6_02 } from "./fichas/jornada/N6.02";
import {
  construirContasVirgulaF76Resolucao,
  construirContasVirgulaF76Spec,
  construirContasVirgulaQuestion,
} from "./procedimentos/contasVirgulaContract";
import { evidenciasContasVirgulaF76 } from "./procedimentos/contasVirgulaEvidence";

describe("W47/F76 — contas com vírgula por valor posicional", () => {
  it("realiza os cinco níveis com InteractiveVertical + Quadrado100 e sem revelar a linha de resultado antes da decisão", () => {
    const modos = ["mesmas-casas", "casas-diferentes", "subtracao", "reagrupamento", "vezes-dez-cem"];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirContasVirgulaF76Spec(nivel, () => 0);
      const { container, unmount } = render(<ContasVirgulaStage spec={spec} onAnswer={vi.fn()} />);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["InteractiveVertical", "Quadrado100"]);
      expect(spec.acessibilidade.alvoMinPx).toBeGreaterThanOrEqual(80);
      expect(spec.acessibilidade.toqueAlternativo).toBe(true);
      expect(spec.acessibilidade.semArrastoObrigatorio).toBe(true);
      expect(spec.acessibilidade.erroMotorNaoTag).toBe(true);
      expect(container.querySelector("[data-interactive-vertical-decimal]")).toBeInTheDocument();
      expect(container.querySelector("[data-quadrado100-grid]")).toBeInTheDocument();
      expect(container.querySelector("[data-f76-after]")).not.toBeInTheDocument();
      expect(container.querySelector("[data-decimal-result]")).toHaveAttribute("data-decimal-result", "hidden");
      expect(container.querySelector("[data-sem-arrasto-obrigatorio='true']")).toBeInTheDocument();
      expect(container.querySelector("[data-erro-motor-nao-tag='true']")).toBeInTheDocument();
      for (const button of container.querySelectorAll<HTMLButtonElement>("[data-f76-option]")) expect(button).toHaveClass("min-h-20");
      unmount();
    }
  });

  it("materializa casas ausentes com zero no L2 e torna o reagrupamento explícito no L4", () => {
    const l2 = construirContasVirgulaF76Spec(2, () => 0);
    const { container: c2, unmount: u2 } = render(<ContasVirgulaStage spec={l2} onAnswer={vi.fn()} />);
    expect(l2.casasDiferentes).toBe(true);
    expect(l2.zerosPreenchimento).toBe(true);
    expect(c2.querySelector("[data-interactive-vertical-decimal]")).toHaveAttribute("data-zero-fill-enabled", "true");
    expect(c2.querySelector("[data-zero-fill='true']")).toBeInTheDocument();
    u2();

    const l4 = construirContasVirgulaF76Spec(4, () => 0);
    const { container: c4 } = render(<ContasVirgulaStage spec={l4} onAnswer={vi.fn()} />);
    expect(l4.exigeReagrupamento).toBe(true);
    expect(c4.querySelector("[data-interactive-vertical-decimal]")).toHaveAttribute("data-regroup", "true");
    expect(screen.getByText(/ordem pode virar dez unidades/i)).toBeInTheDocument();
  });

  it("torna visível a consequência de alinhar pelos últimos algarismos em vez da vírgula", () => {
    const onAnswer = vi.fn();
    const spec = construirContasVirgulaF76Spec(2, () => 0);
    const { container } = render(<ContasVirgulaStage spec={spec} onAnswer={onAnswer} />);
    const errada = container.querySelector<HTMLButtonElement>("[data-misconception='alinha-pela-direita']")!;

    fireEvent.click(errada);
    expect(container.querySelector("[data-interactive-vertical-decimal]")).toHaveAttribute("data-alignment", "right-digits");
    expect(screen.getByText(/vírgulas ficaram em eixos diferentes/i)).toBeInTheDocument();
    expect(onAnswer).toHaveBeenLastCalledWith(errada.dataset.f76Option, { misconception: "alinha-pela-direita" });
  });

  it("emite a evidência de casas diferentes somente no acerto L2 e mantém RT fora da autoridade", () => {
    const spec = construirContasVirgulaF76Spec(2, () => 0);
    expect(spec.casasDiferentes).toBe(true);
    expect(evidenciasContasVirgulaF76(spec, false)).toEqual([]);
    expect(evidenciasContasVirgulaF76(spec, true)).toEqual([
      "f76-casas-diferentes",
      "f76-ordens-alinhadas-pela-virgula",
      "contas-virgula-casas-diferentes-f76",
    ]);

    const q = construirContasVirgulaQuestion(N6_02, 2);
    expect(q.exigeEvidencia).toBe("contas-virgula-casas-diferentes-f76");
    expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q.rt_max_s).toBeUndefined();
  });

  it("retry após misconception conclui a questão sem comprar mastery independente", () => {
    const onAnswer = vi.fn();
    const spec = construirContasVirgulaF76Spec(2, () => 0);
    const { container } = render(<ContasVirgulaStage spec={spec} onAnswer={onAnswer} />);
    const errada = container.querySelector<HTMLButtonElement>("[data-misconception='alinha-pela-direita']")!;
    const correta = container.querySelector<HTMLButtonElement>(`[data-f76-option='${spec.resposta}']`)!;

    fireEvent.click(errada);
    fireEvent.click(correta);
    expect(onAnswer).toHaveBeenLastCalledWith(spec.resposta, {
      evidencias: [
        "f76-casas-diferentes",
        "f76-ordens-alinhadas-pela-virgula",
        "contas-virgula-casas-diferentes-f76",
        "mastery-disqualifier:f76-alinha-pela-direita-precedente",
      ],
    });
    expect(container.querySelector("[data-f76-after]")).toHaveAttribute("data-answer-revealed", "true");
    expect(container.querySelector("[data-f76-after] [data-decimal-result]")).toHaveAttribute("data-decimal-result", "revealed");
  });

  it("mantém no máximo quatro opções e cobre as três misconceptions canônicas", () => {
    const tags = new Set<string>();
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirContasVirgulaF76Spec(nivel, () => 0);
      expect(spec.opcoes.length).toBeLessThanOrEqual(4);
      expect(spec.opcoes.length).toBeGreaterThanOrEqual(2);
      for (const opcao of spec.opcoes) if (opcao.misconception) tags.add(opcao.misconception);
    }
    expect(tags).toEqual(new Set(["alinha-pela-direita", "ignora-zeros", "virgula-perdida"]));
  });

  it("a resolução explica ordens, zeros e reagrupamento sem reduzir ×10/×100 a mover a vírgula", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirContasVirgulaF76Spec(nivel, () => 0);
      const serializada = JSON.stringify(construirContasVirgulaF76Resolucao(spec));
      expect(serializada).toMatch(/vírgula|virgula|ordem|zero|subtra|reagrup|valor posicional|10|100/i);
      expect(serializada).not.toMatch(/mov(?:a|er).*vírgula|mov(?:a|er).*virgula/i);
    }
  });

  it("tem diversidade real de casos em todos os níveis", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const casos = new Set([
        construirContasVirgulaF76Spec(nivel, () => 0).caso,
        construirContasVirgulaF76Spec(nivel, () => 0.4).caso,
        construirContasVirgulaF76Spec(nivel, () => 0.8).caso,
      ]);
      expect(casos.size, `L${nivel} sem diversidade suficiente`).toBe(3);
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirContasVirgulaF76Spec(nivel, () => 0);
      const { container, unmount } = render(<ContasVirgulaStage spec={spec} onAnswer={vi.fn()} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  }, 20000);
});
