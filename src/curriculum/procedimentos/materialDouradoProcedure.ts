import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";
import type { MaterialDouradoSpec } from "./materialDouradoContract";

export type ModoMaterialDourado = "ler" | "produzir";

/**
 * Leitura de uma tentativa F21 no boundary pedagógico.
 *
 * A resposta numérica sozinha não distingue "ignorou a dezena" de "contou os
 * dez quadradinhos da barra". O gesto viaja junto para o Radar, como já acontece
 * em pareamento, produção e grandezas.
 */
export interface AcaoMaterialDourado {
  modo: ModoMaterialDourado;
  resposta: number;
  dezenasProduzidas: number;
  unidadesProduzidas: number;
  contouSubdivisoes: boolean;
  completouTroca: boolean;
}

export function diagnosticarMaterialDourado(
  acao: AcaoMaterialDourado,
  spec: MaterialDouradoSpec,
): MisconceptionTagType | undefined {
  if (acao.resposta === spec.resposta
    && acao.dezenasProduzidas === spec.dezenas
    && acao.unidadesProduzidas === spec.unidades) return undefined;

  if (acao.modo === "produzir") {
    if (acao.dezenasProduzidas === spec.unidades
      && acao.unidadesProduzidas === spec.dezenas) {
      return MisconceptionTag.TROCA_DU;
    }
    return undefined;
  }

  // A assinatura de gesto é mais específica que o valor escolhido: se a
  // criança abriu a barra em dez quadradinhos para decidir e ainda errou, a
  // intervenção é "a barra já é UMA dezena", não treino de numeral.
  if (acao.contouSubdivisoes) return MisconceptionTag.CONTA_TUDO;
  if (acao.resposta === spec.unidades) return MisconceptionTag.IGNORA_DEZENA;
  if (acao.resposta === spec.dezenas * 100 + spec.unidades) return MisconceptionTag.CONCATENA;
  return undefined;
}

export function evidenciasMaterialDourado(
  acao: AcaoMaterialDourado,
  spec: MaterialDouradoSpec,
): string[] {
  const evidencias: string[] = [];
  if (spec.exigeTroca && acao.completouTroca) evidencias.push("troca-10-por-1");
  if (acao.modo === "produzir" && acao.resposta === spec.resposta && !acao.contouSubdivisoes) {
    evidencias.push("producao-sem-contar-subdivisoes");
  }
  return evidencias;
}
