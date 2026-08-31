/**
 * A moldura do aplicativo — quanto de viewport cada tela ocupa.
 *
 * ## As duas famílias de tela
 *
 * **Página navegável** (login, escolher perfil, painel dos pais): conteúdo de
 * altura variável que rola junto com a página. Ganha respiro embaixo.
 *
 * **Tela que É o aplicativo** (a missão e a casa da criança): ocupa a viewport
 * exata, tem barra própria em cima, rolagem própria no meio e barra de abas
 * embaixo. Rolar a PÁGINA aqui é defeito, não recurso.
 *
 * ## O que estava medido errado
 *
 * A casa da criança estava na primeira família e é da segunda. O
 * `KidHomeScreen` já se declara `h-screen`, e a moldura o embrulhava em
 * `min-h-screen pt-5 pb-8 pb-16`. Somando: **1056px de documento numa janela
 * de 940** — 116px a mais. O efeito na tela do tablet: a página descia
 * sozinha 64px e levava embora o cabeçalho inteiro, com o nome da criança, o
 * ofensivo de dias seguidos e o contador de moedinhas. A criança perdia de
 * vista exatamente o que o aplicativo usa para recompensá-la.
 */

/** Telas que são o aplicativo inteiro: viewport exata, sem rolagem de página. */
export function telaDeAppInteiro(screenName?: string): boolean {
  return screenName === "game" || screenName === "home";
}

export function shellRootClass(screenName?: string): string {
  const viewport = telaDeAppInteiro(screenName) ? "h-[100dvh] pb-0" : "min-h-screen pb-16";
  return `relative w-full overflow-hidden transition-colors duration-500 ${viewport}`;
}

/** A caixa interna: sem padding próprio onde a tela já é o aplicativo inteiro. */
export function shellBoxClass(screenName?: string): string {
  return telaDeAppInteiro(screenName)
    ? "relative mx-auto w-full flex flex-col h-[100dvh] max-w-3xl overflow-hidden"
    : "relative mx-auto w-full px-4 pt-5 pb-8 flex flex-col min-h-screen max-w-md";
}
