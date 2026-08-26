import { afterEach, describe, expect, it } from "vitest";
import { construirPoligonosSpec, conferenciasExigidasF79 } from "./poligonosContract";

/**
 * CLASS-003 — GE.07/F79.
 *
 * As figuras eram as mesmas por nível: um isósceles, um retângulo, o trio
 * paralelogramo/quadrado/losango, um quadrado e um losango. A ficha cobra 3
 * acertos de 3 em 2 sessões, e a frente da CLASS-007 pôs a conferência de
 * critérios na frente — a criança conferia as MESMAS figuras seis vezes.
 *
 * Variar só o giro não bastaria. A resposta continuaria sendo sempre
 * "isósceles" em L1 e sempre "losango e paralelogramo" em L5, e decorar o
 * rótulo venceria o nível — foi esse mesmo defeito que apareceu em GE.04, onde
 * "sim" acertava L3 e L4 para sempre. Por isso a CLASSE da figura também é
 * sorteada, e o desenho precisa acompanhar: um polígono que o SVG não sabe
 * distinguir viraria uma figura mentindo sobre si mesma.
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

function amostrar(nivel: number, semente = 0x2c74e01) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirPoligonosSpec(nivel));
}

describe("CLASS-003 — GE.07/F79: a figura muda, a escada não", () => {
  it("nenhum nível devolve sempre a mesma figura, nem sempre na mesma posição", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      const figuras = new Set(specs.map(s => `${s.figuras[0].familia}/${s.figuras[0].classeLados ?? ""}/${s.figuras[0].classeAngulos ?? ""}`));
      const giros = new Set(specs.map(s => s.figuras[0].giro));
      expect(figuras.size, `L${nivel} devolveu sempre a mesma figura`).toBeGreaterThan(1);
      expect(giros.size, `L${nivel} devolveu sempre o mesmo giro`).toBeGreaterThan(1);
    }
  });

  it("a resposta certa deixa de ser sempre o mesmo rótulo", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const respostas = new Set(amostrar(nivel).map(s => s.resposta));
      expect(respostas.size, `L${nivel} respondeu sempre "${[...respostas][0]}"`).toBeGreaterThan(1);
    }
  });

  it("o modo de cada nível continua fixo", () => {
    const modos = ["triangulos-lados", "triangulos-angulos", "quadrilateros", "hierarquia", "propriedades-combinadas"];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) expect(spec.modo).toBe(modos[nivel - 1]);
    }
  });

  it("os critérios descrevem a figura que está na tela, não outra", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const alvo = spec.figuras[0];
        expect(spec.criterios.length, `L${nivel} sem critérios`).toBeGreaterThan(0);
        expect(spec.criterios.some(c => c.includes(String(alvo.lados))), `L${nivel}: critérios não citam os ${alvo.lados} lados`).toBe(true);
        expect(conferenciasExigidasF79(spec)).toBe(spec.criterios.length * spec.figuras.length);

        // A propriedade que DEFINE a classe precisa estar entre os critérios.
        // Sem isto, os critérios podiam descrever o triângulo do distrator e a
        // conferência da CLASS-007 mediria a figura errada.
        const esperado = nivel === 1
          ? { 3: "3 lados iguais", 2: "2 lados iguais", 0: "nenhum lado igual" }[alvo.ladosIguais ?? 0]
          : nivel === 2
            ? (alvo.angulosRetos ? "1 ângulo reto" : alvo.classeAngulos === "obtusangulo" ? "1 ângulo obtuso" : "todos os ângulos agudos")
            : undefined;
        if (esperado) {
          expect(spec.criterios, `L${nivel}: critérios não descrevem ${alvo.classeLados}/${alvo.classeAngulos}`).toContain(esperado);
        }
        if (nivel >= 3) {
          if (alvo.ladosIguais === 4) expect(spec.criterios).toContain("4 lados iguais");
          if (alvo.angulosRetos === 4) expect(spec.criterios).toContain("4 ângulos retos");
        }
      }
    }
  });

  it("a cópia girada é a MESMA figura: é ela que desmente 'girou, mudou de classe'", () => {
    for (const nivel of [1, 2, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.figuras.length, `L${nivel} precisa da cópia girada`).toBeGreaterThanOrEqual(2);
        const [alvo, copia] = spec.figuras;
        expect(copia.familia).toBe(alvo.familia);
        expect(copia.lados).toBe(alvo.lados);
        expect(copia.classeLados).toBe(alvo.classeLados);
        expect(copia.classeAngulos).toBe(alvo.classeAngulos);
        expect(copia.giro, "a cópia precisa estar em outra orientação").not.toBe(alvo.giro);
      }
    }
  });

  it("o SVG sabe desenhar toda figura sorteada", () => {
    // O desenho distingue quadrado, paralelogramo, losango, retângulo e
    // triângulo retângulo. Sortear uma classe que caia no traço genérico faria
    // a figura mentir sobre si mesma.
    const desenhaveis = new Set(["quadrado", "paralelogramo", "losango", "retangulo"]);
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        for (const figura of spec.figuras) {
          const temTracoProprio = desenhaveis.has(figura.familia)
            || figura.classeAngulos === "retangulo"
            || figura.classeLados !== undefined;
          expect(temTracoProprio, `${figura.familia}/${figura.classeLados ?? "-"} cai no traço genérico`).toBe(true);
        }
      }
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => o.value);
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(new Set(spec.opcoes.map(o => o.label)).size, `L${nivel} repetiu rótulo`).toBe(valores.length);
        expect(valores.filter(v => v === spec.resposta).length, `L${nivel} sem resposta única`).toBe(1);
        const certas = spec.opcoes.filter(o => !o.misconception);
        expect(certas.length, `L${nivel} deveria ter uma alternativa certa`).toBe(1);
        expect(certas[0].value).toBe(spec.resposta);
        expect(spec.opcoes.length).toBeGreaterThanOrEqual(3);
        // A ficha declara três erros típicos; todo nível precisa oferecer ao
        // menos o de orientação, que é o que a cópia girada existe para medir.
        expect(spec.opcoes.some(o => o.misconception === "orientacao-fixa"), `L${nivel} sem distrator de orientação`).toBe(true);
      }
    }
  });
});
