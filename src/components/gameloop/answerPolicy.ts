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

/**
 * §8.3-bis: o erro veio do dedo, não da cabeça?
 *
 * Só responde `true` quando houve gesto (`manipulacao`). Resposta por
 * alternativa não é manipulação e portanto nunca é escorregão.
 */
export function isMotorSlip(meta?: AnswerMeta): boolean {
  return meta?.manipulacao !== undefined && classificarErro(meta.manipulacao) === "motor";
}

export function isRetryableAnswer(q: Question, value: unknown, meta?: AnswerMeta): boolean {
  if (value === "__timeout__") return false;
  // Escorregão de dedo jamais é resposta terminal: a criança não decidiu nada.
  if (isMotorSlip(meta)) return true;
  return Boolean(q.options || q.groups || meta?.source);
}

/**
 * F05 §4: o próprio palco possui o ciclo erro → repetir som → tentar de novo.
 * O GameLoop só registra a tentativa; não acrescenta "Ops", não esconde opção
 * e não transforma a terceira tentativa em erro terminal.
 */
export function ownsAuthorialRetry(q: Question, meta?: AnswerMeta): boolean {
  return q.kind === "audiochoice" && meta?.audiochoice !== undefined;
}

/** F05 também possui voz/fecho autorais; o GameLoop não fala por cima. */
export function ownsAuthorialFeedback(q: Question, meta?: AnswerMeta): boolean {
  return q.kind === "audiochoice" && meta?.audiochoice !== undefined;
}

export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
  // Antes de qualquer hipótese diagnóstica, o filtro motor. Uma tag nascida de
  // gesto escorregado contamina o Radar e dispara Oficina injusta (§8.3-bis).
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;

  // F05/N1.06: a hipótese depende do histórico de audição/tentativa do palco.
  if (meta?.audiochoice) {
    return diagnosticarAudioChoiceRuntime(meta.audiochoice as RespostaOuvidaRuntime);
  }

  // Ficha de PRODUÇÃO (N1.01/F07): não há alternativa que carregue a hipótese —
  // o erro está no que a criança FEZ com as peças. Sem esta leitura, distribuir
  // dois no mesmo lugar e deixar alguém sem chegariam ao Radar como o mesmo
  // silêncio, e são erros que pedem aulas diferentes.
  if (meta?.pareamento && q.uiProps && "receptores" in q.uiProps) {
    const cena = {
      receptores: (q.uiProps as { receptores: { quantidade: number } }).receptores.quantidade,
      itens: (q.uiProps as { itens: { quantidade: number } }).itens.quantidade,
    };
    const daAcao = diagnosticarPareamento(meta.pareamento, cena);
    if (daAcao) return daAcao;
  }

  // Ficha F51 (AL.01): não há alternativa que carregue a hipótese — o erro está
  // no que a criança TENTOU fazer com as peças. E as tentativas são a única
  // fonte: o erro é empurrado de volta (§4), então o estado final está sempre
  // certo e `TUDO_CABE` — o alvo da ficha — nunca apareceria no repouso.
  if (meta?.classificacao) {
    const daAcao = diagnosticarClassificacao(meta.classificacao as AcaoDeClassificacao);
    if (daAcao) return daAcao;
  }

  // Ficha F04 (N1.13): mesma família. O que ela produziu é a resposta, e o que
  // ela TENTOU produzir é o diagnóstico — nos níveis com vaga o excedente é
  // empurrado de volta (§4), então o estado final está sempre certo e
  // `NAO_MONITORA_ALVO` nunca apareceria no repouso.
  if (meta?.touchplace) {
    const daAcao = diagnosticarProducao(meta.touchplace as AcaoDeProducao);
    if (daAcao) return daAcao;
  }

  // Ficha F47 (GE.01): a hipótese depende de ONDE estava o que ela tocou, e de
  // ter tocado o próprio referencial — nada disso cabe num valor de alternativa.
  if (meta?.posicao) {
    const daAcao = diagnosticarPosicao(meta.posicao as AcaoDePosicao);
    if (daAcao) return daAcao;
  }

  // Ficha F48 (GE.02): a hipótese depende de a certa estar GIRADA e a escolhida
  // estar em pé — a assinatura do alvo da ficha. Nenhum valor de alternativa
  // carrega isso.
  if (meta?.forma) {
    const daAcao = diagnosticarForma(meta.forma as AcaoDeForma);
    if (daAcao) return daAcao;
  }

  // Ficha F49 (GM.01): a hipótese depende de ela ter decidido ANTES de a linha
  // do chão existir, e de qual objeto vence no outro atributo. Nenhum valor de
  // alternativa carrega isso.
  if (meta?.grandeza) {
    const daAcao = diagnosticarGrandeza(meta.grandeza as AcaoDeGrandeza);
    if (daAcao) return daAcao;
  }

  // Fichas F02, JD3 e JD5: a hipótese depende do que a CENA mostrava — quantas
  // casas estavam cheias, se o vazio estava disperso, quantas a tampa cobriu.
  // "Responder o cheio" e "responder o visível" são o mesmo gesto com
  // significados opostos, e só o spec os separa.
  if (meta?.moldura) {
    const daAcao = diagnosticarMoldura(meta.moldura as AcaoDaMoldura);
    if (daAcao) return daAcao;
  }

  const pickedOption = q.options?.find(option => option.value === value);
  return pickedOption?.misconception
    ? pickedOption.tag || pickedOption.misconception
    : meta?.misconception;
}

/**
 * Palcos que **coletam a resposta** — e por isso dispensam a barra genérica.
 *
 * Não confundir com `PALCOS_JA_DESENHADOS`: aquele conjunto diz quem desenha a
 * própria CENA. Um palco pode desenhar a cena e ainda depender da barra para a
 * resposta (`area`, `tabuada`, `deslocamento`: a criança olha o material e
 * escolhe o número). Estes aqui têm a resposta DENTRO da cena.
 *
 * ### O defeito que isto corrige
 *
 * `pareamento` e `touchcount` desenhavam a resposta duas vezes: o teclado do
 * palco e, embaixo, a barra do app com as mesmas alternativas. Pior que feio —
 * a barra deixava responder **sem contar** e **sem distribuir**, que é a única
 * coisa que estas duas fichas medem.
 *
 * Nenhum teste viu, e a sonda também não: as cenas renderizavam o palco solto e
 * nunca passavam pelo renderizador do app. Foi um print no enquadramento real
 * que mostrou. É o §6.32 de novo, e desta vez em duas competências.
 */
export const PALCOS_QUE_RESPONDEM = new Set(["pareamento", "touchcount", "fileira", "classificacao", "audiochoice", "touchplace", "shapecanvas", "grandeza", "moldura"]);

export function shouldRenderQuestionOptions(q: Question): boolean {
  return Boolean(q.options)
    && q.kind !== "vertical"
    && q.kind !== "numberline-interactive"
    && q.kind !== "drag-group"
    && q.kind !== "array"
    && !PALCOS_QUE_RESPONDEM.has(q.kind as string);
}

/**
 * As condições da §9 que ESTA resposta satisfez (P13).
 *
 * Espelha `misconceptionForAnswer`, e pela mesma razão: quem sabe se a criança
 * acertou **na primeira audição** ou **sem vaga fantasma** é o palco, não o
 * valor da resposta. A diferença é o sinal — o diagnóstico lê o erro, a
 * evidência lê o acerto.
 *
 * Sem esta função, a `FichaDominio.exige` seria uma declaração que nada
 * verifica: a criança receberia a coroa sem nunca ter feito a questão que a §9
 * diz que prova a competência.
 */
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
