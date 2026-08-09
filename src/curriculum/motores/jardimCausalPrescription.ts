import type { AulaPlan } from "./composer";
import type { DojoTrackState, Progress, Track } from "../../types";
import { grafoSaga } from "../grafo_saga";
import { JARDIM, type TrilhaDoJardim } from "../fichas/dojo/jardim";
import { JARDIM_ROUND_ITENS, jardimTrack, resolveJardimState } from "./jardimSession";

export interface CausalJardimPrescription {
  trailId: string;
  motherId: string;
  motherName: string;
  sourceNodeId: string;
  /** Quantos arcos de pré-requisito separam o erro observado da base perceptual. */
  causalDistance: number;
  step: number;
  questionBudget: number;
  track: Track;
  reason: "known-perceptual-weakness";
  reasonText: string;
}

const graphById = new Map(grafoSaga.map(node => [node.id, node] as const));

/**
 * Distância do nó observado até um possível ancestral no DAG.
 * 0 = a própria competência-mãe; 1 = pré-requisito direto; etc.
 */
export function prerequisiteDistance(sourceNodeId: string, ancestorId: string): number | null {
  if (sourceNodeId === ancestorId) return 0;
  const seen = new Set<string>([sourceNodeId]);
  let frontier = [sourceNodeId];
  let distance = 0;

  while (frontier.length) {
    distance += 1;
    const next: string[] = [];
    for (const nodeId of frontier) {
      const node = graphById.get(nodeId);
      for (const prereq of node?.prereqs || []) {
        if (prereq === ancestorId) return distance;
        if (!seen.has(prereq)) {
          seen.add(prereq);
          next.push(prereq);
        }
      }
    }
    frontier = next;
  }
  return null;
}

/**
 * Evidência mínima para chamar uma dificuldade de AUTOMATICIDADE perceptual.
 *
 * Não basta a trilha estar aberta ou não-mastered: isso só provaria ausência de
 * treino. O Tutor exige uma observação real no próprio Jardim:
 * - round fraco recente; OU
 * - treino já recuou de um degrau conquistado; OU
 * - ao menos um round completo com precisão histórica abaixo de 80%.
 *
 * Acerto lento, sozinho, não vira misconception; ele continua dentro do motor
 * do Jardim e pode segurar avanço sem converter uma Aula conceitual em resgate.
 */
export function hasKnownJardimWeakness(state: DojoTrackState | undefined): boolean {
  if (!state || state.family !== "JD" || state.mastered || !state.unlocked) return false;
  if ((state.weakRounds || 0) > 0) return true;
  if ((state.currentStep || 1) < (state.highestStep || 1)) return true;
  const attempts = state.attempts || 0;
  if (attempts >= 6 && (state.correct || 0) / attempts < 0.8) return true;
  return false;
}

interface Candidate {
  trilha: TrilhaDoJardim;
  distance: number;
  step: number;
  motherName: string;
}

/**
 * Decide se uma misconception simbólica pede descida ao Jardim.
 *
 * Regras anti-falso-positivo:
 * 1. uma lacuna conceitual de pré-requisito ganha sempre — Jardim não substitui
 *    compreensão que ainda não chegou ao nível de desbloqueio;
 * 2. precisa existir misconception ativa no plano, não apenas revisão/banco;
 * 3. a mãe do JD precisa estar no caminho causal do nó observado;
 * 4. a mãe precisa desbloquear o Jardim;
 * 5. precisa haver fraqueza observada no próprio estado JD.
 *
 * Entre múltiplas bases comprovadamente fracas, escolhemos a mais próxima do
 * erro observado. Empates preservam a ordem canônica JD1→JD5.
 */
export function prescribeCausalJardim(
  plan: AulaPlan,
  progressByTrack: Record<string, Progress>,
  dojoTracks: Record<string, DojoTrackState>,
): CausalJardimPrescription | null {
  if (plan.resgates.some(rescue => rescue.reason === "prerequisite-gap")) return null;

  const misconception = plan.resgates.find(rescue => rescue.reason === "misconception");
  if (!misconception) return null;
  const sourceNodeId = misconception.sourceNodeId
    || misconception.track.graphId
    || misconception.track.id;
  if (!graphById.has(sourceNodeId)) return null;

  const candidates: Candidate[] = [];
  for (const trilha of JARDIM) {
    const distance = prerequisiteDistance(sourceNodeId, trilha.mae);
    if (distance === null) continue;

    const motherProgress = progressByTrack[trilha.mae];
    const resolved = resolveJardimState(trilha, motherProgress, dojoTracks[trilha.ficha.id]);
    if (!resolved.unlocked || resolved.mastered) continue;
    if (!hasKnownJardimWeakness(resolved)) continue;

    candidates.push({
      trilha,
      distance,
      step: resolved.currentStep,
      motherName: graphById.get(trilha.mae)?.nome || trilha.mae,
    });
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const chosen = candidates[0];
  if (!chosen) return null;

  return {
    trailId: chosen.trilha.ficha.id,
    motherId: chosen.trilha.mae,
    motherName: chosen.motherName,
    sourceNodeId,
    causalDistance: chosen.distance,
    step: chosen.step,
    questionBudget: JARDIM_ROUND_ITENS,
    track: jardimTrack(chosen.trilha),
    reason: "known-perceptual-weakness",
    reasonText: `A base perceptual ${chosen.motherName} já foi compreendida, mas o Jardim mostrou que ainda precisa virar reflexo.`,
  };
}
