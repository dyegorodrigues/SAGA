import { afterEach, describe, expect, it } from "vitest";
import { construirPrimosDivisoresF70Spec } from "./primosDivisoresContract";

/**
 * CLASS-003 — N4.11/F70.
 *
 * O número era um só por nível: base 6, total 18, o par 4/12, o primo 13 e o
 * crivo com bases 2 e 3. A ficha cobra repetição, então a criança riscava o
 * MESMO quadro seis vezes.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x2a6bf35) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirPrimosDivisoresF70Spec(nivel));
}
const ehPrimo = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false; return true; };

describe("CLASS-003 — N4.11/F70: o número muda, a escada não", () => {
  it("nenhum nível devolve sempre o mesmo caso", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const casos = new Set(amostrar(nivel).map(s => `${s.total}/${s.base ?? ""}/${s.crivoBases.join("-")}`));
      expect(casos.size, `L${nivel} devolveu sempre ${[...casos][0]}`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["multiplos-quadro", "divisores-retangulo", "distinguir", "identificar-primos", "crivo-eratostenes"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("os múltiplos destacados são múltiplos da base, e o próximo é a resposta", () => {
    for (const spec of amostrar(1)) {
      const base = spec.base!;
      expect(spec.quadroDestacados.length, "L1 mostra os primeiros múltiplos").toBeGreaterThanOrEqual(3);
      for (const [indice, valor] of spec.quadroDestacados.entries()) expect(valor).toBe(base * (indice + 1));
      expect(spec.resposta, "a resposta é o múltiplo seguinte")
        .toBe(base * (spec.quadroDestacados.length + 1));
      // O distrator de inversão precisa ser um divisor PRÓPRIO da base. Com
      // base prima não existe nenhum, e a alternativa sairia vazia da tela.
      const inverte = spec.opcoes.find(o => o.misconception === "inverte-divisor-multiplo");
      expect(inverte, "L1 sem distrator de inversão").toBeDefined();
      expect(Number.isInteger(Number(inverte!.value)), `L1: distrator inválido "${inverte!.value}"`).toBe(true);
      expect(base % Number(inverte!.value), `${inverte!.value} não é divisor de ${base}`).toBe(0);
      expect(Number(inverte!.value)).toBeGreaterThan(1);
      expect(Number(inverte!.value)).toBeLessThan(base);
    }
  });

  it("o divisor perguntado divide mesmo, e o distrator de múltiplo é múltiplo", () => {
    for (const spec of amostrar(2)) {
      expect(spec.total % Number(spec.resposta), `${spec.resposta} não divide ${spec.total}`).toBe(0);
      expect(Number(spec.resposta), "1 e o próprio número não ensinam nada aqui").toBeGreaterThan(1);
      expect(Number(spec.resposta)).toBeLessThan(spec.total);
      const inverte = spec.opcoes.find(o => o.misconception === "inverte-divisor-multiplo");
      expect(inverte, "L2 sem distrator de inversão").toBeDefined();
      expect(Number(inverte!.value) % spec.total, "o distrator precisa ser MÚLTIPLO do total").toBe(0);
    }
  });

  it("L3 relaciona um par que de fato se divide; L4 usa primo; L5 crava o crivo", () => {
    for (const spec of amostrar(3)) {
      expect(spec.total % spec.base!, `${spec.base} não divide ${spec.total}`).toBe(0);
      expect(spec.base!, "o par precisa ser de números diferentes").toBeLessThan(spec.total);
    }
    for (const spec of amostrar(4)) {
      expect(ehPrimo(spec.total), `L4 sorteou ${spec.total}, que não é primo`).toBe(true);
    }
    for (const spec of amostrar(5)) {
      expect(spec.crivoBases.length, "L5 precisa de bases riscadas").toBeGreaterThan(0);
      expect(ehPrimo(Number(spec.resposta)), `L5 respondeu ${spec.resposta}, que não é primo`).toBe(true);
      expect(spec.crivoBases, "a resposta não pode ser uma base já riscada").not.toContain(Number(spec.resposta));
      // O menor primo que sobrou depois de riscar é a resposta.
      const maiorBase = Math.max(...spec.crivoBases);
      for (let n = maiorBase + 1; n < Number(spec.resposta); n += 1) expect(ehPrimo(n), `${n} sobrou antes da resposta`).toBe(false);
    }
  });

  it("as alternativas continuam íntegras", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
