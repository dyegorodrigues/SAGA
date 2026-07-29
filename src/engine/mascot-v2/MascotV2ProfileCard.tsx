import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Kid, State } from "../../types";
import { FONT, BODY, sfx } from "../../components/Mascot";
import { getKidLifetimeStars, getMascotStage } from "../../components/MascotEvolution";
import { useMascotMotor } from "./useMascotMotor";
import { SpriteAnimator, Atlas } from "./SpriteAnimator";

interface MascotEvoProps {
  kid: Kid;
  state: State;
  onUpdateKid?: (k: Kid, coinsToSpend?: number) => void;
  coins?: number;
}

export function MascotV2ProfileCard({ kid, state, onUpdateKid, coins = 0 }: MascotEvoProps) {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const themeDir = kid.theme === "trex2" ? "Trex2" : "trex";
  const atlasUrl = `/mascotes/${themeDir}/atlas.json`;
  const imageUrl = kid.theme === "trex2" ? `/mascotes/${themeDir}/MAGOSHA_spritesheet_4096.png` : `/mascotes/${themeDir}/preview_pro.png`;

  useEffect(() => {
    fetch(atlasUrl)
      .then(res => res.json())
      .then(data => setAtlas(data))
      .catch(err => console.error("Erro ao carregar o atlas do T-Rex:", err));
  }, [atlasUrl]);

  // Integração do state do motor
  // Usamos kid.petEnergy inicial
  const motor = useMascotMotor({
    initialEnergy: kid.petEnergy != null ? kid.petEnergy : 100,
    initialHunger: 80,
    initialHappiness: 100
  });

  const petName = kid.petName || "T-Rex";
  const [isEditingName, setIsEditingName] = useState(false);
  const [typedName, setTypedName] = useState(petName);

  const totalStars = getKidLifetimeStars(kid.id, state);
  const curStage = getMascotStage(totalStars);

  const handleSavePetName = () => {
    if (!onUpdateKid) return;
    sfx.level();
    const finalName = typedName.trim().slice(0, 14) || "T-Rex";
    onUpdateKid({ ...kid, petName: finalName });
    setIsEditingName(false);
  };

  // Animação CSS suave
  const getAnimationClass = () => {
    switch (motor.currentState) {
      case 'idle': return 'mascot-breathe';
      case 'walking': return '';
      case 'sleeping': return 'mascot-breathe-slow';
      case 'tired': return 'mascot-tired';
      case 'jumping': return 'mascot-jump';
      default: return 'mascot-breathe';
    }
  };

  return (
    <div
      className="p-5 relative overflow-hidden text-left border-2"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%)",
        borderColor: "#D9E5F8",
        borderRadius: 28,
        boxShadow: `0 8px 0 #D9E5F8`,
      }}
    >
      <style>{`
        @keyframes mascotBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .mascot-breathe { animation: mascotBreathe 0.8s ease-in-out infinite; }
        @keyframes mascotBreatheSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .mascot-breathe-slow { animation: mascotBreatheSlow 5s ease-in-out infinite; }
        @keyframes mascotWalkBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
        .mascot-walk-bob { animation: mascotWalkBob 0.6s ease-in-out infinite; }
        @keyframes mascotTired {
          0%, 100% { transform: rotate(0); filter: grayscale(10%); }
          50% { transform: rotate(-2deg); filter: grayscale(10%); }
        }
        .mascot-tired { animation: mascotTired 4s ease-in-out infinite; }
        @keyframes mascotJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .mascot-jump { animation: mascotJump 0.5s ease-in-out; }
      `}</style>

      {/* Dynamic Header */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              TAMAGOTCHI V2
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              Estágio {curStage.stage}
            </span>
          </div>

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
                  className="text-xs text-slate-400 hover:text-indigo-600 bg-none border-none cursor-pointer outline-none transition-colors"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estrelas</div>
          <div className="text-md font-black text-amber-500 whitespace-nowrap">⭐ {totalStars} XP</div>
        </div>
      </div>

      <div className="w-full mb-4">
        {/* DOJO SCREEN */}
        <div className="w-full relative h-[180px] rounded-3xl overflow-hidden border-4 border-slate-900 shadow-inner flex flex-col justify-end" style={{
          backgroundImage: "url('/mascotes/trex/dojo_pixel_background.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          imageRendering: "pixelated"
        }}>
          {/* HUD Indicators on Dojo */}
          <div className="absolute top-2 left-2 right-2 flex justify-between px-1 z-20 pointer-events-none">
             <div className="flex flex-col gap-0.5">
               <span className="text-[8px] font-black text-white/80 uppercase drop-shadow-md">Fome</span>
               <div className="w-16 h-2 bg-slate-900/50 rounded-full border border-white/20 overflow-hidden">
                 <div className="h-full bg-amber-400 transition-all duration-300" style={{width: `${motor.hunger}%`}} />
               </div>
             </div>
             <div className="flex flex-col gap-0.5 items-end">
               <span className="text-[8px] font-black text-white/80 uppercase drop-shadow-md">Energia</span>
               <div className="w-16 h-2 bg-slate-900/50 rounded-full border border-white/20 overflow-hidden">
                 <div className="h-full bg-blue-400 transition-all duration-300" style={{width: `${motor.energy}%`}} />
               </div>
             </div>
          </div>

          <div 
            className="absolute z-10 transition-all duration-[1200ms] ease-linear pointer-events-none"
            style={{ bottom: "16px", left: `${50 + motor.positionX}%`, transform: `translateX(-50%)` }}
          >
            {atlas ? (
              <SpriteAnimator 
                atlas={atlas} 
                imageUrl={imageUrl} 
                currentPose={motor.currentPose} 
                scale={kid.theme === "trex2" ? 0.20 : 0.22} 
                animationClass={getAnimationClass()}
              />
            ) : null}
          </div>
          
          <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
            <span className="text-[9px] font-bold text-white/90 bg-slate-900/60 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-[2px]">
              {curStage.name}
            </span>
          </div>
        </div>
      </div>

      {/* 4 BUTTONS (Walk is autonomous) */}
      <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3.5">
        <button
          onClick={motor.actions.feed}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl cursor-pointer transition-all hover:scale-105 active:translate-y-0.5 border-b-4 bg-amber-500 border-amber-700 text-white shadow-sm"
        >
          <span className="text-xl">🍖</span>
          <span className="text-[10px] font-black mt-1" style={{ fontFamily: FONT }}>Alimentar</span>
        </button>

        <button
          onClick={motor.actions.play}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl cursor-pointer transition-all hover:scale-105 active:translate-y-0.5 border-b-4 bg-pink-500 border-pink-700 text-white shadow-sm"
        >
          <span className="text-xl">🎾</span>
          <span className="text-[10px] font-black mt-1" style={{ fontFamily: FONT }}>Brincar</span>
        </button>

        <button
          onClick={motor.actions.sleep}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl cursor-pointer transition-all hover:scale-105 active:translate-y-0.5 border-b-4 bg-indigo-500 border-indigo-700 text-white shadow-sm"
        >
          <span className="text-xl">💤</span>
          <span className="text-[10px] font-black mt-1" style={{ fontFamily: FONT }}>Dormir</span>
        </button>

        <button
          onClick={motor.actions.poke}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl cursor-pointer transition-all hover:scale-105 active:translate-y-0.5 border-b-4 bg-red-500 border-red-700 text-white shadow-sm"
        >
          <span className="text-xl">👈</span>
          <span className="text-[10px] font-black mt-1" style={{ fontFamily: FONT }}>Cutucar</span>
        </button>
      </div>

    </div>
  );
}
