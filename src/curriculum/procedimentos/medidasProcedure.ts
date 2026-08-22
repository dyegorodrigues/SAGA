import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/** F50 — comparar e conservar massa/capacidade sem unidade padronizada. */
export type ModoMedida = "peso" | "capacidade";

export interface AcaoDeMedida {
  modo: ModoMedida;
  escolhido: number;
  certo: number;
  ordemProduzida?: number[];
  ordemCerta: number[];
  ordemVisual: number[];
  contraintuitivo: boolean;
  formatosDiferentes: boolean;
  verificou: boolean;
  maiorVisual: number;
}

function mesmaOrdem(a: number[] | undefined, b: number[]): boolean {
  return Boolean(a && a.length === b.length && a.every((v, i) => v === b[i]));
}

export function acertou(acao: AcaoDeMedida): boolean {
  if (acao.ordemProduzida) return mesmaOrdem(acao.ordemProduzida, acao.ordemCerta);
  return acao.escolhido === acao.certo;
}

/** §6 — hipótese cognitiva, nunca punição. */
export function diagnosticar(acao: AcaoDeMedida): string | undefined {
  if (acertou(acao)) return undefined;

  if (acao.modo === "capacidade" && acao.formatosDiferentes && !acao.verificou) {
    return MisconceptionTag.IGNORA_FORMATO;
  }

  if (acao.ordemProduzida && mesmaOrdem(acao.ordemProduzida, acao.ordemVisual)) {
    return acao.modo === "peso"
      ? MisconceptionTag.CONFUNDE_PESO_VOLUME
      : MisconceptionTag.IGNORA_FORMATO;
  }

  const primeiro = acao.ordemProduzida?.[0] ?? acao.escolhido;
  if (primeiro === acao.maiorVisual) return MisconceptionTag.JULGA_PELO_TAMANHO;

  return acao.modo === "peso"
    ? MisconceptionTag.CONFUNDE_PESO_VOLUME
    : MisconceptionTag.IGNORA_FORMATO;
}

/** §9: pelo menos um acerto no caso que contradiz a aparência. */
export function evidenciasDe(acao: AcaoDeMedida): string[] {
  const verificacaoCumprida = acao.modo !== "capacidade" || acao.verificou;
  return acertou(acao) && acao.contraintuitivo && verificacaoCumprida
    ? [Evidencia.CASO_CONTRAINTUITIVO]
    : [];
}

export function dominou(historico: AcaoDeMedida[]): boolean {
  const corretas = historico.filter(acertou);
  return corretas.length >= 3 && corretas.some(a => a.contraintuitivo);
}
