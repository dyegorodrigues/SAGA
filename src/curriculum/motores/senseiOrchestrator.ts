import type { AulaPlan, RescuePlanItem } from "./composer";
import type { CausalJardimPrescription } from "./jardimCausalPrescription";

/**
 * Porta única da Aula do Dia.
 *
 * A criança toca o mesmo botão do Sensei. Quem decide se hoje é progressão,
 * reconstrução conceitual ou uma descida perceptual curta é o Tutor.
 *
 * Prioridade pedagógica:
 * 1. pré-requisito conceitual imaturo → Oficina;
 * 2. base perceptual no caminho causal E já provada fraca → Jardim;
 * 3. misconception sem causa perceptual provada → Oficina no alvo;
 * 4. revisão/banco ficam dentro da Aula normal.
 */
export type SenseiEntry =
  | { kind: "lesson" }
  | { kind: "rescue"; rescue: RescuePlanItem }
  | { kind: "garden"; prescription: CausalJardimPrescription };

const isCausalRescue = (rescue: RescuePlanItem) =>
  rescue.reason === "prerequisite-gap" || rescue.reason === "misconception";

export function chooseSenseiEntry(
  plan: AulaPlan,
  causalJardim: CausalJardimPrescription | null = null,
): SenseiEntry {
  // Base conceitual bloqueante primeiro: Jardim automatiza algo já compreendido;
  // não substitui um pré-requisito que ainda nem chegou ao nível necessário.
  const prerequisiteGap = plan.resgates.find(rescue => rescue.reason === "prerequisite-gap");
  if (prerequisiteGap) return { kind: "rescue", rescue: prerequisiteGap };

  // Só chega preenchido quando o planner provou cadeia no DAG + fraqueza real JD.
  if (causalJardim) return { kind: "garden", prescription: causalJardim };

  const misconception = plan.resgates.find(rescue => rescue.reason === "misconception");
  if (misconception) return { kind: "rescue", rescue: misconception };

  return { kind: "lesson" };
}

/** Exportado para auditorias/UX sem duplicar a definição de "resgate causal". */
export function causalRescues(plan: AulaPlan): RescuePlanItem[] {
  return plan.resgates.filter(isCausalRescue);
}
