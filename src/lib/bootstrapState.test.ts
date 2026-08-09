import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { resolveBootstrapState } from "./bootstrapState";

const state = (name: string, updatedAt?: string, schemaVersion = 1): any => ({
  schemaVersion,
  updatedAt,
  kids: [{ id: name, name, avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true, customTracks: [],
});
const migrate = (raw: any): State => ({ ...raw }) as State;
const fresh = (): State => ({
  schemaVersion: 1, kids: [], progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true, customTracks: [],
});
const base = { uid: "A", legacyLocalRaw: null, legacyOwnerUid: null, migrate, fresh, currentSchemaVersion: 1 };
const progress = (extra: Record<string, unknown> = {}) => ({
  lvl: 2, streak: 1, bad: 0, stars: 3, ok: 4, tot: 5, bank: [], mast: 0, ...extra,
});

describe("P20 — bootstrap local × cloud", () => {
  it("scoped local ignora a chave legada ainda que ela seja mais nova", () => {
    const out = resolveBootstrapState({
      ...base,
      scopedLocalRaw: JSON.stringify(state("scoped", "2026-08-08T10:00:00.000Z")),
      legacyLocalRaw: JSON.stringify(state("legacy", "2026-08-08T12:00:00.000Z")),
      cloudRaw: null,
    });
    expect(out.state.kids[0].id).toBe("scoped");
    expect(out.source).toBe("scoped-local");
  });

  it("schema incompatível mais novo não apaga um candidato válido", () => {
    const out = resolveBootstrapState({
      ...base,
      scopedLocalRaw: JSON.stringify(state("valid", "2026-08-08T10:00:00.000Z")),
      cloudRaw: state("invalid", "2026-08-08T12:00:00.000Z", 999),
    });
    expect(out.state.kids[0].id).toBe("valid");
    expect(out.source).toBe("scoped-local");
    expect(out.shouldUploadCloud).toBe(true);
  });

  it("cloud mais novo vence e não é regravado sem necessidade", () => {
    const out = resolveBootstrapState({
      ...base,
      scopedLocalRaw: JSON.stringify(state("same", "2026-08-08T10:00:00.000Z")),
      cloudRaw: state("same", "2026-08-08T11:00:00.000Z"),
    });
    expect(out.source).toBe("cloud");
    expect(out.shouldUploadCloud).toBe(false);
  });

  it("local mais novo vence e deve reparar a cópia cloud", () => {
    const out = resolveBootstrapState({
      ...base,
      scopedLocalRaw: JSON.stringify(state("same", "2026-08-08T12:00:00.000Z")),
      cloudRaw: state("same", "2026-08-08T11:00:00.000Z"),
    });
    expect(out.source).toBe("scoped-local");
    expect(out.shouldUploadCloud).toBe(true);
  });

  it("legado sem dono pode ser reivindicado quando é a única fonte", () => {
    const out = resolveBootstrapState({
      ...base,
      scopedLocalRaw: null,
      legacyLocalRaw: JSON.stringify(state("legacy", "2026-08-08T10:00:00.000Z")),
      cloudRaw: null,
    });
    expect(out.source).toBe("legacy-local");
    expect(out.claimLegacy).toBe(true);
  });

  it("legado de outra família não concorre com cloud da conta atual", () => {
    const out = resolveBootstrapState({
      ...base, uid: "B", scopedLocalRaw: null,
      legacyLocalRaw: JSON.stringify(state("kid-A", "2026-08-08T12:00:00.000Z")),
      cloudRaw: state("kid-B", "2026-08-08T09:00:00.000Z"),
    });
    expect(out.source).toBe("cloud");
    expect(out.state.kids[0].id).toBe("kid-B");
    expect(out.claimLegacy).toBe(false);
  });

  it("sem candidato válido começa fresh sem gravar vazio na nuvem", () => {
    const out = resolveBootstrapState({ ...base, scopedLocalRaw: null, cloudRaw: null });
    expect(out.source).toBe("fresh");
    expect(out.shouldUploadCloud).toBe(false);
  });

  it("H4: materializa Aula antes de instalar candidato local em React", () => {
    const raw = state("kid-a", "2026-08-09T13:00:00.000Z");
    raw.progress = { "kid-a": { aula: progress({ __aulaSourceTrackId: "N1.04" }) } };

    const out = resolveBootstrapState({ ...base, scopedLocalRaw: raw, cloudRaw: null });

    expect(out.state.progress["kid-a"].aula).toBeUndefined();
    expect(out.state.progress["kid-a"]["N1.04"]).toMatchObject({ lvl: 2, ok: 4, tot: 5 });
    expect(out.state.updatedAt).toBe("2026-08-09T13:00:00.000Z");
  });

  it("H4: materializa Dojo transitório antes de instalar candidato cloud em React", () => {
    const raw = state("kid-a", "2026-08-09T13:00:00.000Z");
    raw.progress = { "kid-a": { dojo_add: progress({ lastDay: "2026-08-09" }) } };

    const out = resolveBootstrapState({ ...base, scopedLocalRaw: null, cloudRaw: raw });

    expect(out.state.progress["kid-a"].dojo_add).toBeUndefined();
    expect(out.state.dojoTracks?.["kid-a"]?.dojo_add).toMatchObject({
      attempts: 5,
      correct: 4,
      lastDay: "2026-08-09",
    });
    expect(out.state.updatedAt).toBe("2026-08-09T13:00:00.000Z");
  });
});
