import React from "react";

interface AuraProps {
  theme: string;
}

export function MascotAura({ theme }: AuraProps) {
  return (
    <g>
      {theme === "dino" && (
        <g>
          {/* Rotating green jungle aura */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#22C55E" strokeWidth="3" strokeDasharray="8,6" className="animate-spin" style={{ animationDuration: "15s", transformOrigin: "50px 50px" }} opacity="0.8" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#86EFAC" strokeWidth="1.5" opacity="0.6" />
          <g className="animate-pulse">
            <text x="12" y="26" fontSize="7" opacity="0.9">🌿</text>
            <text x="84" y="26" fontSize="7" opacity="0.9">🦴</text>
            <text x="14" y="76" fontSize="7" opacity="0.9">🍃</text>
            <text x="82" y="76" fontSize="7" opacity="0.9">🦕</text>
          </g>
        </g>
      )}
      
      {theme === "musica" && (
        <g>
          {/* Electric purple lightning and notes aura */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#A855F7" strokeWidth="3" strokeDasharray="4,4" className="animate-spin" style={{ animationDuration: "8s", transformOrigin: "50px 50px" }} opacity="0.9" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#E9D5FF" strokeWidth="1.5" opacity="0.7" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">⚡</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">⚡</text>
            <text x="14" y="77" fontSize="7" opacity="0.9">🎵</text>
            <text x="82" y="77" fontSize="7" opacity="0.9">🎸</text>
          </g>
        </g>
      )}
      
      {theme === "futebol" && (
        <g>
          {/* Golden Champion Aura */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#EAB308" strokeWidth="3" strokeDasharray="10,4" className="animate-spin" style={{ animationDuration: "10s", transformOrigin: "50px 50px" }} opacity="0.9" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#FEF08A" strokeWidth="1.5" opacity="0.7" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">⭐</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🏆</text>
            <text x="14" y="77" fontSize="8" opacity="0.95">⚽</text>
            <text x="82" y="77" fontSize="8" opacity="0.95">✨</text>
          </g>
        </g>
      )}
      
      {theme === "bruxo" && (
        <g>
          {/* Cosmic wizard portal aura */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeDasharray="12,2" className="animate-spin" style={{ animationDuration: "14s", transformOrigin: "50px 50px" }} opacity="0.85" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#C084FC" strokeWidth="1.5" opacity="0.6" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="7" opacity="0.9">🔮</text>
            <text x="84" y="25" fontSize="7" opacity="0.9">🪄</text>
            <text x="14" y="77" fontSize="7" opacity="0.9">✨</text>
            <text x="82" y="77" fontSize="7" opacity="0.9">🌟</text>
          </g>
        </g>
      )}
      
      {(theme === "homem_aranha" || theme === "homem_aranha_pixel" || theme === "homem_aranha_hd") && (
        <g>
          {/* Rotating spider web */}
          <g className="animate-spin" style={{ animationDuration: "25s", transformOrigin: "50px 50px" }} opacity="0.7">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="3,6" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#E11D48" strokeWidth="1" strokeDasharray="2,4" />
            <path d="M 14 50 L 86 50 M 50 14 L 50 86 M 24 24 L 76 76 M 24 76 L 76 24" stroke="rgba(225, 29, 72, 0.2)" strokeWidth="1" />
          </g>
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">🕸️</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🕸️</text>
          </g>
        </g>
      )}

      {(theme === "hulk" || theme === "hulk_pixel") && (
        <g>
          {/* Smash vibration concentric green lines */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeDasharray="16,8" className="animate-spin" style={{ animationDuration: "20s", transformOrigin: "50px 50px" }} opacity="0.8" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">🟢</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🟢</text>
            <text x="14" y="77" fontSize="7" opacity="0.9">💥</text>
            <text x="82" y="77" fontSize="7" opacity="0.9">💥</text>
          </g>
        </g>
      )}

      {(theme === "homem_ferro" || theme === "homem_ferro_pixel" || theme === "homem_ferro_hd") && (
        <g>
          {/* Arc reactor energy ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="8,8" className="animate-spin" style={{ animationDuration: "12s", transformOrigin: "50px 50px" }} opacity="0.9" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">⚡</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🚀</text>
          </g>
        </g>
      )}

      {(theme === "thor" || theme === "thor_hd") && (
        <g>
          {/* Asgardian thunder storm ring */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeDasharray="5,15" className="animate-spin" style={{ animationDuration: "8s", transformOrigin: "50px 50px" }} opacity="0.9" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">⚡</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🔨</text>
            <text x="14" y="77" fontSize="7" opacity="0.9">⛈️</text>
            <text x="82" y="77" fontSize="7" opacity="0.9">✨</text>
          </g>
        </g>
      )}

      {theme === "batman" && (
        <g>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="15,15" className="animate-spin" style={{ animationDuration: "20s", transformOrigin: "50px 50px" }} opacity="0.8" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.9">🦇</text>
            <text x="84" y="25" fontSize="8" opacity="0.9">🌕</text>
          </g>
        </g>
      )}
      
      {theme === "elsa" && (
        <g>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5,10" className="animate-spin" style={{ animationDuration: "10s", transformOrigin: "50px 50px" }} opacity="0.95" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="7" opacity="0.95">❄️</text>
            <text x="84" y="25" fontSize="7" opacity="0.95">👑</text>
          </g>
        </g>
      )}
      
      {theme === "pikachu" && (
        <g>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="3,12" className="animate-spin" style={{ animationDuration: "6s", transformOrigin: "50px 50px" }} opacity="0.95" />
          <g className="animate-pulse">
            <text x="12" y="25" fontSize="8" opacity="0.95">⚡</text>
            <text x="84" y="25" fontSize="8" opacity="0.95">🔴</text>
          </g>
        </g>
      )}
      
      {/* Fallback Theme-Specific Cosmic / Starry Aura */}
      {theme !== "dino" && theme !== "musica" && theme !== "futebol" && theme !== "bruxo" && theme !== "homem_aranha" && theme !== "homem_aranha_pixel" && theme !== "homem_aranha_hd" && theme !== "batman" && theme !== "elsa" && theme !== "pikachu" && theme !== "hulk" && theme !== "hulk_pixel" && theme !== "homem_ferro" && theme !== "homem_ferro_pixel" && theme !== "homem_ferro_hd" && theme !== "thor" && theme !== "thor_hd" && (
        <g>
          <circle cx="50" cy="50" r="44" fill="none" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6,4" className="animate-spin" style={{ animationDuration: "12s", transformOrigin: "50px 50px" }} opacity="0.8" />
          <circle cx="50" cy="50" r="41" fill="none" stroke="#FEF08A" strokeWidth="1.5" opacity="0.6" />
          <g className="animate-pulse">
            <path d="M 12 25 L 14 27 L 12 29 L 10 27 Z" fill="#FBBF24" />
            <path d="M 88 25 L 90 27 L 88 29 L 86 27 Z" fill="#FBBF24" />
          </g>
        </g>
      )}
    </g>
  );
}
