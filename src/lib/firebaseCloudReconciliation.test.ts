import { beforeEach, describe, expect, it, vi } from "vitest";
import type { State } from "../types";

const h = vi.hoisted(() => ({
  auth: {
    currentUser: {
      uid: "uid-a",
      email: "a@example.test",
      displayName: "A",
      isAnonymous: false,
      emailVerified: true,
      tenantId: null,
      providerData: [],
    } as any,
  },
  cloud: {
    data: null as any,
    getFails: false,
    setCalls: [] as any[],
  },
}));

vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => h.auth),
  GoogleAuthProvider: class {
    setCustomParameters() {}
  },
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  signInAnonymously: vi.fn(),
  linkWithPopup: vi.fn(),
}));

vi.mock("firebase/firestore", () => {
  const snapshot = () => ({
    exists: () => h.cloud.data !== null,
    data: () => h.cloud.data,
  });

  return {
    getFirestore: vi.fn(() => ({})),
    initializeFirestore: vi.fn(() => ({})),
    persistentLocalCache: vi.fn(() => ({})),
    persistentMultipleTabManager: vi.fn(() => ({})),
    doc: vi.fn((_db: unknown, ...parts: string[]) => ({ path: parts.join("/") })),
    collection: vi.fn((_db: unknown, ...parts: string[]) => ({ path: parts.join("/") })),
    getDoc: vi.fn(async () => {
      if (h.cloud.getFails) throw Object.assign(new Error("offline"), { code: "unavailable" });
      return snapshot();
    }),
    setDoc: vi.fn(async (_ref: unknown, payload: any) => {
      h.cloud.data = { ...(h.cloud.data || {}), ...payload };
      h.cloud.setCalls.push(payload);
    }),
    runTransaction: vi.fn(async (_db: unknown, body: (tx: any) => Promise<unknown>) => {
      const tx = {
        get: vi.fn(async () => {
          if (h.cloud.getFails) throw Object.assign(new Error("offline"), { code: "unavailable" });
          return snapshot();
        }),
        set: vi.fn((_ref: unknown, payload: any) => {
          h.cloud.data = { ...(h.cloud.data || {}), ...payload };
          h.cloud.setCalls.push(payload);
        }),
      };
      return body(tx);
    }),
    setLogLevel: vi.fn(),
    Timestamp: { fromMillis: (ms: number) => ({ ms }) },
  };
});

import { loadStateFromCloud, saveStateToCloud } from "./firebase";

const state = (id: string, updatedAt?: string): State => ({
  schemaVersion: 1,
  updatedAt,
  kids: [{ id, name: id, avatar: "🦊", grade: "ano1", theme: "classico" }],
  progress: {},
  dojoTracks: {},
  coins: {},
  album: {},
  log: {},
  sound: true,
  customTracks: [],
});

const cloudState = (): State => JSON.parse(h.cloud.data.state) as State;

beforeEach(() => {
  h.auth.currentUser = {
    uid: "uid-a",
    email: "a@example.test",
    displayName: "A",
    isAnonymous: false,
    emailVerified: true,
    tenantId: null,
    providerData: [],
  };
  h.cloud.data = null;
  h.cloud.getFails = false;
  h.cloud.setCalls = [];
});

describe("Cloud Reconciliation — writer Firestore", () => {
  it("H1: write logicamente antigo que chega por último não sobrescreve o estado mais novo", async () => {
    const novo = state("novo", "2026-08-09T12:00:00.000Z");
    const antigo = state("antigo", "2026-08-09T11:00:00.000Z");

    await saveStateToCloud(novo, "uid-a");
    await saveStateToCloud(antigo, "uid-a");

    expect(cloudState().kids[0].id).toBe("novo");
    expect(cloudState().updatedAt).toBe(novo.updatedAt);
  });

  it("H1/H2: o relógio lógico é State.updatedAt, não o horário de chegada do envelope Firestore", async () => {
    const novo = state("novo", "2026-08-09T12:00:00.000Z");
    const antigo = state("antigo", "2026-08-09T11:00:00.000Z");
    h.cloud.data = {
      userId: "usr_cloud_uid-a",
      state: JSON.stringify(novo),
      // Deliberadamente velho: este campo de transporte NÃO pode dar autoridade ao incoming.
      updatedAt: "2000-01-01T00:00:00.000Z",
    };

    await saveStateToCloud(antigo, "uid-a");

    expect(cloudState().kids[0].id).toBe("novo");
    expect(cloudState().updatedAt).toBe(novo.updatedAt);
  });

  it("H6: null temporário por offline não autoriza stale local a destruir cloud mais novo na reconexão", async () => {
    const novo = state("cloud-novo", "2026-08-09T12:00:00.000Z");
    const antigo = state("local-antigo", "2026-08-09T11:00:00.000Z");
    h.cloud.data = {
      userId: "usr_cloud_uid-a",
      state: JSON.stringify(novo),
      updatedAt: "2026-08-09T12:00:01.000Z",
    };

    h.cloud.getFails = true;
    await expect(loadStateFromCloud()).resolves.toBeNull();

    h.cloud.getFails = false;
    await saveStateToCloud(antigo, "uid-a");

    expect(cloudState().kids[0].id).toBe("cloud-novo");
    expect(cloudState().updatedAt).toBe(novo.updatedAt);
  });

  it("H2: save sem carimbo não derrota cloud já carimbado", async () => {
    const novo = state("cloud-carimbado", "2026-08-09T12:00:00.000Z");
    h.cloud.data = {
      userId: "usr_cloud_uid-a",
      state: JSON.stringify(novo),
      updatedAt: "2026-08-09T12:00:01.000Z",
    };

    await saveStateToCloud(state("legado-sem-carimbo"), "uid-a");

    expect(cloudState().kids[0].id).toBe("cloud-carimbado");
  });

  it("H3: expectedUid impede write atravessar troca de conta", async () => {
    h.auth.currentUser = { ...h.auth.currentUser, uid: "uid-b" };

    await saveStateToCloud(state("estado-a", "2026-08-09T12:00:00.000Z"), "uid-a");

    expect(h.cloud.setCalls).toHaveLength(0);
  });
});
