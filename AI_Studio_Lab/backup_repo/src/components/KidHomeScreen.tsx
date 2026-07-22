import React, { useMemo, useState } from "react";
import { State, Kid, Track } from "../types";
import { C, FONT, CoinChip, LevelDots, sfx, FRESH, TOTAL_STICKERS, THEMES, Mascote } from "./Mascot";
import { MascotEvolutionCard, getKidLifetimeStars, getMascotStage } from "./MascotEvolution";
import { SUBJECTS } from "../subjects";

interface KidHomeProps {
  state: State;
  kid: Kid;
  coins: number;
  streak: number;
  albumCount: number;
  onTrack: (t: Track) => void;
  /** iniciar a trilha num nível escolhido a dedo (seletor 🎯) */
  onTrackLvl: (t: Track, lvl: number) => void;
  onMixed: () => void;
  mixedDoneToday: boolean;
  onAlbum: () => void;
  onBack: () => void;
  tracks: Track[];
  onUpdateKid: (kid: Kid, coinsToSpend?: number) => void;
  onSpendCoins: (amount: number) => void;
}

interface WardrobeItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: "bg";
}

const WARDROBE_ITEMS: WardrobeItem[] = [
  // Cenários de Fundo
  { id: "none", name: "Fundo Padrão", emoji: "🏠", cost: 0, type: "bg" },
  { id: "parque", name: "Parque Verdejante", emoji: "🌳", cost: 6, type: "bg" },
  { id: "campo", name: "Campo de Futebol", emoji: "🏟️", cost: 12, type: "bg" },
  { id: "espaco", name: "Espaço Cósmico", emoji: "🌌", cost: 18, type: "bg" },
  { id: "castelo", name: "Castelo Encantado", emoji: "🏰", cost: 25, type: "bg" },
];

export function KidHomeScreen({
  state,
  kid,
  coins,
  streak,
  albumCount,
  onTrack,
  onTrackLvl,
  onMixed,
  mixedDoneToday,
  onAlbum,
  onBack,
  tracks,
  onUpdateKid,
  onSpendCoins,
}: KidHomeProps) {
  const prog = state.progress[kid.id] || {};
  const themeObj = THEMES[kid.theme] || THEMES.classico;

  // Seletor de nível 🎯 (pedido do Zeus: ver e escolher os exercícios de cada nível)
  const [pickerTrack, setPickerTrack] = useState<Track | null>(null);

  // Wardrobe states
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [tempOutfit] = useState("none");
  const [tempBg, setTempBg] = useState(kid.bgAccessory || "none");
  const [activeTab] = useState<"bg">("bg");

  // Local transaction cart states for wardrobe
  const [tempInventory, setTempInventory] = useState<string[]>(kid.inventory || []);
  const [tempCoins, setTempCoins] = useState(coins);
  const [coinsSpent, setCoinsSpent] = useState(0);

  // Compute mascot stage
  const totalStars = getKidLifetimeStars(kid.id, state);
  const stageNum = getMascotStage(totalStars).stage;

  // Adaptive recommendation engine based on child's exact progress history
  const getRecommendedTrack = (): { track: Track; reason: string } => {
    // 1. Spaced repetition: if a track has pending review items, recommend it
    for (const t of tracks) {
      const p = prog[t.id];
      if (p && p.bank && p.bank.length > 0) {
        return {
          track: t,
          reason: "Hora de revisar e fixar os segredos matemáticos com seu mascote! 🧠✨",
        };
      }
    }

    // 2. Adaptive reinforcement: if a track had errors or difficulty reduction, recommend practicing it
    for (const t of tracks) {
      const p = prog[t.id];
      if (p && (p.bad > 0 || p.lvl < 2)) {
        return {
          track: t,
          reason: "Ajustamos a velocidade e as dicas para treinar com muita calma e carinho! 💪",
        };
      }
    }

    // 3. Balanced learning: recommend the track with the lowest level / star count to keep progress uniform
    let bestTrack = tracks[0];
    let minStars = Infinity;
    for (const t of tracks) {
      const p = prog[t.id] || { stars: 0 };
      if ((p.stars || 0) < minStars) {
        minStars = p.stars || 0;
        bestTrack = t;
      }
    }

    return {
      track: bestTrack,
      reason: "Próximo portal secreto pronto para ser explorado por você! 🚀",
    };
  };

  const rec = getRecommendedTrack();

  // Amostra do que cada nível pergunta (gera 1 questão-exemplo por nível — memoizada
  // para os textos não trocarem a cada render enquanto o seletor está aberto)
  const pickerSamples = useMemo(() => {
    if (!pickerTrack) return [];
    return [1, 2, 3, 4, 5].map((lvl) => {
      try {
        return pickerTrack.gen(lvl).prompt;
      } catch {
        return "";
      }
    });
  }, [pickerTrack]);

  // Trilhas do editor pedagógico (não pertencem a nenhuma matéria registrada)
  const subjectIds = new Set(SUBJECTS.flatMap((s) => (s.tracks[kid.grade] || []).map((t) => t.id)));
  const customTracks = tracks.filter((t) => !subjectIds.has(t.id));

  const renderTrackCard = (t: Track) => {
    const p = prog[t.id] || FRESH();
    return (
      <button
        key={t.id}
        onClick={() => {
          sfx.tick();
          onTrack(t);
        }}
        className="relative select-none transition-all cursor-pointer active:translate-y-1 text-center flex flex-col items-center justify-between"
        style={{
          background: C.card,
          border: "none",
          borderRadius: 24,
          boxShadow: `0 6px 0 ${C.line}`,
          padding: "16px 12px",
          minHeight: 154,
        }}
      >
        {/* 🎯 abre o seletor de nível (span, não button — card já é button) */}
        <span
          role="button"
          aria-label={`Escolher nível de ${t.name}`}
          onClick={(e) => {
            e.stopPropagation();
            sfx.tick();
            setPickerTrack(t);
          }}
          className="absolute top-1.5 right-1.5 w-8 h-8 flex items-center justify-center text-base rounded-full bg-slate-50 border-2 border-slate-100 hover:bg-slate-100 transition-all"
        >
          🎯
        </span>
        <div
          className="flex items-center justify-center text-3xl filter drop-shadow-sm"
          style={{
            width: 54,
            height: 54,
            borderRadius: 18,
            background: t.color,
            boxShadow: `0 4px 0 ${t.dark}`,
          }}
        >
          {t.icon}
        </div>

        <div className="mt-3">
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: C.ink }}>
            {t.name}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <LevelDots lvl={p.lvl} conquered={p.maxLvl} dom={p.dom} color={t.color} />
          </div>
        </div>

        <div className="mt-2 text-xs font-bold text-amber-600 inline-flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-md">
          ⭐ {p.stars || 0} estrelas
        </div>
      </button>
    );
  };

  const handleBuyOrEquip = (item: WardrobeItem) => {
    const isUnlocked = item.cost === 0 || tempInventory.includes(item.id);

    if (isUnlocked) {
      sfx.tick();
      setTempBg(item.id);
    } else {
      if (tempCoins >= item.cost) {
        sfx.level();
        setTempCoins(tempCoins - item.cost);
        setCoinsSpent(coinsSpent + item.cost);
        setTempInventory([...tempInventory, item.id]);
        setTempBg(item.id);
      } else {
        sfx.wrong();
        alert("Você precisa de mais moedinhas para comprar este item! Complete missões! 🪙💪");
      }
    }
  };

  const handleSaveWardrobe = () => {
    sfx.level();
    const updatedKid = {
      ...kid,
      outfit: tempOutfit,
      bgAccessory: tempBg,
      inventory: tempInventory,
    };
    onUpdateKid(updatedKid, coinsSpent);
    setShowWardrobe(false);
  };

  return (
    <div className="mk-pop">
      <div className="mb-4 flex items-center justify-between gap-2.5">
        <button
          onClick={() => {
            sfx.tick();
            onBack();
          }}
          className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-md"
          style={{
            background: C.card,
            color: C.ink,
            borderColor: C.line,
            boxShadow: `0 4px 0 ${C.line}`,
          }}
        >
          ✕
        </button>

        <div className="flex-1 text-left px-1">
          <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.ink }}>
            Oi, {kid.name}! {kid.avatar}
          </div>
          <div className="text-xs text-slate-500 font-bold">
            Portal de Aventuras
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {streak >= 2 && (
            <span
              className="inline-flex items-center gap-1 font-bold animate-bounce"
              style={{
                fontFamily: FONT,
                background: "#FFE9E0",
                color: "#B5471D",
                border: "2px solid #FF9A62",
                borderRadius: 999,
                padding: "4px 10px",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              🔥 {streak} {streak === 1 ? "dia" : "dias"}
            </span>
          )}
          <CoinChip n={coins} />
        </div>
      </div>

      {/* Interactive Tamagotchi Mascot Evolution Card */}
      <div className="mb-4">
        <MascotEvolutionCard 
          kid={kid} 
          state={state} 
          onUpdateKid={onUpdateKid} 
          coins={coins} 
        />
      </div>

      {/* Mascot Scenery Customizer Button */}
      <div className="mb-4">
        <button
          onClick={() => {
            sfx.level();
            setTempBg(kid.bgAccessory || "none");
            setTempInventory(kid.inventory || []);
            setTempCoins(coins);
            setCoinsSpent(0);
            setShowWardrobe(true);
          }}
          className="w-full select-none transition-all active:translate-y-1 active:scale-[0.98] py-3.5 text-sm font-black text-amber-950 cursor-pointer flex items-center justify-center gap-2 border-b-4 border-amber-600 rounded-2xl animate-pulse"
          style={{
            fontFamily: FONT,
            background: "linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)",
            boxShadow: `0 2px 0 #CA8A04`,
          }}
        >
          <span>🎨 Mudar Cenário do Mascote 🌟</span>
        </button>
      </div>



      {/* Smart Recommended Quest: Jornada Mágica Adaptive Button */}
      <div className="mb-5 relative overflow-hidden card-block border-2 border-amber-300" style={{ boxShadow: "0 6px 0 #D4AC0D" }}>
        <button
          onClick={() => {
            sfx.level();
            onTrack(rec.track);
          }}
          className="w-full text-left p-4 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
          style={{
            background: "linear-gradient(135deg, #FFFDEB 0%, #FFF5C2 100%)",
          }}
        >
          <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[mkShine_2.8s_ease-in-out_infinite]" />
          
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 text-amber-900 bg-amber-200 border-2 border-amber-300 rounded-md inline-block">
              ✨ Recomendado para você
            </span>
            <span className="text-2xl animate-bounce">🎁</span>
          </div>

          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#784B00" }}>
            Jornada Mágica: {rec.track.icon} {rec.track.name}
          </div>

          <div className="text-xs text-amber-900/80 font-bold mt-1 leading-snug">
            {rec.reason}
          </div>

          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-amber-600 px-4 py-1.5 rounded-md shadow-sm hover:scale-105 active:scale-95 transition-transform">
            <span>Começar Aventura</span>
            <span>▶</span>
          </div>
        </button>
      </div>

      {/* Desafio Misto 👑 — o "chefão" diário: 1×/dia, 10 questões de todas as trilhas, moedinhas em dobro */}
      <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: mixedDoneToday ? "#CBD5E1" : "#7C3AED", boxShadow: mixedDoneToday ? "0 6px 0 #CBD5E1" : "0 6px 0 #5B21B6" }}>
        <button
          onClick={() => {
            if (mixedDoneToday) {
              sfx.tick();
              return;
            }
            sfx.level();
            onMixed();
          }}
          className={`w-full text-left p-4 select-none relative transition-all ${mixedDoneToday ? "cursor-default" : "cursor-pointer active:translate-y-0.5"}`}
          style={{
            background: mixedDoneToday
              ? "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)"
              : "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)",
          }}
        >
          {!mixedDoneToday && (
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_3.2s_ease-in-out_infinite]" />
          )}
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block border-2 ${mixedDoneToday ? "text-slate-500 bg-slate-100 border-slate-200" : "text-purple-900 bg-purple-200 border-purple-300"}`}>
              {mixedDoneToday ? "✅ Desafio de hoje completo!" : "👑 Desafio especial do dia"}
            </span>
            <span className={`text-2xl ${mixedDoneToday ? "" : "animate-bounce"}`}>🏆</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: mixedDoneToday ? "#64748B" : "#4C1D95" }}>
            Desafio Misto 👑
          </div>
          <div className={`text-xs font-bold mt-1 leading-snug ${mixedDoneToday ? "text-slate-400" : "text-purple-900/80"}`}>
            {mixedDoneToday
              ? "Você venceu o chefão de hoje! Volte amanhã para um novo desafio. ✨"
              : "10 perguntas de TODAS as suas trilhas — e as moedinhas valem EM DOBRO! 🪙🪙"}
          </div>
          {!mixedDoneToday && (
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-purple-600 px-4 py-1.5 rounded-md shadow-sm hover:scale-105 active:scale-95 transition-transform">
              <span>Enfrentar o Desafio</span>
              <span>👑</span>
            </div>
          )}
        </button>
      </div>

      {/* As aventuras, organizadas por matéria (SUBJECTS = cartuchos do console) */}
      {SUBJECTS.map((subject) => {
        const subjectTracks = subject.tracks[kid.grade] || [];
        if (!subjectTracks.length) return null;
        return (
          <div key={subject.id} className="mb-6">
            <div className="flex items-center gap-2 mb-3 pl-1">
              <span className="text-xl">{subject.icon}</span>
              <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
                {subject.nome}
              </span>
              {subject.novo && (
                <span className="text-[10px] font-black text-white bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                  Novo! ✨
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {subjectTracks.map((t) => renderTrackCard(t))}
            </div>
          </div>
        );
      })}

      {/* Trilhas personalizadas criadas no editor pedagógico */}
      {customTracks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 pl-1">
            <span className="text-xl">🧪</span>
            <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
              Trilhas Especiais
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3.5">
            {customTracks.map((t) => renderTrackCard(t))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          sfx.tick();
          onAlbum();
        }}
        className="mt-5 w-full relative overflow-hidden select-none transition-all active:translate-y-1 active:scale-[0.98] py-4 text-lg font-bold text-white cursor-pointer"
        style={{
          fontFamily: FONT,
          background: C.pink,
          borderRadius: 8,
          boxShadow: `0 6px 0 ${C.pinkDark}`,
          border: "none",
        }}
      >
        <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[mkShine_3.4s_ease-in-out_infinite]" />
        🎁 Meu Álbum de Figurinhos ({albumCount}/{TOTAL_STICKERS})
      </button>

      {/* Seletor de nível 🎯 — ver o que cada nível pergunta e começar por ele */}
      {pickerTrack && (() => {
        const p = prog[pickerTrack.id] || FRESH();
        const conquered = p.maxLvl || 1;
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPickerTrack(null)}>
            <div
              className="bg-white card-block border-4 p-5 max-w-md w-full shadow-2xl relative mk-pop select-none flex flex-col max-h-[90vh]"
              style={{ borderColor: pickerTrack.color }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  sfx.tick();
                  setPickerTrack(null);
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-md border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
              >
                ✕
              </button>
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">{pickerTrack.icon}</div>
                <h3 className="text-lg font-black" style={{ fontFamily: FONT, color: C.ink }}>
                  {pickerTrack.name}
                </h3>
                <p className="text-xs text-slate-500 font-bold">Escolha o nível para treinar 🎯</p>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const won = lvl <= conquered;
                  const atual = lvl === p.lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => {
                        sfx.level();
                        setPickerTrack(null);
                        onTrackLvl(pickerTrack, lvl);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer active:translate-y-0.5 hover:bg-slate-50"
                      style={{ borderColor: atual ? pickerTrack.color : "#E2E8F0", background: atual ? `${pickerTrack.color}14` : "#fff" }}
                    >
                      <span
                        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-black text-base border-2"
                        style={{
                          fontFamily: FONT,
                          background: won ? pickerTrack.color : "#F1F5F9",
                          borderColor: won ? pickerTrack.dark : "#E2E8F0",
                          color: won ? "#fff" : "#94A3B8",
                        }}
                      >
                        {p.dom && lvl === 5 ? "👑" : lvl}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-black" style={{ fontFamily: FONT, color: C.ink }}>
                          Nível {lvl}
                          {pickerTrack.lvlSkills?.[lvl - 1] && (
                            <span className="font-bold text-slate-600"> · {pickerTrack.lvlSkills[lvl - 1]}</span>
                          )}
                          {atual && <span className="ml-1.5 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md text-white" style={{ background: pickerTrack.color }}>atual</span>}
                          {p.dom && lvl === 5 && <span className="ml-1.5 text-[10px]">👑</span>}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-bold truncate">{pickerSamples[lvl - 1]}</span>
                      </span>
                      <span className="text-slate-300 font-black">▶</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 font-bold text-center mt-3">
                As bolinhas coloridas são níveis já conquistados — elas nunca se apagam. 💜
              </p>
            </div>
          </div>
        );
      })()}

      {/* Wardrobe Modal Dialog Container */}
      {showWardrobe && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white card-block border-4 border-amber-300 p-6 max-w-md w-full shadow-2xl relative mk-pop select-none flex flex-col max-h-[90vh]">
            <button
              onClick={() => {
                sfx.tick();
                setShowWardrobe(false);
              }}
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-md border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Wardrobe Title */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-black text-amber-950" style={{ fontFamily: FONT }}>
                Cenário Mágico 🌌
              </h3>
              <p className="text-xs text-slate-500 font-bold">
                Mude o cenário de fundo do seu mascote com suas estrelas!
              </p>
            </div>

            {/* Live Interactive Preview Center Frame */}
            {/* Preview do cenário: sem scale — o mascote aparece INTEIRO, nunca "espiando pela janela" */}
            <div className="relative w-40 h-40 rounded-md mx-auto bg-slate-50 border-4 border-slate-100 flex items-center justify-center shadow-inner mb-4">
              <Mascote theme={kid.theme} size={140} outfit="none" bgAccessory={tempBg} stage={stageNum} kid={kid} />
            </div>

            {/* Star count */}
            <div className="flex items-center justify-between gap-2 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-black text-slate-600 uppercase" style={{ fontFamily: FONT }}>Suas Moedinhas:</span>
              <CoinChip n={tempCoins} />
            </div>

            {/* Tab items list (Sceneries only) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {WARDROBE_ITEMS.map((item) => {
                const isUnlocked = item.cost === 0 || tempInventory.includes(item.id);
                const isSelected = tempBg === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? "bg-amber-50/70 border-amber-400 shadow-sm"
                        : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-2xl w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                        {item.emoji}
                      </span>
                      <div>
                        <div className="text-xs font-black text-slate-800" style={{ fontFamily: FONT }}>
                           {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {item.cost === 0 ? "Grátis / Padrão" : `Custa ${item.cost} moedinhas`}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isSelected ? (
                        <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 border-2 border-emerald-300/60 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                          Equipado
                        </span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleBuyOrEquip(item)}
                          className="text-[11px] font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 px-4 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer"
                        >
                          Usar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyOrEquip(item)}
                          disabled={tempCoins < item.cost}
                          className={`text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider cursor-pointer transition-all ${
                            tempCoins >= item.cost
                              ? "text-amber-900 bg-amber-100 hover:bg-amber-200 border-2 border-amber-300"
                              : "text-slate-400 bg-slate-100 border-2 border-slate-200 cursor-not-allowed"
                          }`}
                        >
                          Comprar 🪙{item.cost}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save selections */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={handleSaveWardrobe}
                className="w-full bg-emerald-500 text-white font-black py-3.5 px-5 rounded-2xl shadow-md border-b-4 border-emerald-700 active:translate-y-0.5 active:border-b-2 transition-all text-sm cursor-pointer"
                style={{ fontFamily: FONT }}
              >
                Confirmar Cenário! 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
