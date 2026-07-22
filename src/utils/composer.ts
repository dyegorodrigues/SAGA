import { Question, Track, Progress } from "../types";
import { computeUnlockStatus } from "./unlockEngine";

/**
 * E2 do Professor Mágico — o COMPOSITOR da "▶️ MINHA AULA" 📚
 * (blueprint-professor-magico.md, Peça 2 + dose do §5)
 *
 * A criança toca UM botão; o professor monta a playlist do dia com a receita:
 *   2 AQUECIMENTO (a melhor trilha, um nível abaixo — entrada fácil, dopamina)
 *   2 RESGATE     (erros do banco 🧠 + trilha "fria" há mais dias sem prática)
 *   4 FRONTEIRA   (a habilidade mais fraca cujos FUNDAMENTOS estão ok — aqui se aprende)
 *   1 FLUÊNCIA ⚡  (cálculo básico todo dia — o treino Kumon inegociável)
 *   1 FECHO 🎉    (lógica/padrões — sair sorrindo)
 * Ordem com arco emocional (fácil → forja → fecho), sem embaralhar.
 * Determinístico e offline (doutrina de IA do blueprint §7): zero IA na lição.
 */

/** trilhas que treinam CÁLCULO (o bloco de fluência diário) */
export const FLUENCY_IDS = ["canto", "simbolos", "soma", "sub", "contar", "seq", "vizinhos", "dezenas", "moldura", "amigos"];
/** trilhas lúdicas para o fecho (recompensa cognitiva) */
const FUN_IDS = ["padroes", "intruso", "olho", "formas", "logica", "graficos"];

export const AULA_TOTAL = 10;

type ProgOf = (trackId: string) => Progress;

const accOf = (p: Progress) => (p.tot ? p.ok / p.tot : -1);
/** fundamento consolidado = Domínio 👑 OU bolinha 3+ conquistada */
const practiced = (p: Progress) => (p.tot || 0) > 0;

/** pré-requisitos ok (só cobra os que existem nesta série; sem prereq = sempre ok) */

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
  warmup: Track | null;
  resgates: { track: Track; fromBank: boolean }[];
  fronteira: Track | null;
  fluencia: Track | null;
  fecho: Track | null;
  /** frase curta pro card da home ("Hoje: treinar X · revisar Y") */
  resumo: string;
}

/** O PLANO da aula (barato — só escolhe trilhas, não gera questão; a home usa pro card) */
export function planAula(tracks: Track[], progOf: ProgOf): AulaPlan {
  const pMap: Record<string, Progress> = {};
  for (const t of tracks) {
    if (t.graphId) {
      pMap[t.graphId] = progOf(t.id);
    }
  }
  const status = computeUnlockStatus(pMap);
  const here = new Set(tracks.map((t) => t.id));

  // AQUECIMENTO: a trilha mais forte já praticada (melhor precisão, ≥4 respostas);
  // criança nova: a 1ª trilha sem pré-requisitos (o começo natural do currículo)
  let warmup: Track | null = null;
  let bestAcc = -1;
  for (const t of tracks) {
    const p = progOf(t.id);
    if ((p.tot || 0) >= 4 && accOf(p) > bestAcc) {
      bestAcc = accOf(p);
      warmup = t;
    }
  }
  if (!warmup) {
    const basics = ["canto", "simbolos", "contar", "seq", "formas", "maismenos"];
    warmup = tracks.find(t => basics.includes(t.id) && !(t.prereqs || []).length) 
          || tracks.find(t => !(t.prereqs || []).length) 
          || tracks[0] || null;
  }

  // FRONTEIRA: praticada, NÃO dominada, fundamentos ok, pior precisão primeiro;
  // se tudo dominado/nada praticável: a 1ª NUNCA praticada com fundamentos ok (conteúdo novo)
  const learning = tracks.filter((t) => t.graphId && status.frontier.includes(t.graphId) && practiced(progOf(t.id)))
    .sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)));
  const fresh = tracks.find((t) => t.graphId && status.frontier.includes(t.graphId) && !practiced(progOf(t.id)));
  const fronteira = learning[0] || fresh || warmup;

  // RESGATE: trilha FRIA (praticada, mais dias sem prática — lastDay mais antigo)
  const cold = tracks
    .filter((t) => practiced(progOf(t.id)) && t.id !== fronteira?.id)
    .sort((a, b) => (progOf(a.id).lastDay || "0000").localeCompare(progOf(b.id).lastDay || "0000"));
  const hasBank = tracks.some((t) => (progOf(t.id).bank || []).length > 0);
  const resgates: AulaPlan["resgates"] = [];
  if (hasBank) resgates.push({ track: fronteira!, fromBank: true }); // marcador: banco global
  if (cold[0]) resgates.push({ track: cold[0], fromBank: false });
  if (!resgates.length && cold[1]) resgates.push({ track: cold[1], fromBank: false });

  // FLUÊNCIA: trilha de cálculo, preferindo a já praticada de pior precisão (treino que vale)
  const fluPool = tracks.filter((t) => FLUENCY_IDS.includes(t.id));
  const fluencia =
    fluPool.filter((t) => practiced(progOf(t.id))).sort((a, b) => accOf(progOf(a.id)) - accOf(progOf(b.id)))[0] ||
    fluPool[0] || null;

  // FECHO: lúdica, qualquer uma que exista (rotaciona pelo dia p/ variar)
  const funPool = tracks.filter((t) => FUN_IDS.includes(t.id) && t.id !== fronteira?.id);
  const fecho = funPool.length ? funPool[new Date().getDate() % funPool.length] : null;

  const revName = resgates.find((r) => !r.fromBank)?.track.name;
  const resumo = fronteira
    ? `Hoje: treinar ${fronteira.icon} ${fronteira.name}` + (revName ? ` · revisar ${revName}` : "")
    : "Sua dose diária de magia!";

  return { warmup, resgates, fronteira, fluencia, fecho, resumo };
}

/** A AULA inteira (gera as questões na ordem do arco emocional) */
export function composeAula(tracks: Track[], progOf: ProgOf, total = AULA_TOTAL): { qs: Question[]; plan: AulaPlan } {
  const plan = planAula(tracks, progOf);
  const lvlOf = (t: Track) => Math.min(5, Math.max(1, progOf(t.id).lvl || 1));
  const gen = (t: Track | null, lvl?: number): Question | null => {
    if (!t) return null;
    try {
      return t.gen(Math.min(5, Math.max(1, lvl ?? lvlOf(t))));
    } catch (e) {
      return null;
    }
  };

  // resgates: primeiro os erros REAIS do banco (de qualquer trilha), depois a trilha fria
  const bankQs: Question[] = [];
  for (const t of tracks) {
    for (const item of progOf(t.id).bank || []) bankQs.push(shuffleOpts(item.q));
  }
  for (let i = bankQs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bankQs[i], bankQs[j]] = [bankQs[j], bankQs[i]];
  }
  const coldTrack = plan.resgates.find((r) => !r.fromBank)?.track || null;
  const resg: (Question | null)[] = [bankQs[0] || gen(coldTrack), bankQs[0] ? gen(coldTrack) : bankQs[1] || null];

  const fr = () => gen(plan.fronteira);
  // o ARCO: fácil → mistura resgate/fronteira/fluência → fecho lúdico.
  // O fecho é SEMPRE a última (a aula termina num sorriso): o miolo é preenchido
  // até total−1 e só então o fecho entra.
  const fechoQ = gen(plan.fecho);
  const miolo: (Question | null)[] = [
    gen(plan.warmup, Math.max(1, lvlOf(plan.warmup || tracks[0]) - 1)),
    gen(plan.warmup, Math.max(1, lvlOf(plan.warmup || tracks[0]) - 1)),
    resg[0],
    fr(),
    fr(),
    gen(plan.fluencia),
    fr(),
    resg[1],
    fr(),
  ];
  const qs = miolo.filter((q): q is Question => !!q);
  const alvoMiolo = total - (fechoQ ? 1 : 0);
  let guard = 0;
  while (qs.length < alvoMiolo && guard++ < 40) {
    const q = fr() || gen(plan.warmup);
    if (q) qs.push(q);
    else break;
  }
  const final = qs.slice(0, alvoMiolo);
  if (fechoQ) final.push(fechoQ);
  return { qs: final.slice(0, total), plan };
}

/** A trilha sintética "▶️ Minha Aula" (mesmo padrão do Desafio Misto) */
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
