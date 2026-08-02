import React, { useEffect, useState } from 'react';
import { Question } from '../../types';
import { InteractiveVertical } from './InteractiveVertical';
import { MaterialDourado } from './MaterialDourado';

interface VerticalPlaceValueStageProps {
  question: Question;
  onAnswer: (answer: number) => void;
  onMistake?: (digit: number) => void;
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
export function VerticalPlaceValueStage({ question, onAnswer, onMistake, disabled }: VerticalPlaceValueStageProps) {
  const props = question.uiProps as { vTop: number; vBot: number; showPlaceValue?: boolean; showRegroup?: boolean; showAlgorithm?: boolean };
  const unitSum = (props.vTop % 10) + (props.vBot % 10);
  const regroupUnits = unitSum % 10;
  const [regrouped, setRegrouped] = useState(false);

  useEffect(() => setRegrouped(false), [props.vTop, props.vBot]);

  return (
    <div className={`grid items-start gap-2 sm:gap-4 ${props.showPlaceValue ? 'lg:grid-cols-[minmax(0,1fr)_auto]' : ''}`}>
      {props.showPlaceValue && (
        <section className="space-y-3" aria-label="Material dourado das parcelas">
          <div className="grid grid-cols-2 gap-3">
            <PlaceValueOperand value={props.vTop} label="Primeiro número" />
            <PlaceValueOperand value={props.vBot} label="Segundo número" />
          </div>
          {props.showRegroup && (
            <div className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-3 text-center" aria-label={`Troca: dez unidades viram uma dezena e sobram ${regroupUnits}`}>
              <p className="text-base font-black text-amber-950">
                {regrouped ? "10 cubinhos viraram 1 barra!" : `Junte os ${unitSum} cubinhos`}
              </p>
              <div className="mt-2 flex min-h-20 items-center justify-center gap-3" aria-hidden="true">
                <span className={`max-w-36 text-2xl leading-6 tracking-[-0.2em] transition-opacity ${regrouped ? 'opacity-40' : ''}`}>
                  {'•'.repeat(unitSum)}
                </span>
                <span className="text-2xl font-black text-amber-800">→</span>
                {regrouped ? (
                  <>
                    <span className="h-16 w-4 rounded bg-amber-500 shadow-sm animate-pulse" />
                    <span className="text-sm font-black text-slate-700">+ {regroupUnits} {regroupUnits === 1 ? 'cubinho' : 'cubinhos'}</span>
                  </>
                ) : <span className="text-sm font-black text-amber-900">Escolha as unidades</span>}
              </div>
            </div>
          )}
        </section>
      )}
      <InteractiveVertical
        q={question}
        onAnswer={onAnswer}
        onMistake={onMistake}
        onRegroup={() => setRegrouped(true)}
        showAlgorithm={props.showAlgorithm !== false}
        disabled={disabled}
      />
    </div>
  );
}
