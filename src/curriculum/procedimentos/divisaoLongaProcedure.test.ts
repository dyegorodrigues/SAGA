import { describe, expect, it } from "vitest";
import { Evidencia } from "../../constants/evidencias";
import { evidenciasDivisaoLonga, formatarQuocienteResto, restoEhValido } from "./divisaoLongaProcedure";

describe("F69 — procedimento da divisão longa", () => {
  it("aceita somente quociente e resto que recompõem o dividendo", () => {
    expect(restoEhValido(29, 4, 7, 1)).toBe(true);
    expect(restoEhValido(29, 4, 6, 5)).toBe(false);
    expect(restoEhValido(24, 4, 6, 0)).toBe(true);
  });
  it("preserva o zero posicional e só emite evidência no acerto L5", () => {
    expect(formatarQuocienteResto(102, 0)).toBe("102");
    expect(evidenciasDivisaoLonga({ nivel: 5, resposta: "102", respostaCorreta: "102" })).toEqual([Evidencia.DIVISAO_ZERO_QUOCIENTE]);
    expect(evidenciasDivisaoLonga({ nivel: 5, resposta: "12", respostaCorreta: "102" })).toEqual([]);
    expect(evidenciasDivisaoLonga({ nivel: 4, resposta: "52", respostaCorreta: "52" })).toEqual([]);
  });
});
