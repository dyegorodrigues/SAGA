from pathlib import Path


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    s = p.read_text()
    n = s.count(old)
    if n != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {n}x")
    p.write_text(s.replace(old, new))


# ---------------------------------------------------------------------------
# 1) Identidade local: uma chave por Firebase UID + migração controlada da chave
#    global histórica. A chave legada só pode ser reivindicada uma vez.
# ---------------------------------------------------------------------------
Path("src/lib/storageIdentity.ts").write_text('''import type { State } from "../types";

export const LEGACY_STATE_KEY = "mk-state-v1";
export const LEGACY_STATE_OWNER_KEY = "mk-state-v1-legacy-owner";

export function stateKeyForUid(uid: string): string {
  if (!uid.trim()) throw new Error("UID vazio não pode identificar save local.");
  return `${LEGACY_STATE_KEY}:${uid}`;
}

function kidIds(raw: unknown): Set<string> {
  const kids = Array.isArray((raw as any)?.kids) ? (raw as any).kids : [];
  return new Set(kids.map((k: any) => String(k?.id || "")).filter(Boolean));
}

/**
 * A chave histórica não tinha dono. Depois de P20 ela só pode ser oferecida a
 * um UID se ainda não foi reivindicada (ou foi pelo mesmo UID). Quando há cloud
 * e os dois saves têm perfis, exigimos ao menos um `kid.id` em comum — sinal
 * forte de que representam a mesma família, e não duas contas no mesmo tablet.
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

Path("src/lib/bootstrapState.ts").write_text('''import type { State } from "../types";
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
}

/**
 * Migra CADA candidato antes de comparar. Isso evita um save de schema inválido
 * com timestamp mais novo vencer primeiro e só depois virar reset limpo,
 * apagando um candidato válido do outro lado.
 */
export function resolveBootstrapState(args: Args): BootstrapResult {
  const {
    uid, scopedLocalRaw, legacyLocalRaw, legacyOwnerUid, cloudRaw, migrate, fresh,
  } = args;

  let localRaw: unknown = scopedLocalRaw || null;
  let localSource: "scoped-local" | "legacy-local" | null = scopedLocalRaw ? "scoped-local" : null;
  let claimLegacy = false;

  if (!localRaw && canUseLegacyState(uid, legacyOwnerUid, legacyLocalRaw, cloudRaw)) {
    localRaw = legacyLocalRaw;
    localSource = "legacy-local";
    claimLegacy = true;
  }

  const local = localRaw ? migrate(localRaw) : null;
  const cloud = cloudRaw ? migrate(cloudRaw) : null;

  if (!local && !cloud) {
    return { state: fresh(), source: "fresh", claimLegacy, shouldUploadCloud: true };
  }
  if (local && !cloud) {
    return { state: local, source: localSource || "scoped-local", claimLegacy, shouldUploadCloud: true };
  }
  if (!local && cloud) {
    return { state: cloud, source: "cloud", claimLegacy, shouldUploadCloud: false };
  }

  const winner = escolherSaveMaisRecente(local, cloud);
  const source: BootstrapSource = winner === local ? (localSource || "scoped-local") : "cloud";
  return {
    state: winner as State,
    source,
    claimLegacy,
    shouldUploadCloud: source !== "cloud",
  };
}
''')

Path("src/lib/storageIdentity.test.ts").write_text('''import { describe, expect, it } from "vitest";
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
      { kids: [{ id: "local-kid" }] },
      { kids: [{ id: "cloud-kid" }] },
    )).toBe(false);
  });

  it("mesmo kid.id permite reconhecer a origem histórica como a mesma família", () => {
    expect(canUseLegacyState(
      "uid-a", null,
      { kids: [{ id: "same" }] },
      { kids: [{ id: "same" }, { id: "new" }] },
    )).toBe(true);
  });
});
''')

Path("src/lib/bootstrapState.test.ts").write_text('''import { describe, expect, it } from "vitest";
import type { State } from "../types";
import { resolveBootstrapState } from "./bootstrapState";

const state = (name: string, updatedAt?: string, schemaVersion = 1): any => ({
  schemaVersion,
  updatedAt,
  kids: [{ id: name, name, grade: "1" }],
  progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true, customTracks: [],
});

const migrate = (raw: any): State => {
  if (!raw || raw.schemaVersion !== 1) return {
    schemaVersion: 1, kids: [], progress: {}, dojoTracks: {}, coins: {}, album: {}, log: {}, sound: true, customTracks: [],
  };
  return { ...raw } as State;
};
const fresh = () => migrate(null);

describe("P20 — bootstrap local × cloud", () => {
  it("scoped local nunca é contaminado pela chave legada de outra sessão", () => {
    const out = resolveBootstrapState({
      uid: "A",
      scopedLocalRaw: state("scoped", "2026-08-08T10:00:00.000Z"),
      legacyLocalRaw: state("legacy", "2026-08-08T12:00:00.000Z"),
      legacyOwnerUid: null,
      cloudRaw: null,
      migrate, fresh,
    });
    expect(out.state.kids[0].id).toBe("scoped");
    expect(out.source).toBe("scoped-local");
  });

  it("migra antes de reconciliar: schema inválido mais novo não apaga save válido", () => {
    const valid = state("valid", "2026-08-08T10:00:00.000Z");
    const invalidNewer = state("invalid", "2026-08-08T12:00:00.000Z", 999);
    const out = resolveBootstrapState({
      uid: "A",
      scopedLocalRaw: valid,
      legacyLocalRaw: null,
      legacyOwnerUid: null,
      cloudRaw: invalidNewer,
      migrate, fresh,
    });
    expect(out.state.kids[0].id).toBe("valid");
    expect(out.source).toBe("scoped-local");
    expect(out.shouldUploadCloud).toBe(true);
  });

  it("cloud mais novo vence e não é regravado sem necessidade", () => {
    const out = resolveBootstrapState({
      uid: "A",
      scopedLocalRaw: state("same", "2026-08-08T10:00:00.000Z"),
      legacyLocalRaw: null,
      legacyOwnerUid: null,
      cloudRaw: state("same", "2026-08-08T11:00:00.000Z"),
      migrate, fresh,
    });
    expect(out.source).toBe("cloud");
    expect(out.shouldUploadCloud).toBe(false);
  });

  it("legacy sem dono pode ser reivindicado quando é a única fonte", () => {
    const out = resolveBootstrapState({
      uid: "A", scopedLocalRaw: null,
      legacyLocalRaw: state("legacy", "2026-08-08T10:00:00.000Z"), legacyOwnerUid: null,
      cloudRaw: null, migrate, fresh,
    });
    expect(out.source).toBe("legacy-local");
    expect(out.claimLegacy).toBe(true);
    expect(out.shouldUploadCloud).toBe(true);
  });

  it("legado de família diferente não concorre com cloud de outra conta", () => {
    const out = resolveBootstrapState({
      uid: "B", scopedLocalRaw: null,
      legacyLocalRaw: state("kid-A", "2026-08-08T12:00:00.000Z"), legacyOwnerUid: null,
      cloudRaw: state("kid-B", "2026-08-08T09:00:00.000Z"), migrate, fresh,
    });
    expect(out.source).toBe("cloud");
    expect(out.state.kids[0].id).toBe("kid-B");
    expect(out.claimLegacy).toBe(false);
  });
});
''')

# ---------------------------------------------------------------------------
# 2) Debounce de nuvem carrega o contexto (UID) que originou o estado e pode ser
#    cancelado numa troca de autenticação.
# ---------------------------------------------------------------------------
Path("src/lib/sincronizadorDeNuvem.ts").write_text('''/**
 * Sincronizador leve para não gravar na nuvem a cada clique.
 *
 * P20: o trabalho guarda também o CONTEXTO (Firebase UID). Assim um estado
 * agendado pela conta A não pode ser enviado, 800 ms depois, como se tivesse
 * nascido na conta B.
 */
export function criarSincronizador<T, C = undefined>(
  gravar: (estado: T, contexto?: C) => Promise<void>,
  esperaMs = 800,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let ultimo: { estado: T; contexto?: C } | null = null;

  async function enviarUltimo() {
    if (!ultimo) return;
    const trabalho = ultimo;
    ultimo = null;
    try {
      await gravar(trabalho.estado, trabalho.contexto);
    } catch (err) {
      console.error("Falha ao sincronizar na nuvem", err);
    }
  }

  function agendar(estado: T, contexto?: C) {
    ultimo = { estado, contexto };
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void enviarUltimo();
    }, esperaMs);
  }

  async function descarregar() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    await enviarUltimo();
  }

  function cancelar() {
    if (timer) clearTimeout(timer);
    timer = null;
    ultimo = null;
  }

  return { agendar, descarregar, cancelar };
}
''')

Path("src/lib/sincronizadorDeNuvem.test.ts").write_text('''import { beforeEach, describe, expect, it, vi } from "vitest";
import { criarSincronizador } from "./sincronizadorDeNuvem";

describe("sincronizador de nuvem", () => {
  beforeEach(() => vi.useFakeTimers());

  it("agrupa várias alterações e envia só a última", async () => {
    const gravar = vi.fn(async () => undefined);
    const sync = criarSincronizador(gravar, 100);
    sync.agendar({ revision: 1 });
    sync.agendar({ revision: 2 });
    sync.agendar({ revision: 3 });
    expect(gravar).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    expect(gravar).toHaveBeenCalledTimes(1);
    expect(gravar).toHaveBeenCalledWith({ revision: 3 }, undefined);
  });

  it("mantém o UID junto do estado que venceu o debounce", async () => {
    const gravar = vi.fn(async () => undefined);
    const sync = criarSincronizador<{ v: number }, string>(gravar, 100);
    sync.agendar({ v: 1 }, "uid-a");
    sync.agendar({ v: 2 }, "uid-b");
    await vi.advanceTimersByTimeAsync(100);
    expect(gravar).toHaveBeenCalledWith({ v: 2 }, "uid-b");
  });

  it("cancelar numa troca de conta elimina trabalho pendente", async () => {
    const gravar = vi.fn(async () => undefined);
    const sync = criarSincronizador<{ v: number }, string>(gravar, 100);
    sync.agendar({ v: 1 }, "uid-a");
    sync.cancelar();
    await vi.advanceTimersByTimeAsync(200);
    expect(gravar).not.toHaveBeenCalled();
  });

  it("descarregar força o envio pendente", async () => {
    const gravar = vi.fn(async () => undefined);
    const sync = criarSincronizador(gravar, 1000);
    sync.agendar({ revision: 9 });
    await sync.descarregar();
    expect(gravar).toHaveBeenCalledWith({ revision: 9 }, undefined);
  });
});
''')

# ---------------------------------------------------------------------------
# 3) Firebase: save opcionalmente vinculado ao UID esperado; Google LINKA a
#    conta anônima em vez de substituir o usuário silenciosamente.
# ---------------------------------------------------------------------------
replace_once(
    "src/lib/firebase.ts",
    '''export async function saveStateToCloud(state: State): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
''',
    '''export async function saveStateToCloud(state: State, expectedUid?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  if (expectedUid && user.uid !== expectedUid) {
    console.warn(`Sync descartado: estado de ${expectedUid} não pertence ao usuário atual ${user.uid}.`);
    return;
  }
''',
)
replace_once(
    "src/lib/firebase.ts",
    '''    const wasAnonymous = auth.currentUser?.isAnonymous;
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email || "usuario@google.com";
    localStorage.setItem("mk-user-email", email);
    localStorage.setItem("mk-cloud-uid", result.user.uid);

    // If user was anonymous, Firebase automatically links the anonymous account
    // with Google when using signInWithPopup, preserving the same UID and data
    if (wasAnonymous && result.user.isAnonymous) {
      console.log("Anonymous account successfully upgraded to Google");
    }
''',
    '''    const anonymous = auth.currentUser?.isAnonymous ? auth.currentUser : null;
    // `signInWithPopup` substitui o usuário anônimo; `linkWithPopup` preserva o
    // UID e, portanto, o mesmo documento cloud + chave local por UID.
    const result = anonymous
      ? await linkWithPopup(anonymous, provider)
      : await signInWithPopup(auth, provider);
    const email = result.user.email || "usuario@google.com";
    localStorage.setItem("mk-user-email", email);
    localStorage.setItem("mk-cloud-uid", result.user.uid);
''',
)

# ---------------------------------------------------------------------------
# 4) LoginScreen: callback não transporta/instala estado. O bootstrap do App é o
#    único dono da reconciliação.
# ---------------------------------------------------------------------------
replace_once(
    "src/components/LoginScreen.tsx",
    '''  onLoginSuccess: (email: string, cloudState: State | null) => void;
  onContinueAsVisitor: (cloudState: State | null) => void;''',
    '''  onLoginSuccess: (email: string) => void;
  onContinueAsVisitor: (cloudState: State | null) => void;''',
)
replace_once(
    "src/components/LoginScreen.tsx",
    '''      const { email, state } = await loginWithGoogle();
      onLoginSuccess(email, state);''',
    '''      const { email } = await loginWithGoogle();
      onLoginSuccess(email);''',
)
replace_once(
    "src/components/LoginScreen.tsx",
    '''      const { email, state } = await loginAnonymously();
      onLoginSuccess(email, state);''',
    '''      const { email } = await loginAnonymously();
      onLoginSuccess(email);''',
)

# ---------------------------------------------------------------------------
# 5) App: bootstrap único por UID, migração antes da reconciliação, persist local
#    escopado, debounce vinculado ao UID, logout descarrega antes de sair.
# ---------------------------------------------------------------------------
p = Path("src/App.tsx")
s = p.read_text()
s = s.replace(
    'import { escolherSaveMaisRecente } from "./lib/reconciliacaoDeSaves";\n',
    'import { resolveBootstrapState } from "./lib/bootstrapState";\nimport { LEGACY_STATE_KEY, LEGACY_STATE_OWNER_KEY, stateKeyForUid } from "./lib/storageIdentity";\n',
)
s = s.replace(
    '''const nuvem = criarSincronizador<State>((estado) => saveStateToCloud(estado), 800);''',
    '''const nuvem = criarSincronizador<State, string>((estado, uid) => saveStateToCloud(estado, uid), 800);''',
)

# Auth listener: cancela trabalho pendente quando a identidade realmente muda.
old_listener = '''    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "visitante");
        setVisitorMode(user.isAnonymous);
      } else {
        setUserEmail(null);
        setVisitorMode(false);
      }
      setAuthLoading(false);
    });'''
new_listener = '''    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Um debounce criado sob outro usuário nunca atravessa a fronteira de auth.
      nuvem.cancelar();
      if (user) {
        setUserEmail(user.email || "visitante");
        setVisitorMode(user.isAnonymous);
      } else {
        setUserEmail(null);
        setVisitorMode(false);
      }
      setAuthLoading(false);
    });'''
if s.count(old_listener) != 1:
    raise SystemExit(f"App: listener auth esperado 1x, encontrado {s.count(old_listener)}x")
s = s.replace(old_listener, new_listener)

old_effect = '''  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function carregar() {
      // usuário ainda não entrou: fica no login, mas carrega estado local para
      // não perder dados caso ele opte pelo modo visitante em seguida.
      if (!userEmail && !visitorMode) {
        setScreen({ name: "login" });
        const local = await getStorage("mk-state-v1");
        if (!cancelled && local) setState(migrate(local));
        return;
      }

      const [localRaw, cloudRaw] = await Promise.all([
        getStorage("mk-state-v1"),
        userEmail ? loadStateFromCloud() : Promise.resolve(null),
      ]);
      const escolhido = escolherSaveMaisRecente(localRaw as any, cloudRaw as any);
      const loaded = migrate(escolhido || defaultState());
      if (cancelled) return;

      setState(loaded);
      stateRef.current = loaded;
      await setStorage("mk-state-v1", loaded);
      if (loaded.kids.length === 0) setScreen({ name: "setup" });
      else setScreen({ name: "pick" });
    }

    void carregar();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userEmail, visitorMode]);'''
new_effect = '''  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function carregar() {
      const currentUser = auth.currentUser;
      if (!currentUser || (!userEmail && !visitorMode)) {
        setState(defaultState());
        stateRef.current = defaultState();
        setScreen({ name: "login" });
        return;
      }

      const uid = currentUser.uid;
      const scopedKey = stateKeyForUid(uid);
      const [scopedRaw, legacyRaw, cloudRaw] = await Promise.all([
        getStorage(scopedKey),
        getStorage(LEGACY_STATE_KEY),
        loadStateFromCloud(),
      ]);
      const legacyOwner = localStorage.getItem(LEGACY_STATE_OWNER_KEY);
      const bootstrap = resolveBootstrapState({
        uid,
        scopedLocalRaw: scopedRaw,
        legacyLocalRaw: legacyRaw,
        legacyOwnerUid: legacyOwner,
        cloudRaw,
        migrate,
        fresh: defaultState,
      });
      if (cancelled || auth.currentUser?.uid !== uid) return;

      const loaded = bootstrap.state;
      setState(loaded);
      stateRef.current = loaded;
      await setStorage(scopedKey, loaded);
      if (bootstrap.claimLegacy) localStorage.setItem(LEGACY_STATE_OWNER_KEY, uid);
      if (bootstrap.shouldUploadCloud) nuvem.agendar(loaded, uid);

      if (loaded.kids.length === 0) setScreen({ name: "setup" });
      else setScreen({ name: "pick" });
    }

    void carregar();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userEmail, visitorMode]);'''
if s.count(old_effect) != 1:
    raise SystemExit(f"App: efeito bootstrap esperado 1x, encontrado {s.count(old_effect)}x")
s = s.replace(old_effect, new_effect)

old_persist = '''  const persist = (s: State, cloud = false) => {
    const carimbado = carimbar(s);
    setState(carimbado);
    stateRef.current = carimbado;
    setStorage("mk-state-v1", carimbado).catch(console.error);
    if (cloud) nuvem.agendar(carimbado);
  };'''
new_persist = '''  const persist = (s: State, cloud = false) => {
    const carimbado = carimbar(s);
    setState(carimbado);
    stateRef.current = carimbado;
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.warn("Persistência ignorada sem usuário Firebase ativo.");
      return;
    }
    setStorage(stateKeyForUid(uid), carimbado).catch(console.error);
    if (cloud) nuvem.agendar(carimbado, uid);
  };'''
if s.count(old_persist) != 1:
    raise SystemExit(f"App: persist esperado 1x, encontrado {s.count(old_persist)}x")
s = s.replace(old_persist, new_persist)

old_login = '''  const handleLoginSuccess = (email: string, cloudState: State | null) => {
    setUserEmail(email);
    setVisitorMode(email === "visitante");
    const loaded = cloudState ? migrate(cloudState) : defaultState();
    persist(loaded, true);
    if (loaded.kids.length === 0) setScreen({ name: "setup" });
    else setScreen({ name: "pick" });
  };'''
new_login = '''  const handleLoginSuccess = (email: string) => {
    // Autenticação escolhe a identidade; o efeito de bootstrap é o ÚNICO lugar
    // que carrega/migra/reconcilia estado. Nunca instalar default aqui.
    setUserEmail(email);
  };'''
if s.count(old_login) != 1:
    raise SystemExit(f"App: handleLoginSuccess esperado 1x, encontrado {s.count(old_login)}x")
s = s.replace(old_login, new_login)

old_trigger = '''          onTriggerLogin={() => {
            setUserEmail(null);
            setVisitorMode(false);
            setScreen({ name: "login" });
          }}'''
new_trigger = '''          onTriggerLogin={() => {
            // Mantém o usuário anônimo vivo para `linkWithPopup` preservar UID
            // e progresso ao tocar “Salvar Nuvem”.
            setScreen({ name: "login" });
          }}'''
if s.count(old_trigger) != 1:
    raise SystemExit(f"App: onTriggerLogin esperado 1x, encontrado {s.count(old_trigger)}x")
s = s.replace(old_trigger, new_trigger)

old_logout = '''          onLogout={() => {
            logoutUser();
            setUserEmail(null);
            setVisitorMode(false);
            setScreen({ name: "login" });
          }}'''
new_logout = '''          onLogout={async () => {
            // Faz o último flush enquanto o UID antigo ainda é o usuário atual.
            await nuvem.descarregar();
            await logoutUser();
            setUserEmail(null);
            setVisitorMode(false);
            const fresh = defaultState();
            setState(fresh);
            stateRef.current = fresh;
            setScreen({ name: "login" });
          }}'''
if s.count(old_logout) != 1:
    raise SystemExit(f"App: onLogout esperado 1x, encontrado {s.count(old_logout)}x")
s = s.replace(old_logout, new_logout)
p.write_text(s)

# ---------------------------------------------------------------------------
# 6) Guardas estáticos: bloqueiam retorno das duas falhas mais perigosas.
# ---------------------------------------------------------------------------
Path("src/lib/storageIsolationContract.test.ts").write_text('''import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P20 — contrato de isolamento de conta", () => {
  it("App não volta a persistir no mk-state-v1 global", () => {
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

  it("upgrade Google usa linkWithPopup quando já existe usuário anônimo", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toMatch(/anonymous[\s\S]*?linkWithPopup\(anonymous, provider\)/);
  });

  it("save cloud verifica o UID que originou o trabalho", () => {
    const firebase = readFileSync(join(process.cwd(), "src/lib/firebase.ts"), "utf8");
    expect(firebase).toContain("expectedUid && user.uid !== expectedUid");
  });
});
''')

print("P20 identity patch preparado")
