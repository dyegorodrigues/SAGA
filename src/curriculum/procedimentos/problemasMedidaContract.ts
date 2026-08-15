import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const ProblemasMedidaMisconception = {
  COMPARA_SEM_CONVERTER: "compara-sem-converter",
  INVERTE_OPERACAO: "inverte-operacao",
  MISTURA_GRANDEZAS: "mistura-grandezas",
} as const;
export type ProblemasMedidaMisconceptionTag = typeof ProblemasMedidaMisconception[keyof typeof ProblemasMedidaMisconception];
export type ProblemasMedidaModo = "converter-comprimento" | "converter-grandezas" | "comparar-apos-converter" | "operar-unidades-mistas" | "problema-multietapa";
export type UnidadeF82 = "cm" | "m" | "g" | "kg" | "ml" | "L";

export interface ConversaoF82 {
  de: UnidadeF82;
  para: UnidadeF82;
  fator: number;
  valorInicial: number;
  valorConvertido: number;
}

export interface ValorMedidaF82 {
  valor: number;
  unidade: UnidadeF82;
}

export interface ProblemasMedidaF82Spec {
  nivel: number;
  modo: ProblemasMedidaModo;
  primitivas: ["NumberLine", "Balanca"];
  grandeza: "comprimento" | "massa" | "capacidade";
  conversao: ConversaoF82;
  mesmaQuantidade: true;
  valoresOriginais?: [ValorMedidaF82, ValorMedidaF82];
  exigeConversaoAntes: boolean;
  unidadesMistas: boolean;
  etapas: number;
  resposta: number;
  unidadeResposta: UnidadeF82;
  opcoes: Array<{ value: number; label: string; misconception?: ProblemasMedidaMisconceptionTag }>;
}

interface ProblemasMedidaShow {
  conversao: ConversaoF82;
  valoresOriginais?: [ValorMedidaF82, ValorMedidaF82];
  unidadeResposta: UnidadeF82;
  exigeConversaoAntes: boolean;
}

const clamp = (n: number) => Math.max(1, Math.min(5, Math.round(n)));
const rotulo = (valor: number, unidade: UnidadeF82) => `${valor} ${unidade}`;
function opts(correta: number, unidade: UnidadeF82, erradas: Array<{ value: number; misconception: ProblemasMedidaMisconceptionTag }>): ProblemasMedidaF82Spec["opcoes"] {
  return [{ value: correta, label: rotulo(correta, unidade) }, ...erradas.map(x => ({ ...x, label: rotulo(x.value, unidade) }))]
    .filter((x, i, a) => a.findIndex(y => y.value === x.value) === i)
    .slice(0, 4);
}

export function construirProblemasMedidaSpec(level: number): ProblemasMedidaF82Spec {
  const nivel = clamp(level);
  if (nivel === 1) return {
    nivel, modo: "converter-comprimento", primitivas: ["NumberLine", "Balanca"], grandeza: "comprimento",
    conversao: { de: "m", para: "cm", fator: 100, valorInicial: 2, valorConvertido: 200 }, mesmaQuantidade: true,
    exigeConversaoAntes: false, unidadesMistas: false, etapas: 1, resposta: 200, unidadeResposta: "cm",
    opcoes: opts(200, "cm", [{ value: 20, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO }, { value: 2, misconception: ProblemasMedidaMisconception.MISTURA_GRANDEZAS }]),
  };
  if (nivel === 2) return {
    nivel, modo: "converter-grandezas", primitivas: ["NumberLine", "Balanca"], grandeza: "massa",
    conversao: { de: "kg", para: "g", fator: 1000, valorInicial: 3, valorConvertido: 3000 }, mesmaQuantidade: true,
    exigeConversaoAntes: false, unidadesMistas: false, etapas: 1, resposta: 3000, unidadeResposta: "g",
    opcoes: opts(3000, "g", [{ value: 300, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO }, { value: 3, misconception: ProblemasMedidaMisconception.MISTURA_GRANDEZAS }]),
  };
  if (nivel === 3) return {
    nivel, modo: "comparar-apos-converter", primitivas: ["NumberLine", "Balanca"], grandeza: "comprimento",
    conversao: { de: "m", para: "cm", fator: 100, valorInicial: 2, valorConvertido: 200 }, mesmaQuantidade: true,
    valoresOriginais: [{ valor: 2, unidade: "m" }, { valor: 150, unidade: "cm" }], exigeConversaoAntes: true, unidadesMistas: true, etapas: 2,
    resposta: 200, unidadeResposta: "cm",
    opcoes: opts(200, "cm", [{ value: 150, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER }, { value: 20, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO }]),
  };
  if (nivel === 4) return {
    nivel, modo: "operar-unidades-mistas", primitivas: ["NumberLine", "Balanca"], grandeza: "comprimento",
    conversao: { de: "m", para: "cm", fator: 100, valorInicial: 1, valorConvertido: 100 }, mesmaQuantidade: true,
    valoresOriginais: [{ valor: 1, unidade: "m" }, { valor: 75, unidade: "cm" }], exigeConversaoAntes: true, unidadesMistas: true, etapas: 2,
    resposta: 175, unidadeResposta: "cm",
    opcoes: opts(175, "cm", [{ value: 76, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER }, { value: 25, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO }]),
  };
  return {
    nivel, modo: "problema-multietapa", primitivas: ["NumberLine", "Balanca"], grandeza: "capacidade",
    conversao: { de: "L", para: "ml", fator: 1000, valorInicial: 2, valorConvertido: 2000 }, mesmaQuantidade: true,
    valoresOriginais: [{ valor: 2, unidade: "L" }, { valor: 500, unidade: "ml" }], exigeConversaoAntes: true, unidadesMistas: true, etapas: 3,
    resposta: 1750, unidadeResposta: "ml",
    opcoes: opts(1750, "ml", [{ value: 250, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER }, { value: 2250, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO }, { value: 2, misconception: ProblemasMedidaMisconception.MISTURA_GRANDEZAS }]),
  };
}

export function construirProblemasMedidaResolucao(spec: ProblemasMedidaF82Spec): ResolucaoDeclarativa<ProblemasMedidaShow, number, ProblemasMedidaMisconceptionTag> {
  const show: ProblemasMedidaShow = { conversao: spec.conversao, valoresOriginais: spec.valoresOriginais, unidadeResposta: spec.unidadeResposta, exigeConversaoAntes: spec.exigeConversaoAntes };
  return { estadoInicial: show, passos: [
    { id: "mesma-unidade", say: "Antes de comparar ou operar, escreva as medidas na mesma unidade.", show, corrige: [ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER, ProblemasMedidaMisconception.MISTURA_GRANDEZAS], parcial: spec.conversao.valorConvertido },
    { id: "direcao-conversao", say: `De ${spec.conversao.de} para ${spec.conversao.para}, use o fator ${spec.conversao.fator} na direção indicada.`, show, corrige: [ProblemasMedidaMisconception.INVERTE_OPERACAO], parcial: spec.conversao.valorConvertido },
    { id: "resolver", say: "Agora compare ou faça a operação usando apenas valores na mesma unidade.", show, corrige: [ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER, ProblemasMedidaMisconception.INVERTE_OPERACAO, ProblemasMedidaMisconception.MISTURA_GRANDEZAS], parcial: spec.resposta },
  ], fallback: 0 };
}

function mastery(ficha: FichaCompetencia, nivel: number): MasteryRule {
  const id = ficha.niveis?.[nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.09 sem micro L${nivel}.`);
  return { acertos: micro.dominio.acertos, de: micro.dominio.de, sessoes: micro.dominio.sessoes };
}

export function construirProblemasMedidaQuestion(ficha: FichaCompetencia, level: number): Question {
  if (ficha.id !== "GM.09") throw new Error(`problemasMedidaContract recebeu ${ficha.id}.`);
  const spec = construirProblemasMedidaSpec(level);
  const id = ficha.niveis?.[spec.nivel]?.micro;
  const micro = ficha.micros.find(x => x.id === id);
  if (!micro) throw new Error(`GM.09 sem micro L${spec.nivel}.`);
  const prompt = spec.modo === "converter-comprimento" ? "2 metros representam quantos centímetros?"
    : spec.modo === "converter-grandezas" ? "3 quilogramas representam quantos gramas?"
    : spec.modo === "comparar-apos-converter" ? "Converta 2 m para centímetros antes de comparar com 150 cm. Qual é a medida de 2 m em cm?"
    : spec.modo === "operar-unidades-mistas" ? "Converta 1 m para centímetros e some 75 cm. Qual é o total?"
    : "Há 2 L. Retire 500 ml e depois acrescente 250 ml. Quantos mililitros restam?";
  const options: Option[] = spec.opcoes;
  return { kind: "problemas-medida-f82", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirProblemasMedidaResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => Number(a) === spec.resposta };
}
