/**
 * RadarEngine - Motor da Revisão Espaçada (Leitner Simplificado)
 * 
 * Controla os baldes baseados na Força (0-5) dos conceitos.
 * Força 1: ~1 dia, Força 2: ~2 dias, Força 3: ~4 dias, Força 4: ~9 dias, Força 5: ~21 dias
 */

import { Progress } from "../types";

export const RadarEngine = {
  // Retorna IDs de trilhas/nós que precisam de revisão hoje
  getRescueItems: (kidId: string, pMap: Record<string, Progress>): string[] => {
    // Stub
    return [];
  },
  
  // Atualiza o balde baseado no tempo e acerto
  evaluateSpacedRepetition: (kidId: string, trackId: string, right: boolean, durationMs: number) => {
    // Stub
  }
};

export const trackMisconception = (kidId: string, node: string, tag: string) => {
  // Stub
};
