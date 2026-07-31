import React, { useState, useEffect } from 'react';
import { SagaNode } from '../../utils/grafoSaga';
import { getTrackById } from '../../curriculum/motores/curriculum';
import { Question, Track } from '../../types';
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

function LevelSimulator({ lvl, track, node }: { lvl: number, track: Track, node: SagaNode }) {
  const [q, setQ] = useState<Question | null>(null);
  const [status, setStatus] = useState<"right" | "wrong" | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [flashHidden, setFlashHidden] = useState(false);
  const [orderTaps, setOrderTaps] = useState<any[]>([]);
  const [orderShake, setOrderShake] = useState<any>(null);
  const [journeyDone, setJourneyDone] = useState(false);
  const [hiddenOpts, setHiddenOpts] = useState<any[]>([]);
  const [armedOpt, setArmedOpt] = useState<any>(null);

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
      } catch (err) {
        console.error("Erro ao gerar L" + lvl, err);
      }
    }
  };

  useEffect(() => {
    generateQ();
  }, [lvl, track]);

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
    <div className="flex-1 min-w-[320px] max-w-[400px] h-full flex flex-col bg-white rounded-2xl shadow-lg border-4 border-slate-300 overflow-hidden shrink-0 snap-center relative">
      <div className="bg-slate-800 text-white p-2 flex justify-between items-center z-10 shrink-0">
        <h3 className="font-black text-sm">Nível {lvl}</h3>
        <div className="flex gap-2">
          {q && q.prompt && (
             <button onClick={() => { stopSpeak(); speak(q.prompt); }} className="text-xs bg-indigo-600 px-2 py-1 rounded hover:bg-indigo-500">🔊</button>
          )}
          <button onClick={() => setShowJson(!showJson)} className="text-xs bg-slate-600 px-2 py-1 rounded hover:bg-slate-500">{showJson ? '{ }' : 'UI'}</button>
          <button onClick={generateQ} className="text-xs bg-emerald-600 px-2 py-1 rounded hover:bg-emerald-500">🔄</button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-y-auto overflow-x-hidden p-4 touch-none flex flex-col">
        {showJson && q ? (
          <pre className="text-[10px] font-mono text-slate-800 whitespace-pre-wrap break-all bg-slate-100 p-2 rounded">
            {JSON.stringify(q, null, 2)}
          </pre>
        ) : q ? (
          <ErrorBoundary onReset={generateQ}>
            <div className="transform origin-top scale-90 w-[111%] h-[111%]">
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
            </div>
          </ErrorBoundary>
        ) : (
          <div className="m-auto text-slate-400 font-bold">Gerando...</div>
        )}
      </div>
      {status && (
        <div className={`absolute bottom-4 left-4 right-4 p-2 rounded-xl text-center font-black text-white shadow-lg ${status === 'right' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
          {status === 'right' ? 'ACERTOU! 🎉' : 'ERROU! ❌'}
        </div>
      )}
    </div>
  );
}

export function SandboxModal({ node, onClose, nodeNote, onNoteChange }: SandboxModalProps) {
  const [tab, setTab] = useState<"auditoria" | "sandbox">("sandbox");
  const track = getTrackById(node.id);
  const ficha = AllFichas.find(f => f.id === node.id);

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[70] flex flex-col">
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
              🎮 Sandbox Lado-a-Lado
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
      
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {tab === "auditoria" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
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
          <div className="flex-1 flex overflow-x-auto overflow-y-hidden bg-slate-950 p-6 gap-6 snap-x snap-mandatory">
            {track ? (
              [1, 2, 3, 4, 5].map(lvl => (
                <LevelSimulator key={lvl} lvl={lvl} track={track} node={node} />
              ))
            ) : (
              <div className="m-auto text-rose-500 text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h3 className="font-black text-xl mb-2">Módulo Não Implementado</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
