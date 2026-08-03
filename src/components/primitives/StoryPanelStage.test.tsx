// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { StoryPanelStage } from "./StoryPanelStage";
import { StorySpec } from "../../curriculum/procedimentos/storyBarsContract";

const story = (over: Partial<StorySpec> = {}): StorySpec => ({
  subject: "Lia",
  objectLabel: "estrelas",
  emoji: "⭐",
  beats: [
    { role: "initial", text: "Lia tinha 3 estrelas.", count: 3 },
    { role: "change", text: "Então chegaram mais 4.", count: 4 },
  ],
  question: "Quantas estrelas há ao todo?",
  showChangeIllustration: true,
  ...over,
});

async function violacoesDeAcessibilidade(container: HTMLElement) {
  const resultado = await axe.run(container, {
    runOnly: ["wcag2a", "wcag2aa"],
  });
  return resultado.violations;
}

describe("StoryPanelStage", () => {
  it("narra as duas batidas e faz a pergunta", () => {
    render(<StoryPanelStage story={story()} />);
    expect(screen.getByText("Lia tinha 3 estrelas.")).toBeTruthy();
    expect(screen.getByText("Então chegaram mais 4.")).toBeTruthy();
    expect(screen.getByText("Quantas estrelas há ao todo?")).toBeTruthy();
  });

  it("ilustra a quantidade de cada batida com rótulo acessível", () => {
    render(<StoryPanelStage story={story()} />);
    expect(screen.getByLabelText("3 objetos")).toBeTruthy();
    expect(screen.getByLabelText("4 objetos")).toBeTruthy();
  });

  it("usa singular quando há um só objeto", () => {
    const s = story({
      beats: [
        { role: "initial", text: "Lia tinha 1 estrela.", count: 1 },
        { role: "change", text: "Chegou mais 1.", count: 1 },
      ],
    });
    render(<StoryPanelStage story={s} />);
    expect(screen.getAllByLabelText("1 objeto")).toHaveLength(2);
  });

  it("revela progressivamente: no passo 1 a mudança e a pergunta não aparecem", () => {
    render(<StoryPanelStage story={story()} step={1} />);
    expect(screen.getByText("Lia tinha 3 estrelas.")).toBeTruthy();
    expect(screen.queryByText("Então chegaram mais 4.")).toBeNull();
    expect(screen.queryByText("Quantas estrelas há ao todo?")).toBeNull();
  });

  it("oferece 'ver de novo' apenas quando há ilustração da mudança", () => {
    const comIlustracao = render(<StoryPanelStage story={story()} onReplay={() => {}} />);
    expect(comIlustracao.queryByLabelText("Ver de novo o que aconteceu")).toBeTruthy();
    comIlustracao.unmount();

    // Nível 4 retira a ilustração; não há o que repetir.
    const semIlustracao = render(
      <StoryPanelStage story={story({ showChangeIllustration: false })} onReplay={() => {}} />,
    );
    expect(semIlustracao.queryByLabelText("Ver de novo o que aconteceu")).toBeNull();
  });

  it("o alvo de toque de 'ver de novo' respeita o mínimo infantil", () => {
    render(<StoryPanelStage story={story()} onReplay={() => {}} />);
    const botao = screen.getByLabelText("Ver de novo o que aconteceu") as HTMLElement;
    expect(botao.style.minWidth).toContain("tamanho-alvo");
    expect(botao.style.minHeight).toContain("tamanho-alvo");
  });

  it("continua mostrando as quantidades sob prefers-reduced-motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    render(<StoryPanelStage story={story()} />);
    expect(screen.getByLabelText("3 objetos")).toBeTruthy();
    expect(screen.getByLabelText("4 objetos")).toBeTruthy();
    window.matchMedia = original;
  });

  it("não apresenta violações de acessibilidade WCAG 2 A/AA", async () => {
    const { container } = render(<StoryPanelStage story={story()} onReplay={() => {}} />);
    const violacoes = await violacoesDeAcessibilidade(container);
    expect(violacoes.map(v => `${v.id}: ${v.help}`)).toEqual([]);
  });
});
