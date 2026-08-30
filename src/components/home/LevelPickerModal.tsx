import React, { useMemo } from "react";
import { Track, Progress } from "../../types";
import {
  maxEligibleSenseiDojoStepById,
  SENSEI_DOJO_LEVEL_POLICIES,
  type SenseiDojoTempleId,
} from "../../curriculum/motores/senseiDojoPolicy";
import { sfx, FONT, C, FRESH } from "../Mascot";
import { NIVEIS_POR_COMPETENCIA } from "../../curriculum/schema";

interface LevelPickerModalProps {
  pickerTrack: Track;
  prog: Record<string, Progress>;
  onClose: () => void;
  onTrackLvl: (t: Track, lvl: number) => void;
  onTrack?: (t: Track) => void;
}

const dojoTempleId = (id: string): SenseiDojoTempleId | undefined =>
  id in SENSEI_DOJO_LEVEL_POLICIES ? id as SenseiDojoTempleId : undefined;

export function LevelPickerModal({ pickerTrack, prog, onClose, onTrackLvl, onTrack }: LevelPickerModalProps) {
  // A escada vem do CURRÍCULO, não do array de rótulos. Derivá-la dos rótulos
  // fazia a tela oferecer 4 de 5 degraus em todas as competências, escondendo
  // justamente o quinto — onde a coroa é decidida.
  const levels = Array.from({ length: NIVEIS_POR_COMPETENCIA }, (_, i) => i + 1);
  const templeId = dojoTempleId(pickerTrack.id);
  const dojoCeiling = templeId ? maxEligibleSenseiDojoStepById(templeId, prog) : undefined;

  // Amostra somente de conteúdo que já é pedagogicamente elegível. Um nível
  // futuro pode aparecer como mapa do caminho, mas não precisa revelar exercício.
  const pickerSamples = useMemo(() => {
    return levels.map((lvl) => {
      if (dojoCeiling !== undefined && lvl > dojoCeiling) return "";
      try {
        const q = pickerTrack.gen(lvl);
        return q.expr || q.prompt || q.big || "";
      } catch {
        return "";
      }
    });
  }, [pickerTrack, levels, dojoCeiling]);

  const dojoAutoBlocked = dojoCeiling !== undefined && dojoCeiling < 1;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white card-block border-4 p-6 max-w-sm w-full shadow-2xl relative mk-pop select-none flex flex-col max-h-[90vh]" style={{ borderColor: pickerTrack.color }}>
        <button
          onClick={() => {
            sfx.tick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-md border-2 border-slate-200 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer"
        >
          ✕
        </button>
        <div className="text-center mb-5 mt-2">
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-3 shadow-sm border-b-4"
            style={{ background: pickerTrack.color, color: "#fff", borderColor: pickerTrack.dark }}
          >
            {pickerTrack.icon}
          </div>
          <h3 className="text-xl font-black text-slate-800" style={{ fontFamily: FONT }}>
            {pickerTrack.name}
          </h3>
          <p className="text-xs text-slate-500 font-bold mt-1">
            {templeId
              ? "Treine livremente qualquer faixa que o Sensei já tornou segura. 🥋"
              : "Escolha o nível de dificuldade para jogar agora! 🎯"}
          </p>
          {templeId && dojoCeiling === 0 && (
            <p className="mt-2 text-[11px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              Primeiro vamos construir essa ideia com o Sensei. O treino de velocidade abre depois. 🌱
            </p>
          )}
        </div>

        {onTrack && (
          <button
            disabled={dojoAutoBlocked}
            onClick={() => {
              if (dojoAutoBlocked) return;
              sfx.level();
              onClose();
              onTrack(pickerTrack);
            }}
            className={`w-full mb-3 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-black transition-all shadow-sm ${dojoAutoBlocked ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed" : "border-indigo-200 bg-indigo-50 text-indigo-700 active:translate-y-0.5"}`}
            style={{ fontFamily: FONT }}
          >
            <span className="text-xl">🧠</span>
            {dojoAutoBlocked ? "Treino automático ainda bloqueado" : "Treino Inteligente (Automático)"}
          </button>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {levels.map((lvl) => {
            const p = prog[pickerTrack.id] || FRESH();
            const dojoLocked = dojoCeiling !== undefined && lvl > dojoCeiling;
            const won = dojoCeiling !== undefined ? lvl <= dojoCeiling : lvl <= (p.maxLvl || p.lvl || 1);
            const atual = dojoCeiling === undefined && lvl === p.lvl;
            return (
              <button
                key={lvl}
                disabled={dojoLocked}
                onClick={() => {
                  if (dojoLocked) return;
                  sfx.level();
                  onClose();
                  onTrackLvl(pickerTrack, lvl);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border-2 text-left transition-all ${dojoLocked ? "cursor-not-allowed opacity-55 bg-slate-50" : "cursor-pointer active:translate-y-0.5 hover:bg-slate-50"}`}
                style={{ borderColor: atual ? pickerTrack.color : "#E2E8F0", background: atual ? `${pickerTrack.color}14` : undefined }}
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
                  {dojoLocked ? "🔒" : p.dom && lvl === 5 && !templeId ? "👑" : lvl}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-xs font-black" style={{ fontFamily: FONT, color: dojoLocked ? "#94A3B8" : C.ink }}>
                    Nível {lvl}
                    {pickerTrack.lvlSkills?.[lvl - 1] && (
                      <span className="font-bold text-slate-600"> · {pickerTrack.lvlSkills[lvl - 1]}</span>
                    )}
                    {atual && <span className="ml-1.5 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md text-white" style={{ background: pickerTrack.color }}>atual</span>}
                    {dojoLocked && <span className="ml-1.5 text-[10px] font-black uppercase text-amber-700">futuro</span>}
                  </span>
                  {pickerSamples[lvl - 1] && (
                    <span className="block text-[10px] text-slate-500 font-bold truncate mt-0.5">Ex: {pickerSamples[lvl - 1]}</span>
                  )}
                  {dojoLocked && (
                    <span className="block text-[10px] text-slate-400 font-bold mt-0.5">Abre quando os fundamentos desta faixa estiverem firmes.</span>
                  )}
                </span>
                <span className="text-slate-300 font-black">{dojoLocked ? "" : "▶"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
