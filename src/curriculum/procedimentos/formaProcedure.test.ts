import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MisconceptionTag } from "../../constants/misconceptions";
import {
  ANGULOS,
  FALAS,
  FORMAS,
  LADOS,
  aceitaGiro,
  diagnosticar,
  dominou,
  giraNoNivel,
  misturaRepresentacoesNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";
import {
  LADO_DO_CONTEINER,
  OBJETOS_REAIS,
  alvoGiradoQuandoDeve,
  alvosPossiveis,
  construirFormaSpec,
  representacoesMistasQuandoDeve,
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
).split("**").join("");

const GRAFO_GE = readFileSync(join(__dirname, "..", "..", "..", "curriculum", "GE.yaml"), "utf8");

describe("F48 §5 — escada corrigida dentro de GE.02", () => {
  it.each([
    [1, false, false, false, false, 3],
    [2, true, false, false, false, 3],
    [3, true, true, false, false, 4],
    [4, true, true, true, false, 4],
    [5, true, true, false, true, 4],
  ])("nível %i: gira %s varia %s real %s mista %s opções %i", (n, gira, varia, real, mista, opcoes) => {
    expect(giraNoNivel(n)).toBe(gira);
    expect(variaAparenciaNoNivel(n)).toBe(varia);
    expect(mundoRealNoNivel(n)).toBe(real);
    expect(misturaRepresentacoesNoNivel(n)).toBe(mista);
    expect(opcoesDoNivel(n)).toBe(opcoes);
  });

  it("⚠️ GE.02 não invade GE.04: todo nível da F48 continua plano", () => {
    expect(GRAFO_GE).toContain("GE.02:");
    expect(GRAFO_GE).toContain('title: "Formas planas básicas"');
    expect(GRAFO_GE).toContain("GE.04:");
    expect(GRAFO_GE).toContain('title: "Sólidos geométricos"');
    for (const n of [1, 2, 3, 4, 5]) {
      for (const s of SEMENTES) {
        const spec = construirFormaSpec(n, semente(s));
        expect(spec.opcoes.every(o => FORMAS.includes(o.figura)), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("N5 mistura exatamente duas representações reais e duas puras", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(5, semente(s));
      expect(spec.opcoes).toHaveLength(4);
      expect(spec.opcoes.filter(o => o.objeto).length).toBe(2);
      expect(spec.opcoes.filter(o => !o.objeto).length).toBe(2);
      expect(representacoesMistasQuandoDeve(spec)).toBe(true);
    }
  });

  it("o cânone registra explicitamente a retificação 2D→3D", () => {
    expect(CANONE).toContain("Retificação GE.02 × GE.04");
    expect(CANONE).toContain("mistura de representações planas");
  });
});

describe("o giro, assunto da ficha", () => {
  it("círculo não finge ter orientação", () => {
    expect(aceitaGiro("circulo")).toBe(false);
    expect(ANGULOS.circulo).toEqual([0]);
  });

  it("quadrado inclui 45° — o caso que parece losango", () => {
    expect(ANGULOS.quadrado).toContain(45);
  });

  it("desde o nível 2 a resposta certa é realmente girada", () => {
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        expect(alvoGiradoQuandoDeve(construirFormaSpec(n, semente(s))), `n${n} s${s}`).toBe(true);
      }
    }
  });

  it("o alvo girável nunca é círculo nos níveis 2–5", () => {
    for (const n of [2, 3, 4, 5]) expect(alvosPossiveis(n)).not.toContain("circulo");
  });
});

describe("a cena", () => {
  it("resposta aparece uma vez e contêiner nunca muda de tamanho", () => {
    expect(LADO_DO_CONTEINER).toBeGreaterThanOrEqual(80);
    for (const s of SEMENTES) {
      for (let n = 1; n <= 5; n += 1) {
        const spec = construirFormaSpec(n, semente(s));
        expect(respostaApareceUmaVez(spec), `n${n} s${s}`).toBe(true);
        expect(spec.opcoes).toHaveLength(opcoesDoNivel(n));
        expect(spec.opcoes.every(o => o.tamanho < LADO_DO_CONTEINER)).toBe(true);
      }
    }
  });

  it("N4 põe todas as formas dentro de objetos coerentes", () => {
    for (const s of SEMENTES) {
      const spec = construirFormaSpec(4, semente(s));
      expect(spec.opcoes.every(o => o.objeto !== undefined)).toBe(true);
      expect(spec.opcoes.every(o => OBJETOS_REAIS[o.objeto!] === o.figura)).toBe(true);
    }
  });

  it("N1–2 não usam cor/tamanho como pista", () => {
    for (const s of SEMENTES) {
      for (const n of [1, 2]) {
        const spec = construirFormaSpec(n, semente(s));
        expect(new Set(spec.opcoes.map(o => o.cor)).size).toBe(1);
        expect(new Set(spec.opcoes.map(o => o.tamanho)).size).toBe(1);
      }
    }
  });

  it("500 amostras sem exceção", () => {
    for (let i = 0; i < 500; i += 1) {
      expect(() => construirFormaSpec((i % 5) + 1, semente(i + 1))).not.toThrow();
    }
  });
});

describe("§6 — diagnóstico", () => {
  const base = { pedida: "triangulo", escolhida: "triangulo", pedidaGirada: true, escolhidaEmPe: false } as const;

  it("acerto não gera hipótese", () => expect(diagnosticar(base)).toBeUndefined());

  it("certa girada + escolhida em pé é SO_ORIENTACAO_PADRAO", () => {
    expect(diagnosticar({ ...base, escolhida: "circulo", escolhidaEmPe: true }))
      .toBe(MisconceptionTag.SO_ORIENTACAO_PADRAO);
  });

  it("quadrado/retângulo tem hipótese própria quando giro não explica", () => {
    expect(diagnosticar({ pedida: "quadrado", escolhida: "retangulo", pedidaGirada: false, escolhidaEmPe: false }))
      .toBe(MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO);
  });

  it("o restante é IGNORA_LADOS", () => {
    expect(diagnosticar({ pedida: "triangulo", escolhida: "circulo", pedidaGirada: false, escolhidaEmPe: false }))
      .toBe(MisconceptionTag.IGNORA_LADOS);
  });
});

describe("§7–§9", () => {
  it("howto não contradiz o alvo sorteado", () => {
    expect(FALAS.howto.toLowerCase()).not.toContain("triângulo");
    expect(FALAS.howto).toContain("contorno");
  });

  it("quadrado × retângulo recebe feedback que realmente distingue os dois", () => {
    const fala = FALAS.erroSuave("quadrado", "retangulo");
    expect(fala).toContain("quatro lados iguais");
    expect(fala).toContain("dois longos e dois curtos");
  });

  it("círculo tem zero lados", () => expect(LADOS.circulo).toBe(0));

  it("domínio exige pelo menos um acerto girado", () => {
    const a = (g: boolean) => ({ pedida: "triangulo", escolhida: "triangulo", pedidaGirada: g, escolhidaEmPe: false } as const);
    expect(dominou([a(false), a(false), a(false)])).toBe(false);
    expect(dominou([a(false), a(false), a(true)])).toBe(true);
  });

  it("a coreografia usa o alvo semântico, não triângulo fixo", () => {
    const beats = GE_02.micros.find(m => m.id === "giradas")!.params.tutorial as { fala?: string; show?: Record<string, unknown> }[];
    expect(beats.some(b => b.show?.destacarTodas === true)).toBe(true);
    expect(beats.some(b => b.show?.contarLadosAlvo === true)).toBe(true);
    expect(beats.some(b => b.show?.girarAlvo === true)).toBe(true);
    expect(beats.map(b => b.fala).join(" ").toLowerCase()).not.toContain("triângulo");
  });
});
