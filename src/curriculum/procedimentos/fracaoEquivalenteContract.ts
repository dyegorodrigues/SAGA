import type { ResolucaoDeclarativa } from "../../contracts/pedagogySteps";
import { Evidencia } from "../../constants/evidencias";
import type { MasteryRule,Option,Question } from "../../types";
import type { FichaCompetencia } from "../schema";
export const FracaoEquivalenteMisconception={MAIS_PARTES_MAIS_QUANTIDADE:"mais-partes-mais-quantidade",COMPARA_SO_DENOMINADOR:"compara-so-denominador",MULTIPLICA_SO_UM:"multiplica-so-um"} as const;
export type FracaoEquivalenteMisconceptionTag=typeof FracaoEquivalenteMisconception[keyof typeof FracaoEquivalenteMisconception];
export type FracaoEquivalenteModo="equivalencia-sobreposta"|"equivalencia-lado-a-lado"|"mesmo-denominador"|"mesmo-numerador"|"denominadores-diferentes";
export interface FracaoVisual{numerador:number;denominador:number}
export interface FracaoEquivalenteF73Spec{nivel:number;modo:FracaoEquivalenteModo;esquerda:FracaoVisual;direita:FracaoVisual;resposta:"igual"|"esquerda"|"direita";opcoes:Array<{value:string;label:string;misconception?:FracaoEquivalenteMisconceptionTag}>}
interface Show{esquerda:FracaoVisual;direita:FracaoVisual;sobrepor?:boolean}
const clamp=(n:number)=>Math.max(1,Math.min(5,Math.round(n))); function escolher<T>(xs:T[],rng:()=>number):T{const raw=rng(),n=Number.isFinite(raw)?Math.max(0,Math.min(.999999,raw)):0;return xs[Math.floor(n*xs.length)]??xs[0]}; const txt=(f:FracaoVisual)=>`${f.numerador}/${f.denominador}`;
function comparar(a:FracaoVisual,b:FracaoVisual):"igual"|"esquerda"|"direita"{const d=a.numerador*b.denominador-b.numerador*a.denominador;return d===0?"igual":d>0?"esquerda":"direita"}
function alternativas(a:FracaoVisual,b:FracaoVisual,resposta:FracaoEquivalenteF73Spec["resposta"],tag:FracaoEquivalenteMisconceptionTag){const labels={igual:"São iguais",esquerda:`${txt(a)} é maior`,direita:`${txt(b)} é maior`};return(["igual","esquerda","direita"] as const).map(value=>({value,label:labels[value],...(value===resposta?{}:{misconception:tag})}))}
/**
 * De que lado cada fração fica.
 *
 * Sem sorteio, L3 respondia sempre "direita" e L4 sempre "esquerda": a maior
 * estava sempre no mesmo lugar. O rótulo mudava — ele traz a fração —, então a
 * varredura de rótulo não via nada, mas a criança que reparasse no lado
 * venceria os dois níveis sem comparar. É a mesma decoração, um degrau abaixo.
 */
function lados(uma:FracaoVisual,outra:FracaoVisual,rng:()=>number):[FracaoVisual,FracaoVisual]{
  return rng()<0.5?[uma,outra]:[outra,uma];
}

/**
 * CLASS-003 — o par de L1 e L2 nem sempre é equivalente.
 *
 * Os três pares do caso fixo — 1/2 e 2/4, 1/3 e 2/6, 2/3 e 4/6 — eram TODOS
 * equivalentes. O nível pergunta "as duas frações representam a mesma
 * quantidade?", e a resposta era "São iguais" em todo sorteio: a criança
 * respondia sem olhar as barras, e o motor concluía domínio.
 *
 * O par não-equivalente é o próprio erro que a ficha nomeia, feito visível:
 * `MULTIPLICA_SO_UM` é multiplicar só o numerador ou só o denominador. Fazer
 * exatamente isso produz a fração que a criança acharia igual e não é —
 * a comparação passa a exigir olhar o espaço pintado.
 */
function parEquivalenteOuNao(rng:()=>number):readonly [FracaoVisual,FracaoVisual]{
  const base=escolher([{numerador:1,denominador:2},{numerador:1,denominador:3},{numerador:2,denominador:3},{numerador:1,denominador:4},{numerador:3,denominador:4},{numerador:2,denominador:5}],rng);
  const fator=escolher([2,3],rng);
  const equivalente=rng()<0.5;
  // Multiplicar só o numerador só cabe enquanto a fração não passa do inteiro:
  // 3/2 não é uma barra que a criança consiga ver pintada.
  const soNumerador=base.numerador*fator<=base.denominador;
  const outra=equivalente
    ? {numerador:base.numerador*fator,denominador:base.denominador*fator}
    : (soNumerador&&rng()<0.5
      ? {numerador:base.numerador*fator,denominador:base.denominador}
      : {numerador:base.numerador,denominador:base.denominador*fator});
  // Qual das duas fica à esquerda também é sorteado: prender a base do lado
  // esquerdo faria "a direita é maior" nunca aparecer.
  return rng()<0.5?[base,outra] as const:[outra,base] as const;
}

export function construirFracaoEquivalenteSpec(level:number,rng:()=>number=Math.random):FracaoEquivalenteF73Spec{const nivel=clamp(level);let modo:FracaoEquivalenteModo,esquerda:FracaoVisual,direita:FracaoVisual,tag:FracaoEquivalenteMisconceptionTag;if(nivel<=2){const p=parEquivalenteOuNao(rng);esquerda={...p[0]};direita={...p[1]};modo=nivel===1?"equivalencia-sobreposta":"equivalencia-lado-a-lado";tag=FracaoEquivalenteMisconception.MULTIPLICA_SO_UM}else if(nivel===3){const d=escolher([4,5,6,8],rng),menor=escolher([1,2],rng),maior=escolher([d-1,d-2].filter(x=>x>menor),rng);const par=lados({numerador:menor,denominador:d},{numerador:maior,denominador:d},rng);esquerda=par[0];direita=par[1];modo="mesmo-denominador";tag=FracaoEquivalenteMisconception.COMPARA_SO_DENOMINADOR}else if(nivel===4){const n=escolher([1,2],rng),ds=escolher([[3,5],[4,6],[5,8],[3,7],[4,9]] as const,rng);const par=lados({numerador:n,denominador:ds[0]},{numerador:n,denominador:ds[1]},rng);esquerda=par[0];direita=par[1];modo="mesmo-numerador";tag=FracaoEquivalenteMisconception.MAIS_PARTES_MAIS_QUANTIDADE}else{const p=escolher([[{numerador:2,denominador:3},{numerador:3,denominador:5}],[{numerador:3,denominador:4},{numerador:5,denominador:8}],[{numerador:2,denominador:5},{numerador:3,denominador:7}],[{numerador:3,denominador:5},{numerador:5,denominador:9}],[{numerador:1,denominador:3},{numerador:2,denominador:7}]] as const,rng);const par=lados({...p[0]},{...p[1]},rng);esquerda=par[0];direita=par[1];modo="denominadores-diferentes";tag=FracaoEquivalenteMisconception.COMPARA_SO_DENOMINADOR}const resposta=comparar(esquerda,direita);return{nivel,modo,esquerda,direita,resposta,opcoes:alternativas(esquerda,direita,resposta,tag)}}
export function construirFracaoEquivalenteResolucao(spec:FracaoEquivalenteF73Spec):ResolucaoDeclarativa<Show,string,FracaoEquivalenteMisconceptionTag>{return{estadoInicial:{esquerda:spec.esquerda,direita:spec.direita},passos:[{id:"mesmo-inteiro",say:"As barras têm o mesmo comprimento: o inteiro é o mesmo.",show:{esquerda:spec.esquerda,direita:spec.direita},corrige:[FracaoEquivalenteMisconception.MAIS_PARTES_MAIS_QUANTIDADE],parcial:"mesmo-inteiro"},{id:"comparar-espaco",say:spec.resposta==="igual"?"As regiões pintadas ocupam o mesmo espaço.":"Compare o espaço pintado, não o denominador.",show:{esquerda:spec.esquerda,direita:spec.direita,sobrepor:true},corrige:[FracaoEquivalenteMisconception.COMPARA_SO_DENOMINADOR,FracaoEquivalenteMisconception.MULTIPLICA_SO_UM],parcial:spec.resposta}],fallback:0}}
function mastery(f:FichaCompetencia,n:number):MasteryRule{const id=f.niveis?.[n]?.micro,m=f.micros.find(x=>x.id===id);if(!m)throw new Error(`N5.03 sem micro L${n}`);return{acertos:m.dominio.acertos,de:m.dominio.de,sessoes:m.dominio.sessoes}}
export function construirFracaoEquivalenteQuestion(ficha:FichaCompetencia,level:number):Question{if(ficha.id!=="N5.03")throw new Error(`fracaoEquivalenteContract recebeu ${ficha.id}`);const spec=construirFracaoEquivalenteSpec(level),prompt=spec.nivel<=2?"As duas frações representam a mesma quantidade?":"Qual barra representa a maior fração?",options:Option[]=spec.opcoes;return{kind:"fracoes-equivalentes-f73",prompt,audioPrompt:prompt,howto:ficha.howto,explain:ficha.explain,resolucao:construirFracaoEquivalenteResolucao(spec),masteryRule:mastery(ficha,spec.nivel),exigeEvidencia:Evidencia.FRACAO_MESMO_NUMERADOR,uiProps:spec,options,answer:spec.resposta,evaluate:a=>String(a)===spec.resposta}}
