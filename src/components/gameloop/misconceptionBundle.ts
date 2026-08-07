const SEPARADOR = "\u001f";

/**
 * `misconceptionForAnswer` é contrato histórico `string | undefined` e há
 * guardas que dependem disso. Quando UMA tentativa sustenta mais de uma
 * hipótese, empacotamos internamente sem alargar a API pública do GameLoop.
 *
 * Tags canônicas usam kebab-case; o separador de controle nunca aparece nelas.
 */
export function bundleMisconceptions(tags: Array<string | undefined>): string | undefined {
  const unicas = [...new Set(tags.filter((tag): tag is string => Boolean(tag)))];
  if (unicas.length === 0) return undefined;
  return unicas.join(SEPARADOR);
}

export function unbundleMisconceptions(bundle?: string): string[] {
  if (!bundle) return [];
  return [...new Set(bundle.split(SEPARADOR).filter(Boolean))];
}
