/**
 * Contratos neutros dos passos pedagógicos.
 *
 * Este módulo não conhece React, DOM, GameLoop nem currículo. Ele é a fronteira
 * compartilhada entre dados autorais, procedimentos puros e futuros palcos.
 */

export type TutorialSync = "junto" | "depois";
export type TutorialShow = string | number | Record<string, unknown>;

export interface TutStep<TShow = TutorialShow> {
  say: string;
  ms?: number;
  show?: TShow;
  sync?: TutorialSync;
}

/**
 * Um passo de resolução descreve o estado visual COMPLETO depois do passo.
 * `show` é snapshot declarativo/idempotente — nunca um delta que dependa de
 * reproduzir passos anteriores.
 *
 * `corrige` é índice semântico para ponto de entrada por misconception.
 * `parcial` descreve o estado/resultado matemático alcançado e não substitui
 * `corrige`: erros diferentes podem produzir o mesmo parcial.
 */
export interface PassoDeResolucao<
  TShow = unknown,
  TParcial = unknown,
  TMisconception extends string = string,
> {
  id: string;
  say: string;
  show: TShow;
  corrige?: readonly TMisconception[];
  parcial?: TParcial;
}

/**
 * Resolução calculada do item atual. O estado inicial permite entrar em qualquer
 * passo sem "rebobinar" a animação. `fallback` é índice explícito para uma
 * misconception gerável que ainda não possua passo corretivo próprio.
 */
export interface ResolucaoDeclarativa<
  TShow = unknown,
  TParcial = unknown,
  TMisconception extends string = string,
> {
  estadoInicial: TShow;
  passos: readonly PassoDeResolucao<TShow, TParcial, TMisconception>[];
  fallback?: number;
}
