import { Question } from "../types";
import { LEGACY_CHOREOGRAPHIES } from "./choreographyRegistry";

export interface TutStep {
  say: string;
  ms?: number;
  show?: string | number | Record<string, any>;
  sync?: "junto" | "depois";
}

export const hasTutorial = (q: Question | string): boolean => {
  if (typeof q === 'string') return q in LEGACY_CHOREOGRAPHIES;
  return (q.tutorial && q.tutorial.length > 0) || q.kind in LEGACY_CHOREOGRAPHIES;
};

export const tutorialSteps = (q: Question): TutStep[] => {
  if (q.tutorial && Array.isArray(q.tutorial)) {
    return q.tutorial;
  }
  return LEGACY_CHOREOGRAPHIES[q.kind] || [];
};

export const hasAulinha = (q: Question | string): boolean => hasTutorial(q);

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
