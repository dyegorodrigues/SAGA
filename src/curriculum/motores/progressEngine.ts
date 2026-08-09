import { MasteryEvidence, MasteryRule, Progress } from "../../types";
import { consumeAulaSourceProgress, markAulaSourceProgress } from "./aulaProgressContext";

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
  /** Evidência que esta micro exige antes de liberar o próximo nível. */
  gateEvidenceBeforeAdvance?: string;
  /** Regra de dominio da micro que gerou esta questao. */
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
 * Transição pura da escada de proficiência da Jornada.
 *
 * Centraliza a semântica que antes vivia duplicada no GameLoop e no antigo
 * progressEngine. Saves coroados continuam válidos, mas novas coroas só nascem
 * quando compreensão, independência, fluência e retenção estão maduras.
 *
 * Na Aula do Dia, `current` pode ser o envelope sintético `aula`. O boundary de
 * resposta registra a identidade da questão e `consumeAulaSourceProgress`
 * troca esse envelope pelo Progress da competência que realmente foi ensinada.
 */
export function applyJourneyAnswer(
  current: Progress,
  right: boolean,
  isWarmup: boolean,
  masteryAttempt?: MasteryAttempt,
  mode: ProgressionMode = { kind: "journey" },
): AnswerProgressResult {
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
      progress.helpClicks = (base.helpClicks || 0) + 1;
    }
    const mastery = updateMasteryEvidence(base, right, masteryAttempt);
    progress.masteryEvidence = mastery;

    if (
      transition?.type === "level-up"
      && masteryAttempt.gateEvidenceBeforeAdvance
      && !(mastery.evidenciasVistas || []).includes(masteryAttempt.gateEvidenceBeforeAdvance)
    ) {
      progress.lvl = base.lvl;
      progress.maxLvl = base.maxLvl || base.lvl;
      // Mantém a prontidão: o próximo acerto que trouxer a evidência libera o
      // nível imediatamente, sem obrigar três acertos NOVOS depois da prova.
      progress.streak = Math.max(progress.streak, mode.kind === "rescue" ? 2 : 3);
      transition = null;
    }

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

  return {
    progress: markAulaSourceProgress(progress, routed.sourceTrackId),
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

/**
 * O que ainda falta para a coroa, em português — para o painel dos pais.
 *
 * Existe porque a dimensão nova é a única que uma criança pode não alcançar
 * **sem errar nada**: ela acerta tudo, sempre com andaime, e a coroa não vem.
 * Sem uma frase que diga o quê, isso vira "o app travou".
 */
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
  // Migracao sem perda: a versao anterior ja guardava o primeiro dia maduro.
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
  if (evidence.independenceStreak < Math.min(3, rule.acertos)) {
    return "Conseguir sem pedir dica.";
  }
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

  // A evidencia especifica da ficha e historica e pode ser colhida antes do L5.
  if (right && attempt.evidencias?.length) {
    for (const nome of attempt.evidencias) {
      if (!evidence.evidenciasVistas!.includes(nome)) evidence.evidenciasVistas!.push(nome);
    }
  }
  evidence.evidenciaDaFicha = attempt.exigeEvidencia
    ? evidence.evidenciasVistas!.includes(attempt.exigeEvidencia)
    : true;

  if (before.lvl !== 5) return evidence;

  // Nao carregamos acertos de uma sessao para completar a janela da seguinte.
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
    // Retencao e parte da coroa multidimensional: sessoes posteriores precisam
    // estar separadas por pelo menos dois dias.
    if (!ultima || dayDistance(ultima, attempt.practiceDay) >= 2) {
      passedDays.push(attempt.practiceDay);
    }
  }

  evidence.passedSessionDays = passedDays;
  evidence.candidateDay = passedDays[0];
  evidence.retentionPasses = Math.max(0, passedDays.length - 1);

  const sessoesNecessarias = Math.max(2, rule.sessoes);
  if (passedDays.length >= sessoesNecessarias) evidence.crownedBy = "multidimensional";
  return evidence;
}
