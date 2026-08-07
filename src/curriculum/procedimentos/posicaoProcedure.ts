import { MisconceptionTag } from "../../constants/misconceptions";

/**
 * Procedimento da ficha **F47 — Onde está?** (GE.01).
 *
 * *"Posição no espaço. A primeira geometria."*
 *
 * ---
 *
 * ### O que o gerador antigo fazia
 *
 * ```ts
 * big: isOnTop ? "🐈\n📦" : "📦\n🐈",
 * prompt: "O gato está EM CIMA ou EMBAIXO da caixa?",
 * options: [{ label: "Em cima" }, { label: "Embaixo" }]
 * ```
 *
 * Três defeitos, e o terceiro é o que apaga a competência:
 *
 * 1. **A resposta é lida.** As alternativas são as palavras *"Em cima"* e
 *    *"Embaixo"* — texto, numa competência de faixa F0. A §3 da ficha diz
 *    *"sem botões: a criança **toca no objeto**"*.
 * 2. **Um objeto só.** A §3 pede *"UM referencial e **dois objetos**, um acima e
 *    um abaixo"*. Com um objeto e um referencial, não há o que comparar: a
 *    pergunta vira "leia a palavra certa".
 * 3. **Não há nível.** O `lvl` é ignorado. Os cinco pares da §5 — cima/baixo,
 *    dentro/fora, frente/atrás, esquerda/direita e **produzir** — não existiam.
 *
 * ### A regra dura da §2
 *
 * > *"**Um único referencial na cena.** Duas mesas tornam a pergunta ambígua —
 * > a criança não sabe de qual mesa se fala."*
 */

/** Os pares de posição da §5, um por nível. */
export type Preposicao =
  | "em cima" | "embaixo"
  | "dentro" | "fora"
  | "na frente" | "atrás"
  | "à esquerda" | "à direita";

export type Par = "cima-baixo" | "dentro-fora" | "frente-atras" | "esquerda-direita";

export const PARES: Record<Par, [Preposicao, Preposicao]> = {
  "cima-baixo": ["em cima", "embaixo"],
  "dentro-fora": ["dentro", "fora"],
  "frente-atras": ["na frente", "atrás"],
  "esquerda-direita": ["à esquerda", "à direita"],
};

/**
 * §5 — os cinco níveis, transcritos.
 *
 * | Nível | Par de posições |
 * |---|---|
 * | 1 | em cima / embaixo |
 * | 2 | dentro / fora |
 * | 3 | na frente / atrás |
 * | 4 | esquerda / direita |
 * | 5 | **produzir** — arrastar o objeto para a posição pedida |
 *
 * > *"O nível 5 inverte: em vez de reconhecer, ela **coloca** o objeto onde foi
 * > pedido."*
 */
const DEGRAUS: Record<number, Par> = {
  1: "cima-baixo",
  2: "dentro-fora",
  3: "frente-atras",
  4: "esquerda-direita",
  5: "cima-baixo",
};

function nivelValido(nivel: number): number {
  return Math.min(5, Math.max(1, Math.round(nivel)));
}

export function parDoNivel(nivel: number): Par {
  return DEGRAUS[nivelValido(nivel)];
}

/**
 * O nível 5 **produz**: ela coloca o objeto onde foi pedido, em vez de apontar
 * qual já está lá.
 *
 * O par volta a ser cima/baixo porque a §5 não nomeia outro, e porque o degrau
 * novo é o **ato**, não a preposição: mudar as duas coisas de uma vez é o §6.36.
 */
export function produzNivel(nivel: number): boolean {
  return nivelValido(nivel) === 5;
}

/** A preposição oposta — a que o erro clássico escolhe. */
export function oposta(p: Preposicao): Preposicao {
  for (const [a, b] of Object.values(PARES)) {
    if (a === p) return b;
    if (b === p) return a;
  }
  return p;
}

/** §7, com a preposição no lugar e a contração certa: "embaixo **da mesa**". */
export const FALAS = {
  pergunta: (prep: Preposicao, doReferencial: string): string =>
    `Qual objeto está ${prep} ${doReferencial}?`,

  /** §5, nível 5: o pedido inverte — ela coloca. */
  pedido: (prep: Preposicao, doReferencial: string, objeto: string): string =>
    `Coloque ${objeto} ${prep} ${doReferencial}!`,

  howto: "Olhe a mesa. Agora veja qual objeto está debaixo dela.",
  explain: "Compare com a mesa: um está por cima, outro por baixo.",

  /**
   * §4, erro suave: *"esse está em cima. Eu pedi embaixo."*
   *
   * > *"O erro que ensina vocabulário: dizer 'esse está em cima' em vez de
   * > 'errou' transforma o erro em informação."*
   */
  erroSuave: (ondeEstava: Preposicao, ondePedi: Preposicao): string =>
    `Esse está ${ondeEstava}. Eu pedi ${ondePedi}.`,

  /** Tocar o próprio referencial: ele não é resposta, é a referência. */
  erroDoReferencial: (referencial: string, prep: Preposicao): string =>
    `${referencial} é a referência! Eu quero o objeto que está ${prep}.`,

  acerto: (prep: Preposicao, doReferencial: string): string =>
    `Isso! Está ${prep} ${doReferencial}.`,
};

/** O que a criança tocou, e onde aquilo estava. */
export interface AcaoDePosicao {
  /** A preposição pedida pelo enunciado. */
  pedida: Preposicao;
  /** Onde estava o que ela tocou. `null` quando tocou o referencial. */
  escolhida: Preposicao | null;
  /** O par do nível — decide se o erro é de lateralidade. */
  par: Par;
}

/**
 * §6 — o diagnóstico.
 *
 * `INVERTE_PAR` (confunde em cima/embaixo) · `IGNORA_REFERENCIAL` (escolhe sem
 * olhar em relação a quê) · `ESQUERDA_DIREITA` (o par mais difícil, exige
 * lateralidade).
 *
 * ### A ordem, e por que `IGNORA_REFERENCIAL` precisa de um gesto próprio
 *
 * Com **dois** objetos na cena — que é o que a §3 manda —, todo erro de escolha
 * é, por construção, o objeto do lado oposto. Se o diagnóstico só olhasse os
 * dois objetos, `INVERTE_PAR` seria a única tag possível e as outras duas
 * jamais existiriam.
 *
 * Por isso o **referencial também é tocável**. Tocar a mesa quando a pergunta é
 * *"qual objeto está embaixo da mesa"* é literalmente escolher sem olhar em
 * relação a quê — e devolve uma aula de vocabulário em vez de um erro.
 *
 * E no nível 4 o mesmo gesto (o objeto oposto) recebe outra tag: quem troca
 * esquerda e direita não tem o mesmo problema de quem troca dentro e fora. A
 * aula é de lateralidade, não de vocabulário posicional (§6.8).
 */
export function diagnosticar(acao: AcaoDePosicao): string | undefined {
  if (acao.escolhida === acao.pedida) return undefined;

  // Tocou a referência achando que ela era a resposta.
  if (acao.escolhida === null) return MisconceptionTag.IGNORA_REFERENCIAL;

  // O par mais difícil tem tag própria: exige lateralidade, não vocabulário.
  if (acao.par === "esquerda-direita") return MisconceptionTag.ESQUERDA_DIREITA;

  return MisconceptionTag.INVERTE_PAR;
}

/**
 * §9 — o domínio: 3 de 3 em 2 sessões, **cobrindo pelo menos dois pares
 * diferentes**.
 *
 * Acertar três vezes seguidas em cima/embaixo não mostra que ela entendeu
 * posição — mostra que ela entendeu um par. Ver P13: esta regra extra ainda não
 * tem onde morar no `FichaDominio`.
 */
export function dominou(historico: AcaoDePosicao[]): boolean {
  const acertos = historico.filter(a => a.escolhida === a.pedida);
  if (acertos.length < 3) return false;
  return new Set(acertos.map(a => a.par)).size >= 2;
}
