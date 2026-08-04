// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { TabuadaStage } from "./TabuadaStage";
import { Composer } from "../../curriculum/Composer";
import { N4_03 } from "../../curriculum/fichas/jornada/N4.03";
import { TabuadaSpec } from "../../curriculum/procedimentos/tabuadaContract";

const gerar = (lvl: number) => Composer.generate(N4_03, lvl);
const spec = (lvl: number) => gerar(lvl).uiProps as TabuadaSpec;

describe("TabuadaStage — a tela de N4.03", () => {
  it("mostra o enunciado com a fala para quem não lê", () => {
    const s = spec(1);
    render(<TabuadaStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("o arranjo anuncia a forma, não o total", () => {
    const s = spec(1);
    const { container } = render(<TabuadaStage spec={s} />);
    const arranjo = container.querySelector('[role="img"]');
    expect(arranjo?.getAttribute("aria-label")).toBe(s.arranjo!.descricao);
    // "4 fileiras de 5" descreve a forma. Dizer "20 quadradinhos" entregaria a
    // resposta ao leitor de tela — e a criança não-leitora ouve exatamente isto.
    expect(arranjo?.getAttribute("aria-label")).not.toContain(String(s.resposta));
  });

  it("o apoio visual troca e depois some, exatamente como a ficha manda", () => {
    // Nível 1: arranjo + saltos, sem quadro.
    const um = render(<TabuadaStage spec={spec(1)} />);
    expect(um.container.querySelector('[role="img"]'), "faltou o arranjo").not.toBeNull();
    expect(um.getByLabelText(/saltos de/), "faltaram os saltos").toBeTruthy();
    expect(um.container.querySelector('[aria-label^="Quadro de cem"]')).toBeNull();
    um.unmount();

    // Nível 3: arranjo + quadro, sem saltos.
    const tres = render(<TabuadaStage spec={spec(3)} />);
    expect(tres.container.querySelector('[role="img"]')).not.toBeNull();
    expect(tres.container.querySelector('[aria-label*="saltos"]')).toBeNull();
    expect(tres.container.querySelector('[aria-label^="Quadro de cem"]')).not.toBeNull();
    tres.unmount();

    // Nível 4: só símbolo. Sobra o enunciado e nada mais.
    const quatro = render(<TabuadaStage spec={spec(4)} />);
    expect(quatro.container.querySelector('[role="img"]')).toBeNull();
    expect(quatro.container.querySelector('[aria-label^="Quadro de cem"]')).toBeNull();
    expect(quatro.container.textContent?.replace(/\s/g, "")).toMatch(/^\d+×\d+$/);
    quatro.unmount();
  });

  it("o botão de ouvir de novo existe e se identifica", () => {
    render(<TabuadaStage spec={spec(2)} onReplay={() => {}} />);
    expect(screen.getByLabelText("Ouvir a conta de novo")).toBeTruthy();
  });

  it("a tela nunca fala o número que a pergunta pede, em 40 amostras", () => {
    for (let i = 0; i < 40; i += 1) {
      const lvl = (i % 5) + 1;
      const s = spec(lvl);
      const { container, unmount } = render(<TabuadaStage spec={s} />);

      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      // O quadro de 100 tem os números 1..100 desenhados, e a resposta está
      // entre eles de propósito — o padrão só se vê inteiro. O que não pode é a
      // resposta aparecer no ENUNCIADO ou no rótulo do arranjo.
      const enunciado = `${s.pergunta} ${s.falado} ${s.arranjo?.descricao ?? ""} ${rotulos.replace(/Quadro de cem[^"]*/, "")}`;
      const numeros = (enunciado.match(/\d+/g) ?? []).map(Number);

      expect(numeros, `nível ${lvl} falou a resposta ${s.resposta}`).not.toContain(s.resposta);
      unmount();
    }
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<TabuadaStage spec={spec(lvl)} onReplay={() => {}} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});
