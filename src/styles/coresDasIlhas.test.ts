import { describe, expect, it } from "vitest";
import { ALL_MATH_TRACKS } from "../curriculum/motores/curriculum";

/**
 * A cor de cada ilha do mapa — medida, não escolhida no olho.
 *
 * ## O que estava errado
 *
 * A paleta foi desenhada para seis ilhas e hoje há onze. As cinco que sobraram
 * foram encaixadas em cores já ocupadas. Medido antes deste teste existir:
 *
 * - **quatro pares de ilhas com a MESMA cor** (N1=N7, N2=PE, N5=GE, N6=AL) —
 *   distância zero, o mapa prometendo "cada ilha tem sua cor" e entregando
 *   gêmeas;
 * - mais quatro pares indistinguíveis sob daltonismo (distância 29);
 * - **sete dos onze rótulos reprovando contraste WCAG no branco** — o nome da
 *   competência, embaixo de cada nó, era literalmente difícil de ler. O pior
 *   ficava em 2,28:1, metade do mínimo.
 *
 * ## O que se cobra aqui
 *
 * O mesmo padrão de `coresDeOperacao.test.ts`: escolhida por curadoria,
 * verificada por medição, travada por teste.
 *
 * 1. **O rótulo é texto**, e texto tem piso duro: 4,5:1 no branco (WCAG AA).
 * 2. **Nenhuma ilha se parece com outra** em visão normal.
 * 3. **Sob deuteranopia** a exigência é menor, e o motivo é o mesmo da regra das
 *    operações: a cor **nunca carrega o significado sozinha**. Cada nó do mapa
 *    traz ícone, o código da competência, o nome e o estado escrito
 *    (`🔒 Travada`, `🔥 Fronteira`, `👑 Dominado`). A cor é reforço.
 * 4. **Nenhuma ilha vermelha.** Vermelho é cor de erro no SAGA; uma ilha
 *    vermelha ensinaria que aquela matéria é um problema.
 */

/** Piso WCAG AA para texto. Não se negocia: o rótulo é texto. */
const CONTRASTE_MINIMO = 4.5;
/** Duas ilhas nunca podem parecer a mesma para quem enxerga todas as cores. */
const SEPARACAO_MINIMA = 60;
/** Sob daltonismo, o piso é menor porque a cor é reforço e não a informação. */
const SEPARACAO_MINIMA_DALTONICA = 50;

const canal = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
const rgb = (hex: string): [number, number, number] => [canal(hex, 0), canal(hex, 1), canal(hex, 2)];

const linear = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminancia = (hex: string) => {
  const [r, g, b] = rgb(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};

const contrasteNoBranco = (hex: string) => 1.05 / (luminancia(hex) + 0.05);

/** Deuteranopia (Viénot, Brettel & Mollon) — a mesma família de matriz usada em ferramentas de acessibilidade. */
function souDaltonico(hex: string): [number, number, number] {
  const [r, g, b] = rgb(hex).map(linear);
  const destravar = (c: number) => {
    const v = Math.max(0, Math.min(1, c));
    return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  };
  return [destravar(0.625 * r + 0.375 * g), destravar(0.7 * r + 0.3 * g), destravar(0.3 * g + 0.7 * b)];
}

const distancia = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]));

/** As ilhas como o mapa realmente as usa — lidas das trilhas, não de uma cópia. */
function ilhas(): Array<{ id: string; color: string; dark: string }> {
  const porIlha = new Map<string, { id: string; color: string; dark: string }>();
  for (const t of ALL_MATH_TRACKS) {
    if (t.island && t.color && t.dark) porIlha.set(t.island, { id: t.island, color: t.color, dark: t.dark });
  }
  return [...porIlha.values()];
}

describe("as cores das ilhas do mapa", () => {
  it("a varredura enxerga todas as ilhas", () => {
    // Prova de vida: um teste que não achou ilha nenhuma passa calado.
    expect(ilhas().length, "o mapa precisa ter as onze ilhas").toBeGreaterThanOrEqual(11);
  });

  it("o nome da competência é legível — todo tom escuro passa no WCAG AA", () => {
    const ilegiveis = ilhas()
      .filter(i => contrasteNoBranco(i.dark) < CONTRASTE_MINIMO)
      .map(i => `${i.id}: ${i.dark} tem ${contrasteNoBranco(i.dark).toFixed(2)}:1 no branco`);
    expect(ilegiveis, `rótulos abaixo de ${CONTRASTE_MINIMO}:1:\n${ilegiveis.join("\n")}`).toEqual([]);
  });

  it("nenhuma ilha se parece com outra", () => {
    const gemeas: string[] = [];
    const lista = ilhas();
    for (let i = 0; i < lista.length; i += 1) {
      for (let j = i + 1; j < lista.length; j += 1) {
        const d = distancia(rgb(lista[i].color), rgb(lista[j].color));
        if (d < SEPARACAO_MINIMA) gemeas.push(`${lista[i].id} e ${lista[j].id}: ${d.toFixed(0)} (mínimo ${SEPARACAO_MINIMA})`);
      }
    }
    expect(gemeas, `ilhas com cores parecidas demais:\n${gemeas.join("\n")}`).toEqual([]);
  });

  it("sob daltonismo as ilhas continuam separáveis", () => {
    const juntas: string[] = [];
    const lista = ilhas();
    for (let i = 0; i < lista.length; i += 1) {
      for (let j = i + 1; j < lista.length; j += 1) {
        const d = distancia(souDaltonico(lista[i].color), souDaltonico(lista[j].color));
        if (d < SEPARACAO_MINIMA_DALTONICA) juntas.push(`${lista[i].id} e ${lista[j].id}: ${d.toFixed(0)}`);
      }
    }
    expect(juntas, `ilhas que colapsam sob deuteranopia:\n${juntas.join("\n")}`).toEqual([]);
  });

  it("nenhuma ilha é vermelha — vermelho é a cor do erro", () => {
    // Vermelho se define por MATIZ, não por "muito R e pouco G". Laranja tem
    // muito R e pouco G e é cor canônica da subtração — barrá-la seria proibir
    // o que o cânone já decidiu. A faixa proibida é a vizinhança de 0°.
    const vermelhas = ilhas()
      .filter(i => {
        const [r, g, b] = rgb(i.color).map(c => c / 255);
        const alto = Math.max(r, g, b);
        const baixo = Math.min(r, g, b);
        if (alto === baixo) return false;
        const saturacao = (alto - baixo) / alto;
        let matiz = 0;
        if (alto === r) matiz = 60 * (((g - b) / (alto - baixo)) % 6);
        else if (alto === g) matiz = 60 * ((b - r) / (alto - baixo) + 2);
        else matiz = 60 * ((r - g) / (alto - baixo) + 4);
        if (matiz < 0) matiz += 360;
        return saturacao > 0.45 && (matiz <= 14 || matiz >= 346);
      })
      .map(i => `${i.id}: ${i.color}`);
    expect(vermelhas, `ilhas vermelhas — colidem com o feedback de erro:\n${vermelhas.join("\n")}`).toEqual([]);
  });
});
