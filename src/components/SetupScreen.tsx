import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Check, Sparkles, Smile, ArrowRight, User } from "lucide-react";
import { Kid } from "../types";
import { THEMES, THEME_EMOJIS, C, FONT, Mascote, sfx } from "./Mascot";

interface SetupProps {
  initial: Kid[];
  onDone: (kids: Kid[]) => void;
  onLogout?: () => void;
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
    trex: "T-Rex God",
  };
  return names[theme] || "Bichinho";
};

const createFreshKid = (grade: "pre" | "ano1"): Kid => {
  const id = "kid_" + Math.random().toString(36).substring(2, 9);
  const theme = "classico";
  return {
    id,
    name: "",
    grade,
    age: grade === "pre" ? 4 : 6,
    theme,
    avatar: THEME_EMOJIS[theme] || "🥋",
    petName: getDefaultPetName(theme),
    petEnergy: 80,
    petFood: 3,
  };
};

export function SetupScreen({ initial, onDone, onLogout }: SetupProps) {
  const [kids, setKids] = useState<Kid[]>(() => {
    // If we have initial kids in the state, use them; otherwise, start completely empty
    return initial.length > 0 ? initial.map((k) => ({ ...k })) : [];
  });

  const [activeTab, setActiveTab] = useState<number>(0);

  const addKid = () => {
    sfx.level();
    const newKid = createFreshKid("pre");
    setKids((prev) => [...prev, newKid]);
    setActiveTab(kids.length); // switch tab to the newly created kid
  };

  const removeKid = (indexToRemove: number) => {
    sfx.wrong();
    setKids((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setActiveTab((prev) => Math.max(0, prev - 1));
  };

  const updateKid = (index: number, patch: Partial<Kid>) => {
    setKids((prev) =>
      prev.map((k, idx) => {
        if (idx === index) {
          const merged = { ...k, ...patch };
          if (patch.theme) {
            merged.petName = getDefaultPetName(patch.theme);
            merged.avatar = THEME_EMOJIS[patch.theme] || "🥋";
          }
          return merged;
        }
        return k;
      })
    );
  };

  const handleStart = () => {
    // Validation: Filter out completely empty named kids, or auto-name them nicely
    const validatedKids = kids.map((k, idx) => ({
      ...k,
      name: k.name.trim() || `Criança ${idx + 1}`,
    }));

    if (validatedKids.length === 0) {
      sfx.wrong();
      return;
    }

    sfx.fanfare();
    onDone(validatedKids);
  };

  return (
    <div className="mk-pop text-center max-w-lg mx-auto bg-white/80 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
      {/* Premium Header */}
      <div className="mb-8 relative z-10">
        <span className="text-5xl inline-block mb-3 animate-[mkSway_3s_ease-in-out_infinite] transform-origin-bottom">
          🥋
        </span>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight" style={{ fontFamily: FONT }}>
          Monte seus Perfis ✨
        </h2>
        <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest leading-relaxed">
          Cada criança ganha sua própria jornada e mascote salvos de forma independente
        </p>
      </div>

      {kids.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)] flex flex-col items-center justify-center gap-5 my-6 relative overflow-hidden"
        >
          {/* Subtle decorative glows */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-indigo-50 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-50 rounded-full blur-xl pointer-events-none" />

          <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-4xl text-indigo-500 shadow-inner relative z-10 animate-bounce">
            🧙‍♂️
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: FONT }}>
              Nenhum perfil criado ainda
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed font-semibold">
              Crie o perfil das crianças para começarem a aprender matemática brincando com mascotes incríveis!
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[280px] relative z-10">
            <button
              onClick={addKid}
              className="w-full relative overflow-hidden select-none transition-all active:translate-y-1 active:scale-[0.98] py-3.5 px-6 text-white font-black cursor-pointer text-sm rounded-2xl border-none outline-none shadow-md hover:brightness-105 flex items-center justify-center gap-2"
              style={{
                fontFamily: FONT,
                background: "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)",
                boxShadow: "0 4px 0 #1e1b4b",
              }}
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              Criar Primeiro Perfil 👦
            </button>

            {onLogout && (
              <button
                onClick={() => {
                  sfx.tick();
                  onLogout();
                }}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 font-extrabold text-xs py-2.5 px-4 rounded-xl border border-slate-200/60 transition-all cursor-pointer outline-none"
                style={{ fontFamily: FONT }}
              >
                🚪 Sair e Voltar para o Login
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Active Profiles Area */
        <div className="flex flex-col gap-4 text-left my-6">
          {/* Quick tab switcher for profiles */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {kids.map((k, idx) => (
              <button
                key={k.id}
                onClick={() => {
                  sfx.tick();
                  setActiveTab(idx);
                }}
                className={`px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all whitespace-nowrap border-2 ${
                  activeTab === idx
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm scale-105"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
                style={{ fontFamily: FONT }}
              >
                👤 {k.name.trim() || `Perfil ${idx + 1}`}
              </button>
            ))}
            <button
              onClick={addKid}
              className="px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs cursor-pointer transition-all border-2 border-dashed border-emerald-300 flex items-center gap-1"
              style={{ fontFamily: FONT }}
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" /> Novo
            </button>
          </div>

          <AnimatePresence mode="wait">
            {kids.map((k, i) => {
              if (activeTab !== i) return null;
              return (
                <motion.div
                  key={k.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white rounded-3xl border-4 border-indigo-100 p-6 shadow-lg relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 flex gap-2">
                    <button
                      onClick={() => removeKid(i)}
                      className="p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 rounded-full transition-all cursor-pointer border-none outline-none"
                      title="Apagar Perfil"
                    >
                      <Trash2 className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Perfil Header */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                      {k.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800" style={{ fontFamily: FONT }}>
                        Configurar Perfil {i + 1}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                        Personalize as aventuras de {k.name || "seu pequeno"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Name input */}
                    <div>
                      <label className="text-xs font-black text-slate-600 block mb-1.5" style={{ fontFamily: FONT }}>
                        Nome da Criança:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={k.name}
                          onChange={(e) => updateKid(i, { name: e.target.value })}
                          placeholder="Ex: Pedro, Maria, Bia..."
                          maxLength={14}
                          className="w-full text-base font-bold px-4 py-3 pl-11 rounded-xl outline-none border-2 border-slate-200 bg-slate-50 text-slate-800 transition-all focus:border-indigo-500 focus:bg-white"
                          style={{ fontFamily: FONT }}
                        />
                        <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                      </div>
                    </div>

                    {/* Grade sliding selector */}
                    <div>
                      <label className="text-xs font-black text-slate-600 block mb-1.5" style={{ fontFamily: FONT }}>
                        Idade / Nível de Ensino:
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border-2 border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            sfx.tick();
                            updateKid(i, { grade: "pre", age: 4 });
                          }}
                          className={`py-3 px-4 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none flex flex-col items-center justify-center gap-1 ${
                            k.grade === "pre"
                              ? "bg-white text-indigo-700 shadow-md scale-[1.02]"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                          style={{ fontFamily: FONT }}
                        >
                          <span className="text-lg">👦</span>
                          <span>Pré-escola (4-5 anos)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            sfx.tick();
                            updateKid(i, { grade: "ano1", age: 6 });
                          }}
                          className={`py-3 px-4 rounded-xl font-black text-xs transition-all cursor-pointer border-none outline-none flex flex-col items-center justify-center gap-1 ${
                            k.grade === "ano1"
                              ? "bg-white text-indigo-700 shadow-md scale-[1.02]"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                          style={{ fontFamily: FONT }}
                        >
                          <span className="text-lg">🚀</span>
                          <span>1º Ano EF (6-7 anos)</span>
                        </button>
                      </div>
                    </div>

                    {/* Mascot Theme grid */}
                    <div>
                      <label className="text-xs font-black text-slate-600 block mb-1.5" style={{ fontFamily: FONT }}>
                        Selecione o Mascote Favorito:
                      </label>
                      
                      {/* Active Mascot Display Panel */}
                      <div className={`mb-4 border-2 border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative overflow-hidden ${k.theme !== 'trex' ? 'bg-gradient-to-b from-indigo-50 to-white' : ''}`}>
                        {k.theme === 'trex' && (
                          <div className="absolute inset-0 z-0 pointer-events-none" style={{
                            backgroundImage: "url('/mascotes/trex/dojo_pixel_background.webp')",
                            backgroundSize: "cover",
                            backgroundPosition: "center bottom",
                            imageRendering: "pixelated"
                          }} />
                        )}
                        <div className="relative z-10 flex flex-col items-center">
                          <Mascote theme={k.theme} stage={5} size={110} className="mb-2" transparentBg={true} />
                          <span className="text-sm font-black text-indigo-950" style={{ fontFamily: FONT }}>
                            {THEMES[k.theme]?.nome || "Mascote"}
                          </span>
                          <span className="text-[10px] font-bold text-indigo-500 mt-0.5 px-2 py-0.5 bg-indigo-50 rounded-full">
                            Acompanhante: {getDefaultPetName(k.theme)} 🐾
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 max-h-48 overflow-y-auto pr-1">
                        {Object.entries(THEMES).map(([id, t]) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => {
                              sfx.tick();
                              updateKid(i, { theme: id });
                            }}
                            className={`p-2 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-1 cursor-pointer border-2 ${
                              k.theme === id
                                ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-black shadow-inner"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <Mascote theme={id} stage={1} size={36} />
                            <span className="text-[10px] font-black tracking-tight text-center truncate w-full">
                              {t.nome}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      {kids.length > 0 && (
        <button
          onClick={handleStart}
          className="w-full relative overflow-hidden select-none transition-all active:translate-y-1 active:scale-[0.98] py-4 text-xl text-white font-black cursor-pointer rounded-2xl border-none shadow-md mt-6 flex items-center justify-center gap-2"
          style={{
            fontFamily: FONT,
            background: C.grape,
            boxShadow: `0 6px 0 ${C.grapeDark}`,
          }}
        >
          <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[mkShine_3.4s_ease-in-out_infinite]" />
          Começar Aventura! <ArrowRight className="w-5 h-5 stroke-[3]" />
        </button>
      )}
    </div>
  );
}
