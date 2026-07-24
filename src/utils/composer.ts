import { Question, Track, Progress } from "../types";
import { computeUnlockStatus } from "./unlockEngine";

/**
 * COMPOSER SAGA — O Orquestrador da Academia Diária
 *
 * Segundo o §6 da Bíblia do SAGA, a sessão na "Academia" (botão Play central)
 * deve possuir exatos 5 blocos, balanceando aprendizado e revisão, nesta ordem:
 *
 * 1. AQUECIMENTO (Warmup): 2-3 questões fáceis, já dominadas (vitória inicial).
 * 2. FRONTEIRA (Frontier): Onde o novo aprendizado acontece (Desbravamento).
 * 3. RESGATE (Rescue): Fixação espaçada (se o RadarEngine pedir).
 * 4. FLUÊNCIA (Fluency): O Bloco Dojo para automatizar cálculos (não confundir
 *    com o Dojo-Pilar standalone onde a criança treina livremente).
 * 5. FECHO (Closure): 1 questão fácil/lúdica para encerrar com um sorriso.
 */

export const FLUENCY_IDS = ["canto", "simbolos", "soma", "sub", "contar", "seq", "vizinhos", "dezenas", "moldura", "amigos"];
const FUN_IDS = ["padroes", "intruso", "olho", "formas", "logica", "graficos"];

// Total de questões varia por faixa etária, mas vamos usar um total em torno de 10-12
export const AULA_TOTAL = 12;

type ProgOf = (trackId: string) => Progress;
const accOf = (p: Progress) => (p.tot ? p.ok / p.tot : -1);
const practiced = (p: Progress) => (p.tot || 0) > 0;

const shuffleOpts = (q: Question): Question => {
  const c = JSON.parse(JSON.stringify(q)) as Question;
  delete (c as any).review;
  delete (c as any).sig;
  if (c.kind !== "groups" && Array.isArray(c.options)) {
    const a = [...c.options];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    c.options = a;
  }
  return c;
};

export interface AulaPlan {
  aquecimento: Track | null;
  fronteira: Track | null;
  resgates: { track: Track; fromBank: boolean }[];
  fluencia: Track | null;
  fecho: Track | null;
  resumo: string;
}

export function planAula(tracks: Track[], progOf: ProgOf): AulaPlan {
  const pMap: Record<string, Progress> = {};
  for (const t of tracks) {
    if (t.graphId) pMap[t.graphId] = progOf(t.id);
  }
  const status = computeUnlockStatus(pMap);

  // 1. AQUECIMENTO
  let aquecimento: Track | null = null;
  let bestAcc = -1;
  for (const t of tracks) {
    const p = progOf(t.id);
    if ((p.tot || 0) >= 4 && accOf(p) > bestAcc && !FUN_IDS.includes(t.id)) {
      bestAcc = accOf(p);
      aquecimento = t;
    }
  }
  if (!aquecimento) {
    aquecimento = tracks.find(t => !t.prereqs?.length) || tracks[0] || null;
  }

  // 2. FRONTEIRA (Seleciona UM único alvo maduro)
  // Prefere nós que já estão no status "frontier" (abertos) e que o aluno já praticou mas não dominou,
  // ou pega o primeiro nó frontier nunca praticado.
  const learning = tracks.filter((t) => t.graphId && status.frontier.includes(t.graphId) && practiced(progOf(t.id)))
    .sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)));
  const fresh = tracks.find((t) => t.graphId && status.frontier.includes(t.graphId) && !practiced(progOf(t.id)));
  const fronteira = learning[0] || fresh || aquecimento;

  // 3. RESGATE
  const cold = tracks
    .filter((t) => practiced(progOf(t.id)) && t.id !== fronteira?.id && t.id !== aquecimento?.id)
    .sort((a, b) => (progOf(a.id).lastDay || "0000").localeCompare(progOf(b.id).lastDay || "0000"));
  const hasBank = tracks.some((t) => (progOf(t.id).bank || []).length > 0);
  const resgates: AulaPlan["resgates"] = [];
  if (hasBank) resgates.push({ track: fronteira!, fromBank: true }); 
  if (cold[0]) resgates.push({ track: cold[0], fromBank: false });

  // 4. FLUÊNCIA (Bloco Dojo da Academia)
  const fluPool = tracks.filter((t) => FLUENCY_IDS.includes(t.id) && t.id !== fronteira?.id);
  const fluencia =
    fluPool.filter((t) => practiced(progOf(t.id))).sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)))[0] ||
    fluPool[0] || null;

  // 5. FECHO
  const funPool = tracks.filter((t) => FUN_IDS.includes(t.id) && t.id !== fronteira?.id);
  const fecho = funPool.length ? funPool[new Date().getDate() % funPool.length] : null;

  const revName = resgates.find((r) => !r.fromBank)?.track.name;
  const resumo = fronteira
    ? `Hoje: treinar ${fronteira.icon} ${fronteira.name}` + (revName ? ` · revisar ${revName}` : "")
    : "Sua dose diária de magia!";

  return { aquecimento, fronteira, resgates, fluencia, fecho, resumo };
}

export function composeAula(tracks: Track[], progOf: ProgOf, total = AULA_TOTAL): { qs: Question[]; plan: AulaPlan } {
  const plan = planAula(tracks, progOf);
  const lvlOf = (t: Track) => Math.min(5, Math.max(1, progOf(t.id).lvl || 1));
  
  const gen = (t: Track | null, lvlOverride?: number): Question | null => {
    if (!t) return null;
    try {
      return t.gen(lvlOverride ?? lvlOf(t));
    } catch (e) {
      return null;
    }
  };

  // Resgates (Banco de erros)
  const bankQs: Question[] = [];
  for (const t of tracks) {
    for (const item of progOf(t.id).bank || []) bankQs.push(shuffleOpts(item.q));
  }
  for (let i = bankQs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bankQs[i], bankQs[j]] = [bankQs[j], bankQs[i]];
  }

  const coldTrack = plan.resgates.find((r) => !r.fromBank)?.track || null;
  const genResg = () => bankQs.pop() || gen(coldTrack);

  const qs: Question[] = [];
  
  const addQ = (q: Question | null) => { if (q) qs.push(q); };

  // 1. AQUECIMENTO (15% = ~2 questões) -> Nível - 1 (Fácil)
  addQ(gen(plan.aquecimento, Math.max(1, lvlOf(plan.aquecimento!) - 1)));
  addQ(gen(plan.aquecimento, Math.max(1, lvlOf(plan.aquecimento!) - 1)));

  // 2. FRONTEIRA (~40-50% = ~5-6 questões) -> Nível de Partida Atual (LevelToApply)
  for (let i = 0; i < 5; i++) {
    addQ(gen(plan.fronteira));
  }

  // 3. RESGATE (1-2 questões)
  addQ(genResg());
  addQ(genResg());

  // 4. FLUÊNCIA (25% = ~3 questões) -> Rápido
  addQ(gen(plan.fluencia));
  addQ(gen(plan.fluencia));
  addQ(gen(plan.fluencia));

  // 5. FECHO (1 questão lúdica)
  const fechoQ = gen(plan.fecho, Math.max(1, plan.fecho ? lvlOf(plan.fecho) - 1 : 1)) || gen(plan.aquecimento, 1);
  
  // Trunca/ajusta se passou do limite (sem remover o fecho)
  while (qs.length < total - 1) { const q = gen(plan.fronteira) || gen(plan.aquecimento, 1); if (q) qs.push(q); else break; }
  const final = qs.slice(0, total - 1);
  if (fechoQ) final.push(fechoQ);

  return { qs: final, plan };
}

export function buildAulaTrack(tracks: Track[], progOf: ProgOf): { track: Track; plan: AulaPlan } {
  const { qs, plan } = composeAula(tracks, progOf);
  let i = 0;
  return {
    plan,
    track: {
      id: "aula",
      name: "Minha Aula",
      icon: "📚",
      color: "#4F46E5",
      dark: "#3730A3",
      gen: () => qs[i++ % qs.length],
      totalQ: qs.length || AULA_TOTAL,
    } as Track,
  };
}
