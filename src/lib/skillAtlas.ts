import type { Progress, State, Track } from "../types";

export type SkillAtlasStatus = "not-started" | "learning" | "consolidating" | "mastered" | "coming-soon";

export interface SkillInsignia {
  id: string;
  name: string;
  island: string;
  icon: string;
  status: SkillAtlasStatus;
  levelReached: number;
  absoluteMastery: boolean;
  contentReady: boolean;
}

export interface DomainAtlasSummary {
  island: string;
  totalReady: number;
  started: number;
  consolidating: number;
  mastered: number;
  currentCompletion01: number;
  /** Verdade pedagógica atual; não é um recibo permanente de achievement. */
  currentlyComplete: boolean;
}

function statusFor(track: Track, progress: Progress | undefined): SkillAtlasStatus {
  if (track.contentStatus === "fallback") return "coming-soon";
  if (progress?.dom === true) return "mastered";
  if (!progress) return "not-started";
  const reached = Math.max(progress.maxLvl ?? 0, progress.lvl ?? 0);
  if (reached >= 5) return "consolidating";
  if ((progress.tot ?? 0) > 0 || reached > 1) return "learning";
  return "not-started";
}

/**
 * Projeção infantil do Curriculum Graph. Ignora deliberadamente XP, moedas,
 * álbum e nível SAGA: nenhuma quantidade de meta-jogo fabrica uma insígnia.
 */
export function deriveSkillInsignia(track: Track, progress: Progress | undefined): SkillInsignia {
  const status = statusFor(track, progress);
  return {
    id: track.id,
    name: track.name,
    island: track.island || track.id.split(".")[0] || "default",
    icon: track.icon,
    status,
    levelReached: Math.max(progress?.maxLvl ?? 0, progress?.lvl ?? 0),
    absoluteMastery: progress?.dom === true,
    contentReady: track.contentStatus !== "fallback",
  };
}

export function deriveSkillAtlas(tracks: Track[], state: State, kidId: string): {
  skills: SkillInsignia[];
  domains: DomainAtlasSummary[];
} {
  const progress = state.progress?.[kidId] ?? {};
  const skills = tracks.map(track => deriveSkillInsignia(track, progress[track.id]));
  const islands = new Map<string, SkillInsignia[]>();
  for (const skill of skills) {
    const list = islands.get(skill.island) ?? [];
    list.push(skill);
    islands.set(skill.island, list);
  }

  const domains = [...islands.entries()].map(([island, all]) => {
    const ready = all.filter(skill => skill.contentReady);
    const mastered = ready.filter(skill => skill.status === "mastered").length;
    const consolidating = ready.filter(skill => skill.status === "consolidating").length;
    const started = ready.filter(skill => skill.status !== "not-started").length;
    return {
      island,
      totalReady: ready.length,
      started,
      consolidating,
      mastered,
      currentCompletion01: ready.length ? mastered / ready.length : 0,
      currentlyComplete: ready.length > 0 && mastered === ready.length,
    };
  });

  return { skills, domains };
}
