import React, { useMemo } from "react";

import { State, Kid } from "../../types";
import { FONT, sfx, TOTAL_STICKERS } from "../Mascot";
import { CreatureProfileCard } from "../../features/creature-engine/CreatureProfileCard";

interface Props {
  kid: Kid;
  state: State;
  coins: number;
  albumCount: number;
  onUpdateKid: (k: Kid) => void;
  onAlbum: () => void;
  onBack: () => void;
  setShowWardrobe: (val: boolean) => void;
  setTempBg: (val: string) => void;
  setTempInventory: (val: string[]) => void;
  setTempCoins: (val: number) => void;
  setCoinsSpent: (val: number) => void;
}

export function PerfilTab({
  kid,
  state,
  coins,
  albumCount,
  onUpdateKid,
  onAlbum,
  onBack,
  setShowWardrobe,
  setTempBg,
  setTempInventory,
  setTempCoins,
  setCoinsSpent,
}: Props) {
  const stats = useMemo(() => {
    const logs = state.log[kid.id] || [];
    const activeDays = new Set(logs.map((entry) => entry.d)).size;
    const kidProg = state.progress[kid.id] || {};
    let questions = 0;
    let correct = 0;
    let stars = 0;
    for (const progress of Object.values(kidProg)) {
      questions += progress.tot || 0;
      correct += progress.ok || 0;
      stars += progress.stars || 0;
    }
    return { days: activeDays, questions, correct, stars };
  }, [kid.id, state.log, state.progress]);

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="mb-6 mt-2 text-center">
        <h2 className="text-2xl font-black text-amber-900" style={{ fontFamily: FONT }}>Meu Perfil</h2>
        <p className="mt-1 text-sm font-bold text-slate-500">Seu parceiro, suas conquistas e sua coleção 🌟</p>
      </div>

      <div className="mb-4">
        <CreatureProfileCard kid={kid} state={state} onUpdateKid={onUpdateKid} />
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2" aria-label="Resumo do progresso">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-2.5 text-center">
          <div className="text-lg">📅</div>
          <div className="text-base font-black text-blue-900">{stats.days}</div>
          <div className="text-[8px] font-black uppercase text-blue-600">dias</div>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-2.5 text-center">
          <div className="text-lg">🧩</div>
          <div className="text-base font-black text-violet-900">{stats.questions}</div>
          <div className="text-[8px] font-black uppercase text-violet-600">questões</div>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-2.5 text-center">
          <div className="text-lg">🧠</div>
          <div className="text-base font-black text-emerald-900">{stats.correct}</div>
          <div className="text-[8px] font-black uppercase text-emerald-600">acertos</div>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-2.5 text-center">
          <div className="text-lg">⭐</div>
          <div className="text-base font-black text-amber-900">{stats.stars}</div>
          <div className="text-[8px] font-black uppercase text-amber-600">estrelas</div>
        </div>
      </div>

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
          className="flex min-h-12 w-full cursor-pointer select-none items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-600 py-3.5 text-sm font-black text-amber-950 transition-all active:translate-y-1 active:scale-[0.98]"
          style={{
            fontFamily: FONT,
            background: "linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)",
            boxShadow: "0 2px 0 #CA8A04",
          }}
        >
          <span>🎨 Mudar cenário do mascote</span>
        </button>
      </div>

      <button
        onClick={() => {
          sfx.tick();
          onAlbum();
        }}
        className="card-block relative mb-4 min-h-28 w-full cursor-pointer select-none border-2 p-4 text-left transition-all active:translate-y-0.5"
        style={{
          background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)",
          borderColor: "#F472B6",
          boxShadow: "0 6px 0 #DB2777",
        }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="inline-block rounded-md border-2 border-pink-300 bg-pink-200 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-pink-900">
            Sua coleção
          </span>
          <span className="text-2xl">📖</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#831843" }}>
          Álbum de Figurinhas
        </div>
        <div className="mt-1 text-xs font-bold text-pink-900/80">
          Você tem {albumCount} de {TOTAL_STICKERS} figurinhas! Complete as páginas.
        </div>
      </button>

      <button
        onClick={() => {
          sfx.tick();
          onBack();
        }}
        className="mt-4 min-h-12 w-full p-3 text-center text-sm font-black text-slate-400 active:text-slate-600"
      >
        Sair
      </button>
    </div>
  );
}
