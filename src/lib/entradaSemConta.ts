/**
 * "Começar sem Conta" precisa funcionar sem conta — e sem internet.
 *
 * O botão chamava `loginAnonymously()`, que é uma sessão anônima do Firebase e
 * portanto exige rede. Sem rede ele não caía em lugar nenhum: ficava pendurado
 * na promessa, com o botão em "carregando" para sempre. E o `onContinueAsVisitor`
 * — o caminho local, que já existia e funcionava — era passado como prop e
 * NUNCA chamado. Callback morto na porta de entrada, do mesmo formato do
 * `DragGroup` que a CLASS-007 encontrou dentro de um palco.
 *
 * Quem toca nesse botão é justamente a criança que não tem conta e pode não ter
 * internet boa. A sessão anônima continua sendo tentada primeiro, porque é ela
 * que permite o progresso subir para a nuvem; mas ela deixa de ser condição
 * para jogar.
 */

/** Quanto tempo se espera a nuvem antes de abrir o app localmente. */
export const ESPERA_MAXIMA_DA_NUVEM_MS = 6000;

export type EntradaSemConta =
  | { via: "nuvem"; email: string }
  | { via: "local"; porque: "sem-resposta" | "falhou" };

/**
 * Tenta a sessão anônima e desiste no prazo.
 *
 * `Promise.race` com um relógio: sem o relógio, uma promessa que nunca resolve
 * — que é o que uma rede ruim produz — deixa a criança olhando um botão girando.
 * Desistir aqui não perde nada: o progresso local existe e sobe depois, quando
 * houver rede.
 */
export async function entrarSemConta(
  sessaoAnonima: () => Promise<{ email: string }>,
  esperaMs: number = ESPERA_MAXIMA_DA_NUVEM_MS,
  agendar: (fn: () => void, ms: number) => unknown = setTimeout,
): Promise<EntradaSemConta> {
  const relogio = new Promise<"sem-resposta">(resolve => { agendar(() => resolve("sem-resposta"), esperaMs); });
  try {
    const resultado = await Promise.race([sessaoAnonima(), relogio]);
    if (resultado === "sem-resposta") return { via: "local", porque: "sem-resposta" };
    return { via: "nuvem", email: resultado.email };
  } catch {
    return { via: "local", porque: "falhou" };
  }
}

/** O que se diz à criança quando a nuvem não veio. Nunca um erro: é um convite. */
export function recadoDaEntradaLocal(porque: "sem-resposta" | "falhou"): string {
  return porque === "sem-resposta"
    ? "A internet está devagar — dá para jogar assim mesmo! O progresso fica guardado aqui. ☁️"
    : "Sem internet agora? Sem problema: dá para jogar e o progresso fica guardado aqui. ☁️";
}
