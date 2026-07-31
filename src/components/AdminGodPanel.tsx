import React, { useState } from "react";
import { Kid, State } from "../types";
import { THEMES, C, FONT, Mascote, sfx } from "./Mascot";
import { getKidLifetimeStars, getMascotStage, STAGES } from "./MascotEvolution";

interface AdminGodPanelProps {
  isEmbedded?: boolean;
  state: State;
  onUpdateState: (newState: State) => void;
  onClose: () => void;
  onTestMascotV2?: () => void;
}

export function AdminGodPanel({ state, onUpdateState, onClose, isEmbedded, onTestMascotV2 }: AdminGodPanelProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("classico");
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [selectedOutfit, setSelectedOutfit] = useState<string>("default");
  const [selectedBg, setSelectedBg] = useState<string>("default");
  const [activeTab, setActiveTab] = useState<"tamagotchis" | "perfis" | "inspetor">("tamagotchis");
  const [selectedKidId, setSelectedKidId] = useState<string>("");

  const themesList = Object.entries(THEMES);

  // Helper to adjust a kid's stars directly by adding custom progress points
  const handleAddStars = (kidId: string, amount: number) => {
    sfx.level();
    const updatedProgress = { ...state.progress };
    const kidProg = { ...(updatedProgress[kidId] || {}) };
    
    // Add stars to a mock/first track to increase their lifetime stars
    const trackId = "t_admin_boost";
    const currentTrackProg = kidProg[trackId] || { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    
    kidProg[trackId] = {
      ...currentTrackProg,
      stars: Math.max(0, currentTrackProg.stars + amount),
    };
    updatedProgress[kidId] = kidProg;

    // Atualiza as moedinhas 🪙 junto (economia dupla)
    const updatedCoins = { ...state.coins };
    updatedCoins[kidId] = Math.max(0, (updatedCoins[kidId] || 0) + amount);

    onUpdateState({
      ...state,
      progress: updatedProgress,
      coins: updatedCoins,
    });
  };

  // Helper to instantly unlock everything for a kid (Mago Supremo)
  const handleMakeSupreme = (kidId: string) => {
    sfx.level();
    const updatedProgress = { ...state.progress };
    const kidProg = { ...(updatedProgress[kidId] || {}) };
    
    // Set 150 stars on a boost track
    kidProg["t_admin_boost"] = {
      lvl: 5,
      streak: 5,
      bad: 0,
      stars: 750,
      ok: 50,
      tot: 50,
      bank: [],
      mast: 1,
    };
    updatedProgress[kidId] = kidProg;

    const updatedCoins = { ...state.coins };
    updatedCoins[kidId] = 150;

    // Add all possible stickers/figururinhas to their album
    const allStickers = [
      "🎨", "🍕", "🚗", "🚀", "🦖", "🦄", "🐼", "🦊", "🦁", "🐰", "⭐", "🎉",
      "🏆", "🍦", "🛸", "👾", "🎸", "⚽", "🌈", "🎈", "🐶", "🐱", "🍎", "👑"
    ];
    const updatedAlbum = { ...state.album };
    updatedAlbum[kidId] = allStickers;

    onUpdateState({
      ...state,
      progress: updatedProgress,
      coins: updatedCoins,
      album: updatedAlbum,
    });
  };

  const handleResetKidStars = (kidId: string) => {
    sfx.wrong();
    const updatedProgress = { ...state.progress };
    updatedProgress[kidId] = {};
    
    const updatedCoins = { ...state.coins };
    updatedCoins[kidId] = 0;

    const updatedAlbum = { ...state.album };
    updatedAlbum[kidId] = [];

    const updatedLog = { ...state.log };
    updatedLog[kidId] = [];

    onUpdateState({
      ...state,
      progress: updatedProgress,
      coins: updatedCoins,
      album: updatedAlbum,
      log: updatedLog,
    });
  };

  return (
    <div className={isEmbedded ? "w-full h-full flex flex-col overflow-y-auto" : "fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"}>
      <div className={isEmbedded ? "bg-white rounded-3xl w-full border-2 border-indigo-500 shadow-xl overflow-hidden flex flex-col min-h-full" : "bg-white rounded-3xl w-full max-w-4xl border-4 border-indigo-500 shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"}>
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white border-b-4 border-indigo-700">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚡</span>
            <div>
              <h2 className="text-xl font-black tracking-wide" style={{ fontFamily: FONT }}>
                ADMIN GOD MODE & DEVELOPER TOOL
              </h2>
              <p className="text-xs text-indigo-100 font-semibold">
                Controle total dos perfis, teste instantâneo de evolução e preview de Mascotes
              </p>
            </div>
          </div>
          {!isEmbedded && (
          <button
            onClick={() => {
              sfx.tick();
              onClose();
            }}
            className="w-10 h-10 bg-indigo-700 hover:bg-rose-600 hover:text-white transition-all rounded-full flex items-center justify-center font-black cursor-pointer text-white border-none outline-none"
          >
            ✕
          </button>
          )}
        </div>

        {/* Tab Selection */}
        <div className="bg-indigo-50 px-6 py-2.5 flex gap-4 border-b border-indigo-100 flex-wrap">
          <button
            onClick={() => {
              sfx.tick();
              setActiveTab("tamagotchis");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "tamagotchis" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-800 hover:bg-indigo-100"
            }`}
            style={{ fontFamily: FONT }}
          >
            🐲 Visualizador de Tamagotchis (Mascotes)
          </button>
          <button
            onClick={() => {
              sfx.tick();
              setActiveTab("perfis");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "perfis" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-800 hover:bg-indigo-100"
            }`}
            style={{ fontFamily: FONT }}
          >
            👥 Gestor de Perfis (Editar Stars & Unlocks)
          </button>
          <button
            onClick={() => {
              sfx.tick();
              setActiveTab("inspetor");
              if (!selectedKidId && state.kids.length > 0) setSelectedKidId(state.kids[0].id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === "inspetor" ? "bg-indigo-600 text-white shadow-sm" : "text-indigo-800 hover:bg-indigo-100"
            }`}
            style={{ fontFamily: FONT }}
          >
            🕵️ Inspetor Avançado (Composer & Progress)
          </button>

          <button
            onClick={() => {
              sfx.tick();
              if (onTestMascotV2) onTestMascotV2();
            }}
            className="px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer text-amber-800 bg-amber-200 hover:bg-amber-300 ml-auto"
            style={{ fontFamily: FONT }}
          >
            🧪 Testar Motor Mascote V2 (SpriteSheet)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          
          {/* TAB 1: Tamagotchi Visualizer */}
          {activeTab === "tamagotchis" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Theme Picker (Left Column) */}
              <div className="md:col-span-4 bg-white p-4 rounded-2xl border-2 border-slate-200/80 flex flex-col gap-2 max-h-[480px] overflow-y-auto shadow-inner">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  Selecione o Mascote
                </span>
                {themesList.map(([id, t]) => (
                  <button
                    key={id}
                    onClick={() => {
                      sfx.tick();
                      setSelectedTheme(id);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer ${
                      selectedTheme === id
                        ? "bg-indigo-50 border-indigo-500 shadow-sm"
                        : "bg-white hover:bg-slate-50 border-transparent text-slate-700"
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-black text-slate-900">{t.nome}</div>
                      <div className="text-[10px] text-slate-500 font-semibold truncate">
                        ID: {id}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Visual Preview Area (Right Column) */}
              <div className="md:col-span-8 flex flex-col gap-6">
                
                {/* SVG Visual Stage */}
                <div className="bg-slate-950 rounded-3xl p-6 border-4 border-indigo-900 shadow-inner relative flex flex-col items-center justify-center min-h-[220px]">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_100%)] pointer-events-none" />
                  <div className="absolute top-2 left-3 font-mono text-[9px] text-indigo-400/80 font-bold select-none">
                    PREVIEW CONTAINER // W_100xH_100 // THEME: {selectedTheme.toUpperCase()}
                  </div>

                  <Mascote
                    theme={selectedTheme}
                    stage={selectedStage}
                    outfit="none"
                    bgAccessory={selectedBg}
                    size={140}
                  />

                  {/* Badges */}
                  <div className="mt-4 flex gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-900/50 border border-indigo-500/30 rounded-full text-[10px] font-bold text-indigo-300">
                      Estágio {selectedStage}
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-950/50 border border-amber-500/30 rounded-full text-[10px] font-bold text-amber-300">
                      Fundo: {selectedBg}
                    </span>
                  </div>
                </div>

                {/* Configurations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Stage Selector */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-200/80 sm:col-span-2">
                    <span className="text-xs font-black text-slate-500 block mb-2.5">
                      Estágio de Evolução
                    </span>
                    <div className="flex gap-2">
                      {STAGES.map((s) => (
                        <button
                          key={s.stage}
                          onClick={() => {
                            sfx.tick();
                            setSelectedStage(s.stage as any);
                          }}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-extrabold border-2 transition-all cursor-pointer ${
                            selectedStage === s.stage
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {s.stage === 1 ? "🥚 Stage 1" : s.stage === 2 ? "👶 Stage 2" : s.stage === 3 ? "👦 Stage 3" : s.stage === 4 ? "🦸 Stage 4" : "👑 Stage 5"}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold leading-relaxed">
                      {STAGES[selectedStage - 1].desc}
                    </p>
                  </div>

                  {/* Custom Scenery/Background Selector */}
                  <div className="bg-white p-4 rounded-2xl border-2 border-slate-200/80 sm:col-span-2">
                    <span className="text-xs font-black text-slate-500 block mb-2">
                      Cenários / Acessórios de Fundo
                    </span>
                    <div className="flex gap-2">
                      {["default", "castelo", "espaco", "campo", "parque"].map((bg) => (
                        <button
                          key={bg}
                          onClick={() => {
                            sfx.tick();
                            setSelectedBg(bg);
                          }}
                          className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedBg === bg
                              ? "bg-indigo-100 text-indigo-800 border-indigo-400"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {bg.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Emojis, Praise Texts and Burst */}
                  <div className="bg-indigo-50/50 p-4 rounded-2xl border-2 border-indigo-100/80 sm:col-span-2">
                    <span className="text-xs font-black text-indigo-950 block mb-1">
                      Textos de Elogio (Praise) do Tema:
                    </span>
                    <div className="flex flex-col gap-1 mb-3.5">
                      {(THEMES[selectedTheme]?.praise || []).map((p, idx) => (
                        <div key={idx} className="text-[11px] font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                          {p}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs font-black text-indigo-950 block mb-1">
                      Elementos Visuais do Tema:
                    </span>
                    <div className="flex gap-2 items-center flex-wrap">
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600">
                        Burst Stickers: {THEMES[selectedTheme]?.burst.join(" ")}
                      </div>
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-600">
                        Objetos/Emojis: {THEMES[selectedTheme]?.emojis.join(" ")}
                      </div>
                    </div>
                  </div>

                  {/* Visualizer of side-by-side evolutions and item directories */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-slate-200/80 sm:col-span-2 text-left mt-2">
                    <h4 className="text-sm font-black text-indigo-950 mb-3" style={{ fontFamily: FONT }}>
                      📋 Matriz de Evolução para {THEMES[selectedTheme]?.nome || selectedTheme} (Ovo ➔ Bebê ➔ Lendário)
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold mb-4">
                      Veja como este mascote se transforma à medida que o aluno ganha estrelas resolvendo desafios de matemática no aplicativo.
                    </p>

                    <div className="grid grid-cols-5 gap-2">
                      {STAGES.map((stg) => (
                        <div key={stg.stage} className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                          <div className="h-14 flex items-center justify-center">
                            <Mascote theme={selectedTheme} stage={stg.stage} outfit="default" bgAccessory="none" size={48} />
                          </div>
                          <div className="text-[8px] font-black text-slate-200 mt-2 truncate max-w-full">
                            {stg.name}
                          </div>
                          <div className="text-[7.5px] text-indigo-400 font-black mt-0.5 whitespace-nowrap">
                            Min: {stg.minStars} ★
                          </div>
                        </div>
                      ))}
                    </div>

                    <h4 className="text-sm font-black text-indigo-950 mt-5 mb-3" style={{ fontFamily: FONT }}>
                      🎒 Catálogo de Guarda-roupa & Itens Customizáveis
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-extrabold text-slate-500 block mb-2">🎓 Acessórios de Corpo (Outfits)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["🎩 Mago", "🦸 Capa", "🎧 Fones", "👑 Coroa", "👓 Óculos", "👔 Gravata", "🎽 Camiseta"].map((itemText, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                              {itemText}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-extrabold text-slate-500 block mb-2">🏟️ Cenários / Fundo</span>
                        <div className="flex flex-wrap gap-1.5">
                          {["🏰 Castelo", "🌌 Espaço", "🏟️ Campo", "🌳 Parque"].map((itemText, idx) => (
                            <span key={idx} className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
                              {itemText}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB 2: Kid Profiles management */}
          {activeTab === "perfis" && (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Lista de Perfis Ativos no Dispositivo ({state.kids.length})
              </span>

              {state.kids.map((k) => {
                const totalStars = getKidLifetimeStars(k.id, state);
                const curStage = getMascotStage(totalStars);

                return (
                  <div
                    key={k.id}
                    className="bg-white rounded-3xl p-5 border-2 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                  >
                    {/* Kid Mascot and Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-950 rounded-2xl border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                        <Mascote theme={k.theme} stage={curStage.stage} size={50} kid={k} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900" style={{ fontFamily: FONT }}>
                            {k.name || "Sem Nome"}
                          </span>
                          <span className="text-sm bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-600">
                            {k.avatar}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500">
                          ID: <code className="bg-slate-50 px-1 py-0.5 rounded text-indigo-600">{k.id}</code> • Série: {k.grade === "pre" ? "👦 Pré-escola" : "🚀 1º Ano"}
                        </p>
                        <div className="mt-1 flex items-center gap-2.5">
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                            ⭐ {totalStars} Estrelas (XP)
                          </span>
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                            🥚 {curStage.name} (Stage {curStage.stage})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Controls for this profile */}
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                        AÇÕES RÁPIDAS
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <button
                          onClick={() => handleAddStars(k.id, 10)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95"
                        >
                          ⭐ +10 Stars
                        </button>
                        <button
                          onClick={() => handleAddStars(k.id, 40)}
                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95"
                        >
                          ⭐ +40 Stars (Evoluir)
                        </button>
                        <button
                          onClick={() => handleMakeSupreme(k.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:brightness-110 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95 shadow-sm"
                        >
                          👑 Mago Supremo (Full Unlock)
                        </button>
                        <button
                          onClick={() => handleResetKidStars(k.id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black rounded-xl cursor-pointer transition-all active:scale-95"
                        >
                          🔄 Resetar Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          {/* TAB 3: Inspetor */}
          {activeTab === "inspetor" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-sm font-black text-slate-600 uppercase tracking-widest">Inspecionar Criança:</span>
                <select 
                  className="bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-indigo-500"
                  value={selectedKidId}
                  onChange={e => setSelectedKidId(e.target.value)}
                >
                  {state.kids.map(k => <option key={k.id} value={k.id}>{k.name} ({k.id})</option>)}
                </select>
              </div>

              {selectedKidId && state.progress[selectedKidId] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PROGRESSO BRUTO */}
                  <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col max-h-[60vh] overflow-y-auto">
                    <h3 className="text-base font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">📈 Progresso Bruto por Trilha</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-2 rounded-tl-lg">Trilha</th>
                          <th className="p-2">Lvl</th>
                          <th className="p-2">Streak</th>
                          <th className="p-2">Mast</th>
                          <th className="p-2 rounded-tr-lg">Acertos</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {Object.entries(state.progress[selectedKidId]).map(([tId, p]) => (
                          <tr key={tId} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-indigo-600">{tId}</td>
                            <td className="p-2 font-bold">{p.lvl}</td>
                            <td className="p-2">{p.streak}</td>
                            <td className="p-2">{p.mast}</td>
                            <td className="p-2 text-emerald-600">{p.ok}/{p.tot}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* COMPOSER LOG & BUTTONS */}
                  <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto">
                    
                    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm">
                      <h3 className="text-base font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">🛠️ Botões de Teste (Forçar / Simular)</h3>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input id="forceTrack" type="text" placeholder="ID (ex: N1.01)" className="border p-2 rounded text-xs w-24" />
                          <button onClick={() => {
                            const tId = (document.getElementById('forceTrack') as HTMLInputElement).value;
                            if (!tId) return;
                            const prog = {...state.progress};
                            if(!prog[selectedKidId]) prog[selectedKidId] = {};
                            if(!prog[selectedKidId][tId]) prog[selectedKidId][tId] = {lvl:1, streak:0, bad:0, stars:0, ok:0, tot:0, bank:[], mast:0};
                            prog[selectedKidId][tId].lvl = Math.min(5, prog[selectedKidId][tId].lvl + 1);
                            onUpdateState({...state, progress: prog});
                            alert("Nível forçado para " + prog[selectedKidId][tId].lvl);
                          }} className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded font-bold text-xs">Avançar Lvl</button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input id="forceErrTag" type="text" placeholder="Tag de erro" className="border p-2 rounded text-xs w-24" />
                          <button onClick={() => {
                            const tag = (document.getElementById('forceErrTag') as HTMLInputElement).value;
                            const tId = (document.getElementById('forceTrack') as HTMLInputElement).value || "N1.01";
                            if (!tag) return;
                            const prog = {...state.progress};
                            if(!prog[selectedKidId]) prog[selectedKidId] = {};
                            if(!prog[selectedKidId][tId]) prog[selectedKidId][tId] = {lvl:1, streak:0, bad:0, stars:0, ok:0, tot:0, bank:[], mast:0};
                            prog[selectedKidId][tId].bank.push({ sig: tag, hits: 1, q: { kind: 'mock', prompt: '', answer: 0 } as any });
                            onUpdateState({...state, progress: prog});
                            alert("Erro simulado com tag: " + tag);
                          }} className="bg-rose-100 text-rose-700 px-3 py-2 rounded font-bold text-xs">Simular Erro</button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex-1 flex flex-col min-h-[300px]">
                      <h3 className="text-base font-black text-slate-800 mb-4 border-b border-slate-100 pb-2">🧠 Log de Decisão do Composer</h3>
                      <div className="flex-1 overflow-y-auto bg-slate-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 space-y-3">
                        {state.log && state.log[selectedKidId] && state.log[selectedKidId].length > 0 ? (
                          [...state.log[selectedKidId]].reverse().map((entry, idx) => (
                            <div key={idx} className="border-b border-slate-700 pb-2">
                              <span className="text-slate-500">[{new Date(entry.t).toLocaleTimeString()}]</span>
                              <div className="text-emerald-300 mt-1 whitespace-pre-wrap">{entry.d}</div>
                              {entry.stars !== undefined && <div className="text-amber-400 mt-1">⭐ +{entry.stars} stars</div>}
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 italic">Nenhum log registrado ainda. Jogue uma rodada!</div>
                        )}
                      </div>
                    </div>
                    
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-400 font-bold">Nenhum dado encontrado para a criança selecionada.</div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        {!isEmbedded && (
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] font-bold text-slate-400">
            © MATEMÁGICA IA DEV-TOOLS — MODO GOD ATIVADO
          </span>
          <button
            onClick={() => {
              sfx.tick();
              onClose();
            }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black cursor-pointer shadow-md transition-all active:translate-y-0.5"
            style={{ fontFamily: FONT }}
          >
            Fechar Painel ⚡
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
