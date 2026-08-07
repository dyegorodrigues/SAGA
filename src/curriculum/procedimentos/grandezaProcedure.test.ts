import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ADJETIVO,
  AcaoDeGrandeza,
  FALAS,
  atributoDoNivel,
  diagnosticar,
  diferencaDoNivel,
  diferencaPequena,
  dominou,
  objetosDiferentesNoNivel,
  quantosNoNivel,
  reguaFantasmaNoNivel,
  seriaNoNivel,
} from "./grandezaProcedure";
import {
  cabeNaCaixa,
  construirGrandezaSpec,
  larguraContraria,
  semEmpate,
} from "./grandezaContract";
import { GM_01 } from "../fichas/jornada/GM.01";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const CANONE = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
).replace(/\*\*/g, "");

describe("F49 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, "altura", false, false],
    [2, "comprimento", false, false],
    [3, "altura", false, false],
    [4, "altura", true, false],
    [5, "tamanho", true, true],
  ])("nível %i: %s, objetos diferentes %s, seriação %s", (n, attr, dif, seria) => {
    expect(atributoDoNivel(n)).toBe(attr);
    expect(objetosDiferentesNoNivel(n)).toBe(dif);
    expect(seriaNoNivel(n)).toBe(seria);
  });

  it("só o nível 3 tem a diferença PEQUENA — o degrau que a §9 exige", () => {
    expect([1, 2, 3, 4, 5].map(diferencaPequena)).toEqual([false, false, true, false, false]);
  });

  it("a régua fantasma entra do nível 3 em diante — §4", () => {
    expect([1, 2, 3, 4, 5].map(reguaFantasmaNoNivel)).toEqual([false, false, true, true, true]);
  });

  it("a seriação traz TRÊS objetos; os outros níveis, dois", () => {
    expect([1, 2, 3, 4, 5].map(quantosNoNivel)).toEqual([2, 2, 2, 2, 3]);
  });

  it("a diferença do nível 1 é gritante e a do 3 é sutil", () => {
    expect(diferencaDoNivel(1)).toBeGreaterThan(diferencaDoNivel(3) * 2);
  });
});

describe("a cena", () => {
  it("⚠️ nunca há empate na grandeza comparada", () => {
    // Empate é questão sem resposta (§6.2).
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        expect(semEmpate(construirGrandezaSpec(n, semente(s))), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("nenhum objeto estoura a caixa nem afunda no chão", () => {
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        expect(cabeNaCaixa(construirGrandezaSpec(n, semente(s))), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("⚠️ a largura anda ao CONTRÁRIO da altura", () => {
    // Se acompanhasse, escolher o mais volumoso daria a mesma resposta que
    // escolher o mais alto, e `CONFUNDE_ATRIBUTOS` seria inobservável.
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        expect(larguraContraria(construirGrandezaSpec(n, semente(s))), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("a resposta certa é mesmo o extremo pedido", () => {
    for (const s of SEMENTES) {
      for (const n of [1, 2, 3, 4]) {
        const spec = construirGrandezaSpec(n, semente(s));
        const alturas = spec.objetos.map(o => o.altura);
        const extremo = spec.polo === "maior" ? Math.max(...alturas) : Math.min(...alturas);
        expect(spec.objetos[spec.resposta].altura, `n${n} s${s}`).toBe(extremo);
      }
    }
  });

  it("⚠️ a POSIÇÃO na tela não denuncia a resposta", () => {
    // Com o mais alto sempre à esquerda, a criança acerta por lado.
    const lados = new Set(SEMENTES.map(s => construirGrandezaSpec(1, semente(s)).resposta));
    expect(lados.size).toBeGreaterThan(1);
  });

  it("nos níveis de objeto único, os dois são o MESMO desenho", () => {
    // Senão ela compara o tipo de bicho em vez da grandeza.
    for (const s of SEMENTES) {
      for (const n of [1, 2, 3]) {
        const spec = construirGrandezaSpec(n, semente(s));
        expect(new Set(spec.objetos.map(o => o.emoji)).size, `n${n} s${s}`).toBe(1);
      }
    }
  });

  it("o nível 4 traz objetos DIFERENTES", () => {
    for (const s of SEMENTES) {
      const spec = construirGrandezaSpec(4, semente(s));
      expect(new Set(spec.objetos.map(o => o.emoji)).size).toBe(2);
    }
  });

  it("a ordem certa da seriação tem os três, sem repetir", () => {
    for (const s of SEMENTES) {
      const spec = construirGrandezaSpec(5, semente(s));
      expect(new Set(spec.ordemCerta).size).toBe(3);
      const alturas = spec.ordemCerta.map(i => spec.objetos[i].altura);
      const esperado = spec.polo === "maior"
        ? [...alturas].sort((a, b) => b - a)
        : [...alturas].sort((a, b) => a - b);
      expect(alturas).toEqual(esperado);
    }
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirGrandezaSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — o diagnóstico", () => {
  const base: AcaoDeGrandeza = {
    escolhido: 0, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: false, antesDoChao: false,
  };

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar(base)).toBeUndefined();
  });

  it("⚠️ responder antes da linha do chão é BASE_DESALINHADA", () => {
    // A §2 obriga a tela a alinhar as bases, então "julgar desalinhado" não tem
    // como acontecer depois que ela existe. A assinatura que sobra é a da §4: a
    // linha SE DESENHA, e decidir antes é decidir sem referência.
    expect(diagnosticar({ ...base, escolhido: 1, antesDoChao: true }))
      .toBe(MisconceptionTag.BASE_DESALINHADA);
  });

  it("escolher quem vence no outro atributo é CONFUNDE_ATRIBUTOS", () => {
    expect(diagnosticar({ ...base, escolhido: 1 })).toBe(MisconceptionTag.CONFUNDE_ATRIBUTOS);
  });

  it("errar com diferença pequena, sem ser o volumoso, é SO_DIFERENCA_GRANDE", () => {
    expect(diagnosticar({
      ...base, escolhido: 2, vencedorDoOutroAtributo: 1, diferencaPequena: true,
    })).toBe(MisconceptionTag.SO_DIFERENCA_GRANDE);
  });
});

describe("§9 — o domínio exige um acerto com diferença PEQUENA", () => {
  const acerto = (pequena: boolean): AcaoDeGrandeza =>
    ({ escolhido: 0, certo: 0, vencedorDoOutroAtributo: 1, diferencaPequena: pequena, antesDoChao: false });

  it("três acertos gritantes NÃO dão domínio", () => {
    // Acertar três diferenças óbvias mostra que ela enxerga, não que compara.
    expect(dominou([acerto(false), acerto(false), acerto(false)])).toBe(false);
  });

  it("um dos três com diferença pequena dá domínio", () => {
    expect(dominou([acerto(false), acerto(false), acerto(true)])).toBe(true);
  });
});

describe("§7 — as falas", () => {
  it.each([
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
  ])("%s está escrita no Markdown do cânone", (_n, frase) => {
    expect(CANONE).toContain(frase);
  });

  it("cada atributo tem o adjetivo certo nos dois polos", () => {
    expect(ADJETIVO.altura.maior).toBe("mais alto");
    expect(ADJETIVO.comprimento.menor).toBe("mais curto");
  });

  it("o erro NOMEIA o que a linha mostra — não diz 'errou'", () => {
    const fala = FALAS.erroSuave("altura", "maior");
    expect(fala).toBe("Olhe a linha: esse é mais baixo.");
    expect(fala.toLowerCase()).not.toContain("errou");
  });
});

describe("a ficha", () => {
  it("os cinco níveis são `grandeza`", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(GM_01.niveis![n].primitiva, `nível ${n}`).toBe("grandeza");
    }
  });

  it("cada nível tem micro própria", () => {
    expect(new Set([1, 2, 3, 4, 5].map(n => GM_01.niveis![n].micro)).size).toBe(5);
  });

  it("as três tags da §6 estão declaradas", () => {
    expect(GM_01.erros_tipicos!.map(e => e.id).sort()).toEqual([
      MisconceptionTag.BASE_DESALINHADA,
      MisconceptionTag.CONFUNDE_ATRIBUTOS,
      MisconceptionTag.SO_DIFERENCA_GRANDE,
    ].sort());
  });

  it("o nível 1 declara a coreografia da §8, com a linha de base", () => {
    const beats = GM_01.micros.find(m => m.id === "alto_baixo")!.params.tutorial as
      { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarLinhaBase === true)).toBe(true);
    expect(beats.some(b => b.show?.subirLinhaTracejada === true)).toBe(true);
  });
});
