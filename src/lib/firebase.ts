import { initializeApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  collection,
  getDoc,
  setDoc,
  setLogLevel,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInAnonymously,
  linkWithPopup,
} from "firebase/auth";
import { State, TelemetryLog } from "../types";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXkfOc6oJJCn705I-DYPJMysf72OEqnuY",
  authDomain: "ferrous-reactor-rgtt6.firebaseapp.com",
  projectId: "ferrous-reactor-rgtt6",
  storageBucket: "ferrous-reactor-rgtt6.firebasestorage.app",
  messagingSenderId: "1082330472626",
  appId: "1:1082330472626:web:1b684516e9bc890a1da9ab",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with local persistent cache
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    },
    "ai-studio-matemgicaia-b75bb145-aedc-4ed7-9ed6-778ecaeab6d1"
  );
  // Silencia logs verbosos do SDK quando offline ou em iframes sandboxed
  try {
    setLogLevel("silent");
  } catch (e) {
    console.warn("[Firestore] Failed to set log level:", e);
  }
} catch (e) {
  console.warn("[Firestore] Failed to initialize with persistent local cache. Falling back to default firestore.", e);
  firestoreInstance = getFirestore(app, "ai-studio-matemgicaia-b75bb145-aedc-4ed7-9ed6-778ecaeab6d1");
}

export const db = firestoreInstance;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Restrict to select accounts or prompt configuration
googleProvider.setCustomParameters({
  prompt: "select_account",
});

/**
 * Gets or creates a stable, persistent unique device/user identifier.
 * This guarantees profiles are saved correctly and separated under a specific namespace.
 */
export function getDeviceUserId(): string {
  try {
    // If a real authenticated Firebase User is present (Google or Anonymous), prioritize their unique uid
    if (auth && auth.currentUser) {
      return `usr_cloud_${auth.currentUser.uid}`;
    }
  } catch (e) {
    console.error("Failed to read device user ID:", e);
  }
  return "usr_anonymous_device";
}

/**
 * Returns the currently logged in user email or name.
 */
export function getCurrentUserEmail(): string | null {
  try {
    // Check active Firebase Auth first
    if (auth && auth.currentUser) {
      return auth.currentUser.email || auth.currentUser.displayName || (auth.currentUser.isAnonymous ? "visitante" : "Conta Conectada");
    }
  } catch (e) {
    console.error("Failed to get user email:", e);
  }
  return null;
}

/**
 * Signs in using Firebase Google Sign-In Popup.
 */
export async function loginWithGoogle(): Promise<{ email: string; state: State | null }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user && user.email) {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("mk-user-email", user.email);
      }
      const state = await loadStateFromCloud();
      return { email: user.email, state };
    }
    throw new Error("Não foi possível carregar as informações do seu e-mail do Google.");
  } catch (error) {
    console.error("Google Sign-In Popup failed:", error);
    throw error;
  }
}

/**
 * Signs in Anonymously. This is 100% secure, creating a sandboxed profile in Firestore.
 */
export async function loginAnonymously(): Promise<{ email: string; state: State | null }> {
  try {
    const result = await signInAnonymously(auth);
    const user = result.user;
    if (user) {
      const state = await loadStateFromCloud();
      return { email: "visitante", state };
    }
    throw new Error("Não foi possível iniciar uma sessão segura temporária.");
  } catch (error) {
    console.error("Anonymous Sign-In failed:", error);
    throw error;
  }
}

/**
 * Upgrades / links an active anonymous account with a Google account.
 * This preserves all their progress and migrates it to Google-secured cloud auth!
 */
export async function linkAnonymousWithGoogle(): Promise<{ email: string; state: State | null }> {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Nenhum usuário ativo para fazer o vínculo.");
    }
    const result = await linkWithPopup(user, googleProvider);
    const linkedUser = result.user;
    if (linkedUser && linkedUser.email) {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("mk-user-email", linkedUser.email);
      }
      const state = await loadStateFromCloud();
      return { email: linkedUser.email, state };
    }
    throw new Error("Vínculo concluído, mas o e-mail não pôde ser recuperado.");
  } catch (error) {
    console.error("Linking Google account failed:", error);
    throw error;
  }
}

/**
 * Logs out the current user, resetting the auth state.
 */
export function logoutUser(): void {
  try {
    if (auth) {
      signOut(auth).catch((err) => console.warn("Firebase Auth signOut failed:", err));
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("mk-user-email");
      window.localStorage.removeItem("mk-cloud-uid");
      window.localStorage.removeItem("mk-visitor-mode");
    }
  } catch (e) {
    console.error("Failed logging out user:", e);
  }
}

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Saves the entire application state to Cloud Firestore.
 */
export async function saveStateToCloud(state: State): Promise<void> {
  const userId = getDeviceUserId();
  if (userId === "usr_anonymous_device") return;

  try {
    const docRef = doc(db, "userStates", userId);
    await setDoc(
      docRef,
      {
        userId,
        state: JSON.stringify(state),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log("[Firestore] Progresso salvo na nuvem com sucesso!");
  } catch (err: any) {
    console.warn("[Firestore] Não foi possível salvar o progresso na nuvem. Mantendo localmente.", err);
    const isNetworkError =
      (err instanceof Error &&
        (err.message.includes("unavailable") ||
          err.message.includes("network") ||
          err.message.includes("Could not reach") ||
          err.message.includes("offline"))) ||
      (err && typeof err === "object" && (err.code === "unavailable" || err.code === "failed-precondition"));
    if (!isNetworkError) {
      handleFirestoreError(err, OperationType.WRITE, `userStates/${userId}`);
    }
  }
}

/**
 * Loads the application state from Cloud Firestore.
 * Returns null if no cloud state exists yet.
 */
export async function loadStateFromCloud(): Promise<State | null> {
  const userId = getDeviceUserId();
  if (userId === "usr_anonymous_device") return null;

  try {
    const docRef = doc(db, "userStates", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.state) {
        console.log("[Firestore] Progresso recuperado da nuvem!");
        return JSON.parse(data.state) as State;
      }
    }
  } catch (err: any) {
    console.warn("[Firestore] Não foi possível carregar o progresso da nuvem. O app continuará com o armazenamento local.", err);
    const isNetworkError =
      (err instanceof Error &&
        (err.message.includes("unavailable") ||
          err.message.includes("network") ||
          err.message.includes("Could not reach") ||
          err.message.includes("offline"))) ||
      (err && typeof err === "object" && (err.code === "unavailable" || err.code === "failed-precondition"));
    if (!isNetworkError) {
      handleFirestoreError(err, OperationType.GET, `userStates/${userId}`);
    }
  }
  return null;
}

/**
 * Por quanto tempo um registro de telemetria vive na nuvem.
 *
 * 18 meses cobre a única análise que justifica guardar isto — comparar a criança
 * com ela mesma ao longo de mais de um ano letivo — e nada além. Dado de criança
 * que não serve a nenhuma pergunta é só risco parado.
 */
export const RETENCAO_TELEMETRIA_DIAS = 550;

/**
 * Versão do formato do evento de telemetria.
 *
 * Um evento arquivado é lido anos depois do dia em que foi escrito, quando o
 * código que o produziu já não existe. Sem esta marca, interpretar um arquivo
 * antigo vira adivinhação — e como o arquivo é imutável, não há como consertar
 * depois. Ver `AI_Studio_Lab/arquitetura/DADOS_EM_ESCALA.md` §4.
 *
 * Suba o número ao mudar o SIGNIFICADO de um campo existente ou ao remover um.
 * Acrescentar campo opcional não exige versão nova: o leitor antigo o ignora.
 */
export const VERSAO_EVENTO_TELEMETRIA = 1;

/**
 * Logs an atomic telemetry event to Cloud Firestore asynchronously.
 * This does not block the UI and provides deep analytical insight.
 */
export async function logTelemetryToCloud(log: TelemetryLog): Promise<void> {
  const userId = getDeviceUserId();
  if (userId === "usr_anonymous_device") return; // Optional: skip logging for purely local anonymous without cloud fallback

  try {
    const colRef = collection(db, `userStates/${userId}/Kids/${log.kidId}/TelemetryLogs`);
    await setDoc(doc(colRef), {
      ...log,
      schemaVersion: VERSAO_EVENTO_TELEMETRIA,
      serverTimestamp: new Date().toISOString(),
      // Retenção (§ política em AI_Studio_Lab/DADOS_E_RETENCAO.md): o campo é o
      // gatilho da política de TTL do Firestore. Precisa ser Timestamp de
      // verdade — o TTL ignora string. Sem a política ligada no Console, o campo
      // fica inerte e não custa nada; com ela ligada, o registro se apaga
      // sozinho e ninguém precisa lembrar de faxinar.
      expiraEm: Timestamp.fromMillis(Date.now() + RETENCAO_TELEMETRIA_DIAS * 86400000),
    });
  } catch (err: any) {
    console.warn("[Firestore] Falha ao enviar telemetria (background):", err.message);
  }
}
