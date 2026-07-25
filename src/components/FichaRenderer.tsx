import React, { useState } from 'react';
import { ConcreteQuestion } from '../curriculum/Composer';

// Import all primitives
import { EmojiRow } from './primitives/EmojiRow';
import { NumberBond } from './primitives/NumberBond';
import { NumberLine } from './primitives/NumberLine';
import { InteractiveNumberLine } from './primitives/InteractiveNumberLine';
import { TenFrame } from './primitives/TenFrame';
import { Quadrado100 } from './primitives/Quadrado100';
import { ShapeCanvas } from './primitives/ShapeCanvas';
import { Relogio } from './primitives/Relogio';
import { Balanca } from './primitives/Balanca';
import { MaterialDourado } from './primitives/MaterialDourado';
import { DragGroup } from './primitives/DragGroup';

interface FichaRendererProps {
  question: ConcreteQuestion;
  onAnswer: (answer: any, isCorrect: boolean) => void;
}

export function FichaRenderer({ question, onAnswer }: FichaRendererProps) {
  const { kind, uiProps, evaluate } = question;

  const handleInteract = (val: any) => {
    const isCorrect = evaluate(val);
    onAnswer(val, isCorrect);
  };

  switch (kind) {
    case 'emojirow':
      return <EmojiRow {...uiProps} onItemTouch={handleInteract} />;
      
    case 'bond':
      // The primitive currently triggers onClick but doesn't pass a value input directly.
      // We will need a generic numpad or options below the primitive for input.
      return <NumberBond {...uiProps} onCircleClick={(part) => console.log('Clicked', part)} />;
      
    case 'numberline':
      return <InteractiveNumberLine {...uiProps} onAnswer={handleInteract} />;
      
    case 'tens':
      return <MaterialDourado {...uiProps} />;
      
    case 'relogio':
      return <Relogio {...uiProps} onTimeChange={(h, m) => handleInteract({h, m})} />;
      
    case 'balanca':
      return <Balanca {...uiProps} onSettle={(inclined) => handleInteract(inclined)} />;
      
    default:
      return <div className="p-4 border border-rose-300 text-rose-500 rounded">Kind não mapeado: {kind}</div>;
  }
}
