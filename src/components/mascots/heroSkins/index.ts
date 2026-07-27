import type React from "react";
import type { SkinCtx, LimbConfig } from "./types";
import { skinHomemAranha, skinBatman, skinPanteraNegra } from "./marvel1";
import { skinHulk, skinBruxo, skinFutebol, skinHomemFerro } from "./squad1";
import { skinCapitaoAmerica, skinElsa, skinPikachu, skinThor, skinClassico } from "./squad2";
import { skinGoku, skinHeroi, skinMusica } from "./squad3";
import { skinHomemFerroHd, skinHomemAranhaHd, skinCapitaoAmericaHd } from "./hd1";
import { skinThorHd, skinDino } from "./hd2";
import { skinHomemAranhaPixel } from "./pixelSpider";
import { skinHomemFerroPixel } from "./pixelIron";
import { skinHulkPixel } from "./pixelHulk";
import { skinDragaoFogo } from "./dragon";

export type { SkinCtx, LimbConfig } from "./types";

/** despacho por tema (Constituição regra 4: cada arquivo de personagem fica pequeno). */
export const SKIN_RENDERERS: Record<string, (ctx: SkinCtx) => React.ReactNode> = {
  homem_aranha: skinHomemAranha,
  batman: skinBatman,
  hulk: skinHulk,
  bruxo: skinBruxo,
  futebol: skinFutebol,
  homem_ferro: skinHomemFerro,
  capitao_america: skinCapitaoAmerica,
  elsa: skinElsa,
  pikachu: skinPikachu,
  pantera_negra: skinPanteraNegra,
  thor: skinThor,
  goku: skinGoku,
  homem_aranha_pixel: skinHomemAranhaPixel,
  homem_ferro_pixel: skinHomemFerroPixel,
  hulk_pixel: skinHulkPixel,
  dino: skinDino,
  heroi: skinHeroi,
  musica: skinMusica,
  classico: skinClassico,
  homem_ferro_hd: skinHomemFerroHd,
  homem_aranha_hd: skinHomemAranhaHd,
  capitao_america_hd: skinCapitaoAmericaHd,
  dragao_fogo: skinDragaoFogo,
  thor_hd: skinThorHd,
};
