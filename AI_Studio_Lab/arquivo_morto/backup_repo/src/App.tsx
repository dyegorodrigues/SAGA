import React, { useState, useEffect, useMemo } from "react";
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
import { GameLoop } from "./components/GameLoop";
import { ParentDashboard } from "./components/ParentDashboard";
import { getKidLifetimeStars, getMascotStage } from "./components/MascotEvolution";
import { TRACKS_PRE, TRACKS_ANO1 } from "./utils/generators";
import { tracksForGrade } from "./subjects";
import { buildMixedTrack } from "./utils/mixedChallenge";
import { saveStateToCloud, loadStateFromCloud, getCurrentUserEmail, logoutUser, auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LoginScreen } from "./components/LoginScreen";
import { AdminGodPanel } from "./components/AdminGodPanel";

/* ============================================================
   MATEMÁGICA IA — Matemática Adaptativa & Tutoria Inteligente (PT-BR)
   ============================================================ */

const getDefaultPetName = (theme: string) => {
  const names: Record<string, string> = {
    classico: "Mago",
    homem_aranha: "Teioso",
    batman: "Morceguinho",
    elsa: "Floquinho",
    pikachu: "Faísca",
    heroi: "Super-Pet",
    futebol: "Golzinho",
    musica: "Batuque",
    dino: "Dininho",
  };
  return names[theme] || "Bichinho";
};

const defaultState = (): State => ({
  kids: [],
  progress: {},
  coins: {},
  album: {},
  log: {},
  sound: true,
  customTracks: [],
});

function migrate(s: any): State {
  const m = { ...s };
  const today = localDay();
  m.kids = (m.kids || []).map((k: any) => {
    const updated = {
      theme: "classico",
      age: k.grade === "pre" ? 4 : 6,
      petEnergy: k.petEnergy != null ? k.petEnergy : 80,
      petFood: k.petFood != null ? k.petFood : 3,
      ...k,
    };
    if (!updated.petName) {
      updated.petName = getDefaultPetName(updated.theme);
    }
    // Decaimento gentil da energia: 25 por dia parado, mínimo 0.
    // Barra vazia = pet sonolento (boceja). NUNCA adoece, morre ou regride.
    const lastDay = updated.petDay || today;
    const days = Math.max(
      0,
      Math.round((new Date(today).getTime() - new Date(lastDay).getTime()) / 86400000)
    );
    if (days > 0) {
      updated.petEnergy = Math.max(0, (updated.petEnergy ?? 80) - 25 * days);
    }
    updated.petDay = today;
    return updated;
  });
  m.coins = m.coins || {};
  m.album = m.album || {};
  m.log = m.log || {};
  m.progress = m.progress || {};
  m.customTracks = m.customTracks || [];

  for (const k of m.kids) {
    const prog = { ...(m.progress[k.id] || {}) };
    // Migração da economia dupla: moedinhas iniciais = saldo gastável antigo
    // (wallet) ou, em saves muito antigos, o total de estrelas acumulado.
    if (m.coins[k.id] == null) {
      m.coins[k.id] =
        (m.wallet && m.wallet[k.id] != null)
          ? m.wallet[k.id]
          : Object.values(prog).reduce((t: number, x: any) => t + (x.stars || 0), 0);
    }
    if (!m.album[k.id]) m.album[k.id] = [];
    if (!m.log[k.id]) m.log[k.id] = [];
    for (const tid of Object.keys(prog)) {
      if (!prog[tid].bank) {
        prog[tid] = { ...prog[tid], bank: [], mast: prog[tid].mast || 0 };
      }
      // Bolinhas conquistadas: saves antigos herdam o nível atual como o máximo já alcançado
      if (prog[tid].maxLvl == null) {
        prog[tid] = { ...prog[tid], maxLvl: prog[tid].lvl || 1, dom: prog[tid].dom || false };
      }
    }
    m.progress[k.id] = prog;
  }
  if (m.sound == null) m.sound = true;
  return m as State;
}

const localDay = (dt = new Date()) =>
  dt.getFullYear() +
  "-" +
  String(dt.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(dt.getDate()).padStart(2, "0");

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

/* ---------------- Theme-Specific Background Decorations ---------------- */
function ThemeDecor({ theme }: { theme: string }) {
  if (theme === "dino") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Floating organic items */}
        <span className="absolute text-4xl" style={{ top: "15%", left: "4%", animation: "mkDrift 9s ease-in-out infinite" }}>🌿</span>
        <span className="absolute text-3xl" style={{ top: "45%", right: "6%", animation: "mkDrift 11s ease-in-out infinite", animationDelay: "-2s" }}>🦴</span>
        <span className="absolute text-2xl" style={{ top: "72%", left: "6%", animation: "mkDrift 8s ease-in-out infinite", animationDelay: "-4s" }}>🍃</span>
        <span className="absolute text-4xl" style={{ top: "25%", right: "10%", animation: "mkDrift 10s ease-in-out infinite", animationDelay: "-6s" }}>🦕</span>
        <span className="absolute text-3xl" style={{ top: "58%", left: "8%", animation: "mkDrift 12s ease-in-out infinite", animationDelay: "-1s" }}>🦖</span>

        {/* Cute active volcano at the bottom left */}
        <div className="absolute bottom-[-15px] left-[-25px] opacity-90 scale-75 md:scale-95" style={{ transformOrigin: "bottom left" }}>
          <svg width="150" height="150" viewBox="0 0 100 100">
            <polygon points="10,100 50,30 90,100" fill="#7D5C45" />
            <polygon points="35,53 50,30 65,53" fill="#D35400" />
            <ellipse cx="50" cy="31" rx="10" ry="4" fill="#E74C3C" />
            <path d="M47 32 Q50 50 48 65 Q50 75 52 80" stroke="#FF5733" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M53 32 Q55 45 57 58 Q54 68 53 72" stroke="#FFC300" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <rect x="5" y="90" width="90" height="10" rx="4" fill="#2ECC71" />
            <circle cx="20" cy="88" r="8" fill="#27AE60" />
            <circle cx="82" cy="89" r="7" fill="#27AE60" />
          </svg>
          <span className="absolute" style={{ top: "15px", left: "42px", fontSize: "20px", animation: "mkPuff 4s ease-in-out infinite" }}>💭</span>
          <span className="absolute" style={{ top: "8px", left: "48px", fontSize: "15px", animation: "mkPuff 4.5s ease-in-out infinite", animationDelay: "1.8s" }}>💭</span>
        </div>

        {/* Shaking dinosaur egg in a nest at bottom right */}
        <div className="absolute bottom-2 right-4 opacity-95 scale-90">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <path d="M10 65 Q40 85 70 65 Q70 75 60 78 Q40 82 20 78 Q10 75 10 65 Z" fill="#D35400" />
            <path d="M15 62 C30 58, 50 58, 65 62 C60 70, 40 72, 20 70 Z" fill="#A04000" />
            <g style={{ animation: "mkSway 2.4s ease-in-out infinite", transformOrigin: "40px 60px" }}>
              <ellipse cx="40" cy="46" rx="18" ry="24" fill="#FCF3CF" stroke="#D4AC0D" strokeWidth="1.5" />
              <circle cx="32" cy="40" r="3" fill="#F4D03F" />
              <circle cx="48" cy="36" r="4.5" fill="#F4D03F" />
              <circle cx="44" cy="54" r="3.5" fill="#F4D03F" />
              <circle cx="34" cy="50" r="2.5" fill="#F4D03F" />
            </g>
          </svg>
        </div>
      </div>
    );
  }

  if (theme === "heroi") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <span className="absolute text-5xl" style={{ top: "12%", left: "5%", animation: "mkDrift 7s ease-in-out infinite" }}>⚡</span>
        <span className="absolute text-4xl" style={{ top: "52%", right: "5%", animation: "mkDrift 9s ease-in-out infinite", animationDelay: "-1.5s" }}>🛡️</span>
        <span className="absolute text-3xl" style={{ top: "78%", left: "10%", animation: "mkDrift 8s ease-in-out infinite", animationDelay: "-3s" }}>💥</span>
        <span className="absolute text-4xl" style={{ top: "28%", right: "10%", animation: "mkDrift 10s ease-in-out infinite", animationDelay: "-4.5s" }}>🚀</span>

        <span className="absolute font-black text-rose-500 text-xs px-2 py-1 bg-amber-300 rounded border-2 border-slate-900 rotate-[-12deg]" style={{ top: "42%", left: "4%", animation: "mkPulse 2.8s ease-in-out infinite" }}>
          POW!
        </span>
        <span className="absolute font-black text-blue-600 text-xs px-2 py-1 bg-yellow-300 rounded border-2 border-slate-900 rotate-[15deg]" style={{ top: "22%", right: "4%", animation: "mkPulse 3.2s ease-in-out infinite", animationDelay: "1s" }}>
          BOOM!
        </span>
      </div>
    );
  }

  if (theme === "futebol") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <span className="absolute text-3xl" style={{ top: "14%", left: "8%", animation: "mkDrift 10s ease-in-out infinite" }}>⚽</span>
        <span className="absolute text-4xl" style={{ top: "48%", right: "8%", animation: "mkDrift 8s ease-in-out infinite", animationDelay: "-2.5s" }}>🏆</span>
        <span className="absolute text-3xl" style={{ top: "74%", left: "10%", animation: "mkDrift 9s ease-in-out infinite", animationDelay: "-4s" }}>🥇</span>
        <span className="absolute text-2xl opacity-60" style={{ top: "28%", right: "14%", animation: "mkDrift 11s ease-in-out infinite", animationDelay: "-1s" }}>📣</span>

        <div className="absolute top-0 left-[-10%] w-[120%] h-full flex justify-between opacity-15">
          <div className="w-[120px] h-[500px] bg-gradient-to-b from-white to-transparent" style={{ transformOrigin: "top left", animation: "mkSpotlight 8s ease-in-out infinite" }} />
          <div className="w-[120px] h-[500px] bg-gradient-to-b from-white to-transparent" style={{ transformOrigin: "top right", animation: "mkSpotlight 9s ease-in-out infinite", animationDelay: "1.5s" }} />
        </div>
      </div>
    );
  }

  if (theme === "musica") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <span className="absolute text-3xl" style={{ top: "10%", left: "8%", animation: "mkDrift 8s ease-in-out infinite" }}>🎵</span>
        <span className="absolute text-4xl" style={{ top: "42%", right: "6%", animation: "mkDrift 11s ease-in-out infinite", animationDelay: "-2s" }}>🎶</span>
        <span className="absolute text-3xl" style={{ top: "78%", left: "6%", animation: "mkDrift 9s ease-in-out infinite", animationDelay: "-4s" }}>🎸</span>
        <span className="absolute text-4xl" style={{ top: "26%", right: "10%", animation: "mkDrift 10s ease-in-out infinite", animationDelay: "-6s" }}>🎧</span>
        <span className="absolute text-2xl opacity-50" style={{ top: "60%", left: "12%", animation: "mkDrift 7s ease-in-out infinite", animationDelay: "-1s" }}>🎹</span>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <span className="absolute select-none text-4xl opacity-50" style={{ top: 12, left: 0, animation: "mkCloud 48s linear infinite" }}>☁️</span>
      <span className="absolute select-none text-2xl opacity-40" style={{ top: 68, left: 0, animation: "mkCloud 66s linear infinite", animationDelay: "-24s" }}>☁️</span>
      <span className="absolute select-none text-xl opacity-35" style={{ top: 38, left: 0, animation: "mkCloud 84s linear infinite", animationDelay: "-50s" }}>☁️</span>
      
      <span className="absolute select-none text-sm" style={{ top: 96, left: 16, animation: "mkTwinkle 3.4s ease-in-out infinite" }}>✨</span>
      <span className="absolute select-none text-xs" style={{ top: 28, right: 24, animation: "mkTwinkle 4.2s ease-in-out infinite", animationDelay: "1.1s" }}>✨</span>
      <span className="absolute select-none text-base" style={{ top: "54%", left: "4%", animation: "mkTwinkle 3s ease-in-out infinite", animationDelay: "2s" }}>⭐</span>
      <span className="absolute select-none text-sm" style={{ top: "42%", right: "5%", animation: "mkTwinkle 3.8s ease-in-out infinite", animationDelay: "0.5s" }}>✨</span>
    </div>
  );
}

/* ---------------- Immersive Layout Shell ---------------- */
interface ShellProps {
  children: React.ReactNode;
  theme?: string;
}

export function Shell({ children, theme = "classico" }: ShellProps) {
  const t = THEMES[theme] || THEMES.classico;
  const bg = t.bg || ["#E4F0FF", C.bg];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden transition-colors duration-500 pb-16"
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

      {/* Theme-Specific Background Decorations component */}
      <ThemeDecor theme={theme} />

      <div className="relative mx-auto w-full max-w-md px-4 pt-5 pb-8">
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Main Component ---------------- */
export default function App() {
  const [state, setState] = useState<State | null>(null);
  const [screen, setScreen] = useState<{ name: string; kid?: string; track?: string; lvl?: number }>({ name: "loading" });
  const [userEmail, setUserEmail] = useState<string | null>(getCurrentUserEmail());
  // Gancho de teste E2E (só com ?e2e=1 na URL): entra como visitante e não deixa o
  // reset de auth do Firebase mandar de volta pro login. Inócuo em produção.
  const E2E = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("e2e");
  const [visitorMode, setVisitorMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return E2E || window.localStorage.getItem("mk-visitor-mode") === "true";
    }
    return false;
  });
  const [showAdmin, setShowAdmin] = useState(false);

  // Desafio Misto 👑: as 10 questões são montadas UMA vez ao entrar na missão
  // (o App re-renderiza a cada resposta; sem memo, a lista seria re-sorteada).
  const mixedTrack = useMemo(() => {
    if (!state || screen.name !== "game" || screen.track !== "mista" || !screen.kid) return null;
    const kid = state.kids.find((k) => k.id === screen.kid);
    if (!kid) return null;
    const base = tracksForGrade(kid.grade);
    const progOf = (tid: string) => {
      const kp = (state.progress[kid.id] || {})[tid];
      return kp ? { ...kp } : { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    };
    return buildMixedTrack(base, progOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.name, screen.kid, screen.track]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email || user.displayName || (user.isAnonymous ? "visitante" : "Conta Conectada");
        setUserEmail(email);
        setVisitorMode(user.isAnonymous);
      } else {
        setUserEmail(null);
        if (!E2E) setVisitorMode(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // If they aren't logged in AND aren't in visitor mode, route them to login!
    if (!userEmail && !visitorMode) {
      setScreen({ name: "login" });
      (async () => {
        let loadedState: State | null = null;
        try {
          const raw = await getStorage("mk-state-v1");
          if (raw) loadedState = JSON.parse(raw);
        } catch (e) {}
        setState(loadedState ? migrate(loadedState) : defaultState());
      })();
      return;
    }

    let active = true;
    (async () => {
      let loadedState: State | null = null;
      
      // 1. Attempt to load state from Cloud Firestore if they are logged in
      if (userEmail) {
        try {
          const cloudState = await loadStateFromCloud();
          if (cloudState) {
            loadedState = cloudState;
          }
        } catch (err) {
          console.warn("Could not load state from Cloud Firestore, trying local storage fallback", err);
        }
      }

      // 2. If Firestore state isn't found/loaded, fallback to local storage
      if (!loadedState) {
        try {
          const raw = await getStorage("mk-state-v1");
          if (raw) {
            loadedState = JSON.parse(raw);
          }
        } catch (e) {
          console.error("Erro ao carregar dados salvos locais:", e);
        }
      }

      if (!active) return;

      if (loadedState && loadedState.kids && loadedState.kids.length && loadedState.kids[0].name) {
        setState(migrate(loadedState));
        setScreen({ name: "pick" });
      } else {
        setState(loadedState ? migrate(loadedState) : defaultState());
        setScreen({ name: "setup" });
      }
    })();

    return () => {
      active = false;
    };
  }, [userEmail, visitorMode]);

  useEffect(() => {
    if (state) {
      setSoundOn(state.sound !== false);
    }
  }, [state]);

  const persist = (s: State) => {
    setState(s);
    (async () => {
      // 1. Persist locally first for instant offline availability
      try {
        await setStorage("mk-state-v1", JSON.stringify(s));
      } catch (e) {
        console.error("Não consegui gravar o progresso local:", e);
      }
      
      // 2. Synchronize to Firestore Cloud in the background so progress is never lost
      try {
        await saveStateToCloud(s);
      } catch (e) {
        console.error("Não consegui sincronizar com a nuvem:", e);
      }
    })();
  };

  if (!state || screen.name === "loading") {
    return (
      <Shell>
        <div className="mt-28 text-center flex flex-col items-center justify-center gap-4">
          <div className="text-5xl animate-bounce">🎩</div>
          <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: C.sub }}>
            Carregando matemágica...
          </div>
        </div>
      </Shell>
    );
  }

  const kidById = (id: string) => state.kids.find((k) => k.id === id)!;
  
  const getTracksForKid = (k: Kid): Track[] => {
    const base = tracksForGrade(k.grade);
    const custom = (state.customTracks || [])
      .filter((t: any) => t.grade === k.grade)
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
    return [...base, ...custom];
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

    // Economia dupla (Parte D do plano diretor):
    // ⭐ starGain = XP vitalício (nunca se gasta) → progress + log
    // 🪙 coinGain = 1 por acerto + 3 por missão completa + 5 na primeira missão do dia
    // Desafio Misto 👑 paga moedinhas em DOBRO.
    const doneBefore = last && last.d === today ? last.m || 0 : 0;
    const coinMult = trackId === "mista" ? 2 : 1;
    const coinGain = ((right ? 1 : 0) + (missionDone ? 3 + (doneBefore === 0 ? 5 : 0) : 0)) * coinMult;

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

    // 🍖 Ração grátis do dia: completar a PRIMEIRA missão do dia rende 1 ração
    const freeFood = missionDone && doneBefore === 0 ? 1 : 0;
    // 👑 Desafio Misto completado hoje: marca o dia (só pode 1×/dia)
    const mixedDone = missionDone && trackId === "mista";

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
        [kidId]: { ...(state.progress[kidId] || {}), [trackId]: p },
      },
      coins: { ...state.coins, [kidId]: coinsOf(kidId) + coinGain },
      log: { ...state.log, [kidId]: lg.slice(-366) },
    });
  };

  const handleFactoryReset = () => {
    const freshState = defaultState();
    persist(freshState);
    setScreen({ name: "setup" });
  };

  const handleDeleteKid = (kidId: string) => {
    const updatedKids = state.kids.filter((k) => k.id !== kidId);
    
    const updatedProgress = { ...state.progress };
    delete updatedProgress[kidId];
    
    const updatedCoins = { ...state.coins };
    delete updatedCoins[kidId];

    const updatedAlbum = { ...state.album };
    delete updatedAlbum[kidId];

    const updatedLog = { ...state.log };
    delete updatedLog[kidId];

    const newState = {
      ...state,
      kids: updatedKids,
      progress: updatedProgress,
      coins: updatedCoins,
      album: updatedAlbum,
      log: updatedLog,
    };

    if (updatedKids.length === 0) {
      handleFactoryReset();
    } else {
      persist(newState);
    }
  };

  const handleAddKid = (newKid: Kid) => {
    const newState = {
      ...state,
      kids: [...state.kids, newKid],
      progress: { ...state.progress, [newKid.id]: {} },
      coins: { ...state.coins, [newKid.id]: 0 },
      album: { ...state.album, [newKid.id]: [] },
      log: { ...state.log, [newKid.id]: [] },
    };
    persist(newState);
  };

  const handleLoginSuccess = (email: string, cloudState: State | null) => {
    setUserEmail(email);
    if (cloudState) {
      persist(migrate(cloudState));
    } else {
      // If there's no cloud state for this new user, start completely fresh with a clean slate!
      const fresh = defaultState();
      persist(fresh);
      setScreen({ name: "setup" });
    }
  };

  const handleContinueAsVisitor = () => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem("mk-visitor-mode", "true");
    }
    setVisitorMode(true);
  };

  const handleLogout = () => {
    logoutUser();
    setUserEmail(null);
    setVisitorMode(false);
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem("mk-visitor-mode");
    }
    setState(defaultState());
    setScreen({ name: "login" });
  };

  return (
    <Shell theme={screen.kid ? kidById(screen.kid).theme : "classico"}>
      {/* Visual Screen Router Transitions using framer-motion */}
      <motion.div
        key={screen.name + (screen.kid || "")}
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
              setUserEmail(null);
              setVisitorMode(false);
              if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.removeItem("mk-visitor-mode");
              }
              setScreen({ name: "login" });
            }}
            onTriggerAdmin={() => setShowAdmin(true)}
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
            onTrack={(t) => setScreen({ name: "game", kid: screen.kid, track: t.id })}
            onTrackLvl={(t, lvl) => setScreen({ name: "game", kid: screen.kid, track: t.id, lvl })}
            onMixed={() => setScreen({ name: "game", kid: screen.kid, track: "mista" })}
            mixedDoneToday={kidById(screen.kid!).lastMixedDay === localDay()}
            tracks={getTracksForKid(kidById(screen.kid!))}
            onUpdateKid={(updatedKid, coinsToSpend = 0) => {
              const kidId = screen.kid!;
              const currentCoins = coinsOf(kidId);
              persist({
                ...state,
                kids: state.kids.map((k) => (k.id === updatedKid.id ? updatedKid : k)),
                coins: coinsToSpend > 0
                  ? { ...state.coins, [kidId]: Math.max(0, currentCoins - coinsToSpend) }
                  : state.coins,
              });
            }}
            onSpendCoins={(amt) => {
              const kidId = screen.kid!;
              const currentCoins = coinsOf(kidId);
              persist({
                ...state,
                coins: { ...state.coins, [kidId]: Math.max(0, currentCoins - amt) },
              });
            }}
          />
        )}

        {screen.name === "game" && state && (() => {
          const kidObj = kidById(screen.kid!);
          const kidStars = getKidLifetimeStars(kidObj.id, state);
          const kidStage = getMascotStage(kidStars).stage;
          const gameTrack =
            screen.track === "mista"
              ? mixedTrack!
              : getTracksForKid(kidObj).find((t) => t.id === screen.track)!;
          return (
            <GameLoop
              kid={kidObj}
              track={gameTrack}
              prog0={screen.lvl ? { ...getProg(screen.kid!, screen.track!), lvl: screen.lvl } : getProg(screen.kid!, screen.track!)}
              exactLvl={!!screen.lvl}
              sound={sound}
              onToggleSound={toggleSound}
              onCommit={(p, right, gain, ms, missionDone) => commitProg(screen.kid!, screen.track!, p, right, gain, ms, missionDone)}
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
            owned={albumOf(screen.kid!)}
            onBuy={(id, cost) => {
              const w = coinsOf(screen.kid!);
              if (w < cost) return;
              persist({
                ...state,
                coins: { ...state.coins, [screen.kid!]: w - cost },
                album: { ...state.album, [screen.kid!]: [...albumOf(screen.kid!), id] },
              });
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
            onResetKid={(id) => persist({ ...state, progress: { ...state.progress, [id]: {} }, log: { ...state.log, [id]: [] } })}
            onDeleteKid={handleDeleteKid}
            onAddKid={handleAddKid}
            onFactoryReset={handleFactoryReset}
            onBack={() => setScreen({ name: "pick" })}
            tracksPre={TRACKS_PRE}
            tracksAno1={TRACKS_ANO1}
            onUpdateState={(newState) => persist(newState)}
            userEmail={userEmail}
            onLogout={handleLogout}
            onTriggerAdmin={() => setShowAdmin(true)}
          />
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
              />
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
