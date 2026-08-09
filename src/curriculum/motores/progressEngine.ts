import { MasteryEvidence, MasteryRule, Progress } from "../../types";
import { calendarDayDistance, normalizeLegacyRuntimeDay } from "../../utils/calendarDay";
import { consumeAulaSourceProgress, markAulaSourceProgress } from "./aulaProgressContext";
import { consumeSenseiDojoTerminal } from "./senseiDojoProgressContext";

export type ProgressTransition =
  | { type: "level-up"; level: number }
  | { type: "level-down"; level: number }
  | { type: "multidimensional-crown" }
  | { type: "legacy-crown" }
  | null;

export interface MasteryAttempt {
  durationMs: number;
  targetRtMs?: number;
  helpUsed: boolean;
  isReview: boolean;
  practiceDay: string;
  previousPracticeDay?: string;
  evidencias?: string[];
  exigeEvidencia?: string;
  gateEvidenceBeforeAdvance?: string;
  masteryRule?: MasteryRule;
}

export interface AnswerProgressResult {
  progress: Progress;
  transition: ProgressTransition;
}

export interface ProgressionMode {
  kind: "journey" | "rescue";
  requiredLevel?: number;
}

/**
 * Instala o boundary de `lastDay` sem inventar uma chave serializável quando o
 * progresso ainda nunca foi praticado. Antes da primeira escrita a propriedade
 * existe apenas como interceptor não-enumerável; ao receber uma data válida, ela
 * se torna enumerável e passa a sobreviver normalmente a spread/JSON/save.
 */
function protectLocalPracticeDay(progress: Progress): void {
  let practiceDay = progress.lastDay;

  const install = (enumerable: boolean) => {
    Object.defineProperty(progress, "lastDay", {
      enumerable,
      configurable: true,
      get: () => practiceDay,
      set: (value: string | undefined) => {
        practiceDay = normalizeLegacyRuntimeDay(value) ?? value;
        if (!enumerable && practiceDay !== undefined) install(true);
      },
    });
  };

  install(practiceDay !== undefined);
}

/**
 * A escada conceitual tem um único escritor: `applyJourneyAnswer`.
 *
 * Há código de UI legado que ainda tenta dar bônus de velocidade com mutação
 * direta de `p.streak`. Em vez de permitir que uma camada de recompensa ganhe
 * autoridade curricular, o objeto devolvido pelo motor expõe o valor calculado
 * normalmente, mas ignora escritas externas até a próxima transição do motor.
 *
 * O mesmo boundary normaliza escritas legadas de `lastDay`: se a UI entregar o
 * dia UTC do instante atual, ele vira a data LOCAL antes de persistir. Datas
 * históricas/injetadas permanecem válidas. Campos ausentes continuam ausentes
 * no shape serializável até sua primeira escrita real.
 */
export function protectConceptualStreak(progress: Progress): Progress {
  const conceptualStreak = progress.streak || 0;
  Object.defineProperty(progress, "streak", {
    enumerable: true,
    configurable: true,
    get: () => conceptualStreak,
    set: () => {
      // Intencional: RT/estrela/UI não escrevem na progressão conceitual.
    },
  });
  protectLocalPracticeDay(progress);
  return progress;
}

function rescueTargetRecovered(before: Progress, after: Progress, mode: ProgressionMode): boolean {
  if (mode.kind !== "rescue" || !mode.requiredLevel) return false;
  // No nível 5 não existe novo degrau para sinalizar a saída. Mantemos a regra
  // já usada pelo GameLoop: quem entrou no resgate já no 5 precisa confirmar
  // dois acertos conceituais; quem chega de 4→5 pode sair na própria transição.
  if (mode.requiredLevel === 5 && (before.lvl || 1) === 5) return (after.streak || 0) >= 2;
  return (after.lvl || 1) >= mode.requiredLevel;
}

/**
 * Transição pura da escada de proficiência da Jornada.
 *
 * O Dojo Sensei atravessa a mesma casca visual do GameLoop, mas é interceptado
 * ANTES desta escada. Uma resposta de `dojo_add/sub/mul/div` vira evento de
 * fluência para `dojoTracks`; não altera lvl/dom/mastery da Jornada.
 *
 * Na Aula do Dia, `current` pode ser o envelope sintético `aula`. Depois da
 * exclusão do Dojo, o boundary resolve a competência-fonte normalmente.
 */
export function applyJourneyAnswer(
  current: Progress,
  right: boolean,
  isWarmup: boolean,
  masteryAttempt?: MasteryAttempt,
  mode: ProgressionMode = { kind: "journey" },
): AnswerProgressResult {
  const normalizedAttempt = masteryAttempt
    ? {
        ...masteryAttempt,
        practiceDay: normalizeLegacyRuntimeDay(masteryAttempt.practiceDay) ?? masteryAttempt.practiceDay,
      }
    : undefined;

  const dojo = consumeSenseiDojoTerminal(current, right, normalizedAttempt);
  if (dojo.handled) return { progress: dojo.progress, transition: null };

  const routed = consumeAulaSourceProgress(current);
  const base = routed.progress;
  const progress: Progress = {
    ...base,
    bank: [...(base.bank || [])],
    tot: (base.tot || 0) + 1,
    ok: base.ok || 0,
    streak: base.streak || 0,
    bad: base.bad || 0,
    lvl: base.lvl || 1,
    maxLvl: base.maxLvl || base.lvl || 1,
    ...(normalizedAttempt ? { lastDay: normalizedAttempt.practiceDay } : {}),
  };
  let transition: ProgressTransition = null;

  if (right) {
    progress.ok += 1;
    progress.maxLvl = Math.max(progress.maxLvl || 1, progress.lvl);
    progress.streak += 1;
    progress.bad = 0;

    const streakToLevel = mode.kind === "rescue" ? 2 : 3;
    const levelCeiling = mode.kind === "rescue" ? mode.requiredLevel || 3 : 5;
    if (progress.streak >= streakToLevel && progress.lvl < levelCeiling) {
      progress.lvl += 1;
      progress.streak = 0;
      progress.maxLvl = Math.max(progress.maxLvl || 1, progress.lvl);
      transition = { type: "level-up", level: progress.lvl };
    }
  } else {
    progress.streak = 0;
    if (!isWarmup) {
      progress.bad += 1;
      if (progress.bad >= 3 && progress.lvl > 1) {
        progress.lvl -= 1;
        progress.bad = 0;
        transition = { type: "level-down", level: progress.lvl };
      }
    }
  }

  if (normalizedAttempt) {
    if (normalizedAttempt.helpUsed) progress.helpClicks = (base.helpClicks || 0) + 1;
    const mastery = updateMasteryEvidence(base, right, normalizedAttempt);
    progress.masteryEvidence = mastery;

    if (
      transition?.type === "level-up"
      && normalizedAttempt.gateEvidenceBeforeAdvance
      && !(mastery.evidenciasVistas || []).includes(normalizedAttempt.gateEvidenceBeforeAdvance)
    ) {
      progress.lvl = base.lvl;
      progress.maxLvl = base.maxLvl || base.lvl;
      progress.streak = Math.max(progress.streak, mode.kind === "rescue" ? 2 : 3);
      transition = null;
    }

    if (!progress.dom && mastery.crownedBy === "multidimensional") {
      progress.dom = true;
      transition = { type: "multidimensional-crown" };
    }
  } else if (progress.streak >= 3 && progress.lvl === 5 && !progress.dom) {
    progress.dom = true;
    progress.masteryEvidence = legacyMasteryEvidence();
    transition = { type: "legacy-crown" };
  }

  // Uma Oficina bem-sucedida precisa ter saída. `current/base` é sempre o
  // progresso da competência-alvo da missão: portanto limpar aqui resolve
  // somente misconceptions desse alvo. Em resgate de pré-requisito, a causa
  // original vive em outro nó e permanece intacta até ser reavaliada lá.
  if (rescueTargetRecovered(base, progress, mode)) {
    progress.misconceptions = [];
    progress.rescueAttempts = 0;
  }

  const routedProgress = markAulaSourceProgress(progress, routed.sourceTrackId);
  return {
    progress: protectConceptualStreak(routedProgress),
    transition,
  };
}

export function legacyMasteryEvidence(): MasteryEvidence {
  return {
    schemaVersion: 1,
    comprehensionStreak: 3,
    independenceStreak: 0,
    fluencyStreak: 0,
    retentionPasses: 0,
    crownedBy: "legacy",
  };
}

const REGRA_PADRAO: MasteryRule = { acertos: 3, de: 3, sessoes: 2 };

function regraValida(rule?: MasteryRule): MasteryRule {
  const acertos = Math.max(1, Math.floor(rule?.acertos ?? REGRA_PADRAO.acertos));
  const de = Math.max(acertos, Math.floor(rule?.de ?? REGRA_PADRAO.de));
  const sessoes = Math.max(1, Math.floor(rule?.sessoes ?? REGRA_PADRAO.sessoes));
  return { acertos, de, sessoes };
}

function compreensaoDaSessaoPronta(evidence: MasteryEvidence): boolean {
  const rule = regraValida(evidence.masteryRule);
  const janela = evidence.comprehensionWindow ?? [];
  return janela.length >= rule.de && janela.filter(Boolean).length >= rule.acertos;
}

function sessoesPassadas(evidence: MasteryEvidence): string[] {
  if (evidence.passedSessionDays?.length) return evidence.passedSessionDays;
  return evidence.candidateDay ? [evidence.candidateDay] : [];
}

export function faltaParaCoroa(
  evidence: MasteryEvidence | undefined,
  descricaoDaEvidencia?: string,
): string | null {
  if (!evidence || evidence.crownedBy) return null;
  const rule = regraValida(evidence.masteryRule);
  if (!compreensaoDaSessaoPronta(evidence)) {
    return rule.acertos === rule.de
      ? `Acertar ${rule.acertos} seguidas no ultimo nivel, na mesma sessao.`
      : `Acertar ${rule.acertos} de ${rule.de} tentativas recentes no ultimo nivel.`;
  }
  if (evidence.independenceStreak < Math.min(3, rule.acertos)) return "Conseguir sem pedir dica.";
  if (evidence.evidenciaDaFicha === false) {
    return descricaoDaEvidencia ?? "Acertar uma vez na condicao mais dificil da competencia.";
  }
  const requeridas = Math.max(2, rule.sessoes);
  const faltam = requeridas - sessoesPassadas(evidence).length;
  if (faltam > 0) {
    return faltam === 1
      ? "Confirmar o dominio em mais uma sessao, depois de alguns dias."
      : `Confirmar o dominio em mais ${faltam} sessoes espacadas.`;
  }
  return null;
}

export function migrateLegacyCrown(progress: Progress): Progress {
  if (!progress.dom || progress.masteryEvidence) return progress;
  return { ...progress, masteryEvidence: legacyMasteryEvidence() };
}

function updateMasteryEvidence(
  before: Progress,
  right: boolean,
  attempt: MasteryAttempt,
): MasteryEvidence {
  if (before.dom) return before.masteryEvidence || legacyMasteryEvidence();

  const anterior = before.masteryEvidence;
  const rule = regraValida(attempt.masteryRule ?? anterior?.masteryRule);
  const janelaHerdada = anterior?.comprehensionWindow
    ? [...anterior.comprehensionWindow]
    : Array(Math.min(anterior?.comprehensionStreak || 0, rule.de)).fill(true);
  const passedDays = [...(anterior?.passedSessionDays
    ?? (anterior?.candidateDay ? [anterior.candidateDay] : []))];

  const evidence: MasteryEvidence = {
    schemaVersion: 1,
    comprehensionStreak: anterior?.comprehensionStreak || 0,
    independenceStreak: anterior?.independenceStreak || 0,
    fluencyStreak: anterior?.fluencyStreak || 0,
    retentionPasses: Math.max(0, passedDays.length - 1),
    candidateDay: anterior?.candidateDay,
    crownedBy: anterior?.crownedBy,
    evidenciaDaFicha: anterior?.evidenciaDaFicha,
    evidenciasVistas: [...(anterior?.evidenciasVistas || [])],
    masteryRule: rule,
    comprehensionWindow: janelaHerdada,
    sessionDay: anterior?.sessionDay,
    passedSessionDays: passedDays,
  };

  if (right && attempt.evidencias?.length) {
    for (const nome of attempt.evidencias) {
      if (!evidence.evidenciasVistas!.includes(nome)) evidence.evidenciasVistas!.push(nome);
    }
  }
  evidence.evidenciaDaFicha = attempt.exigeEvidencia
    ? evidence.evidenciasVistas!.includes(attempt.exigeEvidencia)
    : true;

  if (before.lvl !== 5) return evidence;

  if (evidence.sessionDay !== attempt.practiceDay) {
    evidence.sessionDay = attempt.practiceDay;
    evidence.comprehensionWindow = [];
    evidence.comprehensionStreak = 0;
    evidence.independenceStreak = 0;
    evidence.fluencyStreak = 0;
  }

  evidence.comprehensionWindow = [...(evidence.comprehensionWindow || []), right].slice(-rule.de);
  evidence.comprehensionStreak = right ? Math.min(rule.de, evidence.comprehensionStreak + 1) : 0;
  evidence.independenceStreak = right && !attempt.helpUsed
    ? Math.min(3, evidence.independenceStreak + 1)
    : 0;
  evidence.fluencyStreak = right
    && attempt.targetRtMs !== undefined
    && attempt.durationMs <= attempt.targetRtMs
      ? Math.min(3, evidence.fluencyStreak + 1)
      : 0;

  const sessaoMadura = compreensaoDaSessaoPronta(evidence)
    && evidence.independenceStreak >= Math.min(3, rule.acertos)
    && evidence.evidenciaDaFicha === true;

  if (sessaoMadura && !passedDays.includes(attempt.practiceDay)) {
    const ultima = passedDays.at(-1);
    if (!ultima || calendarDayDistance(ultima, attempt.practiceDay) >= 2) passedDays.push(attempt.practiceDay);
  }

  evidence.passedSessionDays = passedDays;
  evidence.candidateDay = passedDays[0];
  evidence.retentionPasses = Math.max(0, passedDays.length - 1);

  const sessoesNecessarias = Math.max(2, rule.sessoes);
  if (passedDays.length >= sessoesNecessarias) evidence.crownedBy = "multidimensional";
  return evidence;
}
