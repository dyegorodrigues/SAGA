import { diagnosticar as diagnosticarPareamento } from "../../curriculum/procedimentos/pareamentoProcedure";
import { AcaoDeClassificacao, diagnosticar as diagnosticarClassificacao } from "../../curriculum/procedimentos/classificacaoProcedure";
import { AcaoDeProducao, diagnosticar as diagnosticarProducao } from "../../curriculum/procedimentos/producaoProcedure";
import { AcaoDePosicao, diagnosticar as diagnosticarPosicao } from "../../curriculum/procedimentos/posicaoProcedure";
import { AcaoDeForma, diagnosticar as diagnosticarForma } from "../../curriculum/procedimentos/formaProcedure";
import { AcaoDeGrandeza, diagnosticar as diagnosticarGrandeza, evidenciasDe as evidenciasDaGrandeza } from "../../curriculum/procedimentos/grandezaProcedure";
import { AcaoDeContagem, evidenciasDe as evidenciasDaContagem } from "../../curriculum/procedimentos/touchCountProcedure";
import { AcaoDaMoldura, diagnosticar as diagnosticarMoldura, evidenciasDe as evidenciasDaMoldura } from "../../curriculum/procedimentos/tenFrameProcedure";
import {
  RespostaOuvidaRuntime,
  diagnosticarAudioChoiceRuntime,
  evidenciasAudioChoiceRuntime,
} from "../../curriculum/procedimentos/audioChoiceRuntime";
import { AcaoDeProducao as AcaoP, evidenciasDe as evidenciasDaProducao } from "../../curriculum/procedimentos/producaoProcedure";
import { AcaoDeForma as AcaoF, evidenciasDe as evidenciasDaForma } from "../../curriculum/procedimentos/formaProcedure";
import { classificarErro, podeGerarDiagnostico } from "../../curriculum/procedimentos/filtroMotor";
import { AnswerMeta, Question } from "../../types";

/** Uma tentativa pode carregar mais de uma hipótese sem virar duas tentativas. */
export type MisconceptionResult = string | string[] | undefined;
type ProducaoComHistorico = AcaoDeProducao & { diagnosticosLongitudinais?: string[] };

function unirHipoteses(...tags: Array<string | undefined>): MisconceptionResult {
  const unicas = [...new Set(tags.filter((tag): tag is string => Boolean(tag)))];
  if (unicas.length === 0) return undefined;
  return unicas.length === 1 ? unicas[0] : unicas;
}

/**
 * §8.3-bis: o erro veio do dedo, não da cabeça?
 * Só responde `true` quando houve gesto (`manipulacao`).
 */
export function isMotorSlip(meta?: AnswerMeta): boolean {
  return meta?.manipulacao !== undefined && classificarErro(meta.manipulacao) === "motor";
}

export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  if (value === "__timeout__") return false;
  if (isMotorSlip(meta)) return true;
  return Boolean(q.options || q.groups || meta?.source);
}

/**
 * F04 e F05 possuem o próprio ciclo de erro. O GameLoop registra a tentativa,
 * mas não acrescenta `Ops`, não esconde opção e não aplica terceira tentativa.
 * Exigimos o meta específico: o kind sozinho não sequestra um uso futuro.
 */
export function ownsAuthorialRetry(q: Question, meta?: AnswerMeta): boolean {
  return (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined);
}

/** Ambos os palcos também possuem a voz/fecho da própria ficha. */
export function ownsAuthorialFeedback(q: Question, meta?: AnswerMeta): boolean {
  return (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined);
}

export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): MisconceptionResult {
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;

  // F05/N1.06: a hipótese depende do histórico temporal da audição/tentativa.
  if (meta?.audiochoice) {
    return diagnosticarAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime);
  }

  if (meta?.pareamento && q.uiProps && "receptores" in q.uiProps) {
    const cena = {
      receptores: (q.uiProps as { receptores: { quantidade: number } }).receptores.quantidade,
      itens: (q.uiProps as { itens: { quantidade: number } }).itens.quantidade,
    };
    const daAcao = diagnosticarPareamento(meta.pareamento, cena);
    if (daAcao) return daAcao;
  }

  if (meta?.classificacao) {
    const daAcao = diagnosticarClassificacao(meta.classificacao as AcaoDeClassificacao);
    if (daAcao) return daAcao;
  }

  /**
   * F04/N1.13 pode provar DUAS coisas na mesma tentativa: por exemplo, parar
   * antes (`PRODUCAO_INCOMPLETA`) e, pelo histórico da missão, também provar
   * `DEPENDE_DE_ANDAIME`. O array preserva as duas sem inventar outra resposta.
   */
  if (meta?.touchplace) {
    const acao = meta.touchplace as ProducaoComHistorico;
    const imediata = diagnosticarProducao(acao);
    const todas = [imediata, ...(acao.diagnosticosLongitudinais ?? [])];
    const unidas = unirHipoteses(...todas);
    if (unidas) return unidas;
  }

  if (meta?.posicao) {
    const daAcao = diagnosticarPosicao(meta.posicao as AcaoDePosicao);
    if (daAcao) return daAcao;
  }

  if (meta?.forma) {
    const daAcao = diagnosticarForma(meta.forma as AcaoDeForma);
    if (daAcao) return daAcao;
  }

  if (meta?.grandeza) {
    const daAcao = diagnosticarGrandeza(meta.grandeza as AcaoDeGrandeza);
    if (daAcao) return daAcao;
  }

  if (meta?.moldura) {
    const daAcao = diagnosticarMoldura(meta.moldura as AcaoDaMoldura);
    if (daAcao) return daAcao;
  }

  const pickedOption = q.options?.find(option => option.value === value);
  return pickedOption?.misconception
    ? pickedOption.tag || pickedOption.misconception
    : meta?.misconception;
}

/** Palcos que coletam a resposta dentro da própria cena. */
export const PALCOS_QUE_RESPONDEM = new Set([
  "pareamento", "touchcount", "fileira", "classificacao", "audiochoice",
  "touchplace", "shapecanvas", "grandeza", "moldura",
]);

export function shouldRenderQuestionOptions(q: Question): boolean {
  return Boolean(q.options)
    && q.kind !== "vertical"
    && q.kind !== "numberline-interactive"
    && q.kind !== "drag-group"
    && q.kind !== "array"
    && !PALCOS_QUE_RESPONDEM.has(q.kind as string);
}

/** As condições da §9 que ESTA resposta satisfez. */
export function evidenciasDaResposta(meta?: AnswerMeta): string[] {
  if (!meta) return [];
  const achadas: string[] = [];
  if (meta.touchcount) achadas.push(...evidenciasDaContagem(meta.touchcount as AcaoDeContagem));
  if (meta.audiochoice) achadas.push(...evidenciasAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime));
  if (meta.touchplace) achadas.push(...evidenciasDaProducao(meta.touchplace as AcaoP));
  if (meta.forma) achadas.push(...evidenciasDaForma(meta.forma as AcaoF));
  if (meta.grandeza) achadas.push(...evidenciasDaGrandeza(meta.grandeza as AcaoDeGrandeza));
  if (meta.moldura) achadas.push(...evidenciasDaMoldura(meta.moldura as AcaoDaMoldura));
  if (meta.evidencias) achadas.push(...meta.evidencias);
  return [...new Set(achadas)];
}
