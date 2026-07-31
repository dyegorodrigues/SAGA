import React, { useState, useEffect } from "react";
import { useMascotMotor } from "./useMascotMotor";
import { SpriteAnimator, Atlas } from "./SpriteAnimator";

export function MascotV2Mini({ size = 96, animation = "idle", activeTheme = "trex" }: { size?: number | string; animation?: "idle" | "walk" | "happy"; activeTheme?: string; }) {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const themeDir = activeTheme === 'trex2' ? 'Trex2' : 'trex';
  const atlasUrl = `/mascotes/${themeDir}/atlas.json`;
  const imageUrl = activeTheme === 'trex2' ? `/mascotes/${themeDir}/MAGOSHA_spritesheet_4096.png` : `/mascotes/${themeDir}/preview_pro.png`;

  useEffect(() => {
    fetch(atlasUrl)
      .then(res => res.json())
      .then(data => setAtlas(data))
      .catch(err => console.error("Erro ao carregar o atlas do T-Rex:", err));
  }, [atlasUrl]);

  const motor = useMascotMotor(); // Autonomous is enabled!

  // Se size for string, vamos tentar extrair um número razoável, senão usar um scale fixo.
  // Em geral o tamanho do sprite original é ~150px.
  // Queremos que ele caiba dentro de "size".
  const numericSize = typeof size === 'number' ? size : parseInt(size.toString()) || 96;
  const scale = numericSize / 350; // Fixed scale per C2

  let currentPose = motor.currentPose;
  let animClass = "";

  if (animation === "happy") {
    currentPose = "victory_jump";
    animClass = "mascot-jump";
  } else if (animation === "walk") {
    currentPose = "walk_right";
    animClass = "mascot-walk-bob";
  } else {
    // idle -> usa o motor normalmente
    switch (motor.currentState) {
      case 'idle': animClass = 'mascot-breathe'; break;
      case 'walking': animClass = ''; break;
      case 'sleeping': animClass = 'mascot-breathe-slow'; break;
      case 'jumping': animClass = 'mascot-jump'; break;
      case 'looking':
      case 'sitting':
      case 'blinking':
      case 'sneezing': animClass = 'mascot-breathe'; break;
      default: animClass = 'mascot-breathe'; break;
    }
  }

  // Se ele está em uma animação forçada, não move a posição autônoma.
  // Se está livre (idle/autonomous), ele usa um pouco do positionX para dar vida no widget.
  const positionOffset = (animation === "idle" && motor.positionX !== 0) ? motor.positionX * 0.4 : 0;

  return (
    <div style={{ width: numericSize, height: numericSize }} className="relative flex items-end justify-center overflow-visible pointer-events-none pb-2">
      <style>{`
        @keyframes mascotBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes mascotBreatheMini {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes mascotWalkBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        .mascot-breathe { animation: mascotBreathe 0.8s ease-in-out infinite; }
        .mascot-breathe-slow { animation: mascotBreatheMini 5s ease-in-out infinite; }
        .mascot-walk-bob { animation: mascotWalkBob 0.6s ease-in-out infinite; }
        .mascot-jump { transform: translateY(-10px); transition: transform 0.3s; }
      `}</style>
      
      {atlas ? (
        <div 
          className="transition-all duration-[1200ms] ease-linear"
          style={{ transform: `translateX(${positionOffset}px)` }}
        >
          <SpriteAnimator 
            atlas={atlas} 
            imageUrl={imageUrl} 
            currentPose={currentPose} 
            scale={scale} 
            animationClass={animClass}
          />
        </div>
      ) : null}
    </div>
  );
}
