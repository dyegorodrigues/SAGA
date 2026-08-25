// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { FatoresRetangulosStage } from "./FatoresRetangulosStage";
import { construirFatoresRetangulosF66Spec } from "../../curriculum/procedimentos/fatoresRetangulosContract";
import { tentativaRetangulo } from "../../curriculum/procedimentos/fatoresRetangulosProcedure";

function montar(nivel: number) {
  const spec = construirFatoresRetangulosF66Spec(nivel);
  const onAnswer = vi.fn();
  const view = render(<FatoresRetangulosStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} />);
  // O enunciado e o suporte são tudo que não são as alternativas: é ali que um
  // gabarito impresso vira leitura, não raciocínio.
  const suporte = () => {
    const copia = view.container.cloneNode(true) as HTMLElement;
    copia.querySelector('[aria-label="Alternativas da Fábrica de Retângulos"]')?.remove();
    return (copia.textContent ?? "").replace(/\s+/g, "").replace(/×/g, "x");
  };
  const controle = (nome: string) => view.container.querySelector<HTMLButtonElement>(`[data-f66-control="${nome}"]`);
  return { spec, onAnswer, view, suporte, controle };
}

describe("GAP — N2.07/F66: a tela não pode imprimir as formações que a criança deve descobrir", () => {
  it("nenhum nível exibe, de saída, uma formação que a criança ainda não fechou", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const { spec, suporte, view } = montar(nivel);
      const inicial = tentativaRetangulo(spec.total, spec.divisorInicial);
      const texto = suporte();

      for (const par of spec.pares) {
        const jaFechada = inicial.sobra === 0
          && ((par.linhas === inicial.linhasCompletas && par.colunas === spec.divisorInicial)
            || (par.colunas === inicial.linhasCompletas && par.linhas === spec.divisorInicial));
        if (jaFechada) continue;
        for (const escrita of [`${par.linhas}x${par.colunas}`, `${par.colunas}x${par.linhas}`]) {
          expect(texto.includes(escrita), `L${nivel} entregou a formação ${escrita} antes de a criança fechá-la`).toBe(false);
        }
      }
      view.unmount();
    }
  });
});

describe("CLASS-007 — N2.07/F66: a fábrica de retângulos precisa ser operável", () => {
  it("a criança muda as colunas e a grade responde com sobra ou retângulo fechado", () => {
    const { spec, view, controle } = montar(1);
    const mais = controle("mais-colunas");
    const menos = controle("menos-colunas");
    expect(mais, "F66 sem controle para aumentar as colunas").not.toBeNull();
    expect(menos, "F66 sem controle para diminuir as colunas").not.toBeNull();

    // 12 com 2 colunas fecha; com 5 sobra.
    expect(spec.divisorInicial).toBe(2);
    expect(view.container.querySelector("[data-f66-complete-rectangle]")).not.toBeNull();

    for (let i = 0; i < 3; i += 1) fireEvent.click(mais!);
    expect(view.container.querySelector("[data-f66-invalid-remainder]"), "12 em 5 colunas tem de sobrar").not.toBeNull();
    expect(view.container.querySelector("[data-f66-complete-rectangle]")).toBeNull();

    fireEvent.click(menos!);
    expect(view.container.querySelector("[data-f66-complete-rectangle]"), "12 em 4 colunas fecha").not.toBeNull();
  });

  it("a lista de formações é o que a criança fechou, e cresce só por exploração", () => {
    const { view, controle, suporte } = montar(1);
    // Começa em 2 colunas: 6×2 já está fechado na tela inicial.
    expect(suporte()).toContain("6x2");
    expect(suporte()).not.toContain("3x4");

    for (let i = 0; i < 2; i += 1) fireEvent.click(controle("mais-colunas")!);
    // 12 em 4 colunas fecha em 3×4 — agora sim a formação foi descoberta.
    expect(suporte()).toContain("3x4");
    expect(suporte()).toContain("6x2");
    expect(suporte()).not.toContain("1x12");
    view.unmount();
  });

  it("a grade de F66 é superfície de leitura, não um callback morto", () => {
    const { view } = montar(1);
    const grade = view.container.querySelector("[data-array-grid-f66]");
    expect(grade).not.toBeNull();
    // ArrayGrid sem opções não renderiza nenhum alvo clicável; deixá-lo
    // "habilitado" com onAnswer no-op era a forma que o Gate B mediu.
    expect(grade!.querySelectorAll("button").length, "a grade não deve ter alvo próprio em F66").toBe(0);
  });

  it("a prop disabled continua fechando alternativas e controles", () => {
    const spec = construirFatoresRetangulosF66Spec(1);
    const onAnswer = vi.fn();
    const { container } = render(<FatoresRetangulosStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
