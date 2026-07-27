/**
 * RadarEngine - Motor de Diagnóstico (Radar de Lacunas) e Revisão Espaçada (Leitner)
 * Conforme Bíblia §8.2, §11.4 e §12.8.
 *
 * Controla a janela rolante de misconceptions (máx 15 por nó) e baldes de repetição (1..5):
 * Força 1: 1 dia, Força 2: 2 dias, Força 3: 4 dias, Força 4: 9 dias, Força 5: 21 dias.
 */

import { Progress } from "../../types";

export const SPACING_INTERVALS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 9,
  5: 21,
};

/** Janela máxima de tempo para 2 erros da mesma tag serem considerados o mesmo padrão (10 min) */
const MAX_MISCONCEPTION_INTERVAL_MS = 10 * 60 * 1000;

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
    if (!tag) return;
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
    if (!node || !tag) return;

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
 */
export function getRescueItems(_kidId: string, pMap: Record<string, Progress>): string[] {
  if (!pMap) return [];
  const rescueNodes: string[] = [];

  for (const [node, progress] of Object.entries(pMap)) {
    const events = progress?.misconceptions;
    if (!events || events.length < 2) continue;

    let hasActiveMisconception = false;
    for (let i = 0; i < events.length; i++) {
      const current = events[i];
      const window = events.slice(Math.max(0, i - 4), i + 1);

      const closeMatches = window.filter(
        (e) => e.tag === current.tag && Math.abs(current.ts - e.ts) <= MAX_MISCONCEPTION_INTERVAL_MS
      );

      if (closeMatches.length >= 2) {
        hasActiveMisconception = true;
        break;
      }
    }

    if (hasActiveMisconception) {
      rescueNodes.push(node);
    }
  }

  return rescueNodes;
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
    pMap[trackId].lastDay = new Date().toISOString().slice(0, 10);
  }

  const nextReviewDays = SPACING_INTERVALS[newForce] || 1;

  return { nextReviewDays, newForce };
}

/**
 * Retorna os IDs dos nós cuja data da última prática (`lastDay`) ultrapassou o intervalo da força de revisão Leitner.
 */
export function getDueReviews(
  pMap: Record<string, Progress>,
  nowIsoOrMs?: string | number
): string[] {
  if (!pMap) return [];
  const dueNodes: string[] = [];

  const nowMs = typeof nowIsoOrMs === "number"
    ? nowIsoOrMs
    : typeof nowIsoOrMs === "string"
      ? new Date(nowIsoOrMs).getTime()
      : Date.now();

  for (const [node, progress] of Object.entries(pMap)) {
    if (!progress.lastDay) continue;

    const lastDayMs = new Date(progress.lastDay).getTime();
    if (isNaN(lastDayMs)) continue;

    const force = progress.reviewForce || 1;
    const intervalDays = SPACING_INTERVALS[force] || 1;
    const intervalMs = intervalDays * 24 * 60 * 60 * 1000;

    if (nowMs - lastDayMs >= intervalMs) {
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


