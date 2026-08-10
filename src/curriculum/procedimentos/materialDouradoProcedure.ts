import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";
import type { MaterialDouradoSpec } from "./materialDouradoContract";

export type ModoMaterialDourado = "agrupar" | "montar" | "decompor";

/**
 * Leitura de uma tentativa F21 no boundary pedagógico.
 *
 * O valor final sozinho não prova a ideia de dezena: o gesto precisa viajar
 * junto para distinguir quem agrupou de quem contou tudo de um em um, e para
 * detectar a inversão D↔U na montagem/decomposição.
 */
export interface AcaoMaterialDourado {
  modo: ModoMaterialDourado;
  resposta: number;
  dezenasProduzidas: number;
  unidadesProduzidas: number;
  /** Verdadeiro quando a criança reabre/reconta uma barra já formada. */
  contouUmAUm: boolean;
  /** Quantas trocas efetivas 10U → 1D ocorreram nesta tentativa. */
  trocasConcluidas: number;
}

export function diagnosticarMaterialDourado(
  acao: AcaoMaterialDourado,
  spec: MaterialDouradoSpec,
): MisconceptionTagType | undefined {
  // F21 §6: contar tudo de um em um é erro conceitual mesmo quando o total final
  // sai correto — acertou a quantidade, mas não instalou a dezena como unidade.
  if (acao.modo === "agrupar" && acao.contouUmAUm) {
    return MisconceptionTag.NAO_AGRUPA;
  }

  const ordensInvertidas = acao.dezenasProduzidas === spec.unidades
    && acao.unidadesProduzidas === spec.dezenas
    && (spec.dezenas !== spec.unidades);
  if ((acao.modo === "montar" || acao.modo === "decompor") && ordensInvertidas) {
    return MisconceptionTag.INVERTE_ORDENS;
  }

  // F21 §6: tratou barra/cubinho como unidades equivalentes; a assinatura mais
  // nítida é somar os algarismos/peças em vez de respeitar valor posicional.
  if (acao.resposta === spec.dezenas + spec.unidades) {
    return MisconceptionTag.IGNORA_VALOR;
  }

  return undefined;
}

export function evidenciasMaterialDourado(
  acao: AcaoMaterialDourado,
  spec: MaterialDouradoSpec,
): string[] {
  const evidencias: string[] = [];

  if (acao.modo === "agrupar"
    && acao.resposta === spec.total
    && acao.trocasConcluidas === spec.dezenas
    && !acao.contouUmAUm) {
    evidencias.push("agrupou-dez-em-dez");
  }

  // Regra extra de domínio da F21 §9: pelo menos um acerto no nível 4, em que
  // a direção se inverte e a criança monta o material a partir do numeral.
  if (acao.modo === "montar"
    && acao.resposta === spec.total
    && acao.dezenasProduzidas === spec.dezenas
    && acao.unidadesProduzidas === spec.unidades
    && !acao.contouUmAUm) {
    evidencias.push("montou-do-numeral");
  }

  if (acao.modo === "decompor"
    && acao.resposta === spec.total
    && acao.dezenasProduzidas === spec.dezenas
    && acao.unidadesProduzidas === spec.unidades) {
    evidencias.push("decomposicao-mental-du");
  }

  return evidencias;
}
