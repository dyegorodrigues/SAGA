import { Question, Track, Progress } from "../../types";
import { computeUnlockStatus } from "./unlockEngine";
import { RadarEngine } from "./radarEngine";
import { prescribeMisconceptionRescue } from "./rescuePlanner";
import { beginAulaProgressSession, stampAulaQuestion } from "./aulaProgressContext";
import { ALL_MATH_TRACKS } from "./curriculum";

/**
 * COMPOSER SAGA — Orquestrador da Aula do Dia do Sensei.
 *
 * A Aula do Dia NÃO é um modo misto. Há uma fronteira conceitual dominante;
 * aquecimento, revisão, resgate e fluência existem para preparar, sustentar ou
 * consolidar essa progressão. O Desafio Misto é um modo separado.
 *
 * Estrutura atual da sessão:
 * 1. AQUECIMENTO: vitória acessível e ativação de conhecimento relevante.
 * 2. FRONTEIRA: a microcompetência dominante onde o novo aprendizado acontece.
 * 3. RESGATE: somente quando Radar/Leitner/banco apontam necessidade.
 * 4. FLUÊNCIA: prática sobre conhecimento já compreendido; não concede domínio.
 * 5. FECHO: encerramento simples e positivo.
 */

export const FLUENCY_IDS = ["N1.01", "N1.02", "N1.11", "N3.01", "N3.02", "N3.06", "N3.07", "N3.08", "N4.03", "N4.06", "N4.07"];
const FUN_IDS = ["padroes", "intruso", "olho", "formas", "logica", "graficos"];

/**
 * API legada mantida apenas para compatibilidade de consumidores antigos.
 * O runtime do Sensei NÃO usa mais série para definir a dose da Aula do Dia.
 */
export const AULA_TOTAL_F0 = 8;
export const AULA_TOTAL_F1 = 12;
export const AULA_TOTAL_F2 = 16;
export const AULA_TOTAL_F3_F4 = 20;

/** @deprecated Use `getAdaptiveAulaTotal`. Série não é autoridade curricular. */
export function getAulaTotal(grade?: string): number {
  switch (grade) {
    case "pre": return AULA_TOTAL_F0;
    case "ano1": return AULA_TOTAL_F1;
    case "ano2": return AULA_TOTAL_F2;
    case "ano3": return AULA_TOTAL_F3_F4;
    case "ano4": return AULA_TOTAL_F3_F4;
    default: return 12;
  }
}

type ProgOf = (trackId: string) => Progress;
const accOf = (p: Progress) => (p.tot ? p.ok / p.tot : -1);
const practiced = (p: Progress) => (p.tot || 0) > 0;

/**
 * Universo canônico do Tutor.
 *
 * `App` ainda possui caminhos históricos que entregam apenas `tracks[kid.grade]`.
 * O Sensei não pode aceitar esse recorte como verdade pedagógica: todo o DAG
 * matemático fica disponível e unlock/prereqs decidem o que é elegível.
 * Tracks recebidas com o mesmo id vencem para preservar bindings já resolvidos.
 */
export function canonicalSenseiTracks(input: Track[]): Track[] {
  const recebidas = new Map(input.map(track => [track.id, track] as const));
  return ALL_MATH_TRACKS.map(track => recebidas.get(track.id) ?? track);
}

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
  resgates: RescuePlanItem[];
  fluencia: Track | null;
  fecho: Track | null;
  resumo: string;
}

export type RescueReason = "misconception" | "prerequisite-gap" | "error-bank" | "spaced-review";

export interface RescuePlanItem {
  track: Track;
  fromBank: boolean;
  reason: RescueReason;
  sourceNodeId?: string;
  requiredLevel?: number;
  questionBudget?: number;
  escalated?: boolean;
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

  // 2. FRONTEIRA — UM alvo conceitual dominante.
  // Prefere um frontier já praticado mas ainda não dominado; senão o primeiro
  // frontier novo. Os outros blocos da sessão não criam uma segunda fronteira.
  const learning = tracks.filter((t) => t.graphId && status.frontier.includes(t.graphId) && practiced(progOf(t.id)))
    .sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)));
  const fresh = tracks.find((t) => t.graphId && status.frontier.includes(t.graphId) && !practiced(progOf(t.id)));
  const fronteira = learning[0] || fresh || aquecimento;

  // 3. RESGATE
  const radarRescueIds = RadarEngine.getRescueItems("kid", pMap);
  const radarTracks = radarRescueIds.map(id => tracks.find(t => t.id === id || t.graphId === id)).filter(Boolean) as Track[];
  const dueReviewIds = new Set(RadarEngine.getDueReviews(pMap));
  const dueTracks = tracks
    .filter(t => {
      const nodeId = t.graphId || t.id;
      return dueReviewIds.has(nodeId) && t.id !== fronteira?.id && t.id !== aquecimento?.id;
    })
    .sort((a, b) => (progOf(a.id).lastDay || "0000").localeCompare(progOf(b.id).lastDay || "0000"));
  const bankTrack = tracks.find(t => (progOf(t.id).bank || []).length > 0);
  const resgates: RescuePlanItem[] = [];

  for (const rt of radarTracks) {
    const nodeId = rt.graphId || rt.id;
    const prescription = prescribeMisconceptionRescue(nodeId, tracks, pMap);
    if (prescription && !resgates.some(r => r.track.id === prescription.track.id)) {
      resgates.push({
        track: prescription.track,
        fromBank: false,
        reason: prescription.targetNodeId === nodeId ? "misconception" : "prerequisite-gap",
        sourceNodeId: prescription.sourceNodeId,
        requiredLevel: prescription.requiredLevel,
        questionBudget: prescription.questionBudget,
        escalated: prescription.escalated,
      });
    }
  }

  if (bankTrack && !resgates.some(r => r.track.id === bankTrack.id)) {
    resgates.push({ track: bankTrack, fromBank: true, reason: "error-bank" });
  }
  if (dueTracks[0] && !resgates.some(r => r.track.id === dueTracks[0].id)) {
    resgates.push({ track: dueTracks[0], fromBank: false, reason: "spaced-review" });
  }

  // 4. FLUÊNCIA — ainda é a ponte legada por Track conceitual.
  // A auditoria pós-P22 vai substituir isto por prescrição real de Dojo/Jardim.
  const fluPool = tracks.filter((t) => FLUENCY_IDS.includes(t.id) && t.id !== fronteira?.id);
  const fluencia =
    fluPool.filter((t) => practiced(progOf(t.id))).sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)))[0] ||
    fluPool[0] || null;

  // 5. FECHO
  const funPool = tracks.filter((t) => FUN_IDS.includes(t.id) && t.id !== fronteira?.id);
  const fecho = funPool.length ? funPool[new Date().getDate() % funPool.length] : null;

  const revName = resgates.find((r) => !r.fromBank)?.track.name;
  const resumo = fronteira
    ? `Aula de hoje: ${fronteira.icon} ${fronteira.name}` + (revName ? ` · reforço: ${revName}` : "")
    : "O Sensei está preparando o próximo passo!";

  return { aquecimento, fronteira, resgates, fluencia, fecho, resumo };
}

export const AULA_ADAPTIVE_MIN = 8;
export const AULA_ADAPTIVE_NORMAL = 10;
export const AULA_ADAPTIVE_MAX = 12;

/**
 * Dose adaptativa V1.
 *
 * Não tenta inferir “idade ideal”. O orçamento diminui quando há remediação
 * conceitual/fricção e só cresce um pouco quando a fronteira tem histórico
 * estável, sem banco nem resgate. Alta facilidade deve aumentar complexidade e
 * retirar andaime; mais questões é apenas uma pequena margem de prática.
 */
export function getAdaptiveAulaTotal(
  tracks: Track[],
  progOf: ProgOf,
  plan: AulaPlan = planAula(tracks, progOf),
): number {
  const practicedTracks = tracks.filter(track => practiced(progOf(track.id)));
  if (practicedTracks.length === 0) return AULA_ADAPTIVE_MIN;

  const target = plan.fronteira ? progOf(plan.fronteira.id) : undefined;
  const conceptualRescue = plan.resgates.some(rescue =>
    rescue.reason === "misconception" || rescue.reason === "prerequisite-gap"
  );

  if (conceptualRescue || (target?.bad || 0) >= 2) return AULA_ADAPTIVE_MIN;

  const targetAccuracy = target?.tot ? (target.ok || 0) / target.tot : -1;
  const stableFrontier = !!target
    && (target.tot || 0) >= 8
    && targetAccuracy >= 0.85
    && (target.bad || 0) === 0
    && (target.bank || []).length === 0
    && plan.resgates.length === 0;

  return stableFrontier ? AULA_ADAPTIVE_MAX : AULA_ADAPTIVE_NORMAL;
}

export function composeAula(tracks: Track[], progOf: ProgOf, total = AULA_ADAPTIVE_NORMAL): { qs: Question[]; plan: AulaPlan } {
  // Uma composição nova nunca herda snapshots de outra criança/missão.
  beginAulaProgressSession();
  const plan = planAula(tracks, progOf);
  const lvlOf = (t: Track) => Math.min(5, Math.max(1, progOf(t.id).lvl || 1));

  const gen = (t: Track | null, lvlOverride?: number): Question | null => {
    if (!t) return null;
    const level = lvlOverride ?? lvlOf(t);
    try {
      return stampAulaQuestion(t.gen(level), t, level, progOf(t.id));
    } catch (e) {
      return null;
    }
  };

  // Banco de erros por SOURCE. Um resgate planejado para A não pode consumir B.
  // Recolocamos `review` e `sig` depois de embaralhar as opções porque
  // `shuffleOpts` limpa metadados transitórios da questão serializada.
  const bankQsByTrack = new Map<string, Question[]>();
  for (const t of tracks) {
    const sourceBank: Question[] = [];
    for (const item of progOf(t.id).bank || []) {
      const stamped = stampAulaQuestion(shuffleOpts(item.q), t, lvlOf(t), progOf(t.id));
      sourceBank.push({ ...stamped, review: true, sig: item.sig });
    }
    for (let i = sourceBank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sourceBank[i], sourceBank[j]] = [sourceBank[j], sourceBank[i]];
    }
    if (sourceBank.length) bankQsByTrack.set(t.id, sourceBank);
  }

  const rescueQueue = plan.resgates.map(rescue => () => {
    if (rescue.reason === "error-bank") {
      return bankQsByTrack.get(rescue.track.id)?.pop() || null;
    }
    const question = gen(rescue.track, rescue.requiredLevel);
    return question ? { ...question, review: true } : null;
  });
  const genResg = () => rescueQueue.shift()?.() || null;

  const qs: Question[] = [];

  const addQ = (q: Question | null) => { if (q) qs.push(q); };

  /**
   * O que a criança percebe como "a mesma questão de novo".
   * Não é identidade de objeto: dois sorteios distintos podem produzir
   * exatamente o mesmo enunciado e a mesma resposta.
   */
  const assinatura = (q: Question) => JSON.stringify([
    q.kind, q.prompt, q.answer, q.big, q.n, q.emoji, q.a, q.b, q.story, q.expr,
  ]);

  /**
   * Cada fase chama o mesmo gerador em sequência, e geradores de alcance
   * pequeno repetem com frequência alta. Sem esta guarda, missões podem trazer
   * a mesma pergunta duas vezes seguidas.
   */
  const fabricarDistinta = (
    fabricar: () => Question | null,
    anterior: string | null,
    tentativas = 8,
  ): Question | null => {
    let q = fabricar();
    if (!q) return null;
    for (let i = 0; anterior && i < tentativas && assinatura(q) === anterior; i += 1) {
      const outra = fabricar();
      if (!outra) break;
      q = outra;
    }
    return q;
  };

  const addDistinta = (fabricar: () => Question | null): boolean => {
    const anterior = qs.length ? qs[qs.length - 1] : null;
    const q = fabricarDistinta(fabricar, anterior ? assinatura(anterior) : null);
    if (!q) return false;
    // O fallback "Em construção" é constante: repetir a geração devolve sempre a
    // mesma carta. Missão mais curta é melhor que empilhar placeholder.
    if (q.isFallback && anterior?.isFallback) return false;
    qs.push(q);
    return true;
  };

  // 1. AQUECIMENTO — duas questões acessíveis.
  const nivelAquecimento = () => Math.max(1, lvlOf(plan.aquecimento!) - 1);
  addDistinta(() => gen(plan.aquecimento, nivelAquecimento()));
  addDistinta(() => gen(plan.aquecimento, nivelAquecimento()));

  // 2. FRONTEIRA — maior parte da prática fica no alvo conceitual dominante.
  for (let i = 0; i < 5; i++) {
    addDistinta(() => gen(plan.fronteira));
  }

  // 3. RESGATE — a auditoria seguinte verificará questionBudget ponta a ponta.
  // Hoje cada item planejado ainda entrega uma questão embutida.
  addQ(genResg());
  addQ(genResg());

  // 4. FLUÊNCIA — ponte legada até a integração formal com o Dojo.
  addDistinta(() => gen(plan.fluencia));
  addDistinta(() => gen(plan.fluencia));
  addDistinta(() => gen(plan.fluencia));

  // Preenche o orçamento restante com a própria fronteira, nunca com assunto aleatório.
  while (qs.length < total - 1) {
    if (!addDistinta(() => gen(plan.fronteira) || gen(plan.aquecimento, 1))) break;
  }
  const final = qs.slice(0, total - 1);

  // 5. FECHO lúdico, sem ganhar autoridade curricular sobre a fronteira.
  const fechoQ = fabricarDistinta(
    () => gen(plan.fecho, Math.max(1, plan.fecho ? lvlOf(plan.fecho) - 1 : 1)) || gen(plan.aquecimento, 1),
    final.length ? assinatura(final[final.length - 1]) : null,
  );
  const ultimaDaMissao = final.length ? final[final.length - 1] : null;
  if (fechoQ && !(fechoQ.isFallback && ultimaDaMissao?.isFallback)) final.push(fechoQ);

  return { qs: final, plan };
}

export function buildAulaTrack(tracks: Track[], progOf: ProgOf, _grade: string = "ano1"): { track: Track; plan: AulaPlan } {
  const universe = canonicalSenseiTracks(tracks);
  const previewPlan = planAula(universe, progOf);
  const total = getAdaptiveAulaTotal(universe, progOf, previewPlan);
  const { qs, plan } = composeAula(universe, progOf, total);
  let i = 0;
  return {
    plan,
    track: {
      id: "aula",
      name: "Aula do Dia",
      icon: "📚",
      color: "#4F46E5",
      dark: "#3730A3",
      gen: () => qs[i++ % qs.length],
      totalQ: qs.length || total,
    } as Track,
  };
}