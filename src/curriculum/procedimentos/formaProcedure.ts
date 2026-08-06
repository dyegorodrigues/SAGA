import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento da ficha **F48 — Que forma é essa?** (GE.02).
 *
 * *"Reconhecer formas, mesmo giradas."*
 *
 * ---
 *
 * ### A regra que resolve a ficha, e que o app violava por construção
 *
 * > *"A criança que só vê o triângulo 'em pé' **não reconhece o mesmo triângulo
 * > de cabeça para baixo**. Ela memorizou uma imagem, não a propriedade. O mesmo
 * > com o quadrado girado 45° — vira 'losango' na cabeça dela."*
 * >
 * > *"**A mesma forma aparece girada em ângulos diferentes desde o nível 2.**
 * > Sem isso, o app ensina a reconhecer **desenhos**, não formas."*
 *
 * O gerador antigo era uma questão só, congelada:
 *
 * ```ts
 * { kind: "plain", big: "🔴 ou 🟥 ?", prompt: "Qual é o círculo?",
 *   options: [{ label: "🔴" }, { label: "🟥" }], answer: "circ" }
 * ```
 *
 * Sempre a mesma pergunta, duas opções, `lvl` ignorado — e, o que apaga a
 * competência: **emoji não gira**. `🔴` girado é `🔴`; `🟥` girado 45° continua
 * sendo o mesmo pictograma, porque o desenho do emoji não é uma forma, é uma
 * figura pronta. A única coisa que a ficha existe para ensinar — que a forma
 * sobrevive ao giro — não tinha como ser exercitada.
 */

export type Forma = "circulo" | "quadrado" | "triangulo" | "retangulo";

/** As formas 3D do nível 5. A §5 nomeia exatamente estas três. */
export type Solido = "cubo" | "esfera" | "cilindro";

export type Figura = Forma | Solido;

export const FORMAS: Forma[] = ["circulo", "quadrado", "triangulo", "retangulo"];
export const SOLIDOS: Solido[] = ["cubo", "esfera", "cilindro"];

/** O nome falado de cada figura, com artigo — a voz nomeia o que procura (§4). */
export const NOME: Record<Figura, string> = {
  circulo: "o círculo",
  quadrado: "o quadrado",
  triangulo: "o triângulo",
  retangulo: "o retângulo",
  cubo: "o cubo",
  esfera: "a esfera",
  cilindro: "o cilindro",
};

/**
 * Quantos lados cada forma tem.
 *
 * Não é enfeite: a §4 manda **contar os lados** no acerto e no erro, e a §7
 * escreve o howto em cima disso — *"conte os lados; o triângulo sempre tem
 * três, esteja em qualquer posição"*. É a propriedade que sobrevive ao giro, e
 * portanto a resposta ao *"por quê"* da ficha inteira.
 *
 * O círculo tem zero: dizer "um lado" seria ensinar errado para poupar uma
 * exceção. A tela diz *"nenhum lado — ele é uma curva só"*.
 */
export const LADOS: Record<Forma, number> = {
  circulo: 0,
  quadrado: 4,
  triangulo: 3,
  retangulo: 4,
};

interface DegrauDaF48 {
  /** §5, nível 2 em diante: as formas aparecem giradas. */
  gira: boolean;
  /** §5, nível 3: tamanhos e cores diferentes. */
  variaAparencia: boolean;
  /** §5, nível 4: a forma aparece num objeto do mundo real. */
  mundoReal: boolean;
  /** §5, nível 5: cubo, esfera, cilindro. */
  solidos: boolean;
  /** §3: "3 a 4 formas". */
  opcoes: number;
}

/**
 * §5 — os cinco níveis, transcritos.
 *
 * | Nível | Conteúdo |
 * |---|---|
 * | 1 | formas puras, orientação padrão |
 * | 2 | formas **giradas** |
 * | 3 | formas de tamanhos e cores diferentes |
 * | 4 | **no mundo real** (roda = círculo, janela = retângulo) |
 * | 5 | **formas 3D** (cubo, esfera, cilindro) |
 *
 * O giro **não some** do nível 3 em diante: a §2 diz *"desde o nível 2"*, e um
 * nível 4 com tudo em pé devolveria à criança a pista que a ficha tira.
 */
const DEGRAUS: Record<number, DegrauDaF48> = {
  1: { gira: false, variaAparencia: false, mundoReal: false, solidos: false, opcoes: 3 },
  2: { gira: true, variaAparencia: false, mundoReal: false, solidos: false, opcoes: 3 },
  3: { gira: true, variaAparencia: true, mundoReal: false, solidos: false, opcoes: 4 },
  4: { gira: true, variaAparencia: true, mundoReal: true, solidos: false, opcoes: 4 },
  5: { gira: true, variaAparencia: true, mundoReal: false, solidos: true, opcoes: 3 },
};

function degrau(nivel: number): DegrauDaF48 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const giraNoNivel = (n: number): boolean => degrau(n).gira;
export const variaAparenciaNoNivel = (n: number): boolean => degrau(n).variaAparencia;
export const mundoRealNoNivel = (n: number): boolean => degrau(n).mundoReal;
export const solidosNoNivel = (n: number): boolean => degrau(n).solidos;
export const opcoesDoNivel = (n: number): number => degrau(n).opcoes;

/**
 * ⚠️ Ângulos que **mudam a figura na tela**.
 *
 * Girar um quadrado 90° devolve o mesmo desenho: a questão sairia anunciada
 * como "girada" e chegaria à criança em pé. É o §6.2 — o construtor recusa o
 * sorteio que não pergunta o que o nível pergunta.
 *
 * Por isso o ângulo é escolhido pela SIMETRIA da forma:
 * - quadrado: 45° (o "losango" que a §2 cita pelo nome)
 * - triângulo: 120° e 180° (de cabeça para baixo)
 * - retângulo: 30°, 45°, 60° — 90° troca largura por altura e continua legível,
 *   mas é o giro que mais confunde com o quadrado, então entra também
 * - círculo: **nenhum**. Um círculo girado é um círculo; anunciar giro aqui
 *   seria mentir para a criança e para o diagnóstico.
 */
export const ANGULOS: Record<Forma, number[]> = {
  circulo: [0],
  quadrado: [45],
  triangulo: [120, 180, 210],
  retangulo: [30, 45, 60, 90],
};

export function anguloDe(forma: Forma, sorteio: () => number): number {
  const opcoes = ANGULOS[forma];
  return opcoes[Math.floor(sorteio() * opcoes.length) % opcoes.length];
}

/** Uma figura pode ser mostrada girada de um jeito que a criança perceba? */
export function aceitaGiro(forma: Forma): boolean {
  return ANGULOS[forma].some(a => a !== 0);
}

/** §7 — as falas da ficha. */
export const FALAS = {
  pergunta: (figura: Figura): string => `Qual é ${NOME[figura]}?`,

  howto: "Conte os lados. O triângulo sempre tem três, esteja em qualquer posição.",
  explain: "Não olhe a posição. Conte quantos lados a forma tem.",

  /**
   * §4, acerto: *"a forma escolhida gira lentamente 360°, mostrando que continua
   * sendo a mesma em qualquer posição. Os lados são contados com destaque."*
   *
   * > *"O giro de 360° no acerto é a lição. Ver a forma girar e continuar sendo
   * > triângulo é o que ensina invariância."*
   */
  acerto: (forma: Forma): string => forma === "circulo"
    ? "Isso! O círculo não tem lado nenhum — ele é uma curva só."
    : `Isso! ${NOME[forma]} tem ${LADOS[forma]} lados, em qualquer posição.`,

  /** §4, erro suave: as duas aparecem lado a lado e os lados de cada uma são contados. */
  erroSuave: (escolhida: Forma, certa: Forma): string =>
    `${NOME[escolhida]} tem ${contarLados(escolhida)}. ${NOME[certa]} tem ${contarLados(certa)}.`,

  acertoSolido: (solido: Solido): string => `Isso! É ${NOME[solido]}.`,
  erroDeSolido: (escolhido: Solido, certo: Solido): string =>
    `Esse é ${NOME[escolhido]}. Eu pedi ${NOME[certo]}.`,
};

function contarLados(f: Forma): string {
  return LADOS[f] === 0 ? "nenhum lado" : `${LADOS[f]} lados`;
}

/** O que a criança tocou, e como a cena estava. */
export interface AcaoDeForma {
  /** A figura pedida pelo enunciado. */
  pedida: Figura;
  /** A figura que ela tocou. */
  escolhida: Figura;
  /** A pedida estava girada na tela? */
  pedidaGirada: boolean;
  /** A que ela tocou estava em pé? */
  escolhidaEmPe: boolean;
}

/**
 * §6 — o diagnóstico.
 *
 * `SO_ORIENTACAO_PADRAO` (não reconhece girado — **o alvo**) ·
 * `CONFUNDE_QUADRADO_RETANGULO` · `IGNORA_LADOS` (escolhe pela aparência geral).
 *
 * ### A ordem, e por que o alvo da ficha vem primeiro aqui
 *
 * O §6.8 manda ir do mais específico ao mais genérico, e à primeira vista o par
 * quadrado/retângulo é o mais específico dos três. Mas ele **não é um caso
 * particular** do erro de orientação: são hipóteses sobre coisas diferentes —
 * uma sobre girar, outra sobre comparar o comprimento dos lados.
 *
 * O que decide é a assinatura observável. `SO_ORIENTACAO_PADRAO` só é levantada
 * quando **a certa estava girada e ela escolheu uma que estava em pé** — a
 * conduta que a §2 descreve nome por nome: *"ela memorizou uma imagem"*. Nessa
 * situação, o quadrado girado 45° É o "losango" da §2, e chamar isso de confusão
 * quadrado/retângulo mandaria a Oficina ensinar comprimento de lado para uma
 * criança cujo problema é o giro.
 *
 * Fora dessa assinatura, o par volta a ser o mais específico e vem antes.
 */
export function diagnosticar(acao: AcaoDeForma): string | undefined {
  if (acao.escolhida === acao.pedida) return undefined;

  // A assinatura do alvo da ficha: a certa girada, a escolhida em pé.
  if (acao.pedidaGirada && acao.escolhidaEmPe) return MisconceptionTag.SO_ORIENTACAO_PADRAO;

  const par = new Set([acao.pedida, acao.escolhida]);
  if (par.has("quadrado") && par.has("retangulo")) {
    return MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO;
  }

  return MisconceptionTag.IGNORA_LADOS;
}

/**
 * §9 — o domínio: 3 de 3 em 2 sessões, **com pelo menos um com a forma girada**.
 *
 * Sem essa cláusula, três acertos em formas em pé dariam domínio de uma ficha
 * cujo assunto declarado é justamente a forma que não está em pé. Ver P13: a
 * regra extra ainda não tem onde morar no `FichaDominio`.
 */
export function dominou(historico: AcaoDeForma[]): boolean {
  const acertos = historico.filter(a => a.escolhida === a.pedida);
  if (acertos.length < 3) return false;
  return acertos.some(a => a.pedidaGirada);
}
