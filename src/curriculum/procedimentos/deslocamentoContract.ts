import {
  Conta, alternativas, falaDaPromocao, materialDe, mostraMaterial, resolver,
} from "./deslocamentoProcedure";

/**
 * Contrato da tela de N4.08 — ficha F67.
 *
 * **O material mostra o número ANTES da operação.** Contar 2 barras e 3
 * cubinhos dá 23, que é o que se multiplica — não 230, que é a resposta. O
 * apoio deixa a criança ver de onde as peças partem; a promoção acontece na
 * cabeça dela, e só é mostrada na recapitulação.
 */

export interface MaterialSpec {
  centenas: number;
  dezenas: number;
  unidades: number;
  /** Rótulo falado, sem dizer o resultado. */
  descricao: string;
}

export interface DeslocamentoSpec {
  pergunta: string;
  falado: string;
  /** Níveis 1 e 2: o material do número de partida. */
  material: MaterialSpec | null;
  /** A dica da promoção, em palavras, sem números. */
  promocao: string | null;
  alternativas: { valor: number; tag: string }[];
  resposta: number;
  /** A conta fechada — só depois de responder. */
  recapitulacao: string;
}

function descrever({ centenas, dezenas, unidades }: ReturnType<typeof materialDe>): string {
  const partes: string[] = [];
  if (centenas) partes.push(`${centenas} ${centenas === 1 ? "placa" : "placas"}`);
  if (dezenas) partes.push(`${dezenas} ${dezenas === 1 ? "barra" : "barras"}`);
  if (unidades) partes.push(`${unidades} ${unidades === 1 ? "cubinho" : "cubinhos"}`);
  return partes.join(", ");
}

export function construirDeslocamentoSpec(c: Conta, nivel: number): DeslocamentoSpec {
  const material = materialDe(c.numero);
  const promocao = falaDaPromocao(c.multiplicador);
  return {
    pergunta: `${c.numero} × ${c.multiplicador}`,
    falado: `${c.numero} vezes ${c.multiplicador}`,
    material: mostraMaterial(nivel)
      ? { ...material, descricao: descrever(material) }
      : null,
    promocao: mostraMaterial(nivel) && promocao ? promocao : null,
    alternativas: alternativas(c).map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: resolver(c),
    recapitulacao: `${c.numero} × ${c.multiplicador} = ${resolver(c)}`,
  };
}

/** O que a tela mostra na hora da pergunta contém a resposta? */
export function enunciadoNaoRevela(spec: DeslocamentoSpec): boolean {
  const visivel = [spec.pergunta, spec.falado, spec.material?.descricao, spec.promocao]
    .filter(Boolean).join(" ");
  const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
  return !numeros.includes(spec.resposta);
}
