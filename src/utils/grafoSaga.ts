import grafoRaw from "../data/grafo_saga.json";

export interface SagaNode {
  id: string;
  nome: string;
  strand: string;
  faixa: string;
  prereqs: string[];
}

export const GrafoSaga = {
  strands: (grafoRaw as any).strands as Record<string, string>,
  nodes: (grafoRaw as any).nodes.map((data: any) => ({
    id: data.id,
    nome: data.nome,
    strand: data.strand,
    faixa: data.faixa || "",
    prereqs: data.prereqs || []
  })) as SagaNode[],
  fluency: (grafoRaw as any).fluency as Array<{ id: string; familia?: "FD" | "PD"; nome: string; destrava: Record<string, number>; rt_max_s?: number; degraus?: any }>
};
