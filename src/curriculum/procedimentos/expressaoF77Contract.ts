import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const ExpressaoF77Misconception = {
  RESOLVE_DA_ESQUERDA: "resolve-da-esquerda",
  IGNORA_PARENTESES: "ignora-parenteses",
  SO_INCOGNITA_NO_FIM: "so-incognita-no-fim",
} as const;
export type ExpressaoF77MisconceptionTag = typeof ExpressaoF77Misconception[keyof typeof ExpressaoF77Misconception];
export type ExpressaoF77Modo = "mesma-ordem" | "precedencia" | "parenteses" | "incognita-meio" | "propriedades";

export interface ExpressaoF77Opcao { value: number; label: string; misconception?: ExpressaoF77MisconceptionTag }
export interface ExpressaoF77Spec {
  nivel: number;
  modo: ExpressaoF77Modo;
  expressao: string;
  ladoDireito: string;
  prioridade: string;
  resposta: number;
  opcoes: ExpressaoF77Opcao[];
}
interface ExpressaoF77Show { expressao: string; ladoDireito: string; prioridade: string; destacarPrioridade?: boolean; colapsarPrioridade?: boolean; equilibrar?: boolean }

const specs: readonly ExpressaoF77Spec[] = [
  { nivel: 1, modo: "mesma-ordem", expressao: "18 ÷ 3 × 2", ladoDireito: "?", prioridade: "18 ÷ 3", resposta: 12, opcoes: [{ value: 12, label: "12" }, { value: 3, label: "3" }, { value: 9, label: "9" }, { value: 18, label: "18" }] },
  { nivel: 2, modo: "precedencia", expressao: "2 + 3 × 4", ladoDireito: "?", prioridade: "3 × 4", resposta: 14, opcoes: [{ value: 14, label: "14" }, { value: 20, label: "20", misconception: ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA }, { value: 24, label: "24" }, { value: 9, label: "9" }] },
  { nivel: 3, modo: "parenteses", expressao: "(2 + 3) × 4", ladoDireito: "?", prioridade: "(2 + 3)", resposta: 20, opcoes: [{ value: 20, label: "20" }, { value: 14, label: "14", misconception: ExpressaoF77Misconception.IGNORA_PARENTESES }, { value: 24, label: "24" }, { value: 18, label: "18" }] },
  { nivel: 4, modo: "incognita-meio", expressao: "3 + □ × 2", ladoDireito: "11", prioridade: "□ × 2", resposta: 4, opcoes: [{ value: 4, label: "4" }, { value: 8, label: "8", misconception: ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM }, { value: 7, label: "7" }, { value: 2, label: "2" }] },
  { nivel: 5, modo: "propriedades", expressao: "(4 + 3) × 5", ladoDireito: "4 × 5 + 3 × 5", prioridade: "distributiva", resposta: 35, opcoes: [{ value: 35, label: "35" }, { value: 27, label: "27" }, { value: 40, label: "40" }, { value: 20, label: "20" }] },
] as const;

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
export function construirExpressaoF77Spec(level: number): ExpressaoF77Spec {
  const spec = specs[clamp(level) - 1];
  return { ...spec, opcoes: spec.opcoes.map(option => ({ ...option })) };
}

export function construirExpressaoF77Resolucao(spec: ExpressaoF77Spec): ResolucaoDeclarativa<ExpressaoF77Show, number, ExpressaoF77MisconceptionTag> {
  const base = { expressao: spec.expressao, ladoDireito: spec.ladoDireito, prioridade: spec.prioridade };
  return {
    estadoInicial: base,
    passos: [
      { id: "encontrar-pacote", say: `Primeiro encontre o pacote: ${spec.prioridade}.`, show: { ...base, destacarPrioridade: true }, corrige: [ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA, ExpressaoF77Misconception.IGNORA_PARENTESES], parcial: spec.resposta },
      { id: "resolver-pacote", say: "Resolva esse pacote antes de continuar com o restante.", show: { ...base, destacarPrioridade: true, colapsarPrioridade: true }, corrige: [ExpressaoF77Misconception.RESOLVE_DA_ESQUERDA], parcial: spec.resposta },
      { id: "preservar-equilibrio", say: "A incógnita pode estar em qualquer lugar; o que importa é manter os dois lados com o mesmo valor.", show: { ...base, equilibrar: true }, corrige: [ExpressaoF77Misconception.SO_INCOGNITA_NO_FIM], parcial: spec.resposta },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const microId = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.06 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirExpressaoF77Question(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "AL.06") throw new Error(`expressaoF77Contract recebeu ${ficha.id}.`);
  const spec = construirExpressaoF77Spec(level);
  const microId = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === microId);
  if (!micro) throw new Error(`AL.06 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "incognita-meio" ? `Qual número torna ${spec.expressao} = ${spec.ladoDireito}?` : spec.modo === "propriedades" ? `As duas formas são equivalentes. Quanto vale ${spec.expressao}?` : `Quanto vale ${spec.expressao}?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "expressao-f77",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirExpressaoF77Resolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
