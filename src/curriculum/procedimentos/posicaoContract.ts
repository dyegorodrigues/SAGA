import {
  FALAS,
  Par,
  PARES,
  Preposicao,
  parDoNivel,
  produzNivel,
} from "./posicaoProcedure";

/**
 * O contrato da cena da F47: o que o `ShapeCanvas` em **modo cena** recebe
 * pronto.
 *
 * A geometria nasce aqui, em **pixels**, e não dentro do render. Percentual
 * sobre campo não-quadrado foi o que estragou o arranjo disperso da F01 (§6.29)
 * — e aqui a conta é pior, porque a resposta certa **é** uma relação espacial:
 * um objeto 4px acima da linha errada não é feiura, é a questão trocada.
 */

/** O campo da cena, em pixels, num aparelho de 390. */
export const LARGURA_DA_CENA = 326;
export const ALTURA_DA_CENA = 190;

/** §8.3-bis: área de toque ≥ 80px. */
export const ALVO_MINIMO = 80;

export interface Ponto {
  x: number;
  y: number;
}

/** Uma peça do referencial — o vocabulário do `ShapeCanvas`, em pixels. */
export interface PecaDoReferencial {
  forma: "rectangle" | "triangle" | "circle";
  x: number;
  y: number;
  largura: number;
  altura: number;
  cor: string;
  /** Só o contorno, sem preenchimento: a caixa aberta do "dentro/fora". */
  contorno?: boolean;
}

export interface Referencial {
  id: "mesa" | "caixa" | "muro" | "arvore";
  /**
   * A cena está espelhada?
   *
   * Sem isto, "em cima" era **sempre** o objeto da esquerda, "atrás" sempre o da
   * esquerda e "fora" sempre o da direita — em toda semente, em todo nível. Uma
   * criança acerta três vezes seguidas escolhendo por lado e recebe domínio de
   * uma competência que não praticou. É o mesmo defeito que o sorteio do emoji
   * já cobria; o print mostrou que a POSIÇÃO na tela tinha o mesmo vazamento.
   */
  espelhado: boolean;
  /** "a mesa" — para a fala do erro do referencial. */
  nome: string;
  /** "da mesa" — a contração que entra no enunciado. */
  doNome: string;
  pecas: PecaDoReferencial[];
  /** Onde o dedo acerta o referencial (ele também é tocável — §6). */
  toque: { x: number; y: number; largura: number; altura: number };
}

/** Um dos dois objetos da cena. §3: *"UM referencial e **dois objetos**"*. */
export interface ObjetoDaCena {
  emoji: string;
  /** Onde ele está em relação ao referencial. É a resposta, quando pedida. */
  posicao: Preposicao;
  x: number;
  y: number;
  tamanho: number;
  /** Desenhado atrás do referencial? É assim que "atrás" se vê num plano. */
  atras?: boolean;
}

export interface PosicaoSpec {
  nivel: number;
  par: Par;
  /** A preposição do enunciado. */
  pedida: Preposicao;
  /** §5, nível 5: em vez de apontar, ela coloca. */
  produz: boolean;
  referencial: Referencial;
  objetos: ObjetoDaCena[];
  /**
   * No nível 5, o objeto que ela move e onde a resposta certa cai.
   *
   * ⚠️ Ele começa **fora do campo**, numa bandeja embaixo da cena. Todo ponto
   * dentro do campo já é uma resposta — no par cima/baixo, qualquer lugar é "em
   * cima" ou "embaixo" de alguma coisa —, então um objeto que abre posicionado
   * abre metade das vezes já certo.
   */
  alvoDaProducao?: { emoji: string; destinoCerto: Ponto };
  enunciado: string;
  falado: string;
  resposta: Preposicao;
}

/**
 * Os temas da §1 — *resgate* e *selva*. Casca pura (§12.5-ter): a competência é
 * a mesma, e o referencial **não** vem do tema. Mesa, caixa, muro e árvore são
 * escolhidos pelo par de posições, porque é a geometria que decide se a relação
 * é legível — uma árvore não mostra "dentro".
 */
export const TEMAS_DA_POSICAO: Record<string, string[]> = {
  selva: ["🐒", "🦜", "🐍", "🦋"],
  resgate: ["🐶", "🚒", "🧸", "🎈"],
};

/**
 * O nome de cada objeto, com artigo.
 *
 * O nível 5 pedia *"Coloque **este** em cima da mesa!"* — o print mostrou que
 * "este" não aponta para nada quando a criança não tem cursor nem mão para
 * seguir. E o rótulo de acessibilidade dizia "Objeto em cima da mesa", que não
 * diz **qual**. Com o nome, a §6.5 sai de graça: o artigo já concorda.
 */
export const NOMES: Record<string, string> = {
  "🐒": "o macaco", "🦜": "a arara", "🐍": "a cobra", "🦋": "a borboleta",
  "🐶": "o cachorro", "🚒": "o caminhão", "🧸": "o urso", "🎈": "o balão",
};

export function nomeDoObjeto(emoji: string): string {
  return NOMES[emoji] ?? "o objeto";
}

const MADEIRA = "#B45309";
const PEDRA = "#94A3B8";
const FOLHA = "#15803D";

/**
 * ⚠️ O referencial é escolhido pelo **par**, não pelo tema.
 *
 * A §2 diz que a criança trava porque *"o referencial muda"* — e cada relação
 * só é legível em cima de uma geometria: "dentro" precisa de algo que contenha,
 * "atrás" precisa de algo que **tape**, "esquerda" precisa de algo estreito o
 * bastante para ter dois lados visíveis. Sortear a mesa para o "dentro/fora"
 * produziria uma cena em que a resposta certa não é observável.
 */
export function referencialDoPar(par: Par, sorteio: () => number): Referencial {
  const meio = LARGURA_DA_CENA / 2;
  const espelhado = sorteio() < 0.5;

  if (par === "cima-baixo") {
    // A altura da mesa varia: com a mesa sempre no meio, "embaixo" e "a metade
    // de baixo da tela" seriam a mesma coisa em toda questão, e a criança
    // poderia acertar sem olhar a mesa uma única vez.
    const yTampo = 82 + Math.floor(sorteio() * 27);
    return {
      id: "mesa",
      espelhado,
      nome: "A mesa",
      doNome: "da mesa",
      pecas: [
        { forma: "rectangle", x: meio, y: yTampo, largura: 204, altura: 14, cor: MADEIRA },
        { forma: "rectangle", x: meio - 88, y: yTampo + 30, largura: 13, altura: 46, cor: MADEIRA },
        { forma: "rectangle", x: meio + 88, y: yTampo + 30, largura: 13, altura: 46, cor: MADEIRA },
      ],
      toque: { x: meio, y: yTampo, largura: 204, altura: 46 },
    };
  }

  if (par === "dentro-fora") {
    // Espelhada, a caixa vai para a direita e o "fora" nasce à esquerda.
    const xCaixa = (espelhado ? 205 : 96) + Math.floor(sorteio() * 26);
    return {
      id: "caixa",
      espelhado,
      nome: "A caixa",
      doNome: "da caixa",
      // Contorno, não bloco: um retângulo preenchido não tem "dentro" visível —
      // o objeto lá dentro sumiria debaixo dele.
      pecas: [{ forma: "rectangle", x: xCaixa, y: 106, largura: 132, altura: 104, cor: MADEIRA, contorno: true }],
      toque: { x: xCaixa, y: 106, largura: 132, altura: 104 },
    };
  }

  if (par === "frente-atras") {
    return {
      id: "muro",
      espelhado,
      nome: "O muro",
      doNome: "do muro",
      pecas: [{ forma: "rectangle", x: meio, y: 142, largura: 244, altura: 46, cor: PEDRA }],
      toque: { x: meio, y: 142, largura: 244, altura: 46 },
    };
  }

  const xArvore = 140 + Math.floor(sorteio() * 47);
  return {
    id: "arvore",
    espelhado,
    nome: "A árvore",
    doNome: "da árvore",
    pecas: [
      { forma: "rectangle", x: xArvore, y: 142, largura: 26, altura: 76, cor: MADEIRA },
      { forma: "triangle", x: xArvore, y: 74, largura: 124, altura: 84, cor: FOLHA },
    ],
    toque: { x: xArvore, y: 108, largura: 124, altura: 144 },
  };
}

/**
 * Onde cada preposição do par põe o objeto, **em relação ao referencial**.
 *
 * Toda posição sai daqui — nenhuma é escrita à mão na tela. É o que garante que
 * a cena e a resposta não possam divergir: a mesma função que desenha é a que
 * responde.
 */
export type Colocacao = Omit<ObjetoDaCena, "emoji" | "posicao">;

export function ondeFica(par: Par, prep: Preposicao, ref: Referencial): Colocacao {
  const meio = LARGURA_DA_CENA / 2;
  // O espelho troca os dois objetos de LADO sem mexer na relação: "em cima"
  // continua em cima, mas deixa de ser sempre o da esquerda.
  const lado = ref.espelhado ? -1 : 1;

  if (par === "cima-baixo") {
    const yTampo = ref.pecas[0].y;
    return prep === "em cima"
      ? { x: meio - 40 * lado, y: yTampo - 33, tamanho: 44 }
      : { x: meio + 40 * lado, y: yTampo + 44, tamanho: 44 };
  }

  if (par === "dentro-fora") {
    const c = ref.pecas[0];
    return prep === "dentro"
      ? { x: c.x, y: c.y, tamanho: 44 }
      // Fora: do lado da caixa, nunca em cima nem embaixo dela — senão a cena
      // responde "em cima" e "fora" ao mesmo tempo, e a §6.2 manda recusar o
      // sorteio que produz duas respostas certas.
      : { x: c.x + (c.largura / 2 + 46) * lado, y: c.y, tamanho: 44 };
  }

  if (par === "frente-atras") {
    // "Atrás" é oclusão: o objeto é desenhado SOB o muro e aparece por cima da
    // borda. É a única leitura de "atrás" que um plano bidimensional oferece —
    // e a §4 conta com ela ao mandar o erro dizer onde o objeto está.
    const xAtras = ref.espelhado ? 232 : 96;
    const xFrente = ref.espelhado ? 96 : 232;
    return prep === "atrás"
      ? { x: xAtras, y: 112, tamanho: 52, atras: true }
      : { x: xFrente, y: 152, tamanho: 52 };
  }

  const x = ref.pecas[0].x;
  return prep === "à esquerda"
    ? { x: x - 72, y: 132, tamanho: 44 }
    : { x: x + 72, y: 132, tamanho: 44 };
}

export function construirPosicaoSpec(nivel: number, sorteio: () => number): PosicaoSpec {
  const par = parDoNivel(nivel);
  const produz = produzNivel(nivel);
  const [a, b] = PARES[par];
  const pedida = sorteio() < 0.5 ? a : b;
  const referencial = referencialDoPar(par, sorteio);

  const temas = Object.keys(TEMAS_DA_POSICAO);
  const tema = temas[Math.floor(sorteio() * temas.length) % temas.length];
  const pool = [...TEMAS_DA_POSICAO[tema]];
  const primeiro = pool.splice(Math.floor(sorteio() * pool.length) % pool.length, 1)[0];
  const segundo = pool[Math.floor(sorteio() * pool.length) % pool.length];

  // Qual emoji vai em qual posição é sorteado: com o macaco sempre em cima, a
  // criança aprende o macaco, não a preposição.
  const trocar = sorteio() < 0.5;
  const objetos: ObjetoDaCena[] = [a, b].map((prep, i) => ({
    emoji: (i === 0) === trocar ? segundo : primeiro,
    posicao: prep,
    ...ondeFica(par, prep, referencial),
  }));

  if (produz) {
    // §5, nível 5: a cena abre com UM objeto fora de posição, e ela o leva.
    // Dois objetos aqui devolveriam a pergunta de reconhecimento por baixo do
    // pano — bastaria arrastar o que já estava certo.
    const destino = ondeFica(par, pedida, referencial);
    return {
      nivel,
      par,
      pedida,
      produz,
      referencial,
      objetos: [],
      alvoDaProducao: { emoji: primeiro, destinoCerto: { x: destino.x, y: destino.y } },
      enunciado: FALAS.pedido(pedida, referencial.doNome, nomeDoObjeto(primeiro)),
      falado: FALAS.pedido(pedida, referencial.doNome, nomeDoObjeto(primeiro)),
      resposta: pedida,
    };
  }

  return {
    nivel,
    par,
    pedida,
    produz,
    referencial,
    objetos,
    enunciado: FALAS.pergunta(pedida, referencial.doNome),
    falado: FALAS.pergunta(pedida, referencial.doNome),
    resposta: pedida,
  };
}

/**
 * A qual preposição um ponto solto corresponde — o juiz do nível 5.
 *
 * A criança não escolhe entre duas zonas marcadas: ela solta o objeto onde
 * quiser e a cena lê a relação. Marcar as zonas devolveria a múltipla escolha
 * que o nível 5 existe para tirar.
 */
export function posicaoDoPonto(spec: PosicaoSpec, p: Ponto): Preposicao {
  const ref = spec.referencial.pecas[0];

  if (spec.par === "cima-baixo") return p.y < ref.y ? "em cima" : "embaixo";
  if (spec.par === "esquerda-direita") return p.x < ref.x ? "à esquerda" : "à direita";
  if (spec.par === "dentro-fora") {
    const dentro = Math.abs(p.x - ref.x) <= ref.largura / 2 && Math.abs(p.y - ref.y) <= ref.altura / 2;
    return dentro ? "dentro" : "fora";
  }
  // Frente/atrás: acima da borda do muro, o objeto está espiando por cima —
  // atrás. Sobre o muro ou abaixo dele, ele o tapa — na frente.
  return p.y < ref.y - ref.altura / 2 ? "atrás" : "na frente";
}

/**
 * ⚠️ Os dois objetos não se tocam, e nenhum sai do campo.
 *
 * Cobrado em teste sobre os quatro pares e todas as sementes. Dois objetos
 * sobrepostos fazem o dedo cair no errado, e o §8.3-bis diz que erro de dedo não
 * pode ser requisito. Sair do campo é pior: a resposta certa fica invisível.
 */
export function cenaEValida(spec: PosicaoSpec): boolean {
  const dentroDoCampo = (o: { x: number; y: number; tamanho: number }) =>
    o.x - o.tamanho / 2 >= 0 && o.x + o.tamanho / 2 <= LARGURA_DA_CENA
    && o.y - o.tamanho / 2 >= 0 && o.y + o.tamanho / 2 <= ALTURA_DA_CENA;

  if (!spec.objetos.every(dentroDoCampo)) return false;
  if (spec.objetos.length === 2) {
    const [p, q] = spec.objetos;
    const folga = (p.tamanho + q.tamanho) / 2;
    if (Math.abs(p.x - q.x) < folga && Math.abs(p.y - q.y) < folga) return false;
  }
  return spec.referencial.pecas.every(peca =>
    peca.x - peca.largura / 2 >= -1 && peca.x + peca.largura / 2 <= LARGURA_DA_CENA + 1
    && peca.y - peca.altura / 2 >= -1 && peca.y + peca.altura / 2 <= ALTURA_DA_CENA + 1);
}

/**
 * ⚠️ A posição de cada objeto é a que a cena mostra.
 *
 * Parece tautológico e não é: era exatamente aqui que o gerador antigo mentia —
 * ele escrevia `"🐈\n📦"` e afirmava "em cima" sem que nada na tela sustentasse.
 */
export function cadaObjetoEstaOndeDiz(spec: PosicaoSpec): boolean {
  return spec.objetos.every(o => posicaoDoPonto(spec, { x: o.x, y: o.y }) === o.posicao);
}
