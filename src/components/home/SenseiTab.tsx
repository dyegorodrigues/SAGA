import React, { useState } from "react";
import { Kid, Track } from "../../types";
import type { AulaPlan, RescuePlanItem } from "../../curriculum/motores/composer";
import type { SenseiEntry } from "../../curriculum/motores/senseiOrchestrator";
import type { SenseiDojoPrescription } from "../../curriculum/motores/senseiDojoPrescription";
import { FONT, sfx } from "../Mascot";

interface Props {
  kid: Kid;
  prog: Record<string, any>;
  aulaPlan: AulaPlan;
  senseiEntry: SenseiEntry;
  dojoPrescription: SenseiDojoPrescription | null;
  /** Misto só aparece quando há ao menos duas competências dominadas/praticadas. */
  mixedAvailable: boolean;
  onMatricula: () => void;
  /** Porta única: o parent já roteia aula normal, Oficina ou Jardim causal. */
  onAula: () => void;
  /** Missão de fluência com autoridade prescrita pelo Sensei. */
  onSenseiDojo: () => void;
  onTrack: (t: Track) => void;
  onMixed: () => void;
  setActiveShellTab: (tab: any) => void;
}

export function SenseiTab({ kid, prog, aulaPlan, senseiEntry, dojoPrescription, mixedAvailable, onMatricula, onAula, onSenseiDojo, onTrack, onMixed, setActiveShellTab }: Props) {
  const [expandedLesson, setExpandedLesson] = useState(true);
  const [expandedDojo, setExpandedDojo] = useState(true);
  const [expandedRescue, setExpandedRescue] = useState(true);
  const rescuePrincipal = senseiEntry.kind === "rescue" ? senseiEntry.rescue : null;
  const gardenPrincipal = senseiEntry.kind === "garden" ? senseiEntry.prescription : null;
  const interventionPrincipal = !!rescuePrincipal || !!gardenPrincipal;

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1] pb-6">
      <div className="text-center mb-6 mt-2">
         <h2 className="text-2xl font-black text-blue-900" style={{ fontFamily: FONT }}>O Sensei SAGA</h2>
         <p className="text-xs font-extrabold text-slate-500 mt-0.5">Seu plano de estudos e conquistas diárias 🦊</p>
      </div>

      {/* 🎒 MATRÍCULA (E3) */}
      {Object.keys(prog).length === 0 && (
        <div className="mb-5 relative overflow-hidden card-block border-2" style={{ borderColor: "#0EA5E9", boxShadow: "0 6px 0 #0369A1", borderRadius: 24 }}>
          <button
            onClick={() => {
              sfx.level();
              onMatricula();
            }}
            className="w-full text-left p-5 select-none relative cursor-pointer active:translate-y-0.5 transition-all"
            style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_2.4s_ease-in-out_infinite]" />
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 text-sky-900 bg-sky-200 border-2 border-sky-300 rounded-md inline-block">
                ✨ Primeira Aventura
              </span>
              <span className="text-2xl animate-bounce">🎒</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#0C4A6E" }}>
              Sessão de Boas-Vindas
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-sky-900/80">
              {kid.petName || "Seu mascote"} quer te conhecer! Vamos descobrir o seu nível sem pressa. 🌟
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-sky-600 px-4 py-2 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
              <span>Começar Sondagem</span>
              <span>🚀</span>
            </div>
          </button>
        </div>
      )}

      {/* AULA DO DIA — uma porta, decisão pedagógica do Tutor */}
      {Object.keys(prog).length > 0 && (
        <div className="mb-6 relative overflow-hidden border-2" style={{ borderColor: interventionPrincipal ? "#FDBA74" : "#C7D2FE", boxShadow: interventionPrincipal ? "0 6px 0 #FB923C" : "0 6px 0 #A5B4FC", borderRadius: 24 }}>
          <div
            className="w-full text-left p-5 select-none relative"
            style={{ background: interventionPrincipal ? "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)" : "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)" }}
          >
            <span className="pointer-events-none absolute w-1/3 h-full -left-[70%] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[mkShine_3s_ease-in-out_infinite]" />

            <div className="flex items-center justify-between gap-3 mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 border-2 rounded-lg inline-block shadow-sm ${interventionPrincipal ? "text-orange-950 bg-orange-200 border-orange-300" : "text-indigo-900 bg-indigo-200 border-indigo-300"}`}>
                {gardenPrincipal
                  ? "🌱 Aula do Dia · Base Perceptual"
                  : rescuePrincipal
                    ? "🛠️ Aula do Dia · Reconstrução"
                    : "🎓 Aula do Dia · Próximo Passo"}
              </span>
              <button
                onClick={() => setExpandedLesson(!expandedLesson)}
                className={`text-xs font-bold px-2.5 py-1 rounded-md transition-colors ${interventionPrincipal ? "text-orange-800 bg-orange-100 hover:bg-orange-200" : "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"}`}
              >
                {expandedLesson ? "▲ Compactar" : "▼ Expandir"}
              </button>
            </div>

            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: interventionPrincipal ? "#9A3412" : "#312E81", marginBottom: 2 }}>
              {gardenPrincipal
                ? `Transformar em reflexo: ${gardenPrincipal.track.name}`
                : rescuePrincipal
                  ? `Fortalecer: ${rescuePrincipal.track.name}`
                  : "A Aventura do Sensei"}
            </div>

            <div className={`text-[13px] font-bold leading-snug mb-3 ${interventionPrincipal ? "text-orange-900/90" : "text-indigo-800/90"}`}>
              {gardenPrincipal
                ? gardenPrincipal.reasonText
                : rescuePrincipal
                  ? `O Sensei percebeu uma base que vale fortalecer agora. Você não precisa escolher nada: esta é a missão certa para o seu próximo passo.`
                  : aulaPlan.resumo}
            </div>

            {expandedLesson && (
              <div className={`text-[11px] font-bold mt-2 mb-4 leading-snug bg-white/75 p-3.5 rounded-2xl shadow-inner ${interventionPrincipal ? "text-orange-950 border border-orange-200/70" : "text-indigo-950 border border-indigo-200/60"}`}>
                <div className={`mb-2 uppercase tracking-widest text-[9px] font-black ${interventionPrincipal ? "text-orange-900/70" : "text-indigo-900/70"}`}>
                  Roteiro Pedagógico Guiado:
                </div>
                {gardenPrincipal ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-600 text-sm">🌱</span>
                      <span>Base já compreendida: <b>{gardenPrincipal.motherName}</b></span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-orange-600 text-sm">👀</span>
                      <span>Treino causal: <b>{gardenPrincipal.track.name}</b></span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-emerald-600 text-sm">🎯</span>
                      <span>Degrau do Jardim: <b>{gardenPrincipal.step}</b></span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-blue-600 text-sm">🧭</span>
                      <span>Round curto de <b>{gardenPrincipal.questionBudget} desafios</b> para recuperar automaticidade.</span>
                    </div>
                  </>
                ) : rescuePrincipal ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600 text-sm">🧱</span>
                      <span>Base de hoje: <b>{rescuePrincipal.track.name}</b></span>
                    </div>
                    {rescuePrincipal.requiredLevel && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-emerald-600 text-sm">🎯</span>
                        <span>Meta de recuperação: <b>nível {rescuePrincipal.requiredLevel}</b></span>
                      </div>
                    )}
                    {rescuePrincipal.questionBudget && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-blue-600 text-sm">🧭</span>
                        <span>Até <b>{rescuePrincipal.questionBudget} desafios</b> — termina antes se a base ficar firme.</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {aulaPlan.aquecimento && (
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500 text-sm">🔥</span>
                        <span>Aquecimento: <b className="text-indigo-900">{aulaPlan.aquecimento.name}</b></span>
                      </div>
                    )}
                    {aulaPlan.fronteira && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-emerald-600 text-sm">🌱</span>
                        <span>Meta principal: <b className="text-emerald-950">{aulaPlan.fronteira.name}</b></span>
                      </div>
                    )}
                    {aulaPlan.fluencia && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-blue-600 text-sm">⚡</span>
                        <span>Fluência complementar: <b className="text-indigo-900">{aulaPlan.fluencia.name}</b></span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => {
                sfx.level();
                onAula();
              }}
              className={`mt-1 inline-flex items-center justify-center w-full gap-2 text-[15px] font-black text-white px-5 py-3 rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer ${interventionPrincipal ? "bg-orange-600 hover:bg-orange-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              <span>{gardenPrincipal ? "Começar Jardim Guiado" : rescuePrincipal ? "Começar Reforço Guiado" : "Começar Aula do Dia"}</span>
              <span className="text-lg">▶</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. 🥋 MISSÕES DO DOJÔ — prescrição e porta livre permanecem distintas */}
      <div className="mb-6 bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-200">
        <div className="flex items-center justify-between mb-1 pl-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥋</span>
            <span className="font-black text-slate-800" style={{ fontFamily: FONT, fontSize: 18 }}>
              Missões do Dojô
            </span>
          </div>
          <button
            onClick={() => setExpandedDojo(!expandedDojo)}
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
          >
            {expandedDojo ? "▲ Compactar" : "▼ Expandir"}
          </button>
        </div>
        <p className="text-xs font-bold text-slate-500 mb-4 pl-1">O Sensei pode prescrever um round curto de automaticidade. O treino livre continua sendo escolha sua nas áreas próprias de exploração.</p>

        {expandedDojo && (
          <div className="flex flex-col gap-3">
            {dojoPrescription && (
              <button
                onClick={() => {
                  sfx.level();
                  onSenseiDojo();
                }}
                className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2 hover:border-blue-500"
                style={{
                  background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                  borderColor: '#3B82F6',
                  boxShadow: '0 4px 0 #2563EB',
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-blue-950 bg-blue-200 border border-blue-300">
                    ⚡ Prescrição do Sensei
                  </span>
                  <span className="text-xl">🎯</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 17, color: '#1E3A8A' }}>
                  {dojoPrescription.temple.track.name} · faixa {dojoPrescription.step}
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-blue-900/85">
                  {dojoPrescription.reasonText}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-white bg-blue-600 px-3.5 py-2 rounded-xl shadow-sm">
                  Fazer round prescrito ▶
                </div>
              </button>
            )}

            {mixedAvailable && (
              <button
                onClick={() => {
                  sfx.level();
                  onMixed();
                }}
                className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2 hover:border-slate-400"
                style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  borderColor: '#94A3B8',
                  boxShadow: '0 4px 0 #64748B',
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-slate-800 bg-slate-200 border border-slate-300">
                    🌪️ Desafio Opcional
                  </span>
                  <span className="text-xl">⚙️</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: '#1E293B' }}>
                  Mistura Total (Dojô Geral)
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-slate-600">
                  Mistura somente habilidades que você já dominou para desafiar seus reflexos.
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. 🚑 OFICINA — painel manual da mesma inteligência de recuperação */}
      {aulaPlan.resgates.length > 0 && (
         <div className="mb-6 bg-rose-50/90 p-5 rounded-3xl border-2 border-rose-200 shadow-sm">
            <div className="flex items-center justify-between mb-1 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚑</span>
                <span className="font-black text-rose-950" style={{ fontFamily: FONT, fontSize: 18 }}>
                  Oficina de Reforço
                </span>
              </div>
              <button
                onClick={() => setExpandedRescue(!expandedRescue)}
                className="text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-md transition-colors"
              >
                {expandedRescue ? "▲ Compactar" : "▼ Expandir"}
              </button>
            </div>

            <p className="text-[11px] font-bold text-rose-800/80 mb-3 pl-1">
              O Radar encontrou pontos que valem reforço. O Sensei já prioriza automaticamente os que bloqueiam sua evolução.
            </p>

            {expandedRescue && (
              <div className="bg-white p-4 rounded-2xl border-2 border-rose-200 shadow-sm">
                <div className="text-[12px] text-slate-700 font-bold mb-3 leading-snug">
                  Há <b>{aulaPlan.resgates.length} {aulaPlan.resgates.length === 1 ? "ponto" : "pontos"}</b> de revisão/reconstrução no radar:
                </div>

                <div className="flex flex-col gap-2.5">
                  {aulaPlan.resgates.map((r: RescuePlanItem) => (
                    <div
                      key={`${r.track.id}-${r.reason}`}
                      onClick={() => {
                        sfx.tick();
                        onTrack(r.track);
                      }}
                      className="bg-rose-50/70 hover:bg-rose-100/80 cursor-pointer transition-colors rounded-xl p-3 border border-rose-200 flex items-center justify-between gap-3 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🛠️</span>
                        <div>
                          <div className="text-xs font-black text-rose-950">{r.track.name}</div>
                          <div className="text-[10px] text-rose-700 font-semibold">Treino opcional deste ponto agora</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-600 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0 shadow-xs">
                        Reforço
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { sfx.tick(); setActiveShellTab("oficina"); }}
                  className="mt-4 w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-extrabold text-xs text-center transition-colors cursor-pointer border border-rose-300"
                >
                  Abrir Painel Completo da Oficina 🔧
                </button>
              </div>
            )}
         </div>
      )}
    </div>
  );
}
