import { Evidencia } from "../../constants/evidencias";
import type { ContasVirgulaF76Spec } from "./contasVirgulaContract";

/** Evidências conceituais observáveis da F76; resposta errada nunca emite domínio. */
export function evidenciasContasVirgulaF76(spec: ContasVirgulaF76Spec, correta: boolean): string[] {
  if (!correta) return [];
  const evidencias = [`f76-${spec.modo}`, "f76-ordens-alinhadas-pela-virgula"];
  if (spec.nivel === 2 && spec.casasDiferentes) evidencias.push(Evidencia.CONTAS_VIRGULA_CASAS_DIFERENTES_F76);
  return evidencias;
}
