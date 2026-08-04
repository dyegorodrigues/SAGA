import {
  Conta,
  ESTRATEGIA_DE,
  alternativas,
  ehTabuadaDificil,
  mostraEstrategia,
  passos,
  resolver,
  valorDaAncora,
} from "./ancoraProcedure";

/**
 * Contrato da tela de N4.07 — ficha F44.
 *
 * Mesma regra que governa N4.04, e vale repeti-la porque é onde esta ficha
 * escorregaria: **o apoio mostra a âncora, nunca o resultado.** A decomposição
 * completa de 7×9 é `7 × 10 = 70` e `70 − 7 = 63`; escrever as duas linhas na
 * hora da pergunta seria dar o gabarito com aparência de andaime.
 *
 * O que a criança recebe é o fato fácil resolvido e o ajuste **em aberto**.
 */

/** O arranjo do fato fácil, com a coluna do ajuste marcada. */
export interface AncoraVisualSpec {
  linhas: number;
  colunas: number;
  /** Colunas a remover, contadas do fim. Zero quando a estratégia é dobrar. */
  colunasQueSaem: number;
  descricao: string;
}

export interface EstrategiaEscritaSpec {
  /** O passo já resolvido: `7 × 10 = 70`. */
  ancora: string;
  /** O ajuste a completar, sem resultado: `70 − 7 = ?`. */
  emAberto: string;
  /** Como a voz nomeia a estratégia. */
  nome: string;
}

export interface AncoraSpec {
  pergunta: string;
  falado: string;
  visual: AncoraVisualSpec | null;
  escrita: EstrategiaEscritaSpec | null;
  alternativas: { valor: number; tag: string }[];
  resposta: number;
  /** Os dois passos completos — só depois de responder. */
  recapitulacao: string[];
}

export function construirVisual(c: Conta): AncoraVisualSpec {
  const { ancora, ajuste } = ESTRATEGIA_DE[c.tabuada];
  const colunasQueSaem = ajuste.tipo === "tirar_grupos" ? ajuste.grupos : 0;
  return {
    linhas: c.vezes,
    colunas: ancora,
    colunasQueSaem,
    // Descreve o fato FÁCIL, cujo total não é a resposta.
    descricao: `${c.vezes} fileiras de ${ancora}`,
  };
}

export function construirEscrita(c: Conta): EstrategiaEscritaSpec {
  const [primeiro, segundo] = passos(c);
  return {
    ancora: primeiro.conta,
    emAberto: `${segundo.conta.split("=")[0].trim()} = ?`,
    nome: ESTRATEGIA_DE[c.tabuada].nome,
  };
}

export function construirAncoraSpec(
  tabuada: number,
  vezes: number,
  nivel: number,
): AncoraSpec {
  // No nível 5 entram as tabuadas já dominadas, que não têm estratégia de
  // âncora. Elas aparecem sem andaime — que é o que a fluência final pede.
  const dificil = ehTabuadaDificil(tabuada) ? { tabuada, vezes } as Conta : null;
  const resposta = tabuada * vezes;

  if (!dificil) {
    return {
      pergunta: `${tabuada} × ${vezes}`,
      falado: `${tabuada} vezes ${vezes}`,
      visual: null,
      escrita: null,
      alternativas: [
        { valor: resposta, tag: "" },
        { valor: resposta - vezes, tag: "tabuada-trocada" },
        { valor: resposta + vezes, tag: "tabuada-trocada" },
        { valor: tabuada + vezes, tag: "soma-os-fatores" },
      ].filter((a, i, todas) => a.valor > 0
        && todas.findIndex(o => o.valor === a.valor) === i),
      resposta,
      recapitulacao: [],
    };
  }

  return {
    pergunta: `${tabuada} × ${vezes}`,
    falado: `${tabuada} vezes ${vezes}`,
    visual: mostraEstrategia(nivel) ? construirVisual(dificil) : null,
    escrita: mostraEstrategia(nivel) ? construirEscrita(dificil) : null,
    alternativas: alternativas(dificil).map(a => ({ valor: a.valor, tag: a.tag })),
    resposta: resolver(dificil),
    recapitulacao: passos(dificil).map(p => p.conta),
  };
}

/** O que a tela mostra na hora da pergunta contém a resposta? */
export function enunciadoNaoRevela(spec: AncoraSpec): boolean {
  const visivel = [spec.pergunta, spec.falado, spec.visual?.descricao,
    spec.escrita?.ancora, spec.escrita?.emAberto].filter(Boolean).join(" ");
  const numeros = (visivel.match(/\d+/g) ?? []).map(Number);
  return !numeros.includes(spec.resposta);
}

/** O valor da âncora, que a tela mostra, nunca é a própria resposta. */
export function ancoraNaoEhAResposta(spec: AncoraSpec, c: Conta): boolean {
  return valorDaAncora(c) !== spec.resposta;
}
