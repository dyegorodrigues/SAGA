import { Evidencia } from "../../constants/evidencias";
import type { RazaoProporcaoF88Spec } from "./razaoProporcaoContract";

/**
 * Evidências conceituais observáveis da F88.
 *
 * A função é pura para que o mesmo emissor usado pelo palco seja auditado pela
 * P13. Resposta errada nunca emite evidência de domínio; tempo de resposta não
 * participa desta decisão.
 */
export function evidenciasRazaoProporcaoF88(
  spec: RazaoProporcaoF88Spec,
  correta: boolean,
): string[] {
  if (!correta) return [];

  const evidencias = [`f88-${spec.modo}`, "f88-mesmo-fator"];
  if (spec.escalaNaoInteira) evidencias.push(Evidencia.ESCALA_NAO_INTEIRA_F88);
  return evidencias;
}