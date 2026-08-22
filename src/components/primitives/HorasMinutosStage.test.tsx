// @vitest-environment jsdom
import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GM_06 } from "../../curriculum/fichas/jornada/GM.06";
import {
  construirHorasMinutosQuestion,
  construirHorasMinutosSpec,
} from "../../curriculum/procedimentos/horasMinutosContract";
import { HorasMinutosStage } from "./HorasMinutosStage";

describe("HorasMinutosStage — F62 / GM.06", () => {
  it("não serializa o gabarito no enunciado dos níveis de leitura", () => {
    for (let nivel = 1; nivel <= 4; nivel += 1) {
      const spec = construirHorasMinutosSpec(nivel);
      const question = construirHorasMinutosQuestion(GM_06, nivel);

      expect(question.prompt).not.toContain(`${spec.resposta} minutos`);
    }
  });

  it("não resolve nem destaca a duração-alvo antes da tentativa", () => {
    const spec = construirHorasMinutosSpec(5);
    const { container } = render(<HorasMinutosStage spec={spec} onAnswer={vi.fn()} />);
    const timeline = container.querySelector<HTMLElement>("[data-f62-timeline]");

    expect(timeline).not.toBeNull();
    expect(timeline?.textContent).not.toContain("60 min + 15 min = 75 min");
    expect(timeline?.querySelector(".border-dashed")).toBeNull();
  });
});
