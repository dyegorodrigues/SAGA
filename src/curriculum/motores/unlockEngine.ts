import { GrafoSaga } from "../../utils/grafoSaga";
import { Progress } from "../../types";

export interface UnlockStatus {
  locked: string[];
  opened: string[];
  frontier: string[];
  dominated: string[];
}

export function computeUnlockStatus(pMap: Record<string, Progress>): UnlockStatus {
  const status: UnlockStatus = {
    locked: [],
    opened: [],
    frontier: [],
    dominated: []
  };

  for (const node of GrafoSaga.nodes) {
    const prog = pMap[node.id];
    
    const isMasteredForPrereq = prog && (prog.dom || (prog.maxLvl && prog.maxLvl >= 3));
    const isDominated = prog && prog.dom;

    if (isDominated) {
      status.dominated.push(node.id);
      status.opened.push(node.id);
      continue;
    }

    let allPrereqsMet = true;
    for (const pre of node.prereqs) {
      const preProg = pMap[pre];
      if (!preProg || !(preProg.dom || (preProg.maxLvl && preProg.maxLvl >= 3))) {
        allPrereqsMet = false;
        break;
      }
    }

    if (allPrereqsMet) {
      status.opened.push(node.id);
      if (!isDominated) {
        status.frontier.push(node.id);
      }
    } else {
      status.locked.push(node.id);
    }
  }

  return status;
}

export function canUnlockNode(nodeId: string, pMap: Record<string, Progress>): boolean {
  const status = computeUnlockStatus(pMap);
  return status.opened.includes(nodeId);
}

const GRAPH_NODE_IDS = new Set(GrafoSaga.nodes.map(node => node.id));

/**
 * Resolve a identidade curricular sem transformar cartuchos externos em nós
 * matemáticos. Tracks sem graphId e sem ID no Grafo não pertencem a este DAG e,
 * portanto, continuam acessíveis pelas regras do próprio cartucho.
 */
export function resolveGraphNodeId(trackId: string, graphId?: string): string | null {
  const candidate = graphId || trackId;
  return GRAPH_NODE_IDS.has(candidate) ? candidate : null;
}

export function isTrackUnlocked(
  trackId: string,
  graphId: string | undefined,
  status: UnlockStatus,
): boolean {
  const nodeId = resolveGraphNodeId(trackId, graphId);
  return nodeId === null || status.opened.includes(nodeId);
}
