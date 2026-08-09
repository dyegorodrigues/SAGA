import React, { useMemo, useState } from "react";
import { State, Kid, Track } from "../types";
import { computeUnlockStatus } from "../curriculum/motores/unlockEngine";
import { C, FONT, CoinChip, sfx, THEMES } from "./Mascot";
import { getKidLifetimeStars, getMascotStage } from "./MascotEvolution";

import { SenseiTab } from "./home/SenseiTab";
import { JourneyTab } from "./home/JourneyTab";
import { DojoTab } from "./home/DojoTab";
import { OficinaTab } from "./home/OficinaTab";
import { PerfilTab } from "./home/PerfilTab";
import { LevelPickerModal } from "./home/LevelPickerModal";
import { WardrobeModal } from "./home/WardrobeModal";

import { planAula, RescuePlanItem } from "../curriculum/motores/composer";
import { prescribeCausalJardim } from "../curriculum/motores/jardimCausalPrescription";
import { chooseSenseiEntry } from "../curriculum/motores/senseiOrchestrator";
import { prescribeSenseiDojo } from "../curriculum/motores/senseiDojoPrescription";
import type { SenseiDojoSessionSource } from "../curriculum/motores/senseiDojoPolicy";
import { isTrackUnlocked } from "../curriculum/motores/unlockEngine";
import { localDay } from "../utils/migrator";

interface KidHomeProps {
  state: State;
  kid: Kid;
  coins: number;
  streak: number;
  albumCount: number;
  /** iniciar a trilha num nível escolhido a dedo (seletor 🎯) */
  onTrackLvl: (t: Track, lvl: number, dojoSource?: SenseiDojoSessionSource) => void;
  onMixed: () => void;
  /** ▶️ AULA DO DIA 📚: a missão prescrita pelo Sensei */
  onAula: () => void;
  onRescue: (rescue: RescuePlanItem) => void;
  /** 🎒 MATRÍCULA (E3): o placement disfarçado da primeira visita */
  onMatricula: () => void;
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
  onTrackLvl,
  onMixed,
  onAula,
  onRescue,
  onMatricula,
  onAlbum,
  onBack,
  tracks,
  onUpdateKid,
  onSpendCoins,
}: KidHomeProps) {
  const prog = state.progress[kid.id] || {};
  const kidDojoTracks = (state.dojoTracks || {})[kid.id] || {};
  const unlockStatus = useMemo(() => computeUnlockStatus(prog), [prog]);
  const themeObj = THEMES[kid.theme] || THEMES.classico;

  // ▶️ AULA DO DIA 📚: o plano do dia pro card (barato — escolhe trilhas, não gera questão)
  const aulaPlan = useMemo(() => {
    const progOf = (tid: string) =>
      prog[tid] || { lvl: 1, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0 };
    return planAula(tracks, progOf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, prog]);

  // Jardim só substitui uma Oficina quando o DAG liga a dificuldade a uma base
  // perceptual e o próprio estado JD já provou fraqueza real. Sem essa evidência,
  // o Tutor continua na remediação conceitual normal.
  const causalJardim = useMemo(
    () => prescribeCausalJardim(aulaPlan, prog, kidDojoTracks),
    [aulaPlan, prog, kidDojoTracks],
  );

  // A criança toca UMA porta. Pré-requisito conceitual > Jardim causal provado >
  // misconception no alvo > Aula normal. Fluência prescrita continua em missão
  // separada, abaixo, para não transformar a Aula do Dia em mistureba.
  const senseiEntry = chooseSenseiEntry(aulaPlan, causalJardim);
  const startSenseiMission = () => {
    if (senseiEntry.kind === "rescue") onRescue(senseiEntry.rescue);
    else if (senseiEntry.kind === "garden") onTrackLvl(senseiEntry.prescription.track, senseiEntry.prescription.step);
    else onAula();
  };

  const dojoPrescription = useMemo(() => prescribeSenseiDojo(
    prog,
    kidDojoTracks,
    localDay(),
  ), [prog, kidDojoTracks]);

  const startSenseiDojoMission = () => {
    if (!dojoPrescription) return;
    onTrackLvl(dojoPrescription.track, dojoPrescription.step, "prescribed");
  };

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

  // Recomendação secundária de treino livre. A auditoria pós-P22 ainda vai
  // eliminar a heurística por estrelas para que ela não dispute autoridade com o Sensei.
  const rec = useMemo(() => {
    const accessibleTracks = tracks.filter(t =>
      isTrackUnlocked(t.id, t.graphId, unlockStatus)
    );

    // 1. Spaced repetition: if a track has pending review items, recommend it
    const needsReview = accessibleTracks.filter((t) => prog[t.id]?.bank?.length > 0);
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
    let bestTrack = accessibleTracks[0];
    let minStars = Infinity;
    for (const t of accessibleTracks) {
      const p = prog[t.id] || { stars: 0 };
      if ((p.stars || 0) < minStars) {
        minStars = p.stars || 0;
        bestTrack = t;
      }
    }

    return bestTrack ? {
      track: bestTrack,
      reason: "Treino livre sugerido para o seu momento atual. 🦊",
    } : null;
  }, [tracks, prog, unlockStatus]);

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
            senseiEntry={senseiEntry} dojoPrescription={dojoPrescription}
            onMatricula={onMatricula} onAula={startSenseiMission} onSenseiDojo={startSenseiDojoMission}
            onTrack={setPickerTrack} onMixed={onMixed} setActiveShellTab={(t: any) => setActiveShellTab(t)}
          />
        )}
        {activeShellTab === "jornada" && (
          <JourneyTab kid={kid} prog={prog} tracks={tracks} unlockStatus={unlockStatus} onTrack={setPickerTrack} />
        )}
        {activeShellTab === "dojo" && (
          <DojoTab
            prog={prog}
            dojoTracks={kidDojoTracks}
            onGardenTrack={(track, currentStep) => onTrackLvl(track, currentStep)}
            onMixed={onMixed}
            onOpenPicker={setPickerTrack}
          />
        )}
        {activeShellTab === "oficina" && (
          <OficinaTab aulaPlan={aulaPlan} onTrack={onRescue} />
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
