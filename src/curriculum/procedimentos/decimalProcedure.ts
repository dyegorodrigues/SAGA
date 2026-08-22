import { Evidencia } from "../../constants/evidencias";

export function evidenciasDecimais(nivel: number, correta: boolean): string[] {
  return nivel === 4 && correta ? [Evidencia.DECIMAL_COMPARACAO] : [];
}
