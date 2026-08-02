import { Progress, Track } from "../../types";
import { GrafoSaga } from "../../utils/grafoSaga";

export const RESCUE_UNLOCK_LEVEL = 3;
export const RESCUE_ESCALATION_LIMIT = 3;

export interface RescuePrescription {
  track: Track;
  sourceNodeId: string;
  targetNodeId: string;
  requiredLevel: number;
  questionBudget: number;
  escalated: boolean;
}

const graphNode = (id: string) => GrafoSaga.nodes.find((node) => node.id === id);
const levelOf = (progress?: Progress) => progress?.dom
  ? 5
  : progress?.maxLvl || progress?.lvl || 0;

/**
 * Converte um padrão confirmado pelo Radar numa intervenção executável.
 *
 * A Oficina só desce para um pré-requisito quando ele ainda não atingiu o nível
 * que libera o nó dependente. Depois de três missões no mesmo alvo, sonda um
 * degrau anterior disponível, evitando repetir a mesma missão indefinidamente.
 * Se o catálogo atual não contém a ficha necessária, retorna `null`: o motor não
 * inventa conteúdo nem substitui uma ficha pedagógica ausente por fallback.
 */
export function prescribeMisconceptionRescue(
  sourceNodeId: string,
  tracks: Track[],
  progressByNode: Record<string, Progress>,
): RescuePrescription | null {
  const trackByNode = new Map(
    tracks
      .filter((track) => track.contentStatus !== "fallback")
      .map((track) => [track.graphId || track.id, track] as const),
  );

  const weakestUnreadyPrereq = (nodeId: string): string | null => {
    const node = graphNode(nodeId);
    if (!node) return null;
    return [...node.prereqs]
      .filter((id) => trackByNode.has(id) && levelOf(progressByNode[id]) < RESCUE_UNLOCK_LEVEL)
      .sort((a, b) => levelOf(progressByNode[a]) - levelOf(progressByNode[b]))[0] || null;
  };

  let targetNodeId = weakestUnreadyPrereq(sourceNodeId) || sourceNodeId;
  let escalated = false;
  const attempts = progressByNode[targetNodeId]?.rescueAttempts || 0;
  if (attempts >= RESCUE_ESCALATION_LIMIT) {
    const deeperPrereq = weakestUnreadyPrereq(targetNodeId);
    if (deeperPrereq) {
      targetNodeId = deeperPrereq;
      escalated = true;
    }
  }

  const track = trackByNode.get(targetNodeId);
  if (!track) return null;
  const currentLevel = levelOf(progressByNode[targetNodeId]);
  const requiredLevel = targetNodeId === sourceNodeId
    ? Math.min(5, Math.max(1, currentLevel) + 1)
    : RESCUE_UNLOCK_LEVEL;
  const gap = requiredLevel - currentLevel;

  return {
    track,
    sourceNodeId,
    targetNodeId,
    requiredLevel,
    questionBudget: gap >= 2 ? 8 : 4,
    escalated,
  };
}
