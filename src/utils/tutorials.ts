import { Question } from "../types";

/**
 * TUTORIAIS GUIADOS 👉 (a "mãozinha" generalizada) — o padrão-ouro do Contar,
 * agora como SISTEMA: cada kind declara seus passos NARRADOS e um runner genérico
 * no GameLoop toca passo a passo, com a cena visível.
 *
 * Offline, determinístico, custo zero (≠ o 💡 do Tutor de IA, que é server + rate
 * limit). Os 4 tutoriais antigos com DEDO ANIMADO (count/sum/tens/subvis) seguem
 * hardcoded no GameLoop (fidelidade maior); estes cobrem os kinds novos que só
 * "renderizavam e esperavam o toque" — dando a eles o momento de ensino.
 */

export interface TutStep {
  /** o que o Mascote fala/mostra neste passo */
  say: string;
  /** quanto tempo (ms) antes do próximo passo (fallback sem voz; com voz o passo
   *  espera a fala TERMINAR — nunca corta no meio) */
  ms?: number;
  /** cena a MOSTRAR durante este passo (sobrepõe o estado da questão) — é o que
   *  transforma narração em AULA: o Meu Dia mostra manhã→tarde→noite, o Ciclo da
   *  Planta mostra semente→broto→árvore, junto com a voz. */
  show?: string | number;
}

export type TutBuilder = (q: Question) => TutStep[];

export const TUTORIALS: Record<string, TutBuilder> = {
  // Reta Numérica interativa
  numberline: (q) => {
    return [
      { say: "A reta numérica é um caminho com números ordenados." },
      { say: "Cada salto para frente soma um pouco." },
      { say: "Saltos para trás, tiram um pouco. Aonde nós vamos parar?", show: q.nlJumps?.length }
    ];
  },
  // Conta Armada
  vertical: () => [
    { say: "Vamos armar a conta!" },
    { say: "Cada número no seu lugar: unidades com unidades, dezenas com dezenas." },
    { say: "Sempre começamos a resolver pelas unidades, do lado direito." }
  ],

  // Moldura de 10 (subitização): enxergar a quantidade sem contar tudo
  tenframe: () => [
    { say: "Esta é a caixa mágica: duas fileiras de cinco quadradinhos." },
    { say: "Uma fileira cheia já são cinco, sem precisar contar!", show: 1 },
    { say: "Aí é só juntar os de baixo. Rapidinho você sabe quantos são.", show: 2 },
  ],
  // Amigos dos Números (number bonds): o inteiro em cima, os pedaços embaixo
  bond: () => [
    { say: "No alto fica o número inteiro, e embaixo os dois pedacinhos que formam ele." },
    { say: "Se você sabe um pedaço, descobre o outro: juntos eles voltam a ser o de cima." },
    { say: "Esse é o segredo de somar de cabeça!" },
  ],
  // O Tempo (clima) — a cena TROCA junto com a voz (aula com imagens)
  weather: () => [
    { say: "O tempo muda! Quando o sol brilha sozinho no céu, é dia de sol.", show: "sol" },
    { say: "Quando a nuvem solta pinguinhos de água... é chuva!", show: "chuva" },
    { say: "E tem dia de frio, que pede casaco bem quentinho.", show: "frio" },
    { say: "Agora olhe o céu da cena e responda!" },
  ],
  // Ciclo da Planta — mostra a evolução estágio por estágio
  grow: () => [
    { say: "Toda planta começa como uma sementinha, pequenina, dormindo na terra.", show: 1 },
    { say: "Com água e sol, nasce a raiz lá embaixo... e um brotinho verde aponta pra cima!", show: 2 },
    { say: "O brotinho cresce e ganha folhas.", show: 3 },
    { say: "Até virar uma árvore bem grande! É o ciclo da planta.", show: 4 },
  ],
  // Partes do Dia — a cena mostra CADA parte enquanto a voz explica a diferença
  daypart: () => [
    { say: "O dia tem partes! De manhã, o sol está NASCENDO: fica baixinho, pertinho do chão, e o céu fica alaranjado.", show: "manha" },
    { say: "À tarde o sol já subiu: fica LÁ NO ALTO da nossa cabeça, e o céu bem azul.", show: "tarde" },
    { say: "E de noite o sol vai dormir: vem a lua e as estrelas!", show: "noite" },
    { say: "É sempre nessa ordem: manhã, tarde, noite. Agora olhe a cena e responda!" },
  ],
  // Emoções — um rostinho por passo
  emotion: () => [
    { say: "O rostinho conta como a gente se sente!" },
    { say: "Boca sorrindo e olhos brilhando: FELIZ.", show: "feliz" },
    { say: "Uma lágrima escorrendo: TRISTE.", show: "triste" },
    { say: "Testa franzida: BRAVO.", show: "bravo" },
    { say: "Olhos bem arregalados: com MEDO.", show: "medo" },
  ],
  // Fases da Vida (pessoa) — uma fase por passo
  lifestage: () => [
    { say: "A gente cresce a vida toda! Primeiro é um bebê, pequenininho no colo.", show: 1 },
    { say: "Depois vira criança, que corre e brinca.", show: 2 },
    { say: "Cresce mais e fica adulto.", show: 3 },
    { say: "E com muitos anos fica idoso, de cabelos branquinhos.", show: 4 },
  ],
  // Ciclo Animal (ovo → galinha) — um estágio por passo
  animal: () => [
    { say: "A galinha bota um ovo.", show: 1 },
    { say: "Dentro dele cresce um pintinho... e a casca começa a rachar!", show: 2 },
    { say: "O pintinho sai do ovo, pequenino e amarelinho.", show: 3 },
    { say: "Ele cresce, ganha penas... e vira uma galinha! E tudo recomeça.", show: 4 },
  ],
};

export const hasTutorial = (kind: string): boolean => kind in TUTORIALS;

export const tutorialSteps = (q: Question): TutStep[] =>
  (TUTORIALS[q.kind]?.(q) ?? []).filter((s) => s.say && s.say.trim().length > 0);

/* ---------------- AULINHA 🎬 (orquestração do momento 0) ----------------
 * "Aulinha" = a mini-aula que ENSINA antes do exercício: os 4 kinds antigos têm a
 * mãozinha ANIMADA hardcoded no GameLoop (count/sum/subvis/tens — o padrão-ouro);
 * os kinds novos têm os passos narrados acima. Regras de exibição (pedido do Zeus):
 *  1. AUTOMÁTICA na 1ª vez que a criança encontra o kind (uma vez, não toda hora);
 *  2. botão "ver de novo" sempre disponível;
 *  3. o ALGORITMO re-oferece após 2 erros seguidos na missão.
 */

/** kinds com mãozinha animada própria no GameLoop (dedo + numerais + voz) */
export const GUIDED_KINDS = ["count", "sum", "subvis", "tens"];

/** este kind tem aulinha (animada ou narrada)? */
export const hasAulinha = (kind: string): boolean =>
  GUIDED_KINDS.includes(kind) || hasTutorial(kind);

/** memória local "já vi a aulinha" por criança × kind (UX; não vai pro Firestore).
 *  Storage injetável para teste; em falha de storage, trata como VISTA (nunca
 *  vira aula automática repetida em todo início de missão). */
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
  } catch { /* storage cheio/bloqueado: segue sem memória */ }
}
