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
const ri = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const RCM = RetaCompletaMisconception;

/**
 * CLASS-003 — o ponto do nível é sorteado, a escada não.
 *
 * Era um ponto por nível: −3, o par −5/−2, a lista −3,2,−7,5, o par −3/2 e o
 * −6. Decorar "−3" vencia L1 sem olhar a reta.
 *
 * O `modo` continua fixo, e com ele o que cada nível mede: localizar, comparar
 * negativos, ordenar mistos, medir distância e ler módulo. Os pontos sorteados
 * evitam o zero em L1, L2 e L5 — zero não tem lado, e é justamente o lado que
 * esses níveis ensinam.
 */
export function construirRetaCompletaSpec(level: number): RetaCompletaF84Spec {
  const nivel = clamp(level);

  if (nivel === 1) {
    const alvo = -ri(2, 6);
    return {
      nivel, modo: "localizar", inicio: alvo - ri(1, 3), fim: ri(3, 7), pontos: [alvo], resposta: alvo,
      opcoes: opts(alvo, [
        { value: -alvo, misconception: RCM.LADO_ERRADO },
        { value: alvo + 1, misconception: RCM.ZERO_COMO_PASSO },
        { value: -alvo - 1, misconception: RCM.NEGATIVO_COMO_POSITIVO },
      ]),
    };
  }

  if (nivel === 2) {
    // Dois negativos: comparar aqui é decidir qual está mais perto do zero.
    const menor = -ri(4, 8);
    const maior = -ri(1, 3);
    return {
      nivel, modo: "comparar-negativos", inicio: menor - 1, fim: ri(2, 5), pontos: [menor, maior], resposta: maior,
      opcoes: opts(maior, [
        { value: menor, misconception: RCM.NEGATIVO_COMO_POSITIVO },
        { value: -maior, misconception: RCM.LADO_ERRADO },
      ]),
    };
  }

  if (nivel === 3) {
    const negativos = [-ri(5, 9), -ri(1, 4)];
    const positivos = [ri(1, 3), ri(4, 6)];
    const pontos = [negativos[1], positivos[0], negativos[0], positivos[1]];
    const ordenados = [...pontos].sort((a, b) => a - b);
    const invertido = [...ordenados].reverse().join(",");
    // Trocar os dois negativos de lugar é o erro de quem lê −7 como maior.
    const trocado = [ordenados[1], ordenados[0], ordenados[2], ordenados[3]].join(",");
    return {
      nivel, modo: "ordenar-mistos", inicio: ordenados[0] - 1, fim: ordenados[3] + 1, pontos,
      resposta: ordenados.join(","),
      opcoes: opts(ordenados.join(","), [
        { value: invertido, misconception: RCM.NEGATIVO_COMO_POSITIVO },
        { value: trocado, misconception: RCM.LADO_ERRADO },
      ]),
    };
  }

  if (nivel === 4) {
    const esquerda = -ri(2, 6);
    const direita = ri(1, 5);
    const distancia = direita - esquerda;
    return {
      nivel, modo: "distancia", inicio: esquerda - 1, fim: direita + 1, pontos: [esquerda, direita], resposta: distancia,
      opcoes: opts(distancia, [
        { value: distancia + 1, misconception: RCM.ZERO_COMO_PASSO },
        { value: direita - Math.abs(esquerda), misconception: RCM.NEGATIVO_COMO_POSITIVO },
        { value: -distancia, misconception: RCM.LADO_ERRADO },
      ]),
    };
  }

  const alvo = -ri(3, 8);
  const modulo = Math.abs(alvo);
  return {
    nivel, modo: "modulo", inicio: alvo - 1, fim: modulo + 1, pontos: [alvo], resposta: modulo,
    opcoes: opts(modulo, [
      { value: alvo, misconception: RCM.NEGATIVO_COMO_POSITIVO },
      { value: modulo + 1, misconception: RCM.ZERO_COMO_PASSO },
      { value: 0, misconception: RCM.LADO_ERRADO },
    ]),
  };
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
