import React, { useState } from "react";
import { Kid, Track } from "../../types";
import type { AulaPlan, RescuePlanItem } from "../../curriculum/motores/composer";
import type { SenseiEntry } from "../../curriculum/motores/senseiOrchestrator";
import type { SenseiDojoPrescription } from "../../curriculum/motores/senseiDojoPrescription";
import { FONT, sfx } from "../Mascot";
import { Icone, NomeDoIcone } from "../icones/Icone";
import { isTrackUnlocked, UnlockStatus } from "../../curriculum/motores/unlockEngine";

/**
 * A casa da criança — a primeira tela depois de entrar.
 *
 * ## O que estava errado aqui, e não era o layout
 *
 * Esta tela estava escrita para o AUTOR do currículo, não para quem a lê. As
 * palavras que estavam no ar, todas visíveis para uma criança de seis anos:
 * "Roteiro Pedagógico Guiado", "Prescrição do Sensei", "Base Perceptual",
 * "recuperar automaticidade", "Fluência complementar", "revisão/reconstrução
 * no radar". Nenhuma delas é lida por quem está no 1º ano — e a criança de 1º
 * ano é justamente o começo da Jornada, a idade com MENOS leitura de todo o
 * aplicativo.
 *
 * Isso não é preciosismo de redação. Uma tela que a criança não lê é uma tela
 * onde ela toca no que for maior e mais colorido, e o Tutor — que existe para
 * dizer o que fazer agora — vira decoração. O vocabulário técnico continua
 * existindo e é bom que exista: ele mora no `ParentDashboard`, que é lido por
 * adulto, e nos nomes internos do código.
 *
 * ## A régua da escrita daqui
 *
 * Frase curta, verbo no começo, palavra de todo dia. "Vamos treinar de novo"
 * em vez de "reconstrução da base". Se um adulto precisar traduzir a frase
 * para a criança, a frase está errada.
 *
 * Um teste (`vozDaCasaDaCrianca.test.tsx`) varre esta pasta e reprova o
 * vocabulário adulto de volta — porque ele já voltou uma vez.
 *
 * ## E por que os cartões ficaram mais quietos
 *
 * Eram três cartões com gradiente, borda colorida, sombra dura e um brilho
 * varrendo cada um em laço infinito. Três coisas gritando ao mesmo tempo é o
 * mesmo que nenhuma gritar: sem hierarquia, a criança não sabe onde tocar.
 * Agora só o cartão da AÇÃO DE HOJE é forte; Dojô e Oficina são brancos e
 * calmos, porque são segunda e terceira escolha.
 */

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
  /** Para os quatro atalhos: quantas estão abertas e quantas já foram dominadas. */
  tracks: Track[];
  unlockStatus: UnlockStatus;
}

/**
 * Um dos quatro atalhos do rodapé da casa.
 *
 * Existem porque abaixo dos cartões sobrava meia tela em branco — e tela em
 * branco num app infantil não lê como "respiro", lê como "não terminaram".
 * Além do vazio, os quatro pilares só existiam na barra de abas, em ícone de
 * 28px sem nenhum número: a criança não tinha como saber que havia sete
 * competências abertas esperando por ela.
 *
 * Cada atalho leva para a mesma aba que o rodapé leva. É atalho, não porta
 * nova: dois caminhos para o mesmo lugar é bom; dois lugares parecidos, não.
 */
function Atalho({ icone, titulo, linha, onClick }: { icone: NomeDoIcone; titulo: string; linha: string; onClick: () => void }) {
  return (
    <button
      onClick={() => { sfx.tick(); onClick(); }}
      className="bg-white rounded-2xl p-4 border-2 border-slate-200 text-left transition-all hover:border-slate-300 active:translate-y-0.5 shadow-sm"
    >
      <Icone nome={icone} tamanho={26} />
      <div className="font-black text-slate-800 mt-2" style={{ fontFamily: FONT, fontSize: 15 }}>{titulo}</div>
      <div className="text-[11px] font-bold text-slate-500 leading-snug mt-0.5">{linha}</div>
    </button>
  );
}

/**
 * Um item do roteiro: um ponto e a frase ao lado.
 *
 * O ponto herda a cor do texto (`currentColor`) em vez de ter cor própria. A
 * primeira versão dava uma cor a cada passo — laranja, verde, azul — e a cor
 * não significava nada: eram três enfeites competindo com o nome da
 * competência, que é a informação. Quem separa os passos é a frase.
 */
function Passo({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 mt-1.5 first:mt-0">
      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-[7px] bg-current opacity-40" />
      <span>{children}</span>
    </div>
  );
}

/** Abrir e fechar sem seta de painel de administração. */
function VerMais({ aberto, onClick, tom }: { aberto: boolean; onClick: () => void; tom: string }) {
  return (
    <button onClick={onClick} className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg transition-colors ${tom}`}>
      {aberto ? "Menos" : "Mais"}
    </button>
  );
}

export function SenseiTab({ kid, prog, aulaPlan, senseiEntry, dojoPrescription, mixedAvailable, onMatricula, onAula, onSenseiDojo, onTrack, onMixed, setActiveShellTab, tracks, unlockStatus }: Props) {
  const [expandedLesson, setExpandedLesson] = useState(true);
  const [expandedDojo, setExpandedDojo] = useState(true);
  const [expandedRescue, setExpandedRescue] = useState(true);
  // A MESMA função que o mapa usa para abrir o nó: recontar a regra aqui daria
  // um número que discorda da tela que o atalho abre.
  const abertas = tracks.filter(t => isTrackUnlocked(t.id, t.graphId, unlockStatus)).length;
  const dominadas = tracks.filter(t => (prog[t.id]?.lvl || 0) >= 5).length;

  const rescuePrincipal = senseiEntry.kind === "rescue" ? senseiEntry.rescue : null;
  const gardenPrincipal = senseiEntry.kind === "garden" ? senseiEntry.prescription : null;
  const interventionPrincipal = !!rescuePrincipal || !!gardenPrincipal;

  return (
    <div className="animate-[mkPop_0.25s_ease-out_1] pb-6">
      <div className="mb-6 mt-2 pl-1">
         {/* O cumprimento pelo nome já está no cabeçalho, logo acima. Repetir
             "Oi, Teo" aqui era dizer a mesma coisa duas vezes na mesma tela. */}
         <h2 className="text-[26px] font-black text-blue-900 leading-tight" style={{ fontFamily: FONT }}>
           O que tem para hoje
         </h2>
         <p className="text-xs font-extrabold text-slate-500 mt-0.5">Um passo de cada vez.</p>
      </div>

      {/* PRIMEIRA VEZ — a sondagem que descobre por onde começar */}
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
                Sua primeira aventura
              </span>
              <Icone nome="estrela" tamanho={26} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#0C4A6E" }}>
              Vamos nos conhecer
            </div>
            <div className="text-xs font-bold mt-1 leading-snug text-sky-900/80">
              Vamos ver o que você já sabe. Sem pressa e sem nota.
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-white bg-sky-600 px-4 py-2 rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-transform">
              Começar Sondagem
            </div>
          </button>
        </div>
      )}

      {/* A AVENTURA DE HOJE — uma porta, decisão pedagógica do Tutor */}
      {Object.keys(prog).length > 0 && (
        <div className="mb-6 relative overflow-hidden border-2" style={{ borderColor: interventionPrincipal ? "#FDBA74" : "#C7D2FE", boxShadow: interventionPrincipal ? "0 6px 0 #FB923C" : "0 6px 0 #A5B4FC", borderRadius: 24 }}>
          <div
            className="w-full text-left p-5 select-none relative"
            style={{ background: interventionPrincipal ? "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)" : "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)" }}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 border-2 rounded-lg inline-block shadow-sm ${interventionPrincipal ? "text-orange-950 bg-orange-200 border-orange-300" : "text-indigo-900 bg-indigo-200 border-indigo-300"}`}>
                {gardenPrincipal
                  ? "Hoje · deixar rápido"
                  : rescuePrincipal
                    ? "Hoje · treinar de novo"
                    : "Hoje · seu próximo passo"}
              </span>
              <VerMais
                aberto={expandedLesson}
                onClick={() => setExpandedLesson(!expandedLesson)}
                tom={interventionPrincipal ? "text-orange-800 bg-orange-100 hover:bg-orange-200" : "text-indigo-700 bg-indigo-100 hover:bg-indigo-200"}
              />
            </div>

            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: interventionPrincipal ? "#9A3412" : "#312E81", marginBottom: 2 }}>
              {gardenPrincipal
                ? `Ficar rápido em: ${gardenPrincipal.track.name}`
                : rescuePrincipal
                  ? `Treinar de novo: ${rescuePrincipal.track.name}`
                  : "A Aventura do Sensei"}
            </div>

            <div className={`text-[13px] font-bold leading-snug mb-3 ${interventionPrincipal ? "text-orange-900/90" : "text-indigo-800/90"}`}>
              {gardenPrincipal
                ? gardenPrincipal.reasonText
                : rescuePrincipal
                  ? `Tem uma coisa aqui que vale treinar mais um pouco. Você não precisa escolher nada: o Sensei já separou.`
                  : aulaPlan.resumo}
            </div>

            {expandedLesson && (
              <div className={`text-[11px] font-bold mt-2 mb-4 leading-snug bg-white/75 p-3.5 rounded-2xl shadow-inner ${interventionPrincipal ? "text-orange-950 border border-orange-200/70" : "text-indigo-950 border border-indigo-200/60"}`}>
                <div className={`mb-2 uppercase tracking-widest text-[9px] font-black ${interventionPrincipal ? "text-orange-900/70" : "text-indigo-900/70"}`}>
                  O que vem na missão
                </div>
                {gardenPrincipal ? (
                  <>
                    <Passo>Você já entende: <b>{gardenPrincipal.motherName}</b></Passo>
                    <Passo>Vamos treinar: <b>{gardenPrincipal.track.name}</b></Passo>
                    <Passo>Degrau <b>{gardenPrincipal.step}</b></Passo>
                    <Passo><b>{gardenPrincipal.questionBudget} desafios</b> curtinhos, para ficar rápido.</Passo>
                  </>
                ) : rescuePrincipal ? (
                  <>
                    <Passo>Vamos treinar: <b>{rescuePrincipal.track.name}</b></Passo>
                    {rescuePrincipal.requiredLevel && (
                      <Passo>Chegar no <b>nível {rescuePrincipal.requiredLevel}</b></Passo>
                    )}
                    {rescuePrincipal.questionBudget && (
                      <Passo>Até <b>{rescuePrincipal.questionBudget} desafios</b> — acaba antes se você mandar bem.</Passo>
                    )}
                  </>
                ) : (
                  <>
                    {aulaPlan.aquecimento && (
                      <Passo>Para aquecer: <b className="text-indigo-900">{aulaPlan.aquecimento.name}</b></Passo>
                    )}
                    {aulaPlan.fronteira && (
                      <Passo>O desafio de hoje: <b className="text-emerald-950">{aulaPlan.fronteira.name}</b></Passo>
                    )}
                    {aulaPlan.fluencia && (
                      <Passo>Para ficar rápido: <b className="text-indigo-900">{aulaPlan.fluencia.name}</b></Passo>
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
              <span>{interventionPrincipal ? "Vamos treinar" : "Começar a Aventura"}</span>
                          </button>
          </div>
        </div>
      )}

      {/* O DOJÔ — treino rápido; prescrição e porta livre continuam distintas */}
      <div className="mb-6 bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-200">
        <div className="flex items-center justify-between mb-1 pl-1">
          <div className="flex items-center gap-2.5">
            <Icone nome="dojo" tamanho={26} />
            <span className="font-black text-slate-800" style={{ fontFamily: FONT, fontSize: 18 }}>
              Treino do Dojô
            </span>
          </div>
          <VerMais aberto={expandedDojo} onClick={() => setExpandedDojo(!expandedDojo)} tom="text-slate-600 bg-slate-100 hover:bg-slate-200" />
        </div>
        <p className="text-xs font-bold text-slate-500 mb-4 pl-1">Rounds curtos, para o que você já aprendeu sair sem pensar. Treinar livre é escolha sua.</p>

        {expandedDojo && (
          <div className="flex flex-col gap-3">
            {dojoPrescription && (
              <button
                onClick={() => {
                  sfx.level();
                  onSenseiDojo();
                }}
                className="w-full text-left p-4 select-none relative transition-all cursor-pointer active:translate-y-0.5 rounded-2xl border-2 hover:border-blue-500"
                style={{ background: '#EFF6FF', borderColor: '#3B82F6', boxShadow: '0 4px 0 #2563EB' }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-blue-950 bg-blue-200 border border-blue-300">
                    O Sensei separou para você
                  </span>
                  <Icone nome="fronteira" tamanho={20} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 17, color: '#1E3A8A' }}>
                  {dojoPrescription.temple.track.name} · faixa {dojoPrescription.step}
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-blue-900/85">
                  {dojoPrescription.reasonText}
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-black text-white bg-blue-600 px-3.5 py-2 rounded-xl shadow-sm">
                  Fazer este treino
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
                style={{ background: '#F8FAFC', borderColor: '#94A3B8', boxShadow: '0 4px 0 #64748B' }}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md inline-block text-slate-800 bg-slate-200 border border-slate-300">
                    Se você quiser
                  </span>
                  <Icone nome="estrela" tamanho={20} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 17, color: '#1E293B' }}>
                  Mistura Geral
                </div>
                <div className="text-[11px] font-bold mt-1 leading-snug text-slate-600">
                  Junta tudo o que você já dominou, de uma vez, para ver se sai rápido.
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {/* A OFICINA — a mesma inteligência de reforço, aberta na mão */}
      {aulaPlan.resgates.length > 0 && (
         <div className="mb-6 bg-white p-5 rounded-3xl border-2 border-rose-200 shadow-sm">
            <div className="flex items-center justify-between mb-1 pl-1">
              <div className="flex items-center gap-2.5">
                <Icone nome="oficina" tamanho={26} />
                <span className="font-black text-rose-950" style={{ fontFamily: FONT, fontSize: 18 }}>
                  Oficina
                </span>
              </div>
              <VerMais aberto={expandedRescue} onClick={() => setExpandedRescue(!expandedRescue)} tom="text-rose-800 bg-rose-100 hover:bg-rose-200" />
            </div>

            <p className="text-[11px] font-bold text-rose-800/80 mb-3 pl-1">
              Coisas que vale treinar mais uma vez. O Sensei já pôs as mais importantes na frente.
            </p>

            {expandedRescue && (
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200">
                <div className="text-[12px] text-slate-700 font-bold mb-3 leading-snug">
                  <b>{aulaPlan.resgates.length} {aulaPlan.resgates.length === 1 ? "coisa" : "coisas"}</b> para treinar de novo:
                </div>

                <div className="flex flex-col gap-2.5">
                  {aulaPlan.resgates.map((r: RescuePlanItem) => (
                    <div
                      key={`${r.track.id}-${r.reason}`}
                      onClick={() => {
                        sfx.tick();
                        onTrack(r.track);
                      }}
                      className="bg-white hover:bg-rose-50 cursor-pointer transition-colors rounded-xl p-3 border border-rose-200 flex items-center justify-between gap-3 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icone nome="oficina" tamanho={20} />
                        <div>
                          <div className="text-xs font-black text-rose-950">{r.track.name}</div>
                          <div className="text-[10px] text-rose-700 font-semibold">Treinar isto agora</div>
                        </div>
                      </div>
                      <span className="text-[10px] bg-rose-600 text-white px-2.5 py-1 rounded-full font-black uppercase tracking-wider shrink-0 shadow-xs">
                        Treinar
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { sfx.tick(); setActiveShellTab("oficina"); }}
                  className="mt-4 w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded-xl font-extrabold text-xs text-center transition-colors cursor-pointer border border-rose-300"
                >
                  Ver a Oficina inteira
                </button>
              </div>
            )}
         </div>
      )}

      {/* OS QUATRO CAMINHOS — o mesmo destino da barra de abas, com o número
          que a barra não consegue mostrar. */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        <Atalho
          icone="jornada"
          titulo="Jornada"
          linha={dominadas > 0 ? `${abertas} abertas · ${dominadas} com coroa` : `${abertas} abertas para jogar`}
          onClick={() => setActiveShellTab("jornada")}
        />
        <Atalho
          icone="dojo"
          titulo="Dojô"
          linha={dojoPrescription ? "O Sensei separou um treino" : "Treino de velocidade"}
          onClick={() => setActiveShellTab("dojo")}
        />
        <Atalho
          icone="oficina"
          titulo="Oficina"
          linha={aulaPlan.resgates.length > 0
            ? `${aulaPlan.resgates.length} para treinar de novo`
            : "Nada para consertar"}
          onClick={() => setActiveShellTab("oficina")}
        />
        <Atalho
          icone="coroa"
          titulo="Conquistas"
          linha={dominadas > 0 ? `${dominadas} ${dominadas === 1 ? "coroa" : "coroas"} até agora` : "Sua primeira coroa vem aí"}
          onClick={() => setActiveShellTab("perfil")}
        />
      </div>
    </div>
  );
}
