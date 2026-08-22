// @vitest-environment jsdom
import React, { useState } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DragGroup } from "./DragGroup";
import { ParesImparesStage } from "./ParesImparesStage";
import { construirParesImparesF38Spec } from "../../curriculum/procedimentos/paresImparesContract";

describe("W30 — DragGroup#duplas em runtime real", () => {
  beforeEach(() => window.localStorage.clear());

  it("notificar progresso não entra em ciclo quando o pai recria o callback", () => {
    let renders = 0;
    function Harness() {
      const [, setProgress] = useState({ left: 8, pairs: 0 });
      renders += 1;
      if (renders > 6) throw new Error("onProgress entrou em ciclo de renderização");
      return (
        <DragGroup
          sourceCount={8}
          destCount={4}
          boxCapacity={2}
          onProgress={({ itemsLeft, boxes }) => setProgress({ left: itemsLeft, pairs: boxes.filter(v => v === 2).length })}
        />
      );
    }

    render(<Harness />);
    expect(renders).toBeLessThanOrEqual(3);
  });

  it("o palco F38 alfabetiza no idioma de duplas, sem herdar a metáfora de alimentação", () => {
    render(<ParesImparesStage spec={construirParesImparesF38Spec(1)} onAnswer={() => {}} />);
    expect(screen.getByText("Junte dois objetos em cada caixa para formar uma dupla.")).toBeTruthy();
    expect(screen.queryByText("Dê uma comidinha para cada bichinho!")).toBeNull();
  });
});
