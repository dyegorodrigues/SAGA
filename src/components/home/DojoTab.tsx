import React, { useMemo, useState } from "react";
import { DojoTrackState, Progress, Track } from "../../types";
import { FONT, sfx } from "../Mascot";
import { JARDIM } from "../../curriculum/fichas/dojo/jardim";
import { jardimTrack, resolveJardimState } from "../../curriculum/motores/jardimSession";
import {
  SENSEI_DOJO_TEMPLES,
  resolveSenseiDojoState,
} from "../../curriculum/motores/senseiDojoSession";

interface Props {
  onOpenPicker: (t: Track) => void;
  /**
   * Jardim não abre seletor de nível. O motor escolhe o degrau atual e entrega
   * esse número apenas para a rota já existente do jogo.
   */
  onGardenTrack?: (t: Track, currentStep: number) => void;
  prog: Record<string, Progress>;
  dojoTracks?: Record<string, DojoTrackState>;
  /** O Mestre exige ao menos duas competências conceitualmente dominadas. */
  mixedAvailable: boolean;
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
  JD4: {
    title: "O Passo Seguinte",
    description: "Responda o vizinho do número sem voltar a contar desde o um.",
    mother: "ordem, antes e depois",
  },
  JD5: {
    title: "Ver e Imaginar",
    description: "Guarde o todo na cabeça e descubra a parte escondida.",
    mother: "parte-todo",
  },
};

const TEMPLE_STYLE: Record<string, { border: string; bg: string; shadow: string; text: string; icon: string }> = {
  dojo_add: { border: "#FECDD3", bg: "#FFF1F2", shadow: "#FECDD3", text: "#BE123C", icon: "➕" },
  dojo_sub: { border: "#C7D2FE", bg: "#EEF2FF", shadow: "#C7D2FE", text: "#4338CA", icon: "➖" },
  dojo_mul: { border: "#FDE68A", bg: "#FFFBEB", shadow: "#FDE68A", text: "#B45309", icon: "✖️" },
  dojo_div: { border: "#A7F3D0", bg: "#ECFDF5", shadow: "#A7F3D0", text: "#047857", icon: "➗" },
};

export function DojoTab({ prog, dojoTracks = {}, mixedAvailable, onMixed, onOpenPicker, onGardenTrack }: Props) {
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
   * Os templos usam `dojoTracks` como fonte de verdade. `progress.dojo_*` foi
   * aposentado porque misturava treino de automaticidade com mastery conceitual.
   */
  const senseiEntries = useMemo(() => SENSEI_DOJO_TEMPLES.map(temple => {
    const resolved = resolveSenseiDojoState(temple, prog, dojoTracks[temple.id]);
    return { temple, ...resolved };
  }), [dojoTracks, prog]);

  const senseiStats = useMemo(() => {
    const states = senseiEntries.map(entry => entry.state);
    const attempts = states.reduce((sum, state) => sum + (state.attempts ?? 0), 0);
    const correct = states.reduce((sum, state) => sum + (state.correct ?? 0), 0);
    const rounds = states.reduce((sum, state) => sum + (state.rounds ?? 0), 0);
    const weakItems = states.reduce((sum, state) => {
      const facts = Object.values(state.facts ?? {});
      const procs = Object.values(state.procs ?? {});
      return sum
        + facts.filter(item => item.forca <= 1 || item.erros_seguidos >= 2).length
        + procs.filter(item => item.forca <= 1 || item.erros_seguidos >= 2).length;
    }, 0);
    return {
      rounds,
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
      attempts,
      weakItems,
      unlocked: senseiEntries.filter(entry => entry.maxEligibleStep >= 1).length,
    };
  }, [senseiEntries]);

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
            Treinos curtos para transformar o que você já entendeu em reflexo. O tempo é medido em silêncio — você só precisa pensar e brincar.
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
            <p className="text-xs text-slate-500 font-bold mb-4 pl-1 leading-relaxed">
              Cálculo mental sistemático. O Sensei abre faixas conforme a compreensão fica firme; você pode repetir livremente qualquer faixa já segura.
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              {senseiEntries.map(({ temple, state, maxEligibleStep }) => {
                const style = TEMPLE_STYLE[temple.id];
                const open = maxEligibleStep >= 1;
                return (
                  <button
                    key={temple.id}
                    onClick={() => { sfx.tick(); onOpenPicker(temple.track); }}
                    className="p-4 rounded-2xl border-2 text-left active:translate-y-1 transition-all"
                    style={{
                      borderColor: open ? style.border : "#E2E8F0",
                      background: open ? style.bg : "#F8FAFC",
                      boxShadow: open ? `0 4px 0 ${style.shadow}` : "0 4px 0 #E2E8F0",
                      opacity: open ? 1 : 0.72,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-3xl mb-1">{open ? style.icon : "🔒"}</div>
                      {open && (
                        <span className="text-[9px] font-black rounded-full bg-white/80 px-2 py-1 text-slate-600">
                          {state.currentStep}/{maxEligibleStep}
                        </span>
                      )}
                    </div>
                    <div className="font-black" style={{ color: open ? style.text : "#64748B" }}>
                      {temple.track.name.replace("Academia da ", "Templo da ")}
                    </div>
                    <div className="mt-2 text-[10px] font-bold text-slate-500 leading-snug">
                      {open
                        ? `Treino atual ${state.currentStep} · melhor ${state.highestStep}`
                        : "Abre quando a base conceitual estiver pronta."}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            {mixedAvailable ? (
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
                    🦊 Desafio Opcional
                  </span>
                  <span className="text-2xl">🏆</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: "#9A3412" }}>
                  Treino Mestre (Misto)
                </div>
                <div className="text-xs font-bold mt-1 leading-snug text-orange-900/80">
                  Intercale somente habilidades já dominadas. Este desafio não decide o seu currículo nem substitui a Aula do Dia.
                </div>
              </button>
            ) : (
              <div
                aria-label="Treino Mestre bloqueado"
                className="w-full p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 text-left"
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md text-slate-600 bg-slate-200">
                    🔒 Mestre em preparação
                  </span>
                  <span className="text-xl">🏆</span>
                </div>
                <div className="font-black text-slate-600" style={{ fontFamily: FONT }}>
                  Treino Mestre (Misto)
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-slate-500">
                  Domine pelo menos duas habilidades. Depois o Mestre mistura somente o repertório que você já conquistou.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t-2 border-slate-100">
        <h3 className="text-lg font-black text-slate-700 mb-3" style={{ fontFamily: FONT }}>
          {mode === "garden" ? "Seu Jardim" : "Seu Treino de Fluência"}
        </h3>
        {mode === "garden" ? (
          <div className="grid grid-cols-3 gap-2.5">
            <StatBox value={gardenStats.rounds} label="Rounds" />
            <StatBox value={`${gardenStats.accuracy}%`} label="Precisão" />
            <StatBox value={`${gardenStats.mastered}/${JARDIM.length}`} label="Reflexos" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <StatBox value={senseiStats.rounds} label="Rounds" />
            <StatBox value={`${senseiStats.accuracy}%`} label="Precisão" />
            <StatBox value={senseiStats.attempts} label="Contas treinadas" />
            <StatBox value={senseiStats.weakItems} label="Fatos a reforçar" />
            <div className="col-span-2 text-center text-[10px] font-bold text-slate-500 mt-1">
              {senseiStats.unlocked}/4 templos com treino disponível · velocidade é medida em silêncio e não vale como domínio conceitual.
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
