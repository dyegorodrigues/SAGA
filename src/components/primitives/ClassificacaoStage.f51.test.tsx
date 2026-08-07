// @vitest-environment jsdom
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClassificacaoStage } from "./ClassificacaoStage";
import { nomeDaPeca } from "./PecaDeAtributo";
import { Composer } from "../../curriculum/Composer";
import { AL_01 } from "../../curriculum/fichas/jornada/AL.01";
import { ClassificacaoSpec } from "../../curriculum/procedimentos/classificacaoContract";
import {
  AcaoDeClassificacao,
  Criterio,
  destinoCerto,
  rotuloDoCriterio,
  satisfaz,
} from "../../curriculum/procedimentos/classificacaoProcedure";

const spec = (nivel: number) => Composer.generate(AL_01, nivel).uiProps as ClassificacaoSpec;

afterEach(() => {
  vi.useRealTimers();
});

function tocarPecaEAlvo(container: HTMLElement, nome: string, alvo: string) {
  const bandeja = container.querySelector('[aria-label="Peças para separar"]');
  if (!bandeja) throw new Error("bandeja não encontrada");
  const peca = [...bandeja.querySelectorAll("button")]
    .find(b => b.getAttribute("aria-label") === nome);
  if (!peca) throw new Error(`peça ${nome} não encontrada na bandeja`);
  fireEvent.click(peca);
  fireEvent.click(screen.getByLabelText(alvo));
}

function classificarTudo(container: HTMLElement, s: ClassificacaoSpec, criterios: Criterio[]) {
  for (const p of s.pecas) {
    const destino = destinoCerto(p, criterios);
    const alvo = destino.length === 0
      ? "Deixar fora dos laços"
      : `Laço: ${rotuloDoCriterio(criterios[destino[0]])}`;
    tocarPecaEAlvo(container, nomeDaPeca(p), alvo);
  }
}

describe("F51 — regressões que o print encontrou", () => {
  it("nível 3 classifica as MESMAS peças duas vezes, com critério realmente mudado", () => {
    vi.useFakeTimers();
    const s = spec(3);
    const anterior = s.criterioAnterior!;
    const atual = s.lacos[0].criterio;
    const onAnswer = vi.fn();
    const { container } = render(<ClassificacaoStage spec={s} onAnswer={onAnswer} />);

    expect(anterior).toBeTruthy();
    expect(anterior.atributo).not.toBe(atual.atributo);
    expect(screen.getByText("Primeiro jeito")).toBeTruthy();
    expect(screen.getByLabelText(`Laço: ${rotuloDoCriterio(anterior)}`)).toBeTruthy();

    const idsDaPrimeira = [...container.querySelectorAll('[data-peca-id]')]
      .map(el => Number(el.getAttribute("data-peca-id")));

    classificarTudo(container, s, [anterior]);

    // Terminar a primeira classificação NÃO é responder a questão.
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByText("Agora mudou!")).toBeTruthy();
    expect(screen.getByLabelText(`Laço: ${s.lacos[0].rotulo}`)).toBeTruthy();

    // As peças voltaram ao centro — e são literalmente as mesmas IDs.
    const idsDaSegunda = [...container.querySelectorAll('[data-peca-id]')]
      .map(el => Number(el.getAttribute("data-peca-id")));
    expect(idsDaSegunda).toEqual(idsDaPrimeira);

    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.getByText("Outro jeito")).toBeTruthy();

    classificarTudo(container, s, [atual]);

    expect(onAnswer).toHaveBeenCalledTimes(1);
    const acao = onAnswer.mock.calls[0][1] as AcaoDeClassificacao;
    expect(acao.criterioAnterior).toEqual(anterior);
    expect(acao.criterios).toEqual([atual]);
  });

  it("o critério anterior do nível 3 sempre separa algo — nunca tudo dentro ou tudo fora", () => {
    for (let i = 0; i < 80; i += 1) {
      const s = spec(3);
      const anterior = s.criterioAnterior!;
      const atual = s.lacos[0].criterio;
      const quantasDentro = s.pecas.filter(p => satisfaz(p, anterior)).length;

      expect(anterior.atributo, `amostra ${i}`).not.toBe(atual.atributo);
      expect(quantasDentro, `amostra ${i}: nenhuma dentro`).toBeGreaterThan(0);
      expect(quantasDentro, `amostra ${i}: todas dentro`).toBeLessThan(s.pecas.length);
    }
  });

  it("a Mão Fantasma corrige o índice editorial: DENTRO sempre demonstra uma peça que pertence", () => {
    const s = spec(1);
    const criterios = s.lacos.map(l => l.criterio);
    const indiceErrado = s.pecas.find(p => destinoCerto(p, criterios).length === 0)!.id;
    const { container } = render(
      <ClassificacaoStage spec={s} mostrar={{ moverParaDentro: indiceErrado }} />,
    );

    const demo = container.querySelector('[data-mao-fantasma="dentro"]');
    expect(demo).toBeTruthy();
    const id = Number(demo!.getAttribute("data-peca-id"));
    const p = s.pecas.find(x => x.id === id)!;
    expect(destinoCerto(p, criterios).length).toBeGreaterThan(0);
    expect(demo!.textContent).toContain("👆");
  });

  it("a Mão Fantasma corrige o índice editorial: FORA jamais ensina a expulsar uma peça que pertence", () => {
    const s = spec(1);
    const criterios = s.lacos.map(l => l.criterio);
    const indiceErrado = s.pecas.find(p => destinoCerto(p, criterios).length > 0)!.id;
    const { container } = render(
      <ClassificacaoStage spec={s} mostrar={{ deixarFora: indiceErrado }} />,
    );

    const demo = container.querySelector('[data-mao-fantasma="fora"]');
    expect(demo).toBeTruthy();
    const id = Number(demo!.getAttribute("data-peca-id"));
    const p = s.pecas.find(x => x.id === id)!;
    expect(destinoCerto(p, criterios)).toEqual([]);
    expect(demo!.textContent).toContain("👇");
  });

  it("nível 5 não depende só de ler palavras: cada alternativa tem pista visual do critério", () => {
    const s = spec(5);
    const { container } = render(<ClassificacaoStage spec={s} />);
    expect(container.querySelectorAll('[data-criterio-visual]').length)
      .toBeGreaterThanOrEqual(s.alternativas?.length ?? 0);
  });

  it("trocar a spec limpa estado local; uma questão nova nunca herda a anterior", () => {
    const a = spec(1);
    const b = spec(1);
    const criterios = a.lacos.map(l => l.criterio);
    const primeira = a.pecas[0];
    const destino = destinoCerto(primeira, criterios);
    const { container, rerender } = render(<ClassificacaoStage spec={a} />);

    tocarPecaEAlvo(
      container,
      nomeDaPeca(primeira),
      destino.length === 0 ? "Deixar fora dos laços" : `Laço: ${a.lacos[destino[0]].rotulo}`,
    );
    expect(container.querySelectorAll('[data-peca-id]').length).toBe(a.pecas.length - 1);

    rerender(<ClassificacaoStage spec={b} />);
    expect(container.querySelectorAll('[data-peca-id]').length).toBe(b.pecas.length);
  });
});
