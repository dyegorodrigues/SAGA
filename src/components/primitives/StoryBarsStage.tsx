import React from "react";
import { StoryBarsSpec } from "../../curriculum/procedimentos/storyBarsContract";
import { StoryPanelStage } from "./StoryPanelStage";
import { SingaporeBarsStage } from "./SingaporeBarsStage";
import { UIState } from "../../styles/tokens";

interface Props {
  spec: StoryBarsSpec;
  state?: UIState;
  step?: 1 | 2 | 3;
  onReplay?: () => void;
}

/**
 * Composição de N3.10: a história em cima, a relação embaixo, uma pergunta só.
 *
 * As duas primitivas continuam ignorando uma à outra — a narrativa não desenha
 * barra e a barra não conhece personagem. Este palco apenas as coloca na mesma
 * tela, na ordem em que a criança precisa: primeiro o que aconteceu no mundo,
 * depois como isso se organiza em quantidades.
 *
 * Não há duas atividades empilhadas: a barra é leitura e a resposta vem das
 * alternativas, preservando uma única ação dominante.
 */
export function StoryBarsStage({ spec, state = "ocioso", step = 3, onReplay }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <StoryPanelStage story={spec.story} step={step} onReplay={onReplay} />

      {/* A representação só entra depois que a história terminou de se contar. */}
      {step >= 3 && <SingaporeBarsStage bars={spec.bars} state={state} />}
    </div>
  );
}
