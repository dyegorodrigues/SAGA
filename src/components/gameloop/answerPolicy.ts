import { diagnosticar as diagnosticarPareamento } from "../../curriculum/procedimentos/pareamentoProcedure";
import { AcaoDeClassificacao, diagnosticar as diagnosticarClassificacao, evidenciasDe as evidenciasDaClassificacao } from "../../curriculum/procedimentos/classificacaoProcedure";
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
import { prepareAulaSourceForAnswer } from "../../curriculum/motores/aulaProgressContext";
import { recordSenseiDojoAttempt } from "../../curriculum/motores/senseiDojoProgressContext";
import { AnswerMeta, Question } from "../../types";
import { bundleMisconceptions } from "./misconceptionBundle";

type ProducaoComHistorico = AcaoDeProducao & { diagnosticosLongitudinais?: string[] };

/** §8.3-bis: o erro veio do dedo, não da cabeça? */
export function isMotorSlip(meta?: AnswerMeta): boolean {
  return meta?.manipulacao !== undefined && classificarErro(meta.manipulacao) === "motor";
}

export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  if (value === "__timeout__") return false;
  if (isMotorSlip(meta)) return true;
  return Boolean(q.options || q.groups || meta?.source);
}

function isFormaQuestion(q: Question): boolean {
  return q.kind === "shapecanvas"
    && q.uiProps != null
    && typeof q.uiProps === "object"
    && "opcoes" in q.uiProps;
}

function isPosicaoQuestion(q: Question): boolean {
  return q.kind === "shapecanvas"
    && q.uiProps != null
    && typeof q.uiProps === "object"
    && "referencial" in q.uiProps
    && !("opcoes" in q.uiProps);
}

export function ownsAuthorialRetry(q: Question, meta?: AnswerMeta): boolean {
  return (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined)
    || (isPosicaoQuestion(q) && meta?.posicao !== undefined)
    || (isFormaQuestion(q) && meta?.forma !== undefined)
    || (q.kind === "grandeza" && meta?.grandeza !== undefined)
    || (q.kind === "medidas" && meta?.source === "medidas");
}

export function ownsAuthorialFeedback(q: Question, meta?: AnswerMeta): boolean {
  return (q.kind === "audiochoice" && meta?.audiochoice !== undefined)
    || (q.kind === "touchplace" && meta?.touchplace !== undefined)
    || (isPosicaoQuestion(q) && meta?.posicao !== undefined)
    || (isFormaQuestion(q) && meta?.forma !== undefined)
    || (q.kind === "grandeza" && meta?.grandeza !== undefined)
    || (q.kind === "medidas" && meta?.source === "medidas");
}

export function authorialFeedbackHoldMs(q: Question, meta?: AnswerMeta): number {
  if (isPosicaoQuestion(q) && meta?.posicao !== undefined) return 3300;
  if (isFormaQuestion(q) && meta?.forma !== undefined) return 3700;
  if (q.kind === "grandeza" && meta?.grandeza !== undefined) return 3300;
  if (q.kind === "medidas" && meta?.source === "medidas") return 3300;
  return 1500;
}

/**
 * Boundary comum de toda tentativa não-motora.
 *
 * - Aula do Dia registra a competência-fonte para o progressEngine;
 * - Dojo aritmético registra token + número da tentativa para que recuperação
 *   após erro não conte como fluência de primeira resposta.
 */
export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
  prepareAulaSourceForAnswer(q);
  recordSenseiDojoAttempt(q);
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;

  if (meta?.audiochoice) return diagnosticarAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime);

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

  if (meta?.touchplace) {
    const acao = meta.touchplace as ProducaoComHistorico;
    const unidas = bundleMisconceptions([
      diagnosticarProducao(acao),
      ...(acao.diagnosticosLongitudinais ?? []),
    ]);
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

export const PALCOS_QUE_RESPONDEM = new Set([
  "pareamento", "touchcount", "fileira", "classificacao", "audiochoice",
  "touchplace", "shapecanvas", "grandeza", "medidas", "moldura",
]);

export function shouldRenderQuestionOptions(q: Question): boolean {
  return Boolean(q.options)
    && q.kind !== "vertical"
    && q.kind !== "numberline-interactive"
    && q.kind !== "drag-group"
    && q.kind !== "array"
    && !PALCOS_QUE_RESPONDEM.has(q.kind as string);
}

export function evidenciasDaResposta(meta?: AnswerMeta): string[] {
  if (!meta) return [];
  const achadas: string[] = [];
  if (meta.classificacao) achadas.push(...evidenciasDaClassificacao(meta.classificacao as AcaoDeClassificacao));
  if (meta.touchcount) achadas.push(...evidenciasDaContagem(meta.touchcount as AcaoDeContagem));
  if (meta.audiochoice) achadas.push(...evidenciasAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime));
  if (meta.touchplace) achadas.push(...evidenciasDaProducao(meta.touchplace as AcaoP));
  if (meta.forma) achadas.push(...evidenciasDaForma(meta.forma as AcaoF));
  if (meta.grandeza) achadas.push(...evidenciasDaGrandeza(meta.grandeza as AcaoDeGrandeza));
  if (meta.moldura) achadas.push(...evidenciasDaMoldura(meta.moldura as AcaoDaMoldura));
  if (meta.evidencias) achadas.push(...meta.evidencias);
  return [...new Set(achadas)];
}
