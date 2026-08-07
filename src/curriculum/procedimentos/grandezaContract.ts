import {
  Atributo,
  FALAS,
  Polo,
  atributoDoNivel,
  diferencaDoNivel,
  diferencaPequena,
  objetosDiferentesNoNivel,
  quantosNoNivel,
  reguaFantasmaNoNivel,
  seriaNoNivel,
} from "./grandezaProcedure";

/**
 * O contrato do `Grupo` em **modo comparação** (ficha F49).
 *
 * As alturas nascem aqui, semeadas, e não no render — §6.31. E a **linha de
 * chão é do contrato**, não do desenho: é ela que torna a comparação
 * verdadeira, e uma tela que a desenhasse por conta própria poderia desenhá-la
 * em lugares diferentes nos dois contêineres.
 */

/** O desenho deste palco, no aparelho do projeto. */
export const LARGURA_DE_PROJETO = 340;

/** A caixa de cada objeto. Idênticas — a moldura não pode dar a dica. */
export const LARGURA_DA_CAIXA = 150;
export const ALTURA_DA_CAIXA = 190;

/** Onde o chão fica dentro da caixa, contado do topo. */
export const LINHA_DO_CHAO = 168;

/** O maior objeto ocupa isto do espaço acima do chão. */
const TETO_DO_OBJETO = 132;

export interface ObjetoDeGrandeza {
  emoji: string;
  /** O nome, para a fala: "dinossauro". */
  nome: string;
  /** Altura desenhada, em pixels acima da linha do chão. */
  altura: number;
  /** Largura desenhada. É o "outro atributo" que o diagnóstico observa. */
  largura: number;
}

export interface GrandezaSpec {
  nivel: number;
  atributo: Atributo;
  polo: Polo;
  /** §5, nível 5: em vez de escolher, ela ordena. */
  seria: boolean;
  /** §4: a régua fantasma sobe do chão até o topo do menor. */
  reguaFantasma: boolean;
  objetos: ObjetoDeGrandeza[];
  /** O índice da resposta certa (ou a ordem certa, na seriação). */
  resposta: number;
  ordemCerta: number[];
  /** Quem vence no OUTRO atributo — a alternativa que carrega `CONFUNDE_ATRIBUTOS`. */
  vencedorDoOutroAtributo: number;
  /** A diferença deste nível é pequena? A §9 exige um acerto assim. */
  pequena: boolean;
  enunciado: string;
  falado: string;
}

/** Os objetos que a cena sorteia. Casca (§12.5-ter) — a competência não muda. */
export const OBJETOS: { emoji: string; nome: string }[] = [
  { emoji: "🦕", nome: "dinossauro" },
  { emoji: "🌳", nome: "árvore" },
  { emoji: "🏠", nome: "casa" },
  { emoji: "🚀", nome: "foguete" },
  { emoji: "🐧", nome: "pinguim" },
  { emoji: "🌻", nome: "girassol" },
];

export function construirGrandezaSpec(nivel: number, sorteio: () => number): GrandezaSpec {
  const atributo = atributoDoNivel(nivel);
  const polo: Polo = sorteio() < 0.5 ? "maior" : "menor";
  const seria = seriaNoNivel(nivel);
  const quantos = quantosNoNivel(nivel);
  const dif = diferencaDoNivel(nivel);

  const pool = [...OBJETOS];
  /**
   * §5, nível 4: objetos DIFERENTES. Nos outros, o MESMO desenho nos dois.
   *
   * O sorteio era por objeto, e devolvia bichos diferentes já no nível 1 —
   * onde a criança compararia o tipo em vez da grandeza. Pior: adiantava o
   * degrau do nível 4 para dentro do primeiro, que é o §6.36 (uma tela
   * introduz no máximo uma coisa nova). Sorteia-se UMA vez e repete-se.
   */
  const umSo = pool[Math.floor(sorteio() * pool.length) % pool.length];
  const escolhidos = Array.from({ length: quantos }, () => {
    if (!objetosDiferentesNoNivel(nivel)) return umSo;
    const i = Math.floor(sorteio() * pool.length) % pool.length;
    return pool.splice(i, 1)[0];
  });

  /**
   * As alturas: a maior no teto, as outras descendo pela diferença do nível.
   *
   * Derivadas, não sorteadas uma a uma. Sorteio livre produziria, de vez em
   * quando, duas alturas iguais — uma questão sem resposta —, e a §6.2 manda
   * recusar o sorteio que não pergunta o que o nível pergunta.
   */
  const alturas = Array.from({ length: quantos }, (_, i) => Math.round(TETO_DO_OBJETO * (1 - dif * i)));
  const ordemDesenho = embaralhar(Array.from({ length: quantos }, (_, i) => i), sorteio);

  const objetos: ObjetoDeGrandeza[] = ordemDesenho.map(posto => ({
    ...escolhidos[posto],
    altura: alturas[posto],
    /**
     * ⚠️ A largura anda ao CONTRÁRIO da altura.
     *
     * É o que torna `CONFUNDE_ATRIBUTOS` observável: quem é mais alto é o mais
     * estreito, então escolher "o maiorzão" entrega que ela comparou volume, e
     * não altura. Com a largura acompanhando a altura, o erro de atributo daria
     * a mesma resposta que o acerto e a tag nunca poderia existir.
     */
    largura: Math.round(58 + (alturas[0] - alturas[posto]) * 0.45),
  }));

  // Onde foi parar cada posto depois do embaralho.
  const posicaoDe = (posto: number) => ordemDesenho.indexOf(posto);
  const maisAlto = posicaoDe(0);
  const maisBaixo = posicaoDe(quantos - 1);
  const certo = polo === "maior" ? maisAlto : maisBaixo;

  const ordemCerta = (polo === "maior"
    ? Array.from({ length: quantos }, (_, i) => posicaoDe(i))
    : Array.from({ length: quantos }, (_, i) => posicaoDe(quantos - 1 - i)));

  const nome = objetosDiferentesNoNivel(nivel) ? "objeto" : objetos[0].nome;
  const enunciado = seria
    ? FALAS.perguntaDaSeriacao(atributo, polo)
    : FALAS.pergunta(atributo, polo, nome);

  return {
    nivel,
    atributo,
    polo,
    seria,
    reguaFantasma: reguaFantasmaNoNivel(nivel),
    objetos,
    resposta: certo,
    ordemCerta,
    // O mais largo é o mais baixo, por construção — e é ele que a criança que
    // compara volume escolhe quando a pergunta é "mais alto".
    vencedorDoOutroAtributo: polo === "maior" ? maisBaixo : maisAlto,
    pequena: diferencaPequena(nivel),
    enunciado,
    falado: enunciado,
  };
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

/**
 * ⚠️ Nenhum objeto empata com outro na grandeza comparada.
 *
 * Empate é questão sem resposta. Cobrado em teste sobre todos os níveis e
 * sementes (§6.2).
 */
export function semEmpate(spec: GrandezaSpec): boolean {
  const alturas = spec.objetos.map(o => o.altura);
  return new Set(alturas).size === alturas.length;
}

/**
 * ⚠️ Nenhum objeto passa do teto da caixa nem afunda no chão.
 *
 * Um objeto recortado no topo faria a criança comparar o que sobrou, e a
 * comparação sairia errada sem que nada na tela avisasse.
 */
export function cabeNaCaixa(spec: GrandezaSpec): boolean {
  return spec.objetos.every(o =>
    o.altura > 0 && o.altura <= LINHA_DO_CHAO && o.largura > 0 && o.largura <= LARGURA_DA_CAIXA - 12);
}

/**
 * ⚠️ A largura NÃO acompanha a altura.
 *
 * Se acompanhasse, escolher o mais volumoso daria a mesma resposta que escolher
 * o mais alto — e `CONFUNDE_ATRIBUTOS` seria uma tag impossível de observar.
 */
export function larguraContraria(spec: GrandezaSpec): boolean {
  const porAltura = [...spec.objetos].sort((a, b) => b.altura - a.altura);
  const porLargura = [...spec.objetos].sort((a, b) => b.largura - a.largura);
  return porAltura[0] !== porLargura[0];
}
