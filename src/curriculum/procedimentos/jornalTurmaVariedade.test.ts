import { afterEach, describe, expect, it } from "vitest";
import { construirJornalTurmaSpec } from "./jornalTurmaContract";

/**
 * CLASS-003, segunda dimensão — PE.02/F64.
 *
 * A pesquisa da turma era uma só: Livros/Jogos/Música com os mesmos votos em
 * todo nível, e "Jogos" sempre a barra perguntada. A resposta certa era 8, 
 * "Jogos", 7, 9 e "azul" — nessa ordem, para sempre. A ficha cobra 3 acertos
 * de 3 em 2 sessões: decorar cinco rótulos vencia a competência inteira.
 *
 * A escada NÃO é o que muda. Cada nível continua com o seu modo e a sua
 * escala: ler uma barra, comparar barras, completar a que falta, construir com
 * escala 3 e por fim ler probabilidade. O que passa a variar é a pesquisa.
 */
const AMOSTRAS = 60;
const original = Math.random;
afterEach(() => { Math.random = original; });
function semear(semente: number): void {
  let estado = semente >>> 0;
  Math.random = () => { estado = (estado * 1664525 + 1013904223) >>> 0; return estado / 0x100000000; };
}
function amostrar(nivel: number, semente = 0x4b3ce07) {
  semear(semente);
  return Array.from({ length: AMOSTRAS }, () => construirJornalTurmaSpec(nivel));
}

describe("CLASS-003 — PE.02/F64: a pesquisa muda, a escada não", () => {
  it("nenhum nível responde sempre a mesma coisa nem pergunta sempre a mesma categoria", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      const specs = amostrar(nivel);
      expect(new Set(specs.map(s => String(s.resposta))).size, `L${nivel} responde sempre ${specs[0].resposta}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.perguntada)).size, `L${nivel} pergunta sempre ${specs[0].perguntada}`).toBeGreaterThan(1);
      // A POSIÇÃO da barra perguntada também. Sortear só o tema faria o nome
      // mudar com a barra do meio sempre sendo a perguntada — a criança
      // aprenderia a olhar a do meio, que é decorar de novo, um degrau abaixo.
      expect(new Set(specs.map(s => s.categorias.indexOf(s.perguntada))).size,
        `L${nivel} pergunta sempre a barra da posição ${specs[0].categorias.indexOf(specs[0].perguntada)}`).toBeGreaterThan(1);
      expect(new Set(specs.map(s => s.categorias.join("/"))).size, `L${nivel} usa sempre as mesmas categorias`).toBeGreaterThan(1);
    }
  });

  it("o modo e a escala de cada nível continuam fixos", () => {
    const modos = ["ler-barra", "comparar-barras", "completar-barra", "construir-grafico", "probabilidade"];
    const escalas = [2, 2, 1, 3, 1];
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.modo).toBe(modos[nivel - 1]);
        expect(spec.escala, `L${nivel} mexeu na escala, que é o degrau`).toBe(escalas[nivel - 1]);
      }
    }
  });

  it("a tabela desenhada diz o que o enunciado promete", () => {
    // O caso fixo carregava uma incoerência: em L3 a tabela na tela mostrava 0
    // para a barra que falta, enquanto o enunciado afirmava "a tabela diz 7".
    // O palco desenha tabela e barras do mesmo array, então a criança lia zero
    // e o texto prometia sete. Agora o dado e a barra são campos diferentes: a
    // barra que falta vem zerada, o dado não.
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        expect(spec.tabela.length).toBe(spec.categorias.length);
        expect(spec.valores.length).toBe(spec.categorias.length);
        const i = spec.categorias.indexOf(spec.perguntada);
        expect(i, `${spec.perguntada} não está entre as categorias`).toBeGreaterThanOrEqual(0);
        if (spec.modo === "completar-barra") {
          expect(spec.valores[i], "a barra a completar precisa estar vazia").toBe(0);
          expect(spec.tabela[i], "o dado da barra que falta é o que o enunciado promete").toBe(spec.resposta);
        } else {
          expect(spec.tabela).toEqual(spec.valores);
        }
      }
    }
  });

  it("os valores respeitam a escala do nível e a barra perguntada é única", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        for (const valor of spec.tabela) {
          expect(valor % spec.escala, `L${nivel}: ${valor} não é múltiplo da escala ${spec.escala}`).toBe(0);
          expect(valor, `L${nivel} com barra vazia na tabela`).toBeGreaterThan(0);
        }
        expect(new Set(spec.tabela).size, `L${nivel} repetiu valor: a maior barra deixa de ser única`).toBe(spec.tabela.length);
      }
    }
    // Comparar e probabilidade respondem POR categoria: a perguntada é a maior.
    for (const nivel of [2, 5]) {
      for (const spec of amostrar(nivel)) {
        const maior = Math.max(...spec.tabela);
        expect(spec.tabela[spec.categorias.indexOf(spec.perguntada)], `L${nivel}: a resposta não é a maior barra`).toBe(maior);
        expect(spec.resposta).toBe(spec.perguntada);
      }
    }
  });

  it("as alternativas continuam íntegras e cada erro continua nomeado", () => {
    for (const nivel of [1, 2, 3, 4, 5]) {
      for (const spec of amostrar(nivel)) {
        const valores = spec.opcoes.map(o => String(o.value));
        expect(new Set(valores).size, `L${nivel} repetiu valor`).toBe(valores.length);
        expect(valores.filter(v => v === String(spec.resposta)).length, `L${nivel} sem resposta única`).toBe(1);
        expect(spec.opcoes.filter(o => !o.misconception).length, `L${nivel} sem alternativa certa única`).toBe(1);
        expect(spec.opcoes.length, `L${nivel} perdeu alternativa por colisão`).toBe(3);
      }
    }
  });
});
