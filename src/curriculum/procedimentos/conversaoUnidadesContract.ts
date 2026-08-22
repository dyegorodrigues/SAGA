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

export function construirConversaoUnidadesSpec(level:number):ConversaoUnidadesF93Spec{
  const nivel=clamp(level);
  if(nivel===1)return{nivel,modo:"cm-m",primitivas:["NumberLine","Balanca"],equivalencia:{origem:1,unidadeOrigem:"m",destino:100,unidadeDestino:"cm",grandeza:"comprimento"},quantidadeFisicaPreservada:true,incluiDecimal:false,resposta:100,opcoes:opcoes(100,"100 cm",[{value:0.01,label:"0,01 cm",misconception:ConversaoUnidadesMisconception.INVERTE_OPERACAO},{value:1000,label:"1000 cm",misconception:ConversaoUnidadesMisconception.MISTURA_GRANDEZAS}])};
  if(nivel===2)return{nivel,modo:"massa-capacidade",primitivas:["NumberLine","Balanca"],equivalencia:{origem:2,unidadeOrigem:"kg",destino:2000,unidadeDestino:"g",grandeza:"massa"},quantidadeFisicaPreservada:true,incluiDecimal:false,resposta:2000,opcoes:opcoes(2000,"2000 g",[{value:0.002,label:"0,002 g",misconception:ConversaoUnidadesMisconception.INVERTE_OPERACAO},{value:"2000 ml",label:"2000 ml",misconception:ConversaoUnidadesMisconception.MISTURA_GRANDEZAS}])};
  if(nivel===3)return{nivel,modo:"decimal",primitivas:["NumberLine","Balanca"],equivalencia:{origem:1.5,unidadeOrigem:"m",destino:150,unidadeDestino:"cm",grandeza:"comprimento"},quantidadeFisicaPreservada:true,incluiDecimal:true,resposta:150,opcoes:opcoes(150,"150 cm",[{value:15,label:"15 cm",misconception:ConversaoUnidadesMisconception.IGNORA_DECIMAL},{value:0.015,label:"0,015 cm",misconception:ConversaoUnidadesMisconception.INVERTE_OPERACAO}])};
  if(nivel===4)return{nivel,modo:"unidade-adequada",primitivas:["NumberLine","Balanca"],equivalencia:{origem:1,unidadeOrigem:"altura de uma porta",destino:2,unidadeDestino:"m",grandeza:"comprimento"},quantidadeFisicaPreservada:true,incluiDecimal:false,resposta:"m",opcoes:opcoes("m","metro (m)",[{value:"g",label:"grama (g)",misconception:ConversaoUnidadesMisconception.MISTURA_GRANDEZAS},{value:"cm-invertido",label:"0,02 cm",misconception:ConversaoUnidadesMisconception.INVERTE_OPERACAO}])};
  return{nivel,modo:"problema",primitivas:["NumberLine","Balanca"],equivalencia:{origem:2.5,unidadeOrigem:"L",destino:2500,unidadeDestino:"ml",grandeza:"capacidade"},quantidadeFisicaPreservada:true,incluiDecimal:true,resposta:2500,opcoes:opcoes(2500,"2500 ml",[{value:25,label:"25 ml",misconception:ConversaoUnidadesMisconception.IGNORA_DECIMAL},{value:0.0025,label:"0,0025 ml",misconception:ConversaoUnidadesMisconception.INVERTE_OPERACAO},{value:"2500 g",label:"2500 g",misconception:ConversaoUnidadesMisconception.MISTURA_GRANDEZAS}])};
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
