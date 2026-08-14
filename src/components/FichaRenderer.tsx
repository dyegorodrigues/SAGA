import React from "react";
import type { AnswerMeta, Question } from "../types";
import { RegraSequenciaStage } from "./primitives/RegraSequenciaStage";
import type { RegraSequenciaF57Spec } from "../curriculum/procedimentos/regraSequenciaContract";
import { PartesIguaisStage } from "./primitives/PartesIguaisStage";
import type { PartesIguaisF45Spec } from "../curriculum/procedimentos/partesIguaisContract";
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
 *
 * O renderer histórico permanece byte a byte em FichaRendererBase. Esta camada
 * só intercepta famílias novas que precisam publicar AnswerMeta próprio sem
 * fingir pertencer a uma primitiva semanticamente diferente.
 */
export function FichaRenderer(props: FichaRendererProps) {
  const { question, onAnswer, disabled } = props;

  switch (question.kind) {
    case 'regra-sequencia-f57': {
      const spec = question.uiProps as RegraSequenciaF57Spec;
      return (
        <RegraSequenciaStage
          spec={spec}
          disabled={Boolean(disabled)}
          onAnswer={(valor, meta) => {
            if (disabled) return;
            onAnswer(valor, question.evaluate?.(valor) ?? false, meta);
          }}
        />
      );
    }

    case 'partes-iguais-f45': {
      const spec = question.uiProps as PartesIguaisF45Spec;
      return (
        <PartesIguaisStage
          spec={spec}
          disabled={Boolean(disabled)}
          onAnswer={(valor, meta) => {
            if (disabled) return;
            onAnswer(valor, question.evaluate?.(valor) ?? false, meta);
          }}
        />
      );
    }

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
