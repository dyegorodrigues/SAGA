import type { Question } from "../types";
import type { TutStep } from "../contracts/pedagogySteps";
import { LEGACY_CHOREOGRAPHIES } from "./choreographyRegistry";

export type { TutStep } from "../contracts/pedagogySteps";

export const hasTutorial = (q: Question | string | undefined | null): boolean => {
  if (!q) return false;
  if (typeof q === 'string') return q in LEGACY_CHOREOGRAPHIES;
  return (q.tutorial && q.tutorial.length > 0) || q.kind in LEGACY_CHOREOGRAPHIES;
};

export const tutorialSteps = (q: Question | undefined | null): TutStep[] => {
  if (!q) return [];
  if (q.tutorial && Array.isArray(q.tutorial)) {
    return q.tutorial;
  }
  return LEGACY_CHOREOGRAPHIES[q.kind] || [];
};

export const hasAulinha = (q: Question | string | undefined | null): boolean => hasTutorial(q);

const AULA_KEY = "mk-aula-seen-v1";
type AulaStore = Pick<Storage, "getItem" | "setItem">;

const store = (): AulaStore | null => {
  try { return typeof window !== "undefined" && window.localStorage ? window.localStorage : null; }
  catch { return null; }
};

export function aulaSeen(kidId: string, kind: string, s: AulaStore | null = store()): boolean {
  if (!s) return true;
  try {
    const map = JSON.parse(s.getItem(AULA_KEY) || "{}");
    return !!map?.[kidId]?.[kind];
  } catch { return true; }
}

export function markAulaSeen(kidId: string, kind: string, s: AulaStore | null = store()): void {
  if (!s) return;
  try {
    const map = JSON.parse(s.getItem(AULA_KEY) || "{}");
    map[kidId] = { ...(map[kidId] || {}), [kind]: true };
    s.setItem(AULA_KEY, JSON.stringify(map));
  } catch {}
}
