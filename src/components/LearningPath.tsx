import React, { useState } from 'react';
import { Track, Progress } from '../types';
import { ISLAND_DEFS } from '../utils/curriculum';
import { C, FONT, sfx } from './Mascot';

interface Props {
  tracks: Track[];
  progOf: (trackId: string) => Progress;
  onSelectTrack: (track: Track) => void;
}


export function LearningPath({ tracks, progOf, onSelectTrack }: Props) {
  const [expandedIsland, setExpandedIsland] = useState<string | null>(null); // changed to island string ID
  
  // Group tracks by island
  const islandGroups: Record<string, Track[]> = {};
  tracks.forEach(t => {
    const key = t.island || "default";
    if (!islandGroups[key]) islandGroups[key] = [];
    islandGroups[key].push(t);
  });
  
  // Determine order based on what appears in the array first
  const orderedIslands = Object.keys(islandGroups);
  
  // Initialize expanded island to the first one if null
  if (expandedIsland === null && orderedIslands.length > 0) {
    setExpandedIsland(orderedIslands[0]);
  }

  const offsets = [0, -45, 0, 45]; // zigzag suave

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {orderedIslands.map((islandKey) => {
        const islandMeta = ISLAND_DEFS[islandKey] || ISLAND_DEFS["default"];
        const islandTracks = islandGroups[islandKey];
        const isExpanded = expandedIsland === islandKey;
        
        return (
          <div key={islandKey} className="w-full max-w-sm mb-6">
            {/* Cabeçalho da Ilha (Módulo) */}
            <button 
              onClick={() => {
                sfx.tick();
                setExpandedIsland(isExpanded ? null : islandKey);
              }}
              className={`w-full p-5 rounded-3xl text-left transition-all active:scale-95 shadow-md border-b-4 border-black/10 bg-gradient-to-br ${islandMeta.color}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-black text-xl drop-shadow-md" style={{ fontFamily: FONT }}>{islandMeta.title}</h3>
                  <p className="text-white/90 font-bold text-sm mt-0.5">{islandMeta.subtitle}</p>
                </div>
                <div className="text-white text-2xl font-black bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>
            </button>

            {/* Corpo da Ilha (Trilhas / Microcompetências) */}
            <div className={`transition-all overflow-hidden duration-300 ease-in-out flex flex-col items-center relative ${isExpanded ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              
              {/* Caminho pontilhado de fundo */}
              {isExpanded && (
                 <div className="absolute top-0 bottom-0 w-3 bg-slate-200/60 rounded-full -z-10" />
              )}

              {islandTracks.map((track, i) => {
                const p = progOf(track.id);
                const isLocked = false;
                const lvl = p.lvl || 1;
                const isDominated = p.dom;
                const offset = offsets[i % offsets.length];

                return (
                  <div key={track.id} className="relative z-10 my-6 flex flex-col items-center group" style={{ transform: `translateX(${offset}px)` }}>
                    
                    {/* Nome e Código da Microcompetência */}
                    <div className="absolute -top-12 bg-white shadow-md border-2 border-slate-100 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap z-20 pointer-events-none flex flex-col items-center" style={{ color: track.dark, fontFamily: FONT }}>
                      {track.graphId && (
                        <span className="text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 font-black">{track.graphId}</span>
                      )}
                      <span className="text-sm">{track.name}</span>
                    </div>

                    {/* Botão circular da Trilha */}
                    <button
                      onClick={() => !isLocked && onSelectTrack(track)}
                      className={`relative w-[88px] h-[88px] rounded-full border-b-8 flex items-center justify-center text-4xl shadow-md transition-all active:translate-y-2 active:border-b-0 cursor-pointer ${isLocked ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
                      style={{
                        backgroundColor: isLocked ? '#e2e8f0' : track.color,
                        borderColor: isLocked ? '#cbd5e1' : track.dark,
                      }}
                    >
                      {track.icon}

                      {/* Coroa de Domínio */}
                      {isDominated && (
                        <div className="absolute -top-2 -right-2 text-2xl drop-shadow-md animate-bounce">
                          👑
                        </div>
                      )}
                    </button>
                    
                    {/* Progresso (Nível) */}
                    <div className="mt-2.5 bg-white border-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black shadow-sm" style={{ borderColor: track.color, color: track.dark }}>
                      {isDominated ? 'Dominado' : `Nível ${lvl}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
