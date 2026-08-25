// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PartesIguaisStage } from "./PartesIguaisStage";
import { FracaoNumeroStage } from "./FracaoNumeroStage";
import { construirPartesIguaisSpec } from "../../curriculum/procedimentos/partesIguaisContract";
import { construirFracaoNumeroSpec } from "../../curriculum/procedimentos/fracaoNumeroContract";

// A barra de Singapura carrega o rótulo tanto no texto quanto no aria-label:
// uma criança que ouve a tela não pode receber a resposta pelo áudio.
const suporte = (raiz: HTMLElement) => {
  const copia = raiz.cloneNode(true) as HTMLElement;
  for (const botao of [...copia.querySelectorAll("button")]) botao.remove();
  const rotulos = [...copia.querySelectorAll("[aria-label]")].map(el => el.getAttribute("aria-label") ?? "");
  return [copia.textContent ?? "", ...rotulos].join(" ").replace(/\s+/g, " ");
};

describe("CLASS-009 — N5.01/F45 e N5.02/F72 não escrevem a fração que perguntam", () => {
  it("F45 não pinta na barra o nome nem o símbolo que o enunciado pede", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirPartesIguaisSpec(nivel);
      const { container, unmount } = render(<PartesIguaisStage spec={spec} onAnswer={() => undefined} />);
      expect(suporte(container).includes(spec.resposta), `L${nivel} (${spec.modo}) escreveu "${spec.resposta}"`).toBe(false);
      unmount();
    }
  });

  it("F72 não pinta na barra a fração que o enunciado pede", () => {
    for (let nivel = 1; nivel <= 5; nivel += 1) {
      const spec = construirFracaoNumeroSpec(nivel);
      // Nos modos de reta o enunciado dá a fração e pede o lugar: ali o valor
      // é a pergunta, não o gabarito.
      if (spec.modo !== "barra" && spec.modo !== "colecao") continue;
      const { container, unmount } = render(<FracaoNumeroStage spec={spec} onAnswer={() => undefined} />);
      expect(suporte(container).includes(spec.resposta), `L${nivel} (${spec.modo}) escreveu "${spec.resposta}"`).toBe(false);
      unmount();
    }
  });
});
