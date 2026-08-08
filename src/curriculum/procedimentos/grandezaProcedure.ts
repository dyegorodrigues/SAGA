import { Evidencia } from "../../constants/evidencias";
import { MisconceptionTag } from "../../constants/misconceptions";

/** F49 — comparação direta de grandezas com uma referência justa. */
export type Atributo = "altura" | "comprimento" | "tamanho";
export type Polo = "maior" | "menor";
export type EixoDaGrandeza = "vertical" | "horizontal" | "uniforme";

interface DegrauDaF49 {
  atributo: Atributo;
  diferenca: number;
  objetosDiferentes: boolean;
  seria: boolean;
  reguaFantasma: boolean;
}

/**
 * §5. Uma coisa nova por vez:
 * - L1 aprende a comparação vertical;
 * - L2 troca somente o eixo: comprimento;
 * - L3 mantém altura e reduz a diferença;
 * - L4 mantém altura e troca a identidade dos objetos;
 * - L5 mantém uma única identidade visual e introduz só a SERIAÇÃO.
 */
const DEGRAUS: Record<number, DegrauDaF49> = {
  1: { atributo: "altura", diferenca: 0.45, objetosDiferentes: false, seria: false, reguaFantasma: false },
  2: { atributo: "comprimento", diferenca: 0.40, objetosDiferentes: false, seria: false, reguaFantasma: false },
  3: { atributo: "altura", diferenca: 0.14, objetosDiferentes: false, seria: false, reguaFantasma: true },
  4: { atributo: "altura", diferenca: 0.22, objetosDiferentes: true, seria: false, reguaFantasma: true },
  5: { atributo: "tamanho", diferenca: 0.20, objetosDiferentes: false, seria: true, reguaFantasma: true },
};

function degrau(nivel: number): DegrauDaF49 {
  return DEGRAUS[Math.min(5, Math.max(1, Math.round(nivel)))];
}

export const atributoDoNivel = (n: number): Atributo => degrau(n).atributo;
export const diferencaDoNivel = (n: number): number => degrau(n).diferenca;
export const objetosDiferentesNoNivel = (n: number): boolean => degrau(n).objetosDiferentes;
export const seriaNoNivel = (n: number): boolean => degrau(n).seria;
export const reguaFantasmaNoNivel = (n: number): boolean => degrau(n).reguaFantasma;
export const quantosNoNivel = (n: number): number => (seriaNoNivel(n) ? 3 : 2);
export const diferencaPequena = (n: number): boolean => diferencaDoNivel(n) <= 0.15;

export function eixoDoAtributo(atributo: Atributo): EixoDaGrandeza {
  if (atributo === "altura") return "vertical";
  if (atributo === "comprimento") return "horizontal";
  return "uniforme";
}

export const ADJETIVO: Record<Atributo, Record<Polo, string>> = {
  altura: { maior: "mais alto", menor: "mais baixo" },
  comprimento: { maior: "mais comprido", menor: "mais curto" },
  tamanho: { maior: "maior", menor: "menor" },
};

export const FALAS = {
  pergunta: (atributo: Atributo, polo: Polo, nome: string): string =>
    `Qual ${nome} é ${ADJETIVO[atributo][polo]}?`,
  perguntaDaSeriacao: (atributo: Atributo, polo: Polo): string =>
    `Toque do ${ADJETIVO[atributo][polo]} para o ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,

  // §7 canônica de L1; os outros eixos recebem a mesma regra em linguagem própria.
  howto: "Olhe onde os dois começam. Agora veja qual sobe mais.",
  explain: "Compare a partir do chão. Os dois começam na mesma linha.",
  howtoDoAtributo: (atributo: Atributo): string => atributo === "comprimento"
    ? "Olhe onde os dois começam. Agora veja qual vai mais longe."
    : atributo === "tamanho"
      ? "Compare o objeto inteiro. Veja a ordem do maior para o menor."
      : "Olhe onde os dois começam. Agora veja qual sobe mais.",
  explainDoAtributo: (atributo: Atributo): string => atributo === "comprimento"
    ? "Alinhe o começo dos dois. O que termina mais longe é o mais comprido."
    : atributo === "tamanho"
      ? "Compare de dois em dois e monte a ordem sem pular nenhum."
      : "Compare a partir do chão. Os dois começam na mesma linha.",

  acerto: (atributo: Atributo, polo: Polo): string => `Isso! Esse é ${ADJETIVO[atributo][polo]}.`,
  erroSuave: (atributo: Atributo, polo: Polo): string =>
    `Olhe a linha: esse é ${ADJETIVO[atributo][polo === "maior" ? "menor" : "maior"]}.`,
};

export interface AcaoDeGrandeza {
  escolhido: number;
  certo: number;
  vencedorDoOutroAtributo: number;
  diferencaPequena: boolean;
  /** A criança decidiu antes de a referência comum terminar de aparecer. */
  antesDaReferencia?: boolean;
  /** @deprecated nome da primeira implementação, mantido para replays/telemetria antigos de altura. */
  antesDoChao?: boolean;
  /** Opcional só para ações persistidas antes da modelagem por eixo; o runtime novo sempre emite. */
  atributo?: Atributo;
  /** L5: preserva a sequência inteira para telemetria futura sem mudar o valor-resposta. */
  ordemProduzida?: number[];
}

/** §6 — hipóteses; erro motor continua filtrado antes, no answerPolicy. */
export function diagnosticar(acao: AcaoDeGrandeza): string | undefined {
  if (acao.escolhido === acao.certo) return undefined;
  if (acao.antesDaReferencia || acao.antesDoChao) return MisconceptionTag.BASE_DESALINHADA;
  if (acao.vencedorDoOutroAtributo >= 0 && acao.escolhido === acao.vencedorDoOutroAtributo) {
    return MisconceptionTag.CONFUNDE_ATRIBUTOS;
  }
  if (acao.diferencaPequena) return MisconceptionTag.SO_DIFERENCA_GRANDE;
  return MisconceptionTag.CONFUNDE_ATRIBUTOS;
}

/** §9 — a retenção entre sessões mora no motor; aqui validamos a condição de conteúdo. */
export function dominou(historico: AcaoDeGrandeza[]): boolean {
  const acertos = historico.filter(a => a.escolhido === a.certo);
  return acertos.length >= 3 && acertos.some(a => a.diferencaPequena);
}

/** P13 já está integrado: esta evidência viaja answerPolicy → progressEngine. */
export function evidenciasDe(acao: AcaoDeGrandeza): string[] {
  return acao.escolhido === acao.certo && acao.diferencaPequena
    ? [Evidencia.DIFERENCA_PEQUENA]
    : [];
}
