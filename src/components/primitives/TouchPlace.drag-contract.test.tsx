// @vitest-environment jsdom
import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TouchPlace } from "./TouchPlace";

const base = {
  tema: {
    id: "espaco" as const,
    emoji: "⭐",
    singular: "estrela",
    plural: "estrelas",
    genero: "f" as const,
    onde: "no céu",
    cenario: "estrelas" as const,
    fundo: "#0F172A",
    borda: "#334155",
    vaga: "#FBBF24",
    chao: undefined,
  },
  ancoras: [{ x: 80, y: 80 }, { x: 160, y: 80 }],
  vagas: "pulsando" as const,
  ocupadas: [] as number[],
  naBandeja: 4,
  capacidade: 4,
  naMao: false,
  onPegar: () => {},
  onCancelar: () => {},
  onColocar: () => {},
};

describe("F04 — contrato motor", () => {
  it("a bandeja oferece Pointer Events para arrasto E continua sendo botão para toque", () => {
    const { container } = render(<TouchPlace {...base} />);
    const tray = container.querySelector('[data-touchplace-tray]') as HTMLButtonElement;
    expect(tray).toBeTruthy();
    expect(tray.tagName).toBe("BUTTON");
    expect(tray.getAttribute("aria-label")).toContain("Pegar");
    expect(tray.className).toContain("touch-none");
  });

  it("a Mão Fantasma usa objeto + mão, sem ocupar vaga real", () => {
    const { container } = render(<TouchPlace {...base} maoFantasma />);
    expect(container.textContent).toContain("👆");
    expect(container.querySelectorAll('[aria-label^="estrela "]')).toHaveLength(0);
    expect(container.querySelectorAll('[aria-label="Vaga vazia"]')).toHaveLength(2);
  });
});
