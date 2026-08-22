import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const OperarNegativosMisconception = {
  IGNORA_SINAL: "ignora-sinal",
  DIRECAO_ERRADA: "direcao-errada",
  SUBTRAIR_NEGATIVO: "subtrair-negativo",
} as const;
export type OperarNegativosMisconceptionTag = typeof OperarNegativosMisconception[keyof typeof OperarNegativosMisconception];
export type OperarNegativosModo = "soma-pos-neg" | "soma-neg-pos" | "dois-negativos" | "subtracao-negativo" | "expressoes-mistas";
export interface OperarNegativosF85Spec {
  nivel: number;
  modo: OperarNegativosModo;
  inicio: number;
  fim: number;
  posicaoInicial: number;
  resposta: number;
  expressao: string;
  movimentos: number[];
  primitivas: ["InteractiveNumberLine"];
  cruzaZero: boolean;
  contexto: "saldo" | "divida" | "misto";
  opcoes: Array<{ value: number; label: string; misconception?: OperarNegativosMisconceptionTag }>;
}
interface OperarNegativosShow {
  inicio: number;
  fim: number;
  posicao: number;
  expressao: string;
  movimentos?: number[];
  destacarZero?: boolean;
  contexto?: "saldo" | "divida" | "misto";
}
const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
function opts(correta: number, erradas: Array<{ value: number; misconception: OperarNegativosMisconceptionTag }>): OperarNegativosF85Spec["opcoes"] {
  return [{ value: correta, label: String(correta) }, ...erradas.map(item => ({ ...item, label: String(item.value) }))]
    .filter((item, index, all) => all.findIndex(other => other.value === item.value) === index)
    .slice(0, 4);
}

export function construirOperarNegativosSpec(level: number): OperarNegativosF85Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    nivel, modo: "soma-pos-neg", inicio: -10, fim: 10, posicaoInicial: 4, resposta: -2,
    expressao: "4 + (−6)", movimentos: [4, -2], primitivas: ["InteractiveNumberLine"], cruzaZero: true, contexto: "saldo",
    opcoes: opts(-2, [
      { value: 10, misconception: OperarNegativosMisconception.IGNORA_SINAL },
      { value: 2, misconception: OperarNegativosMisconception.DIRECAO_ERRADA },
      { value: -10, misconception: OperarNegativosMisconception.IGNORA_SINAL },
    ]),
  };
  if (nivel === 2) return {
    nivel, modo: "soma-neg-pos", inicio: -10, fim: 10, posicaoInicial: -7, resposta: -4,
    expressao: "−7 + 3", movimentos: [-7, -4], primitivas: ["InteractiveNumberLine"], cruzaZero: false, contexto: "saldo",
    opcoes: opts(-4, [
      { value: -10, misconception: OperarNegativosMisconception.DIRECAO_ERRADA },
      { value: 4, misconception: OperarNegativosMisconception.IGNORA_SINAL },
      { value: 10, misconception: OperarNegativosMisconception.IGNORA_SINAL },
    ]),
  };
  if (nivel === 3) return {
    nivel, modo: "dois-negativos", inicio: -12, fim: 6, posicaoInicial: -3, resposta: -7,
    expressao: "−3 + (−4)", movimentos: [-3, -7], primitivas: ["InteractiveNumberLine"], cruzaZero: false, contexto: "divida",
    opcoes: opts(-7, [
      { value: 1, misconception: OperarNegativosMisconception.IGNORA_SINAL },
      { value: 7, misconception: OperarNegativosMisconception.IGNORA_SINAL },
      { value: -1, misconception: OperarNegativosMisconception.DIRECAO_ERRADA },
    ]),
  };
  if (nivel === 4) return {
    nivel, modo: "subtracao-negativo", inicio: -10, fim: 10, posicaoInicial: -2, resposta: 3,
    expressao: "−2 − (−5)", movimentos: [-2, 3], primitivas: ["InteractiveNumberLine"], cruzaZero: true, contexto: "divida",
    opcoes: opts(3, [
      { value: -7, misconception: OperarNegativosMisconception.SUBTRAIR_NEGATIVO },
      { value: 7, misconception: OperarNegativosMisconception.IGNORA_SINAL },
      { value: -3, misconception: OperarNegativosMisconception.DIRECAO_ERRADA },
    ]),
  };
  return {
    nivel, modo: "expressoes-mistas", inicio: -12, fim: 12, posicaoInicial: -4, resposta: 4,
    expressao: "−4 + 7 − (−3) + (−2)", movimentos: [-4, 3, 6, 4], primitivas: ["InteractiveNumberLine"], cruzaZero: true, contexto: "misto",
    opcoes: opts(4, [
      { value: -2, misconception: OperarNegativosMisconception.SUBTRAIR_NEGATIVO },
      { value: -8, misconception: OperarNegativosMisconception.DIRECAO_ERRADA },
      { value: 12, misconception: OperarNegativosMisconception.IGNORA_SINAL },
    ]),
  };
}

export function construirOperarNegativosResolucao(spec: OperarNegativosF85Spec): ResolucaoDeclarativa<OperarNegativosShow, number, OperarNegativosMisconceptionTag> {
  const semantica = spec.modo === "subtracao-negativo"
    ? "Subtrair um negativo é cancelar uma dívida: −2 − (−5) vira −2 + 5."
    : "Somar um negativo move para a esquerda; somar um positivo move para a direita.";
  return {
    estadoInicial: { inicio: spec.inicio, fim: spec.fim, posicao: spec.posicaoInicial, expressao: spec.expressao, destacarZero: true, contexto: spec.contexto },
    passos: [
      {
        id: "ancorar-primeiro-numero",
        say: "Marque o primeiro número e mantenha o zero como referência.",
        show: { inicio: spec.inicio, fim: spec.fim, posicao: spec.posicaoInicial, expressao: spec.expressao, destacarZero: true, contexto: spec.contexto },
        corrige: [OperarNegativosMisconception.IGNORA_SINAL],
        parcial: spec.posicaoInicial,
      },
      {
        id: "interpretar-operacao",
        say: semantica,
        show: { inicio: spec.inicio, fim: spec.fim, posicao: spec.resposta, expressao: spec.expressao, movimentos: spec.movimentos, destacarZero: true, contexto: spec.contexto },
        corrige: [OperarNegativosMisconception.DIRECAO_ERRADA, OperarNegativosMisconception.SUBTRAIR_NEGATIVO],
        parcial: spec.resposta,
      },
    ],
    fallback: 0,
  };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N7.02 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirOperarNegativosQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "N7.02") throw new Error(`operarNegativosContract recebeu ${ficha.id}.`);
  const spec = construirOperarNegativosSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(item => item.id === id);
  if (!micro) throw new Error(`N7.02 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "subtracao-negativo"
    ? `Você tinha saldo ${spec.posicaoInicial}. Cancelar uma dívida de 5 deixa qual saldo?`
    : `Quanto vale ${spec.expressao}?`;
  const options: Option[] = spec.opcoes;
  return {
    kind: "operar-negativos-f85",
    prompt,
    audioPrompt: prompt,
    howto: ficha.howto,
    explain: ficha.explain,
    tutorial: normalizeFichaTutorial(micro.params.tutorial),
    resolucao: construirOperarNegativosResolucao(spec),
    masteryRule: mastery(ficha, spec.nivel),
    uiProps: spec,
    options,
    answer: spec.resposta,
    evaluate: answer => Number(answer) === spec.resposta,
  };
}
