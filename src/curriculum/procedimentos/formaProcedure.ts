import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/** Procedimento da F48/GE.02 — invariância de FORMAS PLANAS. */
export type Forma = "circulo" | "quadrado" | "triangulo" | "retangulo";
export type Figura = Forma;

export const FORMAS: Forma[] = ["circulo", "quadrado", "triangulo", "retangulo"];

/** Nome falado; o artigo evita frases telegráficas na voz. */
export const NOME: Record<Forma, string> = {
  circulo: "o círculo",
  quadrado: "o quadrado",
  triangulo: "o triângulo",
  retangulo: "o retângulo",
};

export const LADOS: Record<Forma, number> = {
  circulo: 0,
  quadrado: 4,
  triangulo: 3,
  retangulo: 4,
};

export function descricaoDeLados(forma: Forma): string {
  if (forma === "circulo") return "0 lados — uma curva contínua";
  if (forma === "quadrado") return "4 lados iguais";
  if (forma === "retangulo") return "4 lados — 2 longos e 2 curtos";
  return "3 lados";
}

type Representacao = "pura" | "real" | "mista";

interface DegrauDaF48 {
  gira: boolean;
  variaAparencia: boolean;
  representacao: Representacao;
  opcoes: number;
}

/**
 * Escada retificada com a fronteira curricular explícita.
 *
 * GE.02 é "formas planas básicas" no grafo. GE.04/F59 é "sólidos geométricos".
 * O antigo nível 5 de sólidos duplicava GE.04 e quebrava a progressão. O novo
 * nível 5 combina apenas transformações já ensinadas: pura + mundo real,
 * giro + cor + tamanho. É transferência, não conteúdo novo.
 */
const DEGRAUS: Record<number, DegrauDaF48> = {
  1: { gira: false, variaAparencia: false, representacao: "pura", opcoes: 3 },
  2: { gira: true, variaAparencia: false, representacao: "pura", opcoes: 3 },
  3: { gira: true, variaAparencia: true, representacao: "pura", opcoes: 4 },
  4: { gira: true, variaAparencia: true, representacao: "real", opcoes: 4 },
  5: { gira: true, variaAparencia: true, representacao: "mista", opcoes: 4 },
};

function degrau(nivel: number): DegrauDaF48 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const giraNoNivel = (n: number): boolean => degrau(n).gira;
export const variaAparenciaNoNivel = (n: number): boolean => degrau(n).variaAparencia;
export const mundoRealNoNivel = (n: number): boolean => degrau(n).representacao === "real";
export const misturaRepresentacoesNoNivel = (n: number): boolean => degrau(n).representacao === "mista";
export const opcoesDoNivel = (n: number): number => degrau(n).opcoes;

/** Ângulos que de fato mudam a aparência percebida da figura. */
export const ANGULOS: Record<Forma, number[]> = {
  circulo: [0],
  quadrado: [45],
  triangulo: [120, 180, 210],
  retangulo: [30, 45, 60, 90],
};

export function anguloDe(forma: Forma, sorteio: () => number): number {
  const opcoes = ANGULOS[forma];
  return opcoes[Math.floor(sorteio() * opcoes.length) % opcoes.length];
}

export function aceitaGiro(forma: Forma): boolean {
  return ANGULOS[forma].some(a => a !== 0);
}

function inicio(nome: string): string {
  return nome.charAt(0).toUpperCase() + nome.slice(1);
}

function contarLados(forma: Forma): string {
  return LADOS[forma] === 0 ? "nenhum lado" : `${LADOS[forma]} lados`;
}

export const FALAS = {
  pergunta: (forma: Forma): string => `Qual é ${NOME[forma]}?`,

  // Não fixa "triângulo": o alvo é sorteado. A fala antiga podia pedir
  // quadrado e, em seguida, ensinar "o triângulo tem três lados".
  howto: "Olhe o contorno. Se houver lados, conte; mesmo virada, a forma continua a mesma.",
  explain: "Não use a posição, a cor ou o tamanho como pista. Compare lados e contorno.",

  acerto: (forma: Forma): string => forma === "circulo"
    ? "Isso! O círculo não tem lados — ele é uma curva contínua."
    : `Isso! ${inicio(NOME[forma])} tem ${descricaoDeLados(forma)}, em qualquer posição.`,

  erroSuave: (escolhida: Forma, certa: Forma): string => {
    const par = new Set<Forma>([escolhida, certa]);
    if (par.has("quadrado") && par.has("retangulo")) {
      return "Os dois têm 4 lados. O quadrado tem os quatro lados iguais; o retângulo tem dois longos e dois curtos.";
    }
    return `${inicio(NOME[escolhida])} tem ${contarLados(escolhida)}. ${inicio(NOME[certa])} tem ${contarLados(certa)}.`;
  },
};

export interface AcaoDeForma {
  pedida: Forma;
  escolhida: Forma;
  pedidaGirada: boolean;
  escolhidaEmPe: boolean;
}

export function diagnosticar(acao: AcaoDeForma): string | undefined {
  if (acao.escolhida === acao.pedida) return undefined;
  if (acao.pedidaGirada && acao.escolhidaEmPe) return MisconceptionTag.SO_ORIENTACAO_PADRAO;

  const par = new Set([acao.pedida, acao.escolhida]);
  if (par.has("quadrado") && par.has("retangulo")) {
    return MisconceptionTag.CONFUNDE_QUADRADO_RETANGULO;
  }
  return MisconceptionTag.IGNORA_LADOS;
}

/** §9: a evidência extra já viaja por Question.exigeEvidencia/evidenciasVistas. */
export function dominou(historico: AcaoDeForma[]): boolean {
  const acertos = historico.filter(a => a.escolhida === a.pedida);
  if (acertos.length < 3) return false;
  return acertos.some(a => a.pedidaGirada);
}

export function evidenciasDe(acao: AcaoDeForma): string[] {
  return acao.escolhida === acao.pedida && acao.pedidaGirada ? [Evidencia.FORMA_GIRADA] : [];
}
