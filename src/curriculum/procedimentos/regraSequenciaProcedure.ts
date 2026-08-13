import { REGRA_SEQUENCIA_DESAFIO_PREFIX, RegraSequenciaMisconception, type RegraSequenciaF57Spec } from "./regraSequenciaContract";

export interface AcaoRegraSequencia {
  nivel: number;
  resposta: number;
  respostaCorreta: number;
  spec: RegraSequenciaF57Spec;
}

export function acertouRegraSequencia(acao: AcaoRegraSequencia): boolean {
  return acao.resposta === acao.respostaCorreta;
}

export function evidenciasRegraSequencia(acao: AcaoRegraSequencia): string[] {
  if (!acertouRegraSequencia(acao)) return [];
  if (acao.nivel === 3) return [REGRA_SEQUENCIA_DESAFIO_PREFIX + "decrescente"];
  if (acao.nivel === 4) return [REGRA_SEQUENCIA_DESAFIO_PREFIX + "lacuna-meio"];
  return [];
}

export function diagnosticarRegraSequencia(acao: AcaoRegraSequencia): string | undefined {
  if (acertouRegraSequencia(acao)) return undefined;
  const conhecidos = acao.spec.termos.filter((valor): valor is number => typeof valor === "number");
  const ultimo = conhecidos.length ? conhecidos[conhecidos.length - 1] : undefined;
  const penultimo = conhecidos.length > 1 ? conhecidos[conhecidos.length - 2] : undefined;

  if (acao.nivel === 5 && ultimo !== undefined && penultimo !== undefined && acao.resposta === ultimo + (ultimo - penultimo)) {
    return RegraSequenciaMisconception.SOMA_QUANDO_MULTIPLICA;
  }
  if (acao.nivel === 3 && ultimo !== undefined && acao.resposta > ultimo) {
    return RegraSequenciaMisconception.IGNORA_DIRECAO;
  }
  return RegraSequenciaMisconception.SO_ULTIMO_PAR;
}
