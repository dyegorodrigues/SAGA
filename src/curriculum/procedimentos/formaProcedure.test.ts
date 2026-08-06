import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ANGULOS,
  FALAS,
  FORMAS,
  LADOS,
  SOLIDOS,
  aceitaGiro,
  diagnosticar,
  dominou,
  giraNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  solidosNoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";
import {
  LADO_DO_CONTEINER,
  OBJETOS_REAIS,
  alvoGiradoQuandoDeve,
  alvosPossiveis,
  construirFormaSpec,
  respostaApareceUmaVez,
} from "./formaContract";
import { GE_02 } from "../fichas/jornada/GE.02";

function semente(s: number): () => number {
  let x = s >>> 0;
  return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
}
const SEMENTES = [1, 7, 42, 99, 123, 777, 2024, 31415];

const CANONE = readFileSync(
  join(__dirname, "..", "..", "..", "AI_Studio_Lab", "pedagogia", "fichas", "FICHAS_F0_COMPLETAS.md"),
  "utf8",
).replace(/\*\*/g, "");

describe("F48 §5 — os cinco níveis, transcritos", () => {
  it.each([
    [1, false, false, false, false],
    [2, true, false, false, false],
    [3, true, true, false, false],
    [4, true, true, true, false],
    [5, true, true, false, true],
  ])("nível %i: gira %s, varia %s, mundo real %s, sólidos %s", (n, gira, varia, real, solidos) => {
    expect(giraNoNivel(n)).toBe(gira);
    expect(variaAparenciaNoNivel(n)).toBe(varia);
    expect(mundoRealNoNivel(n)).toBe(real);
    expect(solidosNoNivel(n)).toBe(solidos);
  });

  it("⚠️ o giro NÃO some depois do nível 2", () => {
    // A §2 diz "desde o nível 2". Um nível 4 com tudo em pé devolveria a pista
    // que a ficha inteira existe para tirar.
    expect([2, 3, 4, 5].every(giraNoNivel)).toBe(true);
  });

  it("§3: sempre 3 a 4 formas na tela", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(opcoesDoNivel(n)).toBeGreaterThanOrEqual(3);
      expect(opcoesDoNivel(n)).toBeLessThanOrEqual(4);
    }
  });
});

describe("o giro, que é o assunto da ficha", () => {
  it("⚠️ o círculo NÃO aceita giro — um círculo girado é um círculo", () => {
    // Anunciar giro num círculo entregaria uma questão "girada" que chega à
    // criança em pé, e a §9 (que exige um acerto com a forma girada) passaria a
    // depender de sorte.
    expect(aceitaGiro("circulo")).toBe(false);
    expect(ANGULOS.circulo).toEqual([0]);
  });

  it("o quadrado gira 45° — o 'losango' que a §2 cita pelo nome", () => {
    expect(ANGULOS.quadrado).toContain(45);
  });

  it("nenhum ângulo declarado devolve a mesma figura na tela", () => {
    // 90° num quadrado é o mesmo desenho; 180° num retângulo também.
    expect(ANGULOS.quadrado.every(a => a % 90 !== 0)).toBe(true);
    expect(ANGULOS.triangulo.every(a => a % 360 !== 0)).toBe(true);
  });

  it("o alvo do nível 2 em diante nunca é o círculo", () => {
    for (const n of [2, 3, 4]) {
      expect(alvosPossiveis(n)).not.toContain("circulo");
    }
  });

  it("⚠️ onde a ficha promete giro, a CERTA está girada — em toda semente", () => {
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        const spec = construirFormaSpec(n, semente(s));
        expect(alvoGiradoQuandoDeve(spec), `n${n} s${s}`).toBe(true);
      }
    }
  });
});

describe("a cena", () => {
  it("a resposta aparece exatamente uma vez, e o número de opções é o do nível", () => {
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        const spec = construirFormaSpec(n, semente(s));
        expect(respostaApareceUmaVez(spec), `n${n} s${s}`).toBe(true);
        expect(spec.opcoes).toHaveLength(opcoesDoNivel(n));
      }
    }
  });

  it("⚠️ os contêineres são IDÊNTICOS — o tamanho não é pista (§3)", () => {
    // Contêiner maior para a forma certa deixaria a criança acertar sem olhar a
    // forma, e olhar a forma é a competência inteira. O que varia no nível 3 é
    // o DESENHO dentro da caixa.
    expect(LADO_DO_CONTEINER).toBeGreaterThanOrEqual(80);
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(3, semente(s));
      expect(new Set(spec.opcoes.map(o => o.tamanho)).size).toBeGreaterThan(0);
      // e nenhum desenho estoura o contêiner
      expect(spec.opcoes.every(o => o.tamanho < LADO_DO_CONTEINER)).toBe(true);
    }
  });

  it("o nível 5 traz sólidos, e só sólidos", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(5, semente(s));
      expect(spec.solidos).toBe(true);
      expect(spec.opcoes.every(o => (SOLIDOS as string[]).includes(String(o.figura)))).toBe(true);
    }
  });

  it("o nível 4 põe cada forma dentro de um objeto do mundo", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(4, semente(s));
      expect(spec.opcoes.every(o => o.objeto !== undefined)).toBe(true);
      // E o objeto É a forma que ele diz ser: a roda é um círculo.
      expect(spec.opcoes.every(o => OBJETOS_REAIS[o.objeto!] === o.figura)).toBe(true);
    }
  });

  it("nos níveis 1 e 2 a cor é uma só — cor vira variável no nível 3", () => {
    for (const s of SEMENTES) {
      for (const n of [1, 2]) {
        const spec = construirFormaSpec(n, semente(s));
        expect(new Set(spec.opcoes.map(o => o.cor)).size).toBe(1);
      }
    }
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirFormaSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — o diagnóstico", () => {
  const base = { pedida: "triangulo", escolhida: "triangulo", pedidaGirada: true, escolhidaEmPe: false } as const;

  it("acerto não gera diagnóstico", () => {
    expect(diagnosticar({ ...base })).toBeUndefined();
  });

  it("⚠️ a certa girada + a escolhida em pé é SO_ORIENTACAO_PADRAO — o alvo", () => {
    // A §2 descreve a conduta nome por nome: "ela memorizou uma imagem".
    expect(diagnosticar({ ...base, escolhida: "circulo", escolhidaEmPe: true }))
      .toBe(MisconceptionTag.SO_ORIENTACAO_PADRAO);
  });

  it("o par quadrado/retângulo, sem giro explicando, tem tag própria", () => {
    expect(diagnosticar({
      pedida: "quadrado", escolhida: "retangulo", pedidaGirada: false, escolhidaEmPe: false,
    })).toBe(MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO);
  });

  it("⚠️ o giro vence o par: quadrado girado escolhido como retângulo é orientação", () => {
    // O quadrado girado 45° É o "losango" da §2. Chamar isso de confusão
    // quadrado/retângulo mandaria a Oficina ensinar comprimento de lado para
    // uma criança cujo problema é o giro.
    expect(diagnosticar({
      pedida: "quadrado", escolhida: "retangulo", pedidaGirada: true, escolhidaEmPe: true,
    })).toBe(MisconceptionTag.SO_ORIENTACAO_PADRAO);
  });

  it("o resto é IGNORA_LADOS", () => {
    expect(diagnosticar({
      pedida: "triangulo", escolhida: "circulo", pedidaGirada: false, escolhidaEmPe: false,
    })).toBe(MisconceptionTag.IGNORA_LADOS);
  });
});

describe("§9 — o domínio exige um acerto com a forma GIRADA", () => {
  const acerto = (girada: boolean) =>
    ({ pedida: "triangulo", escolhida: "triangulo", pedidaGirada: girada, escolhidaEmPe: false } as const);

  it("três acertos com tudo em pé NÃO dão domínio", () => {
    expect(dominou([acerto(false), acerto(false), acerto(false)])).toBe(false);
  });

  it("um dos três com a forma girada dá domínio", () => {
    expect(dominou([acerto(false), acerto(false), acerto(true)])).toBe(true);
  });
});

describe("§7 — as falas e os lados", () => {
  it.each([
    ["howto", FALAS.howto],
    ["explain", FALAS.explain],
  ])("%s está escrita no Markdown do cânone", (_n, frase) => {
    expect(CANONE).toContain(frase);
  });

  it("⚠️ o círculo tem ZERO lados — dizer 'um' seria ensinar errado", () => {
    expect(LADOS.circulo).toBe(0);
    expect(FALAS.acerto("circulo")).toContain("não tem lado nenhum");
  });

  it("o acerto diz o número de lados E que ele vale em qualquer posição", () => {
    expect(FALAS.acerto("triangulo")).toBe("Isso! o triângulo tem 3 lados, em qualquer posição.");
  });

  it("o erro conta os lados das duas — não diz 'errou'", () => {
    const fala = FALAS.erroSuave("quadrado", "triangulo");
    expect(fala).toContain("4 lados");
    expect(fala).toContain("3 lados");
    expect(fala.toLowerCase()).not.toContain("errou");
  });

  it("quadrado e retângulo têm o mesmo número de lados — o que os separa é o comprimento", () => {
    // É por isso que `CONFUNDE_QUADRADO_RETANGULO` tem tag própria: contar
    // lados não resolve esse par, e a aula é outra.
    expect(LADOS.quadrado).toBe(LADOS.retangulo);
  });
});

describe("a ficha", () => {
  it("os cinco níveis são `shapecanvas`, todos em modo formas", () => {
    for (let n = 1; n <= 5; n += 1) {
      expect(GE_02.niveis![n].primitiva, `nível ${n}`).toBe("shapecanvas");
    }
    for (const m of GE_02.micros) {
      expect(m.params.modo, m.id).toBe("formas");
    }
  });

  it("cada nível tem micro própria", () => {
    expect(new Set([1, 2, 3, 4, 5].map(n => GE_02.niveis![n].micro)).size).toBe(5);
  });

  it("as três tags da §6 estão declaradas", () => {
    expect(GE_02.erros_tipicos!.map(e => e.id).sort()).toEqual([
      MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO,
      MisconceptionTag.IGNORA_LADOS,
      MisconceptionTag.SO_ORIENTACAO_PADRAO,
    ].sort());
  });

  it("a coreografia da §8 está no nível 2 — o nível do giro", () => {
    const beats = GE_02.micros.find(m => m.id === "giradas")!.params.tutorial as
      { show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarTodas === true)).toBe(true);
    expect(beats.some(b => b.show?.contarLados === 3)).toBe(true);
    expect(beats.some(b => b.show?.girarForma === 360)).toBe(true);
  });

  it("as quatro formas planas existem, e os três sólidos da §5 também", () => {
    expect(FORMAS).toHaveLength(4);
    expect(SOLIDOS).toEqual(["cubo", "esfera", "cilindro"]);
  });
});
