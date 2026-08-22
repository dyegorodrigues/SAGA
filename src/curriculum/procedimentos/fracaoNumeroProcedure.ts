import { Evidencia } from "../../constants/evidencias";

export interface AcaoFracaoNumero {
  nivel: number;
  correta: boolean;
}

/**
 * F72 só prova que a fração foi tratada como número quando há um acerto
 * efetivamente realizado na reta (L3+). Barra e coleção são pontes, não a prova.
 */
export function evidenciasFracaoNumero(acao: AcaoFracaoNumero): string[] {
  return acao.correta && acao.nivel >= 3 ? [Evidencia.FRACAO_NUMERO_RETA] : [];
}
