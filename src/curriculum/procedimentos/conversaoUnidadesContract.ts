import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const ConversaoUnidadesMisconception = {
  INVERTE_OPERACAO: "inverte-operacao",
  MISTURA_GRANDEZAS: "mistura-grandezas",
  IGNORA_DECIMAL: "ignora-decimal",
} as const;
export type ConversaoUnidadesMisconceptionTag = typeof ConversaoUnidadesMisconception[keyof typeof ConversaoUnidadesMisconception];
export type ConversaoUnidadesModo = "cm-m" | "massa-capacidade" | "decimal" | "unidade-adequada" | "problema";
export interface EquivalenciaF93 { origem:number; unidadeOrigem:string; destino:number; unidadeDestino:string; grandeza:string; }
export interface ConversaoUnidadesF93Spec {
  nivel:number; modo:ConversaoUnidadesModo; primitivas:["NumberLine","Balanca"];
  equivalencia:EquivalenciaF93; quantidadeFisicaPreservada:true; incluiDecimal:boolean;
  resposta:string|number; opcoes:Array<{value:string|number;label:string;misconception?:ConversaoUnidadesMisconceptionTag}>;
}
interface ConversaoShow { equivalencia:EquivalenciaF93; quantidadeFisicaPreservada:true; }
const clamp=(n:number)=>Math.max(1,Math.min(5,Math.round(n)));
const opcoes=(correta:string|number,label:string,erradas:Array<{value:string|number;label:string;misconception:ConversaoUnidadesMisconceptionTag}>):ConversaoUnidadesF93Spec["opcoes"]=>[
  {value:correta,label},...erradas,
].filter((x,i,a)=>a.findIndex(y=>String(y.value)===String(x.value))===i).slice(0,4);

const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const escolher = <T,>(itens: readonly T[]): T => itens[Math.floor(Math.random() * itens.length)];
/** Português escreve decimal com vírgula; a tela da criança também. */
const virgula = (valor: number) => String(valor).replace(".", ",");

/** Objetos cuja unidade adequada uma criança consegue julgar por experiência. */
const OBJETOS_F93 = [
  { objeto: "altura de uma porta", unidade: "m", nome: "metro (m)", grandeza: "comprimento", medida: 2, outra: { value: "g", label: "grama (g)" } },
  { objeto: "massa de uma maçã", unidade: "g", nome: "grama (g)", grandeza: "massa", medida: 150, outra: { value: "m", label: "metro (m)" } },
  { objeto: "água de uma garrafa", unidade: "L", nome: "litro (L)", grandeza: "capacidade", medida: 2, outra: { value: "cm", label: "centímetro (cm)" } },
  { objeto: "espessura de uma moeda", unidade: "mm", nome: "milímetro (mm)", grandeza: "comprimento", medida: 2, outra: { value: "kg", label: "quilograma (kg)" } },
] as const;

/**
 * CLASS-003 — o número do nível é sorteado, a escada não.
 *
 * Era uma conversão por nível: 1 m, 2 kg, 1,5 m, a porta e 2,5 L. A ficha cobra
 * repetição, então a criança convertia o MESMO número seis vezes — e decorar
 * "100" vencia o nível sem entender o fator.
 *
 * O `modo` continua fixo: comprimento, massa, decimal, unidade adequada e
 * problema são a escada da F93. E o decimal só aparece onde a escada o pede:
 * sortear origem quebrada em L1 ou L2 anteciparia o degrau de L3.
 */
export function construirConversaoUnidadesSpec(level: number): ConversaoUnidadesF93Spec {
  const nivel = clamp(level);
  const base = { nivel, primitivas: ["NumberLine", "Balanca"] as ["NumberLine", "Balanca"], quantidadeFisicaPreservada: true as const };

  if (nivel === 1 || nivel === 2) {
    const comprimento = nivel === 1;
    const origem = ri(2, 9);
    const fator = comprimento ? 100 : 1000;
    const destino = origem * fator;
    const unidadeOrigem = comprimento ? "m" : "kg";
    const unidadeDestino = comprimento ? "cm" : "g";
    const invertido = origem / fator;
    return {
      ...base,
      modo: comprimento ? "cm-m" : "massa-capacidade",
      equivalencia: { origem, unidadeOrigem, destino, unidadeDestino, grandeza: comprimento ? "comprimento" : "massa" },
      incluiDecimal: false,
      resposta: destino,
      opcoes: opcoes(destino, `${destino} ${unidadeDestino}`, [
        { value: invertido, label: `${virgula(invertido)} ${unidadeDestino}`, misconception: ConversaoUnidadesMisconception.INVERTE_OPERACAO },
        { value: `${destino} ${comprimento ? "g" : "ml"}`, label: `${destino} ${comprimento ? "g" : "ml"}`, misconception: ConversaoUnidadesMisconception.MISTURA_GRANDEZAS },
      ]),
    };
  }

  if (nivel === 3 || nivel === 5) {
    const comprimento = nivel === 3;
    // Meio inteiro: o degrau é ler a vírgula, não dominar decimal de três casas.
    const origem = ri(1, 8) + 0.5;
    const fator = comprimento ? 100 : 1000;
    const destino = Math.round(origem * fator);
    const unidadeOrigem = comprimento ? "m" : "L";
    const unidadeDestino = comprimento ? "cm" : "ml";
    // Ignorar a vírgula: 1,5 vira 15 em vez de 150.
    const semVirgula = Number(String(origem).replace(".", ""));
    const invertido = origem / fator;
    return {
      ...base,
      modo: comprimento ? "decimal" : "problema",
      equivalencia: { origem, unidadeOrigem, destino, unidadeDestino, grandeza: comprimento ? "comprimento" : "capacidade" },
      incluiDecimal: true,
      resposta: destino,
      opcoes: opcoes(destino, `${destino} ${unidadeDestino}`, [
        { value: semVirgula, label: `${semVirgula} ${unidadeDestino}`, misconception: ConversaoUnidadesMisconception.IGNORA_DECIMAL },
        { value: invertido, label: `${virgula(invertido)} ${unidadeDestino}`, misconception: ConversaoUnidadesMisconception.INVERTE_OPERACAO },
        { value: `${destino} ${comprimento ? "g" : "g"}`, label: `${destino} g`, misconception: ConversaoUnidadesMisconception.MISTURA_GRANDEZAS },
      ]),
    };
  }

  const alvo = escolher(OBJETOS_F93);
  return {
    ...base,
    modo: "unidade-adequada",
    equivalencia: { origem: 1, unidadeOrigem: alvo.objeto, destino: alvo.medida, unidadeDestino: alvo.unidade, grandeza: alvo.grandeza },
    incluiDecimal: false,
    resposta: alvo.unidade,
    opcoes: opcoes(alvo.unidade, alvo.nome, [
      { value: alvo.outra.value, label: alvo.outra.label, misconception: ConversaoUnidadesMisconception.MISTURA_GRANDEZAS },
      { value: `${alvo.unidade}-invertido`, label: `${virgula(alvo.medida / 100)} ${alvo.unidade}`, misconception: ConversaoUnidadesMisconception.INVERTE_OPERACAO },
    ]),
  };
}

/**
 * O lado que a criança tem de descobrir. A tela nunca o escreve antes da
 * resposta: em F93 a equivalência é sempre o que se pergunta -- inclusive em
 * `unidade-adequada`, onde o que falta é a unidade e não o número.
 */
export function incognitaConversaoF93(spec:ConversaoUnidadesF93Spec):string{
  return spec.modo==="unidade-adequada"?"? (qual unidade?)":`? ${spec.equivalencia.unidadeDestino}`;
}

export function construirConversaoUnidadesResolucao(spec:ConversaoUnidadesF93Spec):ResolucaoDeclarativa<ConversaoShow,string|number,ConversaoUnidadesMisconceptionTag>{
  const show={equivalencia:spec.equivalencia,quantidadeFisicaPreservada:true as const};
  return{estadoInicial:show,passos:[
    {id:"comparar-unidades",say:"Primeiro decida: a unidade de destino é maior ou menor?",show,corrige:[ConversaoUnidadesMisconception.INVERTE_OPERACAO],parcial:spec.equivalencia.unidadeDestino},
    {id:"preservar-grandeza",say:"Comprimento continua comprimento, massa continua massa e capacidade continua capacidade.",show,corrige:[ConversaoUnidadesMisconception.MISTURA_GRANDEZAS],parcial:spec.equivalencia.grandeza},
    {id:"alinhar-escalas",say:"Alinhe as duas escalas: a quantidade física não muda, apenas a unidade e o número.",show,corrige:[ConversaoUnidadesMisconception.IGNORA_DECIMAL,ConversaoUnidadesMisconception.INVERTE_OPERACAO],parcial:spec.resposta},
  ],fallback:0};
}
function mastery(ficha:FichaCompetencia,nivel:number):MasteryRule{const id=ficha.niveis?.[nivel]?.micro;const micro=ficha.micros.find(x=>x.id===id);if(!micro)throw new Error(`GM.10 sem micro L${nivel}.`);return{acertos:micro.dominio.acertos,de:micro.dominio.de,sessoes:micro.dominio.sessoes};}
export function construirConversaoUnidadesQuestion(ficha:FichaCompetencia,level:number):Question{
  if(ficha.id!=="GM.10")throw new Error(`conversaoUnidadesContract recebeu ${ficha.id}.`);
  const spec=construirConversaoUnidadesSpec(level);const id=ficha.niveis?.[spec.nivel]?.micro;const micro=ficha.micros.find(x=>x.id===id);if(!micro)throw new Error(`GM.10 sem micro L${spec.nivel}.`);
  const prompt=spec.modo==="unidade-adequada"?"Qual é a unidade mais adequada para medir a altura de uma porta?":`${spec.equivalencia.origem} ${spec.equivalencia.unidadeOrigem} equivalem a quanto em ${spec.equivalencia.unidadeDestino}?`;
  const options:Option[]=spec.opcoes;
  return{kind:"conversao-unidades-f93",prompt,audioPrompt:prompt,howto:ficha.howto,explain:ficha.explain,tutorial:normalizeFichaTutorial(micro.params.tutorial),resolucao:construirConversaoUnidadesResolucao(spec),masteryRule:mastery(ficha,spec.nivel),uiProps:spec,options,answer:spec.resposta,evaluate:a=>String(a)===String(spec.resposta)};
}
