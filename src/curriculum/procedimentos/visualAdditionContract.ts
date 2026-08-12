import { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { VisualAdditionMisconception } from "./visualAdditionSemantics";

export type VisualAdditionRepresentation = "objetos" | "numerais" | "simbolo";

export interface VisualAdditionSpec {
  nivel: number;
  a: number;
  b: number;
  total: number;
  representacao: VisualAdditionRepresentation;
  emoji: string;
  mostrarBotaoJuntar: boolean;
  maoFantasma: boolean;
  tecladoAte: number;
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function parcelasAte(limite: number, sorteio: () => number): [number, number] {
  const a = inteiro(1, Math.max(1, limite - 1), sorteio);
  const b = inteiro(1, Math.max(1, limite - a), sorteio);
  return [a, b];
}

/** F13: objetos+numerais → numerais nos contêineres → símbolo puro. */
export function construirVisualAdditionSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): VisualAdditionSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const limite = clamped <= 2 ? 5 : 10;
  const [a, b] = parcelasAte(limite, sorteio);
  const total = a + b;
  const emojis = ["🐢", "🦕", "🚀", "⚽", "⭐", "🍎"];
  const emoji = emojis[inteiro(0, emojis.length - 1, sorteio)];
  const representacao: VisualAdditionRepresentation = clamped <= 3
    ? "objetos"
    : clamped === 4
      ? "numerais"
      : "simbolo";

  return {
    nivel: clamped,
    a,
    b,
    total,
    representacao,
    emoji,
    mostrarBotaoJuntar: clamped === 2,
    maoFantasma: clamped === 1,
    // 0..10: teclado fechado e previsível; o relógio L5 continua silencioso.
    tecladoAte: 11,
    enunciado: representacao === "simbolo" ? `${a} + ${b} = ?` : "Junte os dois grupos. Quantos ficam?",
    falado: `Junte ${a} e ${b}. Quantos ficam?`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N3.01 sem micro do nível ${nivel}.`);
  return micro;
}

function misconceptionDaResposta(spec: VisualAdditionSpec, value: number): string | undefined {
  if (value === spec.total) return undefined;
  if (value === spec.a || value === spec.b) return VisualAdditionMisconception.REPETE_PARCELA;
  if (Math.abs(value - spec.total) === 1) return VisualAdditionMisconception.OFF_BY_ONE;
  if (value === Math.abs(spec.a - spec.b)) return VisualAdditionMisconception.SUBTRAIU;
  return undefined;
}

function opcoes(spec: VisualAdditionSpec) {
  return Array.from({ length: spec.tecladoAte }, (_, value) => {
    const misconception = misconceptionDaResposta(spec, value);
    return {
      label: String(value),
      value,
      ...(misconception ? { tag: misconception, misconception } : {}),
    };
  });
}

/** Builder local da W8. Não cria dispatch genérico para `visual-addition`. */
export function construirVisualAdditionQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.01") throw new Error(`visualAdditionContract recebeu ${ficha.id}.`);
  const spec = construirVisualAdditionSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "visual-addition-f13",
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
    options: opcoes(spec),
    answer: spec.total,
    evaluate: answer => Number(answer) === spec.total,
  };
}
