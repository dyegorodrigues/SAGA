import {
  ArranjoDeContagem,
  ModoDeContagem,
  PERGUNTA_DO_FECHO,
  alvosDaMaoFantasma,
  arranjoDoToque,
  baloesDoNivel,
  jaFeitosNoNivel,
  marcaComCor,
  mostraNumeral,
  tetoDoTeclado,
  tetoDoToque,
} from "./touchCountProcedure";

/**
 * O contrato do `TouchCount`: o que a tela recebe pronto.
 *
 * As posições dos objetos nascem **aqui**, não no componente. O motivo é o §6.31:
 * uma sonda que mede layout precisa que o layout seja o mesmo em duas execuções,
 * e um sorteio dentro do render muda a cena a cada quadro. Aqui o sorteio é
 * semeado pelo Composer, medível por teste, e o componente só desenha.
 */

/** Um alvo na tela, já posicionado. */
export interface AlvoDeContagem {
  /** Percentual da largura, 0 a 100. */
  x: number;
  /** Percentual da altura da área, 0 a 100. */
  y: number;
}

/**
 * Quantas linhas a cena ocupa — a altura da área sai daqui, não de um número
 * fixo. Com altura fixa de 132px, as duas linhas do nível 5 do canhão nasciam
 * cortadas no topo e no pé. A sonda não pegou: recorte não é vazamento nem
 * colisão, e só apareceu no print.
 */
export function linhasDaCena(alvos: AlvoDeContagem[]): number {
  return new Set(alvos.map(a => Math.round(a.y))).size;
}

export interface TouchCountSpec {
  modo: ModoDeContagem;
  /** Quantos alvos a cena tem. */
  total: number;
  arranjo: ArranjoDeContagem;
  /** O desenho do alvo. */
  emoji: string;
  /** Plural, para a fala: "dinossauros". Nunca traz numeral. */
  nome: string;
  /** O artigo que concorda com o nome: "os" ou "as". */
  artigo: "os" | "as";
  /** O nome no singular, para a cena de um alvo só. */
  singular: string;
  enunciado: string;
  /** O falado é igual ao escrito: quem não lê ouve a mesma coisa. */
  falado: string;
  /**
   * O que o ato FAZ com o alvo.
   *
   * - `colorir` — o objeto cinza ganha cor: o dedo marcou o que já passou (F01).
   * - `estourar` — o balão explode e sai da cena (F27). Um balão que continua
   *   ali depois do tiro desfaz a metáfora e, pior, esconde da criança quantos
   *   faltam — que é exatamente o que o diagnóstico `EXCESSO_ACAO` observa.
   * - `nada` — o desmame do nível 5 do modo toque: nenhuma marca, ela segura
   *   mentalmente quais já contou.
   */
  aoMarcar: "colorir" | "estourar" | "nada";
  /** O numeral aparece escrito? Falso do nível 4 rítmico em diante. */
  mostraNumeral: boolean;
  /**
   * Quantos alvos a cena já traz FEITOS quando abre.
   *
   * Zero em quase toda parte. No nível 5 do rítmico é a **âncora do
   * counting-on**: os balões já estourados mostram à criança de onde continuar,
   * sem depender de ela ler número — e mantêm a sequência dentro de 1 a 10.
   */
  jaFeitos: number;
  /** Quantos alvos a Mão Fantasma faz antes de passar a vez. 0 = nenhum. */
  maoFantasma: number;
  /** O maior numeral do teclado. Só no modo toque. */
  tecladoAte: number;
  /** A pergunta do fecho, ou `null` quando o modo não pergunta. */
  pergunta: string | null;
  /** O gabarito: o total de alvos. */
  resposta: number;
  alvos: AlvoDeContagem[];
}

/** Um cenário de contagem: o que se conta, e como se chama. */
export interface TemaDeContagem {
  emoji: string;
  /** Plural. */
  nome: string;
  /**
   * O artigo definido plural: `"os"` ou `"as"`.
   *
   * A criança de 4 anos **OUVE** o enunciado. *"Conte os lagartas"* soa errado
   * antes de parecer errado, e some com a confiança dela na voz que ensina.
   * Este campo existe porque eu já tinha aprendido isso na F07 — *"uma banana",
   * não "um banana"* — e repeti o erro assim mesmo. Ver Padrão Ouro §6.34.
   */
  artigo: "os" | "as";
  /**
   * O nome no singular: "peixinho".
   *
   * A F01 §5 põe de 1 a 3 objetos no nível 1 — e uma cena de UM objeto existe
   * de verdade. *"Conte os peixinhos"* com um peixinho na tela é a primeira
   * frase que a criança de 4 anos ouve do app, e ela soa errada. Só o print
   * mostrou: nenhum teste pergunta se a frase faz sentido.
   */
  singular: string;
}

/**
 * Os temas. A F01 diz *"Temas: todos"*; a F27 fixa o tema **pirata**.
 *
 * O nome entra no enunciado — *"Conte os dinossauros"* —, então tem de ser
 * plural e concordar. Nada aqui traz numeral: o número é o produto do ato, e
 * anunciá-lo no enunciado entregaria a resposta.
 */
export const TEMAS: TemaDeContagem[] = [
  { emoji: "🦕", nome: "dinossauros", artigo: "os", singular: "dinossauro" },
  { emoji: "🐟", nome: "peixinhos", artigo: "os", singular: "peixinho" },
  { emoji: "🍎", nome: "maçãs", artigo: "as", singular: "maçã" },
  { emoji: "⭐", nome: "estrelas", artigo: "as", singular: "estrela" },
  { emoji: "🐛", nome: "lagartas", artigo: "as", singular: "lagarta" },
  { emoji: "🌻", nome: "girassóis", artigo: "os", singular: "girassol" },
];

/** O tema do canhão: a F27 é pirata, e só. */
export const TEMA_DO_CANHAO: TemaDeContagem = { emoji: "🎈", nome: "balões", artigo: "os", singular: "balão" };

/* ------------------------------------------------------------------ *
 *  As posições
 * ------------------------------------------------------------------ */

/** Margem para o alvo não encostar na borda dos 390px (§6.16). */
const MARGEM = 12;

/** Distância mínima entre centros, em pontos percentuais. */
const AFASTAMENTO = 22;

/**
 * O maior espaçamento entre alvos vizinhos numa fila, em pontos percentuais.
 *
 * Sem teto, dois alvos vão para as duas pontas da tela e a criança precisa varrer
 * 300px para ver que são dois. O conjunto tem de ser lido como CONJUNTO — é a
 * percepção que a contagem apoia. Com o teto, poucos alvos ficam agrupados no
 * centro e muitos usam a largura toda.
 */
const PASSO_MAXIMO = 20;

/**
 * Quantos alvos cabem numa fila só.
 *
 * O alvo tem 52px e a tela da criança tem 390px: sete já se encostam, dez se
 * sobrepõem em 27% — a sonda de layout mediu isso nas oito sementes do nível 5
 * do canhão, com dez balões. Uma fila que não cabe não é uma fila difícil, é uma
 * fila ilegível, e a criança não consegue tocar um balão sem tocar o vizinho.
 *
 * Passando disto, a fila **quebra em linhas**. A F27 §3 pede os balões "na parte
 * superior" e desenha cinco numa linha; nada ali exige linha única para dez.
 */
const CABEM_NA_FILA = 6;

/**
 * Onde os alvos ficam.
 *
 * - `fila`: uma linha, espaçamento igual. É o arranjo fácil.
 * - `grade`: linhas e colunas — a organização que o nível 3 ensina.
 * - `disperso`: sorteado com afastamento mínimo. **O degrau difícil da F01**:
 *   sem apoio espacial, contar exige estratégia.
 *
 * O afastamento mínimo não é estética: dois alvos sobrepostos fariam a criança
 * contar um objeto que ela não consegue tocar separadamente, e o erro seria do
 * app, não dela.
 */
export function posicionar(
  total: number,
  arranjo: ArranjoDeContagem,
  sorteio: () => number,
): AlvoDeContagem[] {
  const util = 100 - 2 * MARGEM;

  if (arranjo === "fila" || arranjo === "grade") {
    // Fila e grade são o MESMO desenho com outra largura de linha, e por isso
    // dividem o código. Escrever dois layouts parecidos foi como a grade ficou
    // sem o teto de espaçamento e sem a linha centrada: três peixes viravam dois
    // nas pontas e um embaixo à esquerda — que a criança lê como disperso, não
    // como "linhas e colunas", que é justamente o que o nível 3 ensina.
    const porLinha = arranjo === "fila"
      ? Math.min(total, CABEM_NA_FILA)
      : Math.min(Math.ceil(Math.sqrt(total)), CABEM_NA_FILA);
    const linhas = Math.ceil(total / porLinha);

    return Array.from({ length: total }, (_, i) => {
      const linha = Math.floor(i / porLinha);
      const nesta = Math.min(porLinha, total - linha * porLinha);
      const c = i % porLinha;
      // Cada linha é centrada e tem o passo limitado: a última linha
      // incompleta fica sob as outras, e não encostada na esquerda.
      const larguraUsada = nesta > 1 ? Math.min(util, PASSO_MAXIMO * (nesta - 1)) : 0;
      const inicio = MARGEM + (util - larguraUsada) / 2;
      // A vertical usa o mesmo teto: sem ele, duas linhas ficavam com 130px de
      // vão contra 70px na horizontal, e a grade lia como dois grupos soltos em
      // vez de uma organização. Linhas e colunas precisam parecer linhas e
      // colunas — é o que o nível 3 ensina.
      const alturaUsada = linhas > 1 ? Math.min(util, PASSO_MAXIMO * 1.6 * (linhas - 1)) : 0;
      const topo = MARGEM + (util - alturaUsada) / 2;
      return {
        x: nesta > 1 ? inicio + (c * larguraUsada) / (nesta - 1) : 50,
        y: linhas > 1 ? topo + (linha * alturaUsada) / (linhas - 1) : 50,
      };
    });
  }

  // Disperso: sorteia com afastamento mínimo, e cede se o espaço apertar.
  const fora: AlvoDeContagem[] = [];
  for (let i = 0; i < total; i += 1) {
    let melhor: AlvoDeContagem | null = null;
    let melhorDistancia = -1;
    // 30 tentativas: o bastante para dez alvos caberem folgados, e um teto que
    // impede laço infinito quando o afastamento pedido não cabe de jeito nenhum.
    for (let t = 0; t < 30; t += 1) {
      const cand = {
        x: MARGEM + sorteio() * util,
        y: MARGEM + sorteio() * util,
      };
      const d = fora.length === 0
        ? Infinity
        : Math.min(...fora.map(p => Math.hypot(p.x - cand.x, p.y - cand.y)));
      if (d >= AFASTAMENTO) { melhor = cand; break; }
      if (d > melhorDistancia) { melhorDistancia = d; melhor = cand; }
    }
    fora.push(melhor as AlvoDeContagem);
  }
  return fora;
}

/**
 * O enunciado do modo `toque`, com a concordância certa.
 *
 * Exportado para ser testável sozinho: a cena de um alvo não ocorre mais no
 * sorteio (ver `totalDoToque`), e sem esta função a única guarda contra
 * *"Conte os peixinhos"* com um peixinho seria um teste que não tem como rodar.
 */
export function enunciadoDoToque(t: TemaDeContagem, total: number): string {
  if (total === 1) {
    const artigo = t.artigo === "as" ? "a" : "o";
    return `Conte ${artigo} ${t.singular}. Toque nel${t.artigo === "as" ? "a" : "e"}!`;
  }
  // "cada uma" para tema feminino. O singular já concordava — "Toque nela!" — e
  // o plural tinha ficado para trás: o app dizia "Conte as maçãs. Toque em cada
  // um!". É a armadilha §6.5 da F51: a criança de 4 anos OUVE o enunciado, e
  // erro de concordância soa errado antes de parecer errado.
  return `Conte ${t.artigo} ${t.nome}. Toque em cada ${t.artigo === "as" ? "uma" : "um"}!`;
}

/**
 * Quantos objetos o nível põe na tela, no modo `toque`.
 *
 * ### ⚠️ Desvio deliberado da ficha, com motivo
 *
 * A F01 §5 dá a faixa **"1 a 3"** para o nível 1. Uma cena de UM objeto é legal
 * pela tabela e **não funciona na tela**: a Mão Fantasma toca os dois primeiros
 * (§8), então com um objeto ela faz o exercício inteiro e a coreografia termina
 * em *"agora você conta!"* apontando para o vazio. Contar um objeto também não é
 * contar — é reconhecer.
 *
 * O piso é dois, e a Mão Fantasma nunca toca o último: a demonstração sempre
 * deixa pelo menos um alvo para a criança. Isso respeita o teto de cada nível e
 * o espírito da ficha — o que ela quer no nível 1 é escopo pequeno, não uma cena
 * sem tarefa.
 *
 * Registrado aqui, e não corrigido em silêncio, porque a ficha é o cânone: quem
 * ler a F01 e o código lado a lado tem de encontrar a divergência explicada.
 */
export function totalDoToque(nivel: number, sorteio: () => number): number {
  const teto = tetoDoToque(nivel);
  const piso = Math.min(2, teto);
  return piso + Math.floor(sorteio() * (teto - piso + 1));
}

/* ------------------------------------------------------------------ *
 *  O spec
 * ------------------------------------------------------------------ */

/**
 * Monta a tela de um nível.
 *
 * `sorteio` é injetado para que o Composer semeie e o teste prenda: o mesmo
 * nível com a mesma semente produz a mesma cena, que é o que torna a sonda de
 * layout um portão em vez de um palpite.
 */
export function construirTouchCountSpec(
  modo: ModoDeContagem,
  nivel: number,
  sorteio: () => number,
  tema?: TemaDeContagem,
): TouchCountSpec {
  const ritmico = modo === "ritmico";
  const t = tema ?? (ritmico
    ? TEMA_DO_CANHAO
    : TEMAS[Math.floor(sorteio() * TEMAS.length) % TEMAS.length]);

  // O rítmico usa o teto cheio do nível: a F27 dá o número exato de balões.
  // O toque sorteia dentro do teto, porque a F01 dá faixa ("1 a 5").
  const total = ritmico
    ? baloesDoNivel(nivel)
    : totalDoToque(nivel, sorteio);

  const arranjo: ArranjoDeContagem = ritmico ? "fila" : arranjoDoToque(nivel);
  const jaFeitos = ritmico ? jaFeitosNoNivel(nivel, Math.floor(sorteio() * 4)) : 0;

  const enunciado = ritmico
    ? (jaFeitos > 0
      // A fala da ficha, letra por letra: "continue de 4: cinco, seis…". O
      // número aqui é o ponto de partida, não a resposta — e os balões já
      // estourados na tela mostram de onde ele saiu.
      // A fala da ficha, sem repetir o número: "continue de 4: cinco, seis…".
      ? `Continue de ${jaFeitos}: estoure o resto!`
      : "Estoure os balões contando junto!")
    : enunciadoDoToque(t, total);

  return {
    modo,
    total,
    arranjo,
    emoji: t.emoji,
    nome: t.nome,
    artigo: t.artigo,
    singular: t.singular,
    enunciado,
    falado: enunciado,
    aoMarcar: ritmico ? "estourar" : (marcaComCor(nivel) ? "colorir" : "nada"),
    mostraNumeral: ritmico ? mostraNumeral(nivel) : true,
    jaFeitos,
    // A F01 §5 manda a Mão Fantasma tocar os DOIS primeiros, e o nível 1
    // sorteia de 1 a 3 alvos: numa cena de um alvo só, ela tocaria dois de um.
    // O teto pelo total é o que impede a coreografia de prometer um gesto que
    // a cena não comporta.
    // A demonstração nunca consome a cena inteira: a Mão Fantasma para com pelo
    // menos um alvo sobrando, senão o "agora você conta!" aponta para o vazio.
    maoFantasma: Math.min(alvosDaMaoFantasma(nivel, modo), Math.max(0, total - 1)),
    tecladoAte: ritmico ? 0 : tetoDoTeclado(nivel),
    // O rítmico não pergunta: o fecho dele é a voz repetindo a sequência
    // inteira. Pôr teclado ali trocaria uma competência oral por uma de leitura.
    pergunta: ritmico ? null : PERGUNTA_DO_FECHO,
    resposta: total,
    alvos: posicionar(total, arranjo, sorteio),
  };
}

/**
 * Nenhum numeral no enunciado.
 *
 * O número é o **produto do ato** (F01 §4, regra inviolável nº 3). Escrevê-lo no
 * enunciado entregaria a resposta e trocaria contar por ler.
 *
 * A exceção é o nível 5 rítmico, onde *"continue de 4"* **é** a instrução: ali o
 * numeral não é a resposta, é o ponto de partida.
 */
export function enunciadoNaoEntregaResposta(spec: TouchCountSpec): boolean {
  const numerais = (spec.enunciado.match(/\d+/g) ?? []).map(Number);
  if (numerais.length === 0) return true;
  if (spec.jaFeitos > 0 && numerais.every(n => n === spec.jaFeitos)) return true;
  return false;
}
