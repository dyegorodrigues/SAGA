import React, { useState, useEffect, useRef } from "react";
import { AnswerMeta, Kid, Track, Question, Progress, JardimTrackState } from "../types";
import { applyJourneyAnswer } from "../curriculum/motores/progressEngine";
import { applyJardimRound, type JardimAttempt, type JardimRoundResult } from "../curriculum/motores/jardimEngine";
import { tentativaJardimDoTerminal, type JardimMissionSummary } from "../curriculum/motores/jardimSession";
import { auth, logTelemetryToCloud } from "../lib/firebase";
import { missionCoins, perfectMissionXpBonus, rewardForTerminalAnswer } from "../lib/rewardPolicy";
import { fisherYates } from "../utils/shuffle";
import {
  C, FONT, BODY, Mascote, StarChip, ProgressBar, SoundBtn, Burst, sfx, speak, stopSpeak, pickVoice, applyTheme, pickPraise, PRAISE, OOPS, THEMES,
} from "./Mascot";
import { hasTutorial, tutorialSteps, hasAulinha, aulaSeen, markAulaSeen } from "../utils/tutorials";
import { GameLoopExerciseRenderer } from "./gameloop/GameLoopExerciseRenderer";
import { QuestionPrompt } from "./gameloop/QuestionPrompt";
import {
  authorialFeedbackHoldMs,
  evidenciasDaResposta,
  isMotorSlip,
  isRetryableAnswer,
  misconceptionForAnswer,
  ownsAuthorialFeedback,
  ownsAuthorialRetry,
} from "./gameloop/answerPolicy";
import {
  createQuestionDiagnostics,
  recordQuestionAttempt,
  summarizeQuestionDiagnostics,
} from "./gameloop/questionDiagnostics";

interface GameProps {
  kid: Kid;
  track: Track;
  prog0: Progress;
  sound: boolean;
  onToggleSound: () => void;
  onCommit: (p: Progress, right: boolean, stars: number, ms: number, missionDone?: boolean) => void;
  firstMissionToday?: boolean;
  onExit: () => void;
  onAlbum: () => void;
  stage: number;
  exactLvl?: boolean;
  rescue?: { requiredLevel: number; questionBudget: number };
  progressionMode?: "journey" | "garden";
  gardenState?: JardimTrackState;
  onGardenRound?: (result: JardimRoundResult, summary: JardimMissionSummary) => void;
}

const TOTAL_Q = 8;
const totalQFor = (track: Track) => (track as any).totalQ || TOTAL_Q;

const qSig = (q: Question) =>
  [
    q.kind,
    q.prompt,
    q.answer,
    q.expr || q.big || "",
    q.a ?? "",
    q.b ?? "",
    q.n ?? "",
    q.t ?? "",
    q.u ?? "",
    q.story || "",
    (q.coins || []).join("."),
    (q.notes || []).join("."),
    (q.rows || []).map((r) => r.e + r.n).join("."),
    (q.items || []).map((i) => i.e + i.pos).join("."),
  ].join("|");

const qSpeech = (q: Question, withHowto = true) => {
  const base = q.kind === "story" ? q.story || "" : q.prompt + (q.kind === "math" ? " ... " + q.expr : "");
  const alvo = q.sayTarget ? " ... " + q.sayTarget : "";
  return base + alvo + (withHowto && q.howto ? " ... " + q.howto : "");
};

function sanitizeQ(q: Question) {
  const { review, sig, ...rest } = q;
  return JSON.parse(JSON.stringify(rest));
}

const NUM_PT = [
  "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez",
  "Onze", "Doze", "Treze", "Catorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove", "Vinte",
];
const numPt = (n: number) => NUM_PT[n - 1] || String(n);

function drawQuestion(track: Track, p: Progress, lvlOverride?: number, pure = false) {
  const bank = p.bank || [];
  if (!pure && bank.length && Math.random() < 0.35) {
    const item = bank[Math.floor(Math.random() * bank.length)];
    const q = JSON.parse(JSON.stringify(item.q));
    if (q.kind !== "groups" && Array.isArray(q.options)) {
      q.options = fisherYates(q.options);
    }
    return { ...q, review: true, sig: item.sig };
  }
  return track.gen(lvlOverride ?? p.lvl);
}

const WARMUP_QUESTIONS = 2;
const warmupLvl = (lvl: number) => Math.max(1, lvl - 1);

import { evaluateSpacedRepetition, trackMisconception } from "../curriculum/motores/radarEngine";

export function GameLoop({
  kid,
  track,
  prog0,
  sound,
  onToggleSound,
  onCommit,
  onExit,
  onAlbum,
  stage,
  firstMissionToday = false,
  exactLvl = false,
  rescue,
  progressionMode = "journey",
  gardenState,
  onGardenRound,
}: GameProps) {
  const gardenMode = progressionMode === "garden";
  const [idx, setIdx] = useState(0);
  const [t0, setT0] = useState(() => Date.now());
  const [prog, setProg] = useState<Progress>(() => ({ ...prog0 }));
  const [q, setQ] = useState<Question>(() => drawQuestion(
    track,
    prog0,
    (gardenMode || exactLvl) ? prog0.lvl : warmupLvl(prog0.lvl),
    gardenMode || exactLvl,
  ));
  const [status, setStatus] = useState<"right" | "wrong" | null>(null);
  const [sel, setSel] = useState<any>(null);
  const [stars, setStars] = useState(0);
  const [ok, setOk] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimeout, setIsTimeout] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [replays, setReplays] = useState(0);
  const firstMissionRewardRef = useRef(firstMissionToday);
  const advanceRef = useRef<null | (() => void)>(null);
  const lastSpokenPromptRef = useRef<string | null>(null);
  const lastSpokenKindRef = useRef<string | null>(null);

  const advanceNow = () => {
    if (!advanceRef.current) return;
    stopSpeak();
    const go = advanceRef.current;
    advanceRef.current = null;
    go();
  };

  useEffect(() => () => stopSpeak(), []);

  const [guidedIdx, setGuidedIdx] = useState<number | null>(null);
  const [mockTutorialN, setMockTutorialN] = useState<number | null>(null);
  useEffect(() => { if (guidedIdx === null) setMockTutorialN(null); }, [guidedIdx]);
  const [qErrors, setQErrors] = useState(0);
  const [hiddenOpts, setHiddenOpts] = useState<any[]>([]);
  const [showClockTutorial, setShowClockTutorial] = useState(false);
  const [orderTaps, setOrderTaps] = useState<any[]>([]);
  const [orderShake, setOrderShake] = useState<any>(null);
  const [flashHidden, setFlashHidden] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const helpUsedRef = useRef(false);
  const [guidedNarr, setGuidedNarr] = useState<string | null>(null);
  const [tutShow, setTutShow] = useState<Record<string, any> | string | number | null>(null);
  const [journeyDone, setJourneyDone] = useState(false);
  const [armedOpt, setArmedOpt] = useState<any>(null);
  const [aulaSuggest, setAulaSuggest] = useState(false);
  const wrongStreakRef = useRef(0);
  const aulaEndRef = useRef<null | (() => void)>(null);
  const qRef = useRef<Question>(q);
  const questionDiagnosticsRef = useRef(createQuestionDiagnostics());
  const gardenAttemptsRef = useRef<JardimAttempt[]>([]);
  const gardenDurationRef = useRef(0);

  useEffect(() => {
    if (!gardenMode && q.rt_max_s && !status && !done && (q.kind !== 'journey' || journeyDone)) {
      setTimeLeft(q.rt_max_s);
      const iv = setInterval(() => {
        setTimeLeft((v) => {
          if (v && v > 1) return v - 1;
          clearInterval(iv);
          return 0;
        });
      }, 1000);
      return () => clearInterval(iv);
    } else setTimeLeft(null);
  }, [q, status, done, journeyDone, gardenMode]);

  qRef.current = q;
  const aulaTimersRef = useRef<{ t: number[]; i: number[] }>({ t: [], i: [] });
  const aulaT = (f: () => void, ms: number) => { aulaTimersRef.current.t.push(window.setTimeout(f, ms)); };
  const aulaI = (f: () => void, ms: number) => { const id = window.setInterval(f, ms); aulaTimersRef.current.i.push(id); return id; };
  const stopAulaTimers = () => {
    aulaTimersRef.current.t.forEach((id) => clearTimeout(id));
    aulaTimersRef.current.i.forEach((id) => clearInterval(id));
    aulaTimersRef.current = { t: [], i: [] };
  };
  const [autoAula, setAutoAula] = useState(() => hasAulinha(q) && !aulaSeen(kid.id, q.kind));
  const [promptDone, setPromptDone] = useState(!sound);
  const [audioChoicePromptVisible, setAudioChoicePromptVisible] = useState(false);

  useEffect(() => {
    setAutoAula(idx === 0 ? (hasAulinha(q) && !aulaSeen(kid.id, q.kind)) : false);
    setPromptDone(!sound);
  }, [q, idx, kid.id]);
  useEffect(() => { applyTheme(kid.theme); pickVoice(); }, [kid.theme]);

  useEffect(() => {
    setOrderTaps([]); setOrderShake(null); setGuidedNarr(null); setTutShow(null); setJourneyDone(false);
    setAudioChoicePromptVisible(false); stopAulaTimers(); setGuidedIdx(null); setQErrors(0); setHiddenOpts([]);
    helpUsedRef.current = false; answeredRef.current = false; questionDiagnosticsRef.current = createQuestionDiagnostics(); setArmedOpt(null);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const startGuidedTutorial = (isAuto: boolean = true) => {
    if (guidedNarr !== null || status) return;
    const steps = tutorialSteps(q);
    if (!steps.length) { fireAulaEnd(); return; }
    sfx.level(); const q0 = qRef.current; let i = 0;
    const play = () => {
      if (qRef.current !== q0) return;
      if (i >= steps.length) { setGuidedNarr(null); setTutShow(null); fireAulaEnd(); return; }
      const st = steps[i++]; setGuidedNarr(st.say); setTutShow(st.show ?? null);
      if (sound) speak(st.say, { ...(q.lang ? { lang: q.lang } : {}), onEnd: () => aulaT(play, 550) });
      else aulaT(play, st.ms ?? Math.max(2000, st.say.length * 65));
    };
    play();
  };

  const fireAulaEnd = () => { const f = aulaEndRef.current; aulaEndRef.current = null; if (f) f(); };
  const playAulinha = (isAuto: boolean = false) => {
    if (status) return;
    helpUsedRef.current = true; setAulaSuggest(false); markAulaSeen(kid.id, q.kind);
    if (q.kind === "count") startGuidedCount(isAuto);
    else if (q.kind === "sum") startGuidedSum(isAuto);
    else if (q.kind === "subvis") startGuidedSubvis(isAuto);
    else if (q.kind === "tens") startGuidedTens(isAuto);
    else startGuidedTutorial(isAuto);
  };

  useEffect(() => {
    if (!autoAula) return;
    const t = setTimeout(() => {
      const q0 = qRef.current;
      aulaEndRef.current = () => {
        if (sound && qRef.current === q0 && !advanceRef.current) {
          setTimeout(() => {
            let timer: any = setTimeout(() => setPromptDone(true), 2500);
            speak(qSpeech(q0, true), { ...(q0.lang ? { lang: q0.lang } : {}), onEnd: () => { if (timer) clearTimeout(timer); setPromptDone(true); } });
            lastSpokenPromptRef.current = q0.prompt; lastSpokenKindRef.current = q0.kind;
          }, 350);
        } else setPromptDone(true);
      };
      playAulinha(true);
    }, 800);
    return () => clearTimeout(t);
  }, [autoAula]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try { if (typeof window !== "undefined" && window.location.search.includes("e2e=1")) { (window as any).__q = q; (window as any).__idx = idx; } } catch (e) {}
  }, [q]);

  const peekMs = q.uiProps?.flashDurationMs || ((q.n ?? 0) <= 3 ? 2000 : (q.n ?? 0) <= 5 ? 1700 : 1400);
  useEffect(() => {
    if (q.kind !== "flash" && !q.uiProps?.flashDurationMs) return;
    setHintsUsed(0); setFlashHidden(false); const t = setTimeout(() => setFlashHidden(true), peekMs); return () => clearTimeout(t);
  }, [q, idx, peekMs]);
  const peekAgain = () => {
    if (status) return; helpUsedRef.current = true; if (sound) sfx.tick(); setHintsUsed(h => h + 1); setFlashHidden(false); setTimeout(() => setFlashHidden(true), 1200);
  };
  const handleOrderTap = (value: any) => {
    if (status) return;
    const seq = q.answer as any[], expected = seq[orderTaps.length];
    if (value === expected) {
      const nt = [...orderTaps, value]; setOrderTaps(nt); if (sound) sfx.tick(); if (nt.length === seq.length) handlePick(value, true);
    } else {
      setOrderShake(value); if (sound) sfx.wrong(); setTimeout(() => { setOrderTaps([]); setOrderShake(null); }, 450);
    }
  };

  useEffect(() => {
    if (sound && !done && !status && q.kind !== "journey" && q.kind !== "audiochoice" && !autoAula) {
      const isFirstQ = idx === 0, isNewKind = lastSpokenKindRef.current !== q.kind, isNewPrompt = lastSpokenPromptRef.current !== q.prompt;
      if (isFirstQ || isNewKind || isNewPrompt) {
        lastSpokenPromptRef.current = q.prompt; lastSpokenKindRef.current = q.kind;
        let timer: any = null; timer = setTimeout(() => { setPromptDone(true); }, 2500);
        speak(qSpeech(q, isFirstQ), { ...(q.lang ? { lang: q.lang } : {}), onEnd: () => { if (timer) clearTimeout(timer); setPromptDone(true); } });
      } else { lastSpokenKindRef.current = q.kind; setPromptDone(true); }
    } else if (!sound) setPromptDone(true);
  }, [q, idx, sound, done, status, autoAula]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (journeyDone && sound && !status) speak(q.prompt); }, [journeyDone]); // eslint-disable-line react-hooks/exhaustive-deps

  const completionRewardMode = track.id === "mista" || track.id === "mixed" ? "mixed" : gardenMode ? "garden" : "journey";
  const firstMissionReward = firstMissionRewardRef.current && replays === 0;
  const coinsEarned = track.contentStatus === "fallback" ? 0 : missionCoins(ok, completionRewardMode, firstMissionReward);
  useEffect(() => { if (sound && done) { sfx.fanfare(); speak(`Parabéns! Missão completa! Você ganhou ${stars} estrelas e ${coinsEarned} moedinhas!`); } }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const answeredRef = useRef(false);
  const handlePick = (val: any, forcedRight?: boolean, answerMeta?: AnswerMeta) => {
    if (val === "__timeout__") setIsTimeout(true);
    if (status || answeredRef.current) return;
    const right = forcedRight !== undefined ? forcedRight : val === q.answer;
    if (!right && isMotorSlip(answerMeta)) {
      speak("Quase! Põe de novo com calma."); setToast("Quase! Tenta de novo 🖐️"); setTimeout(() => setToast(null), 2000); return;
    }
    const attemptMisconception = misconceptionForAnswer(q, val, answerMeta);
    recordQuestionAttempt(questionDiagnosticsRef.current, right, attemptMisconception);
    const feedbackAutoral = ownsAuthorialFeedback(q, answerMeta);
    if (!right && ownsAuthorialRetry(q, answerMeta)) return;
    if (!right && isRetryableAnswer(q, val, answerMeta)) {
      if (qErrors === 0) {
        setQErrors(1); setHiddenOpts(prev => [...prev, val]); if (sound) sfx.wrong(); speak("Ops, não é esse. Olha de novo!"); setToast("Olha de novo! 👀"); setTimeout(() => setToast(null), 2500); return;
      }
      if (qErrors === 1) {
        setQErrors(2); setHiddenOpts(prev => [...prev, val]); if (sound) sfx.wrong(); const dica = q.explain || "Tente com cuidado!"; speak("Quase! " + dica); setToast("Dica: " + dica); setTimeout(() => setToast(null), 4000); return;
      }
    }
    answeredRef.current = true;
    const durationMs = Math.min(30000, Math.max(0, Date.now() - t0));
    const targetRtSeconds = q.rt_max_s ?? track.rt_max_s;
    const diagnostics = summarizeQuestionDiagnostics(questionDiagnosticsRef.current, right);
    let p: Progress; let currentToast: string | null = null;

    if (gardenMode) {
      if (!gardenState || !onGardenRound) throw new Error(`Sessao do Jardim ${track.id} sem gardenState/onGardenRound.`);
      const targetRtMs = targetRtSeconds !== undefined ? targetRtSeconds * 1000 : NaN;
      if (!Number.isFinite(targetRtMs) || targetRtMs <= 0) throw new Error(`Questao ${track.id} sem rt_alvo valido no Jardim.`);
      gardenAttemptsRef.current.push(tentativaJardimDoTerminal({ terminalRight: right, attemptCount: diagnostics.attemptCount, durationMs, targetRtMs, misconceptionTags: diagnostics.misconceptionTags }));
      gardenDurationRef.current += durationMs;
      p = { ...prog, lvl: gardenState.currentStep, maxLvl: gardenState.highestStep, streak: 0, bad: 0, bank: [] };
    } else {
      const progressResult = applyJourneyAnswer(prog, right, idx < WARMUP_QUESTIONS, {
        durationMs,
        targetRtMs: targetRtSeconds !== undefined ? targetRtSeconds * 1000 : undefined,
        helpUsed: helpUsedRef.current,
        evidencias: right ? evidenciasDaResposta(answerMeta) : undefined,
        exigeEvidencia: q.exigeEvidencia,
        gateEvidenceBeforeAdvance: q.gateEvidenceBeforeAdvance,
        masteryRule: q.masteryRule,
        isReview: q.review === true,
        practiceDay: new Date().toISOString().slice(0, 10),
        previousPracticeDay: prog.lastDay,
      }, rescue ? { kind: "rescue", requiredLevel: rescue.requiredLevel } : undefined);
      p = progressResult.progress;
      diagnostics.misconceptionTags.forEach(tag => trackMisconception(p, tag));
      currentToast = progressResult.transition?.type === "level-up" ? `Subiu para o nível ${progressResult.transition.level}! 🚀`
        : progressResult.transition?.type === "level-down" ? "Vamos voltar um passinho para treinar! 💪"
        : progressResult.transition?.type === "multidimensional-crown" ? "DOMÍNIO ABSOLUTO! 👑✨" : null;
    }

    if (right) { wrongStreakRef.current = 0; setAulaSuggest(false); }
    else { wrongStreakRef.current++; if (wrongStreakRef.current >= 2 && hasAulinha(q)) setAulaSuggest(true); }

    if (!gardenMode) {
      if (q.review) {
        const bi = p.bank.findIndex(b => b.sig === q.sig);
        if (bi >= 0) {
          if (right) {
            const hits = (p.bank[bi].hits || 0) + 1;
            if (hits >= 2) { p.bank.splice(bi, 1); p.mast = (p.mast || 0) + 1; if (!currentToast) currentToast = "Você dominou essa! 🧠✨"; }
            else p.bank[bi] = { ...p.bank[bi], hits };
          } else p.bank[bi] = { ...p.bank[bi], hits: 0 };
        }
      } else if (!right) {
        const sig = qSig(q); if (!p.bank.some(b => b.sig === sig)) { p.bank.push({ sig, hits: 0, q: sanitizeQ(q) }); if (p.bank.length > 10) p.bank.shift(); }
      }
      if (q.review) evaluateSpacedRepetition(kid.id, track.id, right, durationMs, { [track.id]: p }, targetRtSeconds !== undefined ? targetRtSeconds * 1000 : 10000);
    }

    const rewardMode = gardenMode ? "garden" : track.id === "mista" || track.id === "mixed" ? "mixed" : (q.kind === "rapid-fire" || track.id.startsWith("dojo")) ? "dojo" : rescue ? "rescue" : track.id === "matricula" ? "placement" : "journey";
    const starGain = q.isFallback ? 0 : rewardForTerminalAnswer(right, rewardMode).xp;
    if (right && !gardenMode && (q.kind === "rapid-fire" || track.id.startsWith("dojo")) && durationMs > 10000) trackMisconception(p, "LENTO_DEDOS");
    const nextStars = stars + starGain, nextOk = ok + (right ? 1 : 0);
    const rescueRecovered = !gardenMode && !!rescue && (p.lvl >= rescue.requiredLevel || (rescue.requiredLevel === 5 && prog0.lvl === 5 && p.streak >= 2));
    const isLast = idx === totalQFor(track) - 1 || rescueRecovered;
    const rewardEligible = !q.isFallback && track.contentStatus !== "fallback";
    const nextBonus = isLast && rewardEligible ? perfectMissionXpBonus(nextOk, totalQFor(track)) : 0;
    p.stars = (p.stars || 0) + starGain + nextBonus;
    if (!gardenMode) { p.lastDay = new Date().toISOString().slice(0, 10); p.rt = Math.round(p.rt ? p.rt * 0.7 + durationMs * 0.3 : durationMs); }

    try {
      const qPromptText = q.kind === "story" ? String(q.story) : String(q.prompt || "") + (q.kind === "math" ? " " + String(q.expr) : "");
      logTelemetryToCloud({
        kidId: kid.id, timestamp: Date.now(), trackId: track.id, qIndex: idx, qPrompt: qPromptText.substring(0, 200), expectedAnswer: String(q.answer), givenAnswer: String(val), reactionTimeMs: durationMs, isCorrect: right,
        attemptCount: diagnostics.attemptCount, recoveredAfterError: diagnostics.recoveredAfterError, misconceptionTags: diagnostics.misconceptionTags, tutState: tutShow !== null ? "guided" : "hide", hintsUsed
      });
    } catch(e) { console.warn("Failed to dispatch telemetry", e); }

    if (isLast && rescue) p.rescueAttempts = rescueRecovered ? 0 : (p.rescueAttempts || 0) + 1;
    if (gardenMode && isLast) {
      if (!gardenState || !onGardenRound) throw new Error(`Sessao do Jardim ${track.id} terminou sem callback.`);
      const result = applyJardimRound(gardenState, gardenAttemptsRef.current, new Date().toISOString().slice(0, 10));
      onGardenRound(result, { rewardedCorrect: nextOk, measuredCorrect: gardenAttemptsRef.current.filter(a => a.right).length, total: gardenAttemptsRef.current.length, stars: nextStars + nextBonus, durationMs: gardenDurationRef.current });
    } else if (!gardenMode && !q.isFallback) onCommit(p, right, starGain + nextBonus, durationMs, isLast);

    if (sound && !feedbackAutoral) { if (right) sfx.right(); else sfx.wrong(); if (currentToast && currentToast.startsWith("Subiu")) sfx.level(); }
    const activeTheme = THEMES[kid.theme] || THEMES.classico, praises = activeTheme.praise || PRAISE;
    const SHORT_OK = ["Isso! 🎉", "Muito bem! ⭐", "Boa! 👏", "Acertou! 🌟", "Perfeito! ✨"];
    const firstOkOfMission = right && ok === 0;
    const baseFb = feedbackAutoral ? "" : right ? (firstOkOfMission ? praises[Math.floor(Math.random() * praises.length)] : SHORT_OK[Math.floor(Math.random() * SHORT_OK.length)]) : OOPS[Math.floor(Math.random() * OOPS.length)];
    const showExplain = !feedbackAutoral && !!q.explain && !right, fb = showExplain ? `${baseFb} ${q.explain}` : baseFb;
    setProg(p); setStatus(right ? "right" : "wrong"); setSel(val); setToast(currentToast); setMsg(feedbackAutoral ? null : fb); setOk(nextOk); setStars(nextStars);

    let transitioned = false;
    const doTransition = () => {
      if (transitioned) return; transitioned = true; advanceRef.current = null; setGuidedIdx(null);
      if (isLast) { setDone(true); setStars(nextStars + nextBonus); setBonus(nextBonus); setToast(null); }
      else {
        const nextIdx = idx + 1; setIdx(nextIdx); setT0(Date.now());
        const nextLevel = gardenMode ? (gardenState?.currentStep ?? p.lvl) : exactLvl ? p.lvl : nextIdx < WARMUP_QUESTIONS ? warmupLvl(p.lvl) : p.lvl;
        setQ(drawQuestion(track, p, nextLevel, gardenMode || exactLvl)); setStatus(null); setSel(null); setIsTimeout(false); setToast(null); setMsg(null);
      }
    };
    advanceRef.current = doTransition;
    if (sound && !feedbackAutoral) {
      speak(fb, { pitch: right ? 1.3 : 1.05 });
      if (val !== "__timeout__") setTimeout(() => { if (advanceRef.current === doTransition) doTransition(); }, 10000);
    } else if (val !== "__timeout__") {
      const espera = feedbackAutoral ? authorialFeedbackHoldMs(q, answerMeta) : 10000;
      setTimeout(() => { if (advanceRef.current === doTransition) doTransition(); }, espera);
    }
  };

  const runCountAula = (total: number, intro: string, finale: string, isAuto: boolean, isMock: boolean = false) => {
    if (guidedIdx !== null || total <= 0) return;
    sfx.level(); const q0 = qRef.current; setGuidedIdx(0); let current = 0;
    const shouldScaffold = !isAuto && total > 2 && !isMock, limit = (shouldScaffold && !isMock) ? 2 : total;
    speak(`${intro} ... Um!`, { onEnd: () => {
      if (qRef.current !== q0) return;
      const id = aulaI(() => {
        current++;
        if (current < limit) { setGuidedIdx(current); speak(numPt(current + 1) + "!"); sfx.tick(); }
        else { clearInterval(id); setGuidedIdx(null); if (shouldScaffold) aulaT(() => speak("Agora continue você!", { onEnd: fireAulaEnd }), 400); else aulaT(() => speak(finale, { onEnd: fireAulaEnd }), 700); }
      }, 1150);
    }});
  };
  const startGuidedCount = (isAuto: boolean = true) => {
    const realN = q.n || 3, mockN = realN === 3 ? 4 : 3; setMockTutorialN(mockN);
    runCountAula(mockN, "Veja como a gente conta! Aponte um por um:", `... então são ${numPt(mockN).toLowerCase()}! O último número é o total! Agora é sua vez!`, isAuto, true);
  };
  const startGuidedSum = (isAuto: boolean = true) => { const total = (q.a || 0) + (q.b || 0); runCountAula(total, "Somar é JUNTAR os dois grupos! Vamos contar tudo, um por um:", `${q.a} mais ${q.b}... contamos tudo junto: ${total}! 🎉`, isAuto); };
  const startGuidedSubvis = (isAuto: boolean = true) => { const remains = (q.a || 0) - (q.b || 0); runCountAula(remains, "Tirar é ver o que SOBRA! Os riscados foram embora. Vamos contar só o que ficou:", `Tiramos ${q.b} e sobraram ${remains}! 🎉`, isAuto); };
  const startGuidedTens = (isAuto: boolean = true) => {
    if (guidedIdx !== null) return; sfx.level(); const q0 = qRef.current; setGuidedIdx(0); const numTens = q.t || 0, numUnits = q.u || 0;
    speak(`Aqui temos ${numTens} ${numTens > 1 ? "dezenas" : "dezena"}, que vale ${numTens * 10}!`, { onEnd: () => {
      if (qRef.current !== q0) return; aulaT(() => { setGuidedIdx(1); speak(`E mais ${numUnits} ${numUnits !== 1 ? "unidades" : "unidade"}.`, { onEnd: () => {
        if (qRef.current !== q0) return; aulaT(() => { setGuidedIdx(null); speak(`Tudo junto forma o número ${numTens * 10 + numUnits}!`, { onEnd: fireAulaEnd }); }, 600);
      }}); }, 600);
    }});
  };

  const restart = () => {
    gardenAttemptsRef.current = []; gardenDurationRef.current = 0; setReplays(r => r + 1); setIdx(0); setT0(Date.now());
    const restartLevel = gardenMode ? (gardenState?.currentStep ?? prog.lvl) : exactLvl ? prog.lvl : warmupLvl(prog.lvl);
    setQ(drawQuestion(track, prog, restartLevel, gardenMode || exactLvl)); setStatus(null); setSel(null); setStars(0); setOk(0); setToast(null); setMsg(null); setDone(false); setBonus(0);
  };

  if (done) {
    return (
      <div className="mk-pop text-center mt-10">
        <Burst />
        <div className="mk-bounce mb-3"><Mascote theme={kid.theme} size={112} /></div>
        <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.ink }}>Aventura Concluída!</div>
        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.sunDark, marginTop: 10 }}>+{stars} ⭐{bonus > 0 && <span style={{ fontSize: 16, color: C.mintDark }}> (bônus especial!)</span>}</div>
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: "#9A3412", marginTop: 4 }}>+{coinsEarned} 🪙{firstMissionReward && <span style={{ fontSize: 14, color: C.mintDark }}> (bônus da primeira missão do dia!)</span>}</div>
        <div style={{ color: C.sub, fontWeight: 800, fontSize: 16, marginTop: 6 }}>{ok} de {totalQFor(track)} acertos!</div>
        <div className="mt-8 flex flex-col gap-3.5">
          {track.id !== "matricula" && <button onClick={() => { sfx.tick(); restart(); }} className="w-full relative overflow-hidden select-none transition-all cursor-pointer active:translate-y-1 py-4 text-xl text-white font-bold" style={{ fontFamily: FONT, background: C.mint, boxShadow: `0 6px 0 ${C.mintDark}`, border: "none", borderRadius: 8 }}>Jogar de novo 🔁</button>}
          <button onClick={() => { sfx.tick(); onAlbum(); }} className="w-full relative overflow-hidden select-none transition-all cursor-pointer active:translate-y-1 py-3.5 text-lg text-white font-bold" style={{ fontFamily: FONT, background: C.pink, boxShadow: `0 5px 0 ${C.pinkDark}`, border: "none", borderRadius: 8 }}>Trocar por Amiguinhos 🎁</button>
          <button onClick={() => { sfx.tick(); onExit(); }} className="w-full py-3.5 text-lg font-bold select-none cursor-pointer border-2 transition-all active:translate-y-0.5" style={{ fontFamily: FONT, background: C.card, color: C.ink, borderColor: C.line, boxShadow: `0 4px 0 ${C.line}`, borderRadius: 8 }}>Ver Outros Jogos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mk-pop text-left flex flex-col h-full">
      {toast && <div className="fixed left-1/2 -translate-x-1/2 z-50 text-white font-bold text-sm px-5 py-2.5 rounded-md shadow-lg border-b-4" style={{ top: 18, animation: "mkToast 2s ease both", background: C.grape, borderColor: C.grapeDark }}>{toast}</div>}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-3">
        <button onClick={() => { sfx.tick(); onExit(); }} className="w-11 h-11 flex items-center justify-center font-bold text-lg select-none cursor-pointer border-2 active:translate-y-0.5 rounded-md" style={{ background: C.card, color: C.ink, borderColor: C.line, boxShadow: `0 4px 0 ${C.line}` }}>✕</button>
        <ProgressBar idx={idx} total={totalQFor(track)} /><SoundBtn on={sound} onToggle={onToggleSound} /><StarChip n={stars} />
      </div>
      <div className="mb-4 flex-shrink-0 flex items-start gap-3" style={q.kind === "audiochoice" ? { display: "none" } : undefined}>
        <div className={`w-14 flex-shrink-0 cursor-pointer ${status === "right" ? "mk-bounce" : ""}`}><Mascote theme={kid.theme} stage={stage} size={54} kid={kid} animation={status === "right" ? "happy" : status === "wrong" ? "idle" : "walk"} className="hover:scale-105 active:scale-95 transition-all" /></div>
        <div onClick={() => { if (status) advanceNow(); else if (sound) speak(qSpeech(q), q.lang ? { lang: q.lang } : {}); }} className="flex-1 cursor-pointer transition-all active:scale-[0.99]" style={{ background: status === "right" ? "#E9FBF0" : status === "wrong" ? "#FFF4F4" : C.card, border: `3px solid ${status === "right" ? C.mint : status === "wrong" ? C.melon : C.line}`, borderRadius: 18, padding: "10px 14px", fontFamily: FONT, fontWeight: 700, fontSize: 17, color: status === "right" ? C.mintDark : status === "wrong" ? C.melonDark : C.ink }}>{status ? msg : <QuestionPrompt q={q} />}</div>
      </div>
      {q.kind === "audiochoice" && audioChoicePromptVisible && !status && <div data-audiochoice-prompt className="mb-3 flex-shrink-0 rounded-2xl border-3 px-3.5 py-2.5 text-center text-[17px] font-bold" style={{ borderColor: C.line, color: C.ink, background: C.card, fontFamily: FONT }}>{q.prompt}</div>}
      {q.kind !== "audiochoice" && q.review && !status && <div className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-md text-xs font-bold mb-3">🧠 Prática Espaçada / Revisão Inteligente</div>}
      <div className="flex-1 flex flex-col min-h-0 justify-center">
        <GameLoopExerciseRenderer q={q} status={status} idx={idx} handlePick={handlePick} timeLeft={timeLeft} promptDone={promptDone} guidedIdx={guidedIdx} mockTutorialN={mockTutorialN} tutShow={tutShow} journeyDone={journeyDone} flashHidden={flashHidden} sel={sel} totalQFor={totalQFor} track={track} aulaSuggest={aulaSuggest} guidedNarr={guidedNarr} playAulinha={playAulinha} setShowClockTutorial={setShowClockTutorial} sound={sound} peekAgain={peekAgain} setJourneyDone={setJourneyDone} orderTaps={orderTaps} handleOrderTap={handleOrderTap} orderShake={orderShake} hiddenOpts={hiddenOpts} armedOpt={armedOpt} setArmedOpt={setArmedOpt} onFirstAuditionComplete={() => setAudioChoicePromptVisible(true)} />
      </div>
      {status && <button onClick={advanceNow} className="mt-4 flex-shrink-0 w-full py-3 text-lg font-black text-white select-none cursor-pointer border-none rounded-2xl transition-all active:translate-y-1 mk-optin flex items-center justify-center gap-2" style={{ fontFamily: FONT, background: status === "right" ? C.mint : C.ocean, boxShadow: `0 5px 0 ${status === "right" ? C.mintDark : C.oceanDark}` }}><span>{idx >= totalQFor(track) - 1 ? "Ver Resultado" : "Avançar"}</span><span>→</span></button>}
      {showClockTutorial && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white card-block border-4 border-indigo-400 p-6 max-w-sm w-full shadow-2xl relative mk-pop select-none text-center">
            <button onClick={() => { sfx.tick(); setShowClockTutorial(false); }} className="absolute top-3 right-3 w-8 h-8 rounded-md border-2 border-slate-300 flex items-center justify-center font-bold text-slate-500 hover:bg-slate-50">✕</button>
            <div className="text-4xl mb-2 animate-bounce">🧭</div><h3 className="text-xl font-black text-indigo-900" style={{ fontFamily: FONT }}>Segredos do Reloginho!</h3><p className="text-xs text-slate-500 font-bold mb-4">Aprenda com o Mascote de forma super rápida! 💡</p>
            <div className="space-y-4 text-left text-sm font-extrabold text-slate-700 leading-snug">
              <div className="flex items-start gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100"><span className="text-xl">🖤</span><div><span className="text-indigo-950 font-bold">Ponteiro Curto (Preto):</span><p className="text-xs text-slate-500 font-bold mt-0.5">Ele aponta para as HORAS! Se apontar para o 3, são 3 horas.</p></div></div>
              <div className="flex items-start gap-3 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100"><span className="text-xl">💙</span><div><span className="text-indigo-600 font-bold">Ponteiro Longo (Azul):</span><p className="text-xs text-slate-500 font-bold mt-0.5">Ele aponta para os MINUTOS! Ele anda mais rápido.</p></div></div>
              <div className="flex items-start gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-100"><span className="text-xl">⭐</span><div><span className="text-amber-800 font-bold">Se o Azul apontar para o 12:</span><p className="text-xs text-slate-500 font-bold mt-0.5">Significa hora exata! Minutos valem <span className="text-amber-600">00</span>.</p></div></div>
              <div className="flex items-start gap-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100"><span className="text-xl">🍕</span><div><span className="text-emerald-800 font-bold">Se o Azul apontar para o 6:</span><p className="text-xs text-slate-500 font-bold mt-0.5">Significa "meia hora", ou seja, <span className="text-emerald-600">30 minutos</span>!</p></div></div>
            </div>
            <button onClick={() => { sfx.level(); setShowClockTutorial(false); }} className="mt-5 w-full bg-indigo-600 text-white font-bold py-3 px-5 rounded-2xl shadow-md border-b-4 border-indigo-800 active:translate-y-0.5 active:border-b-2 transition-all text-sm" style={{ fontFamily: FONT }}>Entendi! Vamos Jogar! 👍</button>
          </div>
        </div>
      )}
    </div>
  );
}
