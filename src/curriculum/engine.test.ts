import { describe, it, expect } from "vitest";
import { CurriculumValidator } from "./schema";
import { N1_01 } from "./fichas/N1.01";

describe("Motor de Fichas (Substituição dos Geradores Manuais)", () => {
  it("Valida a ficha fundacional N1.01 (Parear 1-a-1)", () => {
    const errors = CurriculumValidator.validate(N1_01);
    expect(errors).toHaveLength(0);
  });

  it("Reprova ficha sem Kinds definidos (Muda/Inerte)", () => {
    const fichaMuda = {
      ...N1_01,
      id: "N1.00",
      micros: [
        {
          id: "a",
          alvo: "Ficha quebrada",
          kinds: [], // Falha! Sem Kinds a interface morre (Falso verde dos antigos geradores)
          params: {}
        }
      ]
    };
    
    // @ts-ignore
    const errors = CurriculumValidator.validate(fichaMuda);
    expect(errors).toContain("Micro [a] sem kinds (mecânica ausente = falsa interação)");
  });

  it("Reprova ficha sem escada/micros (Repetição Burra)", () => {
    const fichaBurra = {
      ...N1_01,
      id: "N1.00",
      micros: []
    };
    
    const errors = CurriculumValidator.validate(fichaBurra);
    expect(errors).toContain("Deve ter pelo menos uma microcompetência");
  });
});

import { AL_05 } from "./fichas/AL.05";

describe("Verificacao de Competencias de Algebra", () => {
  it("Valida a ficha AL.05 (Balanca/Igualdade)", () => {
    const errors = CurriculumValidator.validate(AL_05);
    expect(errors).toHaveLength(0);
  });
});

import { GM_04 } from "./fichas/GM.04";

describe("Verificacao de Competencias de Geometria/Medidas", () => {
  it("Valida a ficha GM.04 (Relogio/Horas)", () => {
    const errors = CurriculumValidator.validate(GM_04);
    expect(errors).toHaveLength(0);
  });
});

import { N1_02 } from "./fichas/N1.02";
import { N1_03 } from "./fichas/N1.03";
import { N1_04 } from "./fichas/N1.04";
import { N1_07 } from "./fichas/N1.07";

describe("Verificacao das Competencias Iniciais de Numeros (F0/F1)", () => {
  it("Valida a ficha N1.02 (Canto Numerico)", () => {
    const errors = CurriculumValidator.validate(N1_02);
    expect(errors).toHaveLength(0);
  });
  
  it("Valida a ficha N1.03 (Subitizacao)", () => {
    const errors = CurriculumValidator.validate(N1_03);
    expect(errors).toHaveLength(0);
  });
  
  it("Valida a ficha N1.04 (Contagem Tocando)", () => {
    const errors = CurriculumValidator.validate(N1_04);
    expect(errors).toHaveLength(0);
  });
  
  it("Valida a ficha N1.07 (Reta e Saltos)", () => {
    const errors = CurriculumValidator.validate(N1_07);
    expect(errors).toHaveLength(0);
  });
});

import { N1_10 } from "./fichas/N1.10";
import { N2_01 } from "./fichas/N2.01";

describe("Verificacao de Competencias de F1 (Parte-Todo e Sistema Decimal)", () => {
  it("Valida a ficha N1.10 (Number Bonds)", () => {
    const errors = CurriculumValidator.validate(N1_10);
    expect(errors).toHaveLength(0);
  });
  
  it("Valida a ficha N2.01 (Material Dourado)", () => {
    const errors = CurriculumValidator.validate(N2_01);
    expect(errors).toHaveLength(0);
  });
});
