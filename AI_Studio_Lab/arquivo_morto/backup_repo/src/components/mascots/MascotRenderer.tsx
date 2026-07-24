import React from "react";
import { BODY_COLORS } from "./MascotThemes";
import { MascotAura } from "./MascotAura";
import * as Bases from "./MascotBases";
import * as Accs from "./MascotAccessories";
import { DragonStage } from "./DragonMascot";
import { getMascotPng } from "./mascotAssets";

/**
 * REGRA PERMANENTE DE ARTE (Escola SVG — docs/plano-diretor-v2.md, Parte C):
 * O motor vetorial fica RESTRITO a acessórios, cenários, ícones e efeitos —
 * nunca personagens completos realistas. Personagem definitivo = PNG com
 * transparência real em src/assets/mascotes/ (ver mascotAssets.ts); o desenho
 * SVG (DragonMascot) é o fallback fofo enquanto os PNGs não existem.
 * PROIBIDO PARA SEMPRE: JPG, fundo preto, mixBlendMode, remoção de fundo em
 * tempo real. As 6 lições completas estão documentadas em DragonMascot.tsx.
 */

interface MascotRendererProps {
  theme?: string;
  size?: number;
  className?: string;
  outfit?: string;
  bgAccessory?: string;
  kid?: any;
  stage?: number;
  animation?: "idle" | "walk" | "happy";
}

export function MascotRenderer({
  theme = "classico",
  size = 96,
  className = "",
  outfit = "default",
  bgAccessory = "default",
  kid = null,
  stage = 3,
  animation = "idle",
}: MascotRendererProps) {
  const activeTheme = theme !== "classico" ? theme : (kid?.theme || "classico");
  const bodyColor = BODY_COLORS[activeTheme] || BODY_COLORS.classico;
  
  let activeOutfit = "none"; // Disable all outfits/accessories to prevent rendering bugs
  let activeBg = bgAccessory !== "default" ? bgAccessory : (kid?.bgAccessory || "default");

  if (activeBg === "default" || activeBg === "none") {
    if (activeTheme === "heroi") activeBg = "espaco";
    else if (activeTheme === "hulk") activeBg = "parque";
    else if (activeTheme === "capitao_america") activeBg = "castelo";
    else if (activeTheme === "homem_ferro") activeBg = "espaco";
    else if (activeTheme === "bruxo") activeBg = "castelo";
    else if (activeTheme === "futebol") activeBg = "campo";
    else if (activeTheme === "musica") activeBg = "espaco";
    else if (activeTheme === "dino") activeBg = "parque";
    else if (activeTheme === "homem_aranha") activeBg = "espaco";
    else if (activeTheme === "batman") activeBg = "espaco";
    else if (activeTheme === "elsa") activeBg = "castelo";
    else if (activeTheme === "pikachu") activeBg = "parque";
    else if (activeTheme === "dragao_fogo") activeBg = "espaco";
    else activeBg = "castelo";
  }

  let bodyAnimClass = animation === "walk" ? "anim-walk" : animation === "happy" ? "anim-happy" : "anim-float";
  let eggAnimClass = "anim-egg-wiggle";

  bodyAnimClass = "anim-float";
  eggAnimClass = "anim-egg-wiggle";

  const pngUrl = getMascotPng(activeTheme, stage);

  // Standard Adult metrics (ensures perfect, bug-free, proportional drawings of all accessories & features)
  const adultBx = 26;
  const adultBy = 28;
  const adultBw = 48;
  const adultBh = 48;
  const adultBr = 20;

  // Real-time scale factor based on evolution stage (proportional, bug-free, cute scaling)
  let scaleFactor = 1.0;
  if (stage === 2) {
    scaleFactor = 0.58; // Tiny cute baby chibi!
  } else if (stage === 3) {
    scaleFactor = 0.80; // Growing smart child!
  } else if (stage === 4) {
    scaleFactor = 1.0;  // Full signature adult hero!
  } else if (stage === 5) {
    scaleFactor = 1.15; // Supreme legend, slightly larger and epic!
  }

  // Dynamic layout metrics based on stage (2 to 5)
  let bx = 25; // Body X
  let by = 30; // Body Y
  let bw = 50; // Body Width
  let bh = 50; // Body Height
  let br = 20; // Border Radius (rx)

  if (stage === 2) {
    bx = 34; by = 44; bw = 32; bh = 32; br = 16;
  } else if (stage === 3) {
    bx = 29; by = 34; bw = 42; bh = 42; br = 18;
  } else if (stage === 4) {
    bx = 26; by = 28; bw = 48; bh = 48; br = 20;
  } else if (stage === 5) {
    bx = 24; by = 24; bw = 52; bh = 52; br = 22;
  }

  let hatTransform = "translate(0, -5)";
  let faceTransform = "translate(0, 0)";
  let glassesTransform = "translate(0, -2)";
  let foneTransform = "translate(0, 0)";

  if (stage === 2) {
    hatTransform = "translate(0, 15) translate(50, 50) scale(0.68) translate(-50, -50)";
    faceTransform = "translate(0, 11) translate(50, 50) scale(0.66) translate(-50, -50)";
    glassesTransform = "translate(0, 13) translate(50, 50) scale(0.66) translate(-50, -50)";
    foneTransform = "translate(0, 13) translate(50, 50) scale(0.66) translate(-50, -50)";
  } else if (stage === 3) {
    hatTransform = "translate(0, 4) translate(50, 50) scale(0.85) translate(-50, -50)";
    faceTransform = "translate(0, 4) translate(50, 50) scale(0.85) translate(-50, -50)";
    glassesTransform = "translate(0, 4) translate(50, 50) scale(0.85) translate(-50, -50)";
    foneTransform = "translate(0, 4) translate(50, 50) scale(0.85) translate(-50, -50)";
  } else if (stage === 4) {
    hatTransform = "translate(0, -1) translate(50, 50) scale(0.98) translate(-50, -50)";
    faceTransform = "translate(0, 0) translate(50, 50) scale(0.96) translate(-50, -50)";
    glassesTransform = "translate(0, -1) translate(50, 50) scale(0.96) translate(-50, -50)";
    foneTransform = "translate(0, -1) translate(50, 50) scale(0.96) translate(-50, -50)";
  } else if (stage === 5) {
    hatTransform = "translate(0, -3) translate(50, 50) scale(1.06) translate(-50, -50)";
    faceTransform = "translate(0, -2) translate(50, 50) scale(1.05) translate(-50, -50)";
    glassesTransform = "translate(0, -3) translate(50, 50) scale(1.05) translate(-50, -50)";
    foneTransform = "translate(0, -3) translate(50, 50) scale(1.05) translate(-50, -50)";
  }

  if (animation === "walk") {
    bodyAnimClass = "anim-walk";
  } else if (animation === "happy") {
    bodyAnimClass = "anim-happy";
  }

  return (
    <svg 
      className={`select-none ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={{ display: "block", margin: "0 auto", overflow: "visible" }}
    >
      <defs>
        <clipPath id="scenery-clip">
          <circle cx="50" cy="50" r="45" />
        </clipPath>

        <radialGradient id={`bg-${activeBg}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id={`body-${activeTheme}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="1" />
        </radialGradient>
        
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <style>{`
        @keyframes pkFloat { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes pkEgg { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        @keyframes pkWalk { 0%, 100% { transform: rotate(0deg) translateY(0px); } 25% { transform: rotate(-8deg) translateY(-2px); } 75% { transform: rotate(8deg) translateY(-2px); } }
        @keyframes pkHappy { 0%, 100% { transform: translateY(0px) scale(1); } 50% { transform: translateY(-10px) scale(1.05); } }
        
        .anim-float { animation: pkFloat 3s ease-in-out infinite; transform-origin: 50px 50px; }
        .anim-egg-wiggle { animation: pkEgg 2s ease-in-out infinite; transform-origin: 50px 80px; }
        .anim-walk { animation: pkWalk 0.6s ease-in-out infinite; transform-origin: 50px 80px; }
        .anim-happy { animation: pkHappy 0.6s ease-in-out infinite; transform-origin: 50px 80px; }
        
        .eye-blink { animation: blink 4s infinite; }
        @keyframes blink { 0%, 96%, 100% { transform: scaleY(1); } 98% { transform: scaleY(0.1); } }
      `}</style>

      {/* Scenic Backdrops clipped to circular stage boundaries */}
      <g clipPath="url(#scenery-clip)">
        {/* Sky/Default backing */}
        <rect x="5" y="5" width="90" height="90" fill="#E2E8F0" />

        {activeBg === "espaco" && (
          <g>
            <rect x="5" y="5" width="90" height="90" fill="#0B0F19" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="#1E293B" strokeWidth="0.5" />
            {/* Stars */}
            <circle cx="25" cy="25" r="1.2" fill="#FFFFFF" opacity="0.9" />
            <circle cx="75" cy="30" r="1.5" fill="#FFFFFF" opacity="0.8" className="animate-pulse" />
            <circle cx="35" cy="65" r="1.2" fill="#38BDF8" opacity="0.7" />
            <circle cx="68" cy="72" r="1" fill="#FBBF24" opacity="0.9" />
            {/* Crescent Moon */}
            <path d="M 22 18 A 6 6 0 0 0 34 26 A 8 8 0 1 1 22 18 Z" fill="#FDE047" opacity="0.85" />
            {/* Saturn */}
            <g transform="translate(74, 20) rotate(-15) scale(0.6)">
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#F59E0B" strokeWidth="3" opacity="0.6" />
              <circle cx="0" cy="0" r="8" fill="#F3F4F6" />
              <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#FBBF24" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {activeBg === "castelo" && (
          <g>
            <rect x="5" y="5" width="90" height="90" fill="#2E1065" />
            <circle cx="50" cy="35" r="28" fill="#4C1D95" opacity="0.5" />
            <circle cx="30" cy="20" r="1" fill="#FFF" />
            <circle cx="70" cy="22" r="1" fill="#FFF" />
            {/* Castle architecture */}
            <g fill="#1E1B4B" stroke="#4C1D95" strokeWidth="0.5">
              <rect x="20" y="52" width="60" height="40" />
              <rect x="18" y="32" width="14" height="40" />
              <polygon points="15,32 25,14 35,32" fill="#0F172A" />
              <rect x="68" y="32" width="14" height="40" />
              <polygon points="65,32 75,14 85,32" fill="#0F172A" />
              <rect x="36" y="44" width="8" height="8" />
              <rect x="48" y="44" width="8" height="8" />
              <rect x="60" y="44" width="8" height="8" />
            </g>
            {/* Lights */}
            <rect x="23" y="42" width="4" height="8" rx="1" fill="#FDE047" />
            <rect x="73" y="42" width="4" height="8" rx="1" fill="#FDE047" />
            <path d="M 46 64 A 4 4 0 0 1 54 64 Z" fill="#FDE047" />
          </g>
        )}

        {activeBg === "campo" && (
          <g>
            <rect x="5" y="5" width="90" height="90" fill="#38BDF8" />
            <circle cx="25" cy="24" r="10" fill="#FFFFFF" opacity="0.8" />
            <circle cx="35" cy="26" r="8" fill="#FFFFFF" opacity="0.8" />
            <circle cx="75" cy="20" r="12" fill="#FFFFFF" opacity="0.8" />
            {/* Grass fields */}
            <ellipse cx="50" cy="110" rx="90" ry="62" fill="#15803D" />
            <ellipse cx="50" cy="110" rx="80" ry="50" fill="#166534" />
            <ellipse cx="50" cy="110" rx="70" ry="38" fill="#15803D" />
            {/* Soccer goal structure */}
            <path d="M 28 85 L 28 58 L 72 58 L 72 85" fill="none" stroke="#E2E8F0" strokeWidth="2.5" opacity="0.6" />
          </g>
        )}

        {activeBg === "parque" && (
          <g>
            <rect x="5" y="5" width="90" height="90" fill="#BAE6FD" />
            <circle cx="20" cy="20" r="10" fill="#F59E0B" />
            <circle cx="20" cy="20" r="7" fill="#FDE047" />
            {/* Meadows and Trees */}
            <ellipse cx="20" cy="85" rx="45" ry="20" fill="#22C55E" opacity="0.8" />
            <ellipse cx="80" cy="85" rx="50" ry="22" fill="#16A34A" opacity="0.9" />
            <ellipse cx="48" cy="92" rx="60" ry="20" fill="#15803D" />
            <g transform="translate(74, 48)">
              <rect x="-3" y="10" width="6" height="25" fill="#78350F" />
              <circle cx="0" cy="4" r="12" fill="#166534" />
              <circle cx="-6" cy="-2" r="10" fill="#15803D" />
              <circle cx="6" cy="-2" r="10" fill="#166534" />
            </g>
          </g>
        )}

        {/* Scenic radial spotlight highlight overlay */}
        <circle cx="50" cy="50" r="45" fill={`url(#bg-${activeBg})`} />
      </g>

      {/* PNG definitivo (pipeline de arte): quando existir, vence qualquer desenho SVG */}
      {pngUrl && (
        <g className={stage === 1 ? eggAnimClass : bodyAnimClass}>
          <ellipse cx="50" cy="85" rx="20" ry="5" fill="rgba(0,0,0,0.2)" />
          <image href={pngUrl} x="12" y="8" width="76" height="76" />
        </g>
      )}

      {/* Egg stage (Stage 1) */}
      {!pngUrl && stage === 1 && (
        <g className={eggAnimClass}>
          {activeTheme === "dragao_fogo" ? (
            <DragonStage stage={1} />
          ) : (<>
          <ellipse cx="50" cy="84" rx="16" ry="5" fill="rgba(0,0,0,0.15)" />
          {["homem_aranha_pixel", "homem_ferro_pixel", "hulk_pixel"].includes(activeTheme) ? (
            <g shapeRendering="crispEdges">
              {/* Retro Pixelated Egg */}
              {(() => {
                const eggColor = activeTheme === "homem_aranha_pixel" ? "#E11D48" : activeTheme === "homem_ferro_pixel" ? "#EF4444" : "#22C55E";
                const spotColor = activeTheme === "homem_ferro_pixel" ? "#FBBF24" : "#1E293B";
                const grid = [
                  "....XXXX....",
                  "..XXXXXXXX..",
                  ".XXXXXXXXXX.",
                  "XXXXXXXXXXXX",
                  "XXXXXXXXXXXX",
                  "XXXXXXXXXXXX",
                  "XXXXXXXXXXXX",
                  "XXXXXXXXXXXX",
                  ".XXXXXXXXXX.",
                  "..XXXXXXXX..",
                  "....XXXX...."
                ];
                return grid.map((row, y) => {
                  return row.split("").map((char, x) => {
                    if (char === ".") return null;
                    const isBorder = x === 0 || x === row.length - 1 || y === 0 || y === grid.length - 1;
                    const fill = isBorder ? "#1E293B" : (x % 3 === 0 && y % 3 === 0) ? spotColor : eggColor;
                    return (
                      <rect
                        key={`${x}-${y}`}
                        x={28 + x * 4}
                        y={36 + y * 4}
                        width={4}
                        height={4}
                        fill={fill}
                        stroke={fill}
                        strokeWidth="0.5"
                      />
                    );
                  });
                });
              })()}
            </g>
          ) : (
            <g>
              <path d="M 50 25 C 32 25 30 55 30 70 C 30 82 39 88 50 88 C 61 88 70 82 70 70 C 70 55 68 25 50 25 Z" fill={`url(#body-${activeTheme})`} stroke="#1E293B" strokeWidth="3" />
              <circle cx="40" cy="50" r="6" fill="#ffffff" opacity="0.6" />
              <circle cx="60" cy="65" r="8" fill="#ffffff" opacity="0.6" />
              <circle cx="55" cy="35" r="5" fill="#ffffff" opacity="0.6" />
            </g>
          )}
          </>)}
        </g>
      )}

      {/* Baby, Teen, Hero, or Legendary Stages (Stage 2 to 5) */}
      {!pngUrl && stage > 1 && (
        <g className={bodyAnimClass}>
          
          {/* Level 5 Aura Effect */}
          {stage === 5 && (
            <MascotAura theme={activeTheme} />
          )}

          {activeTheme === "dragao_fogo" ? (
            <DragonStage stage={stage} />
          ) : ["homem_aranha", "batman", "hulk", "bruxo", "futebol", "homem_ferro", "capitao_america", "elsa", "pikachu", "pantera_negra", "thor", "goku", "dino", "heroi", "musica", "classico", "homem_aranha_pixel", "homem_ferro_pixel", "hulk_pixel", "homem_ferro_hd", "homem_aranha_hd", "capitao_america_hd", "thor_hd"].includes(activeTheme) ? (
            <g transform={`translate(50, 90) scale(${scaleFactor}) translate(-50, -90)`}>
              {/* Main Rounded Cute Body Shadow */}
              <ellipse cx="50" cy="84" rx={adultBw * 0.44} ry={6} fill="rgba(0,0,0,0.15)" />
              
              <Bases.HeroSkin 
                theme={activeTheme}
                stage={stage}
                color={bodyColor}
                bx={adultBx}
                by={adultBy}
                bw={adultBw}
                bh={adultBh}
                br={adultBr}
                animation={animation}
               />
             </g>
          ) : (
            <g>
              {/* Animal Skin Base Layer Behind Body */}
              {activeTheme === "dino" && (
                <Bases.DinoBase color={bodyColor} stage={stage} />
              )}
              {activeTheme === "pikachu" && (
                <Bases.PikachuBase color={bodyColor} stage={stage} />
              )}
              {activeTheme === "elsa" && (
                <Bases.UnicornBase stage={stage} />
              )}
              {activeTheme === "bruxo" && (
                <Bases.UnicornBase stage={stage} />
              )}
              {activeTheme === "musica" && (
                <Bases.OctopusBase color={bodyColor} stage={stage} />
              )}
              {activeTheme === "heroi" && (
                <Bases.LionBase stage={stage} />
              )}
              {activeTheme === "capitao_america" && (
                <Bases.RabbitBase color={bodyColor} stage={stage} />
              )}
              {activeTheme === "hulk" && (
                <Bases.PandaBase stage={stage} />
              )}
              {activeTheme === "homem_aranha" && (
                <Bases.FoxBase stage={stage} />
              )}

              {/* Special Stage-Based Underlay Back Capes */}
              {activeOutfit === "capa" && stage >= 2 && (
                <g transform={hatTransform} stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
                  <path d="M 24 54 Q 10 70 14 84 Q 50 86 86 84 Q 90 70 76 54 Z" fill="#EF4444" />
                  <circle cx="50" cy="58" r="5" fill="#FEF08A" />
                </g>
              )}

              {/* Main Rounded Cute Body */}
              <ellipse cx="50" cy="84" rx={bw * 0.44} ry={6} fill="rgba(0,0,0,0.15)" />
              <rect x={bx} y={by} width={bw} height={bh} rx={br} ry={br} fill={`url(#body-${activeTheme})`} stroke="#1E293B" strokeWidth="3" />

              {/* Outfits Layer (Cumulative Costumes over body) */}
              {activeOutfit === "grecia" && <Accs.GreekTunic stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "roma" && <Accs.RomanArmor stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "cavaleiro" && <Accs.KnightArmor stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "bruxo" && <Accs.WizardCloak stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "witch" && <Accs.WitchCostume stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "ironman" && <Accs.IronManArmor stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "rei" && <Accs.KingOutfit stage={stage} activeColor={bodyColor} />}

              {/* Standard Outfits */}
              {activeOutfit === "chapeu" && <Accs.ChaplinHat stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "laco" && <Accs.CuteBow stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "cap" && <Accs.CuteCap stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "oculos" && <Accs.GeniusGlasses stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "fone" && <Accs.RockerHeadphones stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "futebol_jersey" && <Accs.SoccerJersey stage={stage} activeColor={bodyColor} />}
              {activeOutfit === "gravata" && <Accs.SmartNecktie stage={stage} activeColor={bodyColor} />}

              {/* Interactive Face Layer */}
              <g transform={faceTransform}>
                {/* Blinking Intelligent Eyes */}
                <g className="eye-blink" fill="#1E293B" style={{ transformOrigin: "50px 50px" }}>
                  <circle cx="41" cy="48" r="3.5" />
                  <circle cx="59" cy="48" r="3.5" />
                  <circle cx="42" cy="46.5" r="1" fill="#FFFFFF" />
                  <circle cx="60" cy="46.5" r="1" fill="#FFFFFF" />
                </g>
                
                {/* Cute Mouth (Changes based on health / mood) */}
                {animation === "happy" ? (
                  <path d="M 46 54 Q 50 62 54 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="#EF4444" />
                ) : (
                  <path d="M 47 55 Q 50 58 53 55" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
                )}
                
                {/* Soft pink cheeks */}
                <circle cx="36" cy="51" r="2.5" fill="#F87171" opacity="0.4" />
                <circle cx="64" cy="51" r="2.5" fill="#F87171" opacity="0.4" />
              </g>
            </g>
          )}

        </g>
      )}
    </svg>
  );
}
export default MascotRenderer;
