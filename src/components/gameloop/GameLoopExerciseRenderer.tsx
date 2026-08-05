import React from "react";
import { AnswerMeta, Question } from "../../types";
import { RapidFire } from "../exercises/RapidFire";
import { SingaporeBars } from "../primitives/SingaporeBars";
import { StoryBarsStage } from "../primitives/StoryBarsStage";
import { TabuadaStage } from "../primitives/TabuadaStage";
import { DecomposicaoStage } from "../primitives/DecomposicaoStage";
import { AncoraStage } from "../primitives/AncoraStage";
import { FamiliaStage } from "../primitives/FamiliaStage";
import { DeslocamentoStage } from "../primitives/DeslocamentoStage";
import { AreaStage } from "../primitives/AreaStage";
import { PareamentoStage } from "../primitives/PareamentoStage";
import { NumberBond } from "../primitives/NumberBond";
import { FichaRenderer } from "../FichaRenderer";
import {
  C, FONT, EmojiRow, BigText, Burst, TenFrame, sfx, speak, BODY,
  TensDots, ShapeSVG, MoneyNote, MoneyCoin, SceneSVG
} from "../Mascot";
import { NumberLine } from "../primitives/NumberLine";
import { InteractiveNumberLine } from "../primitives/InteractiveNumberLine";
import { DragGroup } from "../primitives/DragGroup";
import { VerticalPlaceValueStage } from "../primitives/VerticalPlaceValueStage";
import { VisualAddition } from "../primitives/VisualAddition";
import { ScatteredItems } from "../primitives/ScatteredItems";
import { LinkingCubes } from "../primitives/LinkingCubes";
import { TakeApart } from "../primitives/TakeApart";

import SyllableScene from "../scenes/SyllableScene";
import WeatherScene, { Weather } from "../scenes/WeatherScene";
import GrowthScene from "../scenes/GrowthScene";
import DayPartScene, { DayPart } from "../scenes/DayPartScene";
import EmotionScene, { Emotion } from "../scenes/EmotionScene";
import PersonLifeScene from "../scenes/PersonLifeScene";
import AnimalLifeScene from "../scenes/AnimalLifeScene";
import NestScene from "../scenes/NestScene";
import JourneyScene from "../scenes/JourneyScene";
import PlaceScene, { Place } from "../scenes/PlaceScene";
import { hasAulinha, hasTutorial } from "../../utils/tutorials";
import { shouldRenderQuestionOptions } from "./answerPolicy";

/**
 * Os `kind` cujo palco já é desenhado no topo deste componente.
 *
 * Todos eles também têm um `case` no `FichaRenderer`, então sem esta lista a
 * tela sai duas vezes — a conta, o material e a dica repetidos um embaixo do
 * outro em TODAS as competências do Padrão Ouro. Um teste lê esta constante
 * contra os `case` do FichaRenderer, para que a próxima competência construída
 * não repita o defeito por esquecimento. Ver Padrão Ouro §6.32.
 *
 * O palco de cima é o que vale: é ele que recebe `tutShow`, o fio da micro-aula.
 */
export const PALCOS_JA_DESENHADOS = new Set([
  "story-bars",
  "tabuada",
  "decomposicao",
  "ancora",
  "familia",
  "deslocamento",
  "area",
  "pareamento",
]);

interface Props {
  q: Question;
  status: "right" | "wrong" | null;
  idx: number;
  handlePick: (val: any, forcedRight?: boolean, meta?: AnswerMeta) => void;
  timeLeft: number;
  promptDone: boolean;
  guidedIdx: number | null;
  mockTutorialN: number | null;
  tutShow: any;
  journeyDone: boolean;
  flashHidden: boolean;
  sel: any;
  totalQFor: (t: any) => number;
  track: any;
  aulaSuggest: boolean;
  guidedNarr: string | null;
  playAulinha: (isAuto: boolean) => void;
  setShowClockTutorial: (v: boolean) => void;
  sound: boolean;
  peekAgain: () => void;
  setJourneyDone: (v: boolean) => void;
  orderTaps: any[];
  handleOrderTap: (v: any) => void;
  orderShake: any;
  hiddenOpts: any[];
  armedOpt: any;
  setArmedOpt: (v: any) => void;
}

export function GameLoopExerciseRenderer({
  q, status, idx, handlePick, timeLeft, promptDone,
  guidedIdx, mockTutorialN, tutShow, journeyDone, flashHidden,
  sel, totalQFor, track,
  aulaSuggest, guidedNarr, playAulinha,
  setShowClockTutorial, sound, peekAgain, setJourneyDone, orderTaps,
  handleOrderTap, orderShake, hiddenOpts, armedOpt, setArmedOpt

}: Props) {
  return (
    <>
      <div className="relative">
        {status === "right" && <Burst />}
        {q.kind === "rapid-fire" && <RapidFire q={q} onAnswer={handlePick} disabled={status !== null} timeLeft={timeLeft} />}
        {q.kind === "singapore-bars" && <SingaporeBars q={q} onAnswer={handlePick} disabled={status !== null} />}
        {q.kind === "story-bars" && q.uiProps && <StoryBarsStage spec={q.uiProps as never} />}
        {q.kind === "tabuada" && q.uiProps && <TabuadaStage spec={q.uiProps as never} />}
        {q.kind === "decomposicao" && q.uiProps && <DecomposicaoStage spec={q.uiProps as never} />}
        {q.kind === "ancora" && q.uiProps && <AncoraStage spec={q.uiProps as never} />}
        {q.kind === "familia" && q.uiProps && <FamiliaStage spec={q.uiProps as never} />}
        {/* `tutShow` é o fio que faltava: sem ele, declarar coreografia na ficha
            não produz nada na tela. */}
        {q.kind === "deslocamento" && q.uiProps && <DeslocamentoStage spec={q.uiProps as never} mostrar={typeof tutShow === "object" ? tutShow : null} />}
        {q.kind === "area" && q.uiProps && <AreaStage spec={q.uiProps as never} mostrar={typeof tutShow === "object" ? tutShow : null} />}
        {q.kind === "pareamento" && q.uiProps && (
          <PareamentoStage
            spec={q.uiProps as never}
            onAnswer={(valor, acao) => handlePick(valor, undefined, { source: "pareamento", pareamento: acao } as never)}
            disabled={status !== null}
            mostrar={typeof tutShow === "object" ? tutShow : null}
          />
        )}
        {/* A partir daqui, quem tem `uiProps` cai no FichaRenderer — que também
            sabe desenhar os palcos acima. Sem esta exclusão a tela saía DUAS
            vezes: a conta, o material e a dica repetidos, um embaixo do outro.
            Nenhum teste viu, porque todos renderizam o palco direto e nunca
            passaram por aqui. Ver Padrão Ouro §6.32. */}
        {q.kind !== "rapid-fire" && q.kind !== "singapore-bars" && (
          <>
        {/* Dynamic Canvas Area (escondida no `order`: as próprias peças são a cena) */}
        <div className="mk-pop" style={{ background: C.card, borderRadius: 24, boxShadow: `0 6px 0 ${C.line}`, padding: "20px 14px", ...(q.kind === "order" || q.kind === "groups" ? { display: "none" } : {}) }}>
          {q.uiProps && !PALCOS_JA_DESENHADOS.has(q.kind as string) ? (
            <FichaRenderer key={idx} question={q} onAnswer={handlePick} disabled={status !== null} promptDone={promptDone} />

          ) : (
            <>
              {(q.kind === "count" || q.kind === "emojirow") && (q.emoji || q.uiProps?.emoji) && q.n != null && (
            <div className="flex flex-col items-center gap-3" style={{ opacity: (q.uiProps?.flashDurationMs && flashHidden && status !== "right") ? 0 : 1, transition: "opacity 0.2s" }}>
              <EmojiRow emoji={q.emoji || q.uiProps?.emoji} n={mockTutorialN !== null ? mockTutorialN : q.n} highlightIndex={guidedIdx} />                                        
            </div>
          )}
          {q.kind === "subvis" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {q.emoji && <EmojiRow emoji={q.emoji} n={(q.a || 0) - (q.b || 0)} startIndex={1} highlightIndex={guidedIdx !== null && guidedIdx < ((q.a || 0) - (q.b || 0)) ? guidedIdx : null} />}
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.b || 0} startIndex={(q.a || 0) - (q.b || 0) + 1} crossedOut={true} highlightIndex={guidedIdx !== null && guidedIdx >= ((q.a || 0) - (q.b || 0)) ? guidedIdx - ((q.a || 0) - (q.b || 0)) : null} />}
              </div>
              <div className="mt-2">
                {q.expr && <BigText size={34}>{q.expr}</BigText>}
              </div>
            </div>
          )}
          {q.kind === "sum" && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.a || 0} startIndex={1} highlightIndex={guidedIdx !== null && guidedIdx < (q.a || 0) ? guidedIdx : null} />}
                {q.emoji && <EmojiRow emoji={q.emoji} n={q.b || 0} startIndex={(q.a || 0) + 1} highlightIndex={guidedIdx !== null && guidedIdx >= (q.a || 0) ? guidedIdx - (q.a || 0) : null} state="acerto" />}
              </div>
              <div className="mt-2">
                {q.expr && <BigText size={34}>{q.expr}</BigText>}
              </div>
            </div>
          )}


          {q.kind === "pattern" && q.shown && (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {q.shown.map((e, i) => (
                <div
                  key={i}
                  className="mk-pop"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: C.soft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}
                >
                  <span className="m-auto">{e}</span>
                </div>
              ))}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  border: `3px dashed ${C.grape}`,
                  color: C.grape,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 700,
                }}
              >
                ?
              </div>
            </div>
          )}

          {q.kind === "math" && q.expr && (
            <BigText>{q.expr}</BigText>
          )}

          {q.kind === "plain" && q.big && (
            <BigText>{status === "right" && q.bigCompleted ? q.bigCompleted : q.big}</BigText>
          )}

          {/* ----- SCENES ----- */}
          {q.kind === "grow" && q.n != null && (
            <div className="flex justify-center my-4"><GrowthScene stage={q.n as any} size={180} /></div>
          )}
          {q.kind === "weather" && q.big && (
            <div className="flex justify-center my-4"><WeatherScene type={q.big as any} size={180} /></div>
          )}
          {q.kind === "lifestage" && q.n != null && (
            <div className="flex justify-center my-4"><PersonLifeScene stage={q.n as any} size={180} /></div>
          )}
          {q.kind === "animal" && q.n != null && (
            <div className="flex justify-center my-4"><AnimalLifeScene stage={q.n as any} size={180} /></div>
          )}
          {q.kind === "lugar" && q.big && (
            <div className="flex justify-center my-4"><NestScene kind={q.big as any} size={180} /></div>
          )}
          {q.kind === "daypart" && q.big && (
            <div className="flex justify-center my-4"><DayPartScene type={q.big as any} size={180} /></div>
          )}
          {q.kind === "emotion" && q.big && (
            <div className="flex justify-center my-4"><EmotionScene type={q.big as any} size={180} /></div>
          )}
          {q.kind === "place" && q.big && (
            <div className="flex justify-center my-4"><PlaceScene slot={q.big as any} size={180} /></div>
          )}
          {q.kind === "journey" && (
            <div className="flex justify-center my-4">
              <JourneyScene journey={q.journey || []} sound={sound} onDone={() => {}} />
            </div>
          )}

          {q.kind === "clock" && q.hour != null && q.minute != null && (
            <div className="flex flex-col items-center gap-4 py-2 select-none">
              <div className="relative w-44 h-44 rounded-md border-6 bg-white shadow-lg flex items-center justify-center transition-all" style={{ borderColor: C.line }}>
                {/* Clock rim accent */}
                <div className="absolute inset-2 rounded-md border border-dashed border-slate-200" />
                
                {/* Clock numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, idx) => {
                  const angle = (idx * 30 * Math.PI) / 180;
                  const radius = 62; // radius of clock numbers layout
                  const x = Math.sin(angle) * radius;
                  const y = -Math.cos(angle) * radius;
                  return (
                    <span
                      key={num}
                      className="absolute text-sm font-black text-slate-800"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                        fontFamily: FONT,
                      }}
                    >
                      {num}
                    </span>
                  );
                })}
                
                {/* Clock hands */}
                {/* Hour Hand */}
                <div
                  className="absolute bottom-1/2 left-1/2 w-2 h-11 bg-slate-900 rounded-md origin-bottom"
                  style={{
                    transform: `translate(-50%, 0) rotate(${((q.hour % 12) * 30) + (q.minute * 0.5)}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
                {/* Minute Hand */}
                <div
                  className="absolute bottom-1/2 left-1/2 w-1.5 h-16 bg-indigo-500 rounded-md origin-bottom"
                  style={{
                    transform: `translate(-50%, 0) rotate(${q.minute * 6}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  }}
                />
                
                {/* Center Pin */}
                <div className="absolute w-4.5 h-4.5 bg-red-500 rounded-md border-3 border-white shadow-md z-10" />
              </div>

              {/* Interactive Pedagogical Tutorial Button */}
              {!status && (
                <button
                  onClick={() => {
                    sfx.level();
                    setShowClockTutorial(true);
                    if (sound) {
                      speak("O ponteiro pequeno mostra as horas, e o ponteiro grande mostra os minutos! Se o ponteiro grande estiver no doze, é uma hora exata. Se estiver no seis, é meia hora, ou seja, trinta minutos!");
                    }
                  }}
                  className="mt-2 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-amber-800 font-extrabold text-xs px-4 py-2 rounded-md flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
                  style={{ fontFamily: FONT }}
                >
                  <span>🧭 Como Ler o Relógio? (Aprender Rápido!) 💡</span>
                </button>
              )}
            </div>
          )}

          {q.kind === "tens" && q.t != null && q.u != null && (
            <div className="flex flex-col items-center gap-3">
              <TensDots t={q.t} u={q.u} highlightIndex={guidedIdx} />
              
            </div>
          )}



          {q.kind === "bond" && q.a != null && q.b != null && (
            <NumberBond 
              whole={q.big === "topo" ? '?' : q.a} 
              part1={q.b} 
              part2={q.big === "topo" ? (q.a - q.b) : '?'} 
              interactivePart={q.big === "topo" ? "whole" : "part2"}
            />
          )}

          {q.kind === "numberline" && <NumberLine min={q.nlStart} max={q.nlEnd} targetValue={q.nlTarget} currentValue={typeof tutShow === "number" ? tutShow : (q.nlStartPos ?? null)} onValueClick={status === null ? handlePick : undefined} />}
          {q.kind === "numberline-interactive" && <InteractiveNumberLine q={q} onAnswer={handlePick} disabled={status !== null} />}
          {q.kind === "drag-group" && <DragGroup q={q} onAnswer={handlePick} disabled={status !== null} />}
          {q.kind === "visual-addition" && q.a != null && q.b != null && <VisualAddition a={q.a} b={q.b} emojiA={q.uiProps?.emojiA || q.emoji} emojiB={q.uiProps?.emojiB || q.emoji} showNumbers={q.uiProps?.showNumbers !== false} />}
          {q.kind === "scattered" && q.n != null && (
            <div style={{ opacity: (q.uiProps?.flashDurationMs && flashHidden && status !== "right") ? 0 : 1, transition: "opacity 0.2s" }}>
              <ScatteredItems n={q.n} emoji={q.emoji || q.uiProps?.emoji || "⭐"} ordered={q.uiProps?.ordered} />
            </div>
          )}
          {q.kind === "linking-cubes" && q.groups && <LinkingCubes groups={q.groups.map(g => ({ n: g.n, color: (g as any).color || "bg-blue-400" }))} showNumbers={q.uiProps?.showNumbers} />}
          {q.kind === "take-apart" && q.a != null && q.b != null && q.n != null && <TakeApart total={q.n} knownSplit={{a: q.a, b: q.b}} />}

          {q.kind === "vertical" && (
            <VerticalPlaceValueStage
              question={q}
              onAnswer={handlePick}
              onMistake={(digit, meta) => handlePick(digit, false, meta)}
              disabled={status !== null}
            />
          )}
          {q.kind === "tenframe" && q.n != null && (
            <div style={{ opacity: (q.uiProps?.flashDurationMs && flashHidden && status !== "right") ? 0 : 1, transition: "opacity 0.2s" }}>
              <TenFrame filled={q.n} filled2={q.big === "add" ? q.u ?? null : null} destacarFileira={typeof tutShow === "object" && tutShow?.destacarFileira ? tutShow.destacarFileira : null} flashDurationMs={q.uiProps?.flashDurationMs} state={status === "right" ? "acerto" : status === "wrong" ? "erro-suave" : "ocioso"} />
            </div>
          )}

          {q.kind === "flash" && q.emoji && q.n != null && (
            <div className="flex flex-col items-center justify-center gap-2" style={{ minHeight: 140 }}>
              {(!flashHidden || status === "right") ? (
                <div className="flex flex-wrap items-center justify-center gap-2.5" style={{ maxWidth: 250 }}>
                  {Array.from({ length: q.n }).map((_, i) => (
                    <span key={i} className="mk-pop" style={{ fontSize: 42, animationDelay: `${i * 50}ms` }}>
                      {q.emoji}
                    </span>
                  ))}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 64, lineHeight: 1 }}>{!promptDone ? '🙈' : '🙈'}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: C.sub }}>{!promptDone ? 'Olhos fechados... 👀' : 'Quantos eram? 🤔'}</div>
                  {promptDone && !status && (
                    <button
                      onClick={peekAgain}
                      className="mt-1 select-none cursor-pointer active:translate-y-0.5 transition-all"
                      style={{ fontFamily: FONT, fontWeight: 800, fontSize: 13, color: C.grape, background: "#F1EDFF", border: `2px solid ${C.grape}`, borderRadius: 12, padding: "6px 14px" }}
                    >
                      👀 Ver de novo
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {q.kind === "money" && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(q.notes || []).map((v, i) => (
                <span key={"n" + i} className="mk-drop" style={{ animationDelay: `${i * 90}ms` }}>
                  <MoneyNote v={v} />
                </span>
              ))}
              {(q.coins || []).map((v, i) => (
                <span key={"c" + i} className="mk-drop" style={{ animationDelay: `${((q.notes || []).length + i) * 90}ms` }}>
                  <MoneyCoin v={v} />
                </span>
              ))}
            </div>
          )}

          {q.kind === "picto" && q.rows && (
            <div>
              {q.title && (
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 15, color: C.sub, textAlign: "center", marginBottom: 10 }}>
                  {q.title}
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {q.rows.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 text-left">
                    <span className="text-3xl w-10 text-center">{r.e}</span>
                    <span className="text-slate-200 font-extrabold">│</span>
                    <span className="flex flex-wrap gap-1">
                      {Array.from({ length: r.n }).map((_, j) => (
                        <span key={j} className="mk-drop" style={{ fontSize: 22, animationDelay: `${i * 120 + j * 60}ms` }}>
                          {r.e}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q.kind === "story" && q.story && (
            <div>
              <div className="text-center text-4xl mb-2">{q.emoji}</div>
              {/* a própria frase é tocável: reouvir o enunciado no idioma certo, quantas vezes quiser */}
              <div
                role="button"
                onClick={() => {
                  if (sound && !status) speak(q.story! + (q.sayTarget ? " ... " + q.sayTarget : ""), q.lang ? { lang: q.lang } : {});
                }}
                className="px-1 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ fontFamily: BODY, fontWeight: 800, fontSize: 17, color: C.ink, textAlign: "center", lineHeight: 1.5 }}
              >
                🔊 {q.story}
              </div>
              <div style={{ color: C.sub, fontWeight: 700, fontSize: 11, textAlign: "center", marginTop: 10 }}>
                👂 Toque na frase para ouvir de novo, quantas vezes quiser!
              </div>
            </div>
          )}

          </>
          )}

        </div>
        </>
        )}
      </div>

      {q.kind !== "rapid-fire" && q.kind !== "singapore-bars" && (
        <>
      {/* AULINHA 🎬 re-oferecida pelo algoritmo: 2 erros seguidos → convite gentil */}
      {aulaSuggest && !status && hasAulinha(q) && guidedIdx === null && guidedNarr === null && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => playAulinha(false)}
            className="animate-bounce select-none cursor-pointer active:translate-y-0.5 transition-all flex items-center gap-2"
            style={{
              fontFamily: FONT, fontWeight: 900, fontSize: 14, color: "#fff",
              background: C.grape, border: "none", borderRadius: 14,
              padding: "10px 18px", boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
            }}
          >
            💡 Tá difícil? Vem ver a aulinha! 👉
          </button>
        </div>
      )}

      {/* Tutorial guiado 👉 (generalizado): a mãozinha do Contar, para as cenas novas */}
      {hasTutorial(q) && q.kind !== "vertical" && !status && (
        guidedNarr !== null ? (
          <div
            className="mt-3 mx-auto p-3 rounded-2xl text-center mk-optin"
            style={{ maxWidth: 330, background: "#EEF2FF", border: `2px solid ${C.grape}`, fontFamily: BODY, fontWeight: 800, fontSize: 14, color: C.ink, lineHeight: 1.4 }}
          >
            💡 {guidedNarr}
          </div>
        ) : (
          <div className="flex justify-center mt-2">
            <button
              onClick={() => playAulinha(false)}
              className="min-h-20 bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-700 font-extrabold text-sm px-5 py-3 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
              style={{ fontFamily: FONT }}
            >
              <span>👉 Como faz? 🫵</span>
            </button>
          </div>
        )
      )}

      {/* Answer Button Grid Options */}
      <div className="mt-5">
        {(q.kind === "flash" || q.uiProps?.flashDurationMs) && (!flashHidden && status !== "right") ? (
          // durante o relance: sem números na tela, só o convite a OLHAR
          <div className="text-center py-4" // O roxo-uva da marca dá 4.35:1 neste tamanho — um fio abaixo do mínimo
              // de 4.5:1. Um passo mais escuro passa sem mudar a identidade.
              style={{ fontFamily: FONT, fontWeight: 800, fontSize: 15, color: "#5B3FD9" }}>
            👀 Olhe rápido...
          </div>
        ) : q.kind === "order" ? (
          <div className="grid grid-cols-2 gap-3">
            {q.options && q.options.map((o, i) => {
              const pos = orderTaps.indexOf(o.value);
              const done = pos >= 0;
              const big = q.big as string;
              const val: any = o.value;
              const scene =
                big === "lifestage" ? <PersonLifeScene stage={val} size={140} /> :
                big === "grow" ? <GrowthScene stage={val} size={140} /> :
                big === "daypart" ? <DayPartScene type={val} size={140} /> :
                big === "weather" ? <WeatherScene type={val} size={140} /> :
                big === "animal" ? <AnimalLifeScene stage={val} size={140} /> :
                big === "lugar" ? <NestScene kind={val} size={140} /> :
                // sem cena mapeada: mostra o próprio rótulo grande
                <span className="flex items-center justify-center text-center px-2" style={{ minHeight: 90, fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.ink }}>{o.label}</span>;
              return (
                <button
                  key={i}
                  data-ov={String(o.value)}
                  onClick={() => handleOrderTap(o.value)}
                  disabled={!!status}
                  className={`relative select-none cursor-pointer rounded-2xl overflow-hidden transition-all active:translate-y-1 ${orderShake === o.value ? "mk-shake" : ""}`}
                  style={{ border: `3px solid ${done ? C.mint : C.line}`, boxShadow: `0 5px 0 ${done ? C.mintDark : C.line}`, background: C.card, opacity: done ? 0.65 : 1 }}
                >
                  {scene}
                  {done && (
                    <span className="absolute top-1.5 left-1.5 w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-lg" style={{ background: C.mint, fontFamily: FONT }}>
                      {pos + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : q.kind === "groups" && q.groups ? (
          <div className="grid grid-cols-2 gap-4">
            {q.groups.map((gr, i) => {
              const isAns = i === q.answer;
              const picked = sel === i;
              let bg = C.card;
              let borderCol = C.line;

              if (status) {
                if (isAns) {
                  bg = "#E9FBF0";
                  borderCol = C.mint;
                } else if (picked) {
                  bg = "#FFEDED";
                  borderCol = C.melon;
                }
              }

              const isHidden = hiddenOpts.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isHidden) return;
                    handlePick(i);
                  }}
                  disabled={!!status || isHidden}
                  className={`mk-optin select-none cursor-pointer border-3 card-block p-4 transition-all active:translate-y-1 ${
                    picked && status === "wrong" ? "mk-shake" : ""
                  } ${isHidden ? "opacity-0 pointer-events-none" : ""}`}
                  style={{
                    background: bg,
                    borderColor: borderCol,
                    boxShadow: `0 6px 0 ${C.line}`,
                    minHeight: 120,
                  }}
                >
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: gr.n }).map((_, j) => (
                      <span key={j} className="text-3xl">
                        {gr.emoji}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <>
          {shouldRenderQuestionOptions(q) && q.options && (<div className={`gap-3.5 ${(q.kind === "take-apart" || q.kind === "sequence" || q.options.some(o => !!o.groups)) ? "flex flex-col" : "grid grid-cols-2"}`}>
            {q.options.map((o, i) => {
              const isAnswer = o.value === q.answer;
              const picked = sel === o.value;
              let bg = C.card;
              let fg = C.ink;
              let shadow = C.line;

              if (status) {
                if (isAnswer) {
                  bg = C.mint;
                  fg = "#fff";
                  shadow = C.mintDark;
                } else if (picked) {
                  bg = C.melon;
                  fg = "#fff";
                  shadow = C.melonDark;
                } else {
                  fg = C.sub;
                }
              }

              const armed = q.audibleOptions && armedOpt === o.value;
              const isHidden = hiddenOpts.includes(o.value);
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (status || isHidden) return;
                    if (q.audibleOptions) {
                      speak(String(o.say ?? o.label).toLowerCase(), q.lang ? { lang: q.lang } : {});
                    }
                    handlePick(o.value);
                  }}
                  disabled={!!status || isHidden}
                  className={`mk-optin select-none cursor-pointer py-4 px-2 border-none transition-all active:translate-y-1 rounded-2xl text-center flex flex-col items-center justify-center relative ${
                    picked && status === "wrong" ? "mk-shake" : ""
                  } ${isHidden ? "opacity-0 pointer-events-none" : ""}`}
                  style={{
                    animationDelay: `${i * 70}ms`,
                    fontFamily: FONT,
                    fontWeight: 700,
                    background: bg,
                    color: fg,
                    boxShadow: armed ? `0 5px 0 #D97706, 0 0 0 4px #FBBF24` : `0 5px 0 ${shadow}`,
                    minHeight: 74,
                  }}
                >
                  {/* Opção audível: o BOTÃO INTEIRO é o alto-falante (toque duplo).
                      O 🔊 é só um selo indicativo — não é mais alvo de toque. */}
                  {q.audibleOptions && !status && (
                    <span className="absolute top-1 right-1.5 text-sm" style={{ pointerEvents: "none", opacity: armed ? 1 : 0.55 }}>
                      {armed ? "👂" : "🔊"}
                    </span>
                  )}
                  {o.groups ? (
                    <div className="flex flex-col items-center gap-2 px-2 py-1">
                      {o.label && <span className="text-xl font-black">{o.label}</span>}
                      <div className="scale-[0.6] sm:scale-75 origin-center">
                        <LinkingCubes groups={o.groups.map(g => ({n: g.n, color: g.color || "bg-blue-400"}))} numberAbove showPlus />
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: String(o.label).length > 2 ? 24 : 34 }}>
                      {o.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>)}
          {q.audibleOptions && !status && (
            <div className="text-center mt-2" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 11.5, color: C.sub }}>
              👂 Toque para OUVIR · toque de novo para escolher
            </div>
          )}
          </>
        )}
      </div>
      </>
      )}
    </>
  );
}
