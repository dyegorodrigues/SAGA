import { afterEach, describe, expect, it } from "vitest";
import { construirFatoresRetangulosF66Spec } from "./fatoresRetangulosContract";
import { ehPrimo, fatoresDe, maiorFatorComum, paresDeFatores } from "./fatoresRetangulosProcedure";

/**
 * CLASS-003 — N2.07/F66.
 *
 * O total era um só por nível: 12, 24, 18, 13 e o par 18/24. A ficha cobra 3
 * acertos de 3 em 2 sessões, e a frente da CLASS-007 tornou a fábrica de
 * retângulos operável — a criança operava a fábrica sobre o MESMO número seis
 * vezes.
 *
 * Aqui o sorteio custa mais que nos outros: os rótulos das alternativas eram
 * strings escritas à mão para cada total ("1×24, 2×12, 3×8 e 4×6"). Sortear o
 * total obriga a derivar rótulo e distrator do próprio número, e é isso que
 * este arquivo cobra.
 */
const AMOSTRAS = 60;

const original = Math.random;
afterEach(() => { Math.random = original; });

function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0x100000000;
  };
}

function amostrar(nivel: number, semente = 0x7d2e14f) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirFatoresRetangulosF66Spec(nivel));
}

describe("CLASS-003 — N2.07/F66: o número muda, a escada não", () => {
  it("nenhum nível devolve sempre o mesmo total", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const totais = new Set(amostrar(nivel).map(s => `${s.total}/${s.segundoTotal ?? ""}`));
      expect(totais.size, `L${nivel} devolveu sempre ${[...totais][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["pares-com-dica", "todos-pares", "listar-fatores", "identificar-primo", "maior-fator-comum"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("fatores, pares e dica são derivados do total sorteado, não escritos à mão", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.fatores, `L${nivel}`).toEqual(fatoresDe(spec.total));
        expect(spec.pares, `L${nivel}`).toEqual(paresDeFatores(spec.total));
      }
    }
    for (const spec of amostrar(1)) {
      expect(spec.dicaQuantidadePares, "a dica precisa contar as formações do total sorteado")
        .toBe(paresDeFatores(spec.total).length);
    }
  });

  it("cada nível respeita o que a escada exige do número", () => {
    for (const spec of amostrar(1)) {
      expect(paresDeFatores(spec.total).length, "L1 precisa de formações para completar a lista").toBeGreaterThanOrEqual(3);
    }
    for (const spec of amostrar(2)) {
      expect(paresDeFatores(spec.total).length, "L2 lista todos os pares").toBeGreaterThanOrEqual(4);
    }
    for (const spec of amostrar(3)) {
      expect(fatoresDe(spec.total).length, "L3 lista todos os fatores").toBeGreaterThanOrEqual(5);
    }
    for (const spec of amostrar(4)) {
      expect(ehPrimo(spec.total), `L4 precisa de primo, veio ${spec.total}`).toBe(true);
      expect(spec.primo).toBe(true);
    }
    for (const spec of amostrar(5)) {
      expect(spec.segundoTotal, "L5 precisa de dois números").toBeDefined();
      expect(spec.maiorFatorComum).toBe(maiorFatorComum(spec.total, spec.segundoTotal!));
      expect(spec.maiorFatorComum!, "MDC pequeno demais não distingue os distratores").toBeGreaterThanOrEqual(6);
      expect(spec.total).not.toBe(spec.segundoTotal);
      // CLASS-009: a abertura não pode desenhar o MDC — nem como coluna, nem
      // como linha. O complemento entrega tanto quanto o divisor.
      expect(spec.divisorInicial, "L5 abriu no próprio MDC").not.toBe(spec.maiorFatorComum);
      expect(spec.total / spec.divisorInicial, "o complemento da abertura é o MDC").not.toBe(spec.maiorFatorComum);
      expect(spec.total % spec.divisorInicial, "L5 abre num divisor que fecha").toBe(0);
    }
  });

  it("as alternativas continuam íntegras: resposta única, valores distintos, preview para cada uma", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor em total ${spec.total}`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        const semMisconception = spec.opcoes.filter(o => !o.misconception);
        expect(semMisconception.length, `L${nivel} deveria ter exatamente uma alternativa certa`).toBe(1);
        expect(semMisconception[0].value).toBe(spec.resposta);
        for (const opcao of spec.opcoes) {
          expect(spec.previewDivisorByValue[String(opcao.value)], `L${nivel} sem preview para ${opcao.value}`).toBeDefined();
          expect(opcao.label.length, `L${nivel} rótulo vazio`).toBeGreaterThan(0);
        }
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(spec.opcoes.length);
      }
    }
  });

  it("o distrator de múltiplo confundido carrega mesmo um não-fator", () => {
    // Se o "fator a mais" fosse um fator de verdade, o distrator estaria certo
    // e o erro que ele nomeia deixaria de existir.
    for (const nivel of [1, 2, 3]) {
      for (const spec of amostrar(nivel)) {
        const distrator = spec.opcoes.find(o => o.misconception === "confunde-fator-multiplo");
        expect(distrator, `L${nivel} sem distrator de múltiplo`).toBeDefined();
        const numeros = (distrator!.label.match(/\d+/g) ?? []).map(Number);
        const intrusos = numeros.filter(n => n > 1 && n < spec.total && spec.total % n !== 0);
        expect(intrusos.length, `L${nivel}: "${distrator!.label}" não tem não-fator para ${spec.total}`).toBeGreaterThan(0);
      }
    }
  });
});
