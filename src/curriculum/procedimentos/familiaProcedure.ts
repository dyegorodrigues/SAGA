import { MisconceptionTag } from "../../constants/misconceptions";
import { Distrator } from "./tabuadaProcedure";

/**
 * Procedimento da família multiplicativa — ficha F96, competência N4.06.
 *
 * Três números formam uma família: 3, 4 e 12 dizem `3×4=12`, `4×3=12`,
 * `12÷3=4` e `12÷4=3`.
 *
 * **Por que isso corta o trabalho pela metade:** quem entende a família **não
 * precisa decorar a tabuada de divisão**. Sabendo 6×7=42, deduz 42÷7=6. É o
 * mesmo princípio da família aditiva, um nível acima.
 */

export interface Familia {
  /** Os dois fatores. */
  a: number;
  b: number;
}

/** Qual vértice do triângulo está oculto — e portanto qual operação se pede. */
export type VerticeOculto = "produto" | "fatorA" | "fatorB";

export const PRODUTO_MAX = 100;
export const FATOR_MIN = 2;
export const FATOR_MAX = 10;

export function produto({ a, b }: Familia): number {
  return a * b;
}

/** Multiplicação quando falta o topo; divisão quando falta uma base. */
export function operacaoDe(vertice: VerticeOculto): "multiplicacao" | "divisao" {
  return vertice === "produto" ? "multiplicacao" : "divisao";
}

export function resolver(f: Familia, vertice: VerticeOculto): number {
  switch (vertice) {
    case "produto": return produto(f);
    case "fatorA": return f.a;
    case "fatorB": return f.b;
  }
}

/** As quatro sentenças que os mesmos três números produzem. */
export function quatroContas(f: Familia): string[] {
  const p = produto(f);
  return [`${f.a} × ${f.b} = ${p}`, `${f.b} × ${f.a} = ${p}`,
          `${p} ÷ ${f.a} = ${f.b}`, `${p} ÷ ${f.b} = ${f.a}`];
}

/** A conta que a pergunta faz, com o resultado ausente. */
export function contaEmAberto(f: Familia, vertice: VerticeOculto): string {
  const p = produto(f);
  if (vertice === "produto") return `${f.a} × ${f.b} = ?`;
  if (vertice === "fatorA") return `${p} ÷ ${f.b} = ?`;
  return `${p} ÷ ${f.a} = ?`;
}

/** Quais vértices o nível pode ocultar. A divisão entra no 3. */
export function verticesDoNivel(nivel: number): VerticeOculto[] {
  switch (nivel) {
    case 1:
    case 2: return ["produto"];
    case 3: return ["produto", "fatorA", "fatorB"];
    case 4: return ["produto", "fatorA", "fatorB"];
    default: return ["fatorA", "fatorB"];
  }
}

/**
 * Quantas contas da família aparecem como apoio, **todas com o resultado
 * mascarado**.
 *
 * Elas mostram a ESTRUTURA — que os mesmos três números fazem quatro frases —
 * sem entregar nenhum resultado. Escrever `4 × 3 = 12` ao lado de `3 × 4 = ?`
 * seria dar a resposta com aparência de apoio.
 */
/**
 * CLASS-001 — o apoio é exigido só de quem pode tê-lo.
 *
 * O nível 3 promete "passar da multiplicação para a divisão dentro da mesma
 * família", e nunca entregava uma divisão. A causa era esta: o filtro cobrava
 * apoio de TODA candidata, e uma pergunta de divisão não sobra frase de apoio
 * nenhuma — as outras três contas da família contêm o fator que é a resposta, e
 * mostrá-las seria escrever o gabarito ao lado da pergunta.
 *
 * O resultado é que o L3 caía sempre no vértice `produto` e virava uma cópia
 * exata do L2: mesma semente, mesma tela. O degrau existia no papel.
 *
 * Agora o apoio é condição de quem pergunta o PRODUTO. A divisão do L3 aparece
 * sem apoio, que é justamente o passo que o nível declara — e continua distinta
 * do L4, onde nem a multiplicação tem apoio.
 */
export function exigeApoio(nivel: number, vertice: VerticeOculto): boolean {
  return contasDeApoio(nivel) > 0 && vertice === "produto";
}

export function contasDeApoio(nivel: number): number {
  if (nivel === 1) return 4;
  if (nivel === 2 || nivel === 3) return 2;
  return 0;
}

/** O teto de produto por nível: o nível 1 fica até 20, como manda a ficha. */
export function produtoMaximoDoNivel(nivel: number): number {
  return nivel === 1 ? 20 : PRODUTO_MAX;
}

const MAX_DISTRATORES = 3;

/**
 * Erros com significado.
 *
 * `INVERTE_DIVISAO` é o erro assinatura desta ficha: em `12 ÷ 3`, responder 3 —
 * devolver o divisor que está à vista em vez do quociente. É o sinal de quem
 * ainda não enxerga a família e está lendo números da tela.
 */
export function distratores(f: Familia, vertice: VerticeOculto): Distrator[] {
  const certo = resolver(f, vertice);
  const p = produto(f);
  const candidatos: Distrator[] = vertice === "produto"
    ? [
        { valor: f.a + f.b, tag: MisconceptionTag.SOMA_OS_FATORES },
        { valor: p - f.a, tag: MisconceptionTag.TABUADA_TROCADA },
        { valor: p + f.a, tag: MisconceptionTag.TABUADA_TROCADA },
      ]
    : [
        // O divisor visível, devolvido no lugar do quociente.
        { valor: vertice === "fatorA" ? f.b : f.a, tag: MisconceptionTag.INVERTE_DIVISAO },
        // Subtraiu em vez de dividir.
        { valor: p - (vertice === "fatorA" ? f.b : f.a), tag: MisconceptionTag.DIVIDE_SUBTRAINDO },
        { valor: certo + 1, tag: MisconceptionTag.OFF_BY_ONE },
      ];

  const vistos = new Set<number>([certo]);
  return candidatos
    .filter(d => {
      if (d.valor <= 0) return false;
      if (vistos.has(d.valor)) return false;
      vistos.add(d.valor);
      return true;
    })
    .slice(0, MAX_DISTRATORES);
}

/**
 * Serve para perguntar?
 *
 * Recusa fatores iguais quando o vértice oculto é uma base: em `9 ÷ 3`, com
 * a família 3-3-9, o divisor visível JÁ É a resposta, e o erro de inverter a
 * divisão acertaria por sorte.
 */
export function ehPergunavelComDiagnostico(f: Familia, vertice: VerticeOculto): boolean {
  if (f.a < FATOR_MIN || f.b < FATOR_MIN) return false;
  if (vertice !== "produto" && f.a === f.b) return false;
  if (produto(f) === f.a + f.b) return false;
  return distratores(f, vertice).length >= 2;
}

export function alternativas(f: Familia, vertice: VerticeOculto): Distrator[] {
  return [{ valor: resolver(f, vertice), tag: "" }, ...distratores(f, vertice)];
}
