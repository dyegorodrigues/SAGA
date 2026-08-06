import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento da ficha **F49 — Maior, menor, mais alto** (GM.01).
 *
 * *"Comparar grandezas. E a regra de alinhar as bases."*
 *
 * ---
 *
 * ### ⚠️ A regra que quase todo material erra, e que a primitiva errava
 *
 * > *"As **bases precisam estar alinhadas na mesma linha horizontal**. Comparar
 * > altura com objetos flutuando em posições diferentes ensina errado — é o
 * > equivalente visual de comparar quantidade pelo espaço ocupado."*
 *
 * O `Grupo`, a primitiva que a §1 nomeia, usa `flex items-center`: os objetos
 * ficam **centralizados verticalmente**, cada um flutuando no meio da sua
 * caixa. Não havia linha de chão. Usá-lo como estava produziria exatamente a
 * tela que esta ficha existe para não produzir.
 *
 * E ele não estava ligado a lugar nenhum — quarta primitiva órfã do bloco,
 * depois do `AudioChoice`, do `TouchPlace` e do `ShapeCanvas`.
 *
 * ### O nó GM.01 não tinha gerador
 *
 * Não está em `curriculum.ts`. É uma competência de faixa F0, com duas fichas
 * escritas no cânone (F49 e F50), servida pelo fallback genérico.
 */

/** O atributo comparado. A §5 sobe por eles. */
export type Atributo = "altura" | "comprimento" | "tamanho";

/** O que a pergunta pede: o extremo de cima ou o de baixo. */
export type Polo = "maior" | "menor";

interface DegrauDaF49 {
  atributo: Atributo;
  /** Quão distante um do outro, em proporção. 0.45 é gritante; 0.12 é sutil. */
  diferenca: number;
  /** §5, nível 4: os dois objetos são coisas DIFERENTES. */
  objetosDiferentes: boolean;
  /** §5, nível 5: ordenar três — seriação. */
  seria: boolean;
  /** §4: a régua fantasma entra do nível 3 em diante. */
  reguaFantasma: boolean;
}

/**
 * §5 — os cinco níveis, transcritos.
 *
 * | Nível | Atributo | Dificuldade |
 * |---|---|---|
 * | 1 | alto/baixo, diferença grande | óbvia |
 * | 2 | comprido/curto | clara |
 * | 3 | **diferença pequena** | exige comparar com cuidado |
 * | 4 | **objetos diferentes** | ignora o tipo |
 * | 5 | **ordenar três ou mais** | seriação |
 *
 * > *"O nível 5 é seriação — ordenar três objetos exige comparações
 * > encadeadas, e é um marco cognitivo próprio."*
 */
const DEGRAUS: Record<number, DegrauDaF49> = {
  1: { atributo: "altura", diferenca: 0.45, objetosDiferentes: false, seria: false, reguaFantasma: false },
  2: { atributo: "comprimento", diferenca: 0.40, objetosDiferentes: false, seria: false, reguaFantasma: false },
  3: { atributo: "altura", diferenca: 0.14, objetosDiferentes: false, seria: false, reguaFantasma: true },
  4: { atributo: "altura", diferenca: 0.22, objetosDiferentes: true, seria: false, reguaFantasma: true },
  5: { atributo: "tamanho", diferenca: 0.20, objetosDiferentes: true, seria: true, reguaFantasma: true },
};

function degrau(nivel: number): DegrauDaF49 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const atributoDoNivel = (n: number): Atributo => degrau(n).atributo;
export const diferencaDoNivel = (n: number): number => degrau(n).diferenca;
export const objetosDiferentesNoNivel = (n: number): boolean => degrau(n).objetosDiferentes;
export const seriaNoNivel = (n: number): boolean => degrau(n).seria;
export const reguaFantasmaNoNivel = (n: number): boolean => degrau(n).reguaFantasma;

/** Quantos objetos a cena traz. §5: dois, e três no nível da seriação. */
export const quantosNoNivel = (n: number): number => (seriaNoNivel(n) ? 3 : 2);

/** A diferença é PEQUENA? A §9 exige um acerto assim. */
export const diferencaPequena = (n: number): boolean => diferencaDoNivel(n) <= 0.15;

/** O adjetivo que a voz enfatiza, por atributo e polo (§4). */
export const ADJETIVO: Record<Atributo, Record<Polo, string>> = {
  altura: { maior: "mais alto", menor: "mais baixo" },
  comprimento: { maior: "mais comprido", menor: "mais curto" },
  tamanho: { maior: "maior", menor: "menor" },
};

export const FALAS = {
  pergunta: (atributo: Atributo, polo: Polo, nome: string): string =>
    `Qual ${nome} é ${ADJETIVO[atributo][polo]}?`,

  /** §5, nível 5: ordenar. A seriação pede outra frase — ela não escolhe, ordena. */
  perguntaDaSeriacao: (atributo: Atributo, polo: Polo): string =>
    `Toque do ${ADJETIVO[atributo][polo]} para o ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,

  howto: "Olhe onde os dois começam. Agora veja qual sobe mais.",
  explain: "Compare a partir do chão. Os dois começam na mesma linha.",

  acerto: (atributo: Atributo, polo: Polo): string => `Isso! Esse é ${ADJETIVO[atributo][polo]}.`,

  /**
   * §4, erro suave: *"a linha tracejada aparece e desliza do topo de um ao topo
   * do outro, mostrando a diferença"*. A fala acompanha a linha — ela nomeia o
   * que a criança está vendo, não o que ela errou.
   */
  erroSuave: (atributo: Atributo, polo: Polo): string =>
    `Olhe a linha: esse é ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,
};

/** O que a criança fez. */
export interface AcaoDeGrandeza {
  /** O índice que ela tocou. */
  escolhido: number;
  /** O índice certo. */
  certo: number;
  /** O índice do objeto que vence no OUTRO atributo (o mais largo, quando se pede altura). */
  vencedorDoOutroAtributo: number;
  /** A diferença do nível é pequena? */
  diferencaPequena: boolean;
  /**
   * Ela respondeu antes de a linha de chão terminar de se desenhar?
   *
   * §4: *"uma linha de chão se desenha atravessando os dois contêineres. Os
   * objetos pousam nela."* Responder antes disso é julgar sem a referência —
   * ver `diagnosticar`.
   */
  antesDoChao: boolean;
}

/**
 * §6 — o diagnóstico.
 *
 * `BASE_DESALINHADA` (julga sem alinhar) · `CONFUNDE_ATRIBUTOS` (compara largura
 * quando pediram altura) · `SO_DIFERENCA_GRANDE`.
 *
 * ### ⚠️ `BASE_DESALINHADA` só existe porque a tela dá o alinhamento
 *
 * A §2 **obriga** a tela a alinhar as bases. Com elas alinhadas, quem sobe mais
 * é quem é mais alto — não há como a criança "julgar desalinhado", porque a
 * condição que produz esse erro foi removida da tela de propósito.
 *
 * A tag ficaria testada e nunca emitida. A assinatura que sobra, e que é
 * honesta, vem da própria §4: a linha de chão **se desenha** na abertura.
 * Responder antes de ela existir é decidir sem a referência — que é exatamente
 * o que a tag nomeia.
 *
 * Ordem, do mais específico ao mais genérico (§6.8):
 * 1. respondeu antes do chão → `BASE_DESALINHADA`
 * 2. escolheu quem vence no outro atributo → `CONFUNDE_ATRIBUTOS`
 * 3. errou com diferença pequena → `SO_DIFERENCA_GRANDE`
 */
export function diagnosticar(acao: AcaoDeGrandeza): string | undefined {
  if (acao.escolhido === acao.certo) return undefined;

  if (acao.antesDoChao) return MisconceptionTag.BASE_DESALINHADA;
  if (acao.escolhido === acao.vencedorDoOutroAtributo) return MisconceptionTag.CONFUNDE_ATRIBUTOS;
  if (acao.diferencaPequena) return MisconceptionTag.SO_DIFERENCA_GRANDE;

  return MisconceptionTag.CONFUNDE_ATRIBUTOS;
}

/**
 * §9 — o domínio: 3 de 3 em 2 sessões, **incluindo um com diferença pequena**.
 *
 * Acertar três diferenças gritantes não mostra que ela compara — mostra que ela
 * enxerga. Ver P13: a regra extra ainda não tem onde morar no `FichaDominio`.
 */
export function dominou(historico: AcaoDeGrandeza[]): boolean {
  const acertos = historico.filter(a => a.escolhido === a.certo);
  if (acertos.length < 3) return false;
  return acertos.some(a => a.diferencaPequena);
}
