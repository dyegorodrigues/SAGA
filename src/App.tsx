import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";
import { State, Kid, Track, Progress } from "./types";
import {
  C,
  FONT,
  BODY,
  THEMES,
  setSoundOn,
  getStorage,
  setStorage,
  sfx,
} from "./components/Mascot";
import { SetupScreen } from "./components/SetupScreen";
import { PickScreen } from "./components/PickScreen";
import { KidHomeScreen } from "./components/KidHomeScreen";
import { AlbumScreen } from "./components/AlbumScreen";
import { SagaLogo } from "./components/SagaLogo";
import { GameLoop } from "./components/GameLoop";
import { ParentDashboard } from "./components/ParentDashboard";
import { getKidLifetimeStars, getMascotStage } from "./components/MascotEvolution";
import { tracksForGrade, SUBJECTS } from "./subjects";
import { ALL_MATH_TRACKS } from "./curriculum/motores/curriculum";
import { migrateLegacyCrown } from "./curriculum/motores/progressEngine";
import {
  jardimProgressProjection,
  jardimTrack,
  jardimTrilhaPorId,
  resolveJardimState,
  type JardimMissionSummary,
} from "./curriculum/motores/jardimSession";
import type { JardimRoundResult } from "./curriculum/motores/jardimEngine";
import { trackMisconception } from "./curriculum/motores/radarEngine";
import { buildMixedTrack } from "./curriculum/motores/mixedChallenge";
import { dojo_add } from "./curriculum/fichas/dojo/sensei/dojo_add";
import { dojo_sub } from "./curriculum/fichas/dojo/sensei/dojo_sub";
import { dojo_mul } from "./curriculum/fichas/dojo/sensei/dojo_mul";
import { dojo_div } from "./curriculum/fichas/dojo/sensei/dojo_div";
import { senseiDojoTempleById, senseiDojoTrack } from "./curriculum/motores/senseiDojoSession";
import type { SenseiDojoSessionSource } from "./curriculum/motores/senseiDojoPolicy";
const dojoTracks = [dojo_add, dojo_sub, dojo_mul, dojo_div];
import { buildDojoTrack } from "./utils/dojoMode";
import { buildAulaTrack } from "./curriculum/motores/composer";
import { buildMatriculaTrack, seedFromResults } from "./utils/matricula";
import { saveStateToCloud, loadStateFromCloud, getCurrentUserEmail, logoutUser, auth } from "./lib/firebase";
import { carimbar } from "./lib/reconciliacaoDeSaves";
import { resolveBootstrapState } from "./lib/bootstrapState";
import { LEGACY_STATE_KEY, LEGACY_STATE_OWNER_KEY, destinoDoProgresso, stateKeyForUid } from "./lib/storageIdentity";
import { criarSincronizador } from "./lib/sincronizadorDeNuvem";
import { applyKidPurchase, purchaseAlbumItem, spendCoins } from "./lib/economyTransactions";
import { rewardForMissionCompletion, rewardForTerminalAnswer, type RewardMode } from "./lib/rewardPolicy";
import { onAuthStateChanged } from "firebase/auth";
import { LoginScreen } from "./components/LoginScreen";
import { modoVisitante, mostrandoCarregamento, telaDeEntrada } from "./lib/entradaDoApp";
import { AdminGodPanel } from "./components/AdminGodPanel";
import { AdminDashboardScreen } from "./components/AdminDashboardScreen";
import { GalleryScreen } from "./components/GalleryScreen";
import { MascotEnvironment } from "./engine/mascot-v2/MascotEnvironment";
import { shellBoxClass, shellRootClass, telaDeAppInteiro } from "./components/layout/shellLayout";
import { CURRENT_SCHEMA_VERSION, defaultState, localDay, migrate } from "./utils/migrator";

/* ============================================================
   MATEMÁGICA IA — Matemática Adaptativa & Tutoria Inteligente (PT-BR)
   ============================================================ */

/**
 * Único para o app inteiro, e fora do componente de propósito: um sincronizador
 * criado a cada render não coalesceria nada.
 */
const nuvem = criarSincronizador<string>({ gravar: saveStateToCloud });

const calcStreak = (log: any[]) => {
  if (!log || !log.length) return 0;
  const days = new Set(log.map((e) => e.d));
  let t = new Date();
  if (!days.has(localDay(t))) {
    t = new Date(t.getTime() - 86400000);
    if (!days.has(localDay(t))) return 0;
  }
  let streak = 0;
  while (days.has(localDay(t))) {
    streak++;
    t = new Date(t.getTime() - 86400000);
  }
  return streak;
};

/* ---------------- Immersive Layout Shell ---------------- */
interface ShellProps {
  children: React.ReactNode;
  theme?: string;
}

interface ShellExtProps extends ShellProps { screenName?: string; }
export function Shell({ children, theme = "classico", screenName }: ShellExtProps) {
  const t = THEMES[theme] || THEMES.classico;
  const bg = t.bg || ["#E4F0FF", C.bg];

  return (
    <div
      className={shellRootClass(screenName)}
      style={{
        background: `linear-gradient(180deg, ${bg[0]} 0%, ${bg[1]} 40%)`,
        fontFamily: BODY,
        color: C.ink,
      }}
    >
      {/* Global CSS Inject */}
      <style>{`
        @keyframes mkPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06)}100%{transform:scale(1);opacity:1}}
        @keyframes mkShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
        @keyframes mkBurst{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(.5);opacity:0}}
        @keyframes mkBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes mkToast{0%{transform:translate(-50%,-24px);opacity:0}15%{transform:translate(-50%,0);opacity:1}85%{transform:translate(-50%,0);opacity:1}100%{transform:translate(-50%,-24px);opacity:0}}
        @keyframes mkSway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        @keyframes mkFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes mkPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes mkDrop{0%{transform:translateY(-28px);opacity:0}70%{transform:translateY(3px);opacity:1}100%{transform:translateY(0);opacity:1}}
        @keyframes mkOptIn{0%{transform:translateY(12px) scale(.95);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes mkCloud{0%{transform:translateX(-16vw)}100%{transform:translateX(112vw)}}
        @keyframes mkTwinkle{0%,100%{opacity:.15;transform:scale(.9)}50%{opacity:.85;transform:scale(1.2)}}
        @keyframes mkBlink{0%,91%,100%{opacity:0}94%,97%{opacity:1}}
        @keyframes mkShine{0%{left:-70%}100%{left:130%}}
        @keyframes mkSpin{100%{transform:rotate(360deg)}}
        @keyframes mkDrift{0%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(15px,-25px) rotate(8deg)}100%{transform:translate(0,0) rotate(0deg)}}
        @keyframes mkPuff{0%{transform:scale(0.8);opacity:0}50%{opacity:0.8}100%{transform:scale(1.4) translateY(-30px);opacity:0}}
        @keyframes mkSpotlight{0%,100%{transform:rotate(-15deg);opacity:0.12}50%{transform:rotate(15deg);opacity:0.28}}
        
        .mk-sway{animation:mkSway 2.6s ease-in-out infinite;transform-origin:50% 90%;display:inline-block}
        .mk-float{animation:mkFloat 2.8s ease-in-out infinite}
        .mk-pulse{animation:mkPulse 2s ease-in-out infinite}
        .mk-drop{animation:mkDrop .5s ease-out both;display:inline-block}
        .mk-optin{animation:mkOptIn .35s ease-out both}
        .mk-blink{animation:mkBlink 4.2s ease-in-out infinite}
        .mk-grow{animation:mkPop .5s ease-out both}
        .mk-spin-slow{animation:mkSpin 26s linear infinite;transform-box:fill-box;transform-origin:center}
        .mk-pop{animation:mkPop .35s ease-out both}
        .mk-shake{animation:mkShake .45s ease-in-out}
        .mk-bounce{animation:mkBounce 1.6s ease-in-out infinite}

        /* Cenas vivas — animações SVG-safe (transform-box:fill-box) que dão VIDA:
           entrada que "nasce" + toques ociosos (sol pulsa, nuvem/sol flutua, folha balança).
           Sutis de propósito; o prefers-reduced-motion acima desliga tudo. */
        @keyframes scRise{0%{transform:translateY(9px) scale(.86);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
        .sc-rise{animation:scRise .6s ease-out both;transform-box:fill-box;transform-origin:center bottom}
        .sc-pulse{animation:mkPulse 3s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .sc-float{animation:mkFloat 3.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
        .sc-sway{animation:mkSway 3.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center bottom}

        /* JourneyScene: a nova cena ENTRA em cena (leve zoom-in + fade) — a "viagem"
           de um lugar ao maior sem motor de zoom; prefers-reduced-motion desliga. */
        @keyframes jrEmerge{0%{transform:scale(1.14);opacity:0}100%{transform:scale(1);opacity:1}}
        .jr-emerge{animation:jrEmerge .55s cubic-bezier(.2,.7,.3,1) both}

        button{-webkit-tap-highlight-color:transparent; outline: none !important;}
        @media (prefers-reduced-motion: reduce){*{animation:none !important;transition:none !important}}
      `}</style>

      <div className={shellBoxClass(screenName)}>
        <div className={`relative z-10 flex flex-col ${telaDeAppInteiro(screenName) ? "flex-1 h-full overflow-hidden" : ""}`}>{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function App() {
  const [state, setState] = useState<State | null>(null);
  const [screen, setScreen] = useState<{
    name: string;
    kid?: string;
    track?: string;
    lvl?: number;
    dojoSource?: SenseiDojoSessionSource;
    rescue?: { requiredLevel: number; questionBudget: number };
  }>({ name: "loading" });
  const [userEmail, setUserEmail] = useState<string | null>(getCurrentUserEmail());
  // Gancho de teste E2E (só com ?e2e=1 na URL): entra como visitante e não deixa o
  // reset de auth do Firebase mandar de volta pro login. Inócuo em produção.
  const E2E = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("e2e");
  /** A marca que "Começar sem Conta" grava e o botão de sair apaga. */
  const escolheuVisitante = () =>
    typeof window !== "undefined" && window.localStorage.getItem("mk-visitor-mode") === "true";
  const [visitorMode, setVisitorMode] = useState<boolean>(() =>
    modoVisitante({ anonimo: null, escolhaLocal: escolheuVisitante(), e2e: E2E }),
  );
  const [showAdmin, setShowAdmin] = useState(false);
  const authUidRef = useRef<string | null>(auth.currentUser?.uid ?? null);

  // Reset URL hash on boot so page refreshes always load the normal App state
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Desafio Misto 👑: as 10 questões são montadas UMA vez ao entrar na missão
  // (o App re-renderiza a cada resposta; sem memo, a lista seria re-sorteada).
  const mixedTrack = useMemo(() => {
    if (!state || screen.name !== "game" || (screen.track !== "mista" && screen.track !== "mixed") || !screen.kid) return null;
    const kid = state.kids.find((k) => k.id === screen.kid) || state.kids[0];
    if (!kid) return null;
    const base = SUBJECTS.find(s => s.id === "mat")?.tracks[kid.grade] || [];
    const progOf = (tid: string) => {
      const kp = (state.progress[kid.id] || {})[tid];
      return kp ? { ...kp } : { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    };
    return buildMixedTrack(base, progOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, screen.kid, screen.track]);

  // ▶️ MINHA AULA 📚 (E2 Professor Mágico): o Compositor monta a playlist do dia
  // UMA vez ao entrar (aquecimento → resgate/fronteira/fluência → fecho lúdico).
  const aulaTrack = useMemo(() => {
    if (!state || screen.name !== "game" || screen.track !== "aula" || !screen.kid) return null;
    const kid = state.kids.find((k) => k.id === screen.kid) || state.kids[0];
    if (!kid) return null;
    const base = SUBJECTS.find(s => s.id === "mat")?.tracks[kid.grade] || [];
    const progOf = (tid: string) => {
      const kp = (state.progress[kid.id] || {})[tid];
      return kp ? { ...kp } : { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    };
    return buildAulaTrack(base, progOf, kid.grade).track;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, screen.kid, screen.track]);

  // Dojo Mode 🥋
  const dojoBuild = useMemo(() => {
    if (!state || screen.name !== "game" || screen.track !== "dojo" || !screen.kid) return null;
    const kid = state.kids.find((k) => k.id === screen.kid) || state.kids[0];
    if (!kid) return null;
    const base = SUBJECTS.find(s => s.id === "mat")?.tracks[kid.grade] || [];
    const progOf = (tid: string) => {
      const kp = (state.progress[kid.id] || {})[tid];
      return kp ? { ...kp } : { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    };
    return buildDojoTrack(base, progOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, screen.kid, screen.track]);

  // 🎒 MATRÍCULA (E3): sondas na escada das habilidades-núcleo; ao final, SEMEIA o
  // nível real de cada trilha (fim do "todo mundo começa do 1").
  const matriculaBuild = useMemo(() => {
    if (!state || screen.name !== "game" || screen.track !== "matricula" || !screen.kid) return null;
    const kid = state.kids.find((k) => k.id === screen.kid) || state.kids[0];
    if (!kid) return null;
    return buildMatriculaTrack(SUBJECTS.find(s => s.id === "mat")?.tracks[kid.grade] || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, screen.kid, screen.track]);
  // acertos da matrícula na ordem da escada (reiniciado no 1º commit da missão)
  const matResultsRef = useRef<boolean[]>([]);

  // Fechar a aba, trocar de app ou bloquear a tela descarrega o que estiver
  // esperando. `pagehide` e `visibilitychange` porque no iOS o `beforeunload`
  // frequentemente não dispara — e tablet é onde este app roda.
  useEffect(() => {
    const descarregar = () => { void nuvem.descarregar(); };
    const aoEsconder = () => { if (document.visibilityState === "hidden") descarregar(); };
    window.addEventListener("pagehide", descarregar);
    document.addEventListener("visibilitychange", aoEsconder);
    return () => {
      window.removeEventListener("pagehide", descarregar);
      document.removeEventListener("visibilitychange", aoEsconder);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const nextUid = user?.uid ?? null;
      if (authUidRef.current && authUidRef.current !== nextUid) {
        nuvem.cancelarPendencia();
      }
      authUidRef.current = nextUid;
      if (user) {
        const email = user.email || user.displayName || (user.isAnonymous ? "visitante" : "Conta Conectada");
        setUserEmail(email);
        setVisitorMode(modoVisitante({ anonimo: user.isAnonymous, escolhaLocal: escolheuVisitante(), e2e: E2E }));
      } else {
        setUserEmail(null);
        // Sem sessão no Firebase, quem manda é a escolha gravada no aparelho.
        // Zerar aqui apagava "Começar sem Conta" no primeiro instante do boot e
        // devolvia a criança ao login a cada reabertura; sair do app continua
        // funcionando porque `handleLogout` apaga a marca antes de chegar aqui.
        setVisitorMode(modoVisitante({ anonimo: null, escolhaLocal: escolheuVisitante(), e2e: E2E }));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    // Produção entra sempre por Firebase (Google ou anônimo). E2E pode manter
    // o shell local sem identidade cloud; ele não participa da reconciliação.
    if (telaDeEntrada({ temSessao: Boolean(user), visitante: visitorMode }) !== "sessao") {
      // Visitante é decisão local: sem conta, sem rede e sem sessão a criança
      // ainda precisa jogar. Isto só acontecia sob `?e2e=1` — fora do teste,
      // "Começar sem Conta" acendia uma flag e não abria nada.
      if (visitorMode) {
        void (async () => {
          const raw = await getStorage(LEGACY_STATE_KEY);
          const local = raw ? migrate(JSON.parse(raw)) : defaultState();
          setState(local);
          setScreen(local.kids.length ? { name: "pick" } : { name: "setup" });
        })();
        return;
      }
      setScreen({ name: "login" });
      return;
    }

    let active = true;
    const uid = user.uid;
    void (async () => {
      let cloudRaw: State | null = null;
      try { cloudRaw = await loadStateFromCloud(); }
      catch (err) { console.warn("Could not load state from Cloud Firestore, trying local storage fallback", err); }

      const [scopedRaw, legacyRaw, legacyOwnerUid] = await Promise.all([
        getStorage(stateKeyForUid(uid)),
        getStorage(LEGACY_STATE_KEY),
        getStorage(LEGACY_STATE_OWNER_KEY),
      ]);

      const bootstrap = resolveBootstrapState({
        uid, scopedLocalRaw: scopedRaw, legacyLocalRaw: legacyRaw, legacyOwnerUid,
        cloudRaw, migrate, fresh: defaultState, currentSchemaVersion: CURRENT_SCHEMA_VERSION,
      });
      if (!active || auth.currentUser?.uid !== uid) return;

      const loaded = bootstrap.state;
      setState(loaded);
      await setStorage(stateKeyForUid(uid), JSON.stringify(loaded));
      if (bootstrap.claimLegacy) await setStorage(LEGACY_STATE_OWNER_KEY, uid);
      if (bootstrap.shouldUploadCloud) nuvem.agendar(loaded, uid);
      setScreen(loaded.kids.length ? { name: "pick" } : { name: "setup" });
    })();

    return () => { active = false; };
  }, [userEmail, visitorMode]);

  useEffect(() => {
    if (state) {
      setSoundOn(state.sound !== false);
    }
  }, [state]);

  /**
   * @param imediato sobe para a nuvem agora, sem esperar a janela do
   * amortecedor. Use quando o estado é estrutural (perfil criado ou apagado,
   * reset) ou quando a missão terminou — momentos em que o usuário espera que
   * o outro aparelho já enxergue a mudança.
   */
  const persist = (s: State, imediato = false) => {
    const carimbado = carimbar(s);
    setState(carimbado);
    const uid = auth.currentUser?.uid ?? null;
    const destino = destinoDoProgresso({ uid, visitante: visitorMode, e2e: E2E });

    if (destino === "nenhum") return;

    if (destino === "local") {
      // Visitante: sem UID, o progresso ainda precisa sobreviver ao fechamento
      // do app. `LEGACY_STATE_KEY` é a chave que o boot lê no ramo do visitante
      // — antes disto só o gancho de teste a escrevia, e a criança perdia
      // perfil e progresso a cada reabertura.
      void setStorage(LEGACY_STATE_KEY, JSON.stringify(carimbado)).catch((e) => {
        console.error("Não consegui gravar o progresso local:", e);
      });
      return;
    }

    void setStorage(stateKeyForUid(uid), JSON.stringify(carimbado)).catch((e) => {
      console.error("Não consegui gravar o progresso local:", e);
    });
    nuvem.agendar(carimbado, uid);
    if (imediato) void nuvem.descarregar();
  };

  // A guarda exigia `state` para desenhar qualquer tela, e `state` só nascia
  // depois de uma sessão do Firebase. Sem sessão — a situação de toda criança na
  // primeira vez — o login nunca era desenhado e o app ficava em "Carregando
  // SAGA..." para sempre, com as 90 competências atrás de uma porta que não
  // abria. Quem decide agora é `entradaDoApp`, e o login é desenhável sem estado.
  if (mostrandoCarregamento(screen.name, Boolean(state))) {
    return (
      <Shell>
        <div className="mt-28 text-center flex flex-col items-center justify-center gap-4">
          <div className="animate-bounce"><SagaLogo size={80} /></div>
          <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.sub }}>
            Carregando SAGA...
          </div>
        </div>
      </Shell>
    );
  }

  const handleLoginSuccess = (email: string) => {
    // Identidade muda aqui; estado é instalado exclusivamente pelo bootstrap.
    setUserEmail(email);
  };

  const handleContinueAsVisitor = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("mk-visitor-mode", "true");
    }
    setVisitorMode(true);
  };

  // O login é a única tela que existe ANTES de haver estado, e por isso sai
  // aqui, antes de qualquer derivação. Tudo o que vem abaixo lê `state` sem
  // checar — `const sound = state.sound !== false` é a primeira linha a
  // quebrar —, e com `strictNullChecks` desligado o compilador não avisaria.
  // Foi assim que a porta de entrada ficou trancada sem nenhum teste vermelho.
  if (!state) {
    return (
      <Shell screenName="login">
        <LoginScreen onLoginSuccess={handleLoginSuccess} onContinueAsVisitor={handleContinueAsVisitor} />
      </Shell>
    );
  }

  const kidById = (id: string) => state.kids.find((k) => k.id === id) || state.kids[0];
  
  const getTracksForKid = (k: Kid): Track[] => {
    // A Jornada mostra o mapa matemático completo. O DAG controla o acesso na UI;
    // série/idade não apagam nós e tracks travadas continuam visíveis no caminho.
    const mathTracks = Array.from(new Map(ALL_MATH_TRACKS.map(t => [t.id, t])).values());

    const custom = (state.customTracks || [])
      // removed filter by grade here too
      .map((t: any) => ({
        id: t.id,
        name: t.name,
        icon: t.icon,
        color: "#8A2BE2",
        dark: "#4B0082",
        gen: (lvl: number) => {
          const qList = t.questions || [];
          if (qList.length === 0) {
            return {
              kind: "plain",
              prompt: "Vamos praticar!",
              big: "✨",
              options: [{ label: "1", value: 1 }],
              answer: 1,
            };
          }
          return qList[Math.floor(Math.random() * qList.length)];
        },
        questions: t.questions,
      }));
    return [...mathTracks, ...custom];
  };

  const getProg = (kidId: string, trackId: string): Progress => {
    const kidProg = state.progress[kidId] || {};
    return kidProg[trackId] ? { ...kidProg[trackId] } : { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
  };

  const coinsOf = (kidId: string) => (state.coins && state.coins[kidId]) || 0;
  const albumOf = (kidId: string) => (state.album && state.album[kidId]) || [];
  const logOf = (kidId: string) => (state.log && state.log[kidId]) || [];
  const sound = state.sound !== false;
  const toggleSound = () => persist({ ...state, sound: !sound });

  /** Missões já completadas hoje (para o bônus 🪙 da primeira missão do dia). */
  const missionsToday = (kidId: string) => {
    const lg = logOf(kidId);
    const last = lg[lg.length - 1];
    return last && last.d === localDay() ? last.m || 0 : 0;
  };

  const rewardModeForTrack = (trackId: string): RewardMode => {
    if (trackId === "mista" || trackId === "mixed") return "mixed";
    if (trackId === "matricula") return "placement";
    if (trackId.startsWith("dojo")) return "dojo";
    return "journey";
  };

  const commitProg = (
    kidId: string,
    trackId: string,
    p: Progress,
    right: boolean,
    starGain: number,
    durationMs = 0,
    missionDone = false
  ) => {
    const today = localDay();
    const lg = [...logOf(kidId)];
    const last = lg[lg.length - 1];
    const doneBefore = last && last.d === today ? last.m || 0 : 0;
    const rewardMode = rewardModeForTrack(trackId);
    const answerReward = rewardForTerminalAnswer(right, rewardMode);
    const completionReward = missionDone
      ? rewardForMissionCompletion(rewardMode, doneBefore === 0)
      : { xp: 0, coins: 0, freeFood: 0 };
    const coinGain = answerReward.coins + completionReward.coins;

    if (last && last.d === today) {
      lg[lg.length - 1] = {
        ...last,
        ok: last.ok + (right ? 1 : 0),
        tot: last.tot + 1,
        stars: last.stars + starGain,
        t: (last.t || 0) + durationMs,
        m: (last.m || 0) + (missionDone ? 1 : 0),
      };
    } else {
      lg.push({ d: today, ok: right ? 1 : 0, tot: 1, stars: starGain, t: durationMs, m: missionDone ? 1 : 0 });
    }

    // 🍖 Ração grátis do dia: completar a PRIMEIRA missão do dia rende 1 ração.
    const freeFood = missionDone ? completionReward.freeFood : 0;
    // 👑 Desafio Misto completado hoje: marca o dia (só pode 1×/dia).
    const mixedDone = missionDone && (trackId === "mista" || trackId === "mixed");

    // 🎒 Matrícula (E3): guarda o acerto de cada sonda; no FIM da missão, SEMEIA o
    // nível real das trilhas sondadas (sem jamais sobrescrever progresso existente).
    const kidProgress: Record<string, Progress> = { ...(state.progress[kidId] || {}), [trackId]: p };
    if (trackId === "matricula" && matriculaBuild) {
      if (p.tot <= 1) matResultsRef.current = [];
      matResultsRef.current.push(right);
      if (missionDone) {
        const seeds = seedFromResults(matriculaBuild.ladder, matResultsRef.current);
        for (const [tid, sp] of Object.entries(seeds)) {
          if (!kidProgress[tid]) kidProgress[tid] = sp;
        }
      }
    }

    persist({
      ...state,
      kids: freeFood || mixedDone
        ? state.kids.map((k) =>
            k.id === kidId
              ? {
                  ...k,
                  petFood: (k.petFood || 0) + freeFood,
                  ...(mixedDone ? { lastMixedDay: today } : {}),
                }
              : k
          )
        : state.kids,
      progress: {
        ...state.progress,
        [kidId]: kidProgress,
      },
      coins: { ...state.coins, [kidId]: coinsOf(kidId) + coinGain },
      log: { ...state.log, [kidId]: lg.slice(-366) },
    },
    // Fim de missão sobe na hora: é o marco que o pai vê no painel e o ponto em
    // que o outro aparelho precisa estar em dia. Durante a missão, o estado
    // intermediário não interessa a ninguém e fica no amortecedor.
    missionDone);
  };

  const commitJardimRound = (
    kidId: string,
    trailId: string,
    motherId: string,
    result: JardimRoundResult,
    summary: JardimMissionSummary,
  ) => {
    const today = localDay();
    const lg = [...logOf(kidId)];
    const last = lg[lg.length - 1];
    const doneBefore = last && last.d === today ? last.m || 0 : 0;

    if (last && last.d === today) {
      lg[lg.length - 1] = {
        ...last,
        ok: last.ok + summary.measuredCorrect,
        tot: last.tot + summary.total,
        stars: last.stars + summary.stars,
        t: (last.t || 0) + summary.durationMs,
        m: (last.m || 0) + 1,
      };
    } else {
      lg.push({ d: today, ok: summary.measuredCorrect, tot: summary.total, stars: summary.stars, t: summary.durationMs, m: 1 });
    }

    const kidProgress = { ...(state.progress[kidId] || {}) };
    const mother = kidProgress[motherId] ? { ...kidProgress[motherId] } : getProg(kidId, motherId);
    for (const tag of result.misconceptions) trackMisconception(mother, tag);
    kidProgress[motherId] = mother;

    const kidDojo = {
      ...((state.dojoTracks || {})[kidId] || {}),
      [trailId]: result.state,
    };
    const answerCoins = summary.rewardedCorrect * rewardForTerminalAnswer(true, "garden").coins;
    const completionReward = rewardForMissionCompletion("garden", doneBefore === 0);
    const coinGain = answerCoins + completionReward.coins;
    const freeFood = completionReward.freeFood;

    persist({
      ...state,
      kids: freeFood
        ? state.kids.map(k => k.id === kidId ? { ...k, petFood: (k.petFood || 0) + freeFood } : k)
        : state.kids,
      progress: { ...state.progress, [kidId]: kidProgress },
      dojoTracks: { ...(state.dojoTracks || {}), [kidId]: kidDojo },
      coins: { ...state.coins, [kidId]: coinsOf(kidId) + coinGain },
      log: { ...state.log, [kidId]: lg.slice(-366) },
    }, true);
  };

  const handleFactoryReset = () => {
    const freshState = defaultState();
    persist(freshState, true);
    setScreen({ name: "setup" });
  };

  const handleDeleteKid = (kidId: string) => {
    const updatedKids = state.kids.filter((k) => k.id !== kidId);
    
    const updatedProgress = { ...state.progress };
    delete updatedProgress[kidId];
    
    const updatedCoins = { ...state.coins };
    delete updatedCoins[kidId];

    const updatedDojoTracks = { ...(state.dojoTracks || {}) };
    delete updatedDojoTracks[kidId];

    const updatedAlbum = { ...state.album };
    delete updatedAlbum[kidId];

    const updatedLog = { ...state.log };
    delete updatedLog[kidId];

    const newState = {
      ...state,
      kids: updatedKids,
      progress: updatedProgress,
      dojoTracks: updatedDojoTracks,
      coins: updatedCoins,
      album: updatedAlbum,
      log: updatedLog,
    };

    if (updatedKids.length === 0) {
      handleFactoryReset();
    } else {
      persist(newState, true);
    }
  };

  const handleAddKid = (newKid: Kid) => {
    const newState = {
      ...state,
      kids: [...state.kids, newKid],
      progress: { ...state.progress, [newKid.id]: {} },
      dojoTracks: { ...(state.dojoTracks || {}), [newKid.id]: {} },
      coins: { ...state.coins, [newKid.id]: 0 },
      album: { ...state.album, [newKid.id]: [] },
      log: { ...state.log, [newKid.id]: [] },
    };
    persist(newState, true);
  };

  const handleLogout = async () => {
    // O último save sobe enquanto o UID antigo ainda é o usuário atual.
    await nuvem.descarregar();
    await logoutUser();
    setUserEmail(null);
    setVisitorMode(false);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("mk-visitor-mode");
    }
    setState(defaultState());
    setScreen({ name: "login" });
  };

  return (
    <Shell theme={screen.kid ? kidById(screen.kid).theme : "classico"} screenName={screen.name}>
      {/* Visual Screen Router Transitions using framer-motion */}
      <motion.div
        key={screen.name + (screen.kid || "") + (screen.track || "") + (screen.lvl || "")}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {screen.name === "login" && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onContinueAsVisitor={handleContinueAsVisitor}
          />
        )}

        {screen.name === "setup" && (
          <SetupScreen
            initial={state ? state.kids : []}
            onLogout={handleLogout}
            onDone={(kids) => {
              if (state) {
                persist({ ...state, kids });
              }
              setScreen({ name: "pick" });
            }}
          />
        )}

        {screen.name === "pick" && state && (
          <PickScreen
            state={state}
            onKid={(id) => setScreen({ name: "home", kid: id })}
            onParent={() => setScreen({ name: "parent" })}
            onFactoryReset={handleFactoryReset}
            userEmail={userEmail}
            onLogout={handleLogout}
            onTriggerLogin={() => {
              // Mantém o Firebase anônimo vivo: login Google poderá LINKAR o
              // mesmo UID e preservar o save local/cloud dessa família.
              setScreen({ name: "login" });
            }}
            onTriggerAdmin={() => setScreen({ name: "admin" })}
            onAddKid={handleAddKid}
            onDeleteKid={handleDeleteKid}
          />
        )}

        {screen.name === "home" && state && (
          <KidHomeScreen
            state={state}
            kid={kidById(screen.kid!)}
            coins={coinsOf(screen.kid!)}
            streak={calcStreak(logOf(screen.kid!))}
            albumCount={albumOf(screen.kid!).length}
            onBack={() => setScreen({ name: "pick" })}
            onAlbum={() => setScreen({ name: "album", kid: screen.kid })}
            onTrackLvl={(t, lvl, dojoSource) => setScreen({ name: "game", kid: screen.kid, track: t.id, lvl, dojoSource })}
            onMixed={() => {
              setScreen({ name: "game", kid: screen.kid, track: "mista" });
            }}
            onAula={() => setScreen({ name: "game", kid: screen.kid, track: "aula" })}
            onRescue={(rescue) => setScreen({
              name: "game",
              kid: screen.kid,
              track: rescue.track.id,
              rescue: rescue.requiredLevel ? {
                requiredLevel: rescue.requiredLevel,
                questionBudget: rescue.questionBudget || 4,
              } : undefined,
            })}
            onMatricula={() => setScreen({ name: "game", kid: screen.kid, track: "matricula" })}
            tracks={getTracksForKid(kidById(screen.kid!))}
            onUpdateKid={(updatedKid, coinsToSpend = 0) => {
              const kidId = screen.kid!;
              const tx = applyKidPurchase(state, kidId, updatedKid, coinsToSpend);
              if (tx.ok) persist(tx.state);
            }}
            onSpendCoins={(amt) => {
              const kidId = screen.kid!;
              const tx = spendCoins(state, kidId, amt);
              if (tx.ok) persist(tx.state);
            }}
          />
        )}

        {screen.name === "game" && state && (() => {
          const kidObj = kidById(screen.kid!);
          const kidStars = getKidLifetimeStars(kidObj.id, state);
          const kidStage = getMascotStage(kidStars).stage;
          const jardimConfig = jardimTrilhaPorId(screen.track);
          const jardimState = jardimConfig
            ? resolveJardimState(
                jardimConfig,
                (state.progress[kidObj.id] || {})[jardimConfig.mae],
                ((state.dojoTracks || {})[kidObj.id] || {})[jardimConfig.ficha.id],
              )
            : null;
          const prescribedDojoTemple = screen.dojoSource === "prescribed"
            ? senseiDojoTempleById(screen.track)
            : undefined;
          const gameTrack = jardimConfig
            ? jardimTrack(jardimConfig)
            : prescribedDojoTemple
            ? senseiDojoTrack(prescribedDojoTemple, "prescribed")
            : screen.track === "mista" || screen.track === "mixed"
              ? mixedTrack!
              : screen.track === "aula"
              ? aulaTrack!
              : screen.track === "dojo"
              ? dojoBuild!
              : screen.track === "matricula"
              ? matriculaBuild!.track
              : (() => {
                  let found = getTracksForKid(kidObj).find((t) => t.id === screen.track);
                  if (!found) {
                    const allTracks = ["pre", "ano1", "ano2"].flatMap(g => tracksForGrade(g as any));
                    found = allTracks.find((t) => t.id === screen.track) || dojoTracks.find(t => t.id === screen.track);
                  }
                  if (!found) {
                    console.error("TRACK NOT FOUND:", screen.track);
                    return getTracksForKid(kidObj)[0];
                  }
                  return found;
                })();
          const activeTrack = screen.rescue
            ? { ...gameTrack, totalQ: screen.rescue.questionBudget }
            : gameTrack;
          return (
            <GameLoop
              kid={kidObj}
              track={activeTrack}
              prog0={jardimState
                ? jardimProgressProjection(jardimState)
                : screen.rescue
                  ? { ...getProg(screen.kid!, screen.track!), streak: 0 }
                  : screen.lvl
                    ? { ...getProg(screen.kid!, screen.track!), lvl: screen.lvl }
                    : getProg(screen.kid!, screen.track!)}
              exactLvl={!!jardimState || !!screen.rescue || !!screen.lvl || !!screen.dojoSource || screen.track === "aula" || screen.track === "matricula"} // sequências puras: sem banco/aquecimento por cima
              rescue={jardimState ? undefined : screen.rescue}
              progressionMode={jardimState ? "garden" : "journey"}
              gardenState={jardimState || undefined}
              sound={sound}
              onToggleSound={toggleSound}
              onCommit={(p, right, gain, ms, missionDone) => commitProg(screen.kid!, screen.track!, p, right, gain, ms, missionDone)}
              onGardenRound={jardimConfig ? (result, summary) =>
                commitJardimRound(screen.kid!, jardimConfig.ficha.id, jardimConfig.mae, result, summary)
                : undefined}
              onExit={() => setScreen({ name: "home", kid: screen.kid })}
              onAlbum={() => setScreen({ name: "album", kid: screen.kid })}
              stage={kidStage}
              firstMissionToday={missionsToday(screen.kid!) === 0}
            />
          );
        })()}

        {screen.name === "album" && state && (
          <AlbumScreen
            kid={kidById(screen.kid!)}
            coins={coinsOf(screen.kid!)}
            owned={albumOf(screen.kid!).length ? albumOf(screen.kid!) : []}
            onBuy={(id, cost) => {
              const kidId = screen.kid!;
              const tx = purchaseAlbumItem(state, kidId, id, cost);
              if (tx.ok) persist(tx.state);
            }}
            onBack={() => setScreen({ name: "home", kid: screen.kid })}
          />
        )}

        {screen.name === "parent" && state && (
          <ParentDashboard
            state={state}
            sound={sound}
            onToggleSound={toggleSound}
            onUpdateKids={(kids) => persist({ ...state, kids })}
            onResetKid={(id) => persist({
              ...state,
              progress: { ...state.progress, [id]: {} },
              dojoTracks: { ...(state.dojoTracks || {}), [id]: {} },
              log: { ...state.log, [id]: [] },
            })}
            onDeleteKid={handleDeleteKid}
            onAddKid={handleAddKid}
            onFactoryReset={handleFactoryReset}
            onBack={() => setScreen({ name: "pick" })}
            onUpdateState={(newState) => persist(newState)}
            userEmail={userEmail}
            onLogout={handleLogout}
            onTriggerAdmin={() => setScreen({ name: "admin" })}
          />
        )}

        {screen.name === "galeria" && (
          <GalleryScreen onExit={() => setScreen({ name: "home", kid: screen.kid })} />
        )}

        {screen.name === "admin" && state && (
          <AdminDashboardScreen 
            state={state}
            onUpdateState={(st) => persist(st)}
            onBack={() => setScreen({ name: "pick" })}
            onTestTrack={(trackId) => {
              if (state.kids.length > 0) {
                setScreen({ name: "game", kid: state.kids[0].id, track: trackId });
              } else {
                const devKidId = "dev_" + Date.now();
                const newState = {
                  ...state,
                  kids: [{ id: devKidId, name: "Dev Tester", avatar: "🤖", grade: "pre" as any, theme: "classico" as any }],
                };
                persist(newState);
                setScreen({ name: "game", kid: devKidId, track: trackId });
              }
            }}
            onTestTrackLvl={(trackId, lvl) => {
              if (state.kids.length > 0) {
                setScreen({ name: "game", kid: state.kids[0].id, track: trackId, lvl });
              } else {
                const devKidId = "dev_" + Date.now();
                const newState = {
                  ...state,
                  kids: [{ id: devKidId, name: "Dev Tester", avatar: "🤖", grade: "pre" as any, theme: "classico" as any }],
                };
                persist(newState);
                setScreen({ name: "game", kid: devKidId, track: trackId, lvl });
              }
            }}
            onTestMascotV2={() => setScreen({ name: "mascot-test" })}
          />
        )}

        {screen.name === "mascot-test" && (
          <div className="min-h-screen bg-slate-900 text-white p-4 relative">
            <button 
              onClick={() => {
                sfx.tick();
                setScreen({ name: "admin" });
              }}
              className="mb-4 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold shadow cursor-pointer transition-colors z-50 relative"
            >
              ← Voltar ao Admin
            </button>
            <MascotEnvironment />
          </div>
        )}
      </motion.div>

      {/* Admin God Panel: SÓ em desenvolvimento — nunca no app das crianças (porta de fundos) */}
      {Boolean((import.meta as any).env?.DEV) && showAdmin && state && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl relative border-4 border-amber-400 p-6 animate-[mkPop_0.25s_ease-out_1]">
            <button
              onClick={() => {
                sfx.tick();
                setShowAdmin(false);
              }}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-full border-none outline-none transition-all z-10"
            >
              ✕
            </button>
            <div className="max-h-[80vh] overflow-y-auto pr-1">
              <AdminGodPanel
                state={state}
                onUpdateState={(ns) => persist(ns)}
                onClose={() => setShowAdmin(false)}
                onTestMascotV2={() => {
                  setShowAdmin(false);
                  setScreen({ name: "mascot-test" });
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}