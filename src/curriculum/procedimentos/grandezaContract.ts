import {
  Atributo,
  EixoDaGrandeza,
  FALAS,
  Polo,
  atributoDoNivel,
  diferencaDoNivel,
  diferencaPequena,
  eixoDoAtributo,
  objetosDiferentesNoNivel,
  quantosNoNivel,
  reguaFantasmaNoNivel,
  seriaNoNivel,
} from "./grandezaProcedure";

export const LARGURA_DE_PROJETO = 340;
export const LARGURA_DA_CAIXA = 150;
export const ALTURA_DA_CAIXA = 190;
export const LINHA_DO_CHAO = 168;
/** L2: ambos começam aqui; comparar comprimento sem alinhar o começo é tão inválido quanto altura sem chão. */
export const LINHA_DE_INICIO = 18;

const ALTURA_MAX = 126;
const COMPRIMENTO_MAX = 116;

export interface ObjetoDeGrandeza {
  emoji: string;
  nome: string;
  altura: number;
  comprimento: number;
}

export interface GrandezaSpec {
  nivel: number;
  atributo: Atributo;
  eixo: EixoDaGrandeza;
  polo: Polo;
  seria: boolean;
  reguaFantasma: boolean;
  objetos: ObjetoDeGrandeza[];
  resposta: number;
  ordemCerta: number[];
  vencedorDoOutroAtributo: number;
  pequena: boolean;
  enunciado: string;
  falado: string;
}

export const OBJETOS: { emoji: string; nome: string }[] = [
  { emoji: "🦕", nome: "dinossauro" },
  { emoji: "🌳", nome: "árvore" },
  { emoji: "🏠", nome: "casa" },
  { emoji: "🚀", nome: "foguete" },
  { emoji: "🐧", nome: "pinguim" },
  { emoji: "🌻", nome: "girassol" },
];

function extremo(valores: number[], polo: Polo): number {
  let melhor = 0;
  for (let i = 1; i < valores.length; i += 1) {
    if ((polo === "maior" && valores[i] > valores[melhor])
      || (polo === "menor" && valores[i] < valores[melhor])) melhor = i;
  }
  return melhor;
}

export function valorComparado(o: ObjetoDeGrandeza, atributo: Atributo): number {
  if (atributo === "altura") return o.altura;
  if (atributo === "comprimento") return o.comprimento;
  // No L5 as duas dimensões são escaladas na mesma proporção; a área só torna explícita a ordem uniforme.
  return o.altura * o.comprimento;
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

export function construirGrandezaSpec(nivel: number, sorteio: () => number): GrandezaSpec {
  const atributo = atributoDoNivel(nivel);
  const eixo = eixoDoAtributo(atributo);
  const polo: Polo = sorteio() < 0.5 ? "maior" : "menor";
  const seria = seriaNoNivel(nivel);
  const quantos = quantosNoNivel(nivel);
  const dif = diferencaDoNivel(nivel);

  const pool = [...OBJETOS];
  const umSo = pool[Math.floor(sorteio() * pool.length) % pool.length];
  const escolhidos = Array.from({ length: quantos }, () => {
    // L5 usa a MESMA identidade em três escalas: a única novidade é ordenar.
    if (!objetosDiferentesNoNivel(nivel)) return umSo;
    const i = Math.floor(sorteio() * pool.length) % pool.length;
    return pool.splice(i, 1)[0];
  });

  let dimensoes: Array<{ altura: number; comprimento: number }>;
  if (atributo === "altura") {
    const alturas = Array.from({ length: quantos }, (_, i) => Math.round(ALTURA_MAX * (1 - dif * i)));
    // A dimensão distratora anda ao contrário: permite observar CONFUNDE_ATRIBUTOS sem entregar a resposta.
    const comprimentos = Array.from({ length: quantos }, (_, i) => 72 + i * 30);
    dimensoes = alturas.map((altura, i) => ({ altura, comprimento: comprimentos[i] }));
  } else if (atributo === "comprimento") {
    const comprimentos = Array.from({ length: quantos }, (_, i) => Math.round(COMPRIMENTO_MAX * (1 - dif * i)));
    const alturas = Array.from({ length: quantos }, (_, i) => 72 + i * 34);
    dimensoes = comprimentos.map((comprimento, i) => ({ comprimento, altura: alturas[i] }));
  } else {
    // Seriação: escala UNIFORME. Nenhuma dimensão conta uma história diferente da outra.
    dimensoes = Array.from({ length: quantos }, (_, i) => {
      const escala = 1 - dif * i;
      return {
        altura: Math.round(118 * escala),
        comprimento: Math.round(96 * escala),
      };
    });
  }

  const ordemDesenho = embaralhar(Array.from({ length: quantos }, (_, i) => i), sorteio);
  const objetos: ObjetoDeGrandeza[] = ordemDesenho.map(posto => ({ ...escolhidos[posto], ...dimensoes[posto] }));
  const valoresAlvo = objetos.map(o => valorComparado(o, atributo));
  const ordemCerta = [...valoresAlvo.keys()].sort((a, b) =>
    polo === "maior" ? valoresAlvo[b] - valoresAlvo[a] : valoresAlvo[a] - valoresAlvo[b]);
  const resposta = ordemCerta[0];

  let vencedorDoOutroAtributo = -1;
  if (!seria) {
    const outro = atributo === "altura"
      ? objetos.map(o => o.comprimento)
      : objetos.map(o => o.altura);
    vencedorDoOutroAtributo = extremo(outro, polo);
  }

  const nome = objetosDiferentesNoNivel(nivel) ? "objeto" : objetos[0].nome;
  const enunciado = seria
    ? FALAS.perguntaDaSeriacao(atributo, polo)
    : FALAS.pergunta(atributo, polo, nome);

  return {
    nivel, atributo, eixo, polo, seria,
    reguaFantasma: reguaFantasmaNoNivel(nivel),
    objetos, resposta, ordemCerta, vencedorDoOutroAtributo,
    pequena: diferencaPequena(nivel),
    enunciado, falado: enunciado,
  };
}

export function semEmpate(spec: GrandezaSpec): boolean {
  const valores = spec.objetos.map(o => valorComparado(o, spec.atributo));
  return new Set(valores).size === valores.length;
}

export function cabeNaCaixa(spec: GrandezaSpec): boolean {
  return spec.objetos.every(o =>
    o.altura > 0 && o.altura <= LINHA_DO_CHAO - 8
    && o.comprimento > 0 && o.comprimento <= LARGURA_DA_CAIXA - LINHA_DE_INICIO - 8);
}

/** O extremo do atributo distrator precisa ser uma resposta ERRADA, senão a tag seria impossível de observar. */
export function outroAtributoContrario(spec: GrandezaSpec): boolean {
  return spec.seria || spec.vencedorDoOutroAtributo < 0 || spec.vencedorDoOutroAtributo !== spec.resposta;
}

/** Nome histórico mantido por compatibilidade; o conceito agora vale nos dois eixos. */
export const larguraContraria = outroAtributoContrario;
