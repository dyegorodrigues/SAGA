import React, { useState, useEffect } from 'react';
import { State, Track } from '../types';
import { CURRICULUM, ISLAND_DEFS, getTrackById } from "../curriculum/motores/curriculum";
import { AdminGodPanel } from './AdminGodPanel';
import { DOCS_TEXT } from '../docsText';
import { GrafoSaga, SagaNode } from '../utils/grafoSaga';
import { FONT, sfx } from './Mascot';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SandboxModal } from './admin/SandboxModal';

interface AdminDashboardScreenProps {
  state: State;
  onUpdateState: (st: State) => void;
  onBack: () => void;
  onTestTrack: (trackId: string) => void;
  onTestTrackLvl: (trackId: string, lvl: number) => void;
}

export function AdminDashboardScreen({ state, onUpdateState, onBack, onTestTrack, onTestTrackLvl }: AdminDashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "profiles" | "notes" | "docs">("curriculum");
  const [generalNotes, setGeneralNotes] = useState(() => localStorage.getItem("matemagica_dev_notes") || "");
  const [nodeNotes, setNodeNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("saga_node_notes") || "{}");
    } catch {
      return {};
    }
  });
  const [selectedNode, setSelectedNode] = useState<SagaNode | null>(null);
  
  const [filterStrand, setFilterStrand] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "IMPLEMENTED" | "NOT_IMPLEMENTED">("ALL");

  const handleGeneralNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setGeneralNotes(val);
    localStorage.setItem("matemagica_dev_notes", val);
  };

  const handleNodeNoteChange = (nodeId: string, text: string) => {
    const newNotes = { ...nodeNotes, [nodeId]: text };
    setNodeNotes(newNotes);
    localStorage.setItem("saga_node_notes", JSON.stringify(newNotes));
  };

  const exportNotes = () => {
    const data = {
      general: generalNotes,
      byNode: nodeNotes
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saga-audit-notes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-hidden flex flex-col z-50">
      {/* HEADER */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { sfx.tick(); onBack(); }}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white font-bold transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-black text-white" style={{ fontFamily: FONT }}>⚙️ Admin God & Developer Dashboard</h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Controle Absoluto e Visão Arquitetural</p>
          </div>
        </div>
        
        <div className="flex bg-slate-800 p-1 rounded-xl flex-wrap gap-1">
          <button 
            onClick={() => setActiveTab("curriculum")}
            className={`px-4 py-2 rounded-lg text-sm font-black transition-colors ${activeTab === 'curriculum' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📚 Currículo e Testes
          </button>
          
          <button 
            onClick={() => setActiveTab("profiles")}
            className={`px-4 py-2 rounded-lg text-sm font-black transition-colors ${activeTab === 'profiles' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            👥 Gestor de Perfis
          </button>
          <button 
            onClick={() => setActiveTab("docs")}
            className={`px-4 py-2 rounded-lg text-sm font-black transition-colors ${activeTab === 'docs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📖 Documentação & Arquitetura
          </button>
          <button 
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2 rounded-lg text-sm font-black transition-colors ${activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            📝 Anotações/Bugs
          </button>
          <button 
            onClick={() => {
              sfx.tick();
              window.location.hash = "#teste-motor-v2";
              window.location.reload();
            }}
            className="px-4 py-2 rounded-lg text-sm font-black transition-colors text-amber-900 bg-amber-400 hover:bg-amber-300 ml-auto"
          >
            🧪 Testar Mascote V2
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-6 relative">
        
        {/* TAB 1: Curriculum */}
        {activeTab === "curriculum" && (
          <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
              <h2 className="text-white text-lg font-black mb-2">Visão Geral do Grafo Pedagógico (GrafoSaga)</h2>
              <p className="text-slate-400 text-sm mb-6">Aqui você pode visualizar todas as microcompetências mapeadas na Bíblia, ver o que já foi implementado e testar os módulos.</p>
              
              <div className="flex flex-wrap gap-4 mb-8 bg-slate-900 p-4 rounded-xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Eixo:</span>
                  <select 
                    value={filterStrand} 
                    onChange={e => setFilterStrand(e.target.value)}
                    className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">Todos os Eixos</option>
                    {Array.from(new Set(GrafoSaga.nodes.map(n => n.strand))).sort().map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status:</span>
                  <select 
                    value={filterStatus} 
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">Todos</option>
                    <option value="IMPLEMENTED">Apenas Implementados</option>
                    <option value="NOT_IMPLEMENTED">Não Implementados (Pendente)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-8">
                {["F0", "F1", "F2", "F3", "F4"].map(faixa => {
                  let nodesInFaixa = GrafoSaga.nodes.filter(n => n.faixa === faixa);
                  
                  if (filterStrand !== "ALL") {
                    nodesInFaixa = nodesInFaixa.filter(n => n.strand === filterStrand);
                  }
                  
                  if (filterStatus !== "ALL") {
                    nodesInFaixa = nodesInFaixa.filter(n => {
                      const isImp = !!getTrackById(n.id);
                      return filterStatus === "IMPLEMENTED" ? isImp : !isImp;
                    });
                  }
                  
                  if (nodesInFaixa.length === 0) return null;
                  
                  const implementedCount = nodesInFaixa.filter(n => !!getTrackById(n.id)).length;
                  
                  return (
                    <div key={faixa} className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-700 flex justify-between items-center border-b border-slate-600">
                        <div>
                          <h3 className="text-white font-black text-xl drop-shadow-md">Faixa {faixa}</h3>
                          <p className="text-slate-300 font-bold text-xs uppercase tracking-wider">{implementedCount} / {nodesInFaixa.length} Implementados</p>
                        </div>
                      </div>
                      
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nodesInFaixa.map(node => {
                          const track = getTrackById(node.id);
                          const isImplemented = !!track;
                          
                          return (
                            <div key={node.id} className={`rounded-xl p-4 border flex flex-col justify-between transition-colors ${isImplemented ? 'bg-slate-800 border-indigo-500 hover:border-indigo-400' : 'bg-slate-800/50 border-slate-700 opacity-60'} cursor-pointer`} onClick={() => setSelectedNode(node)}>
                              <div>
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl">{track ? track.icon : '🚧'}</span>
                                    <div>
                                      <div className={`text-xs font-bold tracking-widest ${isImplemented ? 'text-indigo-400' : 'text-slate-500'}`}>{node.id} - {node.strand}</div>
                                      <h4 className="text-white font-bold">{node.nome}</h4>
                                    </div>
                                  </div>
                                </div>
                                
                                {node.prereqs && node.prereqs.length > 0 && (
                                  <div className="mt-3 text-xs">
                                    <span className="text-slate-500 font-bold">Reqs: </span>
                                    <span className="text-amber-400 font-medium">{node.prereqs.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                              
                              {isImplemented && (
                                <div className="mt-5 grid grid-cols-5 gap-1">
                                  {[1, 2, 3, 4, 5].map((lvl) => (
                                    <button
                                      key={lvl}
                                      onClick={(e) => { e.stopPropagation(); onTestTrackLvl(node.id, lvl); }}
                                      className="py-1 text-center bg-slate-700 hover:bg-indigo-500 text-slate-300 hover:text-white rounded text-xs font-bold transition-colors"
                                    >
                                      L{lvl}
                                    </button>
                                  ))}
                                </div>
                              )}
                              {!isImplemented && (
                                <div className="mt-5 text-center p-1 border border-dashed border-slate-600 rounded text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  Não Implementado
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* TAB 2: Profiles */}
        {activeTab === "profiles" && (
          <div className="max-w-4xl mx-auto pb-20">
            <AdminGodPanel 
              state={state} 
              onUpdateState={onUpdateState} 
              onClose={() => {}} 
              isEmbedded={true}
            />
          </div>
        )}

        {/* TAB 3: Docs */}
        {activeTab === "docs" && (
          <div className="max-w-4xl mx-auto pb-20">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="markdown-body" style={{ color: '#24292e', backgroundColor: '#ffffff' }}>
                <Markdown remarkPlugins={[remarkGfm]}>{DOCS_TEXT}</Markdown>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Notes */}
        {activeTab === "notes" && (
          <div className="max-w-4xl mx-auto pb-20">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-white text-lg font-black">Anotações Gerais</h2>
                <button onClick={exportNotes} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors">
                  <span>📥</span> Exportar JSON
                </button>
              </div>
              <p className="text-slate-400 text-sm mb-4">Salvo automaticamente no LocalStorage. Use para não perder ideias gerais do projeto.</p>
              <textarea
                value={generalNotes}
                onChange={handleGeneralNotesChange}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ex: Ideias gerais, bugs arquiteturais..."
              />
            </div>
            
            {Object.keys(nodeNotes).length > 0 && (
              <div className="mt-8">
                <h3 className="text-white font-black mb-4">Anotações por Nó</h3>
                <div className="space-y-4">
                  {Object.entries(nodeNotes).map(([id, note]) => {
                    if (!note.trim()) return null;
                    const node = GrafoSaga.nodes.find(n => n.id === id);
                    return (
                      <div key={id} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                        <div className="text-indigo-400 font-bold text-xs mb-1">{id} {node ? `- ${node.nome}` : ''}</div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{note}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* NODE DETAIL MODAL */}
        {selectedNode && (
          <SandboxModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            nodeNote={nodeNotes[selectedNode.id] || ""}
            onNoteChange={handleNodeNoteChange}
          />
        )}
      </div>
    </div>
  );
}
