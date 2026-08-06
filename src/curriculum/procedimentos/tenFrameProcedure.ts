import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento da moldura de dez — três fichas, uma primitiva.
 *
 * | ficha | competência | o que a moldura faz |
 * |---|---|---|
 * | **F02** | N1.08 | *"quantas você vê?"* — a estrutura do 5 e do 10 |
 * | **JD3** | N1.11 | *"quantos faltam pra encher?"* — o vazio como figura |
 * | **JD5** | N1.10 | *"quantos ficaram escondidos?"* — parte-todo mental |
 *
 * ---
 *
 * ### A regra que atravessa as três, e que a primitiva não cumpria
 *
 * > F02 §2: *"a regra de preenchimento: sempre **da esquerda para a direita, de
 * > cima para baixo, sem buraco**. A ordem é o que cria a imagem mental estável.
 * > Preenchimento aleatório destrói a competência."*
 *
 * Com uma exceção, e ela é o degrau final da JD3: o nível 5 preenche
 * **disperso** de propósito, *"com casas vazias espalhadas, o vazio perde a
 * forma e a criança precisa integrar"*. Exceção declarada, num nível só, na
 * ficha que existe para ensinar a ver o vazio.
 *
 * ### O que o `TenFrame` não fazia
 *
 * 1. **Moldura sempre de 10 células.** A F02 §3 manda 5 nos níveis 1-2 — *"5
 *    numa fileira (níveis 1-2) ou 10 em duas fileiras de 5 (níveis 3+)"*. O
 *    primeiro degrau da ficha não existia.
 * 2. **Nenhum modo "quantos faltam"**, que é o nível 5 da F02 e a JD3 inteira.
 * 3. **Nenhum modo "quantos escondidos"**, que é a JD5 inteira.
 * 4. **A ocupação era um número**, então casas vazias dispersas (JD3 nível 5)
 *    eram impossíveis de representar.
 * 5. **O flash escondia a moldura junto com as fichas.** A JD3 §4 manda o
 *    contrário: *"as fichas somem. A moldura vazia **permanece 300ms** — o vazio
 *    é a última coisa que a criança vê."*
 */

/** O que a moldura pergunta. */
export type ModoDaMoldura = "contar" | "faltam" | "escondidos";

/** Como o preenchimento se distribui pelas casas. */
export type Arrumacao = "continuo" | "disperso";

export interface DegrauDaMoldura {
  /** Quantas casas a moldura tem: 5 ou 10. */
  casas: number;
  min: number;
  max: number;
  /** Quanto tempo as fichas ficam visíveis. `null` = não some. */
  flashMs: number | null;
  arrumacao: Arrumacao;
  /** JD5: quantos objetos a tampa cobre. */
  escondeMin?: number;
  escondeMax?: number;
  /** JD5, nível 5: sem moldura — objetos soltos. */
  semMoldura?: boolean;
  /** JD5, níveis 1-2: a voz conta o total em voz alta antes de tapar. */
  contaEmVozAlta?: boolean;
  /** JD3, nível 3: a fileira de cima completa e destacada. */
  ancoraExplicita?: boolean;
}

/**
 * **F02 §5** — a moldura de dez (N1.08). Os níveis 1 e 2 são da JD2 (a mão);
 * aqui começam no 3, que é onde a segunda fileira entra.
 *
 * | Nível | Moldura | Quantidade | O que muda |
 * |---|---|---|---|
 * | 1 | 5 células | 1 a 5 | Mão Fantasma mostra a fileira acendendo |
 * | 2 | 5 células | 1 a 5 | sozinha |
 * | 3 | 10 células | 6 a 10 | **a segunda fileira entra** — ver 5+n |
 * | 4 | 10 células | 1 a 10 | flash de 2 segundos |
 * | 5 | 10 células | 1 a 10 | **"quantos faltam para encher?"** |
 */
export const F02: Record<number, DegrauDaMoldura> = {
  1: { casas: 5, min: 1, max: 5, flashMs: null, arrumacao: "continuo" },
  2: { casas: 5, min: 1, max: 5, flashMs: null, arrumacao: "continuo" },
  3: { casas: 10, min: 6, max: 10, flashMs: null, arrumacao: "continuo" },
  4: { casas: 10, min: 1, max: 10, flashMs: 2000, arrumacao: "continuo" },
  5: { casas: 10, min: 1, max: 10, flashMs: null, arrumacao: "continuo" },
};

/**
 * **JD3 §5** — a moldura relâmpago (N1.11). Perceptual: sobe por
 * automaticidade, não por abstração.
 *
 * | Nível | Preenchimento | Exposição | Apoio |
 * |---|---|---|---|
 * | 1 | 8 ou 9 | 1,5s | fileira de cima sempre completa |
 * | 2 | 6 a 9 | 1,2s | fileira de cima sempre completa |
 * | 3 | 5 a 9 | 1,2s | **a âncora do 5 explícita** |
 * | 4 | 1 a 9 | 1,0s | sem destaque |
 * | 5 | 1 a 9 | 0,7s | preenchimento **disperso** |
 */
export const JD3: Record<number, DegrauDaMoldura> = {
  1: { casas: 10, min: 8, max: 9, flashMs: 1500, arrumacao: "continuo" },
  2: { casas: 10, min: 6, max: 9, flashMs: 1200, arrumacao: "continuo" },
  3: { casas: 10, min: 5, max: 9, flashMs: 1200, arrumacao: "continuo", ancoraExplicita: true },
  4: { casas: 10, min: 1, max: 9, flashMs: 1000, arrumacao: "continuo" },
  5: { casas: 10, min: 1, max: 9, flashMs: 700, arrumacao: "disperso" },
};

/**
 * **JD5 §5** — ver e imaginar (N1.10). A tampa cobre parte do grupo.
 *
 * | Nível | Total | O que esconde | Apoio |
 * |---|---|---|---|
 * | 1 | até 3 | 1 objeto | moldura + contagem em voz alta |
 * | 2 | até 5 | 1 ou 2 | moldura + contagem |
 * | 3 | até 5 | qualquer parte | moldura, **sem contagem em voz alta** |
 * | 4 | até 10 | qualquer parte | moldura |
 * | 5 | até 10 | qualquer parte | **sem moldura** — objetos soltos |
 */
export const JD5: Record<number, DegrauDaMoldura> = {
  1: { casas: 5, min: 2, max: 3, flashMs: null, arrumacao: "continuo", escondeMin: 1, escondeMax: 1, contaEmVozAlta: true },
  2: { casas: 5, min: 3, max: 5, flashMs: null, arrumacao: "continuo", escondeMin: 1, escondeMax: 2, contaEmVozAlta: true },
  3: { casas: 5, min: 3, max: 5, flashMs: null, arrumacao: "continuo", escondeMin: 1, escondeMax: 4 },
  4: { casas: 10, min: 4, max: 10, flashMs: null, arrumacao: "continuo", escondeMin: 1, escondeMax: 9 },
  5: { casas: 10, min: 4, max: 10, flashMs: null, arrumacao: "continuo", escondeMin: 1, escondeMax: 9, semMoldura: true },
};

const TABELAS: Record<ModoDaMoldura, Record<number, DegrauDaMoldura>> = {
  contar: F02,
  faltam: JD3,
  escondidos: JD5,
};

export function degrauDoNivel(modo: ModoDaMoldura, nivel: number): DegrauDaMoldura {
  return TABELAS[modo][Math.min(5, Math.max(1, Math.round(nivel)))];
}

/**
 * ⚠️ O nível 5 da F02 **inverte a pergunta**.
 *
 * *"Perguntar quantos faltam, em vez de quantos tem, é a mesma moldura
 * ensinando a operação complementar."* — e a §5 chama isso de *"a semente
 * direta dos amigos do 10 (N1.11)"*.
 *
 * Sem isto, o modo `contar` teria cinco níveis iguais no que importa, e a ponte
 * para a N1.11 — que a ficha declara em letras — não existiria.
 */
export function perguntaOQueFalta(modo: ModoDaMoldura, nivel: number): boolean {
  if (modo === "faltam") return true;
  return modo === "contar" && Math.round(nivel) === 5;
}

/** §7 — as falas das três fichas, cada uma com a sua. */
export const FALAS = {
  contar: {
    audioPrompt: "Quantas estrelas você vê?",
    howto: "A fileira cheia já são cinco. Some os que estão embaixo.",
    explain: "Olhe a fileira de cima: ela está cheia? Então já são cinco. Agora conte só os de baixo.",
    /** §4, acerto: a fileira acende INTEIRA e a voz nomeia a estrutura. */
    acerto: (n: number): string => (n > 5 ? `cinco! E mais ${n - 5}: ${n}!` : `${n}!`),
    /** §4, erro suave: nunca diz "errou" — devolve a estrutura. */
    erroSuave: "A fileira cheia já são cinco. Conte só os de baixo.",
  },
  faltam: {
    audioPrompt: "Quantos faltam pra encher?",
    howto: "Olhe o buraco, não as fichas. Quantas casas ficaram vazias?",
    /**
     * ⚠️ A JD3 §7 proíbe duas frases nominalmente:
     *
     * - *"conte as casas vazias"* — devolve a criança à contagem, que é o que a
     *   ficha existe para dispensar;
     * - *"faça dez menos sete"* — a subtração é a F28/F31, não esta. Aqui é
     *   percepção.
     */
    explain: "A moldura tem dez casas. Veja o tamanho do buraco que sobrou.",
    acerto: (cheio: number, vazio: number): string => `${cheio} e ${vazio}: dez!`,
    erroSuave: (vazio: number): string => `Olha o buraco: cabem ${vazio}.`,
  },
  escondidos: {
    audioPrompt: "Quantos ficaram escondidos?",
    howto: "Lembre quantos eram no total. Olhe quantos ainda dá para ver. Os que faltam estão escondidos.",
    explain: "Eram cinco no total. Você está vendo dois. Quantos a tampa está escondendo?",
    acerto: (escondidos: number): string => `Isso! ${escondidos} escondidos!`,
    /** §4, erro suave: a tampa levanta devagar e a voz CONTA os escondidos. */
    erroSuave: (escondidos: number): string => `Eram ${escondidos}.`,
  },
};

/** O que a criança respondeu, e o que a cena mostrava. */
export interface AcaoDaMoldura {
  modo: ModoDaMoldura;
  /**
   * O nível, porque a F02 §6 tem uma linha que só existe **no nível 5**: ali a
   * pergunta inverte, e responder o cheio deixa de ser descuido.
   */
  nivel: number;
  resposta: number;
  /** A resposta certa. */
  alvo: number;
  /** Quantas casas estavam ocupadas. */
  cheias: number;
  /** Quantas casas a moldura tem. */
  casas: number;
  /** JD5: quantos ficaram visíveis depois da tampa. */
  visiveis?: number;
  /** JD5: o total antes de tapar. */
  total?: number;
  /** JD3, nível 5: o vazio estava disperso? */
  disperso?: boolean;
  /** JD5, nível 5: sem moldura? */
  semMoldura?: boolean;
}

/**
 * §6 — o diagnóstico, e ele muda com a pergunta.
 *
 * As três fichas têm a **mesma armadilha central** com nomes diferentes:
 * responder o que está na tela em vez do que a pergunta pede.
 *
 * - `contar` → `CONTA_VAZIOS`: somou as casas vazias às cheias
 * - `contar`, **nível 5** → `INVERTE_PERGUNTA`: a F02 §6 tem essa linha só ali
 * - `faltam` → `RESPONDE_O_CHEIO`: disse quantas fichas há, não quantas faltam
 * - `escondidos` → `RESPONDE_O_VISIVEL` / `RESPONDE_O_TODO`
 *
 * ⚠️ O nível 5 da F02 e a JD3 inteira produzem **o mesmo gesto** — dizer o
 * cheio onde a pergunta é o vazio — e cada ficha o nomeia diferente. Mantive os
 * dois nomes: é o nome que a Oficina lê, e o tratamento não é o mesmo. Na F02, a
 * inversão é um degrau dentro de uma ficha sobre estrutura; na JD3, a inversão
 * **é** a competência.
 *
 * A JD3 §6 chama a dela de *"a tag-chave"*: *"não é descuido — é a criança
 * fazendo exatamente o que o olho pede"*. Por isso ela vem **antes** do
 * `OFF_BY_ONE`: quando o cheio e o alvo±1 coincidem, tratar como descuido
 * mandaria a Oficina treinar contagem quando o que falhou foi a inversão (§6.8).
 */
export function diagnosticar(acao: AcaoDaMoldura): string | undefined {
  if (acao.resposta === acao.alvo) return undefined;

  if (acao.modo === "faltam") {
    if (acao.resposta === acao.cheias) return MisconceptionTag.RESPONDE_O_CHEIO;
    if (Math.abs(acao.resposta - acao.alvo) === 1) return MisconceptionTag.OFF_BY_ONE;
    // "Erra sistematicamente quando faltam mais de 5" — não usa a fileira como
    // unidade. Observável na questão: o vazio passa da fileira de baixo inteira.
    if (acao.alvo > 5) return MisconceptionTag.SEM_ANCORA_CINCO;
    // "Acerta com vazio contíguo e erra com disperso" é padrão ENTRE questões;
    // dentro de uma, o observável é ter errado no degrau disperso. Depois do
    // `OFF_BY_ONE`, que é assinatura exata (§6.8).
    if (acao.disperso) return MisconceptionTag.DEPENDE_DE_FORMATO;
    return MisconceptionTag.CHUTE_SEGURO;
  }

  if (acao.modo === "escondidos") {
    if (acao.resposta === acao.visiveis) return MisconceptionTag.RESPONDE_O_VISIVEL;
    if (acao.resposta === acao.total) return MisconceptionTag.RESPONDE_O_TODO;
    if (Math.abs(acao.resposta - acao.alvo) === 1) return MisconceptionTag.OFF_BY_ONE;
    // "Acerta com moldura, erra sem" é um padrão ENTRE questões; dentro de uma
    // só, o que sobra observável é ter errado no degrau sem moldura. Vem por
    // último de propósito: é a hipótese mais genérica das quatro (§6.8).
    if (acao.semMoldura) return MisconceptionTag.DEPENDE_DE_ESTRUTURA;
    // A §6 da JD5 tem quatro linhas e esta resposta não é nenhuma delas. Erro
    // sem hipótese é melhor que hipótese inventada: a Oficina não é chamada.
    return undefined;
  }

  // F02 §6, a linha que só existe no nível 5: "respondeu quantos tem em vez de
  // quantos faltam — não processou o complemento".
  if (perguntaOQueFalta(acao.modo, acao.nivel) && acao.resposta === acao.cheias) {
    return MisconceptionTag.INVERTE_PERGUNTA;
  }

  // `contar`: responder o total de CASAS é contar as vazias junto.
  if (acao.resposta === acao.casas && acao.cheias < acao.casas) {
    return MisconceptionTag.CONTA_VAZIOS;
  }
  if (Math.abs(acao.resposta - acao.alvo) === 1) return MisconceptionTag.OFF_BY_ONE;
  // "Acerta até 5, erra de 6 a 10" — o mais importante da F02: não vê a fileira
  // cheia como unidade. O que ela tinha de VER passa de cinco: no nível 5 isso é
  // o vazio, nos outros é o cheio. Ler sempre o cheio marcaria `7 cheias, faltam
  // 3, errou por muito` como falta de estrutura quando o buraco era pequeno.
  const oQueTinhaDeVer = perguntaOQueFalta(acao.modo, acao.nivel) ? acao.alvo : acao.cheias;
  if (oQueTinhaDeVer > 5) return MisconceptionTag.NAO_USA_ESTRUTURA;
  // A §6 da F02 tem quatro linhas e esta resposta não é nenhuma delas — mesma
  // regra da JD5: erro sem hipótese é melhor que hipótese inventada.
  return undefined;
}

/**
 * §9 — a evidência extra de cada ficha.
 *
 * - **F02**: *"pelo menos um acerto com quantidade entre 6 e 10"* — é o que
 *   exige usar a estrutura das duas fileiras.
 * - **JD5**: *"pelo menos um acerto no nível 4+"* (total até 10), que exige
 *   memória de trabalho real.
 * - **JD3**: a §9 não pede condição extra; ela pede 4 de 5 e proíbe critério de
 *   tempo (§5.1-bis). Nada a declarar — e declarar o que a ficha não pede seria
 *   endurecer o cânone por conta própria.
 */
export function evidenciasDe(acao: AcaoDaMoldura): string[] {
  if (acao.resposta !== acao.alvo) return [];
  if (acao.modo === "contar" && acao.cheias >= 6) return [Evidencia.ESTRUTURA_DAS_DUAS_FILEIRAS];
  if (acao.modo === "escondidos" && (acao.total ?? 0) > 5) return [Evidencia.TOTAL_ALEM_DE_CINCO];
  return [];
}
