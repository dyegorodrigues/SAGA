import {
  FALAS,
  Vagas,
  bandejaDoNivel,
  escopoDoNivel,
  limitaExcesso,
  pedidoRepetivel,
  temAndaime,
  vagasDoNivel,
} from "./producaoProcedure";

/**
 * O contrato do `TouchPlace`: o que a tela da F04 recebe pronto.
 *
 * As posições nascem **aqui**, semeadas pelo Composer, e não dentro do render.
 * É o §6.31: sorteio dentro do componente muda a cena a cada quadro, e uma
 * sonda que mede layout precisa medir duas vezes a mesma coisa.
 */

/** Um ponto da cena, em **pixels** — a área não é quadrada (§6.29, §6.33). */
export interface Ponto {
  x: number;
  y: number;
}

/**
 * O tema é **casca** (§12.5-ter): a competência é a mesma em qualquer um deles.
 * A §1 nomeia três — espaço, dinos, resgate — e a §3 desenha o do espaço.
 *
 * `genero` existe por causa do §6.5: a voz conta *"uma, duas, três"* estrelas e
 * *"um, dois, três"* dinossauros. Uma voz que erra o gênero do objeto que ela
 * mesma acabou de mostrar ensina o erro junto com o número.
 */
export interface TemaDaProducao {
  id: "espaco" | "dinos" | "resgate";
  emoji: string;
  singular: string;
  plural: string;
  genero: "m" | "f";
  /** O complemento do pedido: "no céu", "no vale". §7: "Coloque 3 estrelas no céu!" */
  onde: string;
  /** O fundo da cena. §3: *"retângulo grande com ilustração de fundo"*. */
  fundo: string;
  /** O contorno da cena, um tom mais escuro que o fundo. */
  borda: string;
  /** A cor do contorno da vaga fantasma sobre este fundo — contraste é requisito. */
  vaga: string;
  /** Enfeites do fundo: estrelinhas do céu, moitas do vale. Puramente cosmético. */
  cenario: "estrelas" | "vale" | "cidade";
  /**
   * A faixa de chão no pé da cena — `null` no céu, que não tem chão.
   *
   * Não é enfeite: nos níveis 4 e 5 **não há vaga nenhuma**, e um retângulo
   * vazio de 326×176 lê como tela quebrada (§6.6). O chão é o que diz "aqui é
   * onde as coisas ficam" sem colocar na tela nada que possa ser contado — que
   * é o que uma vaga faria, e a vaga é justamente o que o nível 4 tira.
   */
  chao: string | null;
}

export const TEMAS_DA_PRODUCAO: TemaDaProducao[] = [
  {
    id: "espaco",
    emoji: "⭐",
    singular: "estrela",
    plural: "estrelas",
    genero: "f",
    onde: "no céu",
    fundo: "#1E293B",
    borda: "#0F172A",
    vaga: "#94A3B8",
    cenario: "estrelas",
    chao: null,
  },
  {
    id: "dinos",
    emoji: "🦕",
    singular: "dinossauro",
    plural: "dinossauros",
    genero: "m",
    onde: "no vale",
    fundo: "#DCFCE7",
    borda: "#86EFAC",
    vaga: "#15803D",
    cenario: "vale",
    chao: "#86EFAC",
  },
  {
    id: "resgate",
    emoji: "🚒",
    singular: "caminhão",
    plural: "caminhões",
    genero: "m",
    onde: "na rua",
    fundo: "#FEF3C7",
    borda: "#FCD34D",
    vaga: "#B45309",
    cenario: "cidade",
    chao: "#E5E7EB",
  },
];

/**
 * A cena, em pixels, num aparelho de 390.
 *
 * 390 − 2×14 de respiro do cartão − 2×18 de padding interno = 326. É a mesma
 * largura útil da fileira do padrão, e pelo mesmo motivo: quem decide o tamanho
 * da peça é a figura inteira, não a peça (§6.33).
 */
export const LARGURA_DA_CENA = 326;
export const ALTURA_DA_CENA = 176;

/** §8.3-bis: *"snap com tolerância generosa e área ≥ 80px"*. Não é sugestão. */
export const ALVO_MINIMO = 80;

/** O tamanho do objeto desenhado. A área de toque é maior que ele, sempre. */
export const LADO_DO_OBJETO = 38;

export interface ProducaoSpec {
  nivel: number;
  /** Quantos o enunciado pede. */
  alvo: number;
  vagas: Vagas;
  /** Quantos objetos a bandeja traz — sempre mais que o pedido (§3). */
  bandeja: number;
  /** §5, nível 5: o pedido é falado uma vez só. */
  repetivel: boolean;
  /** Onde a vaga excedente é recusada (níveis com andaime). */
  limitaExcesso: boolean;
  /** Há vaga fantasma na tela? A §9 decide o domínio por isto. */
  comAndaime: boolean;
  tema: TemaDaProducao;
  /**
   * Onde os objetos podem assentar, já sem colisão possível.
   *
   * Com andaime, são as **vagas fantasma**, e são exatamente `alvo` — a §2 diz
   * que elas *"mostram quantas faltam"*, então uma vaga a mais mentiria.
   * Sem andaime, são as âncoras invisíveis da cena livre: uma por objeto que a
   * bandeja pode soltar, porque a criança pode despejar a bandeja inteira e o
   * `IGNORA_QUANTIDADE` precisa que ela consiga.
   */
  ancoras: Ponto[];
  enunciado: string;
  /** O falado é o mesmo escrito: quem não lê ouve a mesma frase. */
  falado: string;
  resposta: number;
}

/**
 * Uma grade jitterada — colisão resolvida **por construção** (§6.29).
 *
 * O jitter é limitado pela folga da célula, então nenhum ponto encosta no
 * vizinho nem sai do campo, em nenhuma semente. Ajuste de pixel depois do fato
 * é o que a regra proíbe.
 */
export function ancorasDaCena(
  quantas: number,
  lado: number,
  sorteio: () => number,
  largura = LARGURA_DA_CENA,
  altura = ALTURA_DA_CENA,
): Ponto[] {
  if (quantas <= 0) return [];

  // Colunas proporcionais ao formato do campo: um campo largo pede mais colunas
  // que linhas. E nunca tantas que a célula fique menor que a peça.
  const maxColunas = Math.max(1, Math.floor(largura / lado));
  const maxLinhas = Math.max(1, Math.floor(altura / lado));
  let colunas = Math.min(
    quantas,
    maxColunas,
    Math.max(1, Math.ceil(Math.sqrt((quantas * largura) / altura))),
  );
  // Se não couberem linhas suficientes, alarga em colunas até caber.
  while (Math.ceil(quantas / colunas) > maxLinhas && colunas < maxColunas) colunas += 1;

  const linhas = Math.ceil(quantas / colunas);
  const larguraDaCelula = largura / colunas;
  const alturaDaCelula = altura / linhas;
  const folgaX = Math.max(0, (larguraDaCelula - lado) / 2);
  const folgaY = Math.max(0, (alturaDaCelula - lado) / 2);

  const pontos: Ponto[] = [];
  for (let i = 0; i < quantas; i += 1) {
    const coluna = i % colunas;
    const linha = Math.floor(i / colunas);
    // A última linha costuma ficar incompleta; centralizá-la evita o buraco à
    // direita que faz a cena parecer "quebrada" (§6.6 é sobre isso).
    const nestaLinha = Math.min(colunas, quantas - linha * colunas);
    const sobra = (colunas - nestaLinha) * larguraDaCelula / 2;
    pontos.push({
      x: sobra + (coluna + 0.5) * larguraDaCelula + (sorteio() * 2 - 1) * folgaX,
      y: (linha + 0.5) * alturaDaCelula + (sorteio() * 2 - 1) * folgaY,
    });
  }
  return pontos;
}

/**
 * A âncora livre mais próxima do ponto tocado — o "snap com tolerância
 * generosa" do §8.3-bis.
 *
 * Sem raio de corte: qualquer toque dentro da cena assenta em algum lugar. Um
 * toque que não faz nada porque errou 20px é precisão de dedo virando requisito,
 * e o adendo proíbe.
 */
export function ancoraMaisProxima(ancoras: Ponto[], ocupadas: number[], toque: Ponto): number {
  let melhor = -1;
  let menor = Infinity;
  let primeiraLivre = -1;
  ancoras.forEach((a, i) => {
    if (ocupadas.includes(i)) return;
    if (primeiraLivre < 0) primeiraLivre = i;
    const d = (a.x - toque.x) ** 2 + (a.y - toque.y) ** 2;
    if (d < menor) {
      menor = d;
      melhor = i;
    }
  });
  // Ponto não mensurável (campo ainda sem layout, coordenada NaN): assenta na
  // primeira livre. Devolver "não coube" aqui seria a tela recusar um toque que
  // a criança deu **dentro da cena**, e a recusa vira `NAO_MONITORA_ALVO` — uma
  // hipótese sobre a cabeça dela nascida de um retângulo não medido.
  if (melhor < 0) return primeiraLivre;
  return melhor;
}

export function construirProducaoSpec(nivel: number, sorteio: () => number): ProducaoSpec {
  const { min, max } = escopoDoNivel(nivel);
  const alvo = min + Math.floor(sorteio() * (max - min + 1));
  const bandeja = bandejaDoNivel(nivel);
  const comAndaime = temAndaime(nivel);
  const tema = TEMAS_DA_PRODUCAO[Math.floor(sorteio() * TEMAS_DA_PRODUCAO.length) % TEMAS_DA_PRODUCAO.length];

  // Com andaime, a área de toque manda no tamanho da célula: a vaga é o alvo do
  // dedo. Sem andaime, quem manda é o objeto — o alvo do dedo passa a ser a cena
  // inteira, e ela tem 326×176.
  const ancoras = ancorasDaCena(
    comAndaime ? alvo : bandeja,
    comAndaime ? ALVO_MINIMO : LADO_DO_OBJETO,
    sorteio,
  );

  const enunciado = FALAS.pedido(alvo, tema.singular, tema.plural, tema.onde);

  return {
    nivel,
    alvo,
    vagas: vagasDoNivel(nivel),
    bandeja,
    repetivel: pedidoRepetivel(nivel),
    limitaExcesso: limitaExcesso(nivel),
    comAndaime,
    tema,
    ancoras,
    enunciado,
    falado: enunciado,
    resposta: alvo,
  };
}

/**
 * ⚠️ A bandeja tem **mais** objetos do que o pedido.
 *
 * §3: *"faixa na base, com **mais objetos que o necessário** (5 objetos para uma
 * tarefa de 3)"*. E não é estética: `IGNORA_QUANTIDADE` é *"colocou tudo que
 * tinha na bandeja"*. Bandeja do tamanho do pedido transforma despejar tudo em
 * acertar, e a hipótese sobre a criança que age por impulso deixa de existir.
 */
export function bandejaTemExcedente(spec: ProducaoSpec): boolean {
  return spec.bandeja > spec.alvo;
}

/**
 * ⚠️ Nenhuma âncora colide com outra, e nenhuma sai do campo.
 *
 * Cobrado em teste sobre todos os níveis e sementes, porque colisão aqui não é
 * feiura: duas vagas sobrepostas fazem o dedo cair na errada, e o §8.3-bis diz
 * que erro de dedo não pode existir como requisito.
 */
export function ancorasSaoValidas(spec: ProducaoSpec): boolean {
  const lado = spec.comAndaime ? ALVO_MINIMO : LADO_DO_OBJETO;
  return spec.ancoras.every((a, i) => {
    const dentro = a.x >= lado / 2 && a.x <= LARGURA_DA_CENA - lado / 2
      && a.y >= lado / 2 && a.y <= ALTURA_DA_CENA - lado / 2;
    if (!dentro) return false;
    return spec.ancoras.every((b, j) => {
      if (i === j) return true;
      return Math.abs(a.x - b.x) >= lado || Math.abs(a.y - b.y) >= lado;
    });
  });
}
