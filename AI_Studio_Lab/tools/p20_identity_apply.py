from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {count}x")
    p.write_text(text.replace(old, new))


# ---------------------------------------------------------------------------
# 1) Identidade do save local: uma chave por Firebase UID. A chave histórica
#    permanece apenas como ponte de migração, com dono explícito depois do uso.
# ---------------------------------------------------------------------------
Path("src/lib/storageIdentity.ts").write_text(r'''export const LEGACY_STATE_KEY = "mk-state-v1";
export const LEGACY_STATE_OWNER_KEY = "mk-state-v1-legacy-owner";

export function stateKeyForUid(uid: string): string {
  if (!uid.trim()) throw new Error("UID vazio não pode identificar save local.");
  return `${LEGACY_STATE_KEY}:${uid}`;
}

function kidIds(raw: unknown): Set<string> {
  let value = raw as any;
  if (typeof raw === "string") {
    try { value = JSON.parse(raw); } catch { return new Set(); }
  }
  const kids = Array.isArray(value?.kids) ? value.kids : [];
  return new Set(kids.map((k: any) => String(k?.id || "")).filter(Boolean));
}

/**
 * A chave histórica não tinha dono. Depois de P20 ela só pode ser oferecida a
 * um UID se ainda não foi reivindicada (ou foi pelo mesmo UID). Quando cloud e
 * legado já têm perfis, exigimos ao menos um kid.id em comum para não misturar
 * famílias diferentes que usaram o mesmo tablet.
 */
export function canUseLegacyState(
  currentUid: string,
  legacyOwnerUid: string | null,
  legacyRaw: unknown,
  cloudRaw: unknown,
): boolean {
  if (!legacyRaw) return false;
  if (legacyOwnerUid && legacyOwnerUid !== currentUid) return false;
  if (!cloudRaw) return true;

  const legacyKids = kidIds(legacyRaw);
  const cloudKids = kidIds(cloudRaw);
  if (!legacyKids.size || !cloudKids.size) return true;
  for (const id of legacyKids) if (cloudKids.has(id)) return true;
  return false;
}
''')

Path("src/lib/bootstrapState.ts").write_text(r'''import type { State } from "../types";
import { escolherSaveMaisRecente } from "./reconciliacaoDeSaves";
import { canUseLegacyState } from "./storageIdentity";

export type BootstrapSource = "scoped-local" | "legacy-local" | "cloud" | "fresh";

export interface BootstrapResult {
  state: State;
  source: BootstrapSource;
  claimLegacy: boolean;
  shouldUploadCloud: boolean;
}

interface Args {
  uid: string;
  scopedLocalRaw: unknown;
  legacyLocalRaw: unknown;
  legacyOwnerUid: string | null;
  cloudRaw: unknown;
  migrate: (raw: unknown) => State;
  fresh: () => State;
  currentSchemaVersion: number;
}

function parseRaw(raw: unknown): any | null {
  if (!raw) return null;
  if (typeof raw !== "string") return raw;
  try { return JSON.parse(raw); } catch { return null; }
}

function migrateCandidate(raw: unknown, migrate: (raw: unknown) => State, version: number): State | null {
  const parsed = parseRaw(raw);
  // A política atual para schema incompatível é reset. Na RECONCILIAÇÃO ele
  // precisa ser candidato inválido, não um save vazio capaz de vencer empate.
  if (!parsed || parsed.schemaVersion !== version) return null;
  return migrate(parsed);
}

/** Migra cada candidato ANTES de comparar timestamps e nunca mistura objetos. */
export function resolveBootstrapState(args: Args): BootstrapResult {
  const {
    uid, scopedLocalRaw, legacyLocalRaw, legacyOwnerUid, cloudRaw,
    migrate, fresh, currentSchemaVersion,
  } = args;

  let localRaw: unknown = scopedLocalRaw || null;
  let localSource: "scoped-local" | "legacy-local" | null = scopedLocalRaw ? "scoped-local" : null;
  let claimLegacy = false;

  if (!localRaw && canUseLegacyState(uid, legacyOwnerUid, legacyLocalRaw, cloudRaw)) {
    localRaw = legacyLocalRaw;
    localSource = "legacy-local";
    claimLegacy = true;
  }

  const local = migrateCandidate(localRaw, migrate, currentSchemaVersion);
  const cloud = migrateCandidate(cloudRaw, migrate, currentSchemaVersion);

  if (!local && !cloud) {
    return { state: fresh(), source: "fresh", claimLegacy, shouldUploadCloud: false };
  }
  if (local && !cloud) {
    return { state: local, source: localSource || "scoped-local", claimLegacy, shouldUploadCloud: true };
  }
  if (!local && cloud) {
    return { state: cloud, source: "cloud", claimLegacy, shouldUploadCloud: false };
  }

  const escolha = escolherSaveMaisRecente(cloud, local);
  if (escolha.origem === "local") {
    return {
      state: escolha.estado as State,
      source: localSource || "scoped-local",
      claimLegacy,
      shouldUploadCloud: true,
    };
  }
  return {
    state: escolha.estado as State,
    source: "cloud",
    claimLegacy,
    shouldUploadCloud: false,
  };
}
''')

Path("src/lib/storageIdentity.test.ts").write_text(r'''import { describe, expect, it } from "vitest";
import { canUseLegacyState, stateKeyForUid } from "./storageIdentity";

describe("P20 — identidade do save local", () => {
  it("separa a chave local por Firebase UID", () => {
    expect(stateKeyForUid("uid-a")).toBe("mk-state-v1:uid-a");
    expect(stateKeyForUid("uid-b")).not.toBe(stateKeyForUid("uid-a"));
    expect(() => stateKeyForUid(" ")).toThrow(/UID vazio/);
  });

  it("chave legada já reivindicada não cruza para outra conta", () => {
    const legacy = { kids: [{ id: "k1" }] };
    expect(canUseLegacyState("uid-b", "uid-a", legacy, null)).toBe(false);
    expect(canUseLegacyState("uid-a", "uid-a", legacy, null)).toBe(true);
  });

  it("sem dono, cloud e legado com famílias diferentes não são misturados", () => {
    expect(canUseLegacyState(
      "uid-a", null,
      JSON.stringify({ kids: [{ id: "local-kid" }] }),
      { kids: [{ id: "cloud-kid" }] },
    )).toBe(false);
  });

  it("mesmo kid.id reconhece legado e cloud como a mesma família", () => {
    expect(canUseLegacyState(
      "uid-a", null,
      { kids: [{ id: "same" }] },
      { kids: [{ id: "same" }, { id: "new" }] },
    )).toBe(true);
  });
});
''')

Path("src/lib/bootstrapState.test.ts").write_text(r'''import { describe, expect, it } from "vitest";
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
});
''')

# ---------------------------------------------------------------------------
# 2) O sincronizador existente mantém a API e ganha contexto de identidade.
# ---------------------------------------------------------------------------
Path("src/lib/sincronizadorDeNuvem.ts").write_text(r'''import { State } from "../types";

export interface OpcoesDoSincronizador<C = undefined> {
  gravar: (estado: State, contexto?: C) => Promise<void>;
  atrasoMs?: number;
  agendar?: (fn: () => void, ms: number) => unknown;
  cancelar?: (handle: unknown) => void;
}

export interface Sincronizador<C = undefined> {
  agendar: (estado: State, contexto?: C) => void;
  descarregar: () => Promise<void>;
  cancelarPendencia: () => void;
  temPendencia: () => boolean;
}

export const ATRASO_PADRAO_MS = 8000;

export function criarSincronizador<C = undefined>(opcoes: OpcoesDoSincronizador<C>): Sincronizador<C> {
  const atrasoMs = opcoes.atrasoMs ?? ATRASO_PADRAO_MS;
  const agendarTimer = opcoes.agendar ?? ((fn, ms) => setTimeout(fn, ms));
  const cancelarTimer = opcoes.cancelar ?? (h => clearTimeout(h as ReturnType<typeof setTimeout>));

  let pendente: { estado: State; contexto?: C } | null = null;
  let handle: unknown = null;

  const subir = () => {
    if (!pendente) return Promise.resolve();
    const trabalho = pendente;
    pendente = null;
    return opcoes.gravar(trabalho.estado, trabalho.contexto).catch(err => {
      console.warn("[Nuvem] Sincronização adiada:", err);
    });
  };

  const limparTimer = () => {
    if (handle !== null) {
      cancelarTimer(handle);
      handle = null;
    }
  };

  return {
    agendar(estado: State, contexto?: C) {
      pendente = { estado, contexto };
      limparTimer();
      handle = agendarTimer(() => {
        handle = null;
        void subir();
      }, atrasoMs);
    },
    descarregar() {
      limparTimer();
      return subir();
    },
    cancelarPendencia() {
      limparTimer();
      pendente = null;
    },
    temPendencia() {
      return pendente !== null;
    },
  };
}
''')

Path("src/lib/sincronizadorDeNuvem.test.ts").write_text(r'''import { describe, expect, it, vi } from "vitest";
import { State } from "../types";
import { ATRASO_PADRAO_MS, criarSincronizador } from "./sincronizadorDeNuvem";

const save = (marca: string): State => ({
  schemaVersion: 1, updatedAt: marca,
  kids: [], progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true,
});

function relogio() {
  let proximo = 1;
  const tarefas = new Map<number, { fn: () => void; quando: number }>();
  let agora = 0;
  return {
    agendar: (fn: () => void, ms: number) => {
      const id = proximo++;
      tarefas.set(id, { fn, quando: agora + ms });
      return id;
    },
    cancelar: (h: unknown) => { tarefas.delete(h as number); },
    avancar(ms: number) {
      agora += ms;
      for (const [id, t] of [...tarefas]) if (t.quando <= agora) { tarefas.delete(id); t.fn(); }
    },
    pendentes: () => tarefas.size,
  };
}

describe("amortecedor de gravações na nuvem", () => {
  it("dez questões viram uma gravação, com o estado final", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    for (let i = 1; i <= 10; i++) s.agendar(save(`q${i}`));
    expect(gravar).not.toHaveBeenCalled();
    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();
    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar.mock.calls[0][0].updatedAt).toBe("q10");
  });

  it("mantém o UID junto do estado que venceu o debounce", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("a"), "uid-a");
    s.agendar(save("b"), "uid-b");
    t.avancar(ATRASO_PADRAO_MS);
    await Promise.resolve();
    expect(gravar).toHaveBeenCalledWith(expect.objectContaining({ updatedAt: "b" }), "uid-b");
  });

  it("cancelarPendencia numa troca de conta elimina trabalho antigo", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("a"), "uid-a");
    s.cancelarPendencia();
    t.avancar(ATRASO_PADRAO_MS * 2);
    await Promise.resolve();
    expect(gravar).not.toHaveBeenCalled();
    expect(s.temPendencia()).toBe(false);
  });

  it("descarregar sobe na hora e mantém contexto", async () => {
    const gravar = vi.fn().mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador<string>({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("fim"), "uid-a");
    await s.descarregar();
    expect(gravar).toHaveBeenCalledWith(expect.objectContaining({ updatedAt: "fim" }), "uid-a");
    expect(t.pendentes()).toBe(0);
  });

  it("falha de rede não derruba a aula e o estado seguinte ainda sobe", async () => {
    const gravar = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
    const t = relogio();
    const s = criarSincronizador({ gravar, agendar: t.agendar, cancelar: t.cancelar });
    s.agendar(save("tentativa-1"));
    await expect(s.descarregar()).resolves.toBeUndefined();
    s.agendar(save("tentativa-2"));
    await s.descarregar();
    expect(gravar).toHaveBeenCalledTimes(2);
  });
});
''')

# ---------------------------------------------------------------------------
# 3) Firebase: o trabalho cloud carrega o UID de origem; Google linka a conta
#    anônima para preservar o UID e o documento já usado por ela.
# ---------------------------------------------------------------------------
replace_once(
    "src/lib/firebase.ts",
    '''export async function saveStateToCloud(state: State): Promise<void> {\n  const userId = getDeviceUserId();\n  if (userId === "usr_anonymous_device") return;\n''',
    '''export async function saveStateToCloud(state: State, expectedUid?: string): Promise<void> {\n  const user = auth.currentUser;\n  if (!user) return;\n  if (expectedUid && user.uid !== expectedUid) {\n    console.warn(`[Firestore] Sync descartado: estado de ${expectedUid} não pertence ao usuário atual ${user.uid}.`);\n    return;\n  }\n  const userId = `usr_cloud_${user.uid}`;\n''',
)
replace_once(
    "src/lib/firebase.ts",
    '''    const result = await signInWithPopup(auth, googleProvider);\n    const user = result.user;\n''',
    '''    const anonymous = auth.currentUser?.isAnonymous ? auth.currentUser : null;\n    const result = anonymous\n      ? await linkWithPopup(anonymous, googleProvider)\n      : await signInWithPopup(auth, googleProvider);\n    const user = result.user;\n''',
)
replace_once(
    "src/lib/firebase.ts",
    '''export function logoutUser(): void {\n  try {\n    if (auth) {\n      signOut(auth).catch((err) => console.warn("Firebase Auth signOut failed:", err));\n    }\n''',
    '''export async function logoutUser(): Promise<void> {\n  try {\n    if (auth) {\n      await signOut(auth);\n    }\n''',
)

# ---------------------------------------------------------------------------
# 4) LoginScreen só sinaliza identidade. O App é o único dono do bootstrap.
# ---------------------------------------------------------------------------
replace_once(
    "src/components/LoginScreen.tsx",
    '''  onLoginSuccess: (email: string, cloudState: any) => void;''',
    '''  onLoginSuccess: (email: string) => void;''',
)
replace_once(
    "src/components/LoginScreen.tsx",
    '''      const { email, state } = await loginWithGoogle();''',
    '''      const { email } = await loginWithGoogle();''',
)
replace_once(
    "src/components/LoginScreen.tsx",
    '''      onLoginSuccess(email, state);''',
    '''      onLoginSuccess(email);''',
)
replace_once(
    "src/components/LoginScreen.tsx",
    '''      const { email, state } = await loginAnonymously();''',
    '''      const { email } = await loginAnonymously();''',
)
# segunda ocorrência do callback anônimo
p = Path("src/components/LoginScreen.tsx")
text = p.read_text()
if text.count('      onLoginSuccess(email, state);') != 1:
    raise SystemExit(f"LoginScreen: callback anônimo esperado 1x, encontrado {text.count('      onLoginSuccess(email, state);')}x")
p.write_text(text.replace('      onLoginSuccess(email, state);', '      onLoginSuccess(email);'))

# ---------------------------------------------------------------------------
# 5) App: bootstrap único por UID, local escopado e flush seguro na troca.
# ---------------------------------------------------------------------------
p = Path("src/App.tsx")
s = p.read_text()
replace_import = 'import { carimbar, escolherSaveMaisRecente } from "./lib/reconciliacaoDeSaves";\n'
if s.count(replace_import) != 1:
    raise SystemExit("App: import reconciliacao inesperado")
s = s.replace(
    replace_import,
    'import { carimbar } from "./lib/reconciliacaoDeSaves";\nimport { resolveBootstrapState } from "./lib/bootstrapState";\nimport { LEGACY_STATE_KEY, LEGACY_STATE_OWNER_KEY, stateKeyForUid } from "./lib/storageIdentity";\n',
)
s = s.replace(
    'import { defaultState, localDay, migrate } from "./utils/migrator";',
    'import { CURRENT_SCHEMA_VERSION, defaultState, localDay, migrate } from "./utils/migrator";',
)
s = s.replace(
    'const nuvem = criarSincronizador({ gravar: saveStateToCloud });',
    'const nuvem = criarSincronizador<string>({ gravar: saveStateToCloud });',
)

anchor = '  const [showAdmin, setShowAdmin] = useState(false);\n'
if s.count(anchor) != 1:
    raise SystemExit("App: ancora showAdmin inesperada")
s = s.replace(anchor, anchor + '  const authUidRef = useRef<string | null>(auth.currentUser?.uid ?? null);\n')

old_listener = '''  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (user) => {\n      if (user) {\n        const email = user.email || user.displayName || (user.isAnonymous ? "visitante" : "Conta Conectada");\n        setUserEmail(email);\n        setVisitorMode(user.isAnonymous);\n      } else {\n        setUserEmail(null);\n        if (!E2E) setVisitorMode(false);\n      }\n    });\n    return () => unsubscribe();\n  }, []);\n'''
new_listener = '''  useEffect(() => {\n    const unsubscribe = onAuthStateChanged(auth, (user) => {\n      const nextUid = user?.uid ?? null;\n      if (authUidRef.current && authUidRef.current !== nextUid) {\n        nuvem.cancelarPendencia();\n      }\n      authUidRef.current = nextUid;\n      if (user) {\n        const email = user.email || user.displayName || (user.isAnonymous ? "visitante" : "Conta Conectada");\n        setUserEmail(email);\n        setVisitorMode(user.isAnonymous);\n      } else {\n        setUserEmail(null);\n        if (!E2E) setVisitorMode(false);\n      }\n    });\n    return () => unsubscribe();\n  }, []);\n'''
if s.count(old_listener) != 1:
    raise SystemExit(f"App: listener esperado 1x, encontrado {s.count(old_listener)}x")
s = s.replace(old_listener, new_listener)

start = s.index('  useEffect(() => {\n    // If they aren\'t logged in AND aren\'t in visitor mode, route them to login!')
end_marker = '  useEffect(() => {\n    if (state) {\n      setSoundOn(state.sound !== false);\n    }\n  }, [state]);'
end = s.index(end_marker, start)
old_bootstrap = s[start:end]
new_bootstrap = '''  useEffect(() => {\n    const user = auth.currentUser;\n    // Produção entra sempre por Firebase (Google ou anônimo). E2E pode manter\n    // o shell local sem identidade cloud; ele não participa da reconciliação.\n    if (!user) {\n      setScreen({ name: "login" });\n      if (E2E && visitorMode) {\n        void (async () => {\n          const raw = await getStorage(LEGACY_STATE_KEY);\n          setState(raw ? migrate(JSON.parse(raw)) : defaultState());\n          setScreen({ name: "pick" });\n        })();\n      }\n      return;\n    }\n\n    let active = true;\n    const uid = user.uid;\n    void (async () => {\n      let cloudRaw: State | null = null;\n      try { cloudRaw = await loadStateFromCloud(); }\n      catch (err) { console.warn("Could not load state from Cloud Firestore, trying local storage fallback", err); }\n\n      const [scopedRaw, legacyRaw, legacyOwnerUid] = await Promise.all([\n        getStorage(stateKeyForUid(uid)),\n        getStorage(LEGACY_STATE_KEY),\n        getStorage(LEGACY_STATE_OWNER_KEY),\n      ]);\n\n      const bootstrap = resolveBootstrapState({\n        uid, scopedLocalRaw: scopedRaw, legacyLocalRaw: legacyRaw, legacyOwnerUid,\n        cloudRaw, migrate, fresh: defaultState, currentSchemaVersion: CURRENT_SCHEMA_VERSION,\n      });\n      if (!active || auth.currentUser?.uid !== uid) return;\n\n      const loaded = bootstrap.state;\n      setState(loaded);\n      await setStorage(stateKeyForUid(uid), JSON.stringify(loaded));\n      if (bootstrap.claimLegacy) await setStorage(LEGACY_STATE_OWNER_KEY, uid);\n      if (bootstrap.shouldUploadCloud) nuvem.agendar(loaded, uid);\n      setScreen(loaded.kids.length ? { name: "pick" } : { name: "setup" });\n    })();\n\n    return () => { active = false; };\n  }, [userEmail, visitorMode]);\n\n'''
s = s.replace(old_bootstrap, new_bootstrap)

old_persist = '''  const persist = (s: State, imediato = false) => {\n    // O MESMO carimbo vai para os dois destinos, senão a comparação da abertura\n    // acusaria conflito a cada gravação bem-sucedida.\n    const carimbado = carimbar(s);\n    setState(carimbado);\n\n    // O aparelho grava SEMPRE, a cada questão: é o save que a criança usa, e é\n    // ele que vence na reconciliação por ser o mais recente.\n    (async () => {\n      try {\n        await setStorage("mk-state-v1", JSON.stringify(carimbado));\n      } catch (e) {\n        console.error("Não consegui gravar o progresso local:", e);\n      }\n    })();\n\n    // A nuvem é cópia de segurança e pode esperar. Reescrever o save inteiro a\n    // cada questão subia ~1,2 MB por missão para mudar meia dúzia de números.\n    nuvem.agendar(carimbado);\n    if (imediato) void nuvem.descarregar();\n  };'''
new_persist = '''  const persist = (s: State, imediato = false) => {\n    const carimbado = carimbar(s);\n    setState(carimbado);\n    const uid = auth.currentUser?.uid;\n    if (!uid) {\n      if (E2E) void setStorage(LEGACY_STATE_KEY, JSON.stringify(carimbado));\n      return;\n    }\n    void setStorage(stateKeyForUid(uid), JSON.stringify(carimbado)).catch((e) => {\n      console.error("Não consegui gravar o progresso local:", e);\n    });\n    nuvem.agendar(carimbado, uid);\n    if (imediato) void nuvem.descarregar();\n  };'''
if s.count(old_persist) != 1:
    raise SystemExit(f"App: persist esperado 1x, encontrado {s.count(old_persist)}x")
s = s.replace(old_persist, new_persist)

old_login = '''  const handleLoginSuccess = (email: string, cloudState: State | null) => {\n    setUserEmail(email);\n    if (cloudState) {\n      persist(migrate(cloudState), true);\n    } else {\n      // If there's no cloud state for this new user, start completely fresh with a clean slate!\n      const fresh = defaultState();\n      persist(fresh, true);\n      setScreen({ name: "setup" });\n    }\n  };'''
new_login = '''  const handleLoginSuccess = (email: string) => {\n    // Identidade muda aqui; estado é instalado exclusivamente pelo bootstrap.\n    setUserEmail(email);\n  };'''
if s.count(old_login) != 1:
    raise SystemExit(f"App: handleLoginSuccess esperado 1x, encontrado {s.count(old_login)}x")
s = s.replace(old_login, new_login)

old_logout = '''  const handleLogout = () => {\n    logoutUser();\n    setUserEmail(null);\n    setVisitorMode(false);\n    if (typeof window !== "undefined" && window.localStorage) {\n      window.localStorage.removeItem("mk-visitor-mode");\n    }\n    setState(defaultState());\n    setScreen({ name: "login" });\n  };'''
new_logout = '''  const handleLogout = async () => {\n    // O último save sobe enquanto o UID antigo ainda é o usuário atual.\n    await nuvem.descarregar();\n    await logoutUser();\n    setUserEmail(null);\n    setVisitorMode(false);\n    if (typeof window !== "undefined" && window.localStorage) {\n      window.localStorage.removeItem("mk-visitor-mode");\n    }\n    setState(defaultState());\n    setScreen({ name: "login" });\n  };'''
if s.count(old_logout) != 1:
    raise SystemExit(f"App: logout esperado 1x, encontrado {s.count(old_logout)}x")
s = s.replace(old_logout, new_logout)

old_trigger = '''            onTriggerLogin={() => {\n              setUserEmail(null);\n              setVisitorMode(false);\n              if (typeof window !== "undefined" && window.localStorage) {\n                window.localStorage.removeItem("mk-visitor-mode");\n              }\n              setScreen({ name: "login" });\n            }}'''
new_trigger = '''            onTriggerLogin={() => {\n              // Mantém o Firebase anônimo vivo: login Google poderá LINKAR o\n              // mesmo UID e preservar o save local/cloud dessa família.\n              setScreen({ name: "login" });\n            }}'''
if s.count(old_trigger) != 1:
    raise SystemExit(f"App: onTriggerLogin esperado 1x, encontrado {s.count(old_trigger)}x")
s = s.replace(old_trigger, new_trigger)
p.write_text(s)

# ---------------------------------------------------------------------------
# 6) Guardas estáticos contra regressão da identidade do save.
# ---------------------------------------------------------------------------
Path("src/lib/storageIsolationContract.test.ts").write_text(r'''import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P20 — contrato de isolamento de conta", () => {
  it("App não volta a persistir produção na chave global", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain("stateKeyForUid(uid)");
    expect(app).not.toMatch(/setStorage\(\s*["']mk-state-v1["']/);
  });

  it("login success não instala default/cloud antes do bootstrap", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    const match = app.match(/const handleLoginSuccess[\s\S]*?\n  };/);
    expect(match?.[0]).toBeTruthy();
    expect(match?.[0]).not.toContain("persist(");
    expect(match?.[0]).not.toContain("defaultState(");
  });

  it("upgrade Google usa linkWithPopup quando existe usuário anônimo", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toMatch(/anonymous[\s\S]*?linkWithPopup\(anonymous, googleProvider\)/);
  });

  it("save cloud verifica o UID que originou o trabalho", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toContain("expectedUid && user.uid !== expectedUid");
  });

  it("troca de auth cancela apenas o trabalho do UID anterior", () => {
    const app = readFileSync(join(process.cwd(), "src/App.tsx"), "utf8");
    expect(app).toContain("authUidRef.current !== nextUid");
    expect(app).toContain("nuvem.cancelarPendencia()");
  });
});
''')

print("P20 identity v2 preparado para o runtime atual")
