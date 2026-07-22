import grafoJson from "../data/grafo_saga.json";

export interface SagaNode {
  id: string;
  nome: string;
  strand: string;
  faixa: string;
  prereqs: string[];
}

export const GrafoSaga = grafoJson as {
  strands: Record<string, string>;
  nodes: SagaNode[];
  fluency: Array<{ id: string; familia?: "FD" | "PD"; nome: string; destrava: Record<string, number>; rt_max_s?: number; degraus?: any }>;
};
