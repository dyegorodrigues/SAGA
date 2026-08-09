import { beforeEach, describe, expect, it } from "vitest";
import type { Question, TelemetryLog } from "../types";
import { prepareAulaSourceForAnswer } from "../curriculum/motores/aulaProgressContext";
import {
  clearTelemetryAulaSource,
  normalizeTelemetryIdentity,
} from "./telemetryIdentityContext";

const log = (trackId: string): TelemetryLog => ({
  kidId: "kid",
  timestamp: 1,
  trackId,
  qIndex: 0,
  qPrompt: "teste",
  expectedAnswer: "1",
  givenAnswer: "1",
  reactionTimeMs: 500,
  isCorrect: true,
});

const plain: Question = {
  kind: "plain",
  prompt: "teste",
  answer: 1,
  options: [{ label: "1", value: 1 }],
};

beforeEach(() => clearTelemetryAulaSource());

describe("telemetria — identidade da Aula composta", () => {
  it("troca o envelope aula pela competência-fonte observada na questão", () => {
    prepareAulaSourceForAnswer({ ...plain, sourceTrackId: "GM.02" } as Question);
    expect(normalizeTelemetryIdentity(log("aula")).trackId).toBe("GM.02");
  });

  it("não altera eventos de trilhas comuns", () => {
    prepareAulaSourceForAnswer(plain);
    expect(normalizeTelemetryIdentity(log("N1.07")).trackId).toBe("N1.07");
  });

  it("questão comum limpa source antigo para uma Aula futura não herdar identidade fantasma", () => {
    prepareAulaSourceForAnswer({ ...plain, sourceTrackId: "N1.07" } as Question);
    expect(normalizeTelemetryIdentity(log("aula")).trackId).toBe("N1.07");

    prepareAulaSourceForAnswer(plain);
    expect(normalizeTelemetryIdentity(log("aula")).trackId).toBe("aula");
  });
});
