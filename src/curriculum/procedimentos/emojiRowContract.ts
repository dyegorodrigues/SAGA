import {
  ArranjoDaFileira,
  ConfiguracaoDaMao,
  ModoDaFileira,
  UnidadeDePadrao,
  alternativasDoRelance,
  alternativaCentral,
  arranjoDoOlhometro,
  comprimentoDaSequencia,
  configuracaoDaMao,
  duasMaos,
  exposicaoDaMao,
  exposicaoDoOlhometro,
  lacunaNoMeio,
  mostraMolduraDaUnidade,
  quantidadeDaMao,
  quantidadeDoOlhometro,
  unidadesDoNivel,
  FALAS,
} from "./emojiRowProcedure";

/**
 * O contrato da fileira: o que a tela recebe pronto.
 *
 * As posições, as configurações de dedo e a sequência do padrão nascem **aqui**,
 * não no componente — mesma razão do `touchCountContract`: uma sonda que mede
 * layout precisa que a cena seja idêntica em duas execuções, e um sorteio dentro
 * do render muda o desenho a cada quadro (§6.31).
 *
 * ### A ressalva honesta sobre "a incógnita não carrega valor"
 *
 * A regra do Padrão Ouro §3 — *a fatia da incógnita não carrega valor* — não se
 * aplica igual aqui, e vale dizer por quê em vez de fingir que se aplica. Nestas
 * fichas **o desenho É a resposta**: a pergunta é "quantos você viu", e a tela
 * precisa desenhar essa quantidade para haver o que ver. Impedir o componente de
 * saber o número seria impedi-lo de desenhar a cena.
 *
 * O que continua valendo, e é verificado:
 *
 * 1. o **enunciado** nunca traz o numeral (`enunciadoNaoEntregaResposta`);
 * 2. os objetos **não estão na tela** quando as alternativas sobem — é a fase
 *    que garante, não a boa vontade do componente;
 * 3. o `explain` nunca manda contar (§7 das duas fichas).
 */

/* ------------------------------------------------------------------ *
 *  O roteiro cinematográfico — §4
 * ------------------------------------------------------------------ */

/**
 * Os tempos da §4, em milissegundos.
 *
 * Estão em dado, e não espalhados em `setTimeout` pelo componente, porque a §4
 * é especificação: quem mexer num número aqui está mexendo na ficha, e o teste
 * que compara os dois avisa.
 */
export interface RoteiroDaFileira {
  /** "prepare o olho…" — um ponto pisca no centro e fixa o olhar. */
  preparacao: number;
  /** Três pulsos suaves: 3… 2… 1. Só visual, sem número escrito. */
  regressiva: number;
  /** Quanto tempo os objetos ficam. Vem do NÍVEL, não do modo. */
  flash: number;
  /** O silêncio depois do sumiço: deixa a imagem assentar. */
  silencio: number;
  /** Os objetos reaparecem confirmando o que ela viu. */
  revelacaoNoAcerto: number;
  /** O erro suave: reaparecem agrupados, sem penalidade. */
  revelacaoNoErro: number;
}

/**
 * A regra do flash, escrita como constante para não virar opinião de quem
 * implementa: **aparecimento e sumiço instantâneos**. §4 das duas fichas:
 * *"qualquer fade permite contagem sequencial e destrói a competência"*.
 */
export const TRANSICAO_DO_FLASH_MS = 0;

/** O roteiro do nível, por modo. Os tempos fixos são §4; o flash é §5. */
export function roteiroDoNivel(modo: ModoDaFileira, nivel: number): RoteiroDaFileira {
  const flash = modo === "flash-mao" ? exposicaoDaMao(nivel) : exposicaoDoOlhometro(nivel);
  return {
    preparacao: 1200,
    regressiva: 900,
    flash,
    silencio: 400,
    // JD1 §4 dá 800ms na confirmação e 1,5s no erro; JD2 §4 dá 1,4s e 1,8s,
    // porque lá a revelação mostra a mão cheia em bloco e os extras piscando —
    // é mais coisa para ler no mesmo tempo.
    revelacaoNoAcerto: modo === "flash-mao" ? 1400 : 800,
    revelacaoNoErro: modo === "flash-mao" ? 1800 : 1500,
  };
}

/* ------------------------------------------------------------------ *
 *  As posições — arranjo de objetos
 * ------------------------------------------------------------------ */

/** Um objeto na área de relance, já posicionado (percentual da área). */
export interface PontoDaFileira {
  x: number;
  y: number;
}

/** Margem para o objeto não encostar na borda da área (§6.16). */
const MARGEM = 14;

/**
 * O maior espaçamento entre vizinhos numa fila, em pontos percentuais.
 *
 * Sem teto, dois objetos vão para as duas pontas e a criança precisa varrer a
 * tela para ver que são dois — numa ficha cujo exercício inteiro é **ver o
 * conjunto de uma vez**, isso não é dificuldade, é sabotagem. Mesma constante e
 * mesma razão do `touchCountContract`.
 */
const PASSO_MAXIMO = 18;

/**
 * Distância mínima entre centros no disperso, em pontos percentuais da ALTURA.
 *
 * ### O erro que isto corrige
 *
 * A primeira versão media `hypot(dx, dy)` com os dois em percentual, como se o
 * campo fosse quadrado. Ele não é: 330 × 146. Vinte e seis por cento na
 * horizontal são 86px; na vertical, 38px. Dois objetos "afastados" verticalmente
 * ficavam a 38px um do outro — e o desenho tem 40px. A sonda pegou uma colisão
 * de 27% na semente 31415, e a criança teria visto uma lagarta em cima da outra.
 *
 * É a mesma família do padrão de dado esticado, e do §6.33: **percentual não é
 * distância** quando as duas dimensões não são iguais. A conta abaixo corrige
 * o eixo x pela proporção antes de medir.
 */
const AFASTAMENTO = 30;

/**
 * A proporção do campo do relance — largura ÷ altura.
 *
 * Vem do palco (`ALTURA_DA_AREA − FAIXA_DO_NUMERAL` = 146px de altura para
 * ~330px de largura). Está escrita aqui porque a geometria mora no contrato,
 * e um teste compara o resultado em PIXEL, não em percentual, para que mudar a
 * altura da área sem mexer aqui quebre em vez de encostar dois objetos.
 */
export const PROPORCAO_DO_CAMPO = 330 / 146;

/**
 * O padrão de dado, para 1 a 5 — JD1 §5, nível 3 e 4.
 *
 * Não é enfeite nem sorteio: é **a figura do dado**, que a ficha nomeia como
 * andaime perceptual ("o formato ⚄ é reconhecível como um todo"). Uma disposição
 * "quase de dado", sorteada, não seria reconhecível e o nível 3 perderia
 * justamente o apoio que o distingue do 5.
 */
export const PADRAO_DE_DADO: Record<number, PontoDaFileira[]> = {
  1: [{ x: 50, y: 50 }],
  2: [{ x: 28, y: 28 }, { x: 72, y: 72 }],
  3: [{ x: 25, y: 25 }, { x: 50, y: 50 }, { x: 75, y: 75 }],
  4: [{ x: 28, y: 28 }, { x: 72, y: 28 }, { x: 28, y: 72 }, { x: 72, y: 72 }],
  5: [{ x: 28, y: 28 }, { x: 72, y: 28 }, { x: 50, y: 50 }, { x: 28, y: 72 }, { x: 72, y: 72 }],
};

/**
 * Onde os objetos ficam.
 *
 * - `fila`: uma linha, espaçamento igual e limitado — o arranjo fácil.
 * - `dado`: a figura do dado, fixa.
 * - `disperso`: sorteado com afastamento mínimo. O degrau final da JD1: sem
 *   figura de apoio, subitizar exige percepção de quantidade, não de forma.
 */
export function posicionarFileira(
  total: number,
  arranjo: ArranjoDaFileira,
  sorteio: () => number,
): PontoDaFileira[] {
  if (arranjo === "dado" && PADRAO_DE_DADO[total]) {
    return PADRAO_DE_DADO[total].map(p => ({ ...p }));
  }

  const util = 100 - 2 * MARGEM;

  if (arranjo === "fila" || !PADRAO_DE_DADO[total]) {
    const larguraUsada = total > 1 ? Math.min(util, PASSO_MAXIMO * (total - 1)) : 0;
    const inicio = MARGEM + (util - larguraUsada) / 2;
    return Array.from({ length: total }, (_, i) => ({
      x: total > 1 ? inicio + (i * larguraUsada) / (total - 1) : 50,
      y: 50,
    }));
  }

  const fora: PontoDaFileira[] = [];
  for (let i = 0; i < total; i += 1) {
    let melhor: PontoDaFileira | null = null;
    let melhorDistancia = -1;
    // Teto de tentativas: impede laço infinito quando o afastamento pedido não
    // cabe de jeito nenhum, e cede para a melhor posição encontrada.
    for (let t = 0; t < 30; t += 1) {
      const cand = { x: MARGEM + sorteio() * util, y: MARGEM + sorteio() * util };
      const d = fora.length === 0
        ? Infinity
        : Math.min(...fora.map(p => Math.hypot(
          (p.x - cand.x) * PROPORCAO_DO_CAMPO, p.y - cand.y)));
      if (d >= AFASTAMENTO) { melhor = cand; break; }
      if (d > melhorDistancia) { melhorDistancia = d; melhor = cand; }
    }
    fora.push(melhor as PontoDaFileira);
  }
  return fora;
}

/* ------------------------------------------------------------------ *
 *  A mão — JD2 §3
 * ------------------------------------------------------------------ */

/**
 * Os dedos, na ordem em que a mão canônica os levanta.
 *
 * A JD2 §5 escreve o nível 1 como *"dedos **a partir do polegar**"*. A ordem
 * precisa ser dado para que "canônica" signifique sempre a mesma figura — é ela
 * que a criança guarda, e uma canônica que muda de forma não ancora nada.
 */
export const DEDOS = ["polegar", "indicador", "medio", "anelar", "minimo"] as const;
export type Dedo = typeof DEDOS[number];

/** Uma mão da cena: quais dedos estão levantados. */
export interface MaoSpec {
  /** Levantados, na ordem de `DEDOS`. */
  levantados: Dedo[];
  /** Mão cheia — a âncora do 5 explícita (§5, nível 3). */
  cheia: boolean;
}

/** Quantos dedos esta mão mostra. */
export function dedosDe(m: MaoSpec): number {
  return m.levantados.length;
}

/** A mão canônica de `n` dedos: levanta a partir do polegar. */
export function maoCanonica(n: number): MaoSpec {
  return { levantados: DEDOS.slice(0, n), cheia: n === 5 };
}

/** Uma mão de `n` dedos com configuração sorteada (§5, nível 2 em diante). */
export function maoLivre(n: number, sorteio: () => number): MaoSpec {
  const restantes = [...DEDOS];
  const levantados: Dedo[] = [];
  for (let i = 0; i < n; i += 1) {
    const k = Math.floor(sorteio() * restantes.length) % restantes.length;
    levantados.push(restantes.splice(k, 1)[0]);
  }
  // A ordem de DEDOS é a ordem do desenho: a mão é sempre a mesma figura, e só
  // quais dedos sobem é que muda. Guardar na ordem do sorteio faria duas cenas
  // iguais compararem diferente nos testes, sem nenhuma diferença na tela.
  return {
    levantados: DEDOS.filter(d => levantados.includes(d)),
    cheia: n === 5,
  };
}

/**
 * As mãos da cena, para o total e a configuração do nível.
 *
 * A regra dura do nível 3 é a **mão cheia obrigatória** (§5: "é o andaime que
 * instala a âncora — a criança vê 5+2 antes de precisar decompor sozinha"), e a
 * do nível 5 é o inverso: **nenhuma mão cheia**, porque ali o andaime some.
 */
export function maosDaCena(
  total: number,
  config: ConfiguracaoDaMao,
  sorteio: () => number,
): MaoSpec[] {
  if (!duasMaos(config)) {
    return [config === "canonica" ? maoCanonica(total) : maoLivre(total, sorteio)];
  }

  if (config === "duas-com-cheia") {
    // Uma cheia + o resto. Com total 5 a segunda fica vazia, e uma mão de zero
    // dedos ao lado de uma cheia é ruído: ela some da cena.
    const resto = total - 5;
    const maos = [maoCanonica(5)];
    if (resto > 0) maos.push(maoLivre(resto, sorteio));
    return maos;
  }

  if (config === "duas-sem-cheia") {
    // Sem nenhuma mão cheia. Com 10 dedos isso é impossível — 10 só existe como
    // 5+5 —, e a ficha põe 10 na faixa do nível 5. Quando não cabe, a cena cede
    // para a distribuição livre: preferir uma mão cheia a mentir sobre o total.
    const teto = Math.min(4, total - 1);
    const piso = Math.max(1, total - 4);
    if (piso <= teto) {
      const esquerda = piso + Math.floor(sorteio() * (teto - piso + 1));
      return [maoLivre(esquerda, sorteio), maoLivre(total - esquerda, sorteio)];
    }
  }

  // `duas-livres`, e o escape do `duas-sem-cheia`.
  //
  // O nível 5 abre a faixa para **1 a 10** com "duas mãos". Com 1 dedo não há o
  // que distribuir: a segunda mão nasceria com zero dedos, e um punho fechado ao
  // lado de uma mão com um dedo levantado não é "duas mãos" — é ruído que a
  // criança tenta ler. Quando o total não enche duas mãos, a cena mostra uma.
  if (total <= 1) return [maoLivre(total, sorteio)];

  const teto = Math.min(5, total - 1);
  const piso = Math.max(1, total - 5);
  const esquerda = piso + Math.floor(sorteio() * Math.max(1, teto - piso + 1));
  return [maoLivre(esquerda, sorteio), maoLivre(total - esquerda, sorteio)];
}

/* ------------------------------------------------------------------ *
 *  O padrão — F52 §3
 * ------------------------------------------------------------------ */

/** Uma casa da sequência. `quantidade > 1` só no padrão crescente (§5, nível 5). */
export interface PecaDoPadrao {
  emoji: string;
  quantidade: number;
}

/**
 * A chave que identifica a peça na resposta.
 *
 * Uma peça de três bolas e uma de duas bolas são o **mesmo emoji**: sem a
 * quantidade na chave, o nível 5 teria duas alternativas com o mesmo valor e a
 * regra "a resposta certa aparece exatamente uma vez" quebraria — ou pior,
 * passaria por acaso.
 */
export function chaveDaPeca(p: PecaDoPadrao): string {
  return p.quantidade > 1 ? `${p.emoji}x${p.quantidade}` : p.emoji;
}

/** Os pares de peças dos padrões. Formas e cores, como a §2 exemplifica. */
export const PECAS_DE_PADRAO: string[][] = [
  ["🔴", "🔵", "🟡"],
  ["🍎", "🍌", "🍇"],
  ["⭐", "🌙", "☀️"],
  ["🐶", "🐱", "🐰"],
];

/** A sequência montada e a lacuna. */
export interface SequenciaDePadrao {
  /** As casas visíveis. A lacuna é `null`. */
  casas: (PecaDoPadrao | null)[];
  /** Onde a lacuna está. */
  lacuna: number;
  /** A peça que preenche a lacuna. */
  correta: PecaDoPadrao;
  /** A peça imediatamente antes da lacuna — o alvo de `COPIA_ULTIMO`. */
  anterior: PecaDoPadrao;
  /** O banco: uma de cada tipo usado (§3). */
  banco: PecaDoPadrao[];
  /** Os índices que a moldura da unidade percorre, um par por repetição. */
  molduras: number[][];
  unidade: UnidadeDePadrao;
}

/** Monta a sequência de um nível. */
export function montarSequencia(nivel: number, sorteio: () => number): SequenciaDePadrao {
  const unidades = unidadesDoNivel(nivel);
  const unidade = unidades[Math.floor(sorteio() * unidades.length) % unidades.length];
  const paleta = PECAS_DE_PADRAO[Math.floor(sorteio() * PECAS_DE_PADRAO.length) % PECAS_DE_PADRAO.length];

  const comprimento = comprimentoDaSequencia(unidade);
  let cheia: PecaDoPadrao[];
  let tamanhoDaUnidade: number;

  if (unidade === "CRESCENTE") {
    // "1 bola, 2 bolas, 3 bolas…" — a unidade é o PASSO, não um conjunto de
    // peças, e é por isso que este nível é a ponte para a sequência numérica.
    cheia = Array.from({ length: comprimento + 1 }, (_, i) => ({ emoji: paleta[0], quantidade: i + 1 }));
    tamanhoDaUnidade = 1;
  } else {
    const letras = unidade.split("");
    tamanhoDaUnidade = letras.length;
    cheia = Array.from({ length: comprimento + tamanhoDaUnidade }, (_, i) => ({
      emoji: paleta["ABC".indexOf(letras[i % tamanhoDaUnidade])],
      quantidade: 1,
    }));
  }

  // A lacuna no fim é a pergunta padrão ("o que vem depois?"). No nível 4 ela
  // vai para o meio — e o meio precisa cair DENTRO da parte já repetida, senão
  // a criança não tem repetição suficiente antes dela para inferir a regra.
  const lacuna = lacunaNoMeio(nivel)
    ? comprimento - Math.max(1, tamanhoDaUnidade)
    : comprimento;
  const casas: (PecaDoPadrao | null)[] = cheia.slice(0, lacuna + 1).map((p, i) => (i === lacuna ? null : p));
  // No nível 4 a sequência continua DEPOIS da lacuna: uma lacuna no meio com
  // nada à direita é uma lacuna no fim com outro nome.
  if (lacunaNoMeio(nivel)) {
    for (let i = lacuna + 1; i < cheia.length; i += 1) casas.push(cheia[i]);
  }

  const banco = [...new Map(
    cheia.slice(0, Math.max(comprimento, lacuna + 1) + 1).map(p => [chaveDaPeca(p), p]),
  ).values()];

  const molduras: number[][] = [];
  for (let i = 0; i + tamanhoDaUnidade <= lacuna; i += tamanhoDaUnidade) {
    molduras.push(Array.from({ length: tamanhoDaUnidade }, (_, k) => i + k));
  }

  return {
    casas,
    lacuna,
    correta: cheia[lacuna],
    anterior: cheia[lacuna - 1],
    banco,
    molduras,
    unidade,
  };
}

/* ------------------------------------------------------------------ *
 *  O spec
 * ------------------------------------------------------------------ */

export interface EmojiRowSpec {
  modo: ModoDaFileira;
  nivel: number;
  enunciado: string;
  /** O falado é igual ao escrito: quem não lê ouve a mesma coisa. */
  falado: string;
  roteiro: RoteiroDaFileira;

  /* --- relance de objetos (JD1) --- */
  emoji?: string;
  /** Quantos objetos piscam. */
  total?: number;
  arranjo?: ArranjoDaFileira;
  pontos?: PontoDaFileira[];
  /**
   * Onde os objetos reaparecem no ERRO suave.
   *
   * §4: *"os objetos reaparecem **agrupados no padrão de dado**"*. É outra
   * posição, não a mesma — a ficha usa a revelação para ENSINAR o formato, e
   * repetir o disperso ali seria repetir a pergunta que ela errou.
   */
  pontosDaRevelacao?: PontoDaFileira[];

  /* --- relance de mãos (JD2) --- */
  maos?: MaoSpec[];
  config?: ConfiguracaoDaMao;

  /* --- padrão (F52) --- */
  sequencia?: SequenciaDePadrao;
  mostraMoldura?: boolean;

  /* --- a resposta --- */
  /** As alternativas, na ordem em que a tela as mostra. */
  alternativas: { valor: number | string; rotulo: string }[];
  /** A alternativa central, quando existe — a que `CHUTE_SEGURO` observa. */
  central: number | string | null;
  resposta: number | string;
}

/** Os desenhos do relance. A JD1 diz "Temas: todos" — nenhum traz numeral. */
export const EMOJIS_DO_RELANCE = ["🐟", "⭐", "🍎", "🦕", "🌻", "🐛", "🐝", "🎈"];

/**
 * Monta a cena de um nível.
 *
 * `sorteio` é injetado para que o Composer semeie e o teste prenda: o mesmo
 * nível com a mesma semente produz a mesma cena, que é o que torna a sonda de
 * layout um portão em vez de um palpite (§6.31).
 */
export function construirEmojiRowSpec(
  modo: ModoDaFileira,
  nivel: number,
  sorteio: () => number,
): EmojiRowSpec {
  const roteiro = roteiroDoNivel(modo, nivel);

  if (modo === "padrao") {
    const sequencia = montarSequencia(nivel, sorteio);
    const correta = chaveDaPeca(sequencia.correta);
    return {
      modo,
      nivel,
      enunciado: FALAS.padrao.audioPrompt,
      falado: FALAS.padrao.audioPrompt,
      roteiro,
      sequencia,
      mostraMoldura: mostraMolduraDaUnidade(nivel),
      alternativas: sequencia.banco.map(p => ({
        valor: chaveDaPeca(p),
        rotulo: p.quantidade > 1 ? p.emoji.repeat(p.quantidade) : p.emoji,
      })),
      // O banco é um banco de peças, não uma escada de números: não existe "a do
      // meio" para chutar, e inventar uma criaria um diagnóstico do nada.
      central: null,
      resposta: correta,
    };
  }

  if (modo === "flash-mao") {
    const { min, max } = quantidadeDaMao(nivel);
    const total = min + Math.floor(sorteio() * (max - min + 1));
    const config = configuracaoDaMao(nivel);
    const maos = maosDaCena(total, config, sorteio);
    const alternativas = alternativasDoRelance(total, min, max, sorteio);
    return {
      modo,
      nivel,
      enunciado: FALAS.mao.audioPrompt,
      falado: FALAS.mao.audioPrompt,
      roteiro,
      maos,
      config,
      total,
      alternativas: alternativas.map(v => ({ valor: v, rotulo: String(v) })),
      central: alternativaCentral(alternativas),
      resposta: total,
    };
  }

  // `flash` e `plain` compartilham a cena; o que muda é a fase inicial da tela.
  const { min, max } = quantidadeDoOlhometro(nivel);
  const total = min + Math.floor(sorteio() * (max - min + 1));
  const arranjo = arranjoDoOlhometro(nivel);
  const emoji = EMOJIS_DO_RELANCE[Math.floor(sorteio() * EMOJIS_DO_RELANCE.length) % EMOJIS_DO_RELANCE.length];
  const alternativas = alternativasDoRelance(total, min, max, sorteio);

  return {
    modo,
    nivel,
    enunciado: FALAS.olhometro.audioPrompt,
    falado: FALAS.olhometro.audioPrompt,
    roteiro,
    emoji,
    total,
    arranjo,
    pontos: posicionarFileira(total, arranjo, sorteio),
    pontosDaRevelacao: posicionarFileira(total, "dado", sorteio),
    alternativas: alternativas.map(v => ({ valor: v, rotulo: String(v) })),
    central: alternativaCentral(alternativas),
    resposta: total,
  };
}

/* ------------------------------------------------------------------ *
 *  As falas da revelação — §4 das três fichas
 * ------------------------------------------------------------------ */

/**
 * Os números por extenso.
 *
 * As fichas escrevem as falas assim — *"eram três — olha o formato"* —, e a voz
 * do app lê o que está escrito. `1` é caso à parte porque *"era **um**"* não é
 * *"eram um"*: concordância de número em fala gerada é a armadilha §6.5, e ela
 * já custou "1 estrelas" uma vez.
 */
const POR_EXTENSO = [
  "zero", "um", "dois", "três", "quatro", "cinco",
  "seis", "sete", "oito", "nove", "dez",
];

export function porExtenso(n: number): string {
  return POR_EXTENSO[n] ?? String(n);
}

/**
 * O que a voz diz na revelação.
 *
 * §4 de cada ficha, transcrita:
 *
 * - **JD1 erro suave:** *"eram três — olha o formato"*
 * - **JD2 acerto:** *"uma mão cheia e dois — sete!"* (quando há 5 fechado)
 * - **JD2 erro suave:** *"olha: uma mão inteira, e mais dois."*
 * - **F52 erro suave:** a moldura reaparece "contando o padrão em voz alta"
 *
 * O acerto da JD1 não tem fala na ficha — a confirmação dela é **visual**
 * ("os objetos reaparecem por 800ms confirmando o que ela viu"). Inventar uma
 * frase ali seria acrescentar ao cânone, então a função devolve `null` e a tela
 * fica quieta, que é o que a §4 manda.
 */
export function falaDaRevelacao(spec: EmojiRowSpec, acertou: boolean): string | null {
  if (spec.modo === "padrao") {
    if (acertou) return null;
    const seq = spec.sequencia;
    if (!seq) return null;
    // "contando o padrão em voz alta": a unidade, dita na ordem, e o convite a
    // continuar. Sem nomear a peça certa — a fala ensina a regra, não o gabarito.
    return `Olha o pedaço que se repete: são ${seq.unidade === "CRESCENTE" ? "grupos que crescem" : `${seq.molduras[0]?.length ?? 2} peças`}, e depois tudo de novo.`;
  }

  if (spec.modo === "flash-mao") {
    const total = spec.total ?? 0;
    const cheias = (spec.maos ?? []).filter(m => m.cheia).length;
    const sobra = total - cheias * 5;
    if (cheias === 0) {
      // Sem mão cheia não existe âncora para nomear, e falar "uma mão inteira"
      // com a tela mostrando três dedos seria descrever outra cena.
      return acertou ? null : `Olha: eram ${porExtenso(total)} dedos.`;
    }
    const anchor = cheias === 1 ? "uma mão cheia" : `${porExtenso(cheias)} mãos cheias`;
    if (sobra === 0) return acertou ? `${anchor} — ${porExtenso(total)}!` : `Olha: ${anchor}.`;
    return acertou
      ? `${anchor} e ${porExtenso(sobra)} — ${porExtenso(total)}!`
      : `Olha: uma mão inteira, e mais ${porExtenso(sobra)}.`;
  }

  if (acertou) return null;
  const total = spec.total ?? 0;
  return total === 1
    ? "era um — olha o formato"
    : `eram ${porExtenso(total)} — olha o formato`;
}

/**
 * Nenhum numeral no enunciado.
 *
 * As três fichas perguntam *quantos* — escrever o número no enunciado trocaria
 * ver por ler, que é exatamente o que a subitização existe para dispensar.
 */
export function enunciadoNaoEntregaResposta(spec: EmojiRowSpec): boolean {
  return (spec.enunciado.match(/\d+/g) ?? []).length === 0;
}

/**
 * A resposta certa aparece **uma vez** entre as alternativas.
 *
 * Item da lista de verificação do canário. Aqui ele também protege o nível 5 do
 * padrão, onde duas peças diferentes usam o mesmo emoji.
 */
export function respostaApareceUmaVez(spec: EmojiRowSpec): boolean {
  return spec.alternativas.filter(a => a.valor === spec.resposta).length === 1;
}
