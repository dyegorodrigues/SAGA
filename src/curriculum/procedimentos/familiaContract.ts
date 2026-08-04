import {
  Familia,
  VerticeOculto,
  alternativas,
  contaEmAberto,
  contasDeApoio,
  operacaoDe,
  produto,
  quatroContas,
  resolver,
} from "./familiaProcedure";

/**
 * Contrato da tela de N4.06 — ficha F96, o triângulo multiplicativo.
 *
 * **O vértice oculto não carrega valor.** O `NumberBond` recebe `'?'` naquele
 * lugar, literalmente — o componente não consegue mostrar a resposta porque ela
 * não chega até ele. Mesma regra do `BarSlot` em N3.10.
 *
 * As contas de apoio vêm **todas mascaradas**. Elas ensinam a ESTRUTURA (os
 * mesmos três números fazem quatro frases) sem entregar resultado: escrever
 * `4 × 3 = 12` ao lado de `3 × 4 = ?` seria dar o gabarito.
 */

export interface TrianguloSpec {
  /** O topo: o produto, ou `'?'` quando é ele que se pergunta. */
  topo: number | "?";
  esquerda: number | "?";
  direita: number | "?";
}

export interface FamiliaSpec {
  pergunta: string;
  falado: string;
  triangulo: TrianguloSpec;
  /** As outras frases da família, com o resultado sempre mascarado. */
  apoio: string[];
  alternativas: { valor: number; tag: string }[];
  resposta: number;
  operacao: "multiplicacao" | "divisao";
  /** As quatro contas resolvidas — só na recapitulação, depois de responder. */
  recapitulacao: string[];
}

function mascarar(conta: string): string {
  return `${conta.split("=")[0].trim()} = ?`;
}

function porExtenso(f: Familia, vertice: VerticeOculto): string {
  const p = produto(f);
  if (vertice === "produto") return `${f.a} vezes ${f.b}`;
  return vertice === "fatorA" ? `${p} dividido por ${f.b}` : `${p} dividido por ${f.a}`;
}

export function construirFamiliaSpec(
  f: Familia,
  vertice: VerticeOculto,
  nivel: number,
): FamiliaSpec {
  const pergunta = contaEmAberto(f, vertice);
  const quantas = contasDeApoio(nivel);

  return {
    pergunta,
    falado: porExtenso(f, vertice),
    triangulo: {
      topo: vertice === "produto" ? "?" : produto(f),
      esquerda: vertice === "fatorA" ? "?" : f.a,
      direita: vertice === "fatorB" ? "?" : f.b,
    },
    // Mascarar o resultado NÃO basta: numa pergunta pelo produto, as divisões
    // da família soletram esse produto do lado esquerdo — `14 ÷ 7 = ?` entrega
    // o 14 que se perguntava. O apoio precisa ser filtrado pelo NÚMERO, não só
    // pelo formato. Ver Padrão Ouro §6.20.
    apoio: quatroContas(f).map(mascarar)
      .filter(c => c !== pergunta)
      .filter(c => !(c.match(/\d+/g) ?? []).map(Number).includes(resolver(f, vertice)))
      .slice(0, quantas),
    alternativas: alternativas(f, vertice).map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: resolver(f, vertice),
    operacao: operacaoDe(vertice),
    recapitulacao: quatroContas(f),
  };
}

/** O que a tela mostra na hora da pergunta contém a resposta? */
export function enunciadoNaoRevela(spec: FamiliaSpec): boolean {
  const visivel = [spec.pergunta, spec.falado, ...spec.apoio,
    String(spec.triangulo.topo), String(spec.triangulo.esquerda),
    String(spec.triangulo.direita)].join(" ");
  const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
  return !numeros.includes(spec.resposta);
}
