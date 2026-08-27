// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VolumeVistasStage } from "../components/primitives/VolumeVistasStage";
import { construirVolumeVistasSpec } from "./procedimentos/volumeVistasContract";

describe("W41/F92 — palco ArrayGrid#3D e acessibilidade motora", () => {
  it("alfabetiza o mode swap 3D e realiza as três projeções com ArrayGrid físico", () => {
    const { container } = render(<VolumeVistasStage spec={construirVolumeVistasSpec(1)} onAnswer={vi.fn()} />);

    expect(container.querySelector('[data-mode-literacy="arraygrid-3d"]')).toBeInTheDocument();
    expect(container.querySelector('[data-f92-3d]')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-arraygrid-projection="true"]')).toHaveLength(3);

    for (const name of ["Frente", "Lado", "Cima", "Vista A", "Vista B", "Vista C"]) {
      const button = screen.getByRole("button", { name });
      expect(button.className).toMatch(/min-h-20/);
    }
  });

  it("reconstrói por toque sem depender de arrasto e emite evidência conceitual própria", () => {
    const onAnswer = vi.fn();
    const spec = construirVolumeVistasSpec(3);
    render(<VolumeVistasStage spec={spec} onAnswer={onAnswer} />);

    // A construção é sorteada desde a CLASS-003: os toques saem dela, não de um
    // roteiro fixo. Cada toque numa posição acrescenta um cubo, e o rótulo do
    // botão diz quantos já estão lá.
    spec.alturas.forEach((linha, r) => linha.forEach((altura, c) => {
      for (let cubo = 0; cubo < altura; cubo += 1) {
        fireEvent.click(screen.getByRole("button", { name: `posição ${r + 1}, ${c + 1}: ${cubo} cubos` }));
      }
    }));
    fireEvent.click(screen.getByRole("button", { name: "Conferir reconstrução" }));

    expect(onAnswer).toHaveBeenCalledWith(spec.resposta, {
      evidencias: ["reconstrucao-f92"],
      source: "array-grid",
    });
  });
});
