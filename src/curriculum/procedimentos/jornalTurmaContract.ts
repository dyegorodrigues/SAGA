import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const JornalTurmaMisconception = {
  IGNORA_ESCALA: "ignora-escala",
  BARRA_ERRADA: "barra-errada",
  CONFUNDE_POSSIVEL_PROVAVEL: "confunde-possivel-provavel",
} as const;
export type JornalTurmaMisconceptionTag = typeof JornalTurmaMisconception[keyof typeof JornalTurmaMisconception];
export type JornalTurmaModo = "ler-barra" | "comparar-barras" | "completar-barra" | "construir-grafico" | "probabilidade";

export interface JornalTurmaF64Spec {
  nivel: number;
  modo: JornalTurmaModo;
  categorias: string[];
  valores: number[];
  escala: number;
  resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: JornalTurmaMisconceptionTag }>;
}

interface JornalTurmaShow { categorias: string[]; valores: number[]; escala: number; destacarEscala?: boolean }
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function opts(correta: string | number, erradas: Array<{ value: string | number; misconception: JornalTurmaMisconceptionTag }>): JornalTurmaF64Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(x => ({ ...x, label: String(x.value) }))]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .slice(0, 4);
}

export function construirJornalTurmaSpec(level: number): JornalTurmaF64Spec {
  const nivel = clamp(level);
  const categorias = ["Livros", "Jogos", "Música"];
  if (nivel === 1) return { nivel, modo: "ler-barra", categorias, valores: [4, 8, 6], escala: 2, resposta: 8, opcoes: opts(8, [{ value: 4, misconception: JornalTurmaMisconception.IGNORA_ESCALA }, { value: 6, misconception: JornalTurmaMisconception.BARRA_ERRADA }]) };
  if (nivel === 2) return { nivel, modo: "comparar-barras", categorias, valores: [6, 10, 4], escala: 2, resposta: "Jogos", opcoes: opts("Jogos", [{ value: "Livros", misconception: JornalTurmaMisconception.BARRA_ERRADA }, { value: "Música", misconception: JornalTurmaMisconception.IGNORA_ESCALA }]) };
  if (nivel === 3) return { nivel, modo: "completar-barra", categorias, valores: [5, 0, 9], escala: 1, resposta: 7, opcoes: opts(7, [{ value: 5, misconception: JornalTurmaMisconception.BARRA_ERRADA }, { value: 14, misconception: JornalTurmaMisconception.IGNORA_ESCALA }]) };
  if (nivel === 4) return { nivel, modo: "construir-grafico", categorias, valores: [3, 9, 6], escala: 3, resposta: 9, opcoes: opts(9, [{ value: 3, misconception: JornalTurmaMisconception.IGNORA_ESCALA }, { value: 6, misconception: JornalTurmaMisconception.BARRA_ERRADA }]) };
  return { nivel, modo: "probabilidade", categorias: ["azul", "verde", "amarela"], valores: [6, 3, 1], escala: 1, resposta: "azul", opcoes: opts("azul", [{ value: "verde", misconception: JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL }, { value: "amarela", misconception: JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL }]) };
}

export function construirJornalTurmaResolucao(spec: JornalTurmaF64Spec): ResolucaoDeclarativa<JornalTurmaShow, string | number, JornalTurmaMisconceptionTag> {
  const show = { categorias: spec.categorias, valores: spec.valores, escala: spec.escala, destacarEscala: true };
  return { estadoInicial: show, passos: [
    { id: "ler-eixo", say: "Primeiro confira quanto vale cada marca da escala.", show, corrige: [JornalTurmaMisconception.IGNORA_ESCALA], parcial: spec.resposta },
    { id: "ligar-dado-barra", say: "Depois ligue cada rótulo ao dado e à altura da sua barra.", show, corrige: [JornalTurmaMisconception.BARRA_ERRADA, JornalTurmaMisconception.CONFUNDE_POSSIVEL_PROVAVEL], parcial: spec.resposta },
  ], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.02 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirJornalTurmaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "PE.02") throw new Error(`jornalTurmaContract recebeu ${ficha.id}.`);
  const spec = construirJornalTurmaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`PE.02 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "ler-barra" ? "Quantos votos tem Jogos?" : spec.modo === "comparar-barras" ? "Qual categoria tem mais votos?" : spec.modo === "completar-barra" ? "A tabela diz 7 para Jogos. Até qual valor a barra deve chegar?" : spec.modo === "construir-grafico" ? "Qual altura deve ter a barra de Jogos?" : "Qual cor é mais provável de sair?";
  const options: Option[] = spec.opcoes;
  return { kind: "jornal-turma-f64", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirJornalTurmaResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => String(a) === String(spec.resposta) };
}
