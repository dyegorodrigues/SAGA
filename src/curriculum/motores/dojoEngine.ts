import { FactStrength, ProcStrength } from "../../types";

export interface DojoCandidate {
  id: string;
  category: "current" | "review" | "hot" | "next";
  isEasy: boolean;
}

export function getTargetRt(trackId: string): number {
  if (trackId === "FD1" || trackId === "FD2") return 3000;
  if (trackId === "FD3" || trackId === "FD4") return 4000;
  if (trackId === "FD5" || trackId === "FD6") return 5000;
  if (trackId === "FD7" || trackId === "FD8") return 6000;
  return 10000; // PD etc
}

export function normalizeFactId(factId: string): string {
  const match = factId.match(/^(\d+)([x+])(\d+)$/);
  if (match) {
    const a = parseInt(match[1], 10);
    const op = match[2];
    const b = parseInt(match[3], 10);
    if (a > b) {
      return `${b}${op}${a}`;
    }
  }
  return factId;
}

export function evaluateFact(
  trackId: string,
  fact: FactStrength,
  right: boolean,
  durationMs: number,
  nowMs: number = Date.now()
): FactStrength {
  const targetRt = getTargetRt(trackId);
  const updated = { ...fact };
  const isFirstTime = !updated.ultima_vez;
  const lastTimeMs = isFirstTime ? NaN : new Date(updated.ultima_vez).getTime();
  const daysSince = isNaN(lastTimeMs) ? 0 : (nowMs - lastTimeMs) / (1000 * 60 * 60 * 24);

  let appliedDecay = false;
  // Decaimento: força 4-5 sem treino há 14+ dias cai 1 ao reaparecer errado
  if (!right && updated.forca >= 4 && daysSince >= 14) {
    updated.forca = Math.max(0, updated.forca - 1);
    appliedDecay = true;
  }

  if (right) {
    updated.erros_seguidos = 0;
    if (durationMs <= targetRt) {
      updated.forca = Math.min(5, updated.forca + 1);
    }
    // acerto LENTO mantém
  } else {
    updated.erros_seguidos = (updated.erros_seguidos || 0) + 1;
    if (!appliedDecay) {
      updated.forca = Math.max(0, updated.forca - 1); // cai 1 pelo erro se não sofreu decaimento
    }
  }

  updated.ultima_vez = new Date(nowMs).toISOString();
  updated.rt_medio = isFirstTime ? durationMs : (updated.rt_medio * 0.7) + (durationMs * 0.3);

  return updated;
}

export function evaluateProc(
  trackId: string,
  proc: ProcStrength,
  right: boolean,
  durationMs: number,
  failedStep?: string,
  nowMs: number = Date.now()
): ProcStrength {
  const updated = { ...proc };
  const isFirstTime = !updated.ultima_vez;
  const lastTimeMs = isFirstTime ? NaN : new Date(updated.ultima_vez).getTime();
  const daysSince = isNaN(lastTimeMs) ? 0 : (nowMs - lastTimeMs) / (1000 * 60 * 60 * 24);

  let appliedDecay = false;
  // Decaimento também se aplica a PD
  if (!right && updated.forca >= 4 && daysSince >= 14) {
    updated.forca = Math.max(0, updated.forca - 1);
    appliedDecay = true;
  }

  if (right) {
    updated.erros_seguidos = 0;
    const isFast = isFirstTime || durationMs <= updated.tempo_medio;
    const isAccurate = isFirstTime ? true : updated.precisao >= 90;
    
    if (isFast && isAccurate) {
      updated.forca = Math.min(5, updated.forca + 1);
    }
  } else {
    updated.erros_seguidos = (updated.erros_seguidos || 0) + 1;
    if (!appliedDecay) {
      updated.forca = Math.max(0, updated.forca - 1);
    }
    if (failedStep) {
      updated.passo_fraco = failedStep;
    }
  }
  
  updated.ultima_vez = new Date(nowMs).toISOString();
  updated.precisao = isFirstTime ? (right ? 100 : 0) : (updated.precisao * 0.7) + (right ? 100 : 0) * 0.3;
  updated.tempo_medio = isFirstTime ? durationMs : (updated.tempo_medio * 0.7) + (durationMs * 0.3);

  return updated;
}

export function getDailyWarmup(
  candidates: DojoCandidate[],
  totalSize: number = 10
): string[] {
  if (totalSize < 3) totalSize = 3; 

  const targets = {
    current: Math.round(totalSize * 0.6),
    review: Math.round(totalSize * 0.2),
    hot: Math.round(totalSize * 0.1),
    next: Math.round(totalSize * 0.1),
  };

  let sum = targets.current + targets.review + targets.hot + targets.next;
  while (sum > totalSize) { targets.current--; sum--; }
  while (sum < totalSize) { targets.current++; sum++; }

  const pool = {
    current: [...candidates.filter(c => c.category === "current")],
    review: [...candidates.filter(c => c.category === "review")],
    hot: [...candidates.filter(c => c.category === "hot")],
    next: [...candidates.filter(c => c.category === "next")],
  };

  const selected: DojoCandidate[] = [];

  const pick = (cat: "current" | "review" | "hot" | "next", count: number) => {
    for (let i = 0; i < count; i++) {
      if (pool[cat].length > 0) {
        selected.push(pool[cat].shift()!);
      }
    }
  };

  pick("current", targets.current);
  pick("review", targets.review);
  pick("hot", targets.hot);
  pick("next", targets.next);

  const fillOrder: ("current"|"review"|"next"|"hot")[] = ["current", "review", "next", "hot"];
  for (const cat of fillOrder) {
    while (selected.length < totalSize && pool[cat].length > 0) {
      selected.push(pool[cat].shift()!);
    }
  }

  const easyItems: DojoCandidate[] = [];
  const normalItems: DojoCandidate[] = [];

  for (const item of selected) {
    if (item.isEasy && easyItems.length < 3) {
      easyItems.push(item);
    } else {
      normalItems.push(item);
    }
  }

  // Tenta buscar fáceis do pool não selecionado mantendo a proporção da categoria
  if (easyItems.length < 3) {
    for (let i = normalItems.length - 1; i >= 0; i--) {
      if (easyItems.length >= 3) break;
      const norm = normalItems[i];
      const easyReplacementIdx = pool[norm.category].findIndex(c => c.isEasy);
      if (easyReplacementIdx !== -1) {
        const easyReplacement = pool[norm.category].splice(easyReplacementIdx, 1)[0];
        easyItems.push(easyReplacement);
        normalItems.splice(i, 1);
      }
    }
  }

  const finalSequence = [...normalItems, ...easyItems];
  return finalSequence.map(c => c.id).slice(0, totalSize);
}

export const DojoEngine = {
  getTargetRt,
  normalizeFactId,
  evaluateFact,
  evaluateProc,
  getDailyWarmup,
};
