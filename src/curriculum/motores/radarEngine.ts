/**
 * RadarEngine - Motor de Diagnóstico (Radar de Lacunas) e Revisão Espaçada (Leitner)
 * Conforme Bíblia §8.2, §11.4 e §12.8.
 *
 * Controla a janela rolante de misconceptions (máx 15 por nó) e baldes de repetição (1..5):
 * Força 1: 1 dia, Força 2: 2 dias, Força 3: 4 dias, Força 4: 9 dias, Força 5: 21 dias.
 */

import { Progress } from "../../types";
import { MisconceptionTag, type MisconceptionTagType } from "../../constants/misconceptions";
import { PrimosDivisoresMisconception, type PrimosDivisoresMisconceptionTag } from "../../constants/primosDivisoresMisconceptions";
import { DivisaoDoisDigitosMisconception, type DivisaoDoisDigitosMisconceptionTag } from "../../constants/divisaoDoisDigitosMisconceptions";
import { SomaFracoesMisconception, type SomaFracoesMisconceptionTag } from "../../constants/somaFracoesMisconceptions";
import { RazaoProporcaoMisconception, type RazaoProporcaoMisconceptionTag } from "../../constants/razaoProporcaoMisconceptions";
import { EquacoesMisconception, type EquacoesMisconceptionTag } from "../../constants/equacoesMisconceptions";
import { ContasVirgulaMisconception, type ContasVirgulaMisconceptionTag } from "../../constants/contasVirgulaMisconceptions";
import { VolumePrismasMisconception, type VolumePrismasMisconceptionTag } from "../../constants/volumePrismasMisconceptions";
import { calendarDayDistance, dayKeyFromNowInput, localDay } from "../../utils/calendarDay";

export const SPACING_INTERVALS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 9,
  5: 21,
};

/** Janela máxima de tempo para 2 erros da mesma tag serem considerados o mesmo padrão (10 min) */
const MAX_MISCONCEPTION_INTERVAL_MS = 10 * 60 * 1000;
const CANONICAL_MISCONCEPTION_TAGS = new Set<string>([
  ...Object.values(MisconceptionTag),
  ...Object.values(PrimosDivisoresMisconception),
  ...Object.values(DivisaoDoisDigitosMisconception),
  ...Object.values(SomaFracoesMisconception),
  ...Object.values(RazaoProporcaoMisconception),
  ...Object.values(EquacoesMisconception),
  ...Object.values(ContasVirgulaMisconception),
  ...Object.values(VolumePrismasMisconception),
]);

/**
 * O Radar conceitual aceita somente o catálogo canônico.
 *
 * Sinais de automaticidade/fluência (por exemplo o legado `LENTO_DEDOS`) não
 * são misconceptions matemáticas e não podem abrir Oficina. A validação também
 * protege saves antigos que já carreguem strings históricas fora do catálogo.
 */
export function isCanonicalMisconceptionTag(
  tag: string,
): tag is MisconceptionTagType | PrimosDivisoresMisconceptionTag | DivisaoDoisDigitosMisconceptionTag | SomaFracoesMisconceptionTag | RazaoProporcaoMisconceptionTag | EquacoesMisconceptionTag | ContasVirgulaMisconceptionTag | VolumePrismasMisconceptionTag {
  return CANONICAL_MISCONCEPTION_TAGS.has(tag);
}

/**
 * Registra uma misconception na janela rolante de até 15 eventos por nó.
 */
export function trackMisconception(
  pOrKidId: Progress | string,
  nodeOrTag: string,
  tagArg?: string,
  pMapArg?: Record<string, Progress>
): void {
  let targetProgress: Progress | undefined;

  if (typeof pOrKidId === "object" && pOrKidId !== null) {
    targetProgress = pOrKidId;
    const tag = nodeOrTag;
    if (!tag || !isCanonicalMisconceptionTag(tag)) return;
    if (!targetProgress.misconceptions) {
      targetProgress.misconceptions = [];
    }
    targetProgress.misconceptions.push({ tag, ts: Date.now() });
    if (targetProgress.misconceptions.length > 15) {
      targetProgress.misconceptions = targetProgress.misconceptions.slice(-15);
    }
  } else if (typeof pOrKidId === "string") {
    const node = nodeOrTag;
    const tag = tagArg;
    if (!node || !tag || !isCanonicalMisconceptionTag(tag)) return;

    if (pMapArg && pMapArg[node]) {
      targetProgress = pMapArg[node];
    } else if (pMapArg) {
      pMapArg[node] = {
        lvl: 1,
        streak: 0,
        bad: 0,
        stars: 0,
        ok: 0,
        tot: 0,
        bank: [],
        mast: 1,
        misconceptions: [],
      };
      targetProgress = pMapArg[node];
    }

    if (targetProgress) {
      if (!targetProgress.misconceptions) {
        targetProgress.misconceptions = [];
      }
      targetProgress.misconceptions.push({ tag, ts: Date.now() });
      if (targetProgress.misconceptions.length > 15) {
        targetProgress.misconceptions = targetProgress.misconceptions.slice(-15);
      }
    }
  }
}

/**
 * Varre a janela de erros recente de cada nó no pMap do aluno.
 * Regra do Radar (Bíblia §11.4 e §8.1): 2 ocorrências da MESMA tag em até 5 erros recentes
 * E dentro da janela temporal de sessão (≤ 10 min) = misconception ativa.
 * Erros distantes no tempo ou isolados NUNCA disparam resgate.
 *
 * PÓS-P22 — identidade do resgate:
 * a misconception pertence ao NÓ EM QUE FOI OBSERVADA. O Radar não possui uma
 * segunda árvore curricular tag→nó. Depois que o padrão é confirmado, o
 * `rescuePlanner` recebe esse nó-fonte e, usando o DAG canônico, decide se deve
 * tratá-lo ali ou descer para um pré-requisito ainda imaturo.
 *
 * A tabela histórica `TAG_TO_NODE` foi removida porque tinha três problemas:
 * - `OFF_BY_ONE` esperava uppercase, mas a tag canônica emitida é `off-by-one`;
 * - `LENTO_DEDOS` podia nascer em qualquer rapid-fire/Dojo e era forçado para N1.03;
 * - `ERRO_POSICIONAL` não possuía emissor canônico no runtime atual.
 * Esse roteamento paralelo podia tanto nunca disparar quanto sequestrar um erro
 * de outra competência para um nó sem relação com o contexto observado.
 */
export function getRescueItems(_kidId: string, pMap: Record<string, Progress>): string[] {
  if (!pMap) return [];
  const rescueNodes: Set<string> = new Set();

  for (const [node, progress] of Object.entries(pMap)) {
    const events = progress?.misconceptions;
    if (!events || events.length < 2) continue;

    for (let i = 0; i < events.length; i++) {
      const current = events[i];
      if (!isCanonicalMisconceptionTag(current.tag)) continue;
      const window = events.slice(Math.max(0, i - 4), i + 1);

      const closeMatches = window.filter(
        (e) => isCanonicalMisconceptionTag(e.tag)
          && e.tag === current.tag
          && Math.abs(current.ts - e.ts) <= MAX_MISCONCEPTION_INTERVAL_MS
      );

      if (closeMatches.length >= 2) {
        rescueNodes.add(node);
        break;
      }
    }
  }

  return Array.from(rescueNodes);
}

/**
 * Leitner por força (1 a 5).
 * NUNCA altera `mast` ou `lvl` (preserva o progresso CPA). Grava exclusivamente em `reviewForce`.
 * - Erro: rebaixa a força (-1).
 * - Acerto RÁPIDO (durationMs <= targetRtMs): promove a força (+1).
 * - Acerto LENTO (durationMs > targetRtMs): mantém a força atual.
 */
export function evaluateSpacedRepetition(
  _kidId: string,
  trackId: string,
  right: boolean,
  durationMs: number,
  pMap?: Record<string, Progress>,
  targetRtMs: number = 10000
): { nextReviewDays: number; newForce: number } {
  let currentForce = 1;

  if (pMap && pMap[trackId]) {
    currentForce = pMap[trackId].reviewForce || 1;
  }

  let newForce: number;
  if (!right) {
    newForce = Math.max(1, currentForce - 1);
  } else {
    if (durationMs <= targetRtMs) {
      newForce = Math.min(5, currentForce + 1);
    } else {
      newForce = currentForce;
    }
  }

  if (pMap && pMap[trackId]) {
    pMap[trackId].reviewForce = newForce;
    pMap[trackId].lastDay = localDay();
  }

  const nextReviewDays = SPACING_INTERVALS[newForce] || 1;
  return { nextReviewDays, newForce };
}

/**
 * Retorna os IDs dos nós cuja data da última prática (`lastDay`) ultrapassou o
 * intervalo da força de revisão Leitner. A comparação é por dias CIVIS, não por
 * blocos de 24h; DST e horário da prática não podem antecipar/adiar revisão.
 */
export function getDueReviews(
  pMap: Record<string, Progress>,
  nowIsoOrMs?: string | number
): string[] {
  if (!pMap) return [];
  const dueNodes: string[] = [];
  const today = dayKeyFromNowInput(nowIsoOrMs);

  for (const [node, progress] of Object.entries(pMap)) {
    if (!progress.lastDay) continue;

    const force = progress.reviewForce || 1;
    const intervalDays = SPACING_INTERVALS[force] || 1;
    if (calendarDayDistance(progress.lastDay, today) >= intervalDays) {
      dueNodes.push(node);
    }
  }

  return dueNodes;
}

export const RadarEngine = {
  getRescueItems,
  evaluateSpacedRepetition,
  trackMisconception,
  getDueReviews,
};