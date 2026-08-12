import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { Question } from "../../types";
import { ModoQuadrado100 } from "./quadrado100Semantics";

export interface Quadrado100Spec {
  nivel: number;
  modo: ModoQuadrado100;
  /** Casa de referência inicial; no L5 existe para telemetria, mas não é revelada. */
  inicio: number;
  mostrarInicio: boolean;
  /** Casas que precisam ser tocadas, em ordem. */
  caminho: number[];
  /** Casas cujo numeral começa oculto e é revelado pelo acerto. */
  casasOcultas: number[];
  /** Passo matemático principal da tarefa. L5 usa 0 porque os alvos são espalhados. */
  passo: -10 | -1 | 0 | 1 | 5 | 10;
  alvo: number;
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  if (max <= min) return min;
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function embaralhar<T>(itens: readonly T[], sorteio: () => number): T[] {
  const saida = [...itens];
  for (let i = saida.length - 1; i > 0; i -= 1) {
    const j = inteiro(0, i, sorteio);
    [saida[i], saida[j]] = [saida[j], saida[i]];
  }
  return saida;
}

function specLinha(nivel: number, sorteio: () => number): Quadrado100Spec {
  const linha = inteiro(0, 9, sorteio);
  const colunaInicial = inteiro(0, 5, sorteio);
  const inicio = linha * 10 + colunaInicial + 1;
  const caminho = [inicio + 1, inicio + 2, inicio + 3];
  return {
    nivel,
    modo: "linha",
    inicio,
    mostrarInicio: true,
    caminho,
    casasOcultas: caminho,
    passo: 1,
    alvo: caminho[caminho.length - 1],
    enunciado: `Comece no ${inicio} e conte de um em um. Toque nas casas vazias.`,
    falado: `Comece no ${inicio} e conte de um em um.`,
  };
}

function specVertical(nivel: number, sorteio: () => number): Quadrado100Spec {
  const linhaInicial = inteiro(0, 6, sorteio);
  const coluna = inteiro(1, 10, sorteio);
  const inicio = linhaInicial * 10 + coluna;
  const caminho = [inicio + 10, inicio + 20, inicio + 30];
  return {
    nivel,
    modo: "vertical",
    inicio,
    mostrarInicio: true,
    caminho,
    casasOcultas: caminho,
    passo: 10,
    alvo: caminho[caminho.length - 1],
    enunciado: `Comece no ${inicio} e conte de dez em dez. Toque nas casas vazias.`,
    falado: `Comece no ${inicio} e conte de dez em dez.`,
  };
}

function specCinco(nivel: number, sorteio: () => number): Quadrado100Spec {
  const inicio = inteiro(1, 85, sorteio);
  const caminho = [inicio + 5, inicio + 10, inicio + 15];
  return {
    nivel,
    modo: "cinco",
    inicio,
    mostrarInicio: true,
    caminho,
    casasOcultas: caminho,
    passo: 5,
    alvo: caminho[caminho.length - 1],
    enunciado: `Comece no ${inicio} e conte de cinco em cinco. Toque nas casas vazias.`,
    falado: `Comece no ${inicio} e conte de cinco em cinco.`,
  };
}

interface VizinhoValido { inicio: number; passo: -10 | -1 | 1 | 10; alvo: number }

function vizinhosValidos(): VizinhoValido[] {
  const pares: VizinhoValido[] = [];
  for (let inicio = 1; inicio <= 100; inicio += 1) {
    const coluna = (inicio - 1) % 10;
    const linha = Math.floor((inicio - 1) / 10);
    if (coluna < 9) pares.push({ inicio, passo: 1, alvo: inicio + 1 });
    if (coluna > 0) pares.push({ inicio, passo: -1, alvo: inicio - 1 });
    if (linha < 9) pares.push({ inicio, passo: 10, alvo: inicio + 10 });
    if (linha > 0) pares.push({ inicio, passo: -10, alvo: inicio - 10 });
  }
  return pares;
}

const VIZINHOS_VALIDOS = vizinhosValidos();

function specVizinho(nivel: number, sorteio: () => number): Quadrado100Spec {
  const escolhido = VIZINHOS_VALIDOS[inteiro(0, VIZINHOS_VALIDOS.length - 1, sorteio)];
  const direcao = escolhido.passo === 1
    ? "um a mais"
    : escolhido.passo === -1
      ? "um a menos"
      : escolhido.passo === 10
        ? "dez a mais"
        : "dez a menos";
  return {
    nivel,
    modo: "vizinho",
    inicio: escolhido.inicio,
    mostrarInicio: true,
    caminho: [escolhido.alvo],
    casasOcultas: [escolhido.alvo],
    passo: escolhido.passo,
    alvo: escolhido.alvo,
    enunciado: `Parta do ${escolhido.inicio}. Qual casa é ${direcao}?`,
    falado: `Parta do ${escolhido.inicio}. Encontre ${direcao}.`,
  };
}

function specLacunas(nivel: number, sorteio: () => number): Quadrado100Spec {
  const candidatas = Array.from({ length: 78 }, (_, i) => i + 12); // 12…89: sempre há contexto ao redor.
  const ocultas = embaralhar(candidatas, sorteio).slice(0, 5).sort((a, b) => a - b);
  // A ordem de procura NÃO acompanha a posição no quadro: evita resolver só
  // varrendo as lacunas de cima para baixo.
  const caminho = embaralhar(ocultas, sorteio);
  return {
    nivel,
    modo: "lacunas",
    inicio: caminho[0],
    mostrarInicio: false,
    caminho,
    casasOcultas: ocultas,
    passo: 0,
    alvo: caminho[caminho.length - 1],
    enunciado: "Há casas em branco. Encontre cada número que eu pedir.",
    falado: "Vamos preencher as casas em branco usando o padrão do quadro.",
  };
}

export function construirQuadrado100Spec(
  nivel: number,
  sorteio: () => number = Math.random,
): Quadrado100Spec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  if (clamped === 1) return specLinha(clamped, sorteio);
  if (clamped === 2) return specVertical(clamped, sorteio);
  if (clamped === 3) return specCinco(clamped, sorteio);
  if (clamped === 4) return specVizinho(clamped, sorteio);
  return specLacunas(clamped, sorteio);
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N2.02 sem micro do nível ${nivel}.`);
  return micro;
}

/**
 * Builder especializado F36. Não cria um case genérico `hundred-chart`: outras
 * fichas que nomeiam Quadrado100 ainda precisam de seus próprios contratos.
 */
export function construirQuadrado100Question(
  ficha: FichaCompetencia,
  level: number,
): Question {
  if (ficha.id !== "N2.02") throw new Error(`quadrado100Contract recebeu ${ficha.id}.`);
  const spec = construirQuadrado100Spec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "quadrado100-f36",
    prompt: spec.enunciado,
    audioPrompt: spec.falado,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    masteryRule: {
      acertos: micro.dominio.acertos,
      de: micro.dominio.de,
      sessoes: micro.dominio.sessoes,
    },
    ...(micro.dominio.exige ? { exigeEvidencia: micro.dominio.exige.evidencia } : {}),
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    answer: spec.alvo,
    evaluate: answer => Number(answer) === spec.alvo,
    options: undefined,
  };
}
