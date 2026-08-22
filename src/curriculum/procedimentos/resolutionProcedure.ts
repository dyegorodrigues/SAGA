import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";

function indexValido<TShow, TParcial, TMisconception extends string>(
  resolucao: ResolucaoDeclarativa<TShow, TParcial, TMisconception>,
  index: number,
): boolean {
  return Number.isInteger(index) && index >= 0 && index < resolucao.passos.length;
}

/**
 * Escolhe onde a explicação começa. Uma misconception explicitamente mapeada
 * sempre vence; caso contrário, usa apenas o fallback declarado pela família.
 * Sem tag/fallback, a resolução começa no primeiro passo.
 */
export function pontoDeEntradaDaResolucao<
  TShow,
  TParcial,
  TMisconception extends string,
>(
  resolucao: ResolucaoDeclarativa<TShow, TParcial, TMisconception>,
  misconception?: TMisconception | string | null,
): number {
  if (misconception) {
    const index = resolucao.passos.findIndex((passo) => passo.corrige?.includes(misconception as TMisconception));
    if (index >= 0) return index;
  }
  if (resolucao.fallback !== undefined && indexValido(resolucao, resolucao.fallback)) {
    return resolucao.fallback;
  }
  return 0;
}

/**
 * Snapshot a instalar ANTES da fala/ação do passo escolhido. Para k=0 usa o
 * estado inicial; para k>0 usa diretamente o snapshot completo do passo k-1.
 * Nenhum passo anterior é executado para reconstruir o tabuleiro.
 */
export function estadoAntesDoPasso<
  TShow,
  TParcial,
  TMisconception extends string,
>(
  resolucao: ResolucaoDeclarativa<TShow, TParcial, TMisconception>,
  index: number,
): TShow {
  if (!indexValido(resolucao, index)) {
    throw new RangeError(`Passo de resolução fora do intervalo: ${index}`);
  }
  return index === 0 ? resolucao.estadoInicial : resolucao.passos[index - 1].show;
}

/**
 * Retorna misconceptions geráveis sem passo corretivo quando a família também
 * não declarou fallback. É um gate de cobertura sem impor taxonomia global.
 */
export function misconceptionsSemCobertura<
  TShow,
  TParcial,
  TMisconception extends string,
>(
  resolucao: ResolucaoDeclarativa<TShow, TParcial, TMisconception>,
  geraveis: readonly TMisconception[],
): TMisconception[] {
  if (resolucao.fallback !== undefined && indexValido(resolucao, resolucao.fallback)) return [];
  return geraveis.filter((tag) => !resolucao.passos.some((passo) => passo.corrige?.includes(tag)));
}

/**
 * Gate universal para famílias com resposta escalar/validável: o último passo
 * precisa materializar essa resposta no `parcial` declarado.
 */
export function resolucaoTerminaNaResposta<
  TShow,
  TParcial,
  TMisconception extends string,
>(
  resolucao: ResolucaoDeclarativa<TShow, TParcial, TMisconception>,
  resposta: TParcial,
  equals: (a: TParcial | undefined, b: TParcial) => boolean = Object.is,
): boolean {
  const ultimo = resolucao.passos.at(-1);
  return !!ultimo && equals(ultimo.parcial, resposta);
}
