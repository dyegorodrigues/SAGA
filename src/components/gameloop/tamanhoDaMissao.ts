import type { Track } from "../../types";

/**
 * O tamanho da missão da Jornada, num lugar só.
 *
 * Estes dois números não são preferência de UI: eles decidem o que a coroa
 * consegue observar. O motor zera a janela de compreensão na virada do dia e
 * conta cada tentativa do nível cinco dentro dela — então uma regra de domínio
 * que peça uma janela maior que a missão **não fecha** para quem joga uma
 * missão por dia. A coroa passa a depender de uma cadência que ficha nenhuma
 * declara.
 *
 * Ficavam dentro do `GameLoop.tsx`, e quem precisava conferir a invariante
 * tinha de ler o componente inteiro — ou, pior, o texto do arquivo. Aqui eles
 * são importáveis por quem audita sem arrastar a árvore de componentes junto.
 */

/** Questões de uma missão da Jornada. */
export const TOTAL_Q = 8;

/** A missão de uma trilha, respeitando o override do Dojo/Jardim/Oficina. */
export const totalQFor = (track: Track) => (track as { totalQ?: number }).totalQ || TOTAL_Q;

/** Aquecimento (Parte E): as 2 primeiras questões vêm um nível abaixo — vitória fácil de entrada. */
export const WARMUP_QUESTIONS = 2;

export const warmupLvl = (lvl: number) => Math.max(1, lvl - 1);
