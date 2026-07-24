import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Shield, LogOut, Sparkles, Smile, Play, Check, X, User } from "lucide-react";
import { State, Kid } from "../types";
import { THEMES, THEME_EMOJIS, C, FONT, Mascote, StarChip, sfx } from "./Mascot";
import { getKidLifetimeStars, getMascotStage } from "./MascotEvolution";

interface PickProps {
  state: State;
  onKid: (id: string) => void;
  onParent: () => void;
  onFactoryReset?: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
  onTriggerLogin?: () => void;
  onTriggerAdmin?: () => void;
  onAddKid?: (newKid: Kid) => void;
  onDeleteKid?: (id: string) => void;
}

const getDefaultPetName = (theme: string) => {
  const names: Record<string, string> = {
    classico: "Mago",
    homem_aranha: "Teioso",
    batman: "Morceguinho",
    elsa: "Floquinho",
    pikachu: "Faísca",
    heroi: "Super-Pet",
    futebol: "Golzinho",
    musica: "Batuque",
    dino: "Dininho",
    hulk: "Hulkinho",
    capitao_america: "Capitãozinho",
    homem_ferro: "Latinha",
    bruxo: "Merlin",
    pantera_negra: "Panterinha",
    thor: "Trovenho",
    goku: "Gokuzinho",
    homem_ferro_pixel: "Retro-Tin",
    homem_aranha_pixel: "Retro-Teia",
    hulk_pixel: "Retro-Hulk",
  };
  return names[theme] || "Bichinho";
};

export function PickScreen({
  state,
  onKid,
  onParent,
  onFactoryReset,
  userEmail,
  onLogout,
  onTriggerLogin,
  onTriggerAdmin,
  onAddKid,
  onDeleteKid,
}: PickProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [kidToDelete, setKidToDelete] = useState<Kid | null>(null);
  
  // State for adding a new kid profile
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState<"pre" | "ano1">("pre");
  const [newTheme, setNewTheme] = useState("classico");

  const starsOf = (k: Kid) => getKidLifetimeStars(k.id, state);

  const handleOpenAddModal = () => {
    sfx.level();
    setNewName("");
    setNewGrade("pre");
    setNewTheme("classico");
    setShowAddModal(true);
  };

  const handleConfirmAdd = () => {
    if (!onAddKid) return;
    
    const cleanName = newName.trim();
    const finalName = cleanName || (newGrade === "pre" ? "Estrelinha" : "Foguete");
    
    const newKid: Kid = {
      id: "kid_" + Math.random().toString(36).substring(2, 9),
      name: finalName,
      grade: newGrade,
      age: newGrade === "pre" ? 4 : 6,
      theme: newTheme,
      avatar: THEME_EMOJIS[newTheme] || "🎩",
      petName: getDefaultPetName(newTheme),
      petEnergy: 80,
      petFood: 3,
    };

    onAddKid(newKid);
    sfx.fanfare();
    setShowAddModal(false);
  };

  const handleConfirmDelete = () => {
    if (kidToDelete && onDeleteKid) {
      onDeleteKid(kidToDelete.id);
      setKidToDelete(null);
    }
  };

  return (
    <div className="mk-pop text-center relative">
      {/* Mini Status & Admin Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-indigo-50/80 px-3 py-1.5 rounded-full border border-indigo-100/40">
        <div className="flex items-center gap-1.5 min-w-0">
          {userEmail ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs">☁️</span>
              <span className="text-[10px] md:text-[11px] font-black text-indigo-950 truncate max-w-[100px] sm:max-w-[140px]" title={userEmail}>
                {userEmail}
              </span>
              <button
                onClick={() => {
                  sfx.wrong();
                  onLogout?.();
                }}
                className="text-[9px] bg-slate-200 hover:bg-rose-100 hover:text-rose-700 font-extrabold text-slate-700 px-1.5 py-0.5 rounded transition-all cursor-pointer border-none outline-none"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🚶</span>
              <span className="text-[10px] md:text-[11px] font-black text-slate-500">
                Visitante
              </span>
              <button
                onClick={() => {
                  sfx.tick();
                  onTriggerLogin?.();
                }}
                className="text-[9px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-1.5 py-0.5 rounded transition-all cursor-pointer border-none outline-none shadow-sm"
              >
                Salvar Nuvem ☁️
              </button>
            </div>
          )}
        </div>

        {/* Admin God Mode Trigger */}
        <button
          onClick={() => {
            sfx.level();
            onTriggerAdmin?.();
          }}
          className="text-[9px] sm:text-[10px] bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer border-none outline-none shadow-sm animate-pulse"
          style={{ fontFamily: FONT }}
        >
          ⚡ Admin God
        </button>
      </div>

      <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: C.ink }}>
        Matemágica <span className="mk-bounce inline-block">🎩</span>
      </div>
      <div style={{ color: C.sub, fontWeight: 700, fontSize: 14, marginTop: -2 }}>
        matemática que vira brincadeira ✨
      </div>

      {/* Beautiful graphic landscape of characters */}
      <div className="relative h-44 my-4 -mx-4 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-emerald-50 shadow-inner border border-blue-100">
        <svg viewBox="0 0 60 60" style={{ position: "absolute", top: 12, right: 20, width: 50, height: 50 }}>
          <g className="mk-spin-slow">
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x="28" y="1" width="4" height="12" rx="2" fill="#FFC531" transform={`rotate(${i * 45} 30 30)`} />
            ))}
          </g>
          <circle cx="30" cy="30" r="13" fill="#FFD75E" stroke="#E8B420" strokeWidth="2" />
        </svg>

        {/* Hills background */}
        <svg viewBox="0 0 400 70" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 72 }}>
          <path d="M0 70 Q 100 6 210 42 T 400 26 L 400 70 Z" fill="#C6ECB0" />
          <path d="M0 70 Q 140 30 260 56 T 400 48 L 400 70 Z" fill="#9BD46A" />
        </svg>

        {/* Mascot buttons */}
        {/* pt-4: overflow-x-auto também recorta no eixo Y — sem esta folga, a cabeça
            do mascote some quando a animação de flutuar sobe (a "parede invisível") */}
        <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 32 }} className="overflow-x-auto px-4 pt-4 max-w-full">
          {state.kids.map((k, i) => {
            const totalStars = getKidLifetimeStars(k.id, state);
            const stageNum = getMascotStage(totalStars).stage;
            return (
              <button
                key={k.id}
                onClick={() => {
                  sfx.tick();
                  onKid(k.id);
                }}
                style={{ background: "none", border: "none", cursor: "pointer", animationDelay: i ? "1.3s" : "0s" }}
                className="mk-float focus:outline-none flex-shrink-0"
              >
                <Mascote theme={k.theme} stage={stageNum} size={76} kid={k} />
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ textAlign: "center", color: C.sub, fontWeight: 800, fontSize: 17, margin: "14px 0 12px" }}>
        Quem vai brincar hoje? 👦👧
      </p>

      {/* Profiles List */}
      <div className="flex flex-col gap-4">
        {state.kids.map((k) => (
          <div
            key={k.id}
            className="group relative select-none transition-all active:translate-y-0.5 hover:shadow-md"
            style={{
              background: C.card,
              borderRadius: 26,
              boxShadow: `0 6px 0 ${C.line}`,
              border: `2px solid ${C.line}`,
            }}
          >
            {/* Play Button Action Card */}
            <button
              onClick={() => {
                sfx.tick();
                onKid(k.id);
              }}
              className="w-full text-left bg-transparent border-none p-4 cursor-pointer outline-none flex items-center gap-4"
            >
              <span className="text-4xl filter drop-shadow">{k.avatar}</span>
              <div className="flex-1 min-w-0">
                <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 800, color: C.ink }} className="truncate pr-12">
                  {k.name}
                </div>
                <div style={{ color: C.sub, fontWeight: 700, fontSize: 12 }} className="mt-0.5">
                  {k.grade === "pre" ? "👦 Pré-escola • 4 anos" : "🚀 1º ano • 6 anos"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <StarChip n={starsOf(k)} />
                <span className="animate-pulse flex items-center gap-0.5 text-xs font-black text-emerald-600 uppercase tracking-wider" style={{ fontFamily: FONT }}>
                  Jogar <Play className="w-3 h-3 fill-emerald-600" />
                </span>
              </div>
            </button>

            {/* Delete profile option directly on selector card when logged in */}
            {userEmail && onDeleteKid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sfx.wrong();
                  setKidToDelete(k);
                }}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 rounded-full transition-colors cursor-pointer border-none outline-none"
                title="Deletar Perfil"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        ))}

        {/* Add Profile button directly on Selection screen when logged in */}
        {userEmail && onAddKid && (
          <button
            onClick={handleOpenAddModal}
            className="w-full py-4 text-center border-4 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/50 rounded-[26px] cursor-pointer transition-all flex items-center justify-center gap-2 font-black text-indigo-600 text-sm"
            style={{ fontFamily: FONT }}
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            Adicionar Perfil de Criança
          </button>
        )}
      </div>

      {/* Parent Area & Factory Reset Actions */}
      <div className="mt-8 text-center flex flex-col items-center gap-4">
        <button
          onClick={() => {
            sfx.tick();
            onParent();
          }}
          className="select-none transition-transform active:translate-y-1 active:scale-95 px-5 py-2.5 text-sm font-semibold shadow-sm focus:outline-none"
          style={{
            fontFamily: FONT,
            background: C.card,
            color: C.ink,
            border: `3px solid ${C.line}`,
            borderRadius: 22,
            boxShadow: `0 5px 0 ${C.line}`,
            cursor: "pointer",
          }}
        >
          🔒 Área dos Pais
        </button>

        {onFactoryReset && (
          <div className="w-full max-w-sm mt-3">
            {showResetConfirm ? (
              <div className="bg-rose-50 border-2 border-rose-200 p-4 rounded-2xl text-center animate-[bounce_0.5s_ease-out_1]">
                <div className="text-xs font-black text-rose-800 mb-1">
                  🚨 APAGAR CONTAS E RECOMEÇAR?
                </div>
                <p className="text-[11px] text-rose-700/90 mb-3 font-semibold leading-relaxed">
                  Isso apagará permanentemente todos os perfis, estrelas, figurinhas e históricos na nuvem e neste dispositivo para reiniciar o teste do zero. Não dá para desfazer.
                </p>
                <div className="flex justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sfx.wrong();
                      onFactoryReset();
                      setShowResetConfirm(false);
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Sim, Apagar Tudo 🔄
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.tick();
                      setShowResetConfirm(false);
                    }}
                    className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Não, Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  sfx.wrong();
                  setShowResetConfirm(true);
                }}
                className="text-xs text-rose-500 hover:text-rose-700 hover:underline font-bold transition-all cursor-pointer bg-transparent border-none mt-2 outline-none"
              >
                🔄 Reset Geral (Apagar Todas as Contas e Recomeçar)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Profile Confirmation Modal */}
      <AnimatePresence>
        {kidToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-sm w-full border-4 border-rose-300 p-6 text-center shadow-2xl relative"
            >
              <div className="text-4xl mb-2">🗑️</div>
              <h3 className="text-lg font-black text-rose-950" style={{ fontFamily: FONT }}>
                Apagar Perfil de {kidToDelete.name}?
              </h3>
              <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                Cuidado! Esta ação é irreversível
              </p>
              <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-6">
                Todos os dados de progresso, {starsOf(kidToDelete)} estrelas ganhas e o álbum de figurinhas de <strong>{kidToDelete.name}</strong> serão permanentemente excluídos.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all active:scale-95 border-none outline-none"
                  style={{ fontFamily: FONT }}
                >
                  Sim, Deletar 🗑️
                </button>
                <button
                  onClick={() => {
                    sfx.tick();
                    setKidToDelete(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:scale-95 border-none outline-none"
                  style={{ fontFamily: FONT }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inline Quick Add Profile Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white rounded-3xl max-w-md w-full border-4 border-indigo-400 p-6 text-left shadow-2xl relative"
            >
              <button
                onClick={() => {
                  sfx.tick();
                  setShowAddModal(false);
                }}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-all border-none outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl">
                  👦
                </div>
                <div>
                  <h3 className="text-lg font-black text-indigo-950" style={{ fontFamily: FONT }}>
                    Adicionar Novo Perfil
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Configure os jogos para mais um pequeno gênio
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1" style={{ fontFamily: FONT }}>
                    Nome do pequeno:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Sofia, Lucas..."
                      maxLength={14}
                      className="w-full text-sm font-bold px-3 py-2.5 pl-10 rounded-xl border-2 border-slate-200 outline-none transition-all focus:border-indigo-500"
                      style={{ fontFamily: FONT }}
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Grade Slider */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1" style={{ fontFamily: FONT }}>
                    Idade / Nível Escolar:
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tick();
                        setNewGrade("pre");
                      }}
                      className={`py-2 px-3 rounded-lg font-black text-xs transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-1.5 ${
                        newGrade === "pre"
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-500"
                      }`}
                      style={{ fontFamily: FONT }}
                    >
                      <span>👦</span>
                      <span>Pré (4-5 anos)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tick();
                        setNewGrade("ano1");
                      }}
                      className={`py-2 px-3 rounded-lg font-black text-xs transition-all cursor-pointer border-none outline-none flex items-center justify-center gap-1.5 ${
                        newGrade === "ano1"
                          ? "bg-white text-indigo-700 shadow-sm"
                          : "text-slate-500"
                      }`}
                      style={{ fontFamily: FONT }}
                    >
                      <span>🚀</span>
                      <span>1º Ano (6-7 anos)</span>
                    </button>
                  </div>
                </div>

                {/* Mascot Selected */}
                <div>
                  <label className="text-xs font-black text-slate-600 block mb-1" style={{ fontFamily: FONT }}>
                    Selecione o Mascote:
                  </label>
                  
                  {/* Miniature selected mascot review */}
                  <div className="mb-3 p-2 bg-gradient-to-r from-indigo-50/50 to-white border border-indigo-100 rounded-xl flex items-center gap-3">
                    <Mascote theme={newTheme} stage={5} size={64} />
                    <div>
                      <div className="text-xs font-black text-indigo-950" style={{ fontFamily: FONT }}>
                        {THEMES[newTheme]?.nome || "Mascote"}
                      </div>
                      <div className="text-[9px] font-bold text-indigo-500">
                        Acompanhante: {getDefaultPetName(newTheme)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {Object.entries(THEMES).map(([id, t]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          sfx.tick();
                          setNewTheme(id);
                        }}
                        className={`p-1.5 rounded-lg border-2 text-[9px] font-bold transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                          newTheme === id
                            ? "bg-indigo-50 border-indigo-500 text-indigo-950"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        <Mascote theme={id} stage={1} size={28} />
                        <span className="truncate w-full text-center">{t.nome}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2 justify-end">
                <button
                  onClick={handleConfirmAdd}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-sm transition-all active:translate-y-0.5 border-none outline-none"
                  style={{ fontFamily: FONT }}
                >
                  Confirmar Perfil 🚀
                </button>
                <button
                  onClick={() => {
                    sfx.tick();
                    setShowAddModal(false);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-all active:translate-y-0.5 border-none outline-none"
                  style={{ fontFamily: FONT }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
