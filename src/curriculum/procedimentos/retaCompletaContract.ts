import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import type { MasteryRule, Option, Question } from "../../types";
import { normalizeFichaTutorial } from "../fichaQuestionContract";
import type { FichaCompetencia } from "../schema";

export const RetaCompletaMisconception = {
  NEGATIVO_COMO_POSITIVO: "negativo-como-positivo",
  ZERO_COMO_PASSO: "zero-como-passo",
  LADO_ERRADO: "lado-errado",
} as const;
export type RetaCompletaMisconceptionTag = typeof RetaCompletaMisconception[keyof typeof RetaCompletaMisconception];
export type RetaCompletaModo = "localizar" | "comparar-negativos" | "ordenar-mistos" | "distancia" | "modulo";
export interface RetaCompletaF84Spec {
  nivel: number; modo: RetaCompletaModo; inicio: number; fim: number; pontos: number[]; resposta: string | number;
  opcoes: Array<{ value: string | number; label: string; misconception?: RetaCompletaMisconceptionTag }>;
}
interface RetaCompletaShow { inicio: number; fim: number; pontos: number[]; destacarZero?: boolean; caminhar?: number[]; }
const clamp=(n:number)=>Math.max(1,Math.min(5,Math.round(n)));
function opts(correta:string|number, erradas:Array<{value:string|number;misconception:RetaCompletaMisconceptionTag}>):RetaCompletaF84Spec["opcoes"]{
  return [{value:correta,label:String(correta)},...erradas.map(x=>({...x,label:String(x.value)}))].filter((x,i,a)=>a.findIndex(y=>y.value===x.value)===i).slice(0,4);
}
export function construirRetaCompletaSpec(level:number):RetaCompletaF84Spec{
  const nivel=clamp(level);
  if(nivel===1)return {nivel,modo:"localizar",inicio:-6,fim:6,pontos:[-3],resposta:-3,opcoes:opts(-3,[{value:3,misconception:RetaCompletaMisconception.LADO_ERRADO},{value:-2,misconception:RetaCompletaMisconception.ZERO_COMO_PASSO},{value:2,misconception:RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO}])};
  if(nivel===2)return {nivel,modo:"comparar-negativos",inicio:-7,fim:3,pontos:[-5,-2],resposta:-2,opcoes:opts(-2,[{value:-5,misconception:RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO},{value:2,misconception:RetaCompletaMisconception.LADO_ERRADO}])};
  if(nivel===3)return {nivel,modo:"ordenar-mistos",inicio:-8,fim:6,pontos:[-3,2,-7,5],resposta:"-7,-3,2,5",opcoes:opts("-7,-3,2,5",[{value:"5,2,-3,-7",misconception:RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO},{value:"-3,-7,2,5",misconception:RetaCompletaMisconception.LADO_ERRADO}])};
  if(nivel===4)return {nivel,modo:"distancia",inicio:-6,fim:5,pontos:[-3,2],resposta:5,opcoes:opts(5,[{value:6,misconception:RetaCompletaMisconception.ZERO_COMO_PASSO},{value:1,misconception:RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO},{value:-5,misconception:RetaCompletaMisconception.LADO_ERRADO}])};
  return {nivel,modo:"modulo",inicio:-8,fim:8,pontos:[-6],resposta:6,opcoes:opts(6,[{value:-6,misconception:RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO},{value:7,misconception:RetaCompletaMisconception.ZERO_COMO_PASSO},{value:0,misconception:RetaCompletaMisconception.LADO_ERRADO}])};
}
export function construirRetaCompletaResolucao(spec:RetaCompletaF84Spec):ResolucaoDeclarativa<RetaCompletaShow,string|number,RetaCompletaMisconceptionTag>{
  return {estadoInicial:{inicio:spec.inicio,fim:spec.fim,pontos:spec.pontos,destacarZero:true},passos:[
    {id:"ancorar-zero",say:"O zero é a origem, não o fim da reta.",show:{inicio:spec.inicio,fim:spec.fim,pontos:spec.pontos,destacarZero:true},corrige:[RetaCompletaMisconception.LADO_ERRADO],parcial:spec.resposta},
    {id:"ler-distancia",say:"À esquerda os valores diminuem; distância conta intervalos, não o zero como passo.",show:{inicio:spec.inicio,fim:spec.fim,pontos:spec.pontos,destacarZero:true,caminhar:spec.pontos},corrige:[RetaCompletaMisconception.NEGATIVO_COMO_POSITIVO,RetaCompletaMisconception.ZERO_COMO_PASSO],parcial:spec.resposta}
  ],fallback:0};
}
function mastery(ficha:FichaCompetencia,nivel:number):MasteryRule{const id=ficha.niveis?.[nivel]?.micro;const micro=ficha.micros.find(x=>x.id===id);if(!micro)throw new Error(`N7.01 sem micro L${nivel}.`);return{acertos:micro.dominio.acertos,de:micro.dominio.de,sessoes:micro.dominio.sessoes};}
export function construirRetaCompletaQuestion(ficha:FichaCompetencia,level:number):Question{
  if(ficha.id!=="N7.01")throw new Error(`retaCompletaContract recebeu ${ficha.id}.`);
  const spec=construirRetaCompletaSpec(level);const id=ficha.niveis?.[spec.nivel]?.micro;const micro=ficha.micros.find(x=>x.id===id);if(!micro)throw new Error(`N7.01 sem micro L${spec.nivel}.`);
  const prompt=spec.modo==="localizar"?"Onde fica o menos três na reta?":spec.modo==="comparar-negativos"?"Qual é maior: −5 ou −2?":spec.modo==="ordenar-mistos"?"Qual ordem vai do menor para o maior?":spec.modo==="distancia"?"Qual é a distância de −3 até 2?":"Qual é a distância de −6 até o zero?";
  const options:Option[]=spec.opcoes;return{kind:"reta-completa-f84",prompt,audioPrompt:prompt,howto:ficha.howto,explain:ficha.explain,tutorial:normalizeFichaTutorial(micro.params.tutorial),resolucao:construirRetaCompletaResolucao(spec),masteryRule:mastery(ficha,spec.nivel),uiProps:spec,options,answer:spec.resposta,evaluate:a=>String(a)===String(spec.resposta)};
}
