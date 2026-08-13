// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmojiRowRiscarStage } from "../components/primitives/EmojiRowRiscarStage";
import { N3_02 } from "./fichas/jornada/N3.02";
import { construirEmojiRowRiscarQuestion } from "./procedimentos/emojiRowRiscarContract";

describe("gate de alfabetização de troca de modo visual", () => {
  it("N3.02 ensina semanticamente o X antes de permitir gesto ou resposta", () => {
    const q = construirEmojiRowRiscarQuestion(N3_02, 1);
    const primeiro = q.tutorial?.[0]?.show;
    expect(primeiro).toMatchObject({ alfabetizarModo: "riscar" });
    const { container } = render(
      <EmojiRowRiscarStage spec={q.uiProps} mostrar={primeiro} onAnswer={() => {}} />,
    );
    expect(container.querySelector('[data-mode-literacy="riscar"]')).toBeInTheDocument();
    expect(screen.getByText("X = saiu")).toBeInTheDocument();
    expect(container.querySelector('[data-marked="true"]')).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
