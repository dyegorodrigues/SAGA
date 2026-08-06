import { diagnosticar as diagnosticarPareamento } from "../../curriculum/procedimentos/pareamentoProcedure";
import { AcaoDeClassificacao, diagnosticar as diagnosticarClassificacao } from "../../curriculum/procedimentos/classificacaoProcedure";
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

export function misconceptionForAnswer(q: Question, value: unknown, meta?: AnswerMeta): string | undefined {
  // Antes de qualquer hipótese diagnóstica, o filtro motor. Uma tag nascida de
  // gesto escorregado contamina o Radar e dispara Oficina injusta (§8.3-bis).
  if (!podeGerarDiagnostico(meta?.manipulacao)) return undefined;

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
export const PALCOS_QUE_RESPONDEM = new Set(["pareamento", "touchcount", "fileira", "classificacao", "audiochoice"]);

export function shouldRenderQuestionOptions(q: Question): boolean {
  return Boolean(q.options)
    && q.kind !== "vertical"
    && q.kind !== "numberline-interactive"
    && q.kind !== "drag-group"
    && q.kind !== "array"
    && !PALCOS_QUE_RESPONDEM.has(q.kind as string);
}
