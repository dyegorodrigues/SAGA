import React, { useState, useEffect, useRef } from 'react';
import { SagaNode } from '../../utils/grafoSaga';
import { getTrackById } from '../../curriculum/motores/curriculum';
import { Question } from '../../types';
import { GameLoopExerciseRenderer } from '../gameloop/GameLoopExerciseRenderer';
import { ErrorBoundary } from '../ErrorBoundary';
import { AllFichas } from '../../curriculum/fichas';
import { sfx, speak, stopSpeak } from '../Mascot';

interface SandboxModalProps {
  node: SagaNode;
  onClose: () => void;
  nodeNote: string;
  onNoteChange: (nodeId: string, text: string) => void;
}

export function SandboxModal({ node, onClose, nodeNote, onNoteChange }: SandboxModalProps) {
  const [tab, setTab] = useState<"auditoria" | "sandbox">("sandbox");
  const [lvl, setLvl] = useState<number>(1);
  const [q, setQ] = useState<Question | null>(null);
  const [status, setStatus] = useState<"right" | "wrong" | null>(null);
  const [showJson, setShowJson] = useState(false);

  // states from GameLoop
  const [flashHidden, setFlashHidden] = useState(false);
  const [orderTaps, setOrderTaps] = useState<any[]>([]);
  const [orderShake, setOrderShake] = useState<any>(null);
  const [journeyDone, setJourneyDone] = useState(false);
  const [hiddenOpts, setHiddenOpts] = useState<any[]>([]);
  const [armedOpt, setArmedOpt] = useState<any>(null);

  const track = getTrackById(node.id);
  const ficha = AllFichas.find(f => f.id === node.id);

  const generateQ = () => {
    if (track && track.gen) {
      try {
        const newQ = track.gen(lvl);
        setQ(newQ);
        setStatus(null);
        setFlashHidden(false);
        setOrderTaps([]);
        setOrderShake(null);
        setJourneyDone(false);
        setHiddenOpts([]);
        setArmedOpt(null);
        
        // play sound automatically
        stopSpeak();
        setTimeout(() => {
          if (newQ.prompt) {
            speak(newQ.prompt);
          }
        }, 300);

      } catch (err) {
        console.error("Erro ao gerar:", err);
      }
    }
  };

  useEffect(() => {
    if (tab === "sandbox") {
      generateQ();
    }
    return () => {
      stopSpeak();
    };
  }, [lvl, track, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // flash (subitização): mostra o grupo por um relance, depois esconde.
  useEffect(() => {
    if (!q || q.kind !== "flash") return;
    setFlashHidden(false);
    const peekMs = (q.n ?? 0) <= 3 ? 2000 : (q.n ?? 0) <= 5 ? 1700 : 1400;
    const t = setTimeout(() => setFlashHidden(true), peekMs);
    return () => clearTimeout(t);
  }, [q]);

  const peekAgain = () => {
    if (status) return;
    sfx.tick();
    setFlashHidden(false);
    setTimeout(() => setFlashHidden(true), 1200);
  };

  const handleOrderTap = (val: any) => {
    if (status) return;
    const expectedIdx = orderTaps.length;
    if (q && q.answer && Array.isArray(q.answer) && val === q.answer[expectedIdx]) {
      sfx.tick();
      const newTaps = [...orderTaps, val];
      setOrderTaps(newTaps);
      if (newTaps.length === q.answer.length) {
        setStatus("right");
      }
    } else {
      sfx.wrong();
      setOrderShake(val);
      setTimeout(() => setOrderShake(null), 500);
    }
  };

  const handlePick = (val: any, forcedRight?: boolean) => {
    if (status) return;
    if (!q) return;

    if (forcedRight) {
      setStatus("right");
      return;
    }

    if (val === q.answer) {
      setStatus("right");
      sfx.fanfare();
    } else {
      setStatus("wrong");
      sfx.wrong();
      setTimeout(() => setStatus(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col border border-slate-700 shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs font-bold text-indigo-400 tracking-widest">{node.id} - Faixa {node.faixa}</div>
              <h2 className="text-xl font-black text-white">{node.nome}</h2>
            </div>
            {track && (
              <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2">
                <span className="text-xl">{track.icon}</span>
                <span className="text-slate-300 text-sm font-bold">{track.island}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setTab("sandbox")}
                className={`px-4 py-1.5 rounded-lg text-sm font-black transition-colors ${tab === 'sandbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                🎮 Sandbox
              </button>
              <button 
                onClick={() => setTab("auditoria")}
                className={`px-4 py-1.5 rounded-lg text-sm font-black transition-colors ${tab === 'auditoria' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                📝 Auditoria
              </button>
            </div>
            
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-600 transition-colors font-bold text-xl"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* CONTENT */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {tab === "auditoria" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Detalhes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Strand</div>
                    <div className="text-slate-300 font-bold">{node.strand}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Pré-requisitos</div>
                    <div className="text-amber-400 font-medium">{node.prereqs?.join(', ') || 'Nenhum'}</div>
                  </div>
                </div>
              </div>
              
              {ficha && (
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Especificação (Ficha Competência)</h3>
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all">
                      {JSON.stringify(ficha, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Anotações da Auditoria</h3>
                <textarea
                  value={nodeNote || ''}
                  onChange={(e) => onNoteChange(node.id, e.target.value)}
                  placeholder="Anote bugs, lacunas didáticas ou ideias para este nó específico..."
                  className="w-full h-48 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {tab === "sandbox" && (
            <div className="flex-1 flex overflow-hidden">
              {/* ESQUERDA: Controles e JSON */}
              <div className="w-80 border-r border-slate-700 bg-slate-900 flex flex-col shrink-0">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Nível do Gerador</h3>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(l => (
                      <button
                        key={l}
                        onClick={() => setLvl(l)}
                        className={`flex-1 py-2 rounded font-black text-sm transition-colors ${
                          lvl === l 
                            ? 'bg-indigo-500 text-white shadow-md' 
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        L{l}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={generateQ}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>🔄</span> Nova Variação
                  </button>
                </div>
                
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">JSON Dump</h3>
                  <button 
                    onClick={() => setShowJson(!showJson)}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    {showJson ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                
                {showJson && q && (
                  <div className="flex-1 overflow-y-auto p-4 bg-black/50">
                    <pre className="text-[10px] font-mono text-emerald-400 whitespace-pre-wrap break-all">
                      {JSON.stringify(q, null, 2)}
                    </pre>
                  </div>
                )}
                
                {!showJson && (
                  <div className="flex-1 p-4">
                    <p className="text-xs text-slate-500 italic">
                      O Sandbox permite testar infinitas variações sem afetar o banco de dados. 
                      Os erros e acertos aqui não geram progresso nem acionam tutoriais.
                    </p>
                  </div>
                )}
              </div>
              
              {/* DIREITA: Renderização do Jogo */}
              <div className="flex-1 bg-slate-100 relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-6 touch-none">
                {/* Simulador de Tela de Dispositivo */}
                <div className="w-full h-full max-w-2xl mx-auto bg-slate-50 md:rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.1)] md:border-8 border-slate-200 overflow-y-auto overflow-x-hidden relative flex flex-col">
                  
                  {/* BARRA SUPERIOR DO SIMULADOR */}
                  <div className="bg-slate-200/80 border-b border-slate-300 px-4 py-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                        {node.id} • Nível {lvl}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {q && q.prompt && (
                        <button
                          onClick={() => {
                            stopSpeak();
                            speak(q.prompt);
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black flex items-center gap-1 shadow transition-transform active:scale-95"
                          title="Ouvir Enunciado Novamente"
                        >
                          🔊 Ouvir Áudio
                        </button>
                      )}
                      
                      <button
                        onClick={generateQ}
                        className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold transition-transform active:scale-95"
                      >
                        🔄 Regerar
                      </button>
                    </div>
                  </div>

                  {track ? (
                    q ? (
                      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-6 pb-24 relative">
                        <ErrorBoundary onReset={generateQ}>
                          <GameLoopExerciseRenderer
                            q={q}
                            status={status}
                            idx={0}
                            handlePick={handlePick}
                            timeLeft={99}
                            promptDone={true}
                            guidedIdx={null}
                            mockTutorialN={null}
                            tutShow={null}
                            journeyDone={journeyDone}
                            flashHidden={flashHidden}
                            sel={null}
                            totalQFor={() => 8}
                            track={track}
                            aulaSuggest={false}
                            guidedNarr={null}
                            playAulinha={() => {}}
                            setShowClockTutorial={() => {}}
                            sound={true}
                            peekAgain={peekAgain}
                            setJourneyDone={setJourneyDone}
                            orderTaps={orderTaps}
                            handleOrderTap={handleOrderTap}
                            orderShake={orderShake}
                            hiddenOpts={hiddenOpts}
                            armedOpt={armedOpt}
                            setArmedOpt={setArmedOpt}
                          />
                        </ErrorBoundary>

                        {/* Botão de Avançar quando respondido */}
                        {status && (
                          <button
                            onClick={generateQ}
                            className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:translate-y-0.5 text-white text-base font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <span>Avançar para Próximo Exercício</span>
                            <span>➔</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
                        Gerando exercício...
                      </div>
                    )
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-rose-500 p-8 text-center">
                      <div className="text-4xl mb-4">🚧</div>
                      <h3 className="font-black text-xl mb-2">Módulo Não Implementado</h3>
                      <p className="text-sm font-bold opacity-80">
                        O gerador para {node.id} ({node.nome}) ainda não foi construído em curriculum.ts.
                      </p>
                    </div>
                  )}
                  
                  {/* Overlay de Status (Debug) */}
                  {status && (
                    <div className={`absolute top-12 right-4 px-4 py-2 rounded-xl font-black text-white shadow-lg ${status === 'right' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                      {status === 'right' ? 'ACERTOU! 🎉' : 'ERROU! ❌'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
