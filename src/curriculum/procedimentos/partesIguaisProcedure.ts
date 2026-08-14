import { Evidencia } from "../../constants/evidencias";

export const TOLERANCIA_DIVISAO_PARTES_IGUAIS = 0.035;

const ordenar = (valores: number[]) => [...valores].sort((a, b) => a - b);

export function cortesAlvoPartesIguais(denominador: number): number[] {
  if (![2, 3, 4].includes(denominador)) throw new Error(`denominador F45 inválido: ${denominador}`);
  return Array.from({ length: denominador - 1 }, (_, indice) => (indice + 1) / denominador);
}

export function intervalosDosCortes(cortes: number[]): number[] {
  const ordenados = ordenar(cortes);
  const bordas = [0, ...ordenados, 1];
  return bordas.slice(1).map((fim, indice) => fim - bordas[indice]);
}

export function cortesSaoPartesIguais(
  cortes: number[],
  denominador: number,
  tolerancia = TOLERANCIA_DIVISAO_PARTES_IGUAIS,
): boolean {
  if (cortes.length !== denominador - 1) return false;
  const ordenados = ordenar(cortes);
  if (ordenados.some(valor => !Number.isFinite(valor) || valor <= 0 || valor >= 1)) return false;
  const intervalos = intervalosDosCortes(ordenados);
  const alvo = 1 / denominador;
  return intervalos.every(intervalo => Math.abs(intervalo - alvo) <= tolerancia);
}

export function evidenciasPartesIguais(acao: {
  nivel: number;
  denominador: number;
  cortes: number[];
}): string[] {
  return acao.nivel === 4 && cortesSaoPartesIguais(acao.cortes, acao.denominador)
    ? [Evidencia.PARTES_IGUAIS_DIVISAO]
    : [];
}
