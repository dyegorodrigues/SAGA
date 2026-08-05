import { Distrator } from "./tabuadaProcedure";
import {
  ANCORA,
  Decomposicao,
  ESTRATEGIA_DE,
  NOME_DA_ESTRATEGIA,
  alternativasPara,
  dobroAncora,
  ehPorDecomposicao,
  mostraArranjo,
  mostraDecomposicaoEscrita,
  passos,
  resolver,
} from "./decomposicaoProcedure";

/**
 * Contrato da tela de decomposição — N4.04, ficha F43.
 *
 * A regra que governa esta ficha, e que quase passou despercebida:
 *
 * > **A decomposição escrita mostra a ÂNCORA, nunca o resultado.**
 *
 * A ficha pede "×4 com a decomposição escrita" no nível 2, e a decomposição
 * completa é `7 × 2 = 14` e `14 × 2 = 28` — que contém a resposta. Escrever as
 * duas linhas na hora da pergunta seria dar o gabarito com aparência de apoio.
 *
 * O andaime correto é o primeiro passo completo e o segundo **em aberto**: a
 * criança recebe o fato que já sabe e precisa completar a estratégia. A
 * decomposição inteira só aparece na recapitulação, depois da resposta.
 *
 * Mesma família da regra do `BarSlot` sem valor em N3.10: o componente não
 * consegue vazar a resposta porque ela não chega até ele.
 */

/** O arranjo do dobro — o fato conhecido, que a criança pode contar à vontade. */
export interface AncoraSpec {
  linhas: number;
  colunas: number;
  valor: number;
  descricao: string;
}

export interface DecomposicaoEscritaSpec {
  /** O passo já resolvido: `7 × 2 = 14`. */
  ancora: string;
  /** O passo a completar, com o resultado ausente: `14 × 2 = ?`. */
  emAberto: string;
  /** Nome da estratégia, para a fala do tutor. */
  estrategia: string;
}

export interface DecomposicaoSpec {
  pergunta: string;
  falado: string;
  /** Níveis 1 e 3: o arranjo do dobro, que se duplica depois da resposta. */
  ancoraVisual: AncoraSpec | null;
  /** Nível 2: a âncora escrita e o passo em aberto. */
  escrita: DecomposicaoEscritaSpec | null;
  alternativas: { valor: number; tag: string }[];
  resposta: number;
  /** Os dois passos completos — só para a recapitulação, depois de responder. */
  recapitulacao: string[];
}

function porExtenso(tabuada: number, vezes: number): string {
  return `${tabuada} vezes ${vezes}`;
}

export function construirAncoraVisual(d: Decomposicao): AncoraSpec {
  return {
    linhas: d.vezes,
    colunas: ANCORA,
    valor: dobroAncora(d),
    // Descreve a forma do DOBRO, que não é a resposta: contar aqui é legítimo.
    descricao: `${d.vezes} fileiras de ${ANCORA}`,
  };
}

export function construirEscrita(d: Decomposicao): DecomposicaoEscritaSpec {
  const [primeiro, segundo] = passos(d);
  return {
    ancora: primeiro.conta,
    // Corta no "=" e deixa o resultado fora. O componente não recebe o número.
    emAberto: `${segundo.conta.split("=")[0].trim()} = ?`,
    estrategia: NOME_DA_ESTRATEGIA[ESTRATEGIA_DE[d.tabuada]],
  };
}

export function construirDecomposicaoSpec(
  tabuada: number,
  vezes: number,
  nivel: number,
): DecomposicaoSpec {
  const alternativas: Distrator[] = alternativasPara(tabuada, vezes);
  const resposta = alternativas[0].valor;

  // ×2, ×5 e ×10 aparecem no nível 5 e não se decompõem: entram sem andaime,
  // que é o que a fluência final pede de qualquer forma.
  const decomponivel = ehPorDecomposicao(tabuada) ? { tabuada, vezes } : null;

  return {
    pergunta: `${tabuada} × ${vezes}`,
    falado: porExtenso(tabuada, vezes),
    ancoraVisual: decomponivel && mostraArranjo(nivel)
      ? construirAncoraVisual(decomponivel) : null,
    escrita: decomponivel && mostraDecomposicaoEscrita(nivel)
      ? construirEscrita(decomponivel) : null,
    alternativas: alternativas.map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: decomponivel ? resolver(decomponivel) : resposta,
    recapitulacao: decomponivel ? passos(decomponivel).map(p => p.conta) : [],
  };
}

/** O que a tela mostra na hora da pergunta contém a resposta? */
export function enunciadoNaoRevela(spec: DecomposicaoSpec): boolean {
  const visivel = [
    spec.pergunta,
    spec.falado,
    spec.ancoraVisual?.descricao,
    spec.escrita?.ancora,
    spec.escrita?.emAberto,
  ].filter(Boolean).join(" ");
  const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
  return !numeros.includes(spec.resposta);
}

/** A recapitulação, que vem DEPOIS da resposta, fecha a estratégia? */
export function recapitulacaoFechaAConta(spec: DecomposicaoSpec): boolean {
  if (!spec.recapitulacao.length) return true;
  return spec.recapitulacao[spec.recapitulacao.length - 1].endsWith(String(spec.resposta));
}
