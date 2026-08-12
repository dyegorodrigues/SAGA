import { Question, Track, Progress } from "../../types";
import { ALL_MATH_TRACKS } from "./curriculum";

/**
 * Desafio Misto 👑 — interleaving opcional do repertório CONQUISTADO.
 *
 * Não é placement, não ensina conteúdo novo e não decide currículo. A criança
 * só encontra competências já dominadas conceitualmente e realmente praticadas.
 * Série/idade não limita o universo: o conjunto possível é o currículo
 * matemático canônico; o próprio Progress decide o que entra.
 */

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const MIXED_TOTAL = 10;
/** Interleaving exige pluralidade real; uma única habilidade não é "Misto". */
export const MIXED_MIN_ELIGIBLE_TRACKS = 2;

/**
 * Callers legados ainda podem entregar apenas `tracks[kid.grade]`. Isso NÃO pode
 * voltar a transformar série em autoridade curricular. O universo sempre se
 * expande para `ALL_MATH_TRACKS`; tracks recebidas com o mesmo id vencem apenas
 * para preservar doubles/bindings explicitamente resolvidos.
 */
export function canonicalMixedUniverse(input: Track[]): Track[] {
  const overrides = new Map(input.map(track => [track.id, track] as const));
  return ALL_MATH_TRACKS.map(track => overrides.get(track.id) ?? track);
}

/**
 * Repertório seguro do desafio Mestre.
 *
 * `dom=true` é a evidência canônica de domínio conceitual. `tot>0` impede save
 * incoerente/legado de liberar algo nunca praticado. Fallback não entra: dominar
 * um registro histórico não autoriza servir uma tela "Em construção".
 */
export function mixedEligibleTracks(
  tracks: Track[],
  progOf: (trackId: string) => Progress,
): Track[] {
  return canonicalMixedUniverse(tracks).filter(track => {
    const progress = progOf(track.id);
    const hasRealContent = track.contentStatus !== "fallback";
    return progress?.dom === true && (progress.tot || 0) > 0 && hasRealContent;
  });
}

export function canBuildMixedChallenge(
  tracks: Track[],
  progOf: (trackId: string) => Progress,
): boolean {
  return mixedEligibleTracks(tracks, progOf).length >= MIXED_MIN_ELIGIBLE_TRACKS;
}

function mixedUnavailableQuestion(): Question {
  return {
    kind: "plain",
    isFallback: true,
    prompt: "O Desafio Mestre abre quando você dominar pelo menos duas habilidades.",
    big: "🏆",
    options: [{ label: "Tudo bem", value: "ok" }],
    answer: "ok",
  };
}

export function buildMixedQuestions(
  tracks: Track[],
  progOf: (trackId: string) => Progress,
  total = MIXED_TOTAL
): Question[] {
  const eligible = mixedEligibleTracks(tracks, progOf);
  if (eligible.length < MIXED_MIN_ELIGIBLE_TRACKS) return [];

  const qs: Question[] = [];

  // 40% — banco SOMENTE de competências já elegíveis para o Misto.
  const allBank: Question[] = [];
  for (const t of eligible) {
    for (const item of progOf(t.id).bank || []) {
      const q = JSON.parse(JSON.stringify(item.q)) as Question;
      // No Misto a questão não é um evento de revisão do banco: a sessão é um
      // desafio sintético e não deve remover/alterar banco conceitual por fora do
      // Composer/Radar. O source, porém, foi filtrado antes de chegar aqui.
      delete (q as any).review;
      delete (q as any).sig;
      if (q.kind !== "groups" && Array.isArray(q.options)) {
        q.options = shuffle(q.options);
      }
      allBank.push(q);
    }
  }
  qs.push(...shuffle(allBank).slice(0, Math.round(total * 0.4)));

  // 30% — pior precisão, mas apenas DENTRO do repertório dominado.
  let worst: Track | null = null;
  let worstAcc = Infinity;
  for (const t of eligible) {
    const p = progOf(t.id);
    if ((p.tot || 0) >= 8) {
      const acc = (p.ok || 0) / p.tot;
      if (acc < worstAcc) {
        worstAcc = acc;
        worst = t;
      }
    }
  }
  if (worst) {
    const lvl = progOf(worst.id).lvl || 1;
    const n = Math.round(total * 0.3);
    for (let i = 0; i < n; i++) qs.push(worst.gen(lvl));
  }

  // Restante — aleatórias apenas das competências dominadas elegíveis.
  let guard = 0;
  while (qs.length < total && guard++ < 200) {
    const t = eligible[Math.floor(Math.random() * eligible.length)];
    if (worst && t.id === worst.id && Math.random() < 0.7) continue;
    qs.push(t.gen(progOf(t.id).lvl || 1));
  }

  return shuffle(qs).slice(0, total);
}

/**
 * Trilha sintética do Desafio Misto.
 *
 * Uma rota antiga/direta não pode furar o gate: se o repertório for insuficiente,
 * devolvemos uma única carta neutra `isFallback`. O GameLoop não persiste
 * fallback, portanto nenhum conteúdo arbitrário vira evidência curricular.
 */
export function buildMixedTrack(tracks: Track[], progOf: (trackId: string) => Progress): Track {
  const qs = buildMixedQuestions(tracks, progOf);
  const available = qs.length > 0;
  const served = available ? qs : [mixedUnavailableQuestion()];
  let i = 0;
  return {
    id: "mista",
    name: "Desafio Misto",
    icon: "👑",
    color: "#F59E0B",
    dark: "#B45309",
    gen: () => served[i++ % served.length],
    totalQ: available ? MIXED_TOTAL : 1,
  } as Track;
}
