// @vitest-environment jsdom
import React from "react";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ClassificacaoStage } from "./ClassificacaoStage";
import { Composer } from "../../curriculum/Composer";
import { AL_01 } from "../../curriculum/fichas/jornada/AL.01";
import { ClassificacaoSpec } from "../../curriculum/procedimentos/classificacaoContract";

const spec = (nivel: number) => Composer.generate(AL_01, nivel).uiProps as ClassificacaoSpec;

describe("ClassificacaoStage — semântica HTML dos alvos", () => {
  it("peças já resolvidas nunca viram botão dentro de outro botão", () => {
    for (let nivel = 1; nivel <= 4; nivel += 1) {
      const s = spec(nivel);
      const { container, unmount } = render(
        <ClassificacaoStage
          spec={s}
          resolvidas={s.pecas.length}
          // O nível 3 agora é duas telas reais. Para medir peças JÁ resolvidas,
          // a sonda/teste precisa dizer de qual metade está falando; sem isso a
          // primeira metade conclui legitimamente e inicia a reclassificação.
          faseReclassificacao={nivel === 3 ? "segunda" : undefined}
        />,
      );

      expect(container.querySelector("button button"), `nível ${nivel}`).toBeNull();
      expect(container.querySelectorAll('[role="img"][aria-label]').length, `nível ${nivel}`)
        .toBeGreaterThan(0);
      unmount();
    }
  });
});
