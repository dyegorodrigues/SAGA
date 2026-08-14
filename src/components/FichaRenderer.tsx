import React from "react";
import type { AnswerMeta, Question } from "../types";
import { RegraSequenciaStage } from "./primitives/RegraSequenciaStage"; import type { RegraSequenciaF57Spec } from "../curriculum/procedimentos/regraSequenciaContract";
import { PartesIguaisStage } from "./primitives/PartesIguaisStage"; import type { PartesIguaisF45Spec } from "../curriculum/procedimentos/partesIguaisContract";
import { FracaoNumeroStage } from "./primitives/FracaoNumeroStage"; import type { FracaoNumeroF72Spec } from "../curriculum/procedimentos/fracaoNumeroContract";
import { DecimalStage } from "./primitives/DecimalStage"; import type { DecimalF75Spec } from "../curriculum/procedimentos/decimalContract";
import { PorcentagemStage } from "./primitives/PorcentagemStage"; import type { PorcentagemF87Spec } from "../curriculum/procedimentos/porcentagemContract";
import { AngulosStage } from "./primitives/AngulosStage"; import type { AngulosF78Spec } from "../curriculum/procedimentos/angulosContract";
import { FracoesEquivalentesStage } from "./primitives/FracoesEquivalentesStage"; import type { FracaoEquivalenteF73Spec } from "../curriculum/procedimentos/fracaoEquivalenteContract";
import { DivisaoLongaStage } from "./primitives/DivisaoLongaStage"; import type { DivisaoLongaF69Spec } from "../curriculum/procedimentos/divisaoLongaContract";
import { PerimetroStage } from "./primitives/PerimetroStage"; import type { PerimetroF63Spec } from "../curriculum/procedimentos/perimetroContract";
import { IgualdadeEquilibrioStage } from "./primitives/IgualdadeEquilibrioStage"; import type { IgualdadeEquilibrioF46Spec } from "../curriculum/procedimentos/igualdadeEquilibrioContract";
import { FichaRenderer as FichaRendererBase } from "./FichaRendererBase";
interface FichaRendererProps{question:Question;onAnswer:(answer:any,isCorrect:boolean,meta?:AnswerMeta)=>void;disabled?:boolean;promptDone?:boolean;mostrar?:unknown;falar?:(texto:string)=>void}
/** Front-controller. Os cases de passthrough são guardas literais de palco único. */
export function FichaRenderer(props:FichaRendererProps){const{question,onAnswer,disabled}=props;const send=(valor:any,meta?:AnswerMeta)=>{if(!disabled)onAnswer(valor,question.evaluate?.(valor)??false,meta)};switch(question.kind){
case 'regra-sequencia-f57': return <RegraSequenciaStage spec={question.uiProps as RegraSequenciaF57Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'partes-iguais-f45': return <PartesIguaisStage spec={question.uiProps as PartesIguaisF45Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'fracao-numero-f72': return <FracaoNumeroStage spec={question.uiProps as FracaoNumeroF72Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'decimos-centesimos-f75': return <DecimalStage spec={question.uiProps as DecimalF75Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'porcentagem-f87': return <PorcentagemStage spec={question.uiProps as PorcentagemF87Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'angulos-f78': return <AngulosStage spec={question.uiProps as AngulosF78Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'fracoes-equivalentes-f73': return <FracoesEquivalentesStage spec={question.uiProps as FracaoEquivalenteF73Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'divisao-longa-f69': return <DivisaoLongaStage spec={question.uiProps as DivisaoLongaF69Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'perimetro-f63': return <PerimetroStage spec={question.uiProps as PerimetroF63Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'igualdade-equilibrio-f46': return <IgualdadeEquilibrioStage spec={question.uiProps as IgualdadeEquilibrioF46Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
case 'story-bars': case 'tabuada': case 'decomposicao': case 'ancora': case 'familia': case 'deslocamento': case 'area': case 'pareamento': case 'touchcount': case 'fileira': case 'classificacao': case 'audiochoice': case 'touchplace': case 'shapecanvas': case 'grandeza': case 'medidas': case 'moldura': default:return <FichaRendererBase {...props}/>;}}
