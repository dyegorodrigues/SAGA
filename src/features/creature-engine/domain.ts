export const CREATURE_SCHEMA_VERSION = 1 as const;

export type CreatureMood =
  | "curioso"
  | "feliz"
  | "calmo"
  | "sonolento"
  | "com_fome"
  | "orgulhoso";

export type CreatureIntent =
  | "idle"
  | "walk"
  | "sleep"
  | "eat"
  | "happy"
  | "sad"
  | "cry"
  | "hurt"
  | "attack"
  | "celebrate"
  | "wake"
  | "sit"
  | "look";

export type CreatureInteraction = "feed" | "play" | "rest" | "pet" | "train";

export interface CreatureNeeds {
  energy: number;
  satiety: number;
  joy: number;
  bond: number;
}

export interface CreatureLearningTotals {
  stars: number;
  correct: number;
  questions: number;
  streak: number;
  lastDay?: string;
}

export interface CreatureSaveV1 {
  schemaVersion: typeof CREATURE_SCHEMA_VERSION;
  speciesId: string;
  speciesName: string;
  nickname: string;
  xp: number;
  evolutionStage: number;
  needs: CreatureNeeds;
  mood: CreatureMood;
  lastReaction: CreatureIntent;
  lastTickAt: number;
  lastInteractionAt: number;
  updatedAt: number;
  learning: CreatureLearningTotals;
  unlockedSpecies: string[];
}

export interface LearningSnapshot extends CreatureLearningTotals {}

const NEED_FLOOR = {
  energy: 20,
  satiety: 20,
  joy: 25,
  bond: 35,
} as const;

const STAGE_THRESHOLDS = [0, 15, 75, 150, 300, 500, 750, 1000] as const;

const ACTION_ALIASES: Readonly<Record<CreatureIntent, readonly string[]>> = {
  idle: ["Idle", "Idle2", "Idle3", "Stand", "Wait"],
  walk: ["Walk", "Run", "Hop"],
  sleep: ["Sleep", "Sleep2", "Laying", "Lie", "Rest"],
  eat: ["Eat", "Bite", "Chomp"],
  happy: ["Happy", "Joy", "Cheer", "Dance", "TailWhip"],
  sad: ["Sad", "Sigh", "Sit", "Laying"],
  cry: ["Cry", "Tear", "Sad"],
  hurt: ["Hurt", "Stun", "Dizzy", "Faint"],
  attack: ["Attack", "Strike", "Scratch", "Punch", "Kick", "Bite", "Shoot"],
  celebrate: ["Dance", "Cheer", "Jump", "Victory", "Special0", "Attack"],
  wake: ["Wake", "Getup", "Idle"],
  sit: ["Sit", "Laying", "Idle"],
  look: ["Look", "Rotate", "Idle2", "Idle"],
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(value * 100) / 100));
}

function safeNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function normalizeSpeciesId(value: unknown, fallback: string): string {
  const raw = String(value ?? fallback).replace(/\D/g, "");
  return (raw || fallback).padStart(4, "0");
}

export function stageForStars(stars: number): number {
  const safeStars = Math.max(0, Math.floor(stars));
  for (let index = STAGE_THRESHOLDS.length - 1; index >= 0; index -= 1) {
    if (safeStars >= STAGE_THRESHOLDS[index]) return index + 1;
  }
  return 1;
}

export function deriveCreatureMood(needs: CreatureNeeds, proud = false): CreatureMood {
  if (proud) return "orgulhoso";
  if (needs.energy <= 34) return "sonolento";
  if (needs.satiety <= 34) return "com_fome";
  if (needs.joy >= 75 && needs.bond >= 65) return "feliz";
  if (needs.joy <= 42) return "calmo";
  return "curioso";
}

export function createCreatureSave(
  speciesId: string,
  speciesName: string,
  nickname = speciesName,
  now = Date.now(),
): CreatureSaveV1 {
  const normalizedId = normalizeSpeciesId(speciesId, "0025");
  return {
    schemaVersion: CREATURE_SCHEMA_VERSION,
    speciesId: normalizedId,
    speciesName: speciesName.trim() || "Pikachu",
    nickname: nickname.trim().slice(0, 18) || speciesName.trim() || "Parceiro",
    xp: 0,
    evolutionStage: 1,
    needs: { energy: 82, satiety: 78, joy: 84, bond: 55 },
    mood: "curioso",
    lastReaction: "idle",
    lastTickAt: now,
    lastInteractionAt: now,
    updatedAt: now,
    learning: { stars: 0, correct: 0, questions: 0, streak: 0 },
    unlockedSpecies: [normalizedId],
  };
}

export function normalizeCreatureSave(
  input: unknown,
  fallbackSpeciesId = "0025",
  fallbackSpeciesName = "Pikachu",
  fallbackNickname = "Faísca",
  now = Date.now(),
): CreatureSaveV1 {
  if (!input || typeof input !== "object") {
    return createCreatureSave(fallbackSpeciesId, fallbackSpeciesName, fallbackNickname, now);
  }

  const raw = input as Partial<CreatureSaveV1>;
  const base = createCreatureSave(
    normalizeSpeciesId(raw.speciesId, fallbackSpeciesId),
    typeof raw.speciesName === "string" ? raw.speciesName : fallbackSpeciesName,
    typeof raw.nickname === "string" ? raw.nickname : fallbackNickname,
    now,
  );
  const rawNeeds = raw.needs || base.needs;
  const needs: CreatureNeeds = {
    energy: clamp(safeNumber(rawNeeds.energy, base.needs.energy), NEED_FLOOR.energy),
    satiety: clamp(safeNumber(rawNeeds.satiety, base.needs.satiety), NEED_FLOOR.satiety),
    joy: clamp(safeNumber(rawNeeds.joy, base.needs.joy), NEED_FLOOR.joy),
    bond: clamp(safeNumber(rawNeeds.bond, base.needs.bond), NEED_FLOOR.bond),
  };
  const learning = raw.learning || base.learning;
  const unlocked = Array.isArray(raw.unlockedSpecies)
    ? raw.unlockedSpecies.map((id) => normalizeSpeciesId(id, base.speciesId))
    : [base.speciesId];
  if (!unlocked.includes(base.speciesId)) unlocked.push(base.speciesId);

  return {
    ...base,
    xp: Math.max(0, Math.floor(safeNumber(raw.xp, base.xp))),
    evolutionStage: Math.max(1, Math.floor(safeNumber(raw.evolutionStage, base.evolutionStage))),
    needs,
    mood: deriveCreatureMood(needs, raw.mood === "orgulhoso"),
    lastReaction: raw.lastReaction || "idle",
    lastTickAt: safeNumber(raw.lastTickAt, now),
    lastInteractionAt: safeNumber(raw.lastInteractionAt, now),
    updatedAt: safeNumber(raw.updatedAt, now),
    learning: {
      stars: Math.max(0, Math.floor(safeNumber(learning.stars, 0))),
      correct: Math.max(0, Math.floor(safeNumber(learning.correct, 0))),
      questions: Math.max(0, Math.floor(safeNumber(learning.questions, 0))),
      streak: Math.max(0, Math.floor(safeNumber(learning.streak, 0))),
      lastDay: typeof learning.lastDay === "string" ? learning.lastDay : undefined,
    },
    unlockedSpecies: [...new Set(unlocked)],
  };
}

/**
 * Aplica passagem de tempo de maneira gentil. As necessidades nunca chegam a zero,
 * não bloqueiam evolução e não causam doença, morte ou regressão.
 */
export function advanceCreatureClock(save: CreatureSaveV1, now = Date.now()): CreatureSaveV1 {
  const elapsedMs = Math.max(0, now - save.lastTickAt);
  if (elapsedMs < 5 * 60 * 1000) return save;

  const elapsedHours = Math.min(72, elapsedMs / 3_600_000);
  const needs: CreatureNeeds = {
    energy: clamp(save.needs.energy - elapsedHours * 0.65, NEED_FLOOR.energy),
    satiety: clamp(save.needs.satiety - elapsedHours * 0.75, NEED_FLOOR.satiety),
    joy: clamp(save.needs.joy - elapsedHours * 0.25, NEED_FLOOR.joy),
    bond: clamp(save.needs.bond, NEED_FLOOR.bond),
  };

  return {
    ...save,
    needs,
    mood: deriveCreatureMood(needs),
    lastReaction: needs.energy <= 34 ? "sleep" : needs.satiety <= 34 ? "eat" : "idle",
    lastTickAt: now,
    updatedAt: now,
  };
}

export function applyCreatureInteraction(
  save: CreatureSaveV1,
  interaction: CreatureInteraction,
  now = Date.now(),
): CreatureSaveV1 {
  const needs = { ...save.needs };
  let reaction: CreatureIntent = "happy";

  if (interaction === "feed") {
    needs.satiety = clamp(needs.satiety + 30);
    needs.energy = clamp(needs.energy + 5);
    needs.bond = clamp(needs.bond + 4);
    reaction = "eat";
  } else if (interaction === "play") {
    needs.joy = clamp(needs.joy + 25);
    needs.bond = clamp(needs.bond + 10);
    needs.energy = clamp(needs.energy - 5, NEED_FLOOR.energy);
    reaction = "happy";
  } else if (interaction === "rest") {
    needs.energy = clamp(needs.energy + 32);
    needs.joy = clamp(needs.joy + 4);
    reaction = "sleep";
  } else if (interaction === "pet") {
    needs.bond = clamp(needs.bond + 15);
    needs.joy = clamp(needs.joy + 8);
    reaction = "happy";
  } else if (interaction === "train") {
    needs.bond = clamp(needs.bond + 6);
    needs.joy = clamp(needs.joy + 6);
    needs.energy = clamp(needs.energy - 3, NEED_FLOOR.energy);
    reaction = "attack";
  }

  return {
    ...save,
    needs,
    mood: deriveCreatureMood(needs, interaction === "train"),
    lastReaction: reaction,
    lastInteractionAt: now,
    lastTickAt: now,
    updatedAt: now,
  };
}

export function learningSnapshotSignature(snapshot: LearningSnapshot): string {
  return [
    Math.max(0, Math.floor(snapshot.stars)),
    Math.max(0, Math.floor(snapshot.correct)),
    Math.max(0, Math.floor(snapshot.questions)),
    Math.max(0, Math.floor(snapshot.streak)),
    snapshot.lastDay || "",
  ].join(":");
}

/**
 * Converte progresso pedagógico em vínculo e celebração. Tentativas e erros nunca
 * retiram XP, vínculo ou evolução; praticar já conta como evidência positiva.
 */
export function applyLearningSnapshot(
  save: CreatureSaveV1,
  snapshot: LearningSnapshot,
  now = Date.now(),
): CreatureSaveV1 {
  const normalized: CreatureLearningTotals = {
    stars: Math.max(0, Math.floor(snapshot.stars)),
    correct: Math.max(0, Math.floor(snapshot.correct)),
    questions: Math.max(0, Math.floor(snapshot.questions)),
    streak: Math.max(0, Math.floor(snapshot.streak)),
    lastDay: snapshot.lastDay,
  };
  if (learningSnapshotSignature(save.learning) === learningSnapshotSignature(normalized)) {
    return save;
  }

  const firstSync = save.learning.questions === 0 && save.learning.stars === 0;
  const starDelta = Math.max(0, normalized.stars - save.learning.stars);
  const questionDelta = Math.max(0, normalized.questions - save.learning.questions);
  const correctDelta = Math.max(0, normalized.correct - save.learning.correct);
  const practiced = starDelta > 0 || questionDelta > 0 || correctDelta > 0;
  const needs = { ...save.needs };

  if (practiced) {
    needs.joy = clamp(needs.joy + Math.min(18, 4 + starDelta * 2 + correctDelta));
    needs.bond = clamp(needs.bond + Math.min(12, 3 + questionDelta * 0.5));
    needs.energy = clamp(needs.energy + 3);
  }

  const xpGain = firstSync
    ? normalized.stars * 10 + normalized.questions * 2
    : starDelta * 10 + questionDelta * 2;
  const stage = stageForStars(normalized.stars);
  const proud = practiced || stage > save.evolutionStage || normalized.streak >= 3;

  return {
    ...save,
    xp: Math.max(save.xp, save.xp + xpGain),
    evolutionStage: Math.max(save.evolutionStage, stage),
    needs,
    mood: deriveCreatureMood(needs, proud),
    lastReaction: proud ? "celebrate" : "idle",
    updatedAt: now,
    learning: normalized,
  };
}

export function changeCreatureSpecies(
  save: CreatureSaveV1,
  speciesId: string,
  speciesName: string,
  now = Date.now(),
): CreatureSaveV1 {
  const nextId = normalizeSpeciesId(speciesId, save.speciesId);
  const wasDefaultNickname =
    save.nickname.trim().toLocaleLowerCase("pt-BR") === save.speciesName.trim().toLocaleLowerCase("pt-BR");
  return {
    ...save,
    speciesId: nextId,
    speciesName: speciesName.trim() || save.speciesName,
    nickname: wasDefaultNickname ? speciesName.trim() || save.nickname : save.nickname,
    lastReaction: "celebrate",
    unlockedSpecies: [...new Set([...save.unlockedSpecies, nextId])],
    updatedAt: now,
  };
}

function normalizeActionName(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
}

export function resolvePmdAction(intent: CreatureIntent, availableActions: readonly string[]): string | undefined {
  if (!availableActions.length) return undefined;
  const normalized = new Map(availableActions.map((action) => [normalizeActionName(action), action]));

  for (const alias of ACTION_ALIASES[intent]) {
    const exact = normalized.get(normalizeActionName(alias));
    if (exact) return exact;
  }

  for (const alias of ACTION_ALIASES[intent]) {
    const needle = normalizeActionName(alias);
    const partial = availableActions.find((action) => normalizeActionName(action).includes(needle));
    if (partial) return partial;
  }

  return (
    normalized.get("idle") ||
    normalized.get("walk") ||
    availableActions.find((action) => normalizeActionName(action).includes("idle")) ||
    availableActions[0]
  );
}

export function chooseAutonomousIntent(save: CreatureSaveV1, entropy: number): CreatureIntent {
  if (save.needs.energy <= 34) return "sleep";
  if (save.needs.satiety <= 34) return "eat";
  if (save.needs.joy <= 40) return entropy < 0.5 ? "sad" : "sit";

  const value = Math.min(0.9999, Math.max(0, entropy));
  if (value < 0.34) return "idle";
  if (value < 0.58) return "walk";
  if (value < 0.72) return "look";
  if (value < 0.84) return "sit";
  if (value < 0.94) return "happy";
  return "celebrate";
}

export function creatureStatesEqual(a: CreatureSaveV1, b: CreatureSaveV1): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
