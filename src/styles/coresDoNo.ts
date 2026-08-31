/**
 * As cores do nó travado no mapa — a bolinha da competência ainda fechada.
 *
 * ---
 *
 * **Por que só o travado tem cores aqui.** O nó aberto se pinta com a cor da
 * própria ilha, que vem do currículo, e a arte dentro dele é ilustração
 * colorida sobre um disco branco — nada a decidir. O nó TRAVADO é o único que
 * não tem ilha: são as mesmas três cores para as noventa competências.
 *
 * **O que estava errado.** O estado "travada" era dito com `opacity-50
 * grayscale` — o botão inteiro desbotado. O motivo era o emoji: glifo do
 * sistema não aceita cor, então apagar tudo era a única forma de mudar seu
 * aspecto. O efeito colateral caía no TEXTO: o rótulo "Travada" ficava em
 * `#94A3B8`, que mede **2,56:1** no branco da página — pouco mais da metade do
 * piso de 4,5:1 do WCAG para texto. A criança que enxerga menos não lia por que
 * aquele nó não abria.
 *
 * **A correção.** Com arte hospedada em vez de emoji, o estado é dito em cor
 * cheia e o texto tem contraste próprio: `#64748B` mede **4,76:1** no branco.
 * Um teste em `coresDasIlhas.test.ts` mede e reprova se alguém baixar isso.
 *
 * **Por que os valores moram aqui e não no componente.** Precisam ser NÚMERO
 * para o teste medir — um token `var(--cor, #fff)` não se mede. Ficando neste
 * módulo, o teste mede exatamente o que a tela usa e o `LearningPath` fica sem
 * nenhuma cor escrita na mão.
 */

/** Fundo do nó travado — cinza de papel, para a competência ainda fechada. */
export const FUNDO_TRAVADO = "#F1F5F9";
/** A borda inferior que dá o relevo de botão ao nó travado. */
export const BORDA_TRAVADA = "#CBD5E1";
/** O cinza do rótulo "Travada". Piso de TEXTO, não de desenho: 4,5:1 no branco. */
export const TINTA_TRAVADA = "#64748B";
