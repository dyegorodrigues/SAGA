// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RazaoProporcaoStage } from "../components/primitives/RazaoProporcaoStage";
import { N6_04 } from "./fichas/jornada/N6.04";
import {
  construirRazaoProporcaoF88Resolucao,
  construirRazaoProporcaoF88Spec,
  construirRazaoProporcaoQuestion,
} from "./procedimentos/razaoProporcaoContract";

describe("W45/F88 — realização física SingaporeBars vinculada", () => {
  it("não pré-renderiza o par escalado e depois revela as duas barras pelo mesmo fator", () => {
    const spec = construirRazaoProporcaoF88Spec(1, () => 0);
    const { container } = render(<RazaoProporcaoStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector("[data-singapore-linked-scale]")).toHaveAttribute("data-bars-linked", "true");
    expect(container.querySelector("[data-scaled-pair]")).not.toBeInTheDocument();
    expect(screen.getByText(/mesmo fator × 2 nas duas barras/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "4 e 6" }));
    expect(container.querySelector("[data-scaled-pair]")).toBeInTheDocument();
    expect(container.querySelector("[data-linked-pair='scaled'] [data-linked-bar='a']")).toHaveTextContent("4");
    expect(container.querySelector("[data-linked-pair='scaled'] [data-linked-bar='b']")).toHaveTextContent("6");
  });

  it("mantém o fator da regra de três oculto até a decisão e usa alvos de toque generosos", () => {
    const spec = construirRazaoProporcaoF88Spec(5, () => 0);
    const { container } = render(<RazaoProporcaoStage spec={spec} onAnswer={vi.fn()} />);

    expect(container.querySelector("[data-singapore-linked-scale]")).toHaveAttribute("data-scale-factor", "unknown");
    expect(screen.getByText(/descubra um único fator para o par/i)).toBeInTheDocument();
    for (const button of screen.getAllByRole("button")) expect(button).toHaveClass("min-h-20");

    fireEvent.click(screen.getByRole("button", { name: "15" }));
    expect(container.querySelector("[data-singapore-linked-scale]")).toHaveAttribute("data-scale-factor", "2.5");
    expect(container.querySelector("[data-scaled-pair]")).toBeInTheDocument();
  });

  it("emite evidência real para escala não-inteira e não usa RT como autoridade", () => {
    const onAnswer = vi.fn();
    const spec = construirRazaoProporcaoF88Spec(3, () => 0);
    render(<RazaoProporcaoStage spec={spec} onAnswer={onAnswer} />);

    expect(spec.fatorEscala).toBe(1.5);
    expect(spec.escalaNaoInteira).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "6 e 9" }));
    expect(onAnswer).toHaveBeenLastCalledWith("6|9", {
      evidencias: ["f88-escala-geral", "f88-mesmo-fator", "escala-nao-inteira-f88"],
    });

    const q = construirRazaoProporcaoQuestion(N6_04, 3);
    expect(q.exigeEvidencia).toBe("escala-nao-inteira-f88");
    expect(q.masteryRule).toEqual({ acertos: 3, de: 3, sessoes: 2 });
    expect(q.rt_max_s).toBeUndefined();
  });

  it("retry após misconception conceitual encerra a questão, mas não compra mastery independente", () => {
    const onAnswer = vi.fn();
    const spec = construirRazaoProporcaoF88Spec(3, () => 0);
    render(<RazaoProporcaoStage spec={spec} onAnswer={onAnswer} />);

    fireEvent.click(screen.getByRole("button", { name: "5,5 e 7,5" }));
    expect(onAnswer).toHaveBeenLastCalledWith("5.5|7.5", { misconception: "soma-em-vez-de-escalar" });
    fireEvent.click(screen.getByRole("button", { name: "6 e 9" }));
    expect(onAnswer).toHaveBeenLastCalledWith("6|9", {
      evidencias: [
        "f88-escala-geral",
        "f88-mesmo-fator",
        "escala-nao-inteira-f88",
        "mastery-disqualifier:f88-soma-em-vez-de-escalar-precedente",
      ],
    });
  });

  it("ensina razão como relação e regra de três por fator, não por multiplicação cruzada decorada", () => {
    const razao = construirRazaoProporcaoF88Spec(4, () => 0);
    const regra = construirRazaoProporcaoF88Spec(5, () => 0);
    const resolucaoRazao = JSON.stringify(construirRazaoProporcaoF88Resolucao(razao));
    const resolucaoRegra = JSON.stringify(construirRazaoProporcaoF88Resolucao(regra));

    expect(resolucaoRazao).toMatch(/razão|fração|relação/i);
    expect(resolucaoRazao).toMatch(/mesmo fator|escala/i);
    expect(resolucaoRegra).toMatch(/regra de três|relação proporcional causal|mesmo fator/i);
    expect(resolucaoRegra).toMatch(/não por multiplicação cruzada decorada/i);
  });
});
