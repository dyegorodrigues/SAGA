import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Kid, State } from "../types";
import { C, FONT, BODY, THEMES, sfx, Mascote, tone } from "./Mascot";
import { getKidLifetimeXp } from "../lib/gamificationProgress";

/**
 * Calculates total lifetime mathematical stars earned by a kid.
 */
export function getKidLifetimeStars(kidId: string, state: State): number {
  return getKidLifetimeXp(kidId, state);
}

interface EvolutionStage {
  stage: number;
  name: string;
  desc: string;
  minStars: number;
}

/**
 * Curva de evolução (Parte D do plano diretor): 1ª evolução JÁ no primeiro dia,
 * topo em ~3 meses de uso saudável. XP (⭐) é vitalício e NUNCA se gasta.
 */
export const STAGES: EvolutionStage[] = [
  { stage: 1, name: "Faixa Branca 🥋", desc: "Sua jornada matemática começou! O kimono está limpinho e pronto para aprender os primeiros movimentos.", minStars: 0 },
  { stage: 2, name: "Faixa Amarela 🥋", desc: "Você já está brilhando como o sol! Seus golpes matemáticos básicos estão ficando rápidos.", minStars: 15 },
  { stage: 3, name: "Faixa Verde 🥋", desc: "Como uma floresta que cresce, sua inteligência matemática está cada vez mais forte!", minStars: 75 },
  { stage: 4, name: "Faixa Azul 🥋", desc: "A profundidade de um oceano! Seus cálculos mentais agora são velozes e precisos.", minStars: 150 },
  { stage: 5, name: "Faixa Vermelha 🥋", desc: "O fogo do conhecimento! Você domina as operações com agilidade incrível.", minStars: 300 },
  { stage: 6, name: "Faixa Roxa 🥋", desc: "A cor da sabedoria avançada. Problemas difíceis são resolvidos num piscar de olhos!", minStars: 500 },
  { stage: 7, name: "Faixa Marrom 🥋", desc: "O domínio da terra e da base. Sua fundação matemática é inquebrável, quase um mestre!", minStars: 750 },
  { stage: 8, name: "Faixa Preta 🥋", desc: "Mestre Supremo da SAGA! A glória absoluta. Você alcançou o nível mais alto do Dojo Matemático!", minStars: 1000 },
];

export function getMascotStage(stars: number): EvolutionStage {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (stars >= STAGES[i].minStars) return STAGES[i];
  }
  return STAGES[0];
}

interface MascotEvoProps {
  kid: Kid;
  state: State;
  onUpdateKid?: (k: Kid, coinsToSpend?: number) => void;
  coins?: number;
}

const localDay = (dt = new Date()) =>
  dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0") + "-" + String(dt.getDate()).padStart(2, "0");

/**
 * Humor do pet = streak da criança (Parte D): jogou hoje = feliz;
 * 1 dia parado = sonolento; 2+ = com saudade. SÓ muda animação e frases.
 * O pet JAMAIS adoece, morre ou regride — criança não pode carregar culpa.
 */
function getPetMood(kid: Kid, state: State) {
  const lg = (state.log && state.log[kid.id]) || [];
  const lastDay = lg.length ? lg[lg.length - 1].d : null;
  let daysAway = 2;
  if (lastDay) {
    daysAway = Math.max(
      0,
      Math.round((new Date(localDay()).getTime() - new Date(lastDay).getTime()) / 86400000)
    );
  }
  if (daysAway === 0)
    return { emoji: "😄", label: "Feliz", phrase: (n: string) => `${n} está radiante porque você jogou hoje!` };
  if (daysAway === 1)
    return { emoji: "😴", label: "Sonolento", phrase: (n: string) => `${n} está bocejando... uma missãozinha ia animar!` };
  return { emoji: "🥺", label: "Com saudade", phrase: (n: string) => `${n} está com olhinhos pidões de saudade de você!` };
}

import { MascotV2ProfileCard } from "../engine/mascot-v2/MascotV2ProfileCard";

export function MascotEvolutionCard({ kid, state, onUpdateKid, coins = 0 }: MascotEvoProps) {
  if (kid.theme === "trex" || kid.theme === "trex2") {
    return <MascotV2ProfileCard kid={kid} state={state} onUpdateKid={onUpdateKid} coins={coins} />;
  }
  
  // Tamagotchi 2.0: uma única barra de energia (alimentação) + humor pelo streak
  const petEnergy = kid.petEnergy != null ? kid.petEnergy : 80;
  const petFood = kid.petFood != null ? kid.petFood : 0;
  const petName = kid.petName || "Bichinho";
  const mood = getPetMood(kid, state);

  // Naming states
  const [isEditingName, setIsEditingName] = useState(false);
  const [typedName, setTypedName] = useState(petName);

  // Animation state for feeding / playing / sleeping
  const [petAction, setPetAction] = useState<"idle" | "eating" | "playing" | "sleeping">("idle");
  const [praiseText, setPraiseText] = useState<string>("");

  const totalStars = getKidLifetimeStars(kid.id, state);
  const curStage = getMascotStage(totalStars);
  const nextStage = curStage.stage < STAGES.length ? STAGES[curStage.stage] : null;
  const progressPercent = nextStage
    ? Math.min(100, Math.max(0, ((totalStars - curStage.minStars) / (nextStage.minStars - curStage.minStars)) * 100))
    : 100;

  // Custom audio synthesizers for Tamagotchi activities
  const playSfxChewing = () => {
    // Cute chewing frequency sweeps
    tone(450, 0, 0.06, "triangle", 0.15);
    tone(300, 0.08, 0.06, "triangle", 0.15);
    tone(550, 0.16, 0.08, "triangle", 0.15);
  };

  const playSfxPlaying = () => {
    // Cute bouncy jump synthesizer
    tone(523, 0, 0.08, "sine", 0.15);
    tone(784, 0.06, 0.12, "sine", 0.15);
  };

  const playSfxSnoring = () => {
    // Deep relaxing snore growl
    tone(130, 0, 0.4, "sine", 0.1);
    tone(160, 0.45, 0.3, "sine", 0.06);
  };

  // 1. Alimentar: enche a barra de energia. Ração grátis (1/dia pela Missão do Dia) ou 2 🪙.
  const handleFeed = () => {
    if (!onUpdateKid) return;
    if (petEnergy >= 100) {
      sfx.wrong();
      setPraiseText(`${petName} já está cheinho de energia! 😋⚡`);
      setTimeout(() => setPraiseText(""), 3500);
      return;
    }

    if (petFood > 0) {
      playSfxChewing();
      setPetAction("eating");
      onUpdateKid({ ...kid, petEnergy: Math.min(100, petEnergy + 25), petFood: petFood - 1 }, 0);
      setPraiseText(`Nham! Você alimentou ${petName} com a ração do dia! 🍎⚡`);
      setTimeout(() => {
        setPetAction("idle");
        setPraiseText("");
      }, 3000);
    } else if (coins >= 2) {
      playSfxChewing();
      setPetAction("eating");
      onUpdateKid({ ...kid, petEnergy: Math.min(100, petEnergy + 25) }, 2);
      setPraiseText(`Você gastou 2 moedinhas para comprar ração para ${petName}! 🥩🪙`);
      setTimeout(() => {
        setPetAction("idle");
        setPraiseText("");
      }, 3000);
    } else {
      sfx.wrong();
      setPraiseText(`Sem rações e sem moedinhas! Complete a Missão do Dia para ganhar 1 ração grátis! 📝🍖`);
      setTimeout(() => setPraiseText(""), 4500);
    }
  };

  // 2. Brincar: pura diversão — só animação e frases (nunca cansa nem pune)
  const handlePlay = () => {
    playSfxPlaying();
    setPetAction("playing");
    setPraiseText(
      petEnergy <= 25
        ? `${petName} brincou devagarzinho, meio sonolento... que fofura! 🥎😴`
        : `Yupi! Você brincou de pegar a bola com ${petName}! 🥎❤️`
    );
    setTimeout(() => {
      setPetAction("idle");
      setPraiseText("");
    }, 2500);
  };

  // 3. Dormir: soneca cosmética — só animação e frases
  const handleSleep = () => {
    playSfxSnoring();
    setPetAction("sleeping");
    setPraiseText(`Shhh... ${petName} está tirando uma soneca relaxante e sonhando com estrelas! 💤✨`);
    setTimeout(() => {
      setPetAction("idle");
      setPraiseText("");
    }, 4500);
  };

  // 4. Save name logic
  const handleSavePetName = () => {
    if (!onUpdateKid) return;
    sfx.level();
    const finalName = typedName.trim().slice(0, 14) || "Bichinho";
    onUpdateKid({
      ...kid,
      petName: finalName,
    });
    setIsEditingName(false);
  };

  return (
    <div
      className="p-5 card-block relative overflow-hidden text-left border-2"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)",
        borderColor: C.line || "#D9E5F8",
        borderRadius: 28,
        boxShadow: `0 8px 0 ${C.line || "#D9E5F8"}`,
      }}
    >
      {/* Dynamic Header */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              TAMAGOTCHI DE ESTIMAÇÃO
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Estágio {curStage.stage}
            </span>
          </div>

          {/* Pet Name Editable Inline */}
          <div className="mt-1.5 flex items-center gap-1.5">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  maxLength={14}
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="px-2 py-1 text-sm font-black text-slate-800 bg-slate-50 border-2 border-indigo-400 rounded-lg outline-none max-w-[120px]"
                  style={{ fontFamily: FONT }}
                />
                <button
                  onClick={handleSavePetName}
                  className="w-7 h-7 flex items-center justify-center bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 cursor-pointer border-none"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <h4 className="text-xl font-black text-slate-900" style={{ fontFamily: FONT }}>
                  🤖 {petName}
                </h4>
                <button
                  onClick={() => {
                    sfx.tick();
                    setTypedName(petName);
                    setIsEditingName(true);
                  }}
                  title="Dar outro nome para o Pet"
                  className="text-xs text-slate-400 hover:text-indigo-600 bg-none border-none cursor-pointer outline-none transition-colors"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estrelas do Perfil</div>
          <div className="text-md font-black text-amber-500 whitespace-nowrap">⭐ {totalStars} XP</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center mb-4">
        {/* Animated Custom Scenic Background */}
        <div className="sm:col-span-2 relative h-[180px] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-lg flex items-center justify-center">
          
          {/* BACKGROUND RENDERING PER CHARACTER */}
          

          {/* Floaters based on action */}
          {petAction === "sleeping" && (
            <div className="absolute inset-0 pointer-events-none select-none z-10">
              <span className="absolute text-xl font-bold text-sky-200 animate-bounce" style={{ top: "15%", left: "20%", animationDelay: "0s" }}>Zzz</span>
              <span className="absolute text-2xl font-bold text-indigo-300 animate-bounce" style={{ top: "35%", right: "25%", animationDelay: "1.2s" }}>Zzz</span>
              <span className="absolute text-sm font-bold text-sky-100 animate-bounce" style={{ top: "55%", left: "45%", animationDelay: "2.4s" }}>zZz</span>
            </div>
          )}

          {petAction === "eating" && (
            <div className="absolute inset-0 pointer-events-none select-none z-10">
              <span className="absolute text-2xl animate-ping" style={{ top: "25%", left: "30%" }}>🍏</span>
              <span className="absolute text-2xl animate-ping" style={{ top: "45%", right: "30%" }}>🍖</span>
            </div>
          )}

          {petAction === "playing" && (
            <div className="absolute inset-0 pointer-events-none select-none z-10">
              <span className="absolute text-2xl animate-bounce" style={{ top: "10%", left: "40%" }}>🥎</span>
              <span className="absolute text-2xl animate-pulse" style={{ top: "30%", right: "15%" }}>❤️</span>
              <span className="absolute text-xl animate-pulse" style={{ top: "40%", left: "15%" }}>❤️</span>
            </div>
          )}

          {/* Active Mascot Render */}
          <div 
            className={`z-10 transition-transform duration-300 ${
              petAction === "eating" ? "scale-110 rotate-3" : 
              petAction === "playing" ? "translate-y-[-12px] scale-105" : 
              petAction === "sleeping" ? "scale-95 opacity-90" : "hover:scale-105"
            }`}
          >
            <Mascote 
              theme={kid.theme} 
              stage={curStage.stage} 
              size={150}
              kid={kid}
              bgAccessory={kid.bgAccessory} 
              animation={petAction === "playing" ? "happy" : "idle"}
              
            />
          </div>

          {/* Scenic Badge (nowrap + reticências: o nome do estágio nunca quebra no meio) */}
          <div className="absolute bottom-2 left-2 right-2 z-20 flex">
            <span className="text-[9px] font-bold text-white/90 bg-slate-900/60 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-[2px] whitespace-nowrap overflow-hidden text-ellipsis max-w-full inline-block">
              {curStage.name}
            </span>
          </div>
        </div>

        {/* METRICS & FEEDBACK COLUMN */}
        <div className="sm:col-span-3 flex flex-col justify-between h-full gap-2.5">
          
          {/* Praise Notice Alert Box */}
          <AnimatePresence mode="wait">
            {praiseText ? (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-950 leading-snug"
                style={{ fontFamily: BODY }}
              >
                {praiseText}
              </motion.div>
            ) : (
              <div className="p-2.5 rounded-xl text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50 border border-slate-100">
                Seu pet de estimação vive neste perfil! Quanto mais desafios matemáticos você resolver, mais feliz, forte e alimentado ele ficará!
              </div>
            )}
          </AnimatePresence>

          {/* Tamagotchi 2.0: humor (streak) + energia (alimentação) — só cosmético, nunca punição */}
          <div className="flex flex-col gap-2">
            {/* Humor chip (calculado do streak — nunca vira castigo) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1">
                💛 Humor
              </span>
              <span className="text-[11px] font-black text-indigo-700 flex items-center gap-1">
                {mood.emoji} {mood.label}
              </span>
            </div>
            {/* Energy Bar */}
            <div>
              <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-700 mb-0.5">
                <span className="flex items-center gap-1">⚡ Energia</span>
                <span className={petEnergy <= 20 ? "text-indigo-400 font-black" : "text-indigo-600"}>
                  {petEnergy}% {petEnergy <= 20 ? "😴 sonequinha" : petEnergy >= 90 ? "🔥 A MIL!" : ""}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3.5 border border-slate-200 overflow-hidden relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    petEnergy <= 25 ? "bg-sky-300" : petEnergy <= 60 ? "bg-amber-400" : "bg-emerald-400"
                  }`}
                  style={{ width: `${petEnergy}%` }}
                />
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                {mood.phrase(petName)}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* GAME CARE CONTROL BAR */}
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5">
        
        {/* Feed Button */}
        <button
          onClick={handleFeed}
          disabled={petAction !== "idle"}
          className="flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer select-none transition-all hover:scale-105 active:translate-y-0.5 border border-solid"
          style={{
            background: "#EFF6FF",
            borderColor: "#BFDBFE",
            boxShadow: "0 4px 0 #93C5FD",
            opacity: petAction !== "idle" ? 0.6 : 1,
          }}
        >
          <span className="text-2xl">🍏</span>
          <span className="text-[11px] font-black text-blue-900 mt-1" style={{ fontFamily: FONT }}>
            Alimentar
          </span>
          <span className="text-[9px] font-bold text-blue-700 mt-0.5">
            {petFood > 0 ? `🍖 x${petFood} Grátis` : "🪙 2 moedinhas"}
          </span>
        </button>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          disabled={petAction !== "idle"}
          className="flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer select-none transition-all hover:scale-105 active:translate-y-0.5 border border-solid"
          style={{
            background: "#ECFDF5",
            borderColor: "#A7F3D0",
            boxShadow: "0 4px 0 #6EE7B7",
            opacity: petAction !== "idle" ? 0.6 : 1,
          }}
        >
          <span className="text-2xl">🥎</span>
          <span className="text-[11px] font-black text-emerald-900 mt-1" style={{ fontFamily: FONT }}>
            Brincar
          </span>
          <span className="text-[9px] font-bold text-emerald-700 mt-0.5">
            Pura diversão! 🥎
          </span>
        </button>

        {/* Sleep Button */}
        <button
          onClick={handleSleep}
          disabled={petAction !== "idle"}
          className="flex flex-col items-center justify-center p-2 rounded-2xl cursor-pointer select-none transition-all hover:scale-105 active:translate-y-0.5 border border-solid"
          style={{
            background: "#F5F3FF",
            borderColor: "#DDD6FE",
            boxShadow: "0 4px 0 #C4B5FD",
            opacity: petAction !== "idle" ? 0.6 : 1,
          }}
        >
          <span className="text-2xl">💤</span>
          <span className="text-[11px] font-black text-purple-900 mt-1" style={{ fontFamily: FONT }}>
            Dormir
          </span>
          <span className="text-[9px] font-bold text-purple-700 mt-0.5">
            Sonequinha boa 💤
          </span>
        </button>

      </div>

      {/* EVOLUTION ROAD PROGRESS OVERVIEW */}
      {nextStage ? (
        <div className="mt-4 bg-amber-50/70 rounded-2xl border border-amber-200/50 p-3">
          <div className="flex justify-between text-[11px] font-black text-amber-900 mb-1.5">
            <span>Próxima Evolução: {nextStage.name}</span>
            <span>{totalStars} / {nextStage.minStars} ⭐</span>
          </div>
          <div className="w-full bg-amber-100/60 rounded-full h-3 border border-amber-200 overflow-hidden shadow-inner relative">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[9.5px] font-bold text-amber-700 mt-1.5 leading-relaxed italic">
            💡 Resolva missões matemáticas para ganhar estrelas (XP). Faltam exatamente {nextStage.minStars - totalStars} estrelas de missões para evoluir seu pet!
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
          <span className="text-xs font-black text-indigo-950">
            🚀 MASCOTE EM EVOLUÇÃO MÁXIMA!
          </span>
          <p className="text-[10px] font-bold text-indigo-700 mt-0.5 leading-relaxed">
            Seu {petName} brilha como um Mestre Lendário Supremo da matemática! Você alcançou o nível mais alto possível de glória!
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Custom scenic visual backdrops representing each character theme
 */
function ScenicBackdrop({ theme }: { theme: string }) {
  if (theme === "trex") {
    return (
      <div className="absolute inset-0 overflow-hidden select-none" style={{
        backgroundImage: "url('/mascotes/trex/dojo_pixel_background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        imageRendering: "pixelated"
      }}>
      </div>
    );
  }

  // Spider-Man backdrop
  if (theme === "homem_aranha") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between overflow-hidden select-none">
        {/* Floating spiderwebs */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="30" stroke="#ffffff" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="15" stroke="#ffffff" strokeWidth="0.5" fill="none" />
            <line x1="5" y1="5" x2="95" y2="95" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="95" y1="5" x2="5" y2="95" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#ffffff" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Tall black night skyscrapers with yellow windows */}
        <div className="flex items-end justify-between w-full h-[60px] px-2 absolute bottom-0 z-0 opacity-40">
          <div className="w-8 h-12 bg-slate-950 flex flex-wrap gap-1 p-1">
            <div className="w-1 h-1 bg-yellow-300" /><div className="w-1 h-1 bg-yellow-300" /><div className="w-1 h-1 bg-slate-900" /><div className="w-1 h-1 bg-yellow-300" />
          </div>
          <div className="w-10 h-16 bg-black flex flex-wrap gap-1.5 p-1">
            <div className="w-1.5 h-1.5 bg-yellow-200" /><div className="w-1.5 h-1.5 bg-slate-900" /><div className="w-1.5 h-1.5 bg-yellow-200" /><div className="w-1.5 h-1.5 bg-yellow-200" /><div className="w-1.5 h-1.5 bg-slate-900" />
          </div>
          <div className="w-8 h-10 bg-slate-900 flex flex-wrap gap-1 p-1">
            <div className="w-1 h-1 bg-yellow-300" /><div className="w-1 h-1 bg-slate-950" /><div className="w-1 h-1 bg-yellow-300" />
          </div>
        </div>

        {/* Emojis floating */}
        <span className="absolute text-sm opacity-20" style={{ top: "15%", left: "15%" }}>🕸️</span>
        <span className="absolute text-sm opacity-25" style={{ top: "25%", right: "15%" }}>🏙️</span>
        <span className="absolute text-md opacity-20" style={{ top: "50%", left: "70%" }}>💥</span>
      </div>
    );
  }

  // Batman backdrop
  if (theme === "batman") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-850 overflow-hidden select-none">
        
        {/* Bright glowing yellow bat-signal spotlight */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[110px] h-[110px] rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[70px] h-[70px] rounded-full border-4 border-amber-400/40 bg-amber-400/10 flex items-center justify-center pointer-events-none">
          <span className="text-amber-400/30 font-black text-2xl select-none leading-none">🦇</span>
        </div>

        {/* Gray stone Stalactites at the top */}
        <div className="absolute top-0 left-0 w-full flex justify-between px-3 opacity-30">
          <svg width="40" height="30" viewBox="0 0 20 15"><polygon points="0,0 20,0 10,15" fill="#475569" /></svg>
          <svg width="30" height="25" viewBox="0 0 20 15"><polygon points="0,0 20,0 10,15" fill="#334155" /></svg>
          <svg width="50" height="35" viewBox="0 0 20 15"><polygon points="0,0 20,0 10,15" fill="#475569" /></svg>
        </div>

        {/* Cave floor and equipment silhouettes */}
        <div className="absolute bottom-0 inset-x-0 h-[40px] bg-slate-950/70 border-t border-slate-800/20 flex justify-around items-center px-4 opacity-40">
          <div className="w-5 h-8 bg-indigo-950 rounded flex flex-col gap-1 p-1 border border-indigo-500/10">
            <div className="w-full h-1 bg-emerald-500 animate-pulse" />
            <div className="w-full h-1 bg-sky-500" />
          </div>
          <div className="w-8 h-6 bg-slate-900 rounded flex gap-0.5 p-1 border border-amber-500/10">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
          </div>
        </div>

        <span className="absolute text-sm opacity-20" style={{ top: "35%", left: "10%" }}>🔦</span>
        <span className="absolute text-sm opacity-20" style={{ top: "50%", right: "12%" }}>⚙️</span>
      </div>
    );
  }

  // Elsa backdrop
  if (theme === "elsa") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-200 to-cyan-50 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Ice crystals floating */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-wrap justify-around p-4 gap-6">
          <span className="animate-spin text-sm" style={{ animationDuration: "10s" }}>❄️</span>
          <span className="animate-spin text-lg" style={{ animationDuration: "14s" }}>❄️</span>
          <span className="animate-spin text-xs" style={{ animationDuration: "8s" }}>❄️</span>
        </div>

        {/* Distant icy glowing cyan peaks */}
        <div className="absolute bottom-0 w-full flex items-end opacity-40">
          <svg className="w-full h-[70px] overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
            <polygon points="0,50 30,10 60,50" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="0.5" />
            <polygon points="40,50 70,18 100,50" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="0.5" />
            <polygon points="20,50 50,2 80,50" fill="#BAE6FD" opacity="0.6" />
          </svg>
        </div>

        <span className="absolute text-lg opacity-25" style={{ top: "10%", right: "10%" }}>🏰</span>
        <span className="absolute text-sm opacity-25" style={{ top: "30%", left: "10%" }}>🧊</span>
        <span className="absolute text-xs opacity-25" style={{ bottom: "25%", right: "20%" }}>💙</span>
      </div>
    );
  }

  // Pikachu backdrop
  if (theme === "pikachu") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-300/30 via-emerald-100 to-emerald-300 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Pikachu electrical sparks floating */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-20">
          <span className="absolute text-xl animate-pulse" style={{ top: "15%", left: "15%" }}>⚡</span>
          <span className="absolute text-lg animate-pulse" style={{ top: "45%", right: "15%" }}>⚡</span>
          <span className="absolute text-sm animate-pulse" style={{ top: "55%", left: "45%" }}>⚡</span>
        </div>

        {/* Tall green tree silhouettes at the bottom */}
        <div className="flex items-end justify-around w-full h-[55px] px-3 absolute bottom-0 z-0 opacity-40">
          <svg width="24" height="40" viewBox="0 0 20 30"><polygon points="10,0 20,25 0,25" fill="#047857" /><rect x="8" y="25" width="4" height="5" fill="#065F46" /></svg>
          <svg width="18" height="30" viewBox="0 0 20 30"><polygon points="10,0 20,25 0,25" fill="#059669" /><rect x="8" y="25" width="4" height="5" fill="#065F46" /></svg>
          <svg width="26" height="45" viewBox="0 0 20 30"><polygon points="10,0 20,25 0,25" fill="#047857" /><rect x="8" y="25" width="4" height="5" fill="#065F46" /></svg>
        </div>

        <span className="absolute text-sm opacity-25" style={{ top: "25%", left: "25%" }}>🍒</span>
        <span className="absolute text-md opacity-25" style={{ top: "15%", right: "20%" }}>🔴</span>
      </div>
    );
  }

  // Dino backdrop
  if (theme === "dino") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100 via-green-100 to-amber-200 flex flex-col justify-between overflow-hidden select-none">
        
        {/* Volcanic puff clouds */}
        <div className="absolute top-1 left-4 w-[60px] h-[30px] opacity-25">
          <svg viewBox="0 0 100 50" fill="#78350F">
            <circle cx="20" cy="30" r="20" /><circle cx="50" cy="20" r="25" /><circle cx="80" cy="30" r="20" />
          </svg>
        </div>

        {/* Prehistoric jungle floor with fossils and bones */}
        <div className="absolute bottom-0 w-full h-[45px] bg-[#8B5A2B]/40 flex justify-between items-center px-4 opacity-40 border-t border-amber-600/10">
          <span className="text-sm">🦴</span>
          <span className="text-xs">🦕</span>
          <span className="text-sm">🌿</span>
        </div>

        {/* Prehistoric smoking volcano on bottom left */}
        <div className="absolute bottom-[20px] left-[-15px] opacity-25 scale-75">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <polygon points="10,100 50,30 90,100" fill="#78350F" />
            <polygon points="35,53 50,30 65,53" fill="#D97706" />
            <ellipse cx="50" cy="31" rx="10" ry="4" fill="#EF4444" />
          </svg>
        </div>

        <span className="absolute text-md opacity-25" style={{ top: "35%", right: "10%" }}>🌴</span>
        <span className="absolute text-sm opacity-25" style={{ top: "15%", right: "40%" }}>🌋</span>
      </div>
    );
  }

  // Futebol backdrop
  if (theme === "futebol") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-emerald-100 to-emerald-400 overflow-hidden select-none flex flex-col justify-between">
        {/* Stadium line markers */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" stroke="#ffffff" strokeWidth="2" fill="none" />
            <rect x="0" y="25" width="15" height="50" stroke="#ffffff" strokeWidth="2" fill="none" />
            <rect x="85" y="25" width="15" height="50" stroke="#ffffff" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Goalpost outline at the bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[55px] border-l-4 border-r-4 border-t-4 border-white/30 bg-white/5 opacity-40 z-0" />

        <span className="absolute text-sm opacity-25" style={{ top: "15%", left: "15%" }}>🏟️</span>
        <span className="absolute text-md opacity-25" style={{ top: "25%", right: "15%" }}>🏆</span>
        <span className="absolute text-sm opacity-25" style={{ bottom: "25%", left: "20%" }}>⚽</span>
      </div>
    );
  }

  // Música backdrop
  if (theme === "musica") {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950 via-slate-900 to-indigo-950 overflow-hidden select-none">
        
        {/* Glowing laser light lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="40" y2="100" stroke="#ec4899" strokeWidth="1.5" />
            <line x1="100" y1="0" x2="60" y2="100" stroke="#06b6d4" strokeWidth="1.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="#eab308" strokeWidth="1" />
          </svg>
        </div>

        {/* Large speaker cabinets silhouette at the bottom */}
        <div className="absolute bottom-0 w-full flex justify-between px-3 opacity-30 z-0">
          <div className="w-8 h-12 bg-slate-950 rounded flex flex-col justify-around items-center p-1 border border-indigo-500/10">
            <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-800" />
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800" />
          </div>
          <div className="w-8 h-12 bg-slate-950 rounded flex flex-col justify-around items-center p-1 border border-indigo-500/10">
            <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-800" />
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800" />
          </div>
        </div>

        <span className="absolute text-sm opacity-25 animate-bounce" style={{ top: "15%", left: "15%" }}>🎵</span>
        <span className="absolute text-md opacity-25 animate-bounce" style={{ top: "25%", right: "15%", animationDelay: "1s" }}>🎸</span>
        <span className="absolute text-sm opacity-25" style={{ top: "50%", left: "80%" }}>🎤</span>
      </div>
    );
  }

  // Classic/Default theme backdrop
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-sky-100/40 to-indigo-100 flex flex-col justify-between overflow-hidden select-none">
      <div className="absolute inset-0 opacity-15 pointer-events-none flex flex-wrap justify-around p-4 gap-6">
        <span className="animate-spin text-sm" style={{ animationDuration: "12s" }}>✨</span>
        <span className="text-lg animate-pulse">⭐</span>
        <span className="text-xs">✨</span>
      </div>

      <div className="absolute bottom-0 w-full h-[50px] bg-slate-100/40 border-t border-indigo-100 flex justify-between items-center px-4 opacity-30">
        <span className="text-sm">🔮</span>
        <span className="text-xs">📚</span>
        <span className="text-sm">🕯️</span>
      </div>
    </div>
  );
}

/**
 * Animated SVG Renderer for Mascot's 3 Evolution Stages
 */
export function MascotEvolutionVisual({ 
  theme, 
  stage, 
  size = 90, 
  kid = null 
}: { 
  theme: string; 
  stage: number; 
  size?: number; 
  kid?: any 
}) {
  return (
    <div className="relative flex items-center justify-center">
      <Mascote theme={theme} stage={stage} size={size} kid={kid} />
    </div>
  );
}