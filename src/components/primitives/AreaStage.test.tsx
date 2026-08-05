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
      // Lido nó a nó, não no texto grudado: concatenar "11" e "10" de elementos
      // vizinhos fabricava um "110" que não existe em lugar nenhum da tela, e o
      // teste acusava um vazamento inventado por ele mesmo.
      const pedacos: string[] = [];
      const anda = (n: Node) => {
        if (n.nodeType === 3) pedacos.push(n.textContent ?? "");
        else n.childNodes.forEach(anda);
      };
      anda(container);
      pedacos.push(...[...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? ""));
      const numeros = pedacos.flatMap(t => (t.match(/\d+/g) ?? []).map(Number));
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
    // Selecionado pelo rótulo, não pelo papel: a linha da abertura ("15 = 10 + 5")
    // também é `role="math"`, e um seletor por papel pegaria a errada.
    const armada = '[aria-label^="Conta armada"]';
    const dois = render(<AreaStage spec={spec(2)} />);
    expect(dois.container.querySelector(armada)).toBeNull();
    dois.unmount();

    const tres = render(<AreaStage spec={spec(3)} />);
    const conta = tres.container.querySelector(armada)!;
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
    // A aula do nível 1 ALFABETIZA no desenho antes de cobrar a conta: aponta a
    // medida de cima, aponta a da lateral, e só então fala das regiões. A
    // convenção dos eixos é combinação, não descoberta (§6.36).
    expect(passos.some(p => (p.show as any)?.destacarMedida === "cima"), "não aponta a medida de cima").toBe(true);
    expect(passos.some(p => (p.show as any)?.destacarMedida === "lado"), "não aponta a medida da lateral").toBe(true);
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

  it("cada região traz a conta que a gera escrita dentro dela", () => {
    // A versão anterior mostrava só o resultado embaixo da região: saíam "20" e
    // "10" soltos, e um adulto perguntou o que aquilo tinha a ver com 15 × 2.
    // Tinha tudo — eram 10 × 2 e 5 × 2 — mas a tela não dizia. Ver §6.34.
    for (const lvl of [1, 2, 3, 4]) {
      const s = spec(lvl);
      const { container, unmount } = render(<AreaStage spec={s} />);
      const texto = container.textContent ?? "";
      for (const r of s.regioes) {
        expect(texto, `nível ${lvl}: falta "${r.colunas} × ${r.linhas}"`)
          .toContain(`${r.colunas} × ${r.linhas}`);
      }
      unmount();
    }
  });

  it("as regiões são PROPORCIONAIS: a das dezenas é maior que a das unidades", () => {
    // É a proporção que ensina. Duas regiões do mesmo tamanho diriam que 10 e 5
    // valem igual, que é o oposto do que a ficha existe para mostrar.
    const s = spec(1);
    const { container } = render(<AreaStage spec={s} />);
    const caixas = [...container.querySelectorAll<HTMLElement>('[role="group"] div[style*="width"]')]
      .filter(el => el.style.background)
      .map(el => parseFloat(el.style.width));
    expect(caixas.length).toBeGreaterThanOrEqual(2);
    // A primeira coluna é a das dezenas; tem de ser a mais larga.
    expect(caixas[0]).toBeGreaterThan(caixas[1]);
  });

  it("as duas colunas do retângulo têm cores diferentes", () => {
    // Duas regiões da mesma cor coladas lêem como um bloco só, e a partição —
    // o assunto inteiro — some. É o §6.17, que eu já tinha escrito e repeti.
    const { container } = render(<AreaStage spec={spec(1)} />);
    const fundos = [...container.querySelectorAll<HTMLElement>('[role="group"] div[style*="background"]')]
      .map(el => el.style.background).filter(Boolean);
    expect(new Set(fundos).size).toBeGreaterThan(1);
  });

  it("acender uma região apaga as outras — senão o destaque não destaca nada", () => {
    const s = spec(1);
    const { container } = render(<AreaStage spec={s} mostrar={{ destacarRegiao: 0 }} />);
    const opacidades = [...container.querySelectorAll<HTMLElement>('[role="group"] [style*="opacity"]')]
      .map(el => el.style.opacity).filter(Boolean);
    expect(new Set(opacidades).size, "todas as regiões com a mesma opacidade").toBeGreaterThan(1);
  });

  it("o corte aparece durante a aula mesmo nos níveis em que a criança o faria", () => {
    // É justamente o que se está ensinando: esconder o corte na hora de
    // explicar o corte seria a aula recusando-se a mostrar o assunto.
    const s = spec(2);
    expect(s.corteMarcado).toBe(false);
    const { container } = render(<AreaStage spec={s} mostrar={{ cortarRetangulo: true }} />);
    const tracejadas = [...container.querySelectorAll<HTMLElement>('[role="group"] [style*="border"]')]
      .filter(el => el.style.border.includes("dashed"));
    expect(tracejadas.length, "nenhuma divisa tracejada durante a aula").toBeGreaterThan(0);
  });

  it("não apresenta violações de acessibilidade durante a aula", async () => {
    const { container } = render(
      <AreaStage spec={spec(1)} mostrar={{ destacarRegiao: 1 }} onReplay={() => {}} />);
    const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
