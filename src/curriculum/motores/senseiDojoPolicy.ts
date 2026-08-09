import type { Progress, Question } from "../../types";
import type { FluencyItemKind } from "./senseiDojoEngine";

export type SenseiDojoTempleId = "dojo_add" | "dojo_sub" | "dojo_mul" | "dojo_div";

export interface SenseiDojoLevelPolicy {
  requires: string[];
  itemKind: FluencyItemKind;
}

export const SENSEI_DOJO_LEVEL_POLICIES: Record<SenseiDojoTempleId, Record<number, SenseiDojoLevelPolicy>> = {
  dojo_add: {
    1: { requires: ["N3.01"], itemKind: "fact" },
    2: { requires: ["N3.01"], itemKind: "fact" },
    3: { requires: ["N1.11"], itemKind: "fact" },
    4: { requires: ["N3.07"], itemKind: "fact" },
    5: { requires: ["N2.01", "N3.01"], itemKind: "procedure" },
    6: { requires: ["N3.09"], itemKind: "procedure" },
    7: { requires: ["N3.11"], itemKind: "procedure" },
    8: { requires: ["N3.09"], itemKind: "procedure" },
    9: { requires: ["N3.09"], itemKind: "procedure" },
    10: { requires: ["N3.11"], itemKind: "procedure" },
  },
  dojo_sub: {
    1: { requires: ["N3.02"], itemKind: "fact" },
    2: { requires: ["N3.02"], itemKind: "fact" },
    3: { requires: ["N3.05"], itemKind: "fact" },
    4: { requires: ["N3.08"], itemKind: "fact" },
    5: { requires: ["N3.08", "N2.01"], itemKind: "procedure" },
    6: { requires: ["N3.09"], itemKind: "procedure" },
    7: { requires: ["N3.12"], itemKind: "procedure" },
    8: { requires: ["N3.09"], itemKind: "procedure" },
    9: { requires: ["N3.09"], itemKind: "procedure" },
    10: { requires: ["N3.12"], itemKind: "procedure" },
  },
  dojo_mul: {
    1: { requires: ["N4.03"], itemKind: "fact" },
    2: { requires: ["N4.04"], itemKind: "fact" },
    3: { requires: ["N4.04"], itemKind: "fact" },
    4: { requires: ["N4.03"], itemKind: "fact" },
    5: { requires: ["N4.04"], itemKind: "fact" },
    6: { requires: ["N4.07"], itemKind: "fact" },
    7: { requires: ["N4.07"], itemKind: "fact" },
    8: { requires: ["N4.07"], itemKind: "fact" },
    9: { requires: ["N4.07"], itemKind: "fact" },
    10: { requires: ["N4.08"], itemKind: "procedure" },
  },
  dojo_div: {
    1: { requires: ["N4.05", "N4.06", "N4.03"], itemKind: "fact" },
    2: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
    3: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
    4: { requires: ["N4.05", "N4.06", "N4.03"], itemKind: "fact" },
    5: { requires: ["N4.05", "N4.06", "N4.04"], itemKind: "fact" },
    6: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
    7: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
    8: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
    9: { requires: ["N4.06", "N4.07"], itemKind: "fact" },
    10: { requires: ["N4.06", "N2.04"], itemKind: "procedure" },
  },
};

const conceptLevel = (progress?: Progress): number => progress?.dom
  ? 5
  : Math.max(progress?.maxLvl ?? 0, progress?.lvl ?? 0);

export function maxEligibleSenseiDojoStepById(
  templeId: SenseiDojoTempleId,
  progressByNode: Record<string, Progress>,
): number {
  const policies = SENSEI_DOJO_LEVEL_POLICIES[templeId];
  let ceiling = 0;
  for (let step = 1; step <= 10; step += 1) {
    const policy = policies[step];
    if (!policy || !policy.requires.every(id => conceptLevel(progressByNode[id]) >= 3)) break;
    ceiling = step;
  }
  return ceiling;
}

let token = 0;

function normalizeFact(templeId: SenseiDojoTempleId, expr: string | undefined): string {
  const values = (expr ?? "").match(/\d+/g)?.map(Number) ?? [];
  const [a, b] = values;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return `${templeId}:${expr ?? "unknown"}`;
  if (templeId === "dojo_add" || templeId === "dojo_mul") {
    const [lo, hi] = [a, b].sort((x, y) => x - y);
    return `${templeId}:${lo}:${hi}`;
  }
  return `${templeId}:${a}:${b}`;
}

export interface SenseiDojoQuestionMeta {
  templeId: SenseiDojoTempleId;
  step: number;
  itemId: string;
  itemKind: FluencyItemKind;
  token: number;
}

export function stampSenseiDojoQuestion(
  templeId: SenseiDojoTempleId,
  rawStep: number,
  question: Question,
): Question {
  const step = Math.min(10, Math.max(1, Math.round(rawStep)));
  const policy = SENSEI_DOJO_LEVEL_POLICIES[templeId][step];
  if (!policy) throw new Error(`${templeId} sem política de fluência no nível ${step}.`);
  if (!Number.isFinite(question.rt_max_s) || (question.rt_max_s as number) <= 0) {
    throw new Error(`${templeId} nível ${step} sem rt_max_s válido.`);
  }
  const itemId = policy.itemKind === "fact"
    ? normalizeFact(templeId, question.expr)
    : `${templeId}:L${step}`;
  const meta: SenseiDojoQuestionMeta = {
    templeId,
    step,
    itemId,
    itemKind: policy.itemKind,
    token: ++token,
  };
  return {
    ...question,
    uiProps: {
      ...(question.uiProps ?? {}),
      fluency: meta,
    },
  };
}

export function senseiDojoMeta(question: Question): SenseiDojoQuestionMeta | undefined {
  const meta = question.uiProps?.fluency as SenseiDojoQuestionMeta | undefined;
  return meta && SENSEI_DOJO_LEVEL_POLICIES[meta.templeId]?.[meta.step] ? meta : undefined;
}
