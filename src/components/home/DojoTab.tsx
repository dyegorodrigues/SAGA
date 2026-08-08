import React, { useMemo, useState } from "react";
import { DojoTrackState, Progress, Track } from "../../types";
import { C, FONT, sfx } from "../Mascot";
import { JARDIM } from "../../curriculum/fichas/dojo/jardim";
import { jardimTrack, resolveJardimState } from "../../curriculum/motores/jardimSession";
import { dojo_add } from "../../curriculum/fichas/dojo/sensei/dojo_add";
import { dojo_sub } from "../../curriculum/fichas/dojo/sensei/dojo_sub";
import { dojo_mul } from "../../curriculum/fichas/dojo/sensei/dojo_mul";
import { dojo_div } from "../../curriculum/fichas/dojo/sensei/dojo_div";

interface Props {
  onOpenPicker: (t: Track) => void;
  /**
   * Jardim não abre seletor de nível. O motor escolhe o degrau atual e entrega
   * esse número apenas para a rota já existente do jogo.
   */
  onGardenTrack?: (t: Track, currentStep: number) => void;
  prog: Record<string, Progress>;
  dojoTracks?: Record<string, DojoTrackState>;
  onMixed: () => void;
}

type GardenCopy = {
  title: string;
  description: string;
  mother: string;
};

const GARDEN_COPY: Record<string, GardenCopy> = {
  JD1: {
    title: "Olhômetro Relâmpago",
    description: "Veja a quantidade de uma vez, sem contar item por item.",
    mother: "quantidade num olhar",
  },
  JD2: {
    title: "Mão Relâmpago",
    description: "Reconheça dedos e estruturas de cinco como um só padrão.",
    mother: "estruturas de cinco",
  },
  JD3: {
    title: "Moldura Relâmpago",
    description: "Veja o vazio que falta para completar dez.",
    mother: "amigos do 10",
  },
  JD5: {
    title: "Ver e Imaginar",
    description: "Guarde o todo na cabeça e descubra a parte escondida.",
    mother: "parte-todo",
  },
};

export function DojoTab({ prog, dojoTracks = {}, onMixed, onOpenPicker, onGardenTrack }: Props) {
  const [mode, setMode] = useState<"garden" | "sensei">("garden");

  const gardenEntries = useMemo(() => JARDIM.map(trilha => {
    const state = resolveJardimState(trilha, prog[trilha.mae], dojoTracks[trilha.ficha.id]);
    return {
      trilha,
      state,
      track: jardimTrack(trilha),
      copy: GARDEN_COPY[trilha.ficha.id] ?? {
        title: trilha.ficha.nome.replace(/^Jardim\s*·\s*/i, ""),
        description: "Treino de fluência pré-simbólica.",
        mother: trilha.mae,
      },
    };
  }), [dojoTracks, prog]);

  const gardenStats = useMemo(() => {
    const states = gardenEntries.map(entry => entry.state);
    const attempts = states.reduce((sum, state) => sum + state.attempts, 0);
    const correct = states.reduce((sum, state) => sum + state.correct, 0);
    return {
      rounds: states.reduce((sum, state) => sum + state.rounds, 0),
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      mastered: states.filter(state => state.mastered).length,
      unlocked: states.filter(state => state.unlocked).length,
    };
  }, [gardenEntries]);

  /**
   * O painel antigo somava TODO `state.progress`, chamando Jornada de Dojo.
   * Sensei continua legado, então pelo menos restringimos as estatísticas aos
   * ids que realmente pertencem aos templos de operação.
   */
  const senseiStats = useMemo(() => {
    let ok = 0;
    let tot = 0;
    for (const [id, p] of Object.entries(prog)) {
      if (!id.startsWith("dojo_")) continue;
      ok += p.ok || 0;
      tot += p.tot || 0;
    }
    return {
      batteries: Math.floor(tot / 10),
      accuracy: tot > 0 ? Math.round((ok / tot) * 100) : 0,
      total: tot,
    };
  }, [prog]);

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1]">
      <div className="text-center mb-6 mt-2">
        <h2 className="text-2xl font-black text-purple-900" style={{ fontFamily: FONT }}>Dojo Matemático</h2>
        <p className="text-sm font-bold text-slate-500 mt-1">Treine até o que você aprendeu virar reflexo. ⚡</p>
      </div>

      <div className="flex bg-slate-100 rounded-xl p-1 mb-6 border-2 border-slate-200">
        <button
          onClick={() => { sfx.tick(); setMode("garden"); }}
          className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${mode === "garden" ? "bg-white shadow-sm text-green-700" : "text-slate-600 hover:text-slate-800"}`}
          style={{ fontFamily: FONT }}
        >
          🪴 Jardim
        </button>
        <button
          onClick={() => { sfx.tick(); setMode("sensei"); }}
          className={`flex-1 py-2 rounded-lg font-black text-sm transition-all ${mode === "sensei" ? "bg-white shadow-sm text-purple-700" : "text-slate-600 hover:text-slate-800"}`}
          style={{ fontFamily: FONT }}
        >
          🦊 Dojo Sensei
        </button>
      </div>

      {mode === "garden" && (
        <div className="animate-[mkPop_0.2s_ease-out_1]">
          <div className="flex items-center gap-2 mb-2 pl-1">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-slate-700" style={{ fontFamily: FONT, fontSize: 16 }}>
              Jardim do Dojo
            </span>
          </div>
          <p className="text-xs text-slate-500 font-bold mb-4 pl-1 leading-relaxed">
            Treinos curtos para o olho e a imagem mental. O tempo é medido em silêncio — você só precisa pensar e brincar.
          </p>

          <div className="grid grid-cols-1 gap-3.5">
            {gardenEntries.map(({ trilha, state, track, copy }) => {
              const canStart = state.unlocked && !!onGardenTrack;
              return (
                <button
                  key={trilha.ficha.id}
                  type="button"
                  disabled={!canStart}
                  aria-label={`${copy.title}${state.unlocked ? `, degrau ${state.currentStep} de 5` : ", bloqueado"}`}
                  onClick={() => {
                    if (!canStart) return;
                    sfx.tick();
                    onGardenTrack?.(track, state.currentStep);
                  }}
                  className="w-full text-left rounded-2xl border-2 p-4 transition-all disabled:cursor-not-allowed active:translate-y-1"
                  style={{
                    background: state.unlocked ? "#FFFFFF" : "#F8FAFC",
                    borderColor: state.unlocked ? track.color : "#E2E8F0",
                    boxShadow: state.unlocked ? `0 4px 0 ${track.dark}` : "0 3px 0 #E2E8F0",
                    opacity: state.unlocked ? 1 : 0.72,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 flex items-center justify-center text-2xl"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 16,
                        background: state.unlocked ? track.color : "#E2E8F0",
                      }}
                    >
                      {state.unlocked ? track.icon : "🔒"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-black text-slate-800 leading-tight" style={{ fontFamily: FONT, fontSize: 16 }}>
                          {copy.title}
                        </div>
                        {state.mastered ? (
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            ✨ Reflexo
                          </span>
                        ) : state.unlocked ? (
                          <span className="shrink-0 text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                            Aberto
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs font-semibold text-slate-500 mt-1 leading-relaxed">
                        {copy.description}
                      </p>

                      {state.unlocked ? (
                        <>
                          <div className="flex items-center gap-1.5 mt-3" aria-label={`Melhor degrau ${state.highestStep} de 5`}>
                            {[1, 2, 3, 4, 5].map(step => (
                              <span
                                key={step}
                                className="h-2 flex-1 rounded-full"
                                style={{
                                  background: step <= state.highestStep ? track.dark : "#E2E8F0",
                                  outline: step === state.currentStep ? `2px solid ${track.dark}` : "none",
                                  outlineOffset: 2,
                                }}
                              />
                            ))}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2 text-[11px] font-bold">
                            <span className="text-slate-500">Treino: {state.currentStep}/5</span>
                            <span className="text-slate-600">Melhor: {state.highestStep}/5</span>
                          </div>
                        </>
                      ) : (
                        <div className="mt-3 text-[11px] font-bold text-slate-700 bg-slate-100 rounded-xl px-3 py-2">
                          Continue em {copy.mother}. Abre quando a base chegar ao nível 3.
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {gardenStats.unlocked === 0 && (
            <div className="mt-4 rounded-2xl bg-emerald-50 border-2 border-emerald-100 p-3 text-xs font-bold text-emerald-800 leading-relaxed">
              🌱 O Jardim cresce junto com a Jornada. Continue aprendendo e os primeiros treinos vão abrir sozinhos.
            </div>
          )}
        </div>
      )}

      {mode === "sensei" && (
        <div className="animate-[mkPop_0.2s_ease-out_1]">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3 pl-1">
              <span className="text-xl">⛩️</span>
              <span className="font-bold text-slate-600" style={{ fontFamily: FONT, fontSize: 16 }}>
                Os Templos
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold mb-4 pl-1">
              Ginástica pura. Cálculo mental rápido e direto.
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_add); }} className="p-4 rounded-2xl border-2 border-rose-200 bg-rose-50 text-left active:translate-y-1 transition-all" style={{ boxShadow: "0 4px 0 #FECDD3" }}>
                <div className="text-3xl mb-1">➕</div>
                <div className="font-black text-rose-700">Templo da<br />Adição</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_sub); }} className="p-4 rounded-2xl border-2 border-indigo-200 bg-indigo-50 text-left active:translate-y-1 transition-all" style={{ boxShadow: "0 4px 0 #C7D2FE" }}>
                <div className="text-3xl mb-1">➖</div>
                <div className="font-black text-indigo-700">Templo da<br />Subtração</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_mul); }} className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50 text-left active:translate-y-1 transition-all" style={{ boxShadow: "0 4px 0 #FDE68A" }}>
                <div className="text-3xl mb-1">✖️</div>
                <div className="font-black text-amber-700">Templo da<br />Multiplicação</div>
              </button>
              <button onClick={() => { sfx.tick(); onOpenPicker(dojo_div); }} className="p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-left active:translate-y-1 transition-all" style={{ boxShadow: "0 4px 0 #A7F3D0" }}>
                <div className="text-3xl mb-1">➗</div>
                <div className="font-black text-emerald-700">Templo da<br />Divisão</div>
              </button>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => { sfx.level(); onMixed(); }}
              className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-1 rounded-2xl border-2"
              style={{
                background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                borderColor: "#EA580C",
                boxShadow: "0 4px 0 #C2410C",
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-orange-900 bg-orange-200 border-2 border-orange-300">
                  🦊 Desafio do Mestre
                </span>
                <span className="text-2xl">🏆</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#9A3412" }}>
                Treino Mestre (Misto)
              </div>
              <div className="text-xs font-bold mt-1 leading-snug text-orange-900/80">
                Tudo misturado! Teste seus reflexos com todos os tópicos que você já aprendeu. As moedinhas valem EM DOBRO! 🪙🪙
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-black text-slate-700 mb-3" style={{ fontFamily: FONT }}>
          {mode === "garden" ? "Seu Jardim" : "Suas Estatísticas no Sensei"}
        </h3>
        {mode === "garden" ? (
          <div className="grid grid-cols-3 gap-2.5">
            <StatBox value={gardenStats.rounds} label="Rounds" />
            <StatBox value={`${gardenStats.accuracy}%`} label="Precisão" />
            <StatBox value={`${gardenStats.mastered}/${JARDIM.length}`} label="Reflexos" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatBox value={senseiStats.batteries} label="Baterias" />
            <StatBox value={`${senseiStats.accuracy}%`} label="Precisão" />
            <div className="col-span-2">
              <StatBox value={senseiStats.total} label="Desafios Enfrentados" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 text-center shadow-sm h-full">
      <div className="text-xl font-black text-slate-800" style={{ fontFamily: FONT }}>{value}</div>
      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wide leading-tight mt-1">{label}</div>
    </div>
  );
}
