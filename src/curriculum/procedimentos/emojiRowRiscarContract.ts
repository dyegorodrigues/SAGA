import { Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import { FichaCompetencia, FichaMicro } from "../schema";
import { EmojiRowRiscarMisconception } from "./emojiRowRiscarSemantics";

export type EmojiRowRiscarRepresentation = "x" | "fantasma" | "pre-riscado" | "simbolo";

export interface EmojiRowRiscarSpec {
  nivel: number;
  total: number;
  remover: number;
  restante: number;
  emoji: string;
  modo: "riscar";
  representacao: EmojiRowRiscarRepresentation;
  maoFantasma: boolean;
  preRiscados: boolean;
  tecladoAte: number;
  enunciado: string;
  falado: string;
}

function inteiro(min: number, max: number, sorteio: () => number): number {
  const raw = sorteio();
  const bounded = Number.isFinite(raw) ? Math.max(0, Math.min(0.999999999, raw)) : 0;
  return min + Math.floor(bounded * (max - min + 1));
}

function operacaoNaoAmbigua(nivel: number, sorteio: () => number): [number, number] {
  const limite = nivel <= 2 ? 5 : 10;
  const minimo = nivel === 1 ? 4 : 3;
  const total = inteiro(minimo, limite, sorteio);
  let candidatos = Array.from({ length: total - 1 }, (_, i) => i + 1)
    .filter(remover => remover !== total - remover);
  if (nivel === 1) candidatos = candidatos.filter(remover => remover >= 2);
  if (candidatos.length === 0) candidatos = [1];
  const remover = candidatos[inteiro(0, candidatos.length - 1, sorteio)];
  return [total, remover];
}

/** F15: ação concreta → marca fantasma → leitura pré-riscada → símbolo puro. */
export function construirEmojiRowRiscarSpec(
  nivel: number,
  sorteio: () => number = Math.random,
): EmojiRowRiscarSpec {
  const clamped = Math.max(1, Math.min(5, Math.round(nivel)));
  const [total, remover] = operacaoNaoAmbigua(clamped, sorteio);
  const restante = total - remover;
  const emojis = ["🎈", "☄️", "🥚", "⭐", "🦕"];
  const emoji = emojis[inteiro(0, emojis.length - 1, sorteio)];
  const representacao: EmojiRowRiscarRepresentation = clamped <= 2
    ? "x"
    : clamped === 3
      ? "fantasma"
      : clamped === 4
        ? "pre-riscado"
        : "simbolo";

  return {
    nivel: clamped,
    total,
    remover,
    restante,
    emoji,
    modo: "riscar",
    representacao,
    maoFantasma: clamped === 1,
    preRiscados: clamped === 4,
    tecladoAte: 10,
    enunciado: clamped <= 3
      ? `Risque ${remover} e diga quantos sobraram.`
      : clamped === 4
        ? "Leia o que saiu e complete a conta."
        : "Resolva:",
    falado: clamped <= 3
      ? `Risque ${remover}. Quantos sobraram?`
      : `${total} menos ${remover}. Quantos sobraram?`,
  };
}

function microDoNivel(ficha: FichaCompetencia, nivel: number): FichaMicro {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(candidate => candidate.id === microId);
  if (!micro) throw new Error(`N3.02 sem micro do nível ${nivel}.`);
  return micro;
}

export function diagnosticoDaRespostaRiscar(spec: EmojiRowRiscarSpec, value: number): string | undefined {
  if (value === spec.restante) return undefined;
  if (value === spec.remover) return EmojiRowRiscarMisconception.RESPONDE_O_REMOVIDO;
  if (value === spec.total) return EmojiRowRiscarMisconception.RESPONDE_O_TODO;
  if (Math.abs(value - spec.restante) === 1) return EmojiRowRiscarMisconception.OFF_BY_ONE;
  if (value === spec.total + spec.remover) return EmojiRowRiscarMisconception.SOMOU;
  return undefined;
}

function opcoesDiagnosticas(spec: EmojiRowRiscarSpec) {
  const candidatos = [
    spec.restante,
    spec.remover,
    spec.total,
    spec.restante - 1,
    spec.restante + 1,
    spec.total + spec.remover,
  ].filter(value => Number.isInteger(value) && value >= 0 && value <= spec.tecladoAte);
  const unicos = [...new Set(candidatos)];
  if (unicos.length < 2) unicos.push(spec.restante === 0 ? 1 : 0);
  return unicos.slice(0, 6).map(value => {
    const misconception = diagnosticoDaRespostaRiscar(spec, value);
    return {
      label: String(value),
      value,
      ...(misconception ? { tag: misconception, misconception } : {}),
    };
  });
}

/** Builder especializado da W9. O renderer legado `subvis` permanece intacto. */
export function construirEmojiRowRiscarQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N3.02") throw new Error(`emojiRowRiscarContract recebeu ${ficha.id}.`);
  const spec = construirEmojiRowRiscarSpec(level);
  const micro = microDoNivel(ficha, spec.nivel);
  const rtAlvoMs = ficha.niveis?.[spec.nivel]?.rt_alvo;

  return {
    kind: "emojirow-riscar-f15",
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
    ...(typeof rtAlvoMs === "number" && rtAlvoMs > 0 ? { rt_max_s: rtAlvoMs / 1000 } : {}),
    uiProps: spec,
    options: opcoesDiagnosticas(spec),
    answer: spec.restante,
    evaluate: answer => Number(answer) === spec.restante,
  };
}
