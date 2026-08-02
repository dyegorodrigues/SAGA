import React from 'react';
import { Question } from '../../types';
import { InteractiveVertical } from './InteractiveVertical';
import { MaterialDourado } from './MaterialDourado';

interface VerticalPlaceValueStageProps {
  question: Question;
  onAnswer: (answer: number) => void;
  disabled: boolean;
}

function PlaceValueOperand({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1" aria-label={`${label}: ${value}`}>
      <p className="text-center text-sm font-bold text-slate-600">{label} · {value}</p>
      <MaterialDourado dezenas={Math.floor(value / 10)} unidades={value % 10} compact />
    </div>
  );
}

/** Keeps concrete place value beside the vertical algorithm during the CRA bridge. */
export function VerticalPlaceValueStage({ question, onAnswer, disabled }: VerticalPlaceValueStageProps) {
  const props = question.uiProps as { vTop: number; vBot: number; showPlaceValue?: boolean };

  return (
    <div className={`grid items-start gap-4 ${props.showPlaceValue ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
      {props.showPlaceValue && (
        <section className="grid grid-cols-2 gap-3" aria-label="Material dourado das parcelas">
          <PlaceValueOperand value={props.vTop} label="Primeiro número" />
          <PlaceValueOperand value={props.vBot} label="Segundo número" />
        </section>
      )}
      <InteractiveVertical q={question} onAnswer={onAnswer} disabled={disabled} />
    </div>
  );
}
