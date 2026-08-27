import { afterEach, describe, expect, it } from "vitest";
import { construirPartesIguaisSpec } from "./partesIguaisContract";
import { construirSomaFracoesF74Spec } from "./somaFracoesContract";

/**
 * CLASS-003, segunda dimensão — N5.01/F45 e N5.04/F74.
 *
 * Em N5.01 o nível 2 é "sobrepor": pôr uma parte sobre a outra para CONFERIR.
 * As partes encaixavam sempre, então conferir nunca desmentia nada e
 * "Encaixam: são iguais" acertava em todo sorteio. Um teste que não pode dar
 * negativo não é um teste.
 *
 * Em N5.04 a conta era uma só por nível — 1/4+2/4, 2/5+1/5, 5/7−2/7, 3/4+2/4 e
 * 2/8+2/8 —, e a resposta certa era 3/4, 3/5, 3/7, 5/4 e 1/2 para sempre.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar<T>(construir: (nivel: number) => T, nivel: number, semente: number): T[] {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construir(nivel));
}
const mdc = (a: number, b: number): number => (b === 0 ? a : mdc(b, a % b));

describe("CLASS-003 — N5.01/F45: sobrepor precisa poder desmentir", () => {
  const specs = (nivel: number) => amostrar(construirPartesIguaisSpec, nivel, 0x3a90f6d);

  it("L2 mostra partes que encaixam E partes que não encaixam", () => {
    const respostas = specs(2).map(s => s.resposta);
    expect(respostas.filter(r => r === "iguais").length, "L2 nunca mostra partes iguais").toBeGreaterThan(0);
    expect(respostas.filter(r => r === "diferentes").length, "L2 nunca mostra partes diferentes").toBeGreaterThan(0);
    for (const spec of specs(2)) {
      expect(spec.modo, "L2 continua sendo o nível de sobrepor").toBe("sobrepor");
      expect(spec.sobrepor).toBe(true);
      expect(spec.resposta).toBe(spec.partesIguais ? "iguais" : "diferentes");
      // Os cortes desenhados precisam concordar com o veredito: partes ditas
      // iguais e desenhadas tortas fariam a tela mentir sobre si mesma.
      const iguaisNoDesenho = spec.cortes.every((corte, i) => Math.abs(corte - spec.cortesAlvo[i]) < 1e-9);
      expect(iguaisNoDesenho, `L2: cortes ${spec.cortes} não batem com "${spec.resposta}"`).toBe(spec.partesIguais);
      expect(spec.opcoes.filter(o => !o.misconception), "L2 sem alternativa certa única").toHaveLength(1);
      expect(spec.opcoes.find(o => !o.misconception)!.value).toBe(spec.resposta);
    }
  });
});

describe("CLASS-003 — N5.04/F74: a conta muda, a escada não", () => {
  const specs = (nivel: number) => amostrar(construirSomaFracoesF74Spec, nivel, 0x18cb5e2);

  it("nenhum nível responde sempre a mesma fração", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      expect(new Set(specs(nivel).map(s => s.resposta)).size, `L${nivel} responde sempre ${specs(nivel)[0].resposta}`).toBeGreaterThan(1);
    }
  });

  it("o modo e a restrição de cada nível continuam fixos", () => {
    const modos = ["somar-barras", "somar-simbolico", "subtrair", "fracao-impropria", "simplificar"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.denominadoresIguais, "os denominadores continuam iguais dos dois lados").toBe(true);
        expect(spec.operacao).toBe(nivel === 3 ? "-" : "+");
        expect(spec.aNumerador).toBeGreaterThan(0);
        expect(spec.bNumerador).toBeGreaterThan(0);
        expect(spec.denominador).toBeGreaterThan(2);
      }
    }
  });

  it("cada nível cai no caso que ele existe para ensinar", () => {
    for (const nivel of [1, 2]) {
      for (const spec of specs(nivel)) {
        expect(spec.resultadoNumeradorBruto, `L${nivel} ainda não passa do inteiro`).toBeLessThan(spec.denominador);
        expect(mdc(spec.resultadoNumeradorBruto, spec.denominador), `L${nivel} não pode pedir simplificação: isso é L5`).toBe(1);
      }
    }
    for (const spec of specs(3)) {
      expect(spec.aNumerador, "subtrair precisa sobrar alguma coisa").toBeGreaterThan(spec.bNumerador);
      expect(spec.resultadoNumeradorBruto).toBe(spec.aNumerador - spec.bNumerador);
    }
    for (const spec of specs(4)) {
      expect(spec.resultadoNumeradorBruto, "L4 existe para passar do inteiro").toBeGreaterThan(spec.denominador);
    }
    for (const spec of specs(5)) {
      expect(mdc(spec.resultadoNumeradorBruto, spec.denominador), "L5 precisa de fator comum para simplificar").toBeGreaterThan(1);
      expect(spec.resposta, "a simplificada precisa diferir da bruta").not.toBe(spec.resultadoBruto);
    }
  });

  it("a resposta é a conta que o spec mostra", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        const bruto = spec.operacao === "+" ? spec.aNumerador + spec.bNumerador : spec.aNumerador - spec.bNumerador;
        expect(spec.resultadoNumeradorBruto).toBe(bruto);
        expect(spec.resultadoBruto).toBe(`${bruto}/${spec.denominador}`);
        const divisor = mdc(bruto, spec.denominador);
        const esperada = nivel === 5 ? `${bruto / divisor}/${spec.denominador / divisor}` : spec.resultadoBruto;
        expect(spec.resposta, `L${nivel}: ${spec.resultadoBruto} deveria responder ${esperada}`).toBe(esperada);
      }
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of specs(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        // A F74 declara três erros típicos, e uma das alternativas — o
        // numerador contado a menos — não é nenhum deles: é escorregão de
        // contagem, não hipótese. Ela fica sem tag de propósito; inventar uma
        // quarta mandaria ao Radar um diagnóstico que a ficha não sustenta.
        expect(spec.opcoes.find(o => o.value === spec.resposta)?.misconception, `L${nivel} marcou a certa como erro`).toBeUndefined();
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa`).toBeGreaterThanOrEqual(3);
        expect(spec.opcoes.some(o => o.misconception === "soma-denominador"), `L${nivel} sem o distrator de somar denominador`).toBe(true);
      }
    }
    for (const spec of specs(4)) {
      expect(spec.opcoes.some(o => o.misconception === "impropria-invalida"), "L4 sem o distrator da imprópria").toBe(true);
    }
    for (const spec of specs(5)) {
      expect(spec.opcoes.some(o => o.misconception === "nao-simplifica"), "L5 sem o distrator de não simplificar").toBe(true);
    }
  });
});
