import React from "react";
import type { AnswerMeta, Question } from "../types";
import { RegraSequenciaStage } from "./primitives/RegraSequenciaStage"; import type { RegraSequenciaF57Spec } from "../curriculum/procedimentos/regraSequenciaContract";
import { PartesIguaisStage } from "./primitives/PartesIguaisStage"; import type { PartesIguaisF45Spec } from "../curriculum/procedimentos/partesIguaisContract";
import { FracaoNumeroStage } from "./primitives/FracaoNumeroStage"; import type { FracaoNumeroF72Spec } from "../curriculum/procedimentos/fracaoNumeroContract";
import { DecimalStage } from "./primitives/DecimalStage"; import type { DecimalF75Spec } from "../curriculum/procedimentos/decimalContract";
import { PorcentagemStage } from "./primitives/PorcentagemStage"; import type { PorcentagemF87Spec } from "../curriculum/procedimentos/porcentagemContract";
import { AngulosStage } from "./primitives/AngulosStage"; import type { AngulosF78Spec } from "../curriculum/procedimentos/angulosContract";
import { RetaCompletaStage } from "./primitives/RetaCompletaStage"; import type { RetaCompletaF84Spec } from "../curriculum/procedimentos/retaCompletaContract";
import { OperarNegativosStage } from "./primitives/OperarNegativosStage"; import type { OperarNegativosF85Spec } from "../curriculum/procedimentos/operarNegativosContract";
import { LinguagemLetrasStage } from "./primitives/LinguagemLetrasStage"; import type { LinguagemLetrasF89Spec } from "../curriculum/procedimentos/linguagemLetrasContract";
import { JornalTurmaStage } from "./primitives/JornalTurmaStage"; import type { JornalTurmaF64Spec } from "../curriculum/procedimentos/jornalTurmaContract";
import { MediaChanceStage } from "./primitives/MediaChanceStage"; import type { MediaChanceF83Spec } from "../curriculum/procedimentos/mediaChanceContract";
import { ProblemasMedidaStage } from "./primitives/ProblemasMedidaStage"; import type { ProblemasMedidaF82Spec } from "../curriculum/procedimentos/problemasMedidaContract";
import { HorasMinutosStage } from "./primitives/HorasMinutosStage"; import type { HorasMinutosF62Spec } from "../curriculum/procedimentos/horasMinutosContract";
import { ConversaoUnidadesStage } from "./primitives/ConversaoUnidadesStage"; import type { ConversaoUnidadesF93Spec } from "../curriculum/procedimentos/conversaoUnidadesContract";
import { PoligonosStage } from "./primitives/PoligonosStage"; import type { PoligonosF79Spec } from "../curriculum/procedimentos/poligonosContract";
import { PlanoCartesianoStage } from "./primitives/PlanoCartesianoStage"; import type { PlanoCartesianoF80Spec } from "../curriculum/procedimentos/planoCartesianoContract";
import { AreaF81Stage } from "./primitives/AreaF81Stage"; import type { AreaF81Spec } from "../curriculum/procedimentos/areaF81Contract";
import { FatoresRetangulosStage } from "./primitives/FatoresRetangulosStage"; import type { FatoresRetangulosF66Spec } from "../curriculum/procedimentos/fatoresRetangulosContract";
import { CirculoAreasStage } from "./primitives/CirculoAreasStage"; import type { CirculoAreasF91Spec } from "../curriculum/procedimentos/circuloAreasContract";
import { ExpressaoF77Stage } from "./primitives/ExpressaoF77Stage"; import type { ExpressaoF77Spec } from "../curriculum/procedimentos/expressaoF77Contract";
import { MapaTesouroStage } from "./primitives/MapaTesouroStage"; import type { MapaTesouroF60Spec } from "../curriculum/procedimentos/mapaTesouroContract";
import { SolidosGeometricosStage } from "./primitives/SolidosGeometricosStage"; import type { SolidosGeometricosF59Spec } from "../curriculum/procedimentos/solidosGeometricosContract";
import { ParesImparesStage } from "./primitives/ParesImparesStage"; import type { ParesImparesF38Spec } from "../curriculum/procedimentos/paresImparesContract";
import { FracoesEquivalentesStage } from "./primitives/FracoesEquivalentesStage"; import type { FracaoEquivalenteF73Spec } from "../curriculum/procedimentos/fracaoEquivalenteContract";
import { DivisaoLongaStage } from "./primitives/DivisaoLongaStage"; import type { DivisaoLongaF69Spec } from "../curriculum/procedimentos/divisaoLongaContract";
import { PerimetroStage } from "./primitives/PerimetroStage"; import type { PerimetroF63Spec } from "../curriculum/procedimentos/perimetroContract";
import { IgualdadeEquilibrioStage } from "./primitives/IgualdadeEquilibrioStage"; import type { IgualdadeEquilibrioF46Spec } from "../curriculum/procedimentos/igualdadeEquilibrioContract";
import { FichaRenderer as FichaRendererBase } from "./FichaRendererBase";

interface FichaRendererProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean, meta?: AnswerMeta) => void;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
}

/** Front-controller. Os cases de passthrough são guardas literais de palco único. */
export function FichaRenderer(props: FichaRendererProps) {
  const { question, onAnswer, disabled } = props;
  const send = (valor: any, meta?: AnswerMeta) => { if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta); };
  if (question.kind === 'draggroup' && (question.uiProps as { ficha?: string } | undefined)?.ficha === 'F38') {
    return <ParesImparesStage spec={question.uiProps as ParesImparesF38Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
  }
  switch (question.kind) {
    case 'regra-sequencia-f57': return <RegraSequenciaStage spec={question.uiProps as RegraSequenciaF57Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'partes-iguais-f45': return <PartesIguaisStage spec={question.uiProps as PartesIguaisF45Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'fracao-numero-f72': return <FracaoNumeroStage spec={question.uiProps as FracaoNumeroF72Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'decimos-centesimos-f75': return <DecimalStage spec={question.uiProps as DecimalF75Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'porcentagem-f87': return <PorcentagemStage spec={question.uiProps as PorcentagemF87Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'angulos-f78': return <AngulosStage spec={question.uiProps as AngulosF78Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'reta-completa-f84': return <RetaCompletaStage spec={question.uiProps as RetaCompletaF84Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'operar-negativos-f85': return <OperarNegativosStage spec={question.uiProps as OperarNegativosF85Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'linguagem-letras-f89': return <LinguagemLetrasStage spec={question.uiProps as LinguagemLetrasF89Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'jornal-turma-f64': return <JornalTurmaStage spec={question.uiProps as JornalTurmaF64Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'media-chance-f83': return <MediaChanceStage spec={question.uiProps as MediaChanceF83Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'problemas-medida-f82': return <ProblemasMedidaStage spec={question.uiProps as ProblemasMedidaF82Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'horas-minutos-f62': return <HorasMinutosStage spec={question.uiProps as HorasMinutosF62Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'conversao-unidades-f93': return <ConversaoUnidadesStage spec={question.uiProps as ConversaoUnidadesF93Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'poligonos-f79': return <PoligonosStage spec={question.uiProps as PoligonosF79Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'plano-cartesiano-f80': return <PlanoCartesianoStage spec={question.uiProps as PlanoCartesianoF80Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'area-f81': return <AreaF81Stage spec={question.uiProps as AreaF81Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'fatores-retangulos-f66': return <FatoresRetangulosStage spec={question.uiProps as FatoresRetangulosF66Spec} options={question.options ?? []} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'circulo-areas-f91': return <CirculoAreasStage spec={question.uiProps as CirculoAreasF91Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'expressao-f77': return <ExpressaoF77Stage spec={question.uiProps as ExpressaoF77Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'mapa-tesouro-f60': return <MapaTesouroStage spec={question.uiProps as MapaTesouroF60Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'solidos-geometricos-f59': return <SolidosGeometricosStage spec={question.uiProps as SolidosGeometricosF59Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'fracoes-equivalentes-f73': return <FracoesEquivalentesStage spec={question.uiProps as FracaoEquivalenteF73Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'divisao-longa-f69': return <DivisaoLongaStage spec={question.uiProps as DivisaoLongaF69Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'perimetro-f63': return <PerimetroStage spec={question.uiProps as PerimetroF63Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'igualdade-equilibrio-f46': return <IgualdadeEquilibrioStage spec={question.uiProps as IgualdadeEquilibrioF46Spec} disabled={Boolean(disabled)} onAnswer={send}/>;
    case 'story-bars': case 'tabuada': case 'decomposicao': case 'ancora': case 'familia': case 'deslocamento': case 'area': case 'pareamento': case 'touchcount': case 'fileira': case 'classificacao': case 'audiochoice': case 'touchplace': case 'shapecanvas': case 'grandeza': case 'medidas': case 'moldura': default:
      return <FichaRendererBase {...props}/>;
  }
}