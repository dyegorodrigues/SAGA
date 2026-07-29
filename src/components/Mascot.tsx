import React from "react";
import { AudioPlayer } from "./AudioPlayer";
import { ThemeConfig } from "../types";

export const C = {
  bg: "#F1F7FF",
  ink: "#22315C",
  sub: "#6B7AA8",
  card: "#FFFFFF",
  line: "#D9E5F8",
  soft: "#EBF2FF",
  sun: "#FFC531",
  sunDark: "#D9A312",
  mint: "#2ED573",
  mintDark: "#1FA855",
  melon: "#FF6B6B",
  melonDark: "#D94A4A",
  grape: "#7C5CFF",
  grapeDark: "#5A3BE0",
  ocean: "#1E90FF",
  oceanDark: "#0F6FD0",
  pink: "#FF8FD8",
  pinkDark: "#D964AC",
};

export const FONT = "'Fredoka', 'Nunito', sans-serif";
export const BODY = "'Nunito',system-ui,sans-serif";

export const AVATARS = ["🦖", "🦄", "🐼", "🦊", "🐸", "🐙", "🦁", "🐰"];
export const EMO = ["🍎", "🐶", "⚽", "🍓", "🐟", "🚗", "🦆", "🌼", "🍪", "🎈", "🐞", "⭐"];
export const PATPOOL = ["🍎", "🍌", "⚽", "🐶", "🌞", "🚗", "🍓", "🐸", "⭐", "🎈", "🐟", "🌼"];
export const PATSETS = [["🍎", "🍌"], ["⚽", "🏀"], ["🐶", "🐱"], ["🌞", "🌙"], ["🚗", "🚌"], ["🍓", "🍇"], ["🐸", "🦆"]];
export const PRAISE = ["Você acertou! Que orgulho! 🎉", "Uau, você mandou muito bem! ⭐", "Isso mesmo! Você é brilhante! 🥳", "Parabéns, meu amiguinho! Que inteligência! 💪", "Uhul! Que lindo acerto! ✨", "Perfeito! Você brilha como uma estrela! 🌟"];
export const OOPS = ["Hum, quase! Mas você está indo muito bem! A resposta certa está com a cor verde bem ali embaixo! 👇", "Tudo bem, errar faz parte do jogo! Dá uma olhadinha no botão verde que é a resposta certa. ✨", "Excelente tentativa! O certo está destacado em verde para você ver como é fácil. 💚", "Sem problemas, meu campeão! O balão verde mostra o caminho certo. Vamos para a próxima? 😊"];

import { THEMES, THEME_EMOJIS } from "./mascots/MascotThemes";
export { THEMES, THEME_EMOJIS };

import { MascotRenderer } from "./mascots/MascotRenderer";

export function Mascote({
  theme = "classico",
  size = 96,
  className = "",
  outfit = "default",
  bgAccessory = "default",
  kid = null,
  stage = 3,
  animation = "idle",
  transparentBg = false,
}: {
  theme?: string;
  size?: number | string;
  className?: string;
  outfit?: string;
  bgAccessory?: string;
  kid?: any;
  stage?: number;
  animation?: "idle" | "walk" | "happy";
  transparentBg?: boolean;
}) {
  return (
    <MascotRenderer
      theme={theme}
      size={size}
      className={className}
      outfit={outfit}
      bgAccessory={bgAccessory}
      kid={kid}
      stage={stage}
      animation={animation}
      
    />
  );
}
export function MoneyCoin({ v }: { v: number }) {
  const config = {
    5: { c: "#C77B4A", t: "5", sub: "centavos" },
    10: { c: "#E0A33C", t: "10", sub: "centavos" },
    25: { c: "#E0A33C", t: "25", sub: "centavos" },
    50: { c: "#C9CDD4", t: "50", sub: "centavos" },
    100: { c: "#C9CDD4", t: "1", sub: "real", ring: "#E0A33C" },
  }[v] || { c: "#C9CDD4", t: String(v), sub: "Moeda" };

  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="25" fill={config.c} stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      {"ring" in config && config.ring && <circle cx="27" cy="27" r="17" fill={config.ring} />}
      <text x="27" y="28" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="16" fill="#4A3520">{config.t}</text>
      <text x="27" y="39" textAnchor="middle" fontFamily={BODY} fontWeight="800" fontSize="7" fill="#4A3520">{config.sub}</text>
    </svg>
  );
}

export function MoneyNote({ v }: { v: number }) {
  const cor = { 2: "#6FA8C9", 5: "#B58CC4", 10: "#C97A6B", 20: "#D9B84A" }[v] || "#9BB0C9";
  return (
    <svg width="86" height="42" viewBox="0 0 86 42">
      <rect x="2" y="2" width="82" height="38" rx="6" fill={cor} stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
      <rect x="8" y="8" width="70" height="26" rx="4" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <text x="43" y="27" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="15" fill="#fff">R$ {v}</text>
    </svg>
  );
}

export function SceneSVG({ items }: { items: { e: string; pos: string }[] }) {
  const slots: Record<string, [number, number]> = { cima: [130, 32], baixo: [130, 100], esq: [34, 102], dir: [226, 102] };
  return (
    <svg viewBox="0 0 260 132" style={{ width: "100%", maxWidth: 320, margin: "0 auto", display: "block" }}>
      <rect x="70" y="56" width="120" height="11" rx="5" fill="#8A5A2B" />
      <rect x="80" y="67" width="9" height="45" rx="3" fill="#8A5A2B" />
      <rect x="171" y="67" width="9" height="45" rx="3" fill="#8A5A2B" />
      <line x1="6" y1="114" x2="254" y2="114" stroke={C.line} strokeWidth="3" strokeLinecap="round" />
      {items.map((it, i) => {
        const coords = slots[it.pos];
        if (!coords) return null;
        const [x, y] = coords;
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize="30" style={{ animation: "mkPop .4s ease-out both", animationDelay: `${i * 130}ms`, transformBox: "fill-box", transformOrigin: "center" }}>{it.e}</text>
        );
      })}
    </svg>
  );
}

export function ShapeSVG({ id, color, size = 62 }: { id: string; color: string; size?: number }) {
  const common = { fill: color, stroke: "rgba(0,0,0,0.12)", strokeWidth: 3, strokeLinejoin: "round" as const };
  let el;
  if (id === "circ") el = <circle cx="50" cy="50" r="38" {...common} />;
  else if (id === "quad") el = <rect x="14" y="14" width="72" height="72" rx="10" {...common} />;
  else if (id === "ret") el = <rect x="6" y="28" width="88" height="44" rx="10" {...common} />;
  else if (id === "tri") el = <polygon points="50,10 92,86 8,86" {...common} />;
  else if (id === "est") el = <polygon points="50,6 61,37 94,37 67,57 77,90 50,70 23,90 33,57 6,37 39,37" {...common} />;
  else if (id === "cor") el = <path d="M50 86 C22 64 8 44 18 28 C27 14 45 17 50 31 C55 17 73 14 82 28 C92 44 78 64 50 86 Z" {...common} />;
  else el = <polygon points="50,6 90,50 50,94 10,50" {...common} />;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", margin: "0 auto" }}>
      {el}
    </svg>
  );
}

/* ---------------- Speech & Sound SFX ---------------- */
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;
let VOICE: SpeechSynthesisVoice | null = null;
let EN_VOICE: SpeechSynthesisVoice | null = null;

export function pickVoice() {
  try {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const vs = window.speechSynthesis.getVoices();
    VOICE = vs.find((v) => v.lang === "pt-BR" && v.name.includes("Google")) ||
            vs.find((v) => v.lang === "pt-BR" && v.name.includes("Natural")) ||
            vs.find((v) => v.lang === "pt-BR" && v.name.includes("Maria")) ||
            vs.find((v) => v.lang === "pt-BR" && v.name.includes("Daniela")) ||
            vs.find((v) => v.lang === "pt-BR") ||
            vs.find((v) => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
            null;
    // Voz inglesa (para a matéria de Inglês — o TTS fala en-US de graça)
    EN_VOICE = vs.find((v) => v.lang === "en-US" && v.name.includes("Google")) ||
               vs.find((v) => v.lang === "en-US" && v.name.includes("Natural")) ||
               vs.find((v) => v.lang === "en-US") ||
               vs.find((v) => v.lang && v.lang.toLowerCase().startsWith("en")) ||
               null;
  } catch (e) {}
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  pickVoice();
  window.speechSynthesis.onvoiceschanged = pickVoice;
}

export function ttsText(t: string): string {
  let cleaned = String(t)
    .replace(/=\s*\?/g, " dá quanto?")
    .replace(/▢/g, " quanto ")
    .replace(/\+/g, " mais ")
    .replace(/−/g, " menos ")
    .replace(/=/g, " é igual a ");

  // Remove emojis 
  cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  cleaned = cleaned.replace(EMOJI_RE, "");

  // Convert ALL CAPS words to lowercase to prevent TTS spelling out letter by letter
  // Regex matches words with 2 or more uppercase letters and no lowercase letters
  cleaned = cleaned.replace(/\b[A-ZÀ-ÖØ-Þ]{2,}\b/g, (match) => match.toLowerCase());

  // Fix onomatopoeia spelling issue
  cleaned = cleaned.replace(/[gG]+[oO]{2,}[lL]+[lL]*/gi, "gool");
  
  // Simplify other long repeating characters
  cleaned = cleaned.replace(/([a-zA-Z])\1{2,}/g, "$1$1");

  cleaned = cleaned
    .replace(/\bna gaveta\b/gi, "dentro da gaveta")
    .replace(/\bno armário\b/gi, "guardado no armário")
    .replace(/\bna mesa\b/gi, "em cima da mesa")
    .replace(/\bem cima\b/gi, "bem em cima")
    .replace(/\bembaixo\b/gi, "lá embaixo");

  return cleaned.replace(/\s+/g, " ").trim();
}

/* A VOZ NUNCA É CORTADA POR TIMER (a regra de ouro do áudio, auditoria do Zeus):
   - Falamos por FRASES em fila própria (o TTS do Chrome trava/corta utterances longas —
     bug conhecido; frases curtas nunca travam).
   - A salvaguarda de destravamento é PROPORCIONAL ao tamanho da frase (nunca dispara
     no meio de uma fala normal — antes era 4,5s fixos e decapitava explicações).
   - Cada speak() novo invalida a fila anterior (token): nada de "fala fantasma"
     continuando por trás. stopSpeak() derruba tudo (usar ao sair de tela). */
let SPEAK_SEQ = 0;

export function stopSpeak() {
  AudioPlayer.stop();
}

export function speak(text: string, opts: { rate?: number; pitch?: number; onEnd?: () => void; lang?: string } = {}) {
  // Use Luna Studio Pipeline / TTS Fallback
  AudioPlayer.speak(text, opts.onEnd);
}

let AC: AudioContext | null = null;

export function audioCtx() {
  try {
    if (typeof window === "undefined") return null;
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    if (!AC) AC = new Ctor();
    if (AC.state === "suspended") AC.resume();
    return AC;
  } catch (e) {
    return null;
  }
}

export function tone(freq: number, t0: number, dur: number, type: OscillatorType = "sine", vol = 0.16) {
  const ctx = audioCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const start = ctx.currentTime + t0;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(start);
    o.stop(start + dur + 0.05);
  } catch (e) {}
}

export let SOUND_ON = true;
export const setSoundOn = (v: boolean) => {
  SOUND_ON = v;
};

export const sfx = {
  tick() { if (SOUND_ON) tone(740, 0, 0.045, "triangle", 0.05); },
  right() { if (SOUND_ON) { tone(659, 0, 0.12); tone(880, 0.1, 0.2); } },
  wrong() { if (SOUND_ON) tone(233, 0, 0.25, "triangle", 0.1); },
  level() { if (SOUND_ON) { tone(523, 0, 0.12); tone(659, 0.11, 0.12); tone(784, 0.22, 0.22); } },
  fanfare() { if (SOUND_ON) { tone(523, 0, 0.14); tone(659, 0.13, 0.14); tone(784, 0.26, 0.14); tone(1047, 0.4, 0.4); } },
  buy() { if (SOUND_ON) { tone(880, 0, 0.1); tone(1175, 0.09, 0.1); tone(1568, 0.18, 0.25); } },
};

/* ---------------- Storage Helpers ---------------- */
export const getStorage = async (key: string): Promise<string | null> => {
  try {
    if (typeof window !== "undefined" && (window as any).storage) {
      const res = await (window as any).storage.get(key);
      return res ? res.value : null;
    }
  } catch (e) {
    console.warn("window.storage.get failed, falling back to localStorage", e);
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (e) {}
  return null;
};

export const setStorage = async (key: string, value: string): Promise<void> => {
  try {
    if (typeof window !== "undefined" && (window as any).storage) {
      await (window as any).storage.set(key, value);
      return;
    }
  } catch (e) {
    console.warn("window.storage.set failed, falling back to localStorage", e);
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {}
};

/* ---------------- Aesthetic UI Helpers ---------------- */
export const CoinChip = ({ n }: { n: number }) => (
  <span
    className="inline-flex items-center gap-1.5"
    style={{
      fontFamily: FONT,
      fontWeight: 600,
      background: "#FFEDD5",
      color: "#9A3412",
      border: "2px solid #FB923C",
      borderRadius: 999,
      padding: "4px 12px",
      fontSize: 15,
      whiteSpace: "nowrap",
    }}
  >
    🪙 {n}
  </span>
);

export const StarChip = ({ n }: { n: number }) => (
  <span
    className="inline-flex items-center gap-1.5"
    style={{
      fontFamily: FONT,
      fontWeight: 600,
      background: "#FFF4D1",
      color: "#9A7407",
      border: `2px solid ${C.sun}`,
      borderRadius: 999,
      padding: "4px 12px",
      fontSize: 15,
      whiteSpace: "nowrap",
    }}
  >
    ⭐ {n}
  </span>
);

/**
 * As 5 bolinhas = níveis CONQUISTADOS da trilha (nunca regridem).
 * A bolinha do nível atual pulsa; Domínio Absoluto 👑 (3 seguidos no nível 5)
 * pinta tudo de dourado e coroa a trilha. É o nosso "SmartScore" — com carinho.
 */
export const LevelDots = ({ lvl, conquered, dom, color }: { lvl: number; conquered?: number; dom?: boolean; color: string }) => {
  const filled = Math.max(conquered || 0, lvl);
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={i === lvl && !dom ? "animate-pulse" : ""}
          style={{
            width: 9,
            height: 9,
            borderRadius: 5,
            background: dom ? "#F59E0B" : i <= filled ? color : C.line,
            boxShadow: dom ? "0 0 4px #FBBF24" : i === lvl ? `0 0 0 2px ${C.line}` : "none",
            display: "inline-block",
          }}
        />
      ))}
      {dom && <span style={{ fontSize: 12, marginLeft: 2 }}>👑</span>}
    </span>
  );
};

export const ProgressBar = ({ idx, total }: { idx: number; total: number }) => (
  <div className="flex flex-1 gap-1">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className="flex-1 animate-pulse"
        style={{
          height: 10,
          borderRadius: 6,
          background: i < idx ? C.mint : i === idx ? C.sun : "#DCE7FA",
          transition: "background .3s",
        }}
      />
    ))}
  </div>
);

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mk-pop ${className}`} style={{ background: C.card, borderRadius: 24, boxShadow: `0 6px 0 ${C.line}`, padding: "18px 14px" }}>
    {children}
  </div>
);

export const EmojiRowOld = ({ 
  emoji, 
  n, 
  small,
  startIndex = 1, 
  highlightIndex = null 
}: { 
  emoji: string; 
  n: number; 
  small?: boolean; 
  highlightIndex?: number | null;
  startIndex?: number; 
}) => (
  <div className="flex flex-wrap items-center justify-center gap-2 relative py-2" style={{ maxWidth: small ? 150 : "100%" }}>
    {Array.from({ length: n }).map((_, i) => {
      const isHighlighted = highlightIndex === i;
      return (
        <span 
          key={i} 
          className="relative inline-block transition-all duration-300"
          style={{
            transform: isHighlighted ? "scale(1.35)" : "scale(1)",
            zIndex: isHighlighted ? 20 : 1,
          }}
        >
          {isHighlighted && (
            <span className="absolute inset-0 bg-yellow-300/40 rounded-full scale-150 blur-[2px] animate-ping pointer-events-none" />
          )}
          {isHighlighted && (
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 text-4xl animate-bounce pointer-events-none" style={{ zIndex: 30 }}>
              👇
            </span>
          )}
          {isHighlighted && (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-black bg-slate-900 text-white border border-slate-700 px-2 py-0.5 rounded shadow-sm pointer-events-none" style={{ fontFamily: FONT, zIndex: 30 }}>
              {startIndex + i}
            </span>
          )}
          <span 
            className="mk-sway inline-block" 
            style={{ 
              fontSize: small ? 28 : n > 9 ? 32 : 42, 
              animationDelay: isHighlighted ? "0s" : `${(i % 8) * 0.16}s`,
              filter: (highlightIndex !== null && !isHighlighted) ? "opacity(0.35) grayscale(20%)" : "none",
              transition: "filter 0.3s, transform 0.3s",
            }}
          >
            {emoji}
          </span>
        </span>
      );
    })}
  </div>
);

export const BigText = ({ children, size = 42 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, color: C.ink, textAlign: "center", letterSpacing: 1, whiteSpace: "pre-line" }}>{children}</div>
);

/* ---------------- Album Stickers ---------------- */
export const COLLECTIONS = [
  { id: "floresta", name: "Floresta", items: [["🦊", 10], ["🦉", 15], ["🐻", 20], ["🦌", 25], ["🍄", 30], ["🌲", 40]] },
  { id: "oceano", name: "Oceano", items: [["🐬", 10], ["🐙", 15], ["🦈", 20], ["🐠", 25], ["🐳", 30], ["🦀", 40]] },
  { id: "espaco", name: "Espaço", items: [["🚀", 12], ["🪐", 18], ["👽", 22], ["🌟", 28], ["🛸", 34], ["☄️", 45]] },
  { id: "doces", name: "Doces", items: [["🍩", 12], ["🧁", 18], ["🍭", 22], ["🍦", 28], ["🍫", 34], ["🍬", 45]] },
  { id: "fazenda", name: "Fazenda", items: [["🐄", 12], ["🐖", 18], ["🐓", 22], ["🐑", 28], ["🐴", 34], ["🌾", 45]] },
  { id: "insetos", name: "Insetos", items: [["🐝", 12], ["🐞", 18], ["🦋", 22], ["🐌", 28], ["🐜", 34], ["🕷️", 45]] },
];
export const TOTAL_STICKERS = COLLECTIONS.reduce((s, c) => s + c.items.length, 0);

/* ---------------- Fresh Game Progress Builder ---------------- */
export const FRESH = () => ({ lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0, maxLvl: 1, dom: false });

/* ---------------- Active Theme Configuration ---------------- */
export let ACTIVE = THEMES.classico;
export const applyTheme = (id: string) => {
  ACTIVE = THEMES[id] || THEMES.classico;
};
export const pickEmo = () => {
  return ACTIVE.emojis[Math.floor(Math.random() * ACTIVE.emojis.length)];
};
export const pickPraise = () => {
  return ACTIVE.praise[Math.floor(Math.random() * ACTIVE.praise.length)];
};

/* ---------------- Atmospheric sound trigger ---------------- */
export const SoundBtn = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button
    onClick={() => {
      sfx.tick();
      onToggle();
    }}
    className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-full"
    style={{
      background: C.card,
      color: C.ink,
      borderColor: C.line,
      boxShadow: `0 4px 0 ${C.line}`,
    }}
  >
    {on ? "🔊" : "🔇"}
  </button>
);

/* ---------------- Sparkle Particle Explosion ---------------- */
export function Burst() {
  const list = ACTIVE.burst || ["⭐", "✨", "🎉", "💛", "🌟"];
  const parts = Array.from({ length: 14 }, () => ({
    e: list[Math.floor(Math.random() * list.length)],
    tx: Math.random() * 240 - 120 + "px",
    ty: Math.random() * -190 - 30 + "px",
    d: Math.random() * 0.15 + "s",
  }));
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-visible">
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            fontSize: 26,
            animation: `mkBurst .8s ease-out ${p.d} both`,
            transform: `translate(var(--tx), var(--ty)) scale(.5)`,
            opacity: 0,
            // @ts-ignore
            "--tx": p.tx,
            "--ty": p.ty,
          }}
        >
          {p.e}
        </span>
      ))}
    </div>
  );
}

/* ---------------- Analytics Day Log Calculators ---------------- */
export const localDay = (dt = new Date()) =>
  dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");

export function calcStreak(log: any[]) {
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
}

export function sumWindow(log: any[], from: number, to: number) {
  let ok = 0, tot = 0, t = 0;
  const now = new Date();
  for (let i = from; i <= to; i++) {
    const k = localDay(new Date(now.getTime() - i * 86400000));
    const e = (log || []).find((x) => x.d === k);
    if (e) {
      ok += e.ok;
      tot += e.tot;
      t += e.t || 0;
    }
  }
  return { ok, tot, t };
}

export function accWindow(log: any[], from: number, to: number) {
  let ok = 0, tot = 0;
  const now = new Date();
  for (let i = from; i <= to; i++) {
    const k = localDay(new Date(now.getTime() - i * 86400000));
    const e = (log || []).find((x) => x.d === k);
    if (e) {
      ok += e.ok;
      tot += e.tot;
    }
  }
  return tot ? Math.round((ok / tot) * 100) : null;
}

/* ---------------- Performance Bar Chart ---------------- */
export function MiniBars({ log, days: nDays = 14 }: { log: any[]; days?: number }) {
  const days = [];
  const now = new Date();
  for (let i = nDays - 1; i >= 0; i--) {
    const dt = new Date(now.getTime() - i * 86400000);
    const k = localDay(dt);
    const e = (log || []).find((x) => x.d === k);
    days.push({ ok: e ? e.ok : 0, tot: e ? e.tot : 0, lbl: dt.getDate() + "/" + (dt.getMonth() + 1) });
  }
  const max = Math.max(4, ...days.map((d) => d.tot));
  const W = 280, H = 64, slot = W / nDays, bw = Math.max(3, slot - 4);
  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {days.map((d, i) => {
        const x = i * slot + 2;
        const h = (d.tot / max) * H;
        const ho = d.tot ? (d.ok / max) * H : 0;
        return (
          <g key={i}>
            <rect x={x} y={H - Math.max(h, 2)} width={bw} height={Math.max(h, 2)} rx="3" fill={d.tot ? C.line : "#EDF3FC"} />
            {d.tot > 0 && <rect className="mk-grow" style={{ animationDelay: `${i * 30}ms` }} x={x} y={H - ho} width={bw} height={Math.max(ho, 2)} rx="3" fill={C.mint} />}
            {(i === 0 || i === Math.floor(nDays / 2) || i === nDays - 1) && (
              <text x={x + bw / 2} y={H + 11} textAnchor="middle" fontSize="8" fill={C.sub} fontFamily="Nunito, sans-serif">
                {d.lbl}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------- Statistics Tag Widget ---------------- */
export const StatChip = ({ children }: { children: React.ReactNode }) => (
  <span
    className="transition-all hover:scale-105"
    style={{
      background: C.card,
      border: `2px solid ${C.line}`,
      borderRadius: 999,
      padding: "4px 10px",
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 12,
      color: C.ink,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

/* ---------------- TensDots Base-10 block system ---------------- */
/**
 * CENA VIVA: Amigos dos Números 🤝 (number bond do Método Singapura).
 * Círculo do TODO no topo, dois braços descendo para as PARTES.
 * `missingWhole` = o que falta é o todo (nível inverso); senão falta a 2ª parte.
 */
export function NumberBond({ whole, part, missingWhole = false }: { whole: number; part: number; missingWhole?: boolean }) {
  const topLabel = missingWhole ? "?" : String(whole);
  const leftLabel = String(part);
  const rightLabel = missingWhole ? String(whole - part) : "?";
  const Node = ({ x, y, label, hl }: { x: number; y: number; label: string; hl?: boolean }) => (
    <g className={hl ? "mk-pulse" : ""}>
      <circle cx={x} cy={y} r="26" fill={hl ? "#FEF3C7" : "#EEF2FF"} stroke={hl ? "#F59E0B" : C.grape} strokeWidth="3" />
      <text x={x} y={y + 9} textAnchor="middle" fontSize="26" fontWeight="900" fill={hl ? "#B45309" : C.ink} style={{ fontFamily: FONT }}>{label}</text>
    </g>
  );
  return (
    <svg width="200" height="150" viewBox="0 0 200 150" className="select-none mk-pop">
      <line x1="100" y1="52" x2="55" y2="98" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="52" x2="145" y2="98" stroke={C.line} strokeWidth="4" strokeLinecap="round" />
      <Node x={100} y={30} label={topLabel} hl={missingWhole} />
      <Node x={45} y={115} label={leftLabel} />
      <Node x={155} y={115} label={rightLabel} hl={!missingWhole} />
    </svg>
  );
}

/**
 * CENA VIVA: Moldura de 10 🔟 (ten-frame). Caixa 2×5; `filled` bolinhas cheias.
 * `filled2` (opcional) desenha uma segunda moldura para somar.
 */
export function TenFrameOld({ filled, filled2 = null, highlightRow = null }: { filled: number; filled2?: number | null; highlightRow?: 1 | 2 | null }) {
  const Frame = ({ n }: { n: number }) => (
    <div className="relative grid grid-cols-5 gap-1 p-1.5 bg-white rounded-xl border-4 border-slate-300 shadow-md select-none">
      {highlightRow === 1 && <div className="absolute top-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" />}
      {highlightRow === 2 && <div className="absolute bottom-0 left-0 right-0 h-[48%] border-4 border-amber-400 bg-amber-100/50 rounded-lg animate-pulse pointer-events-none" />}
      {Array.from({ length: 10 }).map((_, i) => {
        const isHighlighted = (highlightRow === 1 && i < 5) || (highlightRow === 2 && i >= 5);
        return (
          <div key={i} className={`flex items-center justify-center rounded-md z-10 ${isHighlighted ? 'scale-110 shadow-sm' : ''}`} style={{ width: 30, height: 30, background: i < n ? "" : "#F1F5F9", border: "2px solid #E2E8F0" }}>
            {i < n && <span className="mk-pop inline-block rounded-full" style={{ width: 20, height: 20, background: C.melon, animationDelay: `${i * 45}ms` }} />}
          </div>
        );
      })}
    </div>
  );
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-2">
      <Frame n={Math.min(10, filled)} />
      {filled2 != null && (<><span className="text-3xl font-black text-slate-400">+</span><Frame n={Math.min(10, filled2)} /></>)}
    </div>
  );
}

export function TensDots({ t, u, highlightIndex = null }: { t: number; u: number; highlightIndex?: number | null }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8 py-3 select-none">
      {/* Dezenas (Barras de 10) */}
      {t > 0 && (
        <div className={`flex gap-3 mk-pop transition-all duration-300 ${highlightIndex === 0 ? 'scale-125 z-10 drop-shadow-xl' : (highlightIndex === 1 ? 'opacity-50 scale-90' : '')}`}>
          {Array.from({ length: t }).map((_, i) => (
            <div
              key={"t" + i}
              className="flex flex-col gap-[1px] border-2 p-1 bg-amber-100 border-amber-400 rounded-lg shadow-md transition-all hover:scale-105"
              style={{ width: 34 }}
            >
              <div className="text-[9px] font-black text-amber-800 text-center mb-1 bg-amber-200 rounded pb-[1px] uppercase tracking-wider">
                10
              </div>
              {Array.from({ length: 10 }).map((_, j) => (
                <div
                  key={j}
                  className="w-6 h-2.5 bg-gradient-to-r from-amber-300 to-amber-500 rounded-sm border border-amber-600/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
                />
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Unidades (Cubinhos Soltos) */}
      {u > 0 && (
        <div className={`flex flex-col items-center gap-1 mk-pop transition-all duration-300 ${highlightIndex === 1 ? 'scale-125 z-10 drop-shadow-xl' : (highlightIndex === 0 ? 'opacity-50 scale-90' : '')}`}>
          <div className="text-[9px] font-black text-emerald-800 text-center px-2 bg-emerald-100 border border-emerald-200 rounded pb-[1px] uppercase tracking-wider mb-1">
            {u === 1 ? "1 unidade" : `${u} unidades`}
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-emerald-50 border-2 border-emerald-400 p-2.5 rounded-xl shadow-md">
            {Array.from({ length: u }).map((_, i) => (
              <div
                key={"u" + i}
                className="w-6 h-6 bg-gradient-to-br from-emerald-300 to-emerald-500 border border-emerald-600/40 rounded-md shadow-[inset_0_1.5px_0_rgba(255,255,255,0.4)] transition-all hover:scale-110"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export { EmojiRow } from "./primitives/EmojiRow"; export { TenFrame } from "./primitives/TenFrame";
