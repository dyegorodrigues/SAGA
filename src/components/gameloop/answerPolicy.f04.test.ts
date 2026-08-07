import { describe, expect, it } from "vitest";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Question } from "../../types";
import {
  misconceptionForAnswer,
  ownsAuthorialFeedback,
  ownsAuthorialRetry,
} from "./answerPolicy";

const q: Question = { kind: "touchplace", prompt: "Coloque 3", answer: 3, uiProps: {} };

describe("F04 na fronteira com o GameLoop integrado", () => {
  it("o palco mantém autoria de feedback/retry", () => {
    const meta = { touchplace: { colocados: 2, alvo: 3, bandeja: 5, recusas: 0, comAndaime: false } };
    expect(ownsAuthorialRetry(q, meta)).toBe(true);
    expect(ownsAuthorialFeedback(q, meta)).toBe(true);
  });

  it("kind sem leitura TouchPlace não sequestra feedback", () => {
    expect(ownsAuthorialRetry(q)).toBe(false);
    expect(ownsAuthorialFeedback(q)).toBe(false);
  });

  it("preserva hipótese imediata e longitudinal na mesma tentativa", () => {
    const leitura = {
      colocados: 2,
      alvo: 3,
      bandeja: 12,
      recusas: 0,
      comAndaime: false,
      diagnosticosLongitudinais: [MisconceptionTag.DEPENDE_DE_ANDAIME],
    };
    expect(misconceptionForAnswer(q, 2, { touchplace: leitura })).toEqual([
      MisconceptionTag.PRODUCAO_INCOMPLETA,
      MisconceptionTag.DEPENDE_DE_ANDAIME,
    ]);
  });
});
