import { describe, expect, it } from "vitest";
import {
  construirDecomposicaoSpec,
  enunciadoNaoRevela,
  recapitulacaoFechaAConta,
} from "./decomposicaoContract";
import {
  OUTRO_FATOR_MAX,
  OUTRO_FATOR_MIN,
  ehPergunavelComDiagnostico,
  tabuadasDoNivel,
} from "./decomposicaoProcedure";

const spec = construirDecomposicaoSpec;

const TODAS_DECOMPONIVEIS = [3, 4].flatMap(tabuada =>
  Array.from({ length: OUTRO_FATOR_MAX - OUTRO_FATOR_MIN + 1 },
    (_, i) => ({ tabuada: tabuada as 3 | 4, vezes: i + OUTRO_FATOR_MIN })))
  .filter(ehPergunavelComDiagnostico);

describe("a decomposição escrita dá a âncora, nunca o resultado", () => {
  it("mostra o passo conhecido inteiro e o seguinte em aberto", () => {
    const s = spec(4, 7, 2);
    expect(s.escrita?.ancora).toBe("7 × 2 = 14");
    expect(s.escrita?.emAberto).toBe("14 × 2 = ?");
    expect(s.escrita?.estrategia).toBe("dobrar o dobro");
  });

  it("o passo em aberto NÃO carrega o número da resposta", () => {
    // Escrever `14 × 2 = 28` no nível 2 seria dar o gabarito com cara de apoio.
    const s = spec(4, 7, 2);
    expect(s.escrita?.emAberto).not.toContain("28");
    expect(s.resposta).toBe(28);
  });

  it("vale para ×3, onde a estratégia é outra", () => {
    const s = spec(3, 7, 2);
    // O nível 2 é de ×4 na ficha; aqui o que se verifica é a construção em si.
    expect(s.escrita?.ancora).toBe("7 × 2 = 14");
    expect(s.escrita?.emAberto).toBe("14 + 7 = ?");
    expect(s.escrita?.emAberto).not.toContain("21");
  });

  it("a recapitulação, que vem depois de responder, fecha a conta", () => {
    const s = spec(4, 7, 2);
    expect(s.recapitulacao).toEqual(["7 × 2 = 14", "14 × 2 = 28"]);
    expect(recapitulacaoFechaAConta(s)).toBe(true);
  });
});

describe("a âncora visual mostra o dobro, não o total", () => {
  it("o arranjo é o do ×2, e contá-lo dá o dobro", () => {
    const s = spec(4, 7, 1);
    expect(s.ancoraVisual).toEqual({
      linhas: 7, colunas: 2, valor: 14, descricao: "7 fileiras de 2",
    });
    expect(s.ancoraVisual!.linhas * s.ancoraVisual!.colunas).toBe(14);
    expect(s.resposta).toBe(28);
  });

  it("o rótulo do arranjo não contém a resposta, em toda a ficha", () => {
    for (const d of TODAS_DECOMPONIVEIS) {
      const s = spec(d.tabuada, d.vezes, 1);
      expect(s.ancoraVisual!.descricao, `${d.tabuada}×${d.vezes}`)
        .not.toContain(String(s.resposta));
    }
  });
});

describe("os apoios obedecem ao nível", () => {
  it("nível 1 e 3 trazem o arranjo; nível 2 traz a escrita; 4 e 5 nada", () => {
    expect(spec(4, 7, 1).ancoraVisual).not.toBeNull();
    expect(spec(4, 7, 1).escrita).toBeNull();

    expect(spec(4, 7, 2).ancoraVisual).toBeNull();
    expect(spec(4, 7, 2).escrita).not.toBeNull();

    expect(spec(3, 7, 3).ancoraVisual).not.toBeNull();

    for (const nivel of [4, 5]) {
      expect(spec(3, 7, nivel).ancoraVisual).toBeNull();
      expect(spec(3, 7, nivel).escrita).toBeNull();
    }
  });

  it("tabuada que não se decompõe entra sem andaime, mesmo em nível baixo", () => {
    // ×5 só aparece no nível 5, mas o contrato precisa ser honesto se pedirem.
    const s = spec(5, 4, 1);
    expect(s.ancoraVisual).toBeNull();
    expect(s.escrita).toBeNull();
    expect(s.recapitulacao).toEqual([]);
    expect(s.resposta).toBe(20);
  });
});

describe("invariantes em toda a ficha", () => {
  it("o enunciado nunca revela a resposta, em nenhum nível", () => {
    for (const d of TODAS_DECOMPONIVEIS) {
      for (const nivel of [1, 2, 3, 4, 5]) {
        expect(enunciadoNaoRevela(spec(d.tabuada, d.vezes, nivel)),
          `${d.tabuada}×${d.vezes} nível ${nivel}`).toBe(true);
      }
    }
  });

  it("nem no nível 5, com as tabuadas de padrão misturadas", () => {
    for (const tabuada of tabuadasDoNivel(5)) {
      for (let vezes = OUTRO_FATOR_MIN; vezes <= OUTRO_FATOR_MAX; vezes += 1) {
        const s = spec(tabuada, vezes, 5);
        if (s.alternativas.length < 3) continue;
        expect(enunciadoNaoRevela(s), `${tabuada}×${vezes}`).toBe(true);
      }
    }
  });

  it("a resposta aparece uma vez só e nenhuma alternativa se repete", () => {
    for (const d of TODAS_DECOMPONIVEIS) {
      const s = spec(d.tabuada, d.vezes, 4);
      expect(s.alternativas.filter(a => a.valor === s.resposta)).toHaveLength(1);
      expect(new Set(s.alternativas.map(a => a.valor)).size).toBe(s.alternativas.length);
      for (const a of s.alternativas) expect(a.valor).toBeGreaterThan(0);
    }
  });

  it("só a alternativa correta vem sem hipótese", () => {
    for (const d of TODAS_DECOMPONIVEIS) {
      const s = spec(d.tabuada, d.vezes, 4);
      const semTag = s.alternativas.filter(a => a.tag === "");
      expect(semTag).toHaveLength(1);
      expect(semTag[0].valor).toBe(s.resposta);
    }
  });
});
