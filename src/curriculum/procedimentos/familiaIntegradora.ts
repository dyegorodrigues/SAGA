/**
 * CLASS-008 — o nível integrador e a família que ele exercitou.
 *
 * Um nível integrador declara reunir duas ou mais famílias conceitualmente
 * distinguíveis, o gerador sorteia entre elas a cada tentativa, e a regra de
 * domínio conta só acertos, janela e sessões. Assim a criança satisfaz o
 * mastery tendo demonstrado **uma** das famílias que o nível existe para
 * integrar — e a coroa diz que ela integrou.
 *
 * O mecanismo de reparo já existia: `FichaDominio.evidenciasDistintas` pede um
 * mínimo de evidências distintas com um prefixo, e o `progressEngine` já sabe
 * segurar a evidência da ficha até esse mínimo aparecer. O que faltava era o
 * caminho inteiro: ninguém EMITIA a identidade da família, e os builders
 * genéricos não TRANSPORTAVAM o requisito até `Question.masteryRule`.
 *
 * O nome da evidência é `familia:<ficha>:<familia>`. O prefixo por competência
 * é o que impede uma ficha de comprar diversidade com a família de outra.
 */
export const PREFIXO_FAMILIA = "familia:";

/** O prefixo que a `evidenciasDistintas` de uma competência deve exigir. */
export const prefixoDeFamilia = (fichaId: string): string => `${PREFIXO_FAMILIA}${fichaId}:`;

/** O nome da evidência que a questão emite ao ser respondida certo. */
export const evidenciaDeFamilia = (fichaId: string, familia: string): string =>
  `${prefixoDeFamilia(fichaId)}${familia}`;

/** A família de uma evidência, ou `undefined` se ela não for de família. */
export function familiaDaEvidencia(evidencia: string): string | undefined {
  if (!evidencia.startsWith(PREFIXO_FAMILIA)) return undefined;
  return evidencia.slice(evidencia.indexOf(":", PREFIXO_FAMILIA.length) + 1) || undefined;
}

/**
 * O requisito de diversidade de um nível integrador.
 *
 * `minimo` é quantas famílias diferentes precisam aparecer entre as tentativas
 * certas antes de a evidência da ficha ser dada. Dois é o piso: exigir todas
 * as famílias transformaria a coroa numa maratona, e o que a classe cobra é
 * que uma única família não baste.
 */
export const exigirFamiliasDistintas = (fichaId: string, descricao: string, minimo = 2) => ({
  prefixo: prefixoDeFamilia(fichaId),
  minimo,
  descricao,
});
