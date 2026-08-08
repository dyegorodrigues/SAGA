import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag, MisconceptionTagType } from "../../constants/misconceptions";

/**
 * `DragGroup` em modo **caixas/laços** — a ficha F51, AL.01.
 *
 * ---
 *
 * ### O que a criança aprende (§2)
 *
 * Agrupar por uma característica — e perceber que o **mesmo conjunto** pode ser
 * agrupado de formas diferentes.
 *
 * > *"Classificar é o que permite contar (contar o quê?), comparar (comparar
 * > quais?) e mais tarde entender conjuntos, fatores e categorias de dados."*
 *
 * ### O que quase ninguém ensina, e é o coração da ficha
 *
 * O **"não pertence"**. A §2 escreve:
 *
 * > *"Colocar corretamente **fora** do grupo é resposta certa. Sem isso, a
 * > criança acha que tudo tem que caber em alguma caixa."*
 *
 * E a §4 põe isso na tela: *"ao deixar uma peça fora, ela **também brilha**"* —
 * *"o brilho ao deixar fora é o detalhe crucial. Ele ensina que 'não pertence'
 * é uma decisão, não um erro."*
 *
 * Por isso **"fora" é um destino de verdade**, com um alvo próprio na tela, e
 * não a ausência de ação. Uma peça que fica de fora por a criança não ter feito
 * nada não é uma decisão — é um exercício incompleto, e o app não teria como
 * distinguir os dois.
 *
 * ---
 *
 * ### O que esta versão corrigiu
 *
 * A AL.01 estava **ativa** servindo `intruso_math`: *"qual é o diferente?"*, em
 * múltipla escolha. Isso não é a F51 — é outra competência com o nome desta. A
 * criança nunca separava nada, nunca decidia um "fora", e os cinco degraus da
 * §5 (dois laços, reclassificação, interseção, descobrir o critério) não
 * existiam: os cinco níveis chamavam o mesmo gerador.
 *
 * ### ⚠️ A observação de progressão, registrada e não resolvida aqui
 *
 * `DragGroup` estreia em **dois modos**, em **dois nós raiz** do grafo:
 * `parear` no N1.01 e `caixas/laços` no AL.01. Nenhum dos dois é pré-requisito
 * do outro, então não existe ordem: a criança pode encontrar qualquer um
 * primeiro, e cada um é um desenho diferente. É a mesma família da pendência P1.
 *
 * Não mudo o grafo por conta própria — inverter a ordem seria decisão de
 * cânone, e a §2 desta ficha argumenta que classificar vem **antes** de contar.
 * O que dá para fazer sem divergir é o que a JD1 ensinou: **a coreografia é o
 * alfabeto**. A §8 da F51 já manda a Mão Fantasma pôr uma peça dentro e deixar
 * outra fora antes de a criança agir — e é isso que o nível 1 passa a fazer.
 * Fica registrado como **P11**.
 */

/* ------------------------------------------------------------------ *
 *  Os atributos
 * ------------------------------------------------------------------ */

/**
 * Os três atributos da §3: *"objetos variados — diferem em forma, cor e
 * tamanho"*.
 *
 * Três, e não dois, porque o nível 3 precisa **reclassificar as mesmas peças**
 * por outro critério: com dois atributos, mudar o critério é sempre a mesma
 * troca, e a criança decora o par em vez de reler o conjunto.
 */
export type Atributo = "cor" | "forma" | "tamanho";

export type Cor = "vermelho" | "azul" | "amarelo";
export type Forma = "circulo" | "quadrado" | "triangulo";
export type Tamanho = "grande" | "pequeno";

export const CORES: Cor[] = ["vermelho", "azul", "amarelo"];
export const FORMAS: Forma[] = ["circulo", "quadrado", "triangulo"];
export const TAMANHOS: Tamanho[] = ["grande", "pequeno"];

/** Uma peça da cena. Os três atributos são independentes, sempre. */
export interface Peca {
  id: number;
  cor: Cor;
  forma: Forma;
  tamanho: Tamanho;
}

/** O critério de um laço: um atributo e o valor que ele exige. */
export interface Criterio {
  atributo: Atributo;
  valor: Cor | Forma | Tamanho;
}

/** A peça satisfaz o critério? */
export function satisfaz(p: Peca, c: Criterio): boolean {
  return p[c.atributo] === c.valor;
}

/**
 * O nome do critério, como a voz o diz.
 *
 * **Concordância de gênero**, que é a armadilha §6.5: *"os vermelhos"* mas
 * *"as vermelhas"* conforme a peça, e *"os grandes"*. A criança de 4 anos
 * **ouve** o enunciado — erro de concordância soa errado antes de parecer.
 */
export function rotuloDoCriterio(c: Criterio): string {
  if (c.atributo === "cor") return `${c.valor}s`;
  if (c.atributo === "tamanho") return `${c.valor}s`;
  const plural: Record<Forma, string> = {
    circulo: "círculos",
    quadrado: "quadrados",
    triangulo: "triângulos",
  };
  return plural[c.valor as Forma];
}

/* ------------------------------------------------------------------ *
 *  §5 — os cinco níveis, transcritos
 *
 *  | Nível | Conteúdo                                                |
 *  |-------|---------------------------------------------------------|
 *  |   1   | um laço, um critério (cor)                              |
 *  |   2   | dois laços, critérios excludentes                       |
 *  |   3   | **critério mudou** — reclassificar as mesmas peças       |
 *  |   4   | **dois laços que se cruzam** — interseção                |
 *  |   5   | a criança **descobre o critério** usado                  |
 * ------------------------------------------------------------------ */

/** A forma do exercício em cada nível. */
export type FormaDoNivel =
  /** Um laço. Cada peça vai para dentro ou fica fora. */
  | "um-laco"
  /** Dois laços que não se cruzam: nenhuma peça cabe nos dois. */
  | "dois-excludentes"
  /** As mesmas peças, o critério muda no meio do exercício. */
  | "reclassificar"
  /** Dois laços que se cruzam: há peça que pertence aos DOIS. */
  | "intersecao"
  /** As peças já vêm agrupadas; a pergunta é qual foi o critério. */
  | "descobrir";

export function formaDoNivel(nivel: number): FormaDoNivel {
  if (nivel <= 1) return "um-laco";
  if (nivel === 2) return "dois-excludentes";
  if (nivel === 3) return "reclassificar";
  if (nivel === 4) return "intersecao";
  return "descobrir";
}

/**
 * O nível 1 é **cor**, e a §5 escreve isso entre parênteses.
 *
 * Não é detalhe: cor é o atributo que uma criança de 4 anos nomeia primeiro, e
 * o único que ela reconhece sem precisar comparar duas peças. Tamanho é
 * relativo — *"grande"* só existe ao lado de um pequeno —, e forma exige
 * vocabulário. Começar por cor é começar pelo que ela já sabe dizer.
 */
export function atributoDoNivel(nivel: number): Atributo | null {
  if (nivel <= 1) return "cor";
  // Do nível 2 em diante o sorteio escolhe; o nível 5 não tem critério fixo.
  return null;
}

/** Quantas peças a cena põe na bandeja. */
export function pecasDoNivel(nivel: number): number {
  // Seis é o mínimo para haver o que classificar E o que deixar de fora em
  // todos os arranjos: com quatro, o nível 4 sai sem peça na interseção ou sem
  // peça fora, e o degrau perde justamente o que ele ensina.
  if (nivel <= 2) return 6;
  return 8;
}

/**
 * A Mão Fantasma age? Só no nível 1 — §8, e a regra §7.1-bis.
 *
 * Ela demonstra **um dentro e um fora**, nesta ordem, e devolve a tela. Nunca
 * resolve o exercício: a §8 mostra dois beats e a bandeja continua cheia.
 */
export function temMaoFantasma(nivel: number): boolean {
  return nivel <= 1;
}

/* ------------------------------------------------------------------ *
 *  O destino de cada peça
 * ------------------------------------------------------------------ */

/** Onde uma peça deve terminar. `[]` significa **fora** — e fora é resposta. */
export function destinoCerto(p: Peca, criterios: Criterio[]): number[] {
  return criterios.map((c, i) => (satisfaz(p, c) ? i : -1)).filter(i => i >= 0);
}

/** A cena tem pelo menos uma peça que fica de fora? §9 exige. */
export function temPecaDeFora(pecas: Peca[], criterios: Criterio[]): boolean {
  return pecas.some(p => destinoCerto(p, criterios).length === 0);
}

/** A cena tem pelo menos uma peça na interseção? O nível 4 exige. */
export function temIntersecao(pecas: Peca[], criterios: Criterio[]): boolean {
  return pecas.some(p => destinoCerto(p, criterios).length >= 2);
}

/* ------------------------------------------------------------------ *
 *  §6 — o diagnóstico
 * ------------------------------------------------------------------ */

/**
 * O que a criança fez com uma peça.
 *
 * ### Por que existe `tentativas`, e por que sem ele o diagnóstico é ficção
 *
 * A §4 manda o erro ser **empurrado de volta**: *"a peça é empurrada de volta e
 * o critério é repetido"*. Sem penalidade, sem X — ela tenta de novo. É a mesma
 * regra do "silêncio é proibido" da F01.
 *
 * A consequência é que **o estado final está sempre certo**. Se o diagnóstico
 * olhasse só onde as peças pararam, `TUDO_CABE` — o alvo declarado da ficha —
 * nunca poderia disparar, porque a peça que não pertence nunca chega a ficar
 * dentro do laço. As quatro tags da §6 existiriam no código e nenhuma
 * aconteceria na vida.
 *
 * O que revela a hipótese é a **tentativa recusada**, não o repouso. Mesma
 * família do `recontouAntesDeResponder` da F01: um gesto que não muda a tela e
 * diz tudo sobre o que ela pensou.
 */
export interface ColocacaoDaPeca {
  peca: Peca;
  /** Onde ela FICOU. Vazio = fora, que é resposta certa. */
  onde: number[];
  /** Os destinos que ela tentou e foram recusados. Aqui mora o diagnóstico. */
  tentativas: number[][];
}

/** A leitura da rodada inteira. */
export interface AcaoDeClassificacao {
  colocacoes: ColocacaoDaPeca[];
  criterios: Criterio[];
  forma: FormaDoNivel;
  /**
   * O critério ANTERIOR, no nível de reclassificação.
   *
   * Sem ele não há como distinguir *"errou"* de *"continuou no critério de
   * antes"* — e essas duas coisas pedem aulas diferentes.
   */
  criterioAnterior?: Criterio;
}

/**
 * O que a rodada revela — §6, do mais específico ao mais genérico.
 *
 * A ordem é a armadilha §6.8. `TUDO_CABE` vem primeiro porque é o alvo
 * declarado da ficha: uma criança que força tudo para dentro pode até acertar
 * as peças que pertencem, e acertar não apaga o que ela revelou.
 */
export function diagnosticar(a: AcaoDeClassificacao): MisconceptionTagType | undefined {
  const comTentativa = a.colocacoes.filter(c => c.tentativas.length > 0);
  if (comTentativa.length === 0) return undefined;

  // ── Interseção: tentou um laço só o que pertencia aos dois.
  if (a.forma === "intersecao") {
    const daIntersecao = a.colocacoes.filter(c => destinoCerto(c.peca, a.criterios).length >= 2);
    if (daIntersecao.some(c => c.tentativas.some(t => t.length === 1))) {
      return MisconceptionTag.SEM_INTERSECAO;
    }
  }

  // ── Reclassificação: as tentativas obedecem ao critério ANTERIOR.
  //
  // ### Por que esta vem ANTES do `TUDO_CABE`
  //
  // No nível 3 quem continua no critério antigo **sempre** vai tentar pôr num
  // laço uma peça que não pertence — porque o critério mudou. Ou seja, ela
  // dispara `TUDO_CABE` por construção. Com o `TUDO_CABE` na frente, a tag que
  // descreve o degrau inteiro nunca chegaria ao Radar, e a criança seria
  // mandada treinar "o que não pertence fica fora" quando o que ela não fez foi
  // reler o conjunto. É a armadilha §6.8, e o teste que a pegou trocou a ordem.
  if (a.criterioAnterior) {
    const comoAntes: Criterio[] = [a.criterioAnterior];
    const seguiuOAnterior = comTentativa.some(c => {
      const certoAntes = destinoCerto(c.peca, comoAntes);
      return c.tentativas.some(t =>
        t.length === certoAntes.length && certoAntes.every(i => t.includes(i)));
    });
    if (seguiuOAnterior) return MisconceptionTag.NAO_RECLASSIFICA;
  }

  // ── O alvo da ficha: forçou para dentro o que deveria ficar de fora.
  //
  // É o que a §2 chama de "o que quase ninguém ensina". Uma criança que tenta
  // enfiar tudo num laço pode até terminar a rodada certa — o erro é empurrado
  // de volta —, e terminar certa não apaga o que ela revelou. Diagnosticar
  // pelo repouso deixaria isso passar sempre.
  const deviamFicarFora = a.colocacoes.filter(c => destinoCerto(c.peca, a.criterios).length === 0);
  if (deviamFicarFora.some(c => c.tentativas.some(t => t.length > 0))) {
    return MisconceptionTag.TUDO_CABE;
  }

  // ── Agrupou por OUTRO atributo: a tentativa é coerente com um critério que
  // não é o do laço. É erro de leitura do critério, não de descuido.
  const outros: Atributo[] = (["cor", "forma", "tamanho"] as Atributo[])
    .filter(at => !a.criterios.some(c => c.atributo === at));
  for (const at of outros) {
    for (const valor of valoresDe(at)) {
      const alternativo: Criterio[] = [{ atributo: at, valor }];
      const coerente = comTentativa.every(c => {
        const certo = destinoCerto(c.peca, alternativo);
        return c.tentativas.some(t => t.length === certo.length && certo.every(i => t.includes(i)));
      });
      if (coerente) return MisconceptionTag.CRITERIO_ERRADO;
    }
  }

  return MisconceptionTag.CRITERIO_ERRADO;
}

/** Os valores possíveis de um atributo. */
export function valoresDe(a: Atributo): (Cor | Forma | Tamanho)[] {
  if (a === "cor") return [...CORES];
  if (a === "forma") return [...FORMAS];
  return [...TAMANHOS];
}

/**
 * A rodada foi perfeita: tudo no lugar **e nenhuma tentativa recusada**.
 *
 * Terminar com tudo certo não basta — o erro é empurrado de volta, então toda
 * rodada terminada está certa. O que separa "entendeu" de "acertou tentando" é
 * não ter havido tentativa.
 */
export function classificacaoPerfeita(a: AcaoDeClassificacao): boolean {
  return a.colocacoes.every(c => {
    const certo = destinoCerto(c.peca, a.criterios);
    const noLugar = certo.length === c.onde.length && certo.every(i => c.onde.includes(i));
    return noLugar && c.tentativas.length === 0;
  });
}

/**
 * §9 — a prova específica da F51.
 *
 * O palco só encerra quando todas as peças têm um destino correto, mas esta
 * função não confia nessa propriedade implícita: se receber uma ação final
 * inconsistente, não emite evidência. Recuperar de uma tentativa recusada não
 * invalida a prova — a ficha exige uma peça corretamente deixada fora, não uma
 * rodada sem erro anterior.
 */
export function evidenciasDe(a: AcaoDeClassificacao): string[] {
  const rodadaCorreta = a.colocacoes.every(c => {
    const certo = destinoCerto(c.peca, a.criterios);
    return certo.length === c.onde.length && certo.every(i => c.onde.includes(i));
  });
  if (!rodadaCorreta) return [];

  const decidiuNaoPertence = a.colocacoes.some(c =>
    destinoCerto(c.peca, a.criterios).length === 0 && c.onde.length === 0,
  );
  return decidiuNaoPertence ? [Evidencia.NAO_PERTENCE] : [];
}

/* ------------------------------------------------------------------ *
 *  §7 — as falas, transcritas
 * ------------------------------------------------------------------ */

export const FALAS = {
  audioPrompt: "Coloque cada peça no lugar certo.",
  howto: "Olhe a cor de cada peça. As vermelhas vão para dentro, as outras ficam fora.",
  explain: "Essa peça é vermelha? Se não for, ela fica do lado de fora.",
  /**
   * §4: *"ao deixar uma peça fora, ela também brilha — e a voz confirma:
   * 'isso, essa não é vermelha!'"*.
   *
   * A fala é gerada a partir do critério, e não fixa em "vermelha", porque o
   * critério muda a cada nível. Fixá-la faria a voz dizer "vermelha" sobre um
   * laço de triângulos — o §6.27: quantificador em texto é promessa que o
   * desenho tem de cumprir.
   */
  foraCerto: (c: Criterio) => `Isso! Essa não é ${nomeSingular(c)}.`,
  /** §4, erro suave: *"o critério é repetido, com o atributo destacado"*. */
  erroSuave: (c: Criterio) => `Este laço é só dos ${rotuloDoCriterio(c)}.`,
} as const;

/** O nome do critério no singular, concordando com "essa peça". */
export function nomeSingular(c: Criterio): string {
  if (c.atributo === "forma") {
    const f: Record<Forma, string> = {
      circulo: "um círculo",
      quadrado: "um quadrado",
      triangulo: "um triângulo",
    };
    return f[c.valor as Forma];
  }
  // "essa não é vermelha" / "essa não é grande" — feminino, concordando com
  // "peça". Cor e tamanho são adjetivos; forma é substantivo, e por isso o
  // ramo acima existe.
  const feminino: Record<string, string> = {
    vermelho: "vermelha", azul: "azul", amarelo: "amarela",
    grande: "grande", pequeno: "pequena",
  };
  return feminino[c.valor] ?? String(c.valor);
}
