/**
 * DojoEngine - Motor do Pilar de Fluência (SAGA)
 * 
 * NOTA: O Dojo é um pilar standalone (Academia vs Dojo).
 * Ele controla os alvos de tempo de reação (rt) e a precisão das trilhas
 * FD (Fatos) e PD (Procedimentos).
 */

import { Progress } from "../types";

export interface DojoItem {
  id: string; // Ex: "FD1", "PD2"
  strength: number; // 0 a 5
  rtTarget: number; // Limiar de tempo em ms
  lastTrained: string;
}

export const DojoEngine = {
  // Retorna os itens de fluência fracos para o bloco diário da Academia
  getDailyWarmup: (kidId: string, pMap: Record<string, Progress>): string[] => {
    // Stub
    return [];
  },

  // Retorna a saúde geral do Dojo do aluno
  getDojoHealth: (kidId: string): number => {
    // Stub
    return 100;
  }
};
