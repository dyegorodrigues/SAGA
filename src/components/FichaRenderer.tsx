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
import { FichaRenderer as FichaRendererBase } from "./FichaRendererBase";

interface FichaRendererProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean, meta?: AnswerMeta) => void;
  disabled?: boolean;
  promptDone?: boolean;
  mostrar?: unknown;
  falar?: (texto: string) => void;
}

export function FichaRenderer(props: FichaRendererProps) {
  const { question, onAnswer, disabled } = props;
  switch (question.kind) {
    case 'regra-sequencia-f57': {
      const spec = question.uiProps as RegraSequenciaF57Spec;
      return <RegraSequenciaStage spec={spec} disabled={Boolean(disabled)} onAnswer={(valor, meta) => { if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta); }} />;
    }
    case 'partes-iguais-f45': {
      const spec = question.uiProps as PartesIguaisF45Spec;
      return <PartesIguaisStage spec={spec} disabled={Boolean(disabled)} onAnswer={(valor, meta) => { if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta); }} />;
    }
    case 'fracao-numero-f72': {
      const spec = question.uiProps as FracaoNumeroF72Spec;
      return <FracaoNumeroStage spec={spec} disabled={Boolean(disabled)} onAnswer={(valor, meta) => { if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta); }} />;
    }
    case 'decimos-centesimos-f75': {
      const spec = question.uiProps as DecimalF75Spec;
      return <DecimalStage spec={spec} disabled={Boolean(disabled)} onAnswer={(valor, meta) => { if (!disabled) onAnswer(valor, question.evaluate?.(valor) ?? false, meta); }} />;
    }
    default:
      return <FichaRendererBase {...props} />;
  }
}
