// Divergência temporal F05 fechada e validada no gate visual 31188061774.
// Este PR corrige a ficha; N1.06 permanece fora de COMPOSER_CANARIES.
import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  diagnosticarAudioChoiceRuntime,
  evidenciasAudioChoiceRuntime,
  RespostaOuvidaRuntime,
} from "./audioChoiceRuntime";

const base: RespostaOuvidaRuntime = {
  alvo: 6,
  alternativas: [1, 6, 7, 9],
  resposta: 6,
  repeticoes: 0,
  tentativa: 1,
  primeiraAudicaoConcluida: true,
};

describe("F05 — leitura runtime", () => {
  it("só a primeira RESPOSTA certa sem replay prova PRIMEIRA_AUDICAO", () => {
    expect(evidenciasAudioChoiceRuntime(base)).toEqual([Evidencia.PRIMEIRA_AUDICAO]);
    expect(evidenciasAudioChoiceRuntime({ ...base, tentativa: 2 })).toEqual([]);
    expect(evidenciasAudioChoiceRuntime({ ...base, repeticoes: 1 })).toEqual([]);
  });

  it("não apertar replay depois do autoplay NÃO significa NAO_ESCUTOU", () => {
    expect(diagnosticarAudioChoiceRuntime({
      ...base,
      resposta: 1,
      primeiraAudicaoConcluida: true,
    })).toBe(MisconceptionTag.CONFUNDE_VIZINHO);
  });

  it("NAO_ESCUTOU fica como guarda para resposta anterior à primeira audição", () => {
    expect(diagnosticarAudioChoiceRuntime({
      ...base,
      resposta: 1,
      primeiraAudicaoConcluida: false,
    })).toBe(MisconceptionTag.NAO_ESCUTOU);
  });

  it("par fonológico continua mais específico que vizinhança", () => {
    expect(diagnosticarAudioChoiceRuntime({ ...base, resposta: 7, repeticoes: 1 }))
      .toBe(MisconceptionTag.CONFUSAO_FONOLOGICA);
  });
});
