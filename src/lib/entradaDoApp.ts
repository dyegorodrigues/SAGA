/**
 * Quem pode entrar no app, e o que a tela mostra enquanto isso.
 *
 * Esta decisão morava espalhada em dois efeitos e numa guarda de render dentro
 * do `App`, e a combinação deixava a porta trancada por fora:
 *
 * - a guarda de render exigia `state` para desenhar QUALQUER tela, e `state` só
 *   nascia depois de uma sessão do Firebase. Sem sessão — que é a situação de
 *   toda criança na primeira vez — a tela de login nunca era desenhada, e o app
 *   ficava em "Carregando SAGA..." para sempre;
 * - o caminho de visitante só era percorrido sob `?e2e=1`. Fora do teste,
 *   tocar em "Começar sem Conta" acendia uma flag e não abria nada.
 *
 * O currículo inteiro ficava atrás de uma porta que não abria. Separar a decisão
 * em funções puras é o que permite um teste provar a porta aberta sem precisar
 * de Firebase, de rede ou de navegador.
 */
export type NomeDeTela = "loading" | "login" | "setup" | "pick" | "home" | "game" | "album" | "gallery" | "parent" | "admin";

/**
 * A tela de entrada, dado o que se sabe da identidade.
 *
 * `visitante` é decisão local e não depende de nuvem: uma criança sem conta,
 * sem rede e sem sessão precisa conseguir jogar. É por isso que ela não espera
 * o Firebase responder.
 */
export function telaDeEntrada(input: { temSessao: boolean; visitante: boolean }): "login" | "sessao" | "local" {
  if (input.temSessao) return "sessao";
  if (input.visitante) return "local";
  return "login";
}

/**
 * A tela pode ser desenhada sem estado carregado?
 *
 * Só o "carregando" e o login existem antes de haver estado. Qualquer outra
 * precisa dele — e a guarda antiga tratava TODAS assim, inclusive o login, que
 * é justamente a tela onde o estado ainda não pode existir.
 *
 * O parâmetro é `string` e não a união: `App` guarda o nome da tela solto, e
 * tela desconhecida cai no lado seguro — exige estado. Uma tela nova nascer
 * precisando de estado é chato; nascer podendo aparecer sem ele é o defeito que
 * esta função existe para impedir.
 */
export function precisaDeEstado(tela: string): boolean {
  return tela !== "loading" && tela !== "login";
}

/** O app deve mostrar "Carregando..." agora? */
export function mostrandoCarregamento(tela: string, temEstado: boolean): boolean {
  if (tela === "loading") return true;
  return precisaDeEstado(tela) && !temEstado;
}
