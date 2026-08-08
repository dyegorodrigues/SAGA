import {
  FALAS,
  FORMAS,
  Forma,
  aceitaGiro,
  anguloDe,
  giraNoNivel,
  misturaRepresentacoesNoNivel,
  mundoRealNoNivel,
  opcoesDoNivel,
  variaAparenciaNoNivel,
} from "./formaProcedure";

/** Contrato do ShapeCanvas no modo formas (F48). */
export const LARGURA_DE_PROJETO = 340;
export const LADO_DO_CONTEINER = 100;
export const VAO = 12;
export const COR_PADRAO = "#2563EB";
export const CORES = ["#2563EB", "#DC2626", "#15803D", "#B45309", "#7C3AED"];

export interface OpcaoDeForma {
  figura: Forma;
  giro: number;
  tamanho: number;
  cor: string;
  objeto?: "roda" | "janela" | "chapeu" | "quadro";
}

export interface FormaSpec {
  nivel: number;
  alvo: Forma;
  opcoes: OpcaoDeForma[];
  alvoGirado: boolean;
  /** N5: há formas puras e formas dentro de objetos na mesma cena. */
  misturaRepresentacoes: boolean;
  enunciado: string;
  falado: string;
  resposta: Forma;
}

export const OBJETOS_REAIS: Record<NonNullable<OpcaoDeForma["objeto"]>, Forma> = {
  roda: "circulo",
  janela: "retangulo",
  chapeu: "triangulo",
  quadro: "quadrado",
};

/** O alvo dos níveis com giro nunca é círculo, pois girá-lo é visualmente inerte. */
export function alvosPossiveis(nivel: number): Forma[] {
  if (!giraNoNivel(nivel)) return [...FORMAS];
  return FORMAS.filter(aceitaGiro);
}

function embaralhar<T>(lista: T[], sorteio: () => number): T[] {
  const fora = [...lista];
  for (let i = fora.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sorteio() * (i + 1)) % (i + 1);
    [fora[i], fora[j]] = [fora[j], fora[i]];
  }
  return fora;
}

function objetoDaForma(forma: Forma): OpcaoDeForma["objeto"] {
  return (Object.keys(OBJETOS_REAIS) as NonNullable<OpcaoDeForma["objeto"]>[])
    .find(k => OBJETOS_REAIS[k] === forma);
}

export function construirFormaSpec(nivel: number, sorteio: () => number): FormaSpec {
  const quantas = opcoesDoNivel(nivel);
  const gira = giraNoNivel(nivel);
  const varia = variaAparenciaNoNivel(nivel);
  const mundoReal = mundoRealNoNivel(nivel);
  const mistura = misturaRepresentacoesNoNivel(nivel);

  const possiveis = alvosPossiveis(nivel);
  const alvo = possiveis[Math.floor(sorteio() * possiveis.length) % possiveis.length];
  const outras = embaralhar(FORMAS.filter(f => f !== alvo), sorteio).slice(0, quantas - 1);

  function montar(figura: Forma, ehOAlvo: boolean): OpcaoDeForma {
    const giro = gira && aceitaGiro(figura) && (ehOAlvo || sorteio() < 0.6)
      ? anguloDe(figura, sorteio)
      : 0;
    return {
      figura,
      giro,
      tamanho: varia ? 48 + Math.floor(sorteio() * 29) : 64,
      cor: varia ? CORES[Math.floor(sorteio() * CORES.length) % CORES.length] : COR_PADRAO,
    };
  }

  let opcoes = embaralhar([montar(alvo, true), ...outras.map(f => montar(f, false))], sorteio);

  if (mundoReal) {
    opcoes = opcoes.map(o => ({ ...o, objeto: objetoDaForma(o.figura) }));
  } else if (mistura) {
    // Exatamente metade real e metade pura, com os índices sorteados. Assim o
    // alvo pode cair em qualquer representação e nenhuma posição vira pista.
    const indicesReais = new Set(
      embaralhar(opcoes.map((_o, i) => i), sorteio).slice(0, Math.floor(opcoes.length / 2)),
    );
    opcoes = opcoes.map((o, i) => indicesReais.has(i)
      ? { ...o, objeto: objetoDaForma(o.figura) }
      : o);
  }

  const enunciado = FALAS.pergunta(alvo);
  return {
    nivel,
    alvo,
    opcoes,
    alvoGirado: opcoes.find(o => o.figura === alvo)!.giro !== 0,
    misturaRepresentacoes: mistura,
    enunciado,
    falado: enunciado,
    resposta: alvo,
  };
}

export function respostaApareceUmaVez(spec: FormaSpec): boolean {
  return spec.opcoes.filter(o => o.figura === spec.resposta).length === 1;
}

export function alvoGiradoQuandoDeve(spec: FormaSpec): boolean {
  if (!giraNoNivel(spec.nivel)) return true;
  return spec.alvoGirado;
}

export function representacoesMistasQuandoDeve(spec: FormaSpec): boolean {
  if (!misturaRepresentacoesNoNivel(spec.nivel)) return true;
  const reais = spec.opcoes.filter(o => o.objeto !== undefined).length;
  return reais > 0 && reais < spec.opcoes.length;
}

export function conteineresIdenticos(): number {
  return LADO_DO_CONTEINER;
}
