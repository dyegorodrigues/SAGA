import { MisconceptionTagType } from "../constants/misconceptions";

/**
 * RadarEngine (Fase 5 - Stub)
 * Ouve os erros do GameLoop e, se bater com uma Misconception conhecida,
 * aciona a interveção da Camada 2 (ex: Mão Fantasma) ou Camada 3 (IA).
 */
export function analyzeMisconception(
  tag: MisconceptionTagType | string,
  question: any
) {
  // TODO: Fase 5 plena será implementada aqui para mapear a tag de erro
  // e disparar a resposta correspondente.
  console.log(`[RadarEngine] Misconception detectada: ${tag}`, question);
  return {
    needsIntervention: true,
    tag,
  };
}
