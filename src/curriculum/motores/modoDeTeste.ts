/**
 * Modo de teste — a chave que abre as noventa competências.
 *
 * ## Por que existe
 *
 * O pai não consegue relatar defeito no que não consegue abrir:
 *
 * > *"Isso que eu nem sei os outros. Porque estão bloqueados, eu nem consegui
 * > testar ainda pra te falar a verdade."*
 *
 * O DAG de pré-requisitos é a espinha pedagógica do SAGA e está certo para a
 * criança: ela sobe uma competência de cada vez. Mas para quem TESTA o app ele
 * é uma parede — não dá para achar defeito no exercício 40 jogando o 1 até
 * dominar. Três rodadas de relato ficaram presas nos mesmos sete exercícios
 * iniciais por causa disso.
 *
 * ## Como se liga
 *
 * Pela URL, uma vez:
 *
 *     https://dyegorodrigues.github.io/SAGA/?destravado=123
 *
 * A chave fica guardada no aparelho, então depois basta abrir o link normal.
 * Para desligar: `?destravado=off`, ou o botão no rodapé da Jornada.
 *
 * ## O que ele NÃO faz
 *
 * Não mexe em progresso, estrelas, domínio nem em nada que o Radar leia: só
 * responde "aberta" para toda competência. O que a criança fez continua sendo
 * o que ela fez. É por isso que ele mora aqui e não dentro do `Progress` —
 * estado de teste que se mistura com estado de aprendizagem contamina a
 * medida, e a medida é o produto.
 *
 * ## Por que é provisório, e por que isso está escrito
 *
 * O pai pediu assim: *"Depois eu mando tirar."* Some o arquivo, some a
 * chamada em `computeUnlockStatus`, e o modo deixa de existir — é de
 * propósito que ele caiba nessas duas linhas.
 */

const CHAVE = "saga.modoDeTeste";
const SENHA = "123";

/** Lê a URL uma vez e guarda a decisão. Chamada na subida do app. */
export function lerChaveDaURL(): void {
  if (typeof window === "undefined") return;
  let valor: string | null = null;
  try {
    valor = new URLSearchParams(window.location.search).get("destravado");
  } catch {
    return;
  }
  if (valor === null) return;
  try {
    if (valor === SENHA) window.localStorage.setItem(CHAVE, "1");
    else window.localStorage.removeItem(CHAVE);
  } catch {
    // Aba anônima, armazenamento bloqueado: o modo simplesmente não persiste.
  }
}

/** O modo está ligado neste aparelho? */
export function modoDeTesteLigado(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

/** Desliga, para o botão da tela. */
export function desligarModoDeTeste(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CHAVE);
  } catch {
    // idem
  }
}
