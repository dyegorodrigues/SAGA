// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { AreaStage } from "./AreaStage";
import { Composer } from "../../curriculum/Composer";
import { N4_09 } from "../../curriculum/fichas/jornada/N4.09";
import { AreaSpec } from "../../curriculum/procedimentos/areaContract";

const spec = (lvl: number) => Composer.generate(N4_09, lvl).uiProps as AreaSpec;

describe("AreaStage — a tela de N4.09", () => {
  it("mostra a conta com a fala para quem não lê", () => {
    const s = spec(1);
    render(<AreaStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const nivel = (i % 5) + 1;
      const s = spec(nivel);
      const { container, unmount } = render(<AreaStage spec={s} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      const numeros = (`${container.textContent ?? ""} ${rotulos}`.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `nível ${nivel} falou ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("o retângulo some no nível 5 — é o que torna o 5 mais difícil que o 1", () => {
    const um = render(<AreaStage spec={spec(1)} />);
    expect(um.container.querySelector('[role="group"]')).not.toBeNull();
    um.unmount();
    const cinco = render(<AreaStage spec={spec(5)} />);
    expect(cinco.container.querySelector('[role="group"]')).toBeNull();
    cinco.unmount();
  });

  it("a conta armada aparece no nível 3, e sempre em aberto", () => {
    // Uma conta já somada seria o gabarito com cara de andaime (§6.14).
    const dois = render(<AreaStage spec={spec(2)} />);
    expect(dois.container.querySelector('[role="math"]')).toBeNull();
    dois.unmount();

    const tres = render(<AreaStage spec={spec(3)} />);
    const conta = tres.container.querySelector('[role="math"]')!;
    expect(conta).not.toBeNull();
    expect(conta.textContent).toContain("?");
    tres.unmount();
  });

  it("usa a cor da multiplicação do padrão do aplicativo", () => {
    const { container } = render(<AreaStage spec={spec(1)} />);
    const enunciado = container.querySelector("p[aria-label]") as HTMLElement;
    expect(enunciado.style.color.replace(/\s/g, "")).toBe("rgb(126,34,206)");
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<AreaStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});

describe("a micro-aula do corte", () => {
  it("a ficha declara a coreografia, e ela chega ao GameLoop", async () => {
    // O fio `tutShow` é o que faltava nas seis primeiras competências: elas
    // declararam coreografia e ninguém ligou o palco (§6.23). Aqui o teste
    // cobra os dois lados desde o primeiro commit.
    const { hasTutorial, tutorialSteps } = await import("../../utils/tutorials");
    const q = Composer.generate(N4_09, 1);
    expect(hasTutorial(q), "nível 1 sem micro-aula").toBe(true);
    const passos = tutorialSteps(q);
    expect(passos.length).toBeGreaterThanOrEqual(3);
    expect(passos.some(p => (p.show as any)?.cortarRetangulo), "nenhum passo corta").toBe(true);
    expect(passos.some(p => (p.show as any)?.juntarRegioes), "nenhum passo junta").toBe(true);
  });

  it("nenhum passo da aula diz o total", async () => {
    // "Cinquenta e dois" transformaria a aula na resposta. Nomear a REGIÃO é
    // ensinar; nomear a soma é entregar.
    const { tutorialSteps } = await import("../../utils/tutorials");
    const q = Composer.generate(N4_09, 1);
    const s = q.uiProps as AreaSpec;
    const passos = tutorialSteps(q);
    expect(passos.length).toBeGreaterThan(0);
    for (const p of passos) {
      const numeros = (p.say.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `"${p.say}"`).not.toContain(s.resposta);
    }
  });

  it("todas as regiões usam o MESMO quadradinho — senão não é um retângulo", () => {
    // Cada arranjo calculava o próprio lado a partir da largura disponível, e a
    // região de 5 colunas saía com células menores que a de 10: as bordas não
    // encostavam e o retângulo partido virava quatro grades soltas. Só a
    // captura de tela mostrou; nenhum teste media. Ver Padrão Ouro §6.33.
    for (const lvl of [1, 2, 3, 4]) {
      const { container, unmount } = render(<AreaStage spec={spec(lvl)} />);
      const lados = [...container.querySelectorAll<HTMLElement>('[role="img"] > div')]
        .map(el => el.style.width).filter(Boolean);
      expect(lados.length, `nível ${lvl} sem quadradinhos`).toBeGreaterThan(0);
      expect(new Set(lados).size, `nível ${lvl}: lados ${[...new Set(lados)].join(", ")}`).toBe(1);
      unmount();
    }
  });

  it("acender uma região apaga as outras — senão o destaque não destaca nada", () => {
    const s = spec(1);
    const { container } = render(<AreaStage spec={s} mostrar={{ destacarRegiao: 0 }} />);
    const opacidades = [...container.querySelectorAll<HTMLElement>('[role="group"] > div > div > div')]
      .map(el => el.style.opacity).filter(Boolean);
    expect(new Set(opacidades).size, "todas as regiões com a mesma opacidade").toBeGreaterThan(1);
  });

  it("o corte aparece durante a aula mesmo nos níveis em que a criança o faria", () => {
    // É justamente o que se está ensinando: esconder o corte na hora de
    // explicar o corte seria a aula recusando-se a mostrar o assunto.
    const s = spec(2);
    expect(s.corteMarcado).toBe(false);
    const { container } = render(<AreaStage spec={s} mostrar={{ cortarRetangulo: true }} />);
    expect(container.querySelector(".border-dashed")).not.toBeNull();
  });

  it("não apresenta violações de acessibilidade durante a aula", async () => {
    const { container } = render(
      <AreaStage spec={spec(1)} mostrar={{ destacarRegiao: 1 }} onReplay={() => {}} />);
    const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
