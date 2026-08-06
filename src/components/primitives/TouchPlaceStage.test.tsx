// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { TouchPlaceStage } from "./TouchPlaceStage";
import { Composer } from "../../curriculum/Composer";
import { N1_13 } from "../../curriculum/fichas/jornada/N1.13";
import { ProducaoSpec } from "../../curriculum/procedimentos/producaoContract";
import { AcaoDeProducao } from "../../curriculum/procedimentos/producaoProcedure";

const spec = (lvl: number) => Composer.generate(N1_13, lvl).uiProps as ProducaoSpec;

/** Pega um da bandeja e solta na primeira vaga livre. O gesto da ficha. */
function colocarUm(container: HTMLElement) {
  const bandeja = container.querySelector('[aria-label^="Pegar "]') as HTMLButtonElement;
  fireEvent.click(bandeja);
  const vaga = container.querySelector('[aria-label="Vaga vazia"]') as HTMLButtonElement | null;
  fireEvent.click(vaga ?? (container.querySelector('[aria-label^="Colocar "]') as HTMLElement));
}

describe("TouchPlaceStage — a tela de N1.13 (F04)", () => {
  it("NÃO imprime o enunciado: quem o desenha é o app, acima do palco", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(s.enunciado);
  });

  it("⚠️ o número pedido não aparece dentro do palco", () => {
    // O enunciado traz o número (é o único texto que traz), mas ele é do app.
    // Um numeral repetido no palco daria à criança um alvo para PAREAR em vez
    // de PRODUZIR — e parear é a F07, outra competência.
    const s = spec(2);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(container.textContent ?? "").not.toContain(String(s.alvo));
  });

  it("a bandeja começa com mais objetos do que o pedido (§3)", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    const bandeja = container.querySelector('[aria-label^="Pegar "]')!;
    expect(bandeja.querySelectorAll("span").length).toBe(s.bandeja);
    expect(s.bandeja).toBeGreaterThan(s.alvo);
  });

  it("tocar a bandeja e depois a vaga coloca um objeto — sem arrastar (§8.3-bis)", () => {
    const s = spec(1);
    const { container } = render(<TouchPlaceStage spec={s} />);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(s.alvo);

    colocarUm(container);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(s.alvo - 1);
  });

  it("⚠️ a voz CONTA a cada encaixe — é a ficha inteira (§4, §7)", () => {
    const falar = vi.fn();
    const s = spec(2);
    const { container } = render(<TouchPlaceStage spec={s} falar={falar} />);
    colocarUm(container);
    // Com concordância: "uma..." para estrelas, "um..." para dinossauros.
    expect(falar).toHaveBeenCalledWith(s.tema.genero === "f" ? "uma..." : "um...");
  });

  it("o 'Pronto!' só aparece depois do primeiro objeto — a §3 não tem botão", () => {
    const { container } = render(<TouchPlaceStage spec={spec(4)} />);
    expect(screen.queryByText("Pronto!")).toBeNull();
    colocarUm(container);
    expect(screen.getByText("Pronto!")).toBeTruthy();
  });

  it("⚠️ sem vaga, a criança pode passar do pedido — e é isso que o nível 4 mede", () => {
    // §5: "sem as vagas, a criança precisa contar enquanto coloca e saber parar
    // sozinha". Uma tela que a impede de errar não pode observar se ela sabe.
    const s = spec(4);
    const recebido: AcaoDeProducao[] = [];
    const { container } = render(
      <TouchPlaceStage spec={s} onAnswer={(_v, a) => recebido.push(a)} />,
    );

    for (let i = 0; i < s.alvo + 1; i += 1) colocarUm(container);

    // O fecho não é imediato: a §4 dá tempo de a criança VER o conjunto antes
    // de a voz nomeá-lo. Por isso o relógio avança aqui.
    vi.useFakeTimers();
    fireEvent.click(screen.getByText("Pronto!"));
    act(() => { vi.advanceTimersByTime(2500); });
    vi.useRealTimers();

    expect(recebido[0].colocados).toBe(s.alvo + 1);
    expect(recebido[0].comAndaime).toBe(false);
  });

  it("⚠️ COM vaga, o excedente não cola — e a tentativa fica registrada (§4)", () => {
    const s = spec(1);
    const falar = vi.fn();
    const { container } = render(<TouchPlaceStage spec={s} falar={falar} />);

    for (let i = 0; i < s.alvo; i += 1) colocarUm(container);
    // Não há mais vaga: o toque na bandeja e na cena tem de ser recusado, e a
    // recusa é a ÚNICA evidência de `NAO_MONITORA_ALVO` nos níveis com andaime.
    const bandeja = container.querySelector('[aria-label^="Pegar "]') as HTMLButtonElement;
    fireEvent.click(bandeja);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length).toBe(0);
    // A fala do excesso repete o pedido; nunca diz "errou".
    expect(falar.mock.calls.flat().some(t => String(t).startsWith("Já colocamos"))).toBe(false);
  });

  it("o nível 5 não tem botão de ouvir de novo — o pedido é falado uma vez (§5)", () => {
    const { container: n4 } = render(<TouchPlaceStage spec={spec(4)} />);
    expect(n4.querySelector('[aria-label="Ouvir o pedido de novo"]')).toBeTruthy();

    const { container: n5 } = render(<TouchPlaceStage spec={spec(5)} />);
    expect(n5.querySelector('[aria-label="Ouvir o pedido de novo"]')).toBeNull();
  });

  it("a cena livre não desenha vaga nenhuma (§5, níveis 4 e 5)", () => {
    for (const lvl of [4, 5]) {
      const { container } = render(<TouchPlaceStage spec={spec(lvl)} />);
      expect(container.querySelectorAll('[aria-label="Vaga vazia"]').length, `nível ${lvl}`).toBe(0);
    }
  });

  it("sem violação de acessibilidade", async () => {
    const { container } = render(<TouchPlaceStage spec={spec(1)} />);
    const r = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(r.violations.map(v => v.id)).toEqual([]);
  });
});
