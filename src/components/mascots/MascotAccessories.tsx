import React from "react";

interface AccessoryProps {
  stage: number;
  activeColor: string;
}

// 1. Greek Tunic (Túnica Grega) 🏺
export function GreekTunic({ stage }: AccessoryProps) {
  // Draws a beautiful white draped tunic with a gold sash across the chest
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      {/* White Tunic body */}
      <path d="M 32 50 L 24 74 C 36 78, 64 78, 76 74 L 68 50 Z" fill="#F8FAFC" />
      {/* Fold lines */}
      <path d="M 40 52 L 36 74" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M 60 52 L 64 74" stroke="#CBD5E1" strokeWidth="1.5" />
      <path d="M 50 50 L 50 75" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Golden shoulder drapery sash */}
      <path d="M 32 50 Q 50 64 68 50 L 64 56 Q 48 70 32 54 Z" fill="#EAB308" />
    </g>
  );
}

// 2. Roman Armor (Armadura Romana) 🛡️
export function RomanArmor({ stage }: AccessoryProps) {
  // Draws a gorgeous crimson/gold metallic Roman muscle chestplate with a leather pteruges skirt
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      {/* Crimson tunic underneath */}
      <path d="M 30 52 L 23 75 L 77 75 L 70 52 Z" fill="#991B1B" />
      {/* Bronze chestplate */}
      <path d="M 32 50 Q 50 54 68 50 L 66 68 Q 50 72 34 68 Z" fill="#D97706" />
      {/* Shoulder guards (Epaulets) */}
      <path d="M 30 48 Q 33 42 36 48 Z" fill="#B45309" />
      <path d="M 70 48 Q 67 42 64 48 Z" fill="#B45309" />
      {/* Leather pteruges strips at bottom */}
      <rect x="36" y="68" width="5" height="10" rx="1.5" fill="#78350F" />
      <rect x="43" y="69" width="5" height="10" rx="1.5" fill="#78350F" />
      <rect x="50" y="69" width="5" height="10" rx="1.5" fill="#EAB308" />
      <rect x="57" y="69" width="5" height="10" rx="1.5" fill="#78350F" />
      <rect x="64" y="68" width="5" height="10" rx="1.5" fill="#78350F" />
    </g>
  );
}

// 3. Knight Armor (Armadura de Cavaleiro) ⚔️
export function KnightArmor({ stage }: AccessoryProps) {
  // Shiny iron-clad silver medieval armor with blue core gem
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      {/* Steel Breastplate */}
      <path d="M 31 50 Q 50 54 69 50 L 67 71 Q 50 78 33 71 Z" fill="#94A3B8" />
      {/* Metallic highlight */}
      <path d="M 34 53 Q 50 57 66 53 L 64 68 Q 50 72 36 68 Z" fill="#E2E8F0" opacity="0.3" stroke="none" />
      {/* Shoulder guards */}
      <ellipse cx="30" cy="50" rx="5" ry="6" fill="#64748B" />
      <ellipse cx="70" cy="50" rx="5" ry="6" fill="#64748B" />
      {/* Glowing Royal Emblem Gem */}
      <polygon points="50,56 54,61 50,66 46,61" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />
    </g>
  );
}

// 4. Witch Costume (Bruxa) 🧙‍♀️
export function WitchCostume({ stage }: AccessoryProps) {
  // A starry black dress coupled with a witch hat
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g>
      {/* Witch cloak bodice */}
      <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
        <path d="M 31 51 L 22 75 C 38 78, 62 78, 78 75 L 69 51 Z" fill="#1E1B4B" />
        {/* Violet scarf / tie */}
        <path d="M 45 50 Q 50 56 55 50 L 52 64 L 48 64 Z" fill="#8B5CF6" />
        <circle cx="50" cy="52" r="2.5" fill="#F43F5E" stroke="none" />
      </g>
      
      {/* Pointy witch hat on top of head */}
      <g transform={`translate(50, 30) scale(${sizeRatio}) translate(-50, -30)`} stroke="#1E293B" strokeWidth="2.5">
        <path d="M 12 30 Q 50 34 88 30 Q 50 25 12 30 Z" fill="#1E1B4B" /> {/* Hat Brim */}
        <path d="M 30 28 L 50 -2 Q 53 -5 51 0 L 70 28 Z" fill="#312E81" /> {/* Pointy top */}
        <rect x="33" y="23" width="34" height="5" fill="#8B5CF6" stroke="none" /> {/* Violet hat band */}
        <rect x="46" y="22" width="8" height="7" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" /> {/* Golden buckle */}
      </g>
    </g>
  );
}

// 5. Wizard Cloak (Bruxo/Mago) 🧙‍♂️
export function WizardCloak({ stage }: AccessoryProps) {
  // Starry wizard robe
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g>
      {/* Wizard Cloak */}
      <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
        <path d="M 30 50 L 21 75 C 36 81, 64 81, 79 75 L 70 50 Z" fill="#5B21B6" />
        {/* Golden star prints */}
        <polygon points="38,58 40,55 42,58 39,56" fill="#FBBF24" stroke="none" />
        <polygon points="62,64 64,61 66,64 63,62" fill="#FBBF24" stroke="none" />
        <polygon points="46,68 48,65 50,68 47,66" fill="#FBBF24" stroke="none" />
      </g>
      
      {/* Wizard Hat */}
      <g transform={`translate(50, 32) scale(${sizeRatio}) translate(-50, -32)`} stroke="#1E293B" strokeWidth="2.5">
        <ellipse cx="50" cy="30" rx="34" ry="4" fill="#5B21B6" />
        <path d="M 28 29 Q 45 -4 46 -8 Q 50 -12 52 -6 L 72 29 Z" fill="#6D28D9" />
        <polygon points="46,12 49,15 47,11" fill="#FBBF24" stroke="none" />
        <polygon points="53,4 56,7 54,3" fill="#FBBF24" stroke="none" />
      </g>
    </g>
  );
}

// 6. Iron Man Armor (Armadura de Metal) 🦾
export function IronManArmor({ stage }: AccessoryProps) {
  // Crimson metallic armor with gold core plates and a bright circular cyan power core (Arc Reactor!)
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      {/* Red chest plates */}
      <path d="M 31 50 Q 50 53 69 50 L 67 72 Q 50 78 33 72 Z" fill="#B91C1C" />
      {/* Gold armor trim inlays */}
      <path d="M 36 51 Q 50 54 64 51 L 62 62 L 38 62 Z" fill="#EAB308" />
      {/* Mechanical grid lines */}
      <line x1="50" y1="52" x2="50" y2="72" stroke="#451A03" strokeWidth="1.5" />
      {/* Bright circular cyan Arc Reactor */}
      <circle cx="50" cy="62" r="5.5" fill="#22D3EE" stroke="#FFFFFF" strokeWidth="1.5" className="animate-pulse" />
    </g>
  );
}

// 7. King Outfit & Royal Crown (Rei/Coroa) 👑
export function KingOutfit({ stage }: AccessoryProps) {
  // Crimson velvet robe with white-spotted ermine collar and a luxurious gold crown with rubies
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g>
      {/* Royal Robe bodice */}
      <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
        <path d="M 30 50 L 21 75 C 36 80, 64 80, 79 75 L 70 50 Z" fill="#DC2626" />
        {/* Ermine spotted white collar draped */}
        <path d="M 30 50 Q 50 59 70 50 L 65 58 Q 50 64 35 58 Z" fill="#F1F5F9" />
        {/* Ermine spots (tiny black V shapes) */}
        <path d="M 40 55 L 42 57 M 42 57 L 44 55" stroke="#000000" strokeWidth="1.5" />
        <path d="M 60 55 L 62 57 M 62 57 L 64 55" stroke="#000000" strokeWidth="1.5" />
        <path d="M 50 58 L 51 60 M 51 60 L 52 58" stroke="#000000" strokeWidth="1.5" />
        {/* Gold royal medallion */}
        <circle cx="50" cy="63" r="3" fill="#EAB308" />
      </g>
      
      {/* Gold crown on head */}
      <g transform={`translate(50, 30) scale(${sizeRatio}) translate(-50, -30)`} stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
        <path d="M 28 30 L 25 15 L 37 23 L 50 10 L 63 23 L 75 15 L 72 30 Z" fill="#EAB308" />
        {/* Crown base red lining */}
        <rect x="29" y="27" width="42" height="3" fill="#991B1B" stroke="none" />
        {/* Ruby dots on crown spikes */}
        <circle cx="25" cy="15" r="2" fill="#E11D48" stroke="none" />
        <circle cx="50" cy="10" r="2" fill="#E11D48" stroke="none" />
        <circle cx="75" cy="15" r="2" fill="#E11D48" stroke="none" />
      </g>
    </g>
  );
}

// 8. Chaplin Hat (chapeu) 🎩
export function ChaplinHat({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 34) scale(${sizeRatio}) translate(-50, -34)`} stroke="#1E293B" strokeWidth="2.5">
      <ellipse cx="50" cy="30" rx="26" ry="3.5" fill="#1E293B" />
      <path d="M 33 29 L 35 12 Q 35 6 42 6 L 58 6 Q 65 6 65 12 L 67 29 Z" fill="#334155" />
      <rect x="35" y="24" width="30" height="4" fill="#EF4444" stroke="none" />
    </g>
  );
}

// 9. Cute Bow (laco) 🎀
export function CuteBow({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 32) scale(${sizeRatio}) translate(-50, -32)`} stroke="#1E293B" strokeWidth="2" strokeLinejoin="round">
      <path d="M 50 28 L 38 20 L 38 34 Z" fill="#EC4899" />
      <path d="M 50 28 L 62 20 L 62 34 Z" fill="#EC4899" />
      <circle cx="50" cy="28" r="4.5" fill="#F472B6" />
    </g>
  );
}

// 10. Cap (cap) 🧢
export function CuteCap({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 32) scale(${sizeRatio}) translate(-50, -32)`} stroke="#1E293B" strokeWidth="2.5">
      <path d="M 31 30 C 31 15 69 15 69 30 Z" fill="#2563EB" />
      <path d="M 64 28 Q 80 28 82 32 Q 78 35 64 31 Z" fill="#1D4ED8" />
    </g>
  );
}

// 11. Glasses (oculos) 👓
export function GeniusGlasses({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 52) scale(${sizeRatio}) translate(-50, -52)`} stroke="#1E293B" strokeWidth="2.5" fill="none">
      <rect x="30" y="44" width="16" height="12" rx="4" strokeWidth="3" />
      <rect x="54" y="44" width="16" height="12" rx="4" strokeWidth="3" />
      <line x1="46" y1="50" x2="54" y2="50" strokeWidth="3.5" />
    </g>
  );
}

// 12. Headphones (fone) 🎧
export function RockerHeadphones({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 50) scale(${sizeRatio}) translate(-50, -50)`} stroke="#1E293B" strokeWidth="2.5">
      {/* Headband */}
      <path d="M 28 50 C 28 22 72 22 72 50" fill="none" strokeWidth="3.5" />
      {/* Left cup */}
      <rect x="22" y="44" width="7" height="15" rx="3.5" fill="#A855F7" />
      {/* Right cup */}
      <rect x="71" y="44" width="7" height="15" rx="3.5" fill="#A855F7" />
    </g>
  );
}

// 13. Soccer Jersey (futebol_jersey) 🎽
export function SoccerJersey({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      <path d="M 31 50 L 22 72 C 38 75, 62 75, 78 72 L 69 50 Z" fill="#22C55E" />
      {/* Vertical stripe */}
      <rect x="46" y="50" width="8" height="23" fill="#FFFFFF" stroke="none" />
      {/* Number 10 */}
      <text x="50" y="66" fontSize="11" fontWeight="900" fill="#1E293B" textAnchor="middle" stroke="none">10</text>
    </g>
  );
}

// 14. Necktie (gravata) 👔
export function SmartNecktie({ stage }: AccessoryProps) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : 1.05;
  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round">
      <polygon points="50,50 54,54 50,72 46,54" fill="#3B82F6" />
      <polygon points="46,49 54,49 52,53 48,53" fill="#1D4ED8" />
    </g>
  );
}

export function KimonoOutfit({ stage }: { stage: number }) {
  const sizeRatio = stage === 2 ? 0.65 : stage === 3 ? 0.85 : stage === 4 ? 0.98 : stage >= 5 ? 1.05 : 0.55;
  const belts = ["#ffffff", "#FDE047", "#4ADE80", "#60A5FA", "#EF4444", "#A855F7", "#78350F", "#1E293B"];
  const beltColor = belts[Math.min(stage - 1, belts.length - 1)] || "#ffffff";
  const beltStroke = beltColor === "#ffffff" ? "#CBD5E1" : beltColor === "#1E293B" ? "#0F172A" : "#1E293B";

  return (
    <g transform={`translate(50, 60) scale(${sizeRatio}) translate(-50, -60)`} stroke="#1E293B" strokeWidth="2.5">
      {/* Kimono Top (White) */}
      <path d="M 28 50 L 22 75 C 36 82, 64 82, 78 75 L 72 50 Z" fill="#F8FAFC" />
      {/* Lapels */}
      <path d="M 35 50 L 50 68 L 65 50" fill="none" stroke="#CBD5E1" strokeWidth="3" />
      
      {/* The Belt */}
      <path d="M 24 66 C 40 70, 60 70, 76 66 L 74 72 C 60 76, 40 76, 26 72 Z" fill={beltColor} stroke={beltStroke} strokeWidth="2" />
      
      {/* Belt Knot */}
      <rect x="44" y="66" width="12" height="6" rx="2" fill={beltColor} stroke={beltStroke} strokeWidth="2" />
      <path d="M 50 72 L 46 80 M 50 72 L 54 80" fill="none" stroke={beltColor} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
