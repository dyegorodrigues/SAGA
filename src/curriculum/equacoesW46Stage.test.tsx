// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { describe, expect, it, vi } from "vitest";
import { EquacoesStage } from "../components/primitives/EquacoesStage";
import { AL_08 } from "./fichas/jornada/AL.08";
import {
  construirEquacoesF90Resolucao,
  construirEquacoesF90Spec,
  construirEquacoesQuestion,
} from "./procedimentos/equacoesContract";
import { evidenciasEquacoesF90 } from "./procedimentos/equacoesEvidence";

describe("W46/F90 — equações como equilíbrio físico", () => {
  it("realiza os cinco níveis canônicos sem revelar x antes da decisão", () => {
    const modos = ["soma", "subtracao", "multiplicacao", "dois-passos", "incognita-dois-lados"];
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirEquacoesF90Spec(nivel, () => 0);
      const { container, unmount } = render(<EquacoesStage spec={spec} onAnswer={vi.fn()} />);
      expect(spec.modo).toBe(modos[nivel - 1]);
      expect(spec.primitivas).toEqual(["Balanca"]);
      expect(container.querySelector("[data-f90-before]")).toHaveAttribute("data-balanced", "true");
      expect(container.querySelector("[data-f90-after]")).not.toBeInTheDocument();
      expect(container.textContent).not.toContain(spec.equacaoFinal);
      expect(container.querySelector("[data-sem-arrasto-obrigatorio='true']")).toBeInTheDocument();
      for (const button of screen.getAllByRole("button")) expect(button).toHaveClass("min-h-20");
      unmount();
    }
  });

  it("torna física a consequência de alterar somente um lado", () => {
    const onAnswer = vi.fn();
    const spec = construirEquacoesF90Spec(1, () => 0);
    const { container } = render(<EquacoesStage spec={spec} onAnswer={onAnswer} />);
    const unilateral = container.querySelector<HTMLButtonElement>("[data-misconception='nao-aplica-aos-dois']")!;

    fireEvent.click(unilateral);
    expect(container.querySelector("[data-f90-preview]")).toHaveAttribute("data-preview-balanced", "false");
    expect(screen.getByText(/só um prato mudou/i)).toBeInTheDocument();
    expect(onAnswer).toHaveBeenLastCalledWith(unilateral.dataset.f90Option, { misconception: "nao-aplica-aos-dois" });
  });

  it("distingue operação inversa errada de quebra do equilíbrio", () => {
    const spec = construirEquacoesF90Spec(3, () => 0);
    const { container } = render(<EquacoesStage spec={spec} onAnswer={vi.fn()} />);

    const inversa = container.querySelector<HTMLButtonElement>("[data-misconception='operacao-inversa-errada']")!;
    fireEvent.click(inversa);
    expect(container.querySelector("[data-f90-preview]")).toHaveAttribute("data-preview-balanced", "true");
    expect(screen.getByText(/continua horizontal.*não desfaz/i)).toBeInTheDocument();

    const quebra = container.querySelector<HTMLButtonElement>("[data-misconception='quebra-equilibrio']")!;
    fireEvent.click(quebra);
    expect(container.querySelector("[data-f90-preview]")).toHaveAttribute("data-preview-balanced", "false");
  });

  it("emite a evidência L3+ somente em acerto e mantém RT fora da autoridade conceitual", () => {
    const spec = construirEquacoesF90Spec(3, () => 0);
    expect(evidenciasEquacoesF90(spec, false)).toEqual([]);
    expect(evidenciasEquacoesF90(spec, true)).toEqual([
      "f90-multiplicacao",
      "f90-equilibrio-preservado",
      "equacao-l3-mais-f90",
    ]);

    const q = construirEquacoesQuestion(AL_08, 3);
    expect(q.exigeEvidencia).toBe("equacao-l3-mais-f90");
    expect(q.masteryRule).toEqual({ acertos: 4, de: 4, sessoes: 3 });
    expect(q.rt_max_s).toBeUndefined();
  });

  it("retry após misconception pode concluir a questão sem comprar mastery independente", () => {
    const onAnswer = vi.fn();
    const spec = construirEquacoesF90Spec(3, () => 0);
    const { container } = render(<EquacoesStage spec={spec} onAnswer={onAnswer} />);
    const errada = container.querySelector<HTMLButtonElement>("[data-misconception='responde-o-todo']")!;
    const correta = container.querySelector<HTMLButtonElement>(`[data-f90-option='${spec.resposta}']`)!;

    fireEvent.click(errada);
    fireEvent.click(correta);
    expect(onAnswer).toHaveBeenLastCalledWith(spec.resposta, {
      evidencias: [
        "f90-multiplicacao",
        "f90-equilibrio-preservado",
        "equacao-l3-mais-f90",
        "mastery-disqualifier:f90-responde-o-todo-precedente",
      ],
    });
    expect(container.querySelector("[data-f90-after]")).toHaveAttribute("data-balanced", "true");
  });

  it("a resolução segue a cadeia causal sem usar a regra decorada de passar termo", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirEquacoesF90Spec(nivel, () => 0);
      const serializada = JSON.stringify(construirEquacoesF90Resolucao(spec));
      expect(serializada).toMatch(/operação inversa|operacao inversa|dois lados|igualdade|equilíbrio|equilibrio/i);
      expect(serializada).not.toMatch(/passa.*outro lado.*troca.*sinal/i);
      expect(serializada).not.toContain(spec.equacaoFinal);
    }
  });

  it("tem diversidade real de casos dentro de cada nível", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const casos = new Set([
        construirEquacoesF90Spec(nivel, () => 0).caso,
        construirEquacoesF90Spec(nivel, () => 0.4).caso,
        construirEquacoesF90Spec(nivel, () => 0.8).caso,
      ]);
      expect(casos.size, `L${nivel} sem diversidade suficiente`).toBe(3);
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirEquacoesF90Spec(nivel, () => 0);
      const { container, unmount } = render(<EquacoesStage spec={spec} onAnswer={vi.fn()} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${nivel} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
