// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { DojoTrackState, Progress } from "../../types";
import { DojoTab } from "./DojoTab";

vi.mock("../Mascot", () => ({
  C: { card: "#fff", line: "#ddd", ink: "#111" },
  FONT: "sans-serif",
  sfx: { tick: vi.fn(), level: vi.fn() },
}));

const P = (lvl: number, maxLvl = lvl, extras: Partial<Progress> = {}): Progress => ({
  lvl,
  maxLvl,
  streak: 0,
  bad: 0,
  stars: 0,
  ok: 0,
  tot: 0,
  bank: [],
  mast: 0,
  ...extras,
});

function renderGarden(
  prog: Record<string, Progress> = {},
  dojoTracks: Record<string, DojoTrackState> = {},
  onGardenTrack = vi.fn(),
) {
  render(
    <DojoTab
      prog={prog}
      dojoTracks={dojoTracks}
      onGardenTrack={onGardenTrack}
      onMixed={vi.fn()}
      onOpenPicker={vi.fn()}
    />,
  );
  return onGardenTrack;
}

describe("P8 — DojoTab consome o Jardim real", () => {
  it("mostra exatamente as quatro trilhas JD implementadas, não a lista CRA da Jornada", () => {
    renderGarden();
    expect(screen.getByText("Olhômetro Relâmpago")).toBeTruthy();
    expect(screen.getByText("Mão Relâmpago")).toBeTruthy();
    expect(screen.getByText("Moldura Relâmpago")).toBeTruthy();
    expect(screen.getByText("Ver e Imaginar")).toBeTruthy();
    expect(screen.queryByText(/Treinos Específicos \(CRA\)/)).toBeNull();
    expect(screen.queryByText(/Alfabetização e Quantificação/)).toBeNull();
  });

  it("estrela e unlocked salvo não furam o nível 3 da competência-mãe", () => {
    renderGarden(
      { "N1.03": P(2, 2, { stars: 999 }) },
      {
        JD1: {
          unlocked: true,
          mastered: false,
          family: "JD",
          currentStep: 4,
          highestStep: 4,
        },
      },
    );
    const locked = screen.getByRole("button", { name: /Olhômetro Relâmpago, bloqueado/ });
    expect((locked as HTMLButtonElement).disabled).toBe(true);
  });

  it("maxLvl 3 abre a trilha e clicar inicia o degrau salvo, sem seletor manual", () => {
    const onGardenTrack = renderGarden(
      { "N1.03": P(1, 3) },
      {
        JD1: {
          unlocked: false,
          mastered: false,
          family: "JD",
          currentStep: 4,
          highestStep: 5,
          rounds: 7,
          attempts: 56,
          correct: 47,
        },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /Olhômetro Relâmpago, degrau 4 de 5/ }));
    expect(onGardenTrack).toHaveBeenCalledTimes(1);
    expect(onGardenTrack.mock.calls[0][0].id).toBe("JD1");
    expect(onGardenTrack.mock.calls[0][1]).toBe(4);
    expect(screen.queryByLabelText(/Escolher nível de Jardim/)).toBeNull();
  });

  it("estatísticas do Jardim vêm de dojoTracks, não dos totais da Jornada", () => {
    renderGarden(
      {
        "N1.03": P(3, 3, { ok: 1000, tot: 1000 }),
        "N1.08": P(3),
      },
      {
        JD1: {
          unlocked: true, mastered: true, family: "JD", currentStep: 5, highestStep: 5,
          rounds: 3, attempts: 24, correct: 18,
        },
        JD2: {
          unlocked: true, mastered: false, family: "JD", currentStep: 2, highestStep: 2,
          rounds: 1, attempts: 8, correct: 6,
        },
      },
    );
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("75%")).toBeTruthy();
    expect(screen.getByText("1/4")).toBeTruthy();
  });

  it("mastered aparece como conquista e não força o currentStep a voltar ao topo", () => {
    renderGarden(
      { "N1.10": P(3) },
      {
        JD5: {
          unlocked: true, mastered: true, family: "JD", currentStep: 3, highestStep: 5,
          rounds: 10, attempts: 80, correct: 70,
        },
      },
    );
    expect(screen.getByText("✨ Reflexo")).toBeTruthy();
    expect(screen.getByText("Treino: 3/5")).toBeTruthy();
    expect(screen.getByText("Melhor: 5/5")).toBeTruthy();
  });
});
