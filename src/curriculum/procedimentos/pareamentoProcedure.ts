import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * F07 — Um pra cada. A primeira competência matemática da vida.
 *
 * ---
 *
 * **O que a criança aprende:** que dois conjuntos podem ser comparados **sem
 * contar** — basta ver se sobra alguém.
 *
 * **Por que vem antes de tudo.** A criança de 4 anos recita "um, dois, três" sem
 * entender que o último número *é* a quantidade. Antes de o número significar
 * algo, ela precisa de **correspondência**: um capacete para cada bombeiro. É o
 * alicerce de contagem, comparação, divisão e fração.
 *
 * **Por que trava:** ela distribui aleatoriamente — dois capacetes num bombeiro,
 * nenhum noutro — porque ainda não tem a regra *"um e só um para cada"*.
 *
 * ---
 *
 * ### ⚠️ A regra dura da ficha
 *
 * > **Nenhum numeral aparece nesta ficha, em nenhum nível.**
 *
 * Se aparecer número, virou N1.04 (contar). A competência aqui é **pré-numérica**,
 * e este arquivo tem um teste que varre toda a saída procurando dígito.
 *
 * ### E o coração da ficha
 *
 * A pergunta final **não é "quantos?"** — é **"sobrou?"**. É assim que se ensina
 * comparação antes do número.
 */

/** Como a cena termina, do ponto de vista do pareamento. */
export type Desfecho = "exato" | "sobra" | "falta";

/** Como as peças estão dispostas na tela. É um degrau de dificuldade. */
export type Arranjo = "fila" | "espalhado" | "cena";

/** Quando a pergunta do "sobrou?" acontece. */
export type MomentoDaPergunta = "nenhuma" | "depois" | "antes";

export interface Cena {
  /** Quem recebe: os bombeiros. */
  receptores: number;
  /** O que se distribui: os capacetes. */
  itens: number;
}

/** Sobrou item, faltou item, ou deu certinho? */
export function desfechoDe(c: Cena): Desfecho {
  if (c.itens > c.receptores) return "sobra";
  if (c.itens < c.receptores) return "falta";
  return "exato";
}

/* ------------------------------------------------------------------ *
 *  A escada dos cinco níveis — transcrita da tabela da ficha F07 §5.
 *
 *  | Nível | Quantidades              | O que muda                        |
 *  |-------|--------------------------|-----------------------------------|
 *  |   1   | 3 e 3 (exato)            | Mão Fantasma faz o primeiro par   |
 *  |   2   | 3 e 4 (sobra 1)          | criança sozinha; a pergunta surge |
 *  |   3   | até 6, sobra ou falta    | os itens vêm ESPALHADOS           |
 *  |   4   | até 8, sobra ou falta    | receptores em posições irregulares|
 *  |   5   | até 10                   | pergunta INVERTIDA, antes de agir |
 *
 *  Transcrita, não parafraseada: escrever a própria distribuição e depois
 *  testá-la contra si mesma foi o erro §6.11.
 * ------------------------------------------------------------------ */

/** O teto de peças de cada nível, direto da tabela. */
export function tetoDoNivel(nivel: number): number {
  if (nivel <= 2) return 4;
  if (nivel === 3) return 6;
  if (nivel === 4) return 8;
  return 10;
}

/** A disposição das peças. Espalhar é mais difícil que enfileirar. */
export function arranjoDoNivel(nivel: number): Arranjo {
  if (nivel <= 2) return "fila";
  if (nivel === 3) return "espalhado";
  return "cena";
}

/**
 * Quando a pergunta acontece.
 *
 * **Correção de leitura.** Eu tinha tirado a pergunta do nível 1, lendo o §5
 * ("nível 2: a pergunta final aparece") como se ela não existisse antes. Está
 * errado: o roteiro cinematográfico da §4 — escrito para o nível 1 — traz o
 * Fecho com *"sobrou algum capacete?"*, e a própria ficha grifa que **a pergunta
 * final é o coração**. O que aparece no nível 2 é a criança respondendo
 * **sozinha**; no nível 1 a Mão Fantasma narra o caminho inteiro.
 *
 * Tirar a pergunta do primeiro nível apagaria o assunto da ficha justamente na
 * tela em que ele é ensinado.
 *
 * No nível 5 ela vem **antes** de distribuir — o salto conceitual: prever se dá
 * para todos é o começo do raciocínio comparativo.
 */
export function momentoDaPergunta(nivel: number): MomentoDaPergunta {
  return nivel >= 5 ? "antes" : "depois";
}

/** A Mão Fantasma faz o primeiro par, narrando — só no nível 1. */
export function temMaoFantasma(nivel: number): boolean {
  return nivel <= 1;
}

/**
 * As cenas possíveis de um nível.
 *
 * Devolve a lista inteira em vez de sortear aqui: sortear dentro do
 * procedimento tornaria o teste dependente do acaso, e o Composer já é o dono
 * do sorteio.
 */
export function cenasDoNivel(nivel: number): Cena[] {
  // Nível 1: exato, e pequeno. A criança está aprendendo o gesto, não a
  // comparação — por isso nada sobra e nada falta.
  if (nivel <= 1) return [{ receptores: 3, itens: 3 }];

  // Nível 2: a tabela pede 3 e 4. Um só a mais, para "sobrou" ser óbvio na
  // primeira vez que a pergunta aparece.
  if (nivel === 2) return [{ receptores: 3, itens: 4 }];

  const teto = tetoDoNivel(nivel);
  const fora: Cena[] = [];
  for (let receptores = 3; receptores <= teto; receptores += 1) {
    for (const delta of [-2, -1, 1, 2]) {
      const itens = receptores + delta;
      if (itens < 1 || itens > teto) continue;
      fora.push({ receptores, itens });
    }
    // O nível 5 também sorteia casos exatos: prever "tem para todos?" só tem
    // graça se às vezes a resposta for sim.
    if (nivel >= 5) fora.push({ receptores, itens: receptores });
  }
  return fora;
}

/* ------------------------------------------------------------------ *
 *  Diagnóstico — ficha F07 §6
 *
 *  Esta é uma ficha de PRODUÇÃO, não de seleção: o diagnóstico vem da ação da
 *  criança, não de uma alternativa que ela escolhe.
 * ------------------------------------------------------------------ */

/** O que a criança fez com as peças, lido pelo palco. */
export interface AcaoDePareamento {
  /** Quantos itens ela pôs em cada receptor, na ordem deles. */
  porReceptor: number[];
  /** Quantos itens sobraram na bandeja. */
  naBandeja: number;
  /** O que ela respondeu na pergunta do "sobrou?", quando houve pergunta. */
  respostaDaPergunta?: Desfecho;
}

/**
 * O erro que a ação revela — ou `undefined` quando não há erro conceitual.
 *
 * A ordem importa: **distribuição desigual vem primeiro**. Uma criança que pôs
 * dois capacetes num bombeiro provavelmente também deixou outro sem, e as duas
 * marcas aparecem juntas; a que explica o que houve na cabeça dela é a primeira,
 * porque é a regra "um e só um" que ainda não existe.
 */
export function diagnosticar(a: AcaoDePareamento, c: Cena): MisconceptionTagType | undefined {
  if (a.porReceptor.some(n => n >= 2)) return MisconceptionTag.DISTRIBUICAO_DESIGUAL;

  const vazios = a.porReceptor.filter(n => n === 0).length;
  if (vazios > 0 && a.naBandeja > 0) return MisconceptionTag.PAREAMENTO_INCOMPLETO;

  if (a.respostaDaPergunta && a.respostaDaPergunta !== desfechoDe(c)) {
    return MisconceptionTag.COMPARACAO_VISUAL;
  }
  return undefined;
}

/** A distribuição está completa e correta: um e só um para cada, até acabar. */
export function pareamentoPerfeito(a: AcaoDePareamento, c: Cena): boolean {
  if (a.porReceptor.length !== c.receptores) return false;
  if (a.porReceptor.some(n => n > 1)) return false;
  const colocados = a.porReceptor.reduce((s, n) => s + n, 0);
  // Com falta de itens, o certo é ter distribuído TODOS os que existiam.
  const esperado = Math.min(c.receptores, c.itens);
  return colocados === esperado && a.naBandeja === c.itens - colocados;
}

/* ------------------------------------------------------------------ *
 *  As falas — ficha F07 §7. Nenhuma contém numeral.
 * ------------------------------------------------------------------ */

/** As três respostas possíveis da pergunta final, sempre nesta ordem. */
export const RESPOSTAS: { desfecho: Desfecho; rotulo: string }[] = [
  { desfecho: "sobra", rotulo: "Sobrou" },
  { desfecho: "exato", rotulo: "Deu certinho" },
  { desfecho: "falta", rotulo: "Faltou" },
];

/**
 * A pergunta do momento certo.
 *
 * Depois de distribuir: *"sobrou algum?"*. Antes: *"tem para todos?"* — a
 * previsão. **Nunca "quantos?"**: contar é N1.04, e aqui o número não existe.
 */
export function perguntaDoNivel(nivel: number): string | null {
  const momento = momentoDaPergunta(nivel);
  if (momento === "nenhuma") return null;
  return momento === "antes"
    ? "Olhe bem: tem para todos?"
    : "E aí, sobrou algum?";
}
