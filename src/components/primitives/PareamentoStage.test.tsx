// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { PareamentoStage } from "./PareamentoStage";
import { Composer } from "../../curriculum/Composer";
import { N1_01 } from "../../curriculum/fichas/jornada/N1.01";
import { PareamentoSpec, TEMAS, construirPareamentoSpec } from "../../curriculum/procedimentos/pareamentoContract";

const spec = (lvl: number) => Composer.generate(N1_01, lvl).uiProps as PareamentoSpec;

describe("PareamentoStage — a tela de N1.01", () => {
  it("⚠️ nenhum numeral na tela, em 40 amostras dos cinco níveis", () => {
    // A regra dura da F07. Se aparecer número, virou N1.04 (contar).
    for (let i = 0; i < 40; i += 1) {
      const nivel = (i % 5) + 1;
      const { container, unmount } = render(<PareamentoStage spec={spec(nivel)} />);
      const rotulos = [...container.querySelectorAll("[aria-label]")]
        .map(el => el.getAttribute("aria-label") ?? "").join(" ");
      expect(`${container.textContent ?? ""} ${rotulos}`, `nível ${nivel}`).not.toMatch(/\d/);
      unmount();
    }
  });

  it("mostra o enunciado com a fala para quem não lê", () => {
    const s = spec(1);
    render(<PareamentoStage spec={s} />);
    expect(screen.getByLabelText(s.falado)).toBeTruthy();
  });

  it("um toque coloca UM; o segundo toque devolve — nunca empilha", () => {
    // É a regra "um e só um" impressa na interação, não só na fala.
    const s = spec(2);
    const { container } = render(<PareamentoStage spec={s} />);
    const primeiro = container.querySelectorAll("button")[0];
    fireEvent.click(primeiro);
    expect(primeiro.getAttribute("aria-label")).toBe("Este já tem");
    fireEvent.click(primeiro);
    expect(primeiro.getAttribute("aria-label")).toBe("Este ainda está sem");
  });

  it("a bandeja esvazia conforme a criança distribui", () => {
    const s = spec(2);
    const { container } = render(<PareamentoStage spec={s} />);
    const antes = container.querySelectorAll('[aria-label^="Ainda na bandeja"] span').length;
    fireEvent.click(container.querySelectorAll("button")[0]);
    const depois = container.querySelectorAll('[aria-label^="Ainda na bandeja"] span').length;
    expect(depois).toBe(antes - 1);
  });

  it("a bandeja vazia se explica em vez de virar moldura vazia (§6.6)", () => {
    // Cena de FALTA: dois itens para três receptores. Distribuir os dois esvazia
    // a bandeja — no nível 2 sobra uma peça e ela nunca esvaziaria.
    const s = construirPareamentoSpec({ receptores: 3, itens: 2 }, 3, TEMAS[0]);
    const { container } = render(<PareamentoStage spec={s} />);
    [...container.querySelectorAll("button")].forEach(b => fireEvent.click(b));
    expect(container.textContent).toContain("Acabou!");
  });

  it("não apresenta violações de acessibilidade nos cinco níveis", async () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<PareamentoStage spec={spec(lvl)} />);
      const { violations } = await axe.run(container, { runOnly: ["wcag2a", "wcag2aa"] });
      expect(violations.map(v => `L${lvl} ${v.id}: ${v.help}`)).toEqual([]);
      unmount();
    }
  });
});

describe("a pergunta é o coração da ficha", () => {
  it("o nível 1 já pergunta, depois de distribuir", () => {
    // A pergunta final é o coração da ficha; ela não some no primeiro nível.
    const { container } = render(<PareamentoStage spec={spec(1)} />);
    expect(container.textContent).not.toContain("sobrou");
    [...container.querySelectorAll("button")].forEach(b => fireEvent.click(b));
    expect(container.textContent).toContain("sobrou");
  });

  it("no nível 2 ela aparece DEPOIS de distribuir, e não antes", () => {
    const s = spec(2);
    const { container } = render(<PareamentoStage spec={s} />);
    expect(container.textContent).not.toContain("sobrou");
    [...container.querySelectorAll("button")].forEach(b => fireEvent.click(b));
    expect(container.textContent).toContain("sobrou");
  });

  it("no nível 5 ela vem ANTES, e as peças ficam travadas até responder", () => {
    // O salto conceitual: prever sem distribuir. Deixar mexer antes tornaria a
    // previsão desnecessária — bastaria fazer e olhar.
    const s = spec(5);
    const { container } = render(<PareamentoStage spec={s} />);
    expect(container.textContent).toContain("para todos");
    const receptor = container.querySelector('[aria-label="Este ainda está sem"]') as HTMLButtonElement;
    fireEvent.click(receptor);
    expect(receptor.getAttribute("aria-label")).toBe("Este ainda está sem");
  });

  it("a pergunta nunca é 'quantos'", () => {
    for (const lvl of [1, 2, 3, 4, 5]) {
      const { container, unmount } = render(<PareamentoStage spec={spec(lvl)} />);
      expect((container.textContent ?? "").toLowerCase()).not.toContain("quantos");
      unmount();
    }
  });
});

describe("o diagnóstico sai da AÇÃO, não da alternativa", () => {
  it("a resposta leva junto o que a criança fez com as peças", () => {
    const s = spec(2);
    const onAnswer = vi.fn();
    const { container } = render(<PareamentoStage spec={s} onAnswer={onAnswer} />);
    [...container.querySelectorAll("button")].forEach(b => fireEvent.click(b));
    fireEvent.click(screen.getByText("Sobrou"));

    expect(onAnswer).toHaveBeenCalledTimes(1);
    const [valor, acao] = onAnswer.mock.calls[0];
    expect(valor).toBe("sobra");
    expect(acao.porReceptor).toHaveLength(s.receptores.quantidade);
    expect(acao.respostaDaPergunta).toBe("sobra");
  });
});

describe("a micro-aula da ficha F07 §8", () => {
  it("a ficha declara a coreografia e ela chega ao GameLoop", async () => {
    const { hasTutorial, tutorialSteps } = await import("../../utils/tutorials");
    const q = Composer.generate(N1_01, 1);
    expect(hasTutorial(q), "nível 1 sem micro-aula").toBe(true);
    const passos = tutorialSteps(q);
    expect(passos.some(p => (p.show as any)?.destacarFileira === "receptores")).toBe(true);
    expect(passos.some(p => (p.show as any)?.destacarFileira === "itens")).toBe(true);
    expect(passos.some(p => (p.show as any)?.maoFantasma)).toBe(true);
    expect(passos.some(p => (p.show as any)?.pulsar)).toBe(true);
  });

  it("nenhuma fala da aula contém numeral", async () => {
    const { tutorialSteps } = await import("../../utils/tutorials");
    const passos = tutorialSteps(Composer.generate(N1_01, 1));
    expect(passos.length).toBeGreaterThan(0);
    for (const p of passos) expect(p.say).not.toMatch(/\d/);
  });

  it("destacar uma fileira apaga a outra — senão o destaque não destaca", () => {
    const s = spec(1);
    const { container } = render(
      <PareamentoStage spec={s} mostrar={{ destacarFileira: "receptores" }} />);
    const opacidades = [...container.querySelectorAll<HTMLElement>('[role="group"]')]
      .map(el => el.style.opacity);
    expect(new Set(opacidades).size).toBeGreaterThan(1);
  });
});
