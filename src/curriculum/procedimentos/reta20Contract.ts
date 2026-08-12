import { Evidencia } from "../../constants/evidencias";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { Question } from "../../types";

export type ModoReta20 = "localizar" | "saltar";

export interface Reta20Spec {
  nivel: number;
  modo: ModoReta20;
  inicio: 0;
  fim: 10 | 20;
  posicaoInicial: number;
  alvo: number;
  /** 0 em localização; positivo/negativo em salto. */
  salto: number;
  numeraisVisiveis: number[];
  enunciado: string;
  falado: string;
  emoji: "🚀";
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  if (max <= min) return min;
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

const faixa = (fim: number) => Array.from({ length: fim + 1 }, (_, i) => i);

function alvoParcial(sorteio: () => number): number {
  // L4 existe justamente para localizar onde a legenda não entrega a resposta.
  const candidatos = faixa(20).filter(n => n > 0 && ![5, 10].includes(n));
  return candidatos[inteiro(0, candidatos.length - 1, sorteio)];
}

function specDeSalto(
  nivel: number,
  fim: 10 | 20,
  direcoes: readonly (-1 | 1)[],
  maxMagnitude: number,
  sorteio: () => number,
): Reta20Spec {
  const direcao = direcoes[inteiro(0, direcoes.length - 1, sorteio)];
  const magnitude = inteiro(1, maxMagnitude, sorteio);
  const salto = direcao * magnitude;
  const minStart = salto < 0 ? magnitude : 0;
  const maxStart = salto > 0 ? fim - magnitude : fim;
  const posicaoInicial = inteiro(minStart, maxStart, sorteio);
  const alvo = posicaoInicial + salto;
  const sinal = salto > 0 ? `+${salto}` : String(salto);

  return {
    nivel,
    modo: "saltar",
    inicio: 0,
    fim,
    posicaoInicial,
    alvo,
    salto,
    numeraisVisiveis: faixa(fim),
    enunciado: `Comece no ${posicaoInicial} e salte ${sinal}. Onde você chega?`,
    falado: `Comece no ${posicaoInicial}. Salte ${Math.abs(salto)} ${salto > 0 ? "para a frente" : "para trás"}.`,
    emoji: "🚀",
  };
}

export function construirReta20Spec(
  nivel: number,
  sorteio: () => number = Math.random,
): Reta20Spec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));

  if (clamped === 1) {
    const alvo = inteiro(1, 10, sorteio);
    return {
      nivel: 1,
      modo: "localizar",
      inicio: 0,
      fim: 10,
      posicaoInicial: 0,
      alvo,
      salto: 0,
      numeraisVisiveis: faixa(10),
      enunciado: `Onde fica o ${alvo}?`,
      falado: `Onde fica o ${alvo}?`,
      emoji: "🚀",
    };
  }

  if (clamped === 2) return specDeSalto(2, 10, [1], 3, sorteio);
  if (clamped === 3) return specDeSalto(3, 10, [-1], 3, sorteio);

  if (clamped === 4) {
    const alvo = alvoParcial(sorteio);
    return {
      nivel: 4,
      modo: "localizar",
      inicio: 0,
      fim: 20,
      posicaoInicial: 0,
      alvo,
      salto: 0,
      numeraisVisiveis: [0, 5, 10],
      enunciado: `Onde fica o ${alvo}?`,
      falado: `Encontre onde fica o ${alvo} nesta reta.`,
      emoji: "🚀",
    };
  }

  return specDeSalto(5, 20, [-1, 1], 4, sorteio);
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N1.12 sem micro do nível ${nivel}.`);
  return micro;
}

/** Builder especializado F19; não altera o builder `numberline` genérico. */
export function construirReta20Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N1.12") throw new Error(`reta20Contract recebeu ${ficha.id}.`);
  const spec = construirReta20Spec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "numberline-f19",
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

export { Evidencia };