import React from 'react';
import { Question } from '../types';

// Import primitives
import { EmojiRow } from './primitives/EmojiRow';
import { TenFrame } from './primitives/TenFrame';
import { VisualAddition } from './primitives/VisualAddition';
import { ScatteredItems } from './primitives/ScatteredItems';
import { LinkingCubes } from './primitives/LinkingCubes';
import { TakeApart } from './primitives/TakeApart';
import { NumberBond } from './NumberBond';
import { NumberLine } from './NumberLine';
import { InteractiveNumberLine } from './InteractiveNumberLine';
import { Quadrado100 } from './Quadrado100';
import { ShapeCanvas } from './ShapeCanvas';
import { Relogio } from './Relogio';
import { Balanca } from './Balanca';
import { MaterialDourado } from './MaterialDourado';
import { DragGroup } from './DragGroup';

interface FichaRendererProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  disabled?: boolean;
  promptDone?: boolean;
}

export function FichaRenderer({ question, onAnswer, disabled, promptDone = true }: FichaRendererProps) {
  const { kind, uiProps, evaluate } = question;

  const handleInteract = (val: any) => {
    if (disabled) return;
    const isCorrect = evaluate(val);
    onAnswer(val, isCorrect);
  };

  switch (kind) {
    case 'emojirow':
      return <div className="flex justify-center"><EmojiRow {...uiProps} onItemTouch={handleInteract} disabled={disabled} promptDone={promptDone} /></div>;
      
    case 'bond':
      return <div className="flex justify-center"><NumberBond {...uiProps} /></div>;
      
    case 'numberline':
      return <InteractiveNumberLine {...uiProps} onAnswer={handleInteract} disabled={disabled} />;
      
    case 'tens':
      return <MaterialDourado {...uiProps} />;
      
    case 'relogio':
      return <Relogio {...uiProps} />;
      
    case 'balanca':
      return <Balanca {...uiProps} />;
      
    case 'draggroup':
      return <DragGroup {...uiProps} onAnswer={handleInteract} disabled={disabled} />;
    case 'tenframe':
      return <div className="flex justify-center"><TenFrame filled={question.n!} {...uiProps} /></div>;
    case 'visual-addition':
      return <VisualAddition a={question.a!} b={question.b!} emojiA={question.emoji} emojiB={question.emoji} {...uiProps} />;
    case 'scattered':
      return <ScatteredItems n={question.n!} emoji={question.emoji!} {...uiProps} />;
    case 'linking-cubes':
      return <LinkingCubes groups={question.groups!} {...uiProps} />;
    case 'take-apart':
      return <TakeApart total={question.n!} knownSplit={{ a: question.a!, b: question.b! }} {...uiProps} />;
    case 'plain':
      return <div className="flex justify-center text-4xl font-black text-slate-800 py-8">{uiProps.text}</div>;
      
    default:
      return <div className="p-4 border border-rose-300 text-rose-500 rounded text-center font-bold">Ficha não implementada: {kind}</div>;
  }
}
