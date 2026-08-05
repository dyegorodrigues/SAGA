import { describe, expect, it } from "vitest";
import {
  construirTabuadaSpec,
  enunciadoNaoRevela,
  respostaUnica,
} from "./tabuadaContract";
import {
  OUTRO_FATOR_MAX,
  PADRAO_DA_TABUADA,
  TABUADAS_COM_PADRAO,
  ehPergunavelComDiagnostico,
} from "./tabuadaProcedure";

const TODAS = TABUADAS_COM_PADRAO.flatMap(tabuada =>
  Array.from({ length: OUTRO_FATOR_MAX }, (_, i) => ({ tabuada, vezes: i + 1 })))
  .filter(ehPergunavelComDiagnostico);

const spec = (m: { tabuada: 10 | 5 | 2; vezes: number }, nivel: number) =>
  construirTabuadaSpec(m, nivel, PADRAO_DA_TABUADA[m.tabuada]);

describe("o apoio visual obedece ao nível", () => {
  it("nível 1 traz arranjo e saltos, sem o quadro", () => {
    const s = spec({ tabuada: 10, vezes: 4 }, 1);
    expect(s.arranjo).not.toBeNull();
    expect(s.saltos).not.toBeNull();
    expect(s.quadro, "o padrão ainda não é o assunto no nível 1").toBeNull();
  });

  it("níveis 2 e 3 trocam os saltos pelo quadro", () => {
    for (const nivel of [2, 3]) {
      const s = spec({ tabuada: 5, vezes: 4 }, nivel);
      expect(s.arranjo).not.toBeNull();
      expect(s.saltos, "a estratégia deu lugar ao padrão").toBeNull();
      expect(s.quadro).not.toBeNull();
    }
  });

  it("níveis 4 e 5 são só símbolo", () => {
    for (const nivel of [4, 5]) {
      const s = spec({ tabuada: 10, vezes: 6 }, nivel);
      expect(s.arranjo).toBeNull();
      expect(s.saltos).toBeNull();
      expect(s.quadro).toBeNull();
    }
  });
});

describe("o quadro mostra o padrão sem dedurar a resposta", () => {
  it("pinta TODOS os múltiplos, não apenas o procurado", () => {
    // Vinte múltiplos de 5 pintados não dizem qual deles é 5×4. Pintar só um
    // diria — por isso o contrato não tem campo para isso.
    const s = spec({ tabuada: 5, vezes: 4 }, 2);
    expect(s.quadro?.multiplosPintados).toHaveLength(20);
    expect(s.quadro?.multiplosPintados).toContain(s.resposta);
  });

  it("não existe campo que aponte um múltiplo específico", () => {
    const s = spec({ tabuada: 5, vezes: 4 }, 2);
    const campos = Object.keys(s.quadro ?? {});
    expect(campos.sort()).toEqual(["multiplosPintados", "padrao", "tabuada"]);
  });

  it("o padrão vem declarado para a recapitulação", () => {
    expect(spec({ tabuada: 2, vezes: 6 }, 3).quadro?.padrao).toBe("são todos os números pares");
  });
});

describe("o arranjo descreve a forma para quem não lê", () => {
  it("linhas e colunas correspondem à multiplicação", () => {
    const s = spec({ tabuada: 5, vezes: 4 }, 1);
    expect(s.arranjo).toEqual({ linhas: 4, colunas: 5, descricao: "4 fileiras de 5" });
  });

  it("o número de quadradinhos é a resposta — contar é estratégia legítima no nível 1", () => {
    const s = spec({ tabuada: 10, vezes: 3 }, 1);
    expect((s.arranjo!.linhas) * (s.arranjo!.colunas)).toBe(s.resposta);
  });
});

describe("invariantes em toda a ficha", () => {
  it("a resposta aparece exatamente uma vez, em todos os níveis", () => {
    for (const m of TODAS) {
      for (const nivel of [1, 2, 3, 4, 5]) {
        expect(respostaUnica(spec(m, nivel)), `${m.tabuada}×${m.vezes} nível ${nivel}`).toBe(true);
      }
    }
  });

  it("o enunciado nunca traz a resposta escrita", () => {
    for (const m of TODAS) {
      for (const nivel of [1, 2, 3, 4, 5]) {
        expect(enunciadoNaoRevela(spec(m, nivel)), `${m.tabuada}×${m.vezes} nível ${nivel}`).toBe(true);
      }
    }
  });

  it("toda alternativa é positiva e há pelo menos três", () => {
    for (const m of TODAS) {
      const s = spec(m, 4);
      expect(s.alternativas.length).toBeGreaterThanOrEqual(3);
      for (const a of s.alternativas) expect(a.valor).toBeGreaterThan(0);
    }
  });

  it("só a alternativa correta tem tag vazia", () => {
    for (const m of TODAS) {
      const s = spec(m, 4);
      const semTag = s.alternativas.filter(a => a.tag === "");
      expect(semTag, `${m.tabuada}×${m.vezes}`).toHaveLength(1);
      expect(semTag[0].valor).toBe(s.resposta);
    }
  });

  it("a fala do enunciado nunca usa símbolo — a criança OUVE a questão", () => {
    for (const m of TODAS) {
      expect(spec(m, 1).falado).not.toContain("×");
      expect(spec(m, 1).falado).toMatch(/^\d+ vezes \d+$/);
    }
  });
});
