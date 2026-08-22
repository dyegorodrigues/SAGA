import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const AngulosMisconception = {
  ANGULO_PELO_LADO: "angulo-pelo-lado",
  CONFUNDE_AGUDO_OBTUSO: "confunde-agudo-obtuso",
  TRANSFERIDOR_INVERTIDO: "transferidor-invertido",
} as const;
export type AngulosMisconceptionTag = typeof AngulosMisconception[keyof typeof AngulosMisconception];
export type AngulosModo = "classificar" | "comparar" | "lados-diferentes" | "medir-graus" | "poligonos";

export interface AngulosF78Spec {
  nivel: number;
  modo: AngulosModo;
  anguloA: number;
  anguloB?: number;
  ladoA?: number;
  ladoB?: number;
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: AngulosMisconceptionTag }>;
}
interface AngulosShow { anguloA: number; anguloB?: number; destacarArco?: boolean; esticarLado?: boolean; mostrarGraus?: boolean; }

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const tipo = (g: number) => g === 90 ? "reto" : g < 90 ? "agudo" : "obtuso";
function options(correta: string | number, erradas: Array<{ value: string | number; misconception: AngulosMisconceptionTag }>): AngulosF78Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(item => ({ ...item, label: String(item.value) }))]
    .filter((item, i, all) => all.findIndex(other => other.value === item.value) === i).slice(0, 4);
}

export function construirAngulosSpec(level: number): AngulosF78Spec {
  const nivel = clamp(level);
  if (nivel === 1) {
    const anguloA = 45;
    return { nivel, modo: "classificar", anguloA, resposta: "agudo", opcoes: options("agudo", [
      { value: "obtuso", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
      { value: "reto", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
    ]) };
  }
  if (nivel === 2) {
    return { nivel, modo: "comparar", anguloA: 65, anguloB: 120, resposta: "B", opcoes: options("B", [
      { value: "A", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
      { value: "iguais", misconception: AngulosMisconception.ANGULO_PELO_LADO },
    ]) };
  }
  if (nivel === 3) {
    return { nivel, modo: "lados-diferentes", anguloA: 55, anguloB: 105, ladoA: 145, ladoB: 72, resposta: "B", opcoes: options("B", [
      { value: "A", misconception: AngulosMisconception.ANGULO_PELO_LADO },
      { value: "iguais", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
    ]) };
  }
  if (nivel === 4) {
    return { nivel, modo: "medir-graus", anguloA: 40, resposta: 40, opcoes: options(40, [
      { value: 140, misconception: AngulosMisconception.TRANSFERIDOR_INVERTIDO },
      { value: 90, misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
      { value: 50, misconception: AngulosMisconception.ANGULO_PELO_LADO },
    ]) };
  }
  return { nivel, modo: "poligonos", anguloA: 120, resposta: "obtuso", opcoes: options("obtuso", [
    { value: "agudo", misconception: AngulosMisconception.CONFUNDE_AGUDO_OBTUSO },
    { value: "reto", misconception: AngulosMisconception.TRANSFERIDOR_INVERTIDO },
  ]) };
}

export function construirAngulosResolucao(spec: AngulosF78Spec): ResolucaoDeclarativa<AngulosShow, string | number, AngulosMisconceptionTag> {
  return {
    estadoInicial: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}) },
    passos: [
      { id: "ver-abertura", say: "Olhe a abertura junto ao vértice.", show: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}), destacarArco: true }, corrige: [AngulosMisconception.CONFUNDE_AGUDO_OBTUSO], parcial: spec.resposta },
      { id: "ignorar-comprimento", say: "Esticar os lados não muda o giro.", show: { anguloA: spec.anguloA, ...(spec.anguloB !== undefined ? { anguloB: spec.anguloB } : {}), destacarArco: true, esticarLado: true, mostrarGraus: spec.nivel >= 4 }, corrige: [AngulosMisconception.ANGULO_PELO_LADO, AngulosMisconception.TRANSFERIDOR_INVERTIDO], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}
function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}
export function construirAngulosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GE.06") throw new Error(`angulosContract recebeu ${ficha.id}.`);
  const spec = construirAngulosSpec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`GE.06 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "classificar" ? "Este ângulo é agudo, reto ou obtuso?"
    : spec.modo === "comparar" || spec.modo === "lados-diferentes" ? "Qual abertura é maior: A ou B?"
      : spec.modo === "medir-graus" ? "Quantos graus mede esta abertura?"
        : "Como é este ângulo do polígono?";
  const options: Option[] = spec.opcoes;
  return { kind: "angulos-f78", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirAngulosResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec,
    options, answer: spec.resposta, evaluate: answer => String(answer) === String(spec.resposta) };
}
