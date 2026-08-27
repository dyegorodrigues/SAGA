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

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/**
 * CLASS-003 — as medidas são sorteadas, a escada não.
 *
 * O problema era um só por nível: 2 m, 3 kg, 2 m contra 150 cm, 1 m mais 75 cm
 * e 2 L com 500 e 250 ml. As respostas certas eram 200, 3000, 200, 175 e 1750,
 * para sempre.
 *
 * O degrau continua sendo a GRANDEZA e o número de etapas: converter
 * comprimento, converter massa, comparar depois de converter, operar com
 * unidades mistas, e o problema de três etapas em capacidade.
 */
export function construirProblemasMedidaSpec(level: number): ProblemasMedidaF82Spec {
  const nivel = clamp(level);
  const primitivas = ["NumberLine", "Balanca"] as ["NumberLine", "Balanca"];

  if (nivel === 1 || nivel === 2) {
    const comprimento = nivel === 1;
    const inicial = ri(2, 9);
    const fator = comprimento ? 100 : 1000;
    const convertido = inicial * fator;
    return {
      nivel, modo: comprimento ? "converter-comprimento" : "converter-grandezas", primitivas,
      grandeza: comprimento ? "comprimento" : "massa",
      conversao: { de: comprimento ? "m" : "kg", para: comprimento ? "cm" : "g", fator, valorInicial: inicial, valorConvertido: convertido },
      mesmaQuantidade: true, exigeConversaoAntes: false, unidadesMistas: false, etapas: 1,
      resposta: convertido, unidadeResposta: comprimento ? "cm" : "g",
      opcoes: opts(convertido, comprimento ? "cm" : "g", [
        // Dividir onde era para multiplicar: a conversão de cabeça para baixo.
        { value: convertido / (fator / 10), misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO },
        // Responder o número que já estava lá, como se a unidade não contasse.
        { value: inicial, misconception: ProblemasMedidaMisconception.MISTURA_GRANDEZAS },
      ]),
    };
  }

  if (nivel === 3) {
    // A medida convertida precisa vencer a comparação: se a outra fosse maior,
    // a resposta deixaria de ser a que o enunciado pergunta.
    const inicial = ri(2, 9);
    const convertido = inicial * 100;
    const outra = ri(Math.floor(convertido / 100) * 10, convertido - 10);
    return {
      nivel, modo: "comparar-apos-converter", primitivas, grandeza: "comprimento",
      conversao: { de: "m", para: "cm", fator: 100, valorInicial: inicial, valorConvertido: convertido },
      mesmaQuantidade: true, valoresOriginais: [{ valor: inicial, unidade: "m" }, { valor: outra, unidade: "cm" }],
      exigeConversaoAntes: true, unidadesMistas: true, etapas: 2,
      resposta: convertido, unidadeResposta: "cm",
      opcoes: opts(convertido, "cm", [
        { value: outra, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER },
        { value: inicial * 10, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO },
      ]),
    };
  }

  if (nivel === 4) {
    const inicial = ri(1, 8);
    const convertido = inicial * 100;
    const resto = ri(2, 19) * 5;
    const total = convertido + resto;
    return {
      nivel, modo: "operar-unidades-mistas", primitivas, grandeza: "comprimento",
      conversao: { de: "m", para: "cm", fator: 100, valorInicial: inicial, valorConvertido: convertido },
      mesmaQuantidade: true, valoresOriginais: [{ valor: inicial, unidade: "m" }, { valor: resto, unidade: "cm" }],
      exigeConversaoAntes: true, unidadesMistas: true, etapas: 2,
      resposta: total, unidadeResposta: "cm",
      opcoes: opts(total, "cm", [
        // Somar sem converter: 1 + 75 vira 76.
        { value: inicial + resto, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER },
        // Subtrair onde era para somar.
        { value: Math.abs(convertido - resto), misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO },
      ]),
    };
  }

  // Três etapas: parte de um volume em litros, tira e devolve em mililitros.
  const litros = ri(2, 6);
  const emMl = litros * 1000;
  const retirado = ri(2, 9) * 100;
  const acrescentado = ri(1, retirado / 100 - 1) * 100;
  const total = emMl - retirado + acrescentado;
  return {
    nivel, modo: "problema-multietapa", primitivas, grandeza: "capacidade",
    conversao: { de: "L", para: "ml", fator: 1000, valorInicial: litros, valorConvertido: emMl },
    mesmaQuantidade: true, valoresOriginais: [{ valor: litros, unidade: "L" }, { valor: retirado, unidade: "ml" }],
    exigeConversaoAntes: true, unidadesMistas: true, etapas: 3,
    resposta: total, unidadeResposta: "ml",
    opcoes: opts(total, "ml", [
      // Operar sem converter os litros: sobra só a conta dos mililitros.
      { value: retirado - acrescentado, misconception: ProblemasMedidaMisconception.COMPARA_SEM_CONVERTER },
      // Trocar retirar por acrescentar.
      { value: emMl + retirado - acrescentado, misconception: ProblemasMedidaMisconception.INVERTE_OPERACAO },
      { value: litros, misconception: ProblemasMedidaMisconception.MISTURA_GRANDEZAS },
    ]),
  };
}

export function conversaoEhARespostaF82(spec: ProblemasMedidaF82Spec): boolean {
  return spec.resposta === spec.conversao.valorConvertido;
}

export function rotuloConvertidoF82(spec: ProblemasMedidaF82Spec): string {
  return conversaoEhARespostaF82(spec)
    ? `? ${spec.conversao.para}`
    : `${spec.conversao.valorConvertido} ${spec.conversao.para}`;
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
  const { valorInicial, de, para } = spec.conversao;
  const outra = spec.valoresOriginais?.[1];
  const acrescentado = spec.nivel === 5 ? spec.resposta - (spec.conversao.valorConvertido - (outra?.valor ?? 0)) : 0;
  const prompt = spec.modo === "converter-comprimento" ? `${valorInicial} metros representam quantos centímetros?`
    : spec.modo === "converter-grandezas" ? `${valorInicial} quilogramas representam quantos gramas?`
    : spec.modo === "comparar-apos-converter" ? `Converta ${valorInicial} ${de} para centímetros antes de comparar com ${outra?.valor} ${para}. Qual é a medida de ${valorInicial} ${de} em ${para}?`
    : spec.modo === "operar-unidades-mistas" ? `Converta ${valorInicial} ${de} para centímetros e some ${outra?.valor} ${para}. Qual é o total?`
    : `Há ${valorInicial} L. Retire ${outra?.valor} ml e depois acrescente ${acrescentado} ml. Quantos mililitros restam?`;
  const options: Option[] = spec.opcoes;
  return { kind: "problemas-medida-f82", prompt, audioPrompt: prompt, howto: ficha.howto, explain: ficha.explain, tutorial: normalizeFichaTutorial(micro.params.tutorial), resolucao: construirProblemasMedidaResolucao(spec), masteryRule: mastery(ficha, spec.nivel), uiProps: spec, options, answer: spec.resposta, evaluate: a => Number(a) === spec.resposta };
}
