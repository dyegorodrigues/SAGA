import React from "react";
import type { AnswerMeta, Question } from "../types";
import { RegraSequenciaStage } from "./primitives/RegraSequenciaStage";
import type { RegraSequenciaF57Spec } from "../curriculum/procedimentos/regraSequenciaContract";
import { PartesIguaisStage } from "./primitives/PartesIguaisStage";
import type { PartesIguaisF45Spec } from "../curriculum/procedimentos/partesIguaisContract";
import { FracaoNumeroStage } from "./primitives/FracaoNumeroStage";
import type { FracaoNumeroF72Spec } from "../curriculum/procedimentos/fracaoNumeroContract";
import { DecimalStage } from "./primitives/DecimalStage";
import type { DecimalF75Spec } from "../curriculum/procedimentos/decimalContract";
import { FracoesEquivalentesStage } from "./primitives/FracoesEquivalentesStage";
import type { FracaoEquivalenteF73Spec } from "../curriculum/procedimentos/fracaoEquivalenteContract";
import { FichaRenderer as FichaRendererBase } from "./FichaRendererBase";

interface FichaRendererProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean, meta?: AnswerMeta) => void;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
}

/**
 * Front-controller dos palcos autorais especializados.
 * Os cases de passthrough são deliberados: o gate de palco único os usa como
 * contrato textual para impedir que um segundo renderer apareça no GameLoop.
 */
export function FichaRenderer(props: FichaRendererProps) {
  const { question, onAnswer, disabled } = props;
  const send = (valor: any, meta?: AnswerMeta) => {
    if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta);
  };

  switch (question.kind) {
    case 'regra-sequencia-f57':
      return <RegraSequenciaStage spec={question.uiProps as RegraSequenciaF57Spec} disabled={Boolean(disabled)} onAnswer={send} />;
    case 'partes-iguais-f45':
      return <PartesIguaisStage spec={question.uiProps as PartesIguaisF45Spec} disabled={Boolean(disabled)} onAnswer={send} />;
    case 'fracao-numero-f72':
      return <FracaoNumeroStage spec={question.uiProps as FracaoNumeroF72Spec} disabled={Boolean(disabled)} onAnswer={send} />;
    case 'decimos-centesimos-f75':
      return <DecimalStage spec={question.uiProps as DecimalF75Spec} disabled={Boolean(disabled)} onAnswer={send} />;
    case 'fracoes-equivalentes-f73':
      return <FracoesEquivalentesStage spec={question.uiProps as FracaoEquivalenteF73Spec} disabled={Boolean(disabled)} onAnswer={send} />;

    case 'story-bars':
    case 'tabuada':
    case 'decomposicao':
    case 'ancora':
    case 'familia':
    case 'deslocamento':
    case 'area':
    case 'pareamento':
    case 'touchcount':
    case 'fileira':
    case 'classificacao':
    case 'audiochoice':
    case 'touchplace':
    case 'shapecanvas':
    case 'grandeza':
    case 'medidas':
    case 'moldura':
    default:
      return <FichaRendererBase {...props} />;
  }
}
