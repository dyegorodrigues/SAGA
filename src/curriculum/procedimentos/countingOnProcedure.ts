import type { AnswerMeta } from "../../types";
import { masteryDisqualifier } from "../masterySignals";
import type { CountingOnSpec } from "./countingOnContract";
import { CountingOnMisconception, type CountingOnMisconception as CountingOnMisconceptionTag } from "./countingOnSemantics";

export type EstrategiaDePartidaCountingOn = "maior" | "menor" | "um";

export interface AcaoCountingOn {
  tipo: "partida" | "salto" | "resposta";
  correta: boolean;
  valor: number;
  esperado: number;
  /**
   * Intenção do gesto inicial. É dado semântico, não inferência do número:
   * quando a parcela menor é 1, "começar pelo menor" e "recontar do 1"
   * possuem o mesmo valor mas são misconceptions diferentes.
   */
  estrategiaPartida?: EstrategiaDePartidaCountingOn;
  errosConceituais?: readonly CountingOnMisconceptionTag[];
}

export function diagnosticarCountingOn(
  acao: AcaoCountingOn,
  spec: CountingOnSpec,
): CountingOnMisconceptionTag | undefined {
  if (acao.correta) return undefined;
  if (acao.tipo === "partida") {
    if (acao.estrategiaPartida === "um") return CountingOnMisconception.CONTA_TUDO;
    if (acao.estrategiaPartida === "menor") return CountingOnMisconception.NAO_ESCOLHE_MAIOR;
    // Compatibilidade defensiva para ações antigas sem a intenção explícita.
    if (acao.valor === 1) return CountingOnMisconception.CONTA_TUDO;
    if (acao.valor === spec.menor) return CountingOnMisconception.NAO_ESCOLHE_MAIOR;
    return CountingOnMisconception.NAO_ESCOLHE_MAIOR;
  }
  if (acao.tipo === "salto") return CountingOnMisconception.OFF_BY_ONE;
  if (acao.tipo === "resposta" && Math.abs(acao.valor - spec.total) === 1) {
    return CountingOnMisconception.OFF_BY_ONE;
  }
  return undefined;
}

/**
 * A F14 mede a estratégia pelo gesto de partida/saltos, nunca pelo RT. Se a
 * criança corrige um erro conceitual e termina certa, a tentativa continua real
 * e o Radar preserva a hipótese, mas ela não compra domínio independente.
 */
export function metaCountingOn(acao: AcaoCountingOn, spec: CountingOnSpec): AnswerMeta {
  const misconception = diagnosticarCountingOn(acao, spec);
  const erros = [...new Set(acao.errosConceituais ?? [])];
  const evidencias = acao.correta && erros.length
    ? erros.map(tag => masteryDisqualifier(tag))
    : [];
  return {
    ...(misconception ? { misconception } : {}),
    ...(evidencias.length ? { evidencias } : {}),
  };
}
