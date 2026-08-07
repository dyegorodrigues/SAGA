// @vitest-environment jsdom
import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TouchPlaceStage } from "./TouchPlaceStage";
import { Composer } from "../../curriculum/Composer";
import { N1_13 } from "../../curriculum/fichas/jornada/N1.13";
import { ProducaoSpec } from "../../curriculum/procedimentos/producaoContract";

const spec = (n: number) => Composer.generate(N1_13, n).uiProps as ProducaoSpec;

describe("F04 — uma spec nunca herda a anterior", () => {
  it("trocar de questão devolve todas as vagas da nova spec", () => {
    const a = spec(1);
    const b = spec(2);
    const { container, rerender } = render(<TouchPlaceStage spec={a} />);
    const tray = container.querySelector('[aria-label^="Pegar "]') as HTMLButtonElement;
    const slot = container.querySelector('[aria-label="Vaga vazia"]') as HTMLButtonElement;
    tray.click(); slot.click();
    rerender(<TouchPlaceStage spec={b} />);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]')).toHaveLength(b.alvo);
  });
});
