import React from 'react';
import { Question } from '../types';

// Import primitives
import { EmojiRow } from './primitives/EmojiRow';
import { TenFrame } from './primitives/TenFrame';
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
}

export function FichaRenderer({ question, onAnswer, disabled }: FichaRendererProps) {
  const { kind, uiProps, evaluate } = question;

  const handleInteract = (val: any) => {
    if (disabled) return;
    const isCorrect = evaluate(val);
    onAnswer(val, isCorrect);
  };

  switch (kind) {
    case 'emojirow':
      return <div className="flex justify-center"><EmojiRow {...uiProps} onItemTouch={handleInteract} disabled={disabled} /></div>;
      
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
      
    default:
      return <div className="p-4 border border-rose-300 text-rose-500 rounded text-center font-bold">Ficha não implementada: {kind}</div>;
  }
}
