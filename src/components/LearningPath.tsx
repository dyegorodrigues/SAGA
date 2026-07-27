import React, { useState } from 'react';
import { Track, Progress } from '../types';
import { computeUnlockStatus } from "../curriculum/motores/unlockEngine";
import { ISLAND_DEFS } from "../curriculum/motores/curriculum";
import { C, FONT, sfx } from './Mascot';

interface Props {
  tracks: Track[];
  progOf: (trackId: string) => Progress;
  onSelectTrack: (track: Track) => void;
}


export function LearningPath({ tracks, progOf, onSelectTrack }: Props) {
  // Build a pMap for computeUnlockStatus
  const pMap = tracks.reduce((acc, t) => {
    acc[t.id] = progOf(t.id);
    return acc;
  }, {} as Record<string, Progress>);
  const status = computeUnlockStatus(pMap);
  
  // Group tracks by island
  const islandGroups: Record<string, Track[]> = {};
  tracks.forEach(t => {
    const key = t.island || "default";
    if (!islandGroups[key]) islandGroups[key] = [];
    islandGroups[key].push(t);
  });
  
  // Determine order based on what appears in the array first
  const orderedIslands = Object.keys(islandGroups);
  const offsets = [0, -35, 0, 35]; // zigzag suave reduzido

  return (
    <div className="w-full flex flex-col items-center pb-20">
      {orderedIslands.map((islandKey) => {
        const islandMeta = ISLAND_DEFS[islandKey] || ISLAND_DEFS["default"];
        const islandTracks = islandGroups[islandKey];
        
        return (
          <div key={islandKey} className="w-full max-w-sm mb-12">
            {/* Cabeçalho da Ilha Limpo e Elegante */}
            <div className="w-full text-center mb-10">
              <div className="inline-flex flex-col items-center">
                <div className="w-16 h-1 bg-slate-200 rounded-full mb-4" />
                <h3 className="text-slate-800 font-black text-2xl" style={{ fontFamily: FONT }}>{islandMeta.title}</h3>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{islandMeta.subtitle}</p>
              </div>
            </div>

            {/* Corpo da Ilha (Trilhas / Microcompetências) */}
            <div className="flex flex-col items-center relative">
              
              {/* Caminho pontilhado de fundo */}
              <div className="absolute top-0 bottom-0 w-2.5 bg-slate-100 rounded-full -z-10" />

              {islandTracks.map((track, i) => {
                const p = progOf(track.id);
                const isLocked = !status.opened.includes(track.id);
                const isFrontier = status.frontier.includes(track.id);
                const lvl = p.lvl || 1;
                const isDominated = p.dom;
                const offset = offsets[i % offsets.length];

                return (
                  <div key={track.id} className="relative z-10 my-6 flex flex-col items-center group" style={{ transform: `translateX(${offset}px)` }}>
                    
                    {/* Nome da Microcompetência */}
                    <div className="absolute -top-10 bg-white shadow-sm border-2 border-slate-100 px-3 py-1 rounded-xl font-bold whitespace-nowrap z-20 pointer-events-none flex flex-col items-center transition-all opacity-90 group-hover:opacity-100" style={{ color: isLocked ? '#94A3B8' : track.dark, fontFamily: FONT }}>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 font-black">{track.graphId || track.id}</span>
                      <span className="text-sm">{track.name}</span>
                    </div>

                    {/* Botão circular da Trilha */}
                    <button
                      onClick={() => !isLocked && onSelectTrack(track)}
                      className={`relative w-[76px] h-[76px] rounded-full border-b-[6px] flex items-center justify-center text-3xl shadow-sm transition-all active:translate-y-1.5 active:border-b-0 cursor-pointer ${isLocked ? 'opacity-50 grayscale hover:scale-100' : 'hover:scale-105'}`}
                      style={{
                        backgroundColor: isLocked ? '#F1F5F9' : track.color,
                        borderColor: isLocked ? '#CBD5E1' : track.dark,
                      }}
                    >
                      {track.icon}

                      {/* Coroa de Domínio */}
                      {isDominated && (
                        <div className="absolute -top-2 -right-2 text-xl drop-shadow-md">
                          👑
                        </div>
                      )}
                    </button>
                    
                    {/* Progresso (Nível) Limpo */}
                    <div className="mt-2 text-[10px] uppercase tracking-wider font-black" style={{ color: isLocked ? '#94A3B8' : track.dark }}>
                      {isLocked ? '🔒 Travada' : isDominated ? '👑 Dominado' : isFrontier ? '🔥 Fronteira' : `Nível ${lvl}`}
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
