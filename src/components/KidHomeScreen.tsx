import React, { useMemo, useState } from "react";
import { State, Kid, Track } from "../types";
import { computeUnlockStatus } from "../curriculum/motores/unlockEngine";
import { C, FONT, CoinChip, LevelDots, sfx, FRESH, TOTAL_STICKERS, THEMES, Mascote } from "./Mascot";
import { MascotEvolutionCard, getKidLifetimeStars, getMascotStage } from "./MascotEvolution";
import { LearningPath } from "./LearningPath";

import { SenseiTab } from "./home/SenseiTab";
import { JourneyTab } from "./home/JourneyTab";
import { DojoTab } from "./home/DojoTab";
import { OficinaTab } from "./home/OficinaTab";
import { PerfilTab } from "./home/PerfilTab";
import { LevelPickerModal } from "./home/LevelPickerModal";
import { WardrobeModal } from "./home/WardrobeModal";

import { SUBJECTS } from "../subjects";
import { planAula } from "../curriculum/motores/composer";

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
  onDojo: () => void;
  /** ▶️ MINHA AULA 📚 (E2): a missão composta pelo Professor Mágico */
  onAula: () => void;
  /** 🎒 MATRÍCULA (E3): o placement disfarçado da primeira visita */
  onMatricula: () => void;
  mixedDoneToday: boolean;
  onAlbum: () => void;
  onBack: () => void;
  tracks: Track[];
  onUpdateKid: (kid: Kid, coinsToSpend?: number) => void;
  onSpendCoins: (amount: number) => void;
}

export function KidHomeScreen({
  state,
  kid,
  coins,
  streak,
  albumCount,
  onTrack,
  onTrackLvl,
  onMixed,
  onDojo,
  onAula,
  onMatricula,
  mixedDoneToday,
  onAlbum,
  onBack,
  tracks,
  onUpdateKid,
  onSpendCoins,
}: KidHomeProps) {
  const prog = state.progress[kid.id] || {};
  const unlockStatus = computeUnlockStatus(prog);
  const themeObj = THEMES[kid.theme] || THEMES.classico;

  // ▶️ MINHA AULA 📚: o plano do dia pro card (barato — escolhe trilhas, não gera questão)
  const aulaPlan = useMemo(() => {
    const progOf = (tid: string) =>
      prog[tid] || { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    return planAula(tracks, progOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, prog]);

  // Seletor de nível 🎯 (pedido do Zeus: ver e escolher os exercícios de cada nível)
  const [activeShellTab, setActiveShellTab] = useState<"sensei" | "jornada" | "dojo" | "oficina" | "perfil">(() => (window.localStorage.getItem("mk-active-tab") || "sensei") as any);
  React.useEffect(() => { window.localStorage.setItem("mk-active-tab", activeShellTab); }, [activeShellTab]);
  const [pickerTrack, setPickerTrack] = useState<Track | null>(null);

  
  
  // Wardrobe states
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [tempBg, setTempBg] = useState(kid.bgAccessory || "none");

  // Local transaction cart states for wardrobe
  const [tempInventory, setTempInventory] = useState<string[]>(kid.inventory || []);
  const [tempCoins, setTempCoins] = useState(coins);
  const [coinsSpent, setCoinsSpent] = useState(0);

  // Compute mascot stage
  const totalStars = getKidLifetimeStars(kid.id, state);
  const stageNum = getMascotStage(totalStars).stage;

  // Adaptive recommendation engine based on child's exact progress history
  const rec = useMemo(() => {
    // 1. Spaced repetition: if a track has pending review items, recommend it
    const needsReview = tracks.filter((t) => prog[t.id] && prog[t.id].bank && prog[t.id].bank.length > 0);
    if (needsReview.length > 0) {
      // Pick one randomly based on the day to avoid being stuck forever if the kid hates it
      const daySeed = Math.floor(Date.now() / 86400000);
      const track = needsReview[daySeed % needsReview.length];
      return {
        track,
        reason: "Hora de revisar e fixar os segredos matemáticos com seu mascote! 🧠✨",
      };
    }

    // 2. Balanced learning: recommend the track with the lowest star count to keep progress uniform
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
      reason: "O Sensei separou este exercício para você treinar hoje! 🦊",
    };
  }, [tracks, prog]);

  // Amostra do que cada nível pergunta (gera 1 questão-exemplo por nível — memoizada
  // para os textos não trocarem a cada render enquanto o seletor está aberto)
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

  return (
    <div className="mk-pop h-screen max-h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* HEADER GLOBALS (Coin & Name) */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between gap-2.5 bg-white border-b-2 border-slate-100 shrink-0">
        <div className="flex-1 text-left px-1">
          <button onClick={() => { sfx.tick(); setActiveShellTab('perfil'); }} className="active:scale-95 transition-transform text-left">
            <div style={{ fontFamily: FONT, fontSize: 20, fontWeight: 700, color: C.ink }}>
              Oi, {kid.name}! {kid.avatar}
            </div>
            <div className="text-xs text-slate-500 font-bold underline decoration-slate-300 underline-offset-2">
              Ver Meu Perfil 🌟
            </div>
          </button>
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

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 scrollbar-hide">
        
        
        {activeShellTab === "sensei" && (
          <SenseiTab 
            kid={kid} prog={prog} aulaPlan={aulaPlan} rec={rec} 
            onMatricula={onMatricula} onAula={onAula} onTrack={onTrack} onMixed={onMixed} setActiveShellTab={(t: any) => setActiveShellTab(t)} 
          />
        )}
        {activeShellTab === "jornada" && (
          <JourneyTab kid={kid} prog={prog} onTrack={onTrack} />
        )}
        {activeShellTab === "dojo" && (
          <DojoTab prog={prog} unlockStatus={unlockStatus} mixedDoneToday={mixedDoneToday} onMixed={onMixed} renderTrackCard={renderTrackCard} onTrack={onTrack} onOpenPicker={setPickerTrack} />
        )}
        {activeShellTab === "oficina" && (
          <OficinaTab aulaPlan={aulaPlan} onTrack={onTrack} />
        )}
        {activeShellTab === "perfil" && (
          <PerfilTab 
            kid={kid} state={state} coins={coins} albumCount={albumCount} 
            onUpdateKid={onUpdateKid} onAlbum={onAlbum} onBack={onBack}
            setShowWardrobe={setShowWardrobe} setTempBg={setTempBg} setTempInventory={setTempInventory}
            setTempCoins={setTempCoins} setCoinsSpent={setCoinsSpent}
          />
        )}
      </div>
      <div className="bg-white border-t-2 border-slate-100 flex p-2 pb-5 shrink-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">

        {[
          { id: "sensei", label: "Tutor", icon: "🦊", color: "text-blue-600", activeBg: "bg-blue-50" },
          { id: "jornada", label: "Jornada", icon: "🗺️", color: "text-indigo-600", activeBg: "bg-indigo-50" },
          { id: "dojo", label: "Dojo", icon: "🥋", color: "text-purple-600", activeBg: "bg-purple-50" },
          { id: "oficina", label: "Oficina", icon: "🔧", color: "text-emerald-600", activeBg: "bg-emerald-50" },
        ].map(tab => {
          const isActive = activeShellTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { sfx.tick(); setActiveShellTab(tab.id as any); }}
              className={`flex-1 flex flex-col items-center justify-center py-2 transition-all rounded-xl ${isActive ? tab.activeBg : "opacity-60 grayscale"}`}
            >
              <span className={`text-2xl mb-1 ${isActive ? "animate-bounce" : ""}`}>{tab.icon}</span>
              <span className={`text-[10px] font-black uppercase ${isActive ? tab.color : "text-slate-500"}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Trazemos o Picker modal e Wardrobe modal */}
      {pickerTrack && (
        <LevelPickerModal
          pickerTrack={pickerTrack}
          prog={prog}
          onClose={() => setPickerTrack(null)}
          onTrackLvl={onTrackLvl}
          onTrack={onTrack}
        />
      )}

      {showWardrobe && (
        <WardrobeModal
          kid={kid}
          stageNum={stageNum}
          onClose={() => setShowWardrobe(false)}
          onUpdateKid={onUpdateKid}
          tempBg={tempBg}
          setTempBg={setTempBg}
          tempInventory={tempInventory}
          setTempInventory={setTempInventory}
          tempCoins={tempCoins}
          setTempCoins={setTempCoins}
          coinsSpent={coinsSpent}
          setCoinsSpent={setCoinsSpent}
        />
      )}
    </div>
  );
}
