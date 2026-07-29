import { Question, Track, Progress } from "../types";

/**
 * E3 do Professor Mágico — a MATRÍCULA 🎒 (placement disfarçado de brincadeira)
 * (blueprint-professor-magico.md, Peça 1)
 *
 * Primeira vez no perfil (nenhum progresso): em vez de jogar a criança num menu,
 * o mascote convida: "quer me mostrar o que você sabe?". A missão percorre a ESCADA
 * das habilidades-núcleo (2 sondas por trilha: uma fácil, uma alta) e, no fim, SEMEIA
 * o nível real de cada trilha — fim do "todo mundo começa do 1". A idade só decidiu
 * quais trilhas existem (a série); daqui em diante manda a COMPETÊNCIA.
 *
 * Sem cara de prova: é uma missão normal (mascote elogia, nada pune). Determinística
 * e offline, como toda a escola.
 */

/** habilidades-núcleo sondadas, em ordem de currículo (as que existirem na série) */
const CORE_IDS = ["N1.01", "N1.02", "N1.07", "N1.03", "N1.08", "N1.09", "N1.10", "N1.11", "N2.01"];
/** senso numérico = pode sondar um pouco mais alto (é perceptual, não pune);
 *  operações (soma/subtração/dezenas) = SÓ sondas GENTIS e visuais (nível 1-2),
 *  nunca a subtração abstrata de nível 4 que massacra o iniciante. */
const NUM_SENSE = new Set(["N1.01", "N1.02", "N1.07", "N1.03", "N1.08"]);
const probesFor = (id: string): [number, number] => (NUM_SENSE.has(id) ? [1, 2] : [1, 2]);
/** máximo de trilhas sondadas (mantém a missão curta e sem fadiga) */
const MAX_TRACKS = 6;

export interface MatriculaStep {
  trackId: string;
  lvl: number;
}

export function buildMatriculaLadder(tracks: Track[]): MatriculaStep[] {
  const core = CORE_IDS.map((id) => tracks.find((t) => t.id === id)).filter((t): t is Track => !!t).slice(0, MAX_TRACKS);
  const ladder: MatriculaStep[] = [];
  for (const t of core) {
    const [low, high] = probesFor(t.id);
    ladder.push({ trackId: t.id, lvl: low });
    ladder.push({ trackId: t.id, lvl: high });
  }
  return ladder;
}

/** A trilha sintética da Matrícula: serve as sondas NA ORDEM da escada. */
export function buildMatriculaTrack(tracks: Track[]): { track: Track; ladder: MatriculaStep[] } {
  const ladder = buildMatriculaLadder(tracks);
  const byId = new Map(tracks.map((t) => [t.id, t]));
  const qs: Question[] = ladder.map((s) => {
    try {
      return byId.get(s.trackId)!.gen(s.lvl);
    } catch (e) {
      return { kind: "plain", prompt: "Qual é maior?", big: "3 ou 5", options: [{ value: 3 }, { value: 5 }], answer: 5 };
    }
  });
  let i = 0;
  return {
    ladder,
    track: {
      id: "matricula",
      name: "Missão de Boas-Vindas",
      icon: "🎒",
      color: "#0EA5E9",
      dark: "#0369A1",
      gen: () => {
        if (qs.length === 0) return { kind: "plain", prompt: "Tudo pronto!", big: "🌟", options: [{ label: "1", value: 1 }], answer: 1 };
        return qs[i++ % Math.max(1, qs.length)];
      },
      totalQ: qs.length || 1,
    } as Track,
  };
}

/** Converte os acertos da missão (na ordem da escada) nos níveis SEMEADOS por trilha.
 *  Lê os níveis reais das sondas (baixa/alta) de cada par no ladder — gentis por design.
 *  Regra por par de sondas (baixa=L, alta=H):
 *   acertou as duas  → começa em H+1 (tem folga, provou que domina até H);
 *   só a baixa       → começa em H (pratica na fronteira — a ZDP; a warm-up já suaviza);
 *   nenhuma          → começa do 1 (a escola acolhe do zero, SEM insistir no que não sabe).
 *  maxLvl (bolinhas) acompanha só o que foi CONQUISTADO com acerto. */
export function seedFromResults(ladder: MatriculaStep[], results: boolean[]): Record<string, Progress> {
  const today = new Date().toISOString().slice(0, 10);
  const seeds: Record<string, Progress> = {};
  for (let i = 0; i + 1 < ladder.length; i += 2) {
    const id = ladder[i].trackId;
    const L = ladder[i].lvl, H = ladder[i + 1].lvl;
    const low = !!results[i];
    const high = !!results[i + 1];
    const lvl = low && high ? Math.min(5, H + 1) : low ? H : 1;
    const maxLvl = high ? H : low ? L : 1;
    seeds[id] = {
      lvl,
      streak: 0,
      bad: 0,
      stars: 0,
      ok: (low ? 1 : 0) + (high ? 1 : 0),
      tot: 2,
      bank: [],
      mast: 0,
      maxLvl,
      lastDay: today,
    };
  }
  return seeds;
}
