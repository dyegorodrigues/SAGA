import React, { useEffect, useState } from 'react';
import { SpriteAnimator, Atlas } from './SpriteAnimator';
import { useMascotMotor } from './useMascotMotor';

// Simulação de carregar o JSON (no Next/Vite podemos importar direto se estiver em /src, 
// ou dar um fetch se estiver em /public)
export const MascotEnvironment: React.FC = () => {
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [debugPose, setDebugPose] = useState<string>(''); // Vazio = usar Motor

  // Caminhos para os assets que pedimos para o usuário upar
  const [activeTheme, setActiveTheme] = useState<"trex" | "trex2">("trex");
  const themeDir = activeTheme === "trex2" ? "Trex2" : "trex";
  const atlasUrl = `/mascotes/${themeDir}/atlas.json`;
  const imageUrl = activeTheme === "trex2" ? `/mascotes/${themeDir}/MAGOSHA_spritesheet_4096.png` : `/mascotes/${themeDir}/preview_pro.png`;

  const {
    currentState,
    currentPose,
    positionX,
    energy,
    hunger,
    happiness,
    actions
  } = useMascotMotor();

  useEffect(() => {
    fetch(atlasUrl)
      .then(res => res.json())
      .then(data => setAtlas(data))
      .catch(err => console.error("Erro ao carregar o atlas do T-Rex:", err));
  }, [atlasUrl]);

  // Determinar a pose final: manual ou do motor
  let renderPose = debugPose || currentPose;

  // A animação extra que dá o efeito de "respiração" bem suave, ou de estar atordoado.
  // Evitei o esticar (massinha) forte.
  const getAnimationClass = () => {
    // Se o usuário sobrepôs, não aplicar animação CSS agressiva para poder testar
    if (debugPose) return ''; 
    
    switch (currentState) {
      case 'idle': return 'mascot-breathe';
      case 'walking': return '';
      case 'sleeping': return 'mascot-breathe-slow';
      case 'tired': return 'mascot-tired';
      case 'jumping': return 'mascot-jump';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 flex flex-col items-center">
      <style>{`
        /* Animações bem suaves para não deformar o sprite */
        @keyframes mascotBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .mascot-breathe { animation: mascotBreathe 0.8s ease-in-out infinite; }
        
        @keyframes mascotBreatheSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        .mascot-breathe-slow {
          animation: mascotBreatheSlow 5s ease-in-out infinite;
        }

        @keyframes mascotTired {
          0%, 100% { transform: rotate(0); filter: grayscale(10%); }
          50% { transform: rotate(-2deg); filter: grayscale(10%); }
        }
        .mascot-tired {
          animation: mascotTired 4s ease-in-out infinite;
        }

        @keyframes mascotWalkBob {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(-3deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-8px) rotate(3deg); }
        }
        .mascot-walk-bob {
          animation: mascotWalkBob 0.6s ease-in-out infinite;
        }

        @keyframes mascotJump {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px); }
        }
        .mascot-jump {
          animation: mascotJump 0.5s ease-in-out;
        }

        /* Dojo Wall */
        .dojo-wall {
          background-color: #e6d5b8;
          background-image: url('/mascotes/trex/dojo_pixel_background.webp');
          background-size: cover;
          background-position: center bottom;
          image-rendering: pixelated;
        }

        /* Tatame (opcional se a imagem já cobrir) */
        .tatame-floor {
          /* background-color: #8c9e78; */
        }
      `}</style>
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Painel de Teste de Motor e Física</h2>
        <p className="text-slate-500">Módulo de movimentação e frames. O personagem transita livremente.</p>
      </div>

      {/* Painel Superior de Debug e Seleção */}
      <div className="w-full bg-slate-800 p-4 rounded-t-3xl flex flex-wrap gap-4 items-center justify-between shadow-lg">
        
        
        <div className="flex gap-2 items-center">
          <span className="text-slate-300 text-sm font-bold">Mascote:</span>
          <select 
            value={activeTheme} 
            onChange={(e) => setActiveTheme(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-amber-400 border border-slate-600 text-sm font-bold outline-none focus:border-amber-500 transition-colors"
          >
            <option value="trex">T-Rex (Antigo)</option>
            <option value="trex2">T-Rex 2 (Novo)</option>
          </select>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-slate-300 text-sm font-bold">Forçar Pose:</span>
          <select 
            value={debugPose} 
            onChange={(e) => setDebugPose(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-amber-400 border border-slate-600 text-sm font-bold outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">⚙️ Auto (Motor)</option>
            {atlas && Object.keys(atlas.frames).map(frameName => (
              <option key={frameName} value={frameName}>{frameName}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <span className="text-slate-300 text-sm font-bold">Ações do Motor:</span>
          <button onClick={actions.walk} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-bold transition-colors">Andar (Walk)</button>
          <button onClick={actions.feed} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-bold transition-colors">Alimentar (Eat)</button>
          <button onClick={actions.sleep} className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold transition-colors">Dormir (Sleep)</button>
          <button onClick={actions.play} className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-bold transition-colors">Brincar (Play)</button>
          <button onClick={actions.poke} className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-sm font-bold transition-colors">Irritar (Poke)</button>
        </div>

        
        <div className="flex gap-2 items-center">
          <span className="text-slate-300 text-sm font-bold">Forçar Pose:</span>
          <select 
            value={debugPose} 
            onChange={(e) => setDebugPose(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-700 text-amber-400 border border-slate-600 text-sm font-bold outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">⚙️ Auto (Motor)</option>
            {atlas && Object.keys(atlas.frames).map(frameName => (
              <option key={frameName} value={frameName}>{frameName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* A "Tela do Videogame" (Dojo) */}
      <div 
        className="relative w-full h-[450px] overflow-hidden border-x-8 border-b-8 border-slate-800 shadow-2xl rounded-b-3xl dojo-wall flex flex-col justify-end"
      >
        {/* Camada do chão (Tatame) */}
        <div className="absolute bottom-0 w-full h-32 tatame-floor z-0" />

        {/* Container que gerencia a movimentação horizontal (X) real */}
        <div 
          className="absolute z-10 bottom-2 transition-all duration-[1200ms] ease-linear"
          style={{ left: `${50 + positionX}%`, transform: `translateX(-50%)` }}
        >
          {atlas ? (
            <SpriteAnimator 
              atlas={atlas} 
              imageUrl={imageUrl} 
              currentPose={renderPose} 
              scale={activeTheme === "trex2" ? 0.6 : 0.5} 
              animationClass={getAnimationClass()}
            />
          ) : (
            <div className="bg-slate-900/80 text-white font-bold p-8 rounded-xl text-center shadow-lg border border-slate-700">
              Carregando Atlas...<br/>
              <span className="text-sm font-normal text-slate-300">
                Certifique-se de que os arquivos estão na pasta correta.
              </span>
            </div>
          )}
        </div>

        {/* Interface "HUD" do Videogame */}
        <div className="absolute top-4 left-4 flex gap-4 bg-slate-900/80 p-4 rounded-2xl backdrop-blur-md border border-slate-700 shadow-lg">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-slate-300 uppercase">Fome</span>
            <div className="w-24 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${hunger}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-slate-300 uppercase">Energia</span>
            <div className="w-24 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${energy}%` }} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-slate-300 uppercase">Felicidade</span>
            <div className="w-24 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-600">
              <div className="h-full bg-pink-500 transition-all duration-500" style={{ width: `${happiness}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Controles do Motor */}
      <div className="mt-8 flex flex-wrap gap-4 bg-white border border-slate-200 p-6 rounded-3xl w-full justify-center shadow-md">
        <button 
          onClick={actions.feed}
          className="px-6 py-3 bg-amber-500 text-white font-black rounded-2xl shadow-sm border-b-4 border-amber-700 hover:bg-amber-400 hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all text-sm md:text-lg"
        >
          🍖 Alimentar
        </button>
        <button 
          onClick={actions.play}
          className="px-6 py-3 bg-pink-500 text-white font-black rounded-2xl shadow-sm border-b-4 border-pink-700 hover:bg-pink-400 hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all text-sm md:text-lg"
        >
          🎾 Brincar
        </button>
        <button 
          onClick={actions.sleep}
          className="px-6 py-3 bg-indigo-500 text-white font-black rounded-2xl shadow-sm border-b-4 border-indigo-700 hover:bg-indigo-400 hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all text-sm md:text-lg"
        >
          💤 Dormir
        </button>
        <button 
          onClick={actions.poke}
          className="px-6 py-3 bg-red-500 text-white font-black rounded-2xl shadow-sm border-b-4 border-red-700 hover:bg-red-400 hover:translate-y-1 hover:border-b-0 active:scale-95 transition-all text-sm md:text-lg"
        >
          👈 Cutucar
        </button>
      </div>

    </div>
  );
};
