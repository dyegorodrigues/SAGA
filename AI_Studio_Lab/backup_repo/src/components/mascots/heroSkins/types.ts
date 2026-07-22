import React from "react";

export interface LimbConfig {
  armFill: string;
  handFill: string;
  legFill: string;
  bootFill: string;
  hasClaws?: boolean;
  hasSpikes?: boolean;
  customLeftArm?: React.ReactNode;
  customRightArm?: React.ReactNode;
  customLeftLeg?: React.ReactNode;
  customRightLeg?: React.ReactNode;
}

/** Contexto compartilhado que o HeroSkin monta uma vez e cada skin de personagem recebe. */
export interface SkinCtx {
  theme: string;
  stage: number;
  color: string;
  bx: number;
  by: number;
  bw: number;
  bh: number;
  br: number;
  animation: string;
  isHappy: boolean;
  armY: number;
  legY: number;
  isBaby: boolean;
  isTeen: boolean;
  isHero: boolean;
  isLegend: boolean;
  renderLimbs: (configs: LimbConfig) => React.ReactNode;
  drawPixelArt: (grid: string[], x0: number, y0: number, pixelSize: number, colorMap: Record<string, string>) => React.ReactNode;
}
