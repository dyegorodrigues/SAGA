// Gate visual final da F05: run 31188061774, 8 sementes em Chromium real.
import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import { Question } from "../../types";
import {
  evidenciasDaResposta,
  misconceptionForAnswer,
  ownsAuthorialFeedback,
  ownsAuthorialRetry,
} from "./answerPolicy";

const q: Question = {
  kind: "audiochoice",
  prompt: "Aperte e escute. Que número você ouviu?",
  answer: 6,
  uiProps: {},
};

const leitura = {
  alvo: 6,
  alternativas: [1, 6, 7, 9],
  resposta: 7,
  repeticoes: 1,
  tentativa: 1,
  primeiraAudicaoConcluida: true,
};

describe("F05 na fronteira com o GameLoop", () => {
  it("o palco possui o ciclo de erro e o feedback — o GameLoop não fala por cima", () => {
    const meta = { audiochoice: leitura };
    expect(ownsAuthorialRetry(q, meta)).toBe(true);
    expect(ownsAuthorialFeedback(q, meta)).toBe(true);
  });

  it("não sequestra o feedback de outras primitivas", () => {
    const outra: Question = { kind: "plain", prompt: "?", answer: 6 };
    const meta = { audiochoice: leitura };
    expect(ownsAuthorialRetry(outra, meta)).toBe(false);
    expect(ownsAuthorialFeedback(outra, meta)).toBe(false);
  });

  it("a leitura de áudio chega ao Radar com a tag fonológica específica", () => {
    expect(misconceptionForAnswer(q, 7, { audiochoice: leitura }))
      .toBe(MisconceptionTag.CONFUSAO_FONOLOGICA);
  });

  it("primeira audição exige também primeira resposta certa", () => {
    const certa = { ...leitura, resposta: 6, repeticoes: 0 };
    expect(evidenciasDaResposta({ audiochoice: certa }, q)).toContain(Evidencia.PRIMEIRA_AUDICAO);
    expect(evidenciasDaResposta({ audiochoice: { ...certa, tentativa: 2 } }, q))
      .not.toContain(Evidencia.PRIMEIRA_AUDICAO);
  });

  it("não transforma ausência de replay após autoplay em NAO_ESCUTOU", () => {
    const semReplay = { ...leitura, resposta: 1, repeticoes: 0, primeiraAudicaoConcluida: true };
    expect(misconceptionForAnswer(q, 1, { audiochoice: semReplay }))
      .not.toBe(MisconceptionTag.NAO_ESCUTOU);
  });
});
