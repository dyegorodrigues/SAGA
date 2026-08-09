import type { AulaPlan, RescuePlanItem } from "./composer";

/**
 * Porta única da Aula do Dia.
 *
 * A criança toca o mesmo botão do Sensei. Quem decide se hoje é progressão ou
 * reconstrução é o Tutor, com base no plano já calculado pelo Radar/DAG.
 * Revisão espaçada e banco de erros podem continuar como retrieval curto dentro
 * de uma aula normal; uma lacuna causal de conceito/pré-requisito muda a missão
 * principal para uma Oficina executável, com dose e critério de saída próprios.
 */
export type SenseiEntry =
  | { kind: "lesson" }
  | { kind: "rescue"; rescue: RescuePlanItem };

const isCausalRescue = (rescue: RescuePlanItem) =>
  rescue.reason === "prerequisite-gap" || rescue.reason === "misconception";

export function chooseSenseiEntry(plan: AulaPlan): SenseiEntry {
  // Base bloqueante primeiro: se existe um pré-requisito imaturo, insistir na
  // fronteira seria ensinar o andar de cima enquanto o degrau ainda falta.
  const prerequisiteGap = plan.resgates.find(rescue => rescue.reason === "prerequisite-gap");
  if (prerequisiteGap) return { kind: "rescue", rescue: prerequisiteGap };

  const misconception = plan.resgates.find(rescue => rescue.reason === "misconception");
  if (misconception) return { kind: "rescue", rescue: misconception };

  return { kind: "lesson" };
}

/** Exportado para auditorias/UX sem duplicar a definição de "resgate causal". */
export function causalRescues(plan: AulaPlan): RescuePlanItem[] {
  return plan.resgates.filter(isCausalRescue);
}
