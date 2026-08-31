import React, { useState } from 'react';
import { Track, Progress } from '../types';
import { isTrackUnlocked, UnlockStatus } from "../curriculum/motores/unlockEngine";
import { ISLAND_DEFS } from "../curriculum/motores/curriculum";
import { C, FONT, sfx } from './Mascot';
import { Icone, ICONE_DA_ILHA } from './icones/Icone';
import { TINTA_TRAVADA, FUNDO_TRAVADO, BORDA_TRAVADA } from '../styles/coresDoNo';

interface Props {
  tracks: Track[];
  progOf: (trackId: string) => Progress;
  unlockStatus: UnlockStatus;
  onSelectTrack: (track: Track) => void;
}

export function LearningPath({ tracks, progOf, unlockStatus, onSelectTrack }: Props) {
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
                const isLocked = !isTrackUnlocked(track.id, track.graphId, unlockStatus);
                const nodeId = track.graphId || track.id;
                const isFrontier = unlockStatus.frontier.includes(nodeId);
                const lvl = p.lvl || 1;
                const isDominated = p.dom;
                const offset = offsets[i % offsets.length];
                const iconeDaIlha = ICONE_DA_ILHA[track.island] || "estrela";

                return (
                  <div key={track.id} className="relative z-10 my-6 flex flex-col items-center group" style={{ transform: `translateX(${offset}px)` }}>
                    
                    {/* Nome da Microcompetência */}
                    <div className="absolute -top-10 bg-white shadow-sm border-2 border-slate-100 px-3 py-1 rounded-xl font-bold whitespace-nowrap z-20 pointer-events-none flex flex-col items-center transition-all opacity-90 group-hover:opacity-100" style={{ color: isLocked ? TINTA_TRAVADA : track.dark, fontFamily: FONT }}>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5 font-black">{track.graphId || track.id}</span>
                      <span className="text-sm">{track.name}</span>
                    </div>

                    {/* Botão circular da Trilha */}
                    <button
                      onClick={() => !isLocked && onSelectTrack(track)}
                      disabled={isLocked}
                      aria-label={`${track.name}: ${isLocked ? 'travada' : 'disponível'}`}
                      className={`relative w-[76px] h-[76px] rounded-full border-b-[6px] flex items-center justify-center shadow-sm transition-all active:translate-y-1.5 active:border-b-0 ${isLocked ? 'cursor-not-allowed hover:scale-100' : 'cursor-pointer hover:scale-105'}`}
                      style={{
                        backgroundColor: isLocked ? FUNDO_TRAVADO : track.color,
                        borderColor: isLocked ? BORDA_TRAVADA : track.dark,
                      }}
                    >
                      {/* O disco branco existe para a ARTE ser legível. O ícone é
                          ilustração colorida, e onze ilhas dão onze fundos: a chave
                          cinza da Oficina somia no marrom de GM, o × roxo no roxo de
                          N4. Sobre o branco, toda arte lê em toda ilha — e o anel
                          colorido em volta continua dizendo de que ilha é o nó. */}
                      <span className="w-[54px] h-[54px] rounded-full bg-white/90 flex items-center justify-center">
                        {/* Travada mostra o cadeado; aberta mostra o que a ilha ensina. */}
                        <Icone nome={isLocked ? "travada" : iconeDaIlha} tamanho={36} />
                      </span>

                      {/* Coroa de Domínio */}
                      {isDominated && (
                        <span className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                          <Icone nome="coroa" tamanho={20} />
                        </span>
                      )}
                    </button>
                    
                    {/* Progresso (Nível) Limpo — ícone E palavra: a cor e o desenho
                        são reforço, quem carrega o estado é o texto. */}
                    <div className="mt-2 text-[10px] uppercase tracking-wider font-black flex items-center gap-1" style={{ color: isLocked ? TINTA_TRAVADA : track.dark }}>
                      {isLocked ? 'Travada'
                        : isDominated ? <><Icone nome="coroa" tamanho={14} />Dominado</>
                        : isFrontier ? <><Icone nome="fronteira" tamanho={14} />Fronteira</>
                        : `Nível ${lvl}`}
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
