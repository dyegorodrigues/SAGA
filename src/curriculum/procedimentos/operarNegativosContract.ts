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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const ONM = OperarNegativosMisconception;
/** A ficha escreve o menos com o traço longo, como na tela da criança. */
const neg = (valor: number) => `−${Math.abs(valor)}`;

/**
 * CLASS-003 — a conta do nível é sorteada, a escada não.
 *
 * Era uma expressão por nível: 4 + (−6), −7 + 3, −3 + (−4), −2 − (−5) e
 * −4 + 7 − (−3) + (−2). A criança andava a MESMA reta seis vezes.
 *
 * O que cada nível ensina fica preso ao sinal, não ao número: L1 parte de um
 * positivo e cruza o zero, L2 parte de um negativo e NÃO cruza, L3 soma dois
 * negativos e vai mais para a esquerda, L4 subtrai um negativo e anda para a
 * direita. Sortear sem essas amarras trocaria o degrau de lugar.
 */
export function construirOperarNegativosSpec(level: number): OperarNegativosF85Spec {
  const nivel = clamp(level);
  const primitivas = ["InteractiveNumberLine"] as ["InteractiveNumberLine"];

  if (nivel === 1) {
    const inicioPos = ri(2, 7);
    const somado = -(inicioPos + ri(1, 5));
    const resposta = inicioPos + somado;
    return {
      nivel, modo: "soma-pos-neg", inicio: -12, fim: 12, posicaoInicial: inicioPos, resposta,
      expressao: `${inicioPos} + (${neg(somado)})`, movimentos: [inicioPos, resposta], primitivas,
      cruzaZero: true, contexto: "saldo",
      opcoes: opts(resposta, [
        { value: inicioPos - somado, misconception: ONM.IGNORA_SINAL },
        { value: -resposta, misconception: ONM.DIRECAO_ERRADA },
        { value: inicioPos + Math.abs(somado), misconception: ONM.IGNORA_SINAL },
      ]),
    };
  }

  if (nivel === 2) {
    const inicioNeg = -ri(4, 9);
    const somado = ri(1, Math.abs(inicioNeg) - 1);
    const resposta = inicioNeg + somado;
    return {
      nivel, modo: "soma-neg-pos", inicio: -12, fim: 12, posicaoInicial: inicioNeg, resposta,
      expressao: `${neg(inicioNeg)} + ${somado}`, movimentos: [inicioNeg, resposta], primitivas,
      cruzaZero: false, contexto: "saldo",
      opcoes: opts(resposta, [
        { value: inicioNeg - somado, misconception: ONM.DIRECAO_ERRADA },
        { value: -resposta, misconception: ONM.IGNORA_SINAL },
        { value: Math.abs(inicioNeg) + somado, misconception: ONM.IGNORA_SINAL },
      ]),
    };
  }

  if (nivel === 3) {
    const inicioNeg = -ri(2, 6);
    const somado = -ri(2, 6);
    const resposta = inicioNeg + somado;
    return {
      nivel, modo: "dois-negativos", inicio: resposta - 2, fim: 6, posicaoInicial: inicioNeg, resposta,
      expressao: `${neg(inicioNeg)} + (${neg(somado)})`, movimentos: [inicioNeg, resposta], primitivas,
      cruzaZero: false, contexto: "divida",
      opcoes: opts(resposta, [
        { value: Math.abs(inicioNeg) - Math.abs(somado), misconception: ONM.IGNORA_SINAL },
        { value: -resposta, misconception: ONM.IGNORA_SINAL },
        { value: inicioNeg - somado, misconception: ONM.DIRECAO_ERRADA },
      ]),
    };
  }

  if (nivel === 4) {
    const inicioNeg = -ri(1, 5);
    const subtraido = -ri(3, 8);
    const resposta = inicioNeg - subtraido;
    return {
      nivel, modo: "subtracao-negativo", inicio: -12, fim: 12, posicaoInicial: inicioNeg, resposta,
      expressao: `${neg(inicioNeg)} − (${neg(subtraido)})`, movimentos: [inicioNeg, resposta], primitivas,
      cruzaZero: resposta > 0, contexto: "divida",
      opcoes: opts(resposta, [
        { value: inicioNeg + subtraido, misconception: ONM.SUBTRAIR_NEGATIVO },
        { value: -resposta, misconception: ONM.IGNORA_SINAL },
        { value: inicioNeg - Math.abs(subtraido) + 1, misconception: ONM.DIRECAO_ERRADA },
      ]),
    };
  }

  const partida = -ri(2, 6);
  const mais = ri(4, 9);
  const menosNegativo = -ri(1, 4);
  const maisNegativo = -ri(1, 4);
  const passo1 = partida + mais;
  const passo2 = passo1 - menosNegativo;
  const resposta = passo2 + maisNegativo;
  const extremos = [partida, passo1, passo2, resposta];
  return {
    nivel, modo: "expressoes-mistas",
    inicio: Math.min(...extremos) - 2, fim: Math.max(...extremos) + 2,
    posicaoInicial: partida, resposta,
    expressao: `${neg(partida)} + ${mais} − (${neg(menosNegativo)}) + (${neg(maisNegativo)})`,
    movimentos: extremos, primitivas, cruzaZero: true, contexto: "misto",
    opcoes: opts(resposta, [
      { value: resposta + 2 * menosNegativo, misconception: ONM.SUBTRAIR_NEGATIVO },
      { value: partida - mais, misconception: ONM.DIRECAO_ERRADA },
      { value: Math.abs(partida) + mais, misconception: ONM.IGNORA_SINAL },
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
