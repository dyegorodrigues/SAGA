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
  /** quanto tempo (ms) antes do próximo passo (padrão 2200) */
  ms?: number;
}

export type TutBuilder = (q: Question) => TutStep[];

export const TUTORIALS: Record<string, TutBuilder> = {
  // Moldura de 10 (subitização): enxergar a quantidade sem contar tudo
  tenframe: () => [
    { say: "Esta é a moldura de 10: duas fileiras de cinco quadradinhos." },
    { say: "Uma fileira cheia já são cinco, sem precisar contar!" },
    { say: "Aí é só juntar os de baixo. Rapidinho você sabe quantos são." },
  ],
  // Amigos dos Números (number bonds): o inteiro em cima, os pedaços embaixo
  bond: () => [
    { say: "No alto fica o número inteiro, e embaixo os dois pedacinhos que formam ele." },
    { say: "Se você sabe um pedaço, descobre o outro: juntos eles voltam a ser o de cima." },
    { say: "Esse é o segredo de somar de cabeça!" },
  ],
  // O Tempo (clima)
  weather: () => [
    { say: "O tempo muda: às vezes faz sol, às vezes chove, às vezes esfria." },
    { say: "Olhe bem o céu na cena: nuvem com pinguinhos é chuva; sol amarelo é dia quente." },
    { say: "Cada tempo pede uma roupa diferente!" },
  ],
  // Ciclo da Planta
  grow: () => [
    { say: "Toda planta começa como uma sementinha, pequenina na terra." },
    { say: "Com água e sol, nasce uma raiz lá embaixo e um brotinho verde." },
    { say: "O brotinho cresce, ganha folhas, e vira uma árvore bem grande!" },
  ],
  // Partes do Dia
  daypart: () => [
    { say: "O dia tem partes. De manhã, o sol está nascendo." },
    { say: "À tarde, o sol fica lá no alto, bem quente." },
    { say: "E de noite vem a lua e as estrelas. É sempre nessa ordem: manhã, tarde, noite." },
  ],
  // Emoções
  emotion: () => [
    { say: "O rostinho conta como a gente se sente." },
    { say: "Boca pra cima e olhos brilhando é feliz; uma lágrima escorrendo é triste." },
    { say: "Testa franzida é bravo; olhos bem arregalados é medo." },
  ],
  // Fases da Vida (pessoa)
  lifestage: () => [
    { say: "A gente cresce a vida toda. Primeiro é bebê, pequenininho no colo." },
    { say: "Depois vira criança, que corre e brinca." },
    { say: "Cresce e fica adulto; e com muitos anos fica idoso, de cabelos branquinhos." },
  ],
  // Ciclo Animal (ovo → galinha)
  animal: () => [
    { say: "A galinha bota um ovo." },
    { say: "Dentro do ovo cresce um pintinho, que racha a casca e sai." },
    { say: "O pintinho cresce, ganha penas, e vira uma galinha. E tudo recomeça!" },
  ],
};

export const hasTutorial = (kind: string): boolean => kind in TUTORIALS;

export const tutorialSteps = (q: Question): TutStep[] =>
  (TUTORIALS[q.kind]?.(q) ?? []).filter((s) => s.say && s.say.trim().length > 0);
