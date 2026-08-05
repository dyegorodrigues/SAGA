// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { DeslocamentoStage } from "./DeslocamentoStage";
import { FAIXA, PLACA, placasDoCubao } from "./PromocaoDeOrdem";
import { Composer } from "../../curriculum/Composer";
import { N4_08 } from "../../curriculum/fichas/jornada/N4.08";
import { DeslocamentoSpec } from "../../curriculum/procedimentos/deslocamentoContract";

const spec = (lvl: number) => Composer.generate(N4_08, lvl).uiProps as DeslocamentoSpec;

describe("DeslocamentoStage — a tela de N4.08", () => {
  it("mostra a conta com a fala para quem não lê", () => {
    const s = spec(1);
    render(<DeslocamentoStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("o material se identifica como o de PARTIDA", () => {
    const s = spec(1);
    const { container } = render(<DeslocamentoStage spec={s} />);
    const rotulo = container.querySelector('[role="img"]')?.getAttribute("aria-label") ?? "";
    expect(rotulo).toContain("Material de partida");
    expect((rotulo.match(/\d+/g) ?? []).map(Number)).not.toContain(s.resposta);
  });

  it("o material some no nível 3 — é o que torna o 3 mais difícil que o 1", () => {
    const um = render(<DeslocamentoStage spec={spec(1)} />);
    expect(um.container.querySelector('[role="img"]')).not.toBeNull();
    um.unmount();
    const tres = render(<DeslocamentoStage spec={spec(3)} />);
    expect(tres.container.querySelector('[role="img"]')).toBeNull();
    tres.unmount();
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const s = spec((i % 5) + 1);
      const { container, unmount } = render(<DeslocamentoStage spec={s} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      const numeros = (`${container.textContent ?? ""} ${rotulos}`.match(/\d+/g) ?? []).map(Number);
      expect(numeros, `nível ${(i % 5) + 1} falou ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("usa a cor da multiplicação do padrão do aplicativo", () => {
    const { container } = render(<DeslocamentoStage spec={spec(1)} />);
    const enunciado = container.querySelector("p[aria-label]") as HTMLElement;
    // #7E22CE em rgb
    expect(enunciado.style.color.replace(/\s/g, "")).toBe("rgb(126,34,206)");
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<DeslocamentoStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});

describe("a micro-aula da promoção", () => {
  it("durante a aula, a demonstração substitui o material", () => {
    // Duas coisas ao mesmo tempo dividiriam a atenção justamente no momento em
    // que a criança precisa olhar para uma.
    const s = spec(1);
    const { container } = render(
      <DeslocamentoStage spec={s} mostrar={{ promoverOrdens: true }} />);
    expect(container.querySelector('[aria-label^="Material de partida"]')).toBeNull();
    expect(container.querySelector('[aria-label^="Demonstração"]')).not.toBeNull();
  });

  it("cada peça aparece UMA vez, na casa dela", () => {
    // A primeira versão mostrava cubinho→barra e barra→placa lado a lado, e a
    // barra aparecia duas vezes: resultado de um passo e origem do outro. O olho
    // lia "duas barras" sem entender por quê. Ver Padrão Ouro §6.25.
    const { container } = render(
      <DeslocamentoStage spec={spec(1)} mostrar={{ promoverOrdens: true }} />);
    const demo = container.querySelector('[aria-label^="Demonstração"]')!;
    const texto = demo.textContent ?? "";
    expect((texto.match(/UNIDADE/g) ?? []).length).toBe(1);
    expect((texto.match(/DEZENA/g) ?? []).length).toBe(1);
    expect((texto.match(/CENTENA/g) ?? []).length).toBe(1);
  });

  it("o ×100 desenha DIFERENTE do ×10 — dois degraus, não um", async () => {
    // A versão anterior ignorava quantas ordens sobem: o nível 2 mostrava a
    // mesma figura do nível 1 com outro texto por baixo.
    const dez = render(<DeslocamentoStage spec={spec(1)} mostrar={{ promoverOrdens: true }} />);
    const rotuloDez = dez.container.querySelector('[aria-label^="Demonstração"]')
      ?.getAttribute("aria-label") ?? "";
    dez.unmount();

    const cem = render(<DeslocamentoStage spec={spec(2)} mostrar={{ promoverOrdens: true }} />);
    const rotuloCem = cem.container.querySelector('[aria-label^="Demonstração"]')
      ?.getAttribute("aria-label") ?? "";
    cem.unmount();

    expect(rotuloDez).toContain("uma casa");
    expect(rotuloCem).toContain("duas casas");
    // Os dois nomeiam a peça E a casa: só casa é abstrato para quem ouve, só
    // peça perde o "para onde", que é o conceito.
    for (const r of [rotuloDez, rotuloCem]) {
      expect(r).toContain("cubinho");
      expect(r).toMatch(/unidade|dezena|centena/);
    }
    // O ×100 precisa dizer que uma casa fica de fora do caminho — é isso que
    // distingue "sobe duas" de "sobe uma, duas vezes". Antes o texto dizia
    // "pulando a dezena", verdade só para o cubinho: a barra pula a CENTENA.
    expect(rotuloCem).toContain("pulando uma casa");
    expect(rotuloDez).not.toContain("pulando");
    expect(rotuloDez).not.toBe(rotuloCem);
  });

  it("nenhuma placa do cubão vaza da caixa dele", () => {
    // O rótulo MILHAR saiu impresso POR CIMA da peça: a caixa tinha a altura de
    // uma placa e as três empilhadas ocupavam mais. Nenhum teste pegou porque o
    // jsdom não faz layout — só a captura de tela mostrou. A geometria virou
    // função justamente para esta conta existir. Ver Padrão Ouro §6.28.
    for (const { left, top } of placasDoCubao()) {
      expect(left + PLACA, "vaza pela direita").toBeLessThanOrEqual(FAIXA);
      expect(top + PLACA, "vaza por baixo").toBeLessThanOrEqual(FAIXA);
      expect(Math.min(left, top), "vaza por cima ou pela esquerda").toBeGreaterThanOrEqual(0);
    }
  });

  it("a demonstração explica a promoção sem citar número algum", () => {
    // Promover as vinte e nove peças mostraria o RESULTADO. Uma peça ensina a
    // regra e deixa a aplicação para a criança.
    const s = spec(1);
    const { container } = render(
      <DeslocamentoStage spec={s} mostrar={{ promoverOrdens: true }} />);
    const rotulo = container.querySelector('[aria-label^="Demonstração"]')
      ?.getAttribute("aria-label") ?? "";
    expect(rotulo).toContain("cubinho");
    expect(rotulo).not.toMatch(/\d/);
    expect((container.textContent ?? "").match(/\d+/g) ?? []).not.toContain(String(s.resposta));
  });

  it("sem aula em curso, a tela volta ao material normal", () => {
    const s = spec(1);
    const { container } = render(<DeslocamentoStage spec={s} mostrar={null} />);
    expect(container.querySelector('[aria-label^="Material de partida"]')).not.toBeNull();
    expect(container.querySelector('[aria-label^="Demonstração"]')).toBeNull();
  });

  it("a ficha declara a coreografia, e ela chega ao GameLoop", async () => {
    const { N4_08 } = await import("../../curriculum/fichas/jornada/N4.08");
    const { hasTutorial, tutorialSteps } = await import("../../utils/tutorials");
    const q = Composer.generate(N4_08, 1);
    expect(hasTutorial(q), "nível 1 sem micro-aula").toBe(true);
    const passos = tutorialSteps(q);
    expect(passos.length).toBeGreaterThanOrEqual(3);
    expect(passos.some(p => (p.show as any)?.promoverOrdens), "nenhum passo promove").toBe(true);
    for (const p of passos) expect(p.say).not.toMatch(/\d/);
  });

  it("não apresenta violações de acessibilidade durante a aula", async () => {
    const { container } = render(
      <DeslocamentoStage spec={spec(1)} mostrar={{ promoverOrdens: true }} onReplay={() => {}} />);
    const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
    expect(violations.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
