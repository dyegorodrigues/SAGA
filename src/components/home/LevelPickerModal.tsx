import React, { useMemo } from "react";
import { Track, Progress } from "../../types";
import { sfx, FONT, C, FRESH } from "../Mascot";

interface LevelPickerModalProps {
  pickerTrack: Track;
  prog: Record<string, Progress>;
  onClose: () => void;
  onTrackLvl: (t: Track, lvl: number) => void;
}

export function LevelPickerModal({ pickerTrack, prog, onClose, onTrackLvl }: LevelPickerModalProps) {
  // Amostra do que cada nível pergunta (gera 1 questão-exemplo por nível)
  const pickerSamples = useMemo(() => {
    return [1, 2, 3, 4, 5].map((lvl) => {
      try {
        return pickerTrack.gen(lvl).prompt;
      } catch {
        return "";
      }
    });
  }, [pickerTrack]);

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
            Escolha o nível de dificuldade para jogar agora! 🎯
          </p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const p = prog[pickerTrack.id] || FRESH();
            const won = lvl <= p.maxLvl;
            const atual = lvl === p.lvl;
            return (
              <button
                key={lvl}
                onClick={() => {
                  sfx.level();
                  onClose();
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
                </span>
                <span className="text-slate-300 font-black">▶</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
