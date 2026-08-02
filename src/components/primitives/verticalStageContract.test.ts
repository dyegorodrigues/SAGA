import { describe, expect, it } from "vitest";
import { verticalStageProps } from "./verticalStageContract";

describe("contrato do palco vertical", () => {
  it("aceita a questão legada sem uiProps", () => {
    expect(verticalStageProps({
      kind: "vertical",
      prompt: "Resolva.",
      answer: 62,
      vTop: 27,
      vBot: 35,
      vOp: "+",
    })).toEqual({
      vTop: 27,
      vBot: 35,
      showPlaceValue: false,
      showRegroup: false,
      showAlgorithm: true,
    });
  });

  it("preserva a divulgação progressiva da ficha autoral", () => {
    expect(verticalStageProps({
      kind: "vertical",
      prompt: "Resolva.",
      answer: 62,
      vTop: 27,
      vBot: 35,
      vOp: "+",
      uiProps: { vTop: 27, vBot: 35, showPlaceValue: true, showRegroup: true, showAlgorithm: false },
    })).toMatchObject({ showPlaceValue: true, showRegroup: true, showAlgorithm: false });
  });
});
