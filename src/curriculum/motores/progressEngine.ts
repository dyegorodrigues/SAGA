import { MasteryEvidence, Progress } from "../../types";

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
  /**
   * As condições que ESTA resposta satisfez — a §9 da ficha (P13).
   *
   * Vem do palco, que é o único que sabe: nem o valor da resposta nem o nível
   * dizem se a criança acertou na primeira audição ou sem vaga fantasma.
   */
  evidencias?: string[];
  /**
   * A condição que a ficha EXIGE ter visto pelo menos uma vez.
   *
   * `undefined` numa ficha que não declara nada — e aí a dimensão não bloqueia,
   * exatamente como não bloqueava antes de existir.
   */
  exigeEvidencia?: string;
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
 * Transição pura da escada de proficiência da Jornada.
 *
 * Centraliza a semântica que antes vivia duplicada no GameLoop e no antigo
 * progressEngine. Saves coroados continuam válidos, mas novas coroas só nascem
 * quando compreensão, independência, fluência e retenção estão maduras.
 */
export function applyJourneyAnswer(
  current: Progress,
  right: boolean,
  isWarmup: boolean,
  masteryAttempt?: MasteryAttempt,
  mode: ProgressionMode = { kind: "journey" },
): AnswerProgressResult {
  const progress: Progress = {
    ...current,
    bank: [...(current.bank || [])],
    tot: (current.tot || 0) + 1,
    ok: current.ok || 0,
    streak: current.streak || 0,
    bad: current.bad || 0,
    lvl: current.lvl || 1,
    maxLvl: current.maxLvl || current.lvl || 1,
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

  if (masteryAttempt) {
    if (masteryAttempt.helpUsed) {
      progress.helpClicks = (current.helpClicks || 0) + 1;
    }
    const mastery = updateMasteryEvidence(current, right, masteryAttempt);
    progress.masteryEvidence = mastery;
    if (!progress.dom && mastery.crownedBy === "multidimensional") {
      progress.dom = true;
      transition = { type: "multidimensional-crown" };
    }
  } else if (progress.streak >= 3 && progress.lvl === 5 && !progress.dom) {
    // Compatibilidade para consumidores antigos durante a migração. O GameLoop
    // sempre fornece MasteryAttempt e, portanto, nunca usa este caminho.
    progress.dom = true;
    progress.masteryEvidence = legacyMasteryEvidence();
    transition = { type: "legacy-crown" };
  }

  return { progress, transition };
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

/**
 * O que ainda falta para a coroa, em português — para o painel dos pais.
 *
 * Existe porque a dimensão nova é a única que uma criança pode não alcançar
 * **sem errar nada**: ela acerta tudo, sempre com andaime, e a coroa não vem.
 * Sem uma frase que diga o quê, isso vira "o app travou".
 */
export function faltaParaCoroa(
  evidence: MasteryEvidence | undefined,
  descricaoDaEvidencia?: string,
): string | null {
  if (!evidence || evidence.crownedBy) return null;
  if (evidence.comprehensionStreak < 3) return "Acertar três seguidas no último nível.";
  if (evidence.independenceStreak < 3) return "Conseguir sem pedir dica.";
  if (evidence.evidenciaDaFicha === false) {
    return descricaoDaEvidencia ?? "Acertar uma vez na condição mais difícil da competência.";
  }
  if (evidence.retentionPasses < 1) return "Voltar a acertar depois de alguns dias.";
  return null;
}

export function migrateLegacyCrown(progress: Progress): Progress {
  if (!progress.dom || progress.masteryEvidence) return progress;
  return { ...progress, masteryEvidence: legacyMasteryEvidence() };
}

function dayDistance(from?: string, to?: string): number {
  if (!from || !to) return 0;
  const start = Date.parse(`${from}T00:00:00Z`);
  const end = Date.parse(`${to}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.floor((end - start) / 86400000));
}

function updateMasteryEvidence(
  before: Progress,
  right: boolean,
  attempt: MasteryAttempt,
): MasteryEvidence {
  if (before.dom) {
    return before.masteryEvidence || legacyMasteryEvidence();
  }

  const evidence: MasteryEvidence = {
    schemaVersion: 1,
    comprehensionStreak: before.masteryEvidence?.comprehensionStreak || 0,
    independenceStreak: before.masteryEvidence?.independenceStreak || 0,
    fluencyStreak: before.masteryEvidence?.fluencyStreak || 0,
    retentionPasses: before.masteryEvidence?.retentionPasses || 0,
    candidateDay: before.masteryEvidence?.candidateDay,
    evidenciaDaFicha: before.masteryEvidence?.evidenciaDaFicha,
    evidenciasVistas: [...(before.masteryEvidence?.evidenciasVistas || [])],
  };

  /**
   * ⚠️ A evidência da ficha é colhida em QUALQUER nível, não só no 5.
   *
   * As três primeiras dimensões medem o desempenho no topo da escada, e por
   * isso vivem atrás do `lvl !== 5`. A da ficha é outra coisa: é um FATO
   * histórico — *"ela já fez isto uma vez"* —, e várias das condições da §9 só
   * acontecem fora do nível 5.
   *
   * O caso que obriga: a F48 pede um acerto com a **forma girada**, e o nível 5
   * dela é o dos sólidos, onde giro não existe. Colhida só no topo, essa
   * evidência seria impossível e a competência jamais coroaria.
   */
  if (right && attempt.evidencias?.length) {
    for (const nome of attempt.evidencias) {
      if (!evidence.evidenciasVistas!.includes(nome)) evidence.evidenciasVistas!.push(nome);
    }
  }
  evidence.evidenciaDaFicha = attempt.exigeEvidencia
    ? evidence.evidenciasVistas!.includes(attempt.exigeEvidencia)
    // Ficha que não declara condição extra não é bloqueada por ela — é o mesmo
    // comportamento de antes de o campo existir.
    : true;

  if (before.lvl !== 5) return evidence;

  if (!right) {
    evidence.comprehensionStreak = 0;
    evidence.independenceStreak = 0;
    evidence.fluencyStreak = 0;
    evidence.retentionPasses = 0;
    evidence.candidateDay = undefined;
    // `evidenciasVistas` NÃO é zerada: ela é histórico, não sequência. A §9 diz
    // "pelo menos um acerto" naquela condição — errar depois não desfaz o que
    // ela demonstrou uma vez.
    return evidence;
  }

  evidence.comprehensionStreak = Math.min(3, evidence.comprehensionStreak + 1);
  evidence.independenceStreak = attempt.helpUsed
    ? 0
    : Math.min(3, evidence.independenceStreak + 1);
  // Continua sendo medida — é telemetria e é o que a trilha do Dojo consome —,
  // mas não coroa mais. Ver o comentário em `MasteryEvidence.fluencyStreak`.
  evidence.fluencyStreak = attempt.targetRtMs !== undefined && attempt.durationMs <= attempt.targetRtMs
    ? Math.min(3, evidence.fluencyStreak + 1)
    : 0;

  const coreReady = evidence.comprehensionStreak >= 3 &&
    evidence.independenceStreak >= 3 && evidence.evidenciaDaFicha === true;
  if (!coreReady) {
    evidence.retentionPasses = 0;
    evidence.candidateDay = undefined;
  } else if (!evidence.candidateDay) {
    evidence.candidateDay = attempt.practiceDay;
  }

  const retainedAfterInterval = attempt.isReview && coreReady &&
    dayDistance(evidence.candidateDay, attempt.practiceDay) >= 2 &&
    dayDistance(attempt.previousPracticeDay, attempt.practiceDay) >= 2;
  if (retainedAfterInterval) evidence.retentionPasses += 1;

  if (coreReady && evidence.retentionPasses >= 1) {
    evidence.crownedBy = "multidimensional";
  }
  return evidence;
}
