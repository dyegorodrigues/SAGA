import {
  Multiplicacao,
  TabuadaComPadrao,
  alternativas,
  mostraArranjo,
  mostraQuadroDeCem,
  mostraSaltos,
  multiplosAteCem,
  resolver,
  saltosDe,
} from "./tabuadaProcedure";

/**
 * Contrato da tela de tabuadas — o que o componente recebe, e nada além.
 *
 * Duas descrições **independentes de propósito**, como em N3.10:
 * `ArranjoSpec` mostra a multiplicação como forma; `QuadroSpec` mostra o padrão
 * como regularidade. Uma não deriva da outra, e cada nível liga ou desliga as
 * duas separadamente.
 */

/** O arranjo retangular: a multiplicação vista como forma. */
export interface ArranjoSpec {
  linhas: number;
  colunas: number;
  /** Rótulo falado, para quem não lê. */
  descricao: string;
}

/**
 * O quadro de 100 com os múltiplos pintados.
 *
 * **Não existe campo que aponte a resposta.** Pintar os 20 múltiplos de 5 mostra
 * o padrão sem dizer qual deles é 5×4 — mas destacar UM diria. O destaque existe
 * só depois do erro, em `QuadroSpec.destacado`, montado por outro caminho.
 */
export interface QuadroSpec {
  tabuada: TabuadaComPadrao;
  multiplosPintados: number[];
  /** O que a criança deve perceber sozinha, dito só na recapitulação. */
  padrao: string;
}

/**
 * Os saltos na reta: contar de dez em dez até chegar.
 *
 * Traz `ate` porque a reta precisa saber onde terminar de desenhar. Isso mostra
 * onde a contagem chega — e é exatamente o que o nível 1 quer ensinar: a
 * estratégia, com apoio alto, antes de qualquer padrão.
 */
export interface SaltosSpec {
  passo: number;
  saltos: { de: number; para: number }[];
  ate: number;
  descricao: string;
}

export interface AlternativaSpec {
  valor: number;
  /** Vazia na alternativa correta; hipótese diagnóstica nas demais. */
  tag: string;
}

export interface TabuadaSpec {
  pergunta: string;
  falado: string;
  /** Ausente a partir do nível 4: o apoio concreto sai. */
  arranjo: ArranjoSpec | null;
  /** Só no nível 1: a estratégia de contagem saltada. */
  saltos: SaltosSpec | null;
  /** Níveis 2 e 3: o padrão como regularidade. */
  quadro: QuadroSpec | null;
  alternativas: AlternativaSpec[];
  resposta: number;
}

function porExtenso(m: Multiplicacao): string {
  return `${m.tabuada} vezes ${m.vezes}`;
}

export function construirArranjo(m: Multiplicacao): ArranjoSpec {
  return {
    linhas: m.vezes,
    colunas: m.tabuada,
    descricao: `${m.vezes} fileiras de ${m.tabuada}`,
  };
}

export function construirSaltos(m: Multiplicacao): SaltosSpec {
  const saltos = saltosDe(m);
  return {
    passo: m.tabuada,
    saltos,
    ate: saltos[saltos.length - 1].para,
    descricao: `${m.vezes} saltos de ${m.tabuada}`,
  };
}

export function construirQuadro(m: Multiplicacao, padrao: string): QuadroSpec {
  return {
    tabuada: m.tabuada,
    multiplosPintados: multiplosAteCem(m.tabuada),
    padrao,
  };
}

export function construirTabuadaSpec(
  m: Multiplicacao,
  nivel: number,
  padrao: string,
): TabuadaSpec {
  return {
    pergunta: `${m.tabuada} × ${m.vezes}`,
    falado: porExtenso(m),
    arranjo: mostraArranjo(nivel) ? construirArranjo(m) : null,
    saltos: mostraSaltos(nivel) ? construirSaltos(m) : null,
    quadro: mostraQuadroDeCem(nivel) ? construirQuadro(m, padrao) : null,
    alternativas: alternativas(m).map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: resolver(m),
  };
}

/** A resposta aparece exatamente uma vez entre as alternativas? */
export function respostaUnica(spec: TabuadaSpec): boolean {
  return spec.alternativas.filter(a => a.valor === spec.resposta).length === 1;
}

/**
 * O enunciado, sozinho, entrega a resposta?
 *
 * O arranjo pode ser contado — e deve, no nível 1: contar é a estratégia
 * concreta que a escada CPA pressupõe. O que não pode é a resposta aparecer
 * ESCRITA fora das alternativas.
 */
export function enunciadoNaoRevela(spec: TabuadaSpec): boolean {
  const texto = [spec.pergunta, spec.falado, spec.arranjo?.descricao, spec.saltos?.descricao]
    .filter(Boolean).join(" ");
  const numeros = (texto.match(/\d+/g) ?? []).map(Number);
  return !numeros.includes(spec.resposta);
}
