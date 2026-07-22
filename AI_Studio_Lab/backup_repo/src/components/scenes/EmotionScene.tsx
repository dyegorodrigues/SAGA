import React from "react";
import { getSceneSvg } from "./sceneAssets";

/**
 * EmotionScene 😊 — Cena Viva das emoções (socioemocional, lacuna do dossiê). Um
 * personagem expressivo mostra a emoção no ROSTO inteiro (olhos, boca, sobrancelha,
 * lágrima/suor) — a criança lê o sentimento, não um emoji chapado.
 */
export type Emotion = "feliz" | "triste" | "bravo" | "medo";

const BG: Record<Emotion, string> = {
  feliz: "#FEF9C3", triste: "#DBEAFE", bravo: "#FEE2E2", medo: "#EDE9FE",
};

export default function EmotionScene({ type, size = 220 }: { type: Emotion; size?: number }) {
  const uid = React.useId();
  const face = type === "bravo" ? "#FCA5A5" : type === "medo" ? "#E9D5FF" : "#FDE68A";
  const asset = getSceneSvg("emotion", type);
  if (asset) return <img src={asset} width={size} height={size} alt={type} style={{ maxWidth: "100%" }} />;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={type} style={{ maxWidth: "100%" }}>
      <defs><clipPath id={`c${uid}`}><rect x="6" y="6" width="188" height="188" rx="22" /></clipPath></defs>
      <g clipPath={`url(#c${uid})`}>
        <rect x="6" y="6" width="188" height="188" fill={BG[type]} />
        {/* cabeça */}
        <circle cx="100" cy="100" r="60" fill={face} stroke="#1E293B" strokeWidth="3" />

        {/* bochechas */}
        <circle cx="66" cy="112" r="9" fill={type === "bravo" ? "#EF4444" : "#F9A8D4"} opacity="0.7" />
        <circle cx="134" cy="112" r="9" fill={type === "bravo" ? "#EF4444" : "#F9A8D4"} opacity="0.7" />

        {/* sobrancelhas por emoção */}
        {type === "bravo" && (
          <g stroke="#1E293B" strokeWidth="4" strokeLinecap="round">
            <line x1="66" y1="74" x2="90" y2="84" /><line x1="134" y1="74" x2="110" y2="84" />
          </g>
        )}
        {type === "triste" && (
          <g stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M66 84 Q78 78 90 84" /><path d="M110 84 Q122 78 134 84" />
          </g>
        )}

        {/* olhos */}
        {type === "medo" ? (
          <g>
            <circle cx="78" cy="92" r="12" fill="#fff" stroke="#1E293B" strokeWidth="2.5" /><circle cx="78" cy="94" r="5" fill="#1E293B" />
            <circle cx="122" cy="92" r="12" fill="#fff" stroke="#1E293B" strokeWidth="2.5" /><circle cx="122" cy="94" r="5" fill="#1E293B" />
          </g>
        ) : (
          <g fill="#1E293B">
            <circle cx="78" cy="94" r="7" /><circle cx="122" cy="94" r="7" />
            <circle cx="80" cy="91" r="2.2" fill="#fff" /><circle cx="124" cy="91" r="2.2" fill="#fff" />
          </g>
        )}

        {/* lágrima (triste) / gota de suor (medo) */}
        {type === "triste" && <path d="M78 104 q5 12 0 18 q-5 -6 0 -18" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1.5" />}
        {type === "medo" && <path d="M140 96 q4 8 0 12 q-4 -4 0 -12" fill="#38BDF8" stroke="#0EA5E9" strokeWidth="1.5" />}

        {/* boca por emoção */}
        {type === "feliz" && <path d="M74 122 Q100 150 126 122 Z" fill="#7F1D1D" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />}
        {type === "triste" && <path d="M78 138 Q100 120 122 138" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />}
        {type === "bravo" && <path d="M78 134 Q100 124 122 134" fill="none" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />}
        {type === "medo" && <ellipse cx="100" cy="132" rx="12" ry="15" fill="#7F1D1D" stroke="#1E293B" strokeWidth="2.5" />}
      </g>
    </svg>
  );
}
