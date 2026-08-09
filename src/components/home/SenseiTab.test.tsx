// @vitest-environment jsdom
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { AulaPlan } from "../../curriculum/motores/composer";
import type { CausalJardimPrescription } from "../../curriculum/motores/jardimCausalPrescription";
import type { SenseiEntry } from "../../curriculum/motores/senseiOrchestrator";
import type { SenseiDojoPrescription } from "../../curriculum/motores/senseiDojoPrescription";
import type { Kid, Track } from "../../types";
import { SenseiTab } from "./SenseiTab";

vi.mock("../Mascot", () => ({
  FONT: "sans-serif",
  sfx: { tick: vi.fn(), level: vi.fn() },
}));

const kid = {
  id: "kid",
  name: "Leo",
  avatar: "🦊",
  grade: "ano1",
  theme: "classico",
} as Kid;

const dojoTrack: Track = {
  id: "dojo_add",
  name: "Templo da Soma",
  icon: "➕",
  color: "#2563EB",
  dark: "#1E40AF",
  totalQ: 10,
  gen: () => ({ kind: "plain", prompt: "1 + 1", options: [{ label: "2", value: 2 }], answer: 2 }),
};

const jardimTrack: Track = {
  id: "JD1",
  name: "Jardim · Olhômetro Relâmpago",
  icon: "👀",
  color: "#D1FAE5",
  dark: "#059669",
  totalQ: 8,
  gen: () => ({ kind: "plain", prompt: "Quantos você viu?", options: [{ label: "3", value: 3 }], answer: 3 }),
};

const aulaPlan: AulaPlan = {
  aquecimento: null,
  fronteira: null,
  resgates: [],
  fluencia: null,
  fecho: null,
  resumo: "Uma missão conceitual por vez.",
};

const prescription: SenseiDojoPrescription = {
  temple: { id: "dojo_add", track: dojoTrack, levels: {} as any },
  track: dojoTrack,
  step: 2,
  maxEligibleStep: 3,
  reason: "fluency-gap",
  reasonText: "Você já entende a ideia; agora vamos automatizar esta faixa.",
  weakItems: 0,
};

const gardenPrescription: CausalJardimPrescription = {
  trailId: "JD1",
  motherId: "N1.03",
  motherName: "Subitização perceptual (Olhômetro)",
  sourceNodeId: "N1.03",
  causalDistance: 0,
  step: 2,
  questionBudget: 8,
  track: jardimTrack,
  reason: "known-perceptual-weakness",
  reasonText: "A base perceptual já foi compreendida, mas ainda precisa virar reflexo.",
};

function renderSensei(
  dojoPrescription: SenseiDojoPrescription | null,
  senseiEntry: SenseiEntry = { kind: "lesson" },
) {
  const onSenseiDojo = vi.fn();
  const onAula = vi.fn();
  const onMixed = vi.fn();
  render(
    <SenseiTab
      kid={kid}
      prog={{ "N3.01": { lvl: 3 } }}
      aulaPlan={aulaPlan}
      senseiEntry={senseiEntry}
      dojoPrescription={dojoPrescription}
      onMatricula={vi.fn()}
      onAula={onAula}
      onSenseiDojo={onSenseiDojo}
      onTrack={vi.fn()}
      onMixed={onMixed}
      setActiveShellTab={vi.fn()}
    />,
  );
  return { onSenseiDojo, onAula, onMixed };
}

describe("SenseiTab — missão prescrita do Dojo", () => {
  it("mostra a prescrição como missão separada da Aula do Dia", () => {
    renderSensei(prescription);

    expect(screen.getByText("A Aventura do Sensei")).toBeTruthy();
    expect(screen.getByText(/Templo da Soma · faixa 2/)).toBeTruthy();
    expect(screen.getByText(/automatizar esta faixa/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Fazer round prescrito/ })).toBeTruthy();
  });

  it("clicar no round chama somente a rota prescrita, sem misturar Aula ou Misto", () => {
    const { onSenseiDojo, onAula, onMixed } = renderSensei(prescription);
    fireEvent.click(screen.getByRole("button", { name: /Fazer round prescrito/ }));

    expect(onSenseiDojo).toHaveBeenCalledTimes(1);
    expect(onAula).not.toHaveBeenCalled();
    expect(onMixed).not.toHaveBeenCalled();
  });

  it("sem prescrição não inventa uma missão adaptativa", () => {
    renderSensei(null);
    expect(screen.queryByText(/Prescrição do Sensei/)).toBeNull();
    expect(screen.queryByRole("button", { name: /Fazer round prescrito/ })).toBeNull();
  });

  it("não exibe recomendação curricular paralela baseada em estrelas", () => {
    renderSensei(null);
    expect(screen.queryByText(/Treino Livre Sugerido/)).toBeNull();
  });
});

describe("SenseiTab — Jardim causal", () => {
  it("torna a descida perceptual explícita sem parecer uma Aula conceitual normal", () => {
    renderSensei(null, { kind: "garden", prescription: gardenPrescription });

    expect(screen.getByText(/Aula do Dia · Base Perceptual/)).toBeTruthy();
    expect(screen.getByText(/Transformar em reflexo: Jardim · Olhômetro Relâmpago/)).toBeTruthy();
    expect(screen.getByText(/Base já compreendida:/)).toBeTruthy();
    expect(screen.getByText("Subitização perceptual (Olhômetro)")).toBeTruthy();
    expect(screen.getByText(/Round curto de/)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Começar Jardim Guiado/ })).toBeTruthy();
  });

  it("o CTA do Jardim usa a mesma porta principal e não dispara Dojo prescrito ou Misto", () => {
    const { onSenseiDojo, onAula, onMixed } = renderSensei(
      prescription,
      { kind: "garden", prescription: gardenPrescription },
    );
    fireEvent.click(screen.getByRole("button", { name: /Começar Jardim Guiado/ }));

    expect(onAula).toHaveBeenCalledTimes(1);
    expect(onSenseiDojo).not.toHaveBeenCalled();
    expect(onMixed).not.toHaveBeenCalled();
  });
});
