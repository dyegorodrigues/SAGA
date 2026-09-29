import type { TutStep } from "../../utils/tutorials";

/**
 * O ritmo da aulinha — quanto cada passo da demonstração dura.
 *
 * ## Por que isto existe fora do `GameLoop`
 *
 * O ritmo vinha só do `onEnd` da fala: o passo seguinte entrava quando o
 * anterior terminava de ser falado. Num aparelho **sem voz pt-BR instalada** —
 * e são muitos; medido aqui, `speechSynthesis.getVoices()` devolve zero — a
 * fala termina em erro no mesmo quadro em que começa. Os quatro passos da
 * aulinha da N1.01 passavam em menos de um segundo: a criança não via a banana
 * ir para o macaco, via um piscar. Foi assim que o pai a encontrou.
 *
 * A regra certa tem duas metades, e as duas precisam valer:
 *
 * 1. **Nunca mais rápido que o mínimo da cena.** Quem manda é a ficha
 *    (`passo.ms`); sem ela, o tamanho da frase.
 * 2. **Nunca cortar a fala.** Se a voz demora mais que o mínimo, espera-se.
 *
 * E um teto, porque `onEnd` pode simplesmente não chegar (navegador com a fala
 * suspensa, aba em segundo plano). Sem teto a aula trava para sempre e leva
 * junto o `promptDone`: a tela inteira fica esperando uma fala que acabou.
 */

/** Quanto se espera pela fala DEPOIS do mínimo, antes de seguir assim mesmo. */
export const TETO_DA_FALA_MS = 6000;

/** O piso de qualquer passo: menos que isto a criança não chega a ler a cena. */
export const PISO_DO_PASSO_MS = 2000;

/** Milissegundos por caractere falado, quando a ficha não declara o tempo. */
const MS_POR_CARACTERE = 65;

export function tempoMinimoDoPasso(passo: Pick<TutStep, "ms" | "say">): number {
  if (typeof passo.ms === "number" && passo.ms > 0) return passo.ms;
  return Math.max(PISO_DO_PASSO_MS, String(passo.say ?? "").length * MS_POR_CARACTERE);
}

/** O passo só avança quando a fala acabou E o tempo mínimo passou. */
export function podeSeguir(falaAcabou: boolean, tempoAcabou: boolean): boolean {
  return falaAcabou && tempoAcabou;
}
