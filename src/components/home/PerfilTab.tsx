import React, { useMemo } from "react";

import { State, Kid } from "../../types";
import { FONT, sfx, TOTAL_STICKERS } from "../Mascot";
import { MascotEvolutionCard } from "../MascotEvolution";
import { getKidLifetimeXp, sagaLevelProgress } from "../../lib/gamificationProgress";
import { deriveSkillAtlas } from "../../lib/skillAtlas";
import { ALL_MATH_TRACKS, ISLAND_DEFS } from "../../curriculum/motores/curriculum";

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
  kid, state, coins, albumCount, 
  onUpdateKid, onAlbum, onBack, 
  setShowWardrobe, setTempBg, setTempInventory, setTempCoins, setCoinsSpent 
}: Props) {
  const stats = useMemo(() => {
    const logs = state.log[kid.id] || [];
    const activeDays = logs.length;
    let progressQuestions = 0;
    const kidProg = state.progress[kid.id] || {};
    for (const trackId of Object.keys(kidProg)) progressQuestions += kidProg[trackId].ok || 0;
    const logQuestions = logs.reduce((sum, entry) => sum + (entry.tot || 0), 0);
    return {
      days: activeDays,
      questions: Math.max(logQuestions, progressQuestions),
      xp: getKidLifetimeXp(kid.id, state),
    };
  }, [kid.id, state]);

  const player = useMemo(() => sagaLevelProgress(stats.xp), [stats.xp]);
  const atlas = useMemo(() => deriveSkillAtlas(ALL_MATH_TRACKS, state, kid.id), [kid.id, state]);
  const masteredSkills = atlas.skills.filter(skill => skill.status === "mastered");
  const activeDomains = atlas.domains
    .filter(domain => domain.started > 0 || domain.mastered > 0)
    .sort((a, b) => b.currentCompletion01 - a.currentCompletion01)
    .slice(0, 4);

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-5 mt-2"> 
        <h2 className="text-2xl font-black text-amber-900" style={{ fontFamily: FONT }}>Meu Perfil</h2> 
        <p className="text-sm font-bold text-slate-500 mt-1">Sua jornada, conquistas e companheiro 🌟</p>
      </div>

      {/* Nível do JOGADOR: identidade persistente da criança, separado do mascote. */}
      <section className="mb-4 rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-50 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-indigo-500">Jornada SAGA</div>
            <div className="text-2xl font-black text-indigo-950" style={{ fontFamily: FONT }}>
              Nível {player.level} <span className="text-base">⚔️</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">XP vitalício</div>
            <div className="text-lg font-black text-amber-500">⭐ {player.xp}</div>
          </div>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full border border-indigo-100 bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-500"
            style={{ width: `${Math.round(player.progress01 * 100)}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] font-bold text-indigo-500">
          <span>{player.level >= 100 ? "Mestre da Jornada" : `Nível ${player.level}`}</span>
          <span>{player.xpForNextLevel == null ? "Nível máximo" : `${player.xpForNextLevel} XP para o nível ${player.level + 1}`}</span>
        </div>
      </section>

      {/* Atlas: projeção do learner state. XP/moedas não entram no cálculo. */}
      <section className="mb-4 rounded-3xl border-2 border-emerald-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600">Atlas de Habilidades</div>
            <div className="text-lg font-black text-slate-900" style={{ fontFamily: FONT }}>Minhas Insígnias 🏅</div>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Insígnias máximas só aparecem com domínio matemático real.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-3 py-2 text-center shrink-0">
            <div className="text-xl font-black text-amber-600">{masteredSkills.length}</div>
            <div className="text-[9px] font-black uppercase text-amber-700">domínios</div>
          </div>
        </div>

        {activeDomains.length ? (
          <div className="grid grid-cols-2 gap-2">
            {activeDomains.map(domain => {
              const def = ISLAND_DEFS[domain.island] || ISLAND_DEFS.default;
              const pct = Math.round(domain.currentCompletion01 * 100);
              return (
                <div key={domain.island} className="rounded-2xl border border-slate-100 bg-slate-50 p-2.5">
                  <div className="text-[11px] font-black text-slate-700 truncate">{def.title}</div>
                  <div className="mt-1.5 h-2 rounded-full bg-white border border-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="mt-1 text-[9px] font-bold text-slate-400">
                    {domain.mastered}/{domain.totalReady} dominadas
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-3 text-center text-xs font-bold text-slate-400">
            Suas primeiras insígnias vão nascer conforme você demonstra novas habilidades. 🌱
          </div>
        )}

        {masteredSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {masteredSkills.slice(0, 8).map(skill => (
              <span
                key={skill.id}
                title={skill.name}
                className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-800"
              >
                {skill.icon} {skill.id} 👑
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center">
          <div className="text-lg font-black text-slate-800">{stats.days}</div>
          <div className="text-[10px] font-bold text-slate-400">dias de jornada</div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center">
          <div className="text-lg font-black text-slate-800">{stats.questions}</div>
          <div className="text-[10px] font-bold text-slate-400">desafios respondidos</div>
        </div>
      </div>

      <div className="mb-4">
        <MascotEvolutionCard
          kid={kid}
          state={state}
          onUpdateKid={onUpdateKid}
          coins={coins}
        />
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
          className="w-full select-none transition-all active:translate-y-1 active:scale-[0.98] py-3.5 text-sm font-black text-amber-950 cursor-pointer flex items-center justify-center gap-2 border-b-4 border-amber-600 rounded-2xl"
          style={{
            fontFamily: FONT,
            background: "linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)",
            boxShadow: `0 2px 0 #CA8A04`,
          }}
        >
          <span>🎨 Mudar Cenário do Companheiro</span>
        </button>
      </div>

      <button
        onClick={() => {
          sfx.tick();
          onAlbum();
        }}
        className="w-full text-left p-4 select-none relative cursor-pointer active:translate-y-0.5 transition-all mb-4 card-block border-2"
        style={{ background: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)", borderColor: "#F472B6", boxShadow: "0 6px 0 #DB2777" }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 text-pink-900 bg-pink-200 border-2 border-pink-300 rounded-md inline-block">
            Sua Coleção
          </span>
          <span className="text-2xl">📖</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#831843" }}>
          Álbum de Figurinhas
        </div>
        <div className="text-xs font-bold mt-1 text-pink-900/80">
          Você tem {albumCount} de {TOTAL_STICKERS} figurinhas! Complete as páginas.
        </div>
      </button>
      
      <button
        onClick={() => {
          sfx.tick();
          onBack();
        }}
        className="w-full text-center p-3 mt-4 text-sm font-black text-slate-400 active:text-slate-600"
      >
        Sair
      </button>
    </div>
  );
}
