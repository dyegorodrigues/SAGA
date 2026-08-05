// @vitest-environment jsdom

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Kid, State } from "../../../types";
import { CreatureProfileCard } from "../CreatureProfileCard";

vi.mock("../PmdCreatureSprite", () => ({
  PmdCreatureSprite: ({ intent }: { intent: string }) => (
    <div data-testid="pmd-sprite" data-intent={intent}>sprite PMD</div>
  ),
}));

const characterPayload = {
  numericId: "0025",
  displayName: "Pikachu",
  path: "0025/0000/0000",
  animDataXml: "<AnimData><Anims /></AnimData>",
  phase: "Recolor",
  phaseRaw: 2,
  actions: [
    { kind: "sprite", action: "Idle", locked: false, animUrl: "https://spriteserver.pmdcollab.org/idle.png" },
    { kind: "sprite", action: "Eat", locked: false, animUrl: "https://spriteserver.pmdcollab.org/eat.png" },
    { kind: "sprite", action: "Dance", locked: false, animUrl: "https://spriteserver.pmdcollab.org/dance.png" },
  ],
  credits: [{ id: "artist", name: "Artista PMD" }],
  license: "Teste",
};

const catalogPayload = {
  items: [
    { numericId: "0025", name: "Pikachu", path: "0025/0000/0000", phase: "Recolor", phaseRaw: 2 },
    { numericId: "0133", name: "Eevee", path: "0133/0000/0000", phase: "Recolor", phaseRaw: 2 },
  ],
};

function baseState(): State {
  return {
    schemaVersion: 1,
    kids: [],
    progress: {
      kid1: {
        add: {
          lvl: 2,
          streak: 0,
          bad: 0,
          stars: 20,
          ok: 8,
          tot: 10,
          bank: [],
          mast: 0,
        },
      },
    },
    coins: { kid1: 10 },
    album: { kid1: [] },
    log: { kid1: [{ d: "2026-08-05", ok: 8, tot: 10, stars: 20, t: 100 }] },
    sound: false,
  };
}

const kid: Kid = {
  id: "kid1",
  name: "Heitor",
  avatar: "🧒",
  grade: "ano2",
  theme: "classico",
  petName: "Faísca",
};

describe("CreatureProfileCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/creatures/catalog")) {
          return new Response(JSON.stringify(catalogPayload), { status: 200 });
        }
        if (url.includes("/api/creatures/")) {
          return new Response(JSON.stringify(characterPayload), { status: 200 });
        }
        return new Response("not found", { status: 404 });
      }),
    );
  });

  it("renders a touch-first Tamagotchi and persists its initial learning sync", async () => {
    const onUpdateKid = vi.fn();
    render(<CreatureProfileCard kid={kid} state={baseState()} onUpdateKid={onUpdateKid} />);

    expect(screen.getByRole("button", { name: "Alimentar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Brincar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dormir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Carinho" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Treinar" })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId("pmd-sprite")).toBeInTheDocument());
    await waitFor(() => expect(onUpdateKid).toHaveBeenCalled());
    const persisted = onUpdateKid.mock.calls.at(-1)?.[0] as Kid & { creature?: { learning?: { stars?: number } } };
    expect(persisted.creature?.learning?.stars).toBe(20);
  });

  it("feeds the creature and persists a higher satiety value", async () => {
    const onUpdateKid = vi.fn();
    render(<CreatureProfileCard kid={kid} state={baseState()} onUpdateKid={onUpdateKid} />);
    await waitFor(() => expect(onUpdateKid).toHaveBeenCalled());
    onUpdateKid.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Alimentar" }));

    await waitFor(() => expect(onUpdateKid).toHaveBeenCalledTimes(1));
    const persisted = onUpdateKid.mock.calls[0][0] as Kid & {
      creature?: { needs?: { satiety?: number }; lastReaction?: string };
    };
    expect(persisted.creature?.needs?.satiety).toBe(100);
    expect(persisted.creature?.lastReaction).toBe("eat");
    expect(screen.getByRole("status")).toHaveTextContent(/recuperou energia/);
  });

  it("renames the partner through an accessible input", async () => {
    const onUpdateKid = vi.fn();
    render(<CreatureProfileCard kid={kid} state={baseState()} onUpdateKid={onUpdateKid} />);
    await waitFor(() => expect(onUpdateKid).toHaveBeenCalled());
    onUpdateKid.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Trocar nome do mascote" }));
    const input = screen.getByRole("textbox", { name: "Nome do mascote" });
    fireEvent.change(input, { target: { value: "Raio" } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar nome" }));

    expect(screen.getByText(/Raio/)).toBeInTheDocument();
    const persisted = onUpdateKid.mock.calls.at(-1)?.[0] as Kid & { creature?: { nickname?: string } };
    expect(persisted.creature?.nickname).toBe("Raio");
  });

  it("opens the starter selector and changes species without resetting progression", async () => {
    const onUpdateKid = vi.fn();
    render(<CreatureProfileCard kid={kid} state={baseState()} onUpdateKid={onUpdateKid} />);
    await waitFor(() => expect(onUpdateKid).toHaveBeenCalled());
    onUpdateKid.mockClear();

    fireEvent.click(screen.getByRole("button", { name: /Trocar parceiro/ }));
    fireEvent.click(screen.getByRole("button", { name: /Eevee/ }));

    const persisted = onUpdateKid.mock.calls.at(-1)?.[0] as Kid & {
      creature?: { speciesId?: string; learning?: { stars?: number }; evolutionStage?: number };
    };
    expect(persisted.creature?.speciesId).toBe("0133");
    expect(persisted.creature?.learning?.stars).toBe(20);
    expect(persisted.creature?.evolutionStage).toBe(2);
  });
});
