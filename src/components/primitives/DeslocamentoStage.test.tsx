// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { DeslocamentoStage } from "./DeslocamentoStage";
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
