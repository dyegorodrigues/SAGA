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
 * O modo visitante, depois de o Firebase dizer o que sabe.
 *
 * ## O defeito que esta função existe para impedir
 *
 * O ouvinte de autenticação zerava o modo visitante sempre que não havia sessão
 * no Firebase — e não haver sessão é exatamente a situação de quem escolheu
 * "Começar sem Conta". A escolha continuava gravada no aparelho, mas era
 * apagada da memória no primeiro instante do boot, e a criança **voltava para a
 * tela de login toda vez que reabria o app**. O caminho rápido, o que um pai usa
 * para só experimentar, perdia a criança em toda reabertura.
 *
 * Havia até um gancho `?e2e=1` para "não deixar o reset de auth mandar de volta
 * pro login": o comportamento era conhecido e fora contornado para o teste, não
 * para a criança.
 *
 * ## A regra
 *
 * Havendo sessão, quem manda é ela: sessão anônima é visitante, sessão de conta
 * não é. **Não havendo sessão, quem manda é a escolha local** — e ela é
 * autoritativa porque `logoutUser()` e o botão de sair apagam a marca do
 * aparelho ao encerrar. Zerar aqui, além de errado, roubava daquela marca a
 * única função que ela tinha.
 *
 * `anonimo` é `null` quando não há sessão nenhuma — que é diferente de haver uma
 * sessão não-anônima, e a diferença é a razão de o parâmetro não ser booleano.
 */
export function modoVisitante(input: { anonimo: boolean | null; escolhaLocal: boolean; e2e: boolean }): boolean {
  if (input.anonimo !== null) return input.anonimo;
  return input.e2e || input.escolhaLocal;
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
