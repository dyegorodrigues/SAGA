import { Evidencia } from "../../constants/evidencias";
import type { EquacoesF90Spec } from "./equacoesContract";

/** Evidências conceituais observáveis da F90; resposta errada nunca emite domínio. */
export function evidenciasEquacoesF90(spec: EquacoesF90Spec, correta: boolean): string[] {
  if (!correta) return [];
  const evidencias = [`f90-${spec.modo}`, "f90-equilibrio-preservado"];
  if (spec.nivel >= 3) evidencias.push(Evidencia.EQUACAO_L3_MAIS_F90);
  return evidencias;
}
