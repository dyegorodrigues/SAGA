import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { State } from "../types";
import { carimbar, escolherSaveMaisRecente } from "./reconciliacaoDeSaves";

const save = (marca: string, updatedAt?: string): State => ({
  schemaVersion: 1,
  updatedAt,
  kids: [{ id: marca, name: marca, avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: {}, coins: {}, album: {}, log: {}, sound: true,
});

describe("reconciliação nuvem × aparelho", () => {
  it("o save local mais recente vence a nuvem antiga", () => {
    // O caso que causava perda silenciosa de progresso.
    const escolha = escolherSaveMaisRecente(
      save("nuvem", "2026-08-01T10:00:00.000Z"),
      save("local", "2026-08-04T09:00:00.000Z"),
    );

    expect(escolha.origem).toBe("local");
    expect(escolha.estado?.kids[0].name).toBe("local");
    expect(escolha.houveConflito).toBe(true);
  });

  it("o save da nuvem mais recente vence o aparelho desatualizado", () => {
    // O outro aparelho jogou depois: este aqui não pode ressuscitar o passado.
    const escolha = escolherSaveMaisRecente(
      save("nuvem", "2026-08-04T09:00:00.000Z"),
      save("local", "2026-08-01T10:00:00.000Z"),
    );

    expect(escolha.origem).toBe("nuvem");
    expect(escolha.estado?.kids[0].name).toBe("nuvem");
  });

  it("save carimbado vence save antigo sem carimbo, dos dois lados", () => {
    expect(escolherSaveMaisRecente(save("nuvem"), save("local", "2026-08-04T09:00:00.000Z")).origem)
      .toBe("local");
    expect(escolherSaveMaisRecente(save("nuvem", "2026-08-04T09:00:00.000Z"), save("local")).origem)
      .toBe("nuvem");
  });

  it("empate resolve pela nuvem, que é o lado compartilhado", () => {
    const mesmoInstante = "2026-08-04T09:00:00.000Z";
    expect(escolherSaveMaisRecente(save("nuvem", mesmoInstante), save("local", mesmoInstante)).origem)
      .toBe("nuvem");
    expect(escolherSaveMaisRecente(save("nuvem"), save("local")).origem).toBe("nuvem");
  });

  it("carimbo corrompido não sequestra a decisão", () => {
    // Um `updatedAt` inválido não pode valer mais que um carimbo real.
    expect(escolherSaveMaisRecente(
      save("nuvem", "ontem de tarde"),
      save("local", "2026-08-04T09:00:00.000Z"),
    ).origem).toBe("local");
  });

  it("com um lado só, usa o que existe e não declara conflito", () => {
    expect(escolherSaveMaisRecente(null, save("local")).origem).toBe("local");
    expect(escolherSaveMaisRecente(save("nuvem"), null).origem).toBe("nuvem");
    expect(escolherSaveMaisRecente(null, save("local")).houveConflito).toBe(false);
  });

  it("sem save nenhum, devolve vazio em vez de inventar estado", () => {
    expect(escolherSaveMaisRecente(null, null)).toEqual({
      estado: null, origem: "nenhum", houveConflito: false,
    });
  });
});

describe("carimbo", () => {
  it("grava o instante sem tocar no resto do estado", () => {
    const original = save("kid");
    const marcado = carimbar(original, new Date("2026-08-04T12:00:00.000Z"));

    expect(marcado.updatedAt).toBe("2026-08-04T12:00:00.000Z");
    expect(marcado.kids).toEqual(original.kids);
    expect(original.updatedAt, "não muta o estado vindo do React").toBeUndefined();
  });

  it("o mesmo carimbo vai para os dois destinos", () => {
    const app = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");
    const persist = app.slice(app.indexOf("const persist = (s: State"));
    const corpo = persist.slice(0, persist.indexOf("\n  };"));

    // Carimbar duas vezes produziria instantes diferentes no aparelho e na
    // nuvem, e a abertura seguinte acusaria conflito a cada gravação
    // bem-sucedida.
    expect(corpo.match(/carimbar\(/g) ?? []).toHaveLength(1);
    expect(corpo).toContain("setStorage(stateKeyForUid(uid), JSON.stringify(carimbado))");
    expect(corpo, "a nuvem recebe o MESMO estado carimbado e o mesmo dono").toContain("nuvem.agendar(carimbado, uid)");
  });

  it("o aparelho grava sempre; só a nuvem passa pelo amortecedor", () => {
    const app = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");
    const persist = app.slice(app.indexOf("const persist = (s: State"));
    const corpo = persist.slice(0, persist.indexOf("\n  };"));

    // Se a gravação local entrar no amortecedor, uma queda do app perde o
    // progresso da questão — e a reconciliação não tem mais nada a reconciliar.
    const posLocal = corpo.indexOf("setStorage(");
    const posAmortecedor = corpo.indexOf("nuvem.agendar(");
    expect(posLocal).toBeGreaterThan(-1);
    expect(posAmortecedor).toBeGreaterThan(posLocal);
    expect(corpo).not.toMatch(/nuvem\.agendar\([^)]*\)[\s\S]*setStorage\(/);
  });
});

describe("a abertura real do App, e não só a função pura", () => {
  const app = readFileSync(resolve(__dirname, "../App.tsx"), "utf8");

  it("lê cloud, local escopado e legado antes do bootstrap decidir", () => {
    const posNuvem = app.indexOf("await loadStateFromCloud()");
    const posScoped = app.indexOf("getStorage(stateKeyForUid(uid))");
    const posLegacy = app.indexOf("getStorage(LEGACY_STATE_KEY)");
    const posResolve = app.indexOf("resolveBootstrapState({");

    expect(posNuvem).toBeGreaterThan(-1);
    expect(posScoped).toBeGreaterThan(-1);
    expect(posLegacy).toBeGreaterThan(-1);
    expect(posResolve).toBeGreaterThan(posNuvem);
    expect(posResolve).toBeGreaterThan(posScoped);
    expect(posResolve).toBeGreaterThan(posLegacy);
  });
});
