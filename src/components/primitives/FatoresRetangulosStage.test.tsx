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
  // O controle move UMA coluna por clique, então o teste precisa saber onde
  // está. Antes o total era fixo e os cliques eram contados na mão.
  let colunaAtual = spec.divisorInicial;
  const irPara = (alvo: number) => {
    while (colunaAtual < alvo) { fireEvent.click(controle("mais-colunas")!); colunaAtual += 1; }
    while (colunaAtual > alvo) { fireEvent.click(controle("menos-colunas")!); colunaAtual -= 1; }
  };
  return { spec, onAnswer, view, suporte, controle, irPara };
}

/** Menor divisor acima do inicial que fecha retângulo — a próxima descoberta. */
const proximoQueFecha = (total: number, apos: number): number => {
  for (let d = apos + 1; d <= total; d += 1) if (total % d === 0) return d;
  throw new Error(`F66: ${total} não tem divisor acima de ${apos}.`);
};

/** Menor divisor acima do inicial que deixa sobra — passar por ali não fecha nada. */
const proximoComSobra = (total: number, apos: number): number => {
  for (let d = apos + 1; d <= total; d += 1) if (total % d !== 0) return d;
  throw new Error(`F66: ${total} não tem divisor com sobra acima de ${apos}.`);
};

const formacao = (linhas: number, colunas: number) => `${linhas}x${colunas}`;

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

    // O total é sorteado (CLASS-003), então a conta vem do spec, não do texto.
    expect(spec.total % spec.divisorInicial, "L1 abre num divisor que fecha").toBe(0);
    expect(view.container.querySelector("[data-f66-complete-rectangle]")).not.toBeNull();

    const comSobra = proximoComSobra(spec.total, spec.divisorInicial);
    for (let coluna = spec.divisorInicial; coluna < comSobra; coluna += 1) fireEvent.click(mais!);
    expect(view.container.querySelector("[data-f66-invalid-remainder]"),
      `${spec.total} em ${comSobra} colunas tem de sobrar`).not.toBeNull();
    expect(view.container.querySelector("[data-f66-complete-rectangle]")).toBeNull();

    // Descer uma coluna só volta a fechar se aquela coluna dividir o total.
    for (let coluna = comSobra; coluna > spec.divisorInicial; coluna -= 1) fireEvent.click(menos!);
    expect(view.container.querySelector("[data-f66-complete-rectangle]"),
      `${spec.total} voltou ao divisor inicial e tem de fechar`).not.toBeNull();
  });

  it("a lista de formações é o que a criança fechou, e cresce só por exploração", () => {
    const { spec, view, controle, suporte, irPara } = montar(1);
    const inicial = formacao(spec.total / spec.divisorInicial, spec.divisorInicial);
    const proxima = proximoQueFecha(spec.total, spec.divisorInicial);
    const descoberta = formacao(spec.total / proxima, proxima);
    const trivial = formacao(1, spec.total);

    // A formação do divisor inicial já está fechada na tela; as outras, não.
    expect(suporte()).toContain(inicial);
    expect(suporte()).not.toContain(descoberta);

    irPara(proxima);
    expect(suporte(), `${spec.total} em ${proxima} colunas fecha ${descoberta}`).toContain(descoberta);
    expect(suporte(), "o que já estava fechado não some").toContain(inicial);
    expect(suporte(), "a trivial 1 × n só entra quando a criança chegar lá").not.toContain(trivial);

    // Passar por um divisor com sobra não fecha formação nenhuma.
    const comSobra = proximoComSobra(spec.total, proxima);
    irPara(comSobra);
    expect(view.container.querySelector("[data-f66-invalid-remainder]")).not.toBeNull();
    expect(suporte(), "sobra não é formação fechada")
      .not.toContain(formacao(Math.floor(spec.total / comSobra), comSobra));
    view.unmount();
  });

  it("a grade de F66 é superfície de leitura, não um callback morto", () => {
    const { view } = montar(1);
    const grade = view.container.querySelector("[data-array-grid-f66]");
    expect(grade).not.toBeNull();
    // ArrayGrid sem opções não renderiza alvo próprio nenhum; deixá-lo
    // "habilitado" com onAnswer no-op era a forma que o Gate B mediu.
    const alvosDaGrade = grade!.querySelector('[aria-label="Alternativas do arranjo"]');
    expect(alvosDaGrade?.querySelectorAll("button").length ?? 0, "a grade não deve ter alvo próprio em F66").toBe(0);
    // O que a criança opera é o controle de colunas do palco, e ele é vivo.
    expect(grade!.querySelectorAll('[data-f66-control]').length).toBe(2);
  });

  it("a prop disabled continua fechando alternativas e controles", () => {
    const spec = construirFatoresRetangulosF66Spec(1);
    const onAnswer = vi.fn();
    const { container } = render(<FatoresRetangulosStage spec={spec} options={spec.opcoes} onAnswer={onAnswer} disabled />);
    for (const botao of container.querySelectorAll("button")) expect(botao.disabled).toBe(true);
  });
});
