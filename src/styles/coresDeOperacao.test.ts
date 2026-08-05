import { describe, expect, it } from "vitest";
import { INVERSA, OPERACAO, Operacao } from "./coresDeOperacao";

/**
 * O padrão de cor por operação só é seguro sob três condições, e as três são
 * verificadas aqui em vez de confiadas ao bom senso de quem mexer depois.
 */

const OPERACOES = Object.keys(OPERACAO) as Operacao[];

/** Luminância relativa, conforme a fórmula do WCAG. */
function luminancia(hex: string): number {
  const canais = [1, 3, 5]
    .map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
}

const contrasteNoBranco = (hex: string) => 1.05 / (luminancia(hex) + 0.05);

/** Simulação de deuteranopia — o daltonismo mais comum. */
function comoDaltonicoVe(hex: string): [number, number, number] {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return [
    0.625 * r + 0.375 * g,
    0.700 * r + 0.300 * g,
    0.300 * g + 0.700 * b,
  ];
}

const distancia = (a: number[], b: number[]) =>
  Math.hypot(...a.map((v, i) => v - b[i]));

describe("a cor nunca carrega o significado sozinha", () => {
  it("toda operação declara um símbolo — a informação de verdade", () => {
    for (const op of OPERACOES) {
      expect(OPERACAO[op].simbolo, op).toBeTruthy();
    }
  });

  it("os quatro símbolos são distintos entre si", () => {
    const simbolos = OPERACOES.map(op => OPERACAO[op].simbolo);
    expect(new Set(simbolos).size).toBe(4);
  });

  it("toda operação declara também o verbo falado, para quem não lê nem enxerga cor", () => {
    for (const op of OPERACOES) {
      expect(OPERACAO[op].verbo, op).toBeTruthy();
    }
  });
});

describe("as cores são legíveis de verdade", () => {
  it("todas passam o mínimo de contraste do WCAG sobre branco", () => {
    for (const op of OPERACOES) {
      const razao = contrasteNoBranco(OPERACAO[op].cor);
      expect(razao, `${op} (${OPERACAO[op].cor}) = ${razao.toFixed(2)}:1`)
        .toBeGreaterThanOrEqual(4.5);
    }
  });

  it("as quatro se distinguem para quem tem daltonismo", () => {
    // Limiar de 60: abaixo disso duas cores passam a colidir na simulação.
    for (let i = 0; i < OPERACOES.length; i += 1) {
      for (let j = i + 1; j < OPERACOES.length; j += 1) {
        const d = distancia(
          comoDaltonicoVe(OPERACAO[OPERACOES[i]].cor),
          comoDaltonicoVe(OPERACAO[OPERACOES[j]].cor),
        );
        expect(d, `${OPERACOES[i]} × ${OPERACOES[j]} = ${d.toFixed(0)}`)
          .toBeGreaterThan(60);
      }
    }
  });

  it("nenhuma operação é vermelha de reprovação", () => {
    // O cânone §11.6 proíbe vermelho de reprovação em tela de criança.
    // Subtrair não é errado. Medindo por MATIZ, não por "tem muito vermelho":
    // laranja queimado tem canal vermelho alto e não é vermelho.
    for (const op of OPERACOES) {
      const [r, g, b] = [1, 3, 5].map(i => parseInt(OPERACAO[op].cor.slice(i, i + 2), 16));
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const matiz = max === min ? 0
        : max === r ? ((60 * ((g - b) / (max - min))) + 360) % 360
        : max === g ? 60 * ((b - r) / (max - min)) + 120
        : 60 * ((r - g) / (max - min)) + 240;
      const ehVermelho = matiz < 15 || matiz > 345;
      expect(ehVermelho, `${op} tem matiz ${matiz.toFixed(0)}°, que é vermelho`).toBe(false);
    }
  });

  it("nenhuma operação repete uma cor de FEEDBACK", () => {
    // O app usa verde para acerto e laranja para erro suave. Operação e
    // feedback vivem em elementos diferentes — a figura contra o anel da
    // resposta — e nunca disputam o mesmo lugar. Mas repetir a cor exata faria
    // a criança ler "certo" numa figura que só diz "isto é uma soma".
    const FEEDBACK = { acerto: "#22c55e", erro_suave: "#f97316" };
    for (const op of OPERACOES) {
      for (const [nome, hex] of Object.entries(FEEDBACK)) {
        const d = distancia(
          [1, 3, 5].map(i => parseInt(OPERACAO[op].cor.slice(i, i + 2), 16)),
          [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)),
        );
        expect(d, `${op} está a ${d.toFixed(0)} da cor de ${nome}`).toBeGreaterThan(70);
      }
    }
  });
});

describe("as inversas se apontam", () => {
  it("somar desfaz subtraindo, e multiplicar desfaz dividindo", () => {
    expect(INVERSA.adicao).toBe("subtracao");
    expect(INVERSA.subtracao).toBe("adicao");
    expect(INVERSA.multiplicacao).toBe("divisao");
    expect(INVERSA.divisao).toBe("multiplicacao");
  });

  it("a inversa da inversa é ela mesma, sem exceção", () => {
    for (const op of OPERACOES) {
      expect(INVERSA[INVERSA[op]], op).toBe(op);
    }
  });
});
