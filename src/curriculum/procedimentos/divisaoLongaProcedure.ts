import { Evidencia } from "../../constants/evidencias";

export interface TentativaDivisaoLonga {
  nivel: number;
  resposta: string;
  respostaCorreta: string;
}

/** Evidência conceitual da F69: o zero posicional só vale quando a resposta inteira está correta. */
export function evidenciasDivisaoLonga(tentativa: TentativaDivisaoLonga): string[] {
  if (tentativa.resposta !== tentativa.respostaCorreta) return [];
  return tentativa.nivel === 5 ? [Evidencia.DIVISAO_ZERO_QUOCIENTE] : [];
}

export function formatarQuocienteResto(quociente: number, resto: number): string {
  return resto > 0 ? `${quociente} r ${resto}` : String(quociente);
}

export function restoEhValido(dividendo: number, divisor: number, quociente: number, resto: number): boolean {
  return divisor > 0 && resto >= 0 && resto < divisor && divisor * quociente + resto === dividendo;
}
