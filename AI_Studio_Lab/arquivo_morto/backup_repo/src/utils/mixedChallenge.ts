import { Question, Track, Progress } from "../types";

/**
 * Desafio Misto 👑 (Parte E, item 3 do plano diretor)
 * 1×/dia · 10 questões · recompensa em moedinhas ×2.
 *
 * Receita das 10 questões:
 *  - 40% amostradas dos bancos de revisão 🧠 de TODAS as trilhas da criança
 *  - 30% da trilha de PIOR precisão (mínimo 8 respondidas)
 *  - 30% aleatórias das demais trilhas, cada uma no nível salvo da criança
 * É o "chefão" divertido E a sessão de reforço inteligente disfarçada.
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

export function buildMixedQuestions(
  tracks: Track[],
  progOf: (trackId: string) => Progress,
  total = MIXED_TOTAL
): Question[] {
  const qs: Question[] = [];

  // 40% — bancos de revisão de todas as trilhas (questões que a criança errou)
  const allBank: Question[] = [];
  for (const t of tracks) {
    for (const item of progOf(t.id).bank || []) {
      const q = JSON.parse(JSON.stringify(item.q)) as Question;
      delete (q as any).review;
      delete (q as any).sig;
      if (q.kind !== "groups" && Array.isArray(q.options)) {
        q.options = shuffle(q.options);
      }
      allBank.push(q);
    }
  }
  qs.push(...shuffle(allBank).slice(0, Math.round(total * 0.4)));

  // 30% — trilha de pior precisão (mínimo 8 respondidas)
  let worst: Track | null = null;
  let worstAcc = Infinity;
  for (const t of tracks) {
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

  // Restante — aleatórias das demais trilhas, no nível salvo de cada uma
  let guard = 0;
  while (qs.length < total && guard++ < 200) {
    const t = tracks[Math.floor(Math.random() * tracks.length)];
    if (worst && t.id === worst.id && Math.random() < 0.7) continue;
    qs.push(t.gen(progOf(t.id).lvl || 1));
  }

  return shuffle(qs).slice(0, total);
}

/** Trilha especial do Desafio Misto: consome a lista pré-montada de questões. */
export function buildMixedTrack(tracks: Track[], progOf: (trackId: string) => Progress): Track {
  const qs = buildMixedQuestions(tracks, progOf);
  let i = 0;
  return {
    id: "mista",
    name: "Desafio Misto",
    icon: "👑",
    color: "#F59E0B",
    dark: "#B45309",
    gen: () => qs[i++ % qs.length],
    totalQ: MIXED_TOTAL,
  } as Track;
}
