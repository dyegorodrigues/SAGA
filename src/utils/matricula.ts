import { Question, Track, Progress } from "../types";
import { ALL_MATH_TRACKS } from "../curriculum/motores/curriculum";
import { localDay } from "./calendarDay";

/**
 * E3 do Professor Mágico — a MATRÍCULA 🎒 (placement disfarçado de brincadeira)
 *
 * A Matrícula não é currículo e não concede domínio. Ela só estima um ponto de
 * partida para que o Sensei não trate toda criança como nível 1. Série/idade não
 * limita o teto: o universo possível é o currículo matemático canônico e cada
 * sonda só existe se o runtime realmente consegue servi-la.
 *
 * O GameLoop chama `onCommit`/progressEngine ANTES de gerar a próxima questão.
 * Aproveitamos esse boundary para registrar o resultado terminal da sonda e
 * escolher a próxima âncora em uma sessão adaptativa, sem reescrever o GameLoop.
 */

export const MATRICULA_MAX_PAIRS = 8;
export const MATRICULA_MIN_PAIRS = 3;
export const MATRICULA_MAX_QUESTIONS = MATRICULA_MAX_PAIRS * 2;

/**
 * Grafo de ROTEAMENTO DA AVALIAÇÃO, não grafo curricular.
 *
 * Cada id já pertence ao DAG canônico. `pass` só decide qual habilidade vale
 * sondar depois; não cria unlock, prerequisite ou domínio paralelo.
 */
const PLACEMENT_ROUTE: Record<string, { pass?: string; fail?: string }> = {
  "N1.04": { pass: "N1.10", fail: "N1.01" },
  "N1.01": { pass: "N1.10", fail: "N1.03" },
  "N1.03": { pass: "N1.10", fail: "N1.02" },
  "N1.02": { pass: "N1.10", fail: "N1.07" },
  "N1.07": { pass: "N1.10", fail: "N1.08" },
  "N1.08": { pass: "N1.10", fail: "N1.09" },
  "N1.09": { pass: "N1.10", fail: "N1.05" },
  "N1.05": { pass: "N1.10", fail: "N1.01" },
  "N1.10": { pass: "N2.01", fail: "N1.07" },
  "N2.01": { pass: "N3.09", fail: "N1.10" },
  "N3.09": { pass: "N4.01", fail: "N3.07" },
  "N3.07": { pass: "N3.09", fail: "N1.10" },
  "N4.01": { pass: "N4.05", fail: "N3.07" },
  "N4.03": { pass: "N4.05", fail: "N3.07" },
  "N4.05": { pass: "N5.02", fail: "N4.03" },
  "N5.02": { pass: "N6.02", fail: "N4.05" },
  "N5.03": { pass: "N6.02", fail: "N5.02" },
  "N6.02": { pass: "N6.04", fail: "N5.03" },
  "N6.04": { fail: "N5.03" },
};

const PLACEMENT_ORDER = [
  "N1.01", "N1.03", "N1.02", "N1.07", "N1.08", "N1.09", "N1.05", "N1.04", "N1.10",
  "N2.01", "N3.07", "N3.09", "N4.03", "N4.01", "N4.05", "N5.02", "N5.03", "N6.02", "N6.04",
];

const START_ANCHOR = "N1.04";
const NUMBER_SENSE_IDS = new Set(["N1.01", "N1.02", "N1.03", "N1.04", "N1.05", "N1.07", "N1.08", "N1.09", "N1.10"]);

export interface MatriculaStep {
  trackId: string;
  lvl: number;
}

type MatriculaQuestion = Question & {
  __matriculaSessionId?: string;
  __matriculaTrackId?: string;
  __matriculaLevel?: number;
};

interface MatriculaSession {
  id: string;
  ladder: MatriculaStep[];
  track: Track;
  gen(): Question;
  recordTerminal(right: boolean): void;
}

let sessionCounter = 0;
let activeSession: MatriculaSession | null = null;
let pendingSessionId: string | null = null;

/**
 * Callers legados ainda podem passar `tracks[kid.grade]`. Isso não limita mais
 * a Matrícula: expandimos para `ALL_MATH_TRACKS` e preservamos apenas overrides
 * de mesmo id para bindings/doubles explícitos.
 */
export function canonicalMatriculaUniverse(input: Track[]): Track[] {
  const overrides = new Map(input.map(track => [track.id, track] as const));
  return ALL_MATH_TRACKS.map(track => overrides.get(track.id) ?? track);
}

function placementTracks(input: Track[]): Map<string, Track> {
  const byId = new Map<string, Track>();
  for (const track of canonicalMatriculaUniverse(input)) {
    if (track.contentStatus === "fallback") continue;
    if (!PLACEMENT_ROUTE[track.id] && track.id !== START_ANCHOR) continue;
    byId.set(track.id, track);
  }
  return byId;
}

function probesFor(id: string): [number, number] {
  return NUMBER_SENSE_IDS.has(id) ? [2, 3] : [1, 3];
}

function chooseNextAnchor(
  currentId: string,
  passedPair: boolean,
  available: Map<string, Track>,
  visited: Set<string>,
): string | undefined {
  const preferred = passedPair ? PLACEMENT_ROUTE[currentId]?.pass : PLACEMENT_ROUTE[currentId]?.fail;
  if (preferred && available.has(preferred) && !visited.has(preferred)) return preferred;

  const currentIndex = PLACEMENT_ORDER.indexOf(currentId);
  const direction = passedPair ? 1 : -1;
  if (currentIndex >= 0) {
    for (let i = currentIndex + direction; i >= 0 && i < PLACEMENT_ORDER.length; i += direction) {
      const candidate = PLACEMENT_ORDER[i];
      if (available.has(candidate) && !visited.has(candidate)) return candidate;
    }
  }

  return PLACEMENT_ORDER.find(id => available.has(id) && !visited.has(id));
}

function makeSession(input: Track[]): MatriculaSession {
  const available = placementTracks(input);
  const ladder: MatriculaStep[] = [];
  const visited = new Set<string>();
  let currentAnchor = available.has(START_ANCHOR)
    ? START_ANCHOR
    : PLACEMENT_ORDER.find(id => available.has(id));
  let currentPairResults: boolean[] = [];
  let pairPhase = 0;
  let pairsCompleted = 0;
  let consecutiveWeakPairs = 0;
  let generatedCount = 0;
  const id = `matricula-${Date.now()}-${++sessionCounter}`;

  const syntheticTrack: Track = {
    id: "matricula",
    name: "Missão de Boas-Vindas",
    icon: "🎒",
    color: "#0EA5E9",
    dark: "#0369A1",
    totalQ: MATRICULA_MAX_QUESTIONS,
    gen: () => session.gen(),
  } as Track;

  const stopNow = () => {
    syntheticTrack.totalQ = Math.max(1, generatedCount);
    currentAnchor = undefined;
  };

  const session: MatriculaSession = {
    id,
    ladder,
    track: syntheticTrack,
    gen: () => {
      if (!currentAnchor) {
        return {
          kind: "plain",
          isFallback: true,
          prompt: "Tudo pronto! O Sensei já tem pistas suficientes para começar.",
          big: "🌟",
          options: [{ label: "Continuar", value: "ok" }],
          answer: "ok",
        };
      }

      const source = available.get(currentAnchor);
      if (!source) {
        stopNow();
        return {
          kind: "plain",
          isFallback: true,
          prompt: "Tudo pronto!",
          big: "🌟",
          options: [{ label: "Continuar", value: "ok" }],
          answer: "ok",
        };
      }

      if (pairPhase === 0) {
        visited.add(currentAnchor);
        currentPairResults = [];
      }

      const levels = probesFor(currentAnchor);
      const level = levels[pairPhase];
      let question: Question;
      try {
        question = source.gen(level);
      } catch {
        stopNow();
        return {
          kind: "plain",
          isFallback: true,
          prompt: "Tudo pronto! Vamos começar a aventura.",
          big: "🌟",
          options: [{ label: "Continuar", value: "ok" }],
          answer: "ok",
        };
      }

      ladder.push({ trackId: currentAnchor, lvl: level });
      pairPhase += 1;
      generatedCount += 1;
      return {
        ...question,
        __matriculaSessionId: id,
        __matriculaTrackId: currentAnchor,
        __matriculaLevel: level,
      } as MatriculaQuestion;
    },
    recordTerminal: (right: boolean) => {
      if (!currentAnchor) return;
      currentPairResults.push(right);
      if (currentPairResults.length < 2) return;

      const passedPair = currentPairResults.every(Boolean);
      pairsCompleted += 1;
      consecutiveWeakPairs = passedPair ? 0 : consecutiveWeakPairs + 1;

      if (
        pairsCompleted >= MATRICULA_MAX_PAIRS
        || (pairsCompleted >= MATRICULA_MIN_PAIRS && consecutiveWeakPairs >= 2)
      ) {
        stopNow();
        return;
      }

      const next = chooseNextAnchor(currentAnchor, passedPair, available, visited);
      if (!next) {
        stopNow();
        return;
      }
      currentAnchor = next;
      pairPhase = 0;
      currentPairResults = [];
    },
  };

  return session;
}

/**
 * Boundary chamado pela answerPolicy em toda tentativa. Retry intermediário só
 * prepara o token; o resultado é consumido no progressEngine apenas quando a
 * tentativa realmente vira resposta terminal.
 */
export function prepareMatriculaForAnswer(question: Question): void {
  const sessionId = (question as MatriculaQuestion).__matriculaSessionId;
  pendingSessionId = typeof sessionId === "string" ? sessionId : null;
}

/** Registra UM resultado terminal na sessão adaptativa ativa. */
export function consumeMatriculaTerminal(right: boolean): void {
  const sessionId = pendingSessionId;
  pendingSessionId = null;
  if (!sessionId || !activeSession || activeSession.id !== sessionId) return;
  activeSession.recordTerminal(right);
}

/** Preview da rota de uma criança que passa todos os pares. */
export function buildMatriculaLadder(tracks: Track[]): MatriculaStep[] {
  const available = placementTracks(tracks);
  const visited = new Set<string>();
  const ladder: MatriculaStep[] = [];
  let current = available.has(START_ANCHOR)
    ? START_ANCHOR
    : PLACEMENT_ORDER.find(id => available.has(id));

  for (let pair = 0; pair < MATRICULA_MAX_PAIRS && current; pair += 1) {
    visited.add(current);
    const [low, high] = probesFor(current);
    ladder.push({ trackId: current, lvl: low }, { trackId: current, lvl: high });
    current = chooseNextAnchor(current, true, available, visited);
  }
  return ladder;
}

/** A trilha sintética da Matrícula. `ladder` é preenchida à medida que a sessão escolhe âncoras. */
export function buildMatriculaTrack(tracks: Track[]): { track: Track; ladder: MatriculaStep[] } {
  activeSession = makeSession(tracks);
  pendingSessionId = null;
  return { track: activeSession.track, ladder: activeSession.ladder };
}

/**
 * Converte apenas as sondas REALMENTE respondidas em seeds.
 * Nunca define `dom`: duas sondas de placement não substituem evidência de
 * domínio multidimensional/retido.
 */
export function seedFromResults(ladder: MatriculaStep[], results: boolean[]): Record<string, Progress> {
  const today = localDay();
  const seeds: Record<string, Progress> = {};

  for (let i = 0; i + 1 < ladder.length; i += 2) {
    const lowStep = ladder[i];
    const highStep = ladder[i + 1];
    if (!lowStep || !highStep || lowStep.trackId !== highStep.trackId) continue;

    const id = lowStep.trackId;
    const L = lowStep.lvl;
    const H = highStep.lvl;
    const low = !!results[i];
    const high = !!results[i + 1];
    const both = low && high;
    const lvl = both ? Math.min(5, H + 1) : low ? H : 1;
    const maxLvl = both ? H : low ? L : 1;

    seeds[id] = {
      lvl,
      streak: 0,
      bad: 0,
      stars: 0,
      ok: (low ? 1 : 0) + (high ? 1 : 0),
      tot: 2,
      bank: [],
      mast: 0,
      dom: false,
      maxLvl,
      lastDay: today,
    };
  }
  return seeds;
}
