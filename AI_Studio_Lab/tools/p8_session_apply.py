from pathlib import Path
import re


def replace_once(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: esperado 1x, encontrado {count}x")
    p.write_text(text.replace(old, new))


def regex_once(path: str, pattern: str, replacement: str) -> None:
    p = Path(path)
    text = p.read_text()
    out, count = re.subn(pattern, replacement, text, count=1, flags=re.S)
    if count != 1:
        raise SystemExit(f"{path}: regex esperado 1x, encontrado {count}x")
    p.write_text(out)


# ---------------------------------------------------------------------------
# 1) Adapter puro: ficha JD -> Track de sessão, save -> estado completo, estado
#    -> projeção efêmera para a casca visual do GameLoop.
# ---------------------------------------------------------------------------
Path("src/curriculum/motores/jardimSession.ts").write_text('''import { Composer } from "../Composer";
import { JARDIM, type TrilhaDoJardim } from "../fichas/dojo/jardim";
import type { DojoTrackState, JardimTrackState, Progress, Track } from "../../types";
import {
  freshJardimTrackState,
  jardimUnlocked,
  type JardimAttempt,
} from "./jardimEngine";

export const JARDIM_ROUND_ITENS = 8;

const VISUAL: Record<string, { icon: string; color: string; dark: string }> = {
  JD1: { icon: "👀", color: "#D1FAE5", dark: "#059669" },
  JD2: { icon: "🖐️", color: "#DBEAFE", dark: "#2563EB" },
  JD3: { icon: "🔟", color: "#EDE9FE", dark: "#7C3AED" },
  JD5: { icon: "🧠", color: "#FEF3C7", dark: "#D97706" },
};

export interface JardimMissionSummary {
  /** Acertos terminais usados só para recompensa gentil. */
  rewardedCorrect: number;
  /** Acertos de primeira usados para precisão/automaticidade. */
  measuredCorrect: number;
  total: number;
  stars: number;
  durationMs: number;
}

export interface TerminalAttemptInput {
  terminalRight: boolean;
  attemptCount: number;
  durationMs: number;
  targetRtMs: number;
  misconceptionTags?: string[];
}

/**
 * O Jardim mede a PRIMEIRA resposta cognitiva. Um erro real seguido de dica e
 * recuperação continua sendo erro na métrica de automaticidade; erro motor nem
 * chega a `recordQuestionAttempt`, logo não aumenta `attemptCount`.
 */
export function tentativaJardimDoTerminal(input: TerminalAttemptInput): JardimAttempt {
  return {
    right: input.terminalRight && input.attemptCount === 1,
    durationMs: input.durationMs,
    targetRtMs: input.targetRtMs,
    ...(input.misconceptionTags?.[0] ? { misconception: input.misconceptionTags[0] } : {}),
  };
}

export function jardimTrilhaPorId(id: string | undefined): TrilhaDoJardim | undefined {
  if (!id) return undefined;
  return JARDIM.find(item => item.ficha.id === id);
}

export function jardimTrack(trilha: TrilhaDoJardim): Track {
  for (let lvl = 1; lvl <= 5; lvl += 1) {
    const alvo = trilha.ficha.niveis[lvl]?.rt_alvo;
    if (!Number.isFinite(alvo) || (alvo as number) <= 0) {
      throw new Error(`${trilha.ficha.id} nivel ${lvl} nao tem rt_alvo valido para o Jardim.`);
    }
  }
  const visual = VISUAL[trilha.ficha.id] ?? { icon: "🌱", color: "#DCFCE7", dark: "#16A34A" };
  return {
    id: trilha.ficha.id,
    name: trilha.ficha.nome,
    ...visual,
    totalQ: JARDIM_ROUND_ITENS,
    contentStatus: "explicit",
    gen: lvl => Composer.generate(trilha.ficha, Math.min(5, Math.max(1, Math.round(lvl)))),
  };
}

/**
 * `unlocked` salvo é cache/apresentação, nunca autoridade. A mãe decide toda
 * vez; um save corrompido não abre treino antes do conceito.
 */
export function resolveJardimState(
  trilha: TrilhaDoJardim,
  motherProgress: Progress | undefined,
  saved?: DojoTrackState,
): JardimTrackState {
  const base = freshJardimTrackState(jardimUnlocked(trilha, motherProgress));
  const currentStep = Math.min(5, Math.max(1, saved?.currentStep ?? base.currentStep));
  const highestStep = Math.min(5, Math.max(currentStep, saved?.highestStep ?? currentStep));
  return {
    ...base,
    ...saved,
    unlocked: jardimUnlocked(trilha, motherProgress),
    mastered: saved?.mastered === true,
    family: "JD",
    currentStep,
    highestStep,
    goodRounds: Math.max(0, saved?.goodRounds ?? 0),
    weakRounds: Math.max(0, saved?.weakRounds ?? 0),
    rounds: Math.max(0, saved?.rounds ?? 0),
    attempts: Math.max(0, saved?.attempts ?? 0),
    correct: Math.max(0, saved?.correct ?? 0),
  };
}

/**
 * Projeção SOMENTE para a casca do GameLoop. Nunca deve ser gravada em
 * `state.progress`: JD não é nó do currículo.
 */
export function jardimProgressProjection(state: JardimTrackState): Progress {
  return {
    lvl: state.currentStep,
    maxLvl: state.highestStep,
    dom: false,
    streak: 0,
    bad: 0,
    stars: 0,
    ok: 0,
    tot: 0,
    bank: [],
    mast: 0,
    ...(state.lastDay ? { lastDay: state.lastDay } : {}),
    ...(state.avgCorrectRtMs !== undefined ? { rt: Math.round(state.avgCorrectRtMs) } : {}),
  };
}
''')

Path("src/curriculum/motores/jardimSession.test.ts").write_text('''import { describe, expect, it } from "vitest";
import { JARDIM } from "../fichas/dojo/jardim";
import {
  JARDIM_ROUND_ITENS,
  jardimProgressProjection,
  jardimTrack,
  resolveJardimState,
  tentativaJardimDoTerminal,
} from "./jardimSession";

const p = (lvl: number, maxLvl = lvl) => ({
  lvl, maxLvl, streak: 0, bad: 0, stars: 0, ok: 0, tot: 0, bank: [], mast: 0,
});

describe("P8 — adapter de sessão do Jardim", () => {
  it("gera Track explícito de oito itens e preserva rt_alvo dos cinco degraus", () => {
    for (const trilha of JARDIM) {
      const track = jardimTrack(trilha);
      expect(track.id).toBe(trilha.ficha.id);
      expect(track.totalQ).toBe(JARDIM_ROUND_ITENS);
      expect(track.contentStatus).toBe("explicit");
      for (let lvl = 1; lvl <= 5; lvl += 1) {
        expect(track.gen(lvl).rt_max_s).toBe((trilha.ficha.niveis[lvl].rt_alvo as number) / 1000);
      }
    }
  });

  it("estado salvo nunca sobrepõe a regra de unlock da mãe", () => {
    const trilha = JARDIM[0];
    const locked = resolveJardimState(trilha, p(2), {
      unlocked: true, mastered: false, family: "JD", currentStep: 4, highestStep: 4,
    });
    expect(locked.unlocked).toBe(false);
    expect(locked.currentStep).toBe(4); // treino fica guardado, só a porta fecha

    const open = resolveJardimState(trilha, p(1, 3), locked);
    expect(open.unlocked).toBe(true);
    expect(open.currentStep).toBe(4);
  });

  it("projeção visual não cria domínio curricular nem banco de revisão", () => {
    const state = resolveJardimState(JARDIM[0], p(3), {
      unlocked: true, mastered: true, family: "JD", currentStep: 3, highestStep: 5,
      rounds: 9, attempts: 72, correct: 61,
    });
    const projection = jardimProgressProjection(state);
    expect(projection.lvl).toBe(3);
    expect(projection.maxLvl).toBe(5);
    expect(projection.dom).toBe(false);
    expect(projection.bank).toEqual([]);
  });

  it("recuperar após erro real não vira acerto de automaticidade", () => {
    expect(tentativaJardimDoTerminal({
      terminalRight: true, attemptCount: 2, durationMs: 3200, targetRtMs: 4000,
      misconceptionTags: ["OFF_BY_ONE"],
    })).toMatchObject({ right: false, misconception: "OFF_BY_ONE" });
    expect(tentativaJardimDoTerminal({
      terminalRight: true, attemptCount: 1, durationMs: 1800, targetRtMs: 4000,
    }).right).toBe(true);
  });
});
''')

# Engine: preserve uma ocorrência por QUESTÃO para o Radar poder reconhecer o
# mesmo padrão em duas questões do round. Não Set/global-dedupe.
replace_once(
    "src/curriculum/motores/jardimEngine.ts",
    '''  const misconceptions = [...new Set(
    attempts.filter(a => !a.right && a.misconception).map(a => a.misconception as string),
  )];''',
    '''  const misconceptions = attempts
    .filter(a => !a.right && a.misconception)
    .map(a => a.misconception as string);''',
)
replace_once(
    "src/curriculum/motores/jardimEngine.test.ts",
    '''  it("só agrega misconception de resposta errada", () => {
    const attempts = round(8, 3);
    const result = applyJardimRound(freshJardimTrackState(true), attempts);
    expect(result.misconceptions).toEqual(["ERRO_CONCEITUAL"]);
    expect(result.misconceptions).not.toContain("LENTO_DEDOS");
  });''',
    '''  it("preserva uma ocorrência por questão errada para o Radar detectar padrão", () => {
    const attempts = round(8, 3);
    const result = applyJardimRound(freshJardimTrackState(true), attempts);
    expect(result.misconceptions).toEqual(["ERRO_CONCEITUAL", "ERRO_CONCEITUAL"]);
    expect(result.misconceptions).not.toContain("LENTO_DEDOS");
  });''',
)

# ---------------------------------------------------------------------------
# 2) GameLoop ganha um modo EXPLÍCITO de progressão. A casca, voz, retry e
#    renderização são compartilhados; o motor de Jornada deixa de ser chamado.
# ---------------------------------------------------------------------------
replace_once(
    "src/components/GameLoop.tsx",
    'import { AnswerMeta, Kid, Track, Question, Progress } from "../types";',
    'import { AnswerMeta, Kid, Track, Question, Progress, JardimTrackState } from "../types";',
)
replace_once(
    "src/components/GameLoop.tsx",
    'import { applyJourneyAnswer } from "../curriculum/motores/progressEngine";\n',
    '''import { applyJourneyAnswer } from "../curriculum/motores/progressEngine";
import { applyJardimRound, type JardimAttempt, type JardimRoundResult } from "../curriculum/motores/jardimEngine";
import { tentativaJardimDoTerminal, type JardimMissionSummary } from "../curriculum/motores/jardimSession";
''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  rescue?: { requiredLevel: number; questionBudget: number };
}''',
    '''  rescue?: { requiredLevel: number; questionBudget: number };
  /** Jornada é o default; Jardim compartilha a casca, nunca o motor conceitual. */
  progressionMode?: "journey" | "garden";
  gardenState?: JardimTrackState;
  onGardenRound?: (result: JardimRoundResult, summary: JardimMissionSummary) => void;
}''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  exactLvl = false,
  rescue,
}: GameProps) {
  const [idx, setIdx] = useState(0);''',
    '''  exactLvl = false,
  rescue,
  progressionMode = "journey",
  gardenState,
  onGardenRound,
}: GameProps) {
  const gardenMode = progressionMode === "garden";
  const [idx, setIdx] = useState(0);''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  const [q, setQ] = useState<Question>(() => drawQuestion(track, prog0, exactLvl ? prog0.lvl : warmupLvl(prog0.lvl), exactLvl));''',
    '''  const [q, setQ] = useState<Question>(() => drawQuestion(
    track,
    prog0,
    (gardenMode || exactLvl) ? prog0.lvl : warmupLvl(prog0.lvl),
    gardenMode || exactLvl,
  ));''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  const questionDiagnosticsRef = useRef(createQuestionDiagnostics());

  useEffect(() => {
    if (q.rt_max_s && !status && !done && (q.kind !== 'journey' || journeyDone)) {''',
    '''  const questionDiagnosticsRef = useRef(createQuestionDiagnostics());
  const gardenAttemptsRef = useRef<JardimAttempt[]>([]);
  const gardenDurationRef = useRef(0);

  useEffect(() => {
    // O Jardim mede RT em silêncio. `rt_alvo` nunca vira cronômetro visível.
    if (!gardenMode && q.rt_max_s && !status && !done && (q.kind !== 'journey' || journeyDone)) {''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  }, [q, status, done, journeyDone]);''',
    '''  }, [q, status, done, journeyDone, gardenMode]);''',
)

old_progress = '''    const durationMs = Math.min(30000, Math.max(0, Date.now() - t0));
    const targetRtSeconds = q.rt_max_s ?? track.rt_max_s;
    const progressResult = applyJourneyAnswer(prog, right, idx < WARMUP_QUESTIONS, {
      durationMs,
      targetRtMs: targetRtSeconds !== undefined ? targetRtSeconds * 1000 : undefined,
      helpUsed: helpUsedRef.current,
      // P13: o que ESTA resposta demonstrou, e o que a ficha exige ter visto.
      evidencias: right ? evidenciasDaResposta(answerMeta) : undefined,
      exigeEvidencia: q.exigeEvidencia,
      gateEvidenceBeforeAdvance: q.gateEvidenceBeforeAdvance,
      masteryRule: q.masteryRule,
      isReview: q.review === true,
      practiceDay: new Date().toISOString().slice(0, 10),
      previousPracticeDay: prog.lastDay,
    }, rescue ? { kind: "rescue", requiredLevel: rescue.requiredLevel } : undefined);
    const p = progressResult.progress;
    const diagnostics = summarizeQuestionDiagnostics(questionDiagnosticsRef.current, right);
    diagnostics.misconceptionTags.forEach(tag => trackMisconception(p, tag));
    let currentToast = progressResult.transition?.type === "level-up"
      ? `Subiu para o nível ${progressResult.transition.level}! 🚀`
      : progressResult.transition?.type === "level-down"
        ? "Vamos voltar um passinho para treinar! 💪"
        : progressResult.transition?.type === "multidimensional-crown"
          ? "DOMÍNIO ABSOLUTO! 👑✨"
          : null;'''
new_progress = '''    const durationMs = Math.min(30000, Math.max(0, Date.now() - t0));
    const targetRtSeconds = q.rt_max_s ?? track.rt_max_s;
    const diagnostics = summarizeQuestionDiagnostics(questionDiagnosticsRef.current, right);
    let p: Progress;
    let currentToast: string | null = null;

    if (gardenMode) {
      if (!gardenState || !onGardenRound) {
        throw new Error(`Sessao do Jardim ${track.id} sem gardenState/onGardenRound.`);
      }
      const targetRtMs = targetRtSeconds !== undefined ? targetRtSeconds * 1000 : NaN;
      if (!Number.isFinite(targetRtMs) || targetRtMs <= 0) {
        throw new Error(`Questao ${track.id} sem rt_alvo valido no Jardim.`);
      }
      gardenAttemptsRef.current.push(tentativaJardimDoTerminal({
        terminalRight: right,
        attemptCount: diagnostics.attemptCount,
        durationMs,
        targetRtMs,
        misconceptionTags: diagnostics.misconceptionTags,
      }));
      gardenDurationRef.current += durationMs;
      // Projeção efêmera: o nível do round fica congelado. Nunca é persistida.
      p = {
        ...prog,
        lvl: gardenState.currentStep,
        maxLvl: gardenState.highestStep,
        streak: 0,
        bad: 0,
        bank: [],
      };
    } else {
      const progressResult = applyJourneyAnswer(prog, right, idx < WARMUP_QUESTIONS, {
        durationMs,
        targetRtMs: targetRtSeconds !== undefined ? targetRtSeconds * 1000 : undefined,
        helpUsed: helpUsedRef.current,
        // P13: o que ESTA resposta demonstrou, e o que a ficha exige ter visto.
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
      currentToast = progressResult.transition?.type === "level-up"
        ? `Subiu para o nível ${progressResult.transition.level}! 🚀`
        : progressResult.transition?.type === "level-down"
          ? "Vamos voltar um passinho para treinar! 💪"
          : progressResult.transition?.type === "multidimensional-crown"
            ? "DOMÍNIO ABSOLUTO! 👑✨"
            : null;
    }'''
replace_once("src/components/GameLoop.tsx", old_progress, new_progress)

# Banco e Leitner pertencem à Jornada; o Jardim tem round próprio e Radar via mãe.
regex_once(
    "src/components/GameLoop.tsx",
    r'''    // AI smart review: mastering a missed question after 2 hits\n(.*?)\n    // ⭐ XP vitalício e Nivelamento por Velocidade \(Dojo\)''',
    '''    if (!gardenMode) {
      // AI smart review: mastering a missed question after 2 hits
\1
    }

    // ⭐ XP vitalício e Nivelamento por Velocidade (Dojo)''',
)

replace_once(
    "src/components/GameLoop.tsx",
    '''    let starGain = 0;
    if (right) {
      if (q.kind === "rapid-fire" || track.id.startsWith("dojo")) {''',
    '''    let starGain = 0;
    if (right) {
      if (gardenMode) {
        // Recompensa gentil; RT decide automaticidade no motor, não estrelas.
        starGain = 1;
      } else if (q.kind === "rapid-fire" || track.id.startsWith("dojo")) {''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''    const rescueRecovered = !!rescue && (''',
    '''    const rescueRecovered = !gardenMode && !!rescue && (''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''    p.lastDay = new Date().toISOString().slice(0, 10);
    p.rt = Math.round(p.rt ? p.rt * 0.7 + durationMs * 0.3 : durationMs);
    
    // Fast level up for rapid-fire
    if (right && q.kind === "rapid-fire" && durationMs <= 3000 && p.lvl < 5) {''',
    '''    if (!gardenMode) {
      p.lastDay = new Date().toISOString().slice(0, 10);
      p.rt = Math.round(p.rt ? p.rt * 0.7 + durationMs * 0.3 : durationMs);
    }
    
    // Fast level up for rapid-fire
    if (!gardenMode && right && q.kind === "rapid-fire" && durationMs <= 3000 && p.lvl < 5) {''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''    if (!q.isFallback) {
      onCommit(p, right, starGain + nextBonus, durationMs, isLast);
    }
''',
    '''    if (gardenMode && isLast) {
      if (!gardenState || !onGardenRound) {
        throw new Error(`Sessao do Jardim ${track.id} terminou sem callback.`);
      }
      const result = applyJardimRound(
        gardenState,
        gardenAttemptsRef.current,
        new Date().toISOString().slice(0, 10),
      );
      onGardenRound(result, {
        rewardedCorrect: nextOk,
        measuredCorrect: gardenAttemptsRef.current.filter(a => a.right).length,
        total: gardenAttemptsRef.current.length,
        stars: nextStars + nextBonus,
        durationMs: gardenDurationRef.current,
      });
    } else if (!gardenMode && !q.isFallback) {
      onCommit(p, right, starGain + nextBonus, durationMs, isLast);
    }
''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''        setQ(drawQuestion(track, p, exactLvl ? p.lvl : nextIdx < WARMUP_QUESTIONS ? warmupLvl(p.lvl) : p.lvl, exactLvl));''',
    '''        const nextLevel = gardenMode
          ? (gardenState?.currentStep ?? p.lvl)
          : exactLvl
            ? p.lvl
            : nextIdx < WARMUP_QUESTIONS ? warmupLvl(p.lvl) : p.lvl;
        setQ(drawQuestion(track, p, nextLevel, gardenMode || exactLvl));''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''  const restart = () => {
    setReplays((r) => r + 1);''',
    '''  const restart = () => {
    gardenAttemptsRef.current = [];
    gardenDurationRef.current = 0;
    setReplays((r) => r + 1);''',
)
replace_once(
    "src/components/GameLoop.tsx",
    '''    setQ(drawQuestion(track, prog, exactLvl ? prog.lvl : warmupLvl(prog.lvl), exactLvl));''',
    '''    const restartLevel = gardenMode
      ? (gardenState?.currentStep ?? prog.lvl)
      : exactLvl ? prog.lvl : warmupLvl(prog.lvl);
    setQ(drawQuestion(track, prog, restartLevel, gardenMode || exactLvl));''',
)

# ---------------------------------------------------------------------------
# 3) App: resolve JD* explicitamente, salva em dojoTracks e grava Radar na MÃE.
#    O round é a unidade atômica: missão incompleta não altera faixa do Jardim.
# ---------------------------------------------------------------------------
replace_once(
    "src/App.tsx",
    'import { State, Kid, Track, Progress } from "./types";',
    'import { State, Kid, Track, Progress } from "./types";',
)
replace_once(
    "src/App.tsx",
    'import { migrateLegacyCrown } from "./curriculum/motores/progressEngine";\n',
    '''import { migrateLegacyCrown } from "./curriculum/motores/progressEngine";
import { JARDIM } from "./curriculum/fichas/dojo/jardim";
import {
  jardimProgressProjection,
  jardimTrack,
  jardimTrilhaPorId,
  resolveJardimState,
  type JardimMissionSummary,
} from "./curriculum/motores/jardimSession";
import type { JardimRoundResult } from "./curriculum/motores/jardimEngine";
import { trackMisconception } from "./curriculum/motores/radarEngine";
''',
)
replace_once(
    "src/App.tsx",
    '''  m.progress = m.progress || {};
  m.customTracks = m.customTracks || [];

  for (const k of m.kids) {''',
    '''  m.progress = m.progress || {};
  m.dojoTracks = m.dojoTracks || {};
  m.customTracks = m.customTracks || [];

  for (const k of m.kids) {
    if (!m.dojoTracks[k.id]) m.dojoTracks[k.id] = {};''',
)

# Novo commit de round do Jardim, imediatamente antes do factory reset.
replace_once(
    "src/App.tsx",
    '''  const handleFactoryReset = () => {''',
    '''  const commitJardimRound = (
    kidId: string,
    trailId: string,
    motherId: string,
    result: JardimRoundResult,
    summary: JardimMissionSummary,
  ) => {
    const today = localDay();
    const lg = [...logOf(kidId)];
    const last = lg[lg.length - 1];
    const doneBefore = last && last.d === today ? last.m || 0 : 0;

    if (last && last.d === today) {
      lg[lg.length - 1] = {
        ...last,
        ok: last.ok + summary.measuredCorrect,
        tot: last.tot + summary.total,
        stars: last.stars + summary.stars,
        t: (last.t || 0) + summary.durationMs,
        m: (last.m || 0) + 1,
      };
    } else {
      lg.push({
        d: today,
        ok: summary.measuredCorrect,
        tot: summary.total,
        stars: summary.stars,
        t: summary.durationMs,
        m: 1,
      });
    }

    // O Jardim ensina/mede automaticidade, mas erros cognitivos continuam
    // pertencendo à competência-mãe no Radar. JD* nunca ganha Progress próprio.
    const kidProgress = { ...(state.progress[kidId] || {}) };
    const mother = kidProgress[motherId] ? { ...kidProgress[motherId] } : getProg(kidId, motherId);
    for (const tag of result.misconceptions) trackMisconception(mother, tag);
    kidProgress[motherId] = mother;

    const kidDojo = {
      ...((state.dojoTracks || {})[kidId] || {}),
      [trailId]: result.state,
    };

    // Recompensa é gentil e não altera a métrica do round: recuperar uma
    // resposta após dica ainda rende a moedinha, mas não infla precisão.
    const coinGain = summary.rewardedCorrect + 3 + (doneBefore === 0 ? 5 : 0);
    const freeFood = doneBefore === 0 ? 1 : 0;

    persist({
      ...state,
      kids: freeFood
        ? state.kids.map(k => k.id === kidId ? { ...k, petFood: (k.petFood || 0) + 1 } : k)
        : state.kids,
      progress: { ...state.progress, [kidId]: kidProgress },
      dojoTracks: {
        ...(state.dojoTracks || {}),
        [kidId]: kidDojo,
      },
      coins: { ...state.coins, [kidId]: coinsOf(kidId) + coinGain },
      log: { ...state.log, [kidId]: lg.slice(-366) },
    }, true);
  };

  const handleFactoryReset = () => {''',
)

# Delete/add/reset precisam incluir o novo estado, senão reset parcial ressuscita faixa.
replace_once(
    "src/App.tsx",
    '''    const updatedCoins = { ...state.coins };
    delete updatedCoins[kidId];

    const updatedAlbum = { ...state.album };''',
    '''    const updatedCoins = { ...state.coins };
    delete updatedCoins[kidId];

    const updatedDojoTracks = { ...(state.dojoTracks || {}) };
    delete updatedDojoTracks[kidId];

    const updatedAlbum = { ...state.album };''',
)
replace_once(
    "src/App.tsx",
    '''      progress: updatedProgress,
      coins: updatedCoins,''',
    '''      progress: updatedProgress,
      dojoTracks: updatedDojoTracks,
      coins: updatedCoins,''',
)
replace_once(
    "src/App.tsx",
    '''      progress: { ...state.progress, [newKid.id]: {} },
      coins: { ...state.coins, [newKid.id]: 0 },''',
    '''      progress: { ...state.progress, [newKid.id]: {} },
      dojoTracks: { ...(state.dojoTracks || {}), [newKid.id]: {} },
      coins: { ...state.coins, [newKid.id]: 0 },''',
)
replace_once(
    "src/App.tsx",
    '''            onResetKid={(id) => persist({ ...state, progress: { ...state.progress, [id]: {} }, log: { ...state.log, [id]: [] } })}''',
    '''            onResetKid={(id) => persist({
              ...state,
              progress: { ...state.progress, [id]: {} },
              dojoTracks: { ...(state.dojoTracks || {}), [id]: {} },
              log: { ...state.log, [id]: [] },
            })}''',
)

# Router do game: Jardim é resolvido ANTES de procurar ALL_MATH_TRACKS.
old_game = '''          const gameTrack =
            screen.track === "mista" || screen.track === "mixed"
              ? mixedTrack!
              : screen.track === "aula"
              ? aulaTrack!
              : screen.track === "dojo"
              ? dojoBuild!
              : screen.track === "matricula"
              ? matriculaBuild!.track
              : (() => {
    let found = getTracksForKid(kidObj).find((t) => t.id === screen.track);'''
new_game = '''          const jardimConfig = jardimTrilhaPorId(screen.track);
          const jardimState = jardimConfig
            ? resolveJardimState(
                jardimConfig,
                (state.progress[kidObj.id] || {})[jardimConfig.mae],
                ((state.dojoTracks || {})[kidObj.id] || {})[jardimConfig.ficha.id],
              )
            : null;
          const gameTrack = jardimConfig
            ? jardimTrack(jardimConfig)
            : screen.track === "mista" || screen.track === "mixed"
              ? mixedTrack!
              : screen.track === "aula"
              ? aulaTrack!
              : screen.track === "dojo"
              ? dojoBuild!
              : screen.track === "matricula"
              ? matriculaBuild!.track
              : (() => {
    let found = getTracksForKid(kidObj).find((t) => t.id === screen.track);'''
replace_once("src/App.tsx", old_game, new_game)

replace_once(
    "src/App.tsx",
    '''              prog0={screen.rescue
                ? { ...getProg(screen.kid!, screen.track!), streak: 0 }
                : screen.lvl
                  ? { ...getProg(screen.kid!, screen.track!), lvl: screen.lvl }
                  : getProg(screen.kid!, screen.track!)}
              exactLvl={!!screen.rescue || !!screen.lvl || screen.track === "aula" || screen.track === "matricula"} // sequências puras: sem banco/aquecimento por cima
              rescue={screen.rescue}''',
    '''              prog0={jardimState
                ? jardimProgressProjection(jardimState)
                : screen.rescue
                  ? { ...getProg(screen.kid!, screen.track!), streak: 0 }
                  : screen.lvl
                    ? { ...getProg(screen.kid!, screen.track!), lvl: screen.lvl }
                    : getProg(screen.kid!, screen.track!)}
              exactLvl={!!jardimState || !!screen.rescue || !!screen.lvl || screen.track === "aula" || screen.track === "matricula"} // sequências puras: sem banco/aquecimento por cima
              rescue={jardimState ? undefined : screen.rescue}
              progressionMode={jardimState ? "garden" : "journey"}
              gardenState={jardimState || undefined}''',
)
replace_once(
    "src/App.tsx",
    '''              onCommit={(p, right, gain, ms, missionDone) => commitProg(screen.kid!, screen.track!, p, right, gain, ms, missionDone)}
              onExit={() => setScreen({ name: "home", kid: screen.kid })}''',
    '''              onCommit={(p, right, gain, ms, missionDone) => commitProg(screen.kid!, screen.track!, p, right, gain, ms, missionDone)}
              onGardenRound={jardimConfig ? (result, summary) =>
                commitJardimRound(screen.kid!, jardimConfig.ficha.id, jardimConfig.mae, result, summary)
                : undefined}
              onExit={() => setScreen({ name: "home", kid: screen.kid })}''',
)

# Garantia estática: nada de import morto da lista inteira aqui.
replace_once(
    "src/App.tsx",
    '''import { JARDIM } from "./curriculum/fichas/dojo/jardim";
''',
    '''import "./curriculum/fichas/dojo/jardim";
''',
)
# O import side-effect acima é desnecessário; remove de vez mantendo o módulo
# carregado via jardimSession. Esta segunda troca deixa a árvore limpa.
replace_once("src/App.tsx", 'import "./curriculum/fichas/dojo/jardim";\n', '')

print("P8 sessão patch preparado")
