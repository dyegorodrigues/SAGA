import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { tokens, UIState } from '../../styles/tokens';

export function DragGroup({ 
  sourceCount, 
  destCount, 
  sourceEmoji = "🍎",
  destEmoji = "🐰",
  destLabels,
  tutorialText,
  onAnswer,
  onProgress,
  boxCapacity = 1,
  disabled, 
  state = 'ocioso',
  q // for backward compatibility
}: { 
  sourceCount?: number; 
  destCount?: number; 
  sourceEmoji?: string;
  destEmoji?: string;
  /**
   * Nome de cada destino, na ordem das caixas. Sem isto os grupos são emojis
   * anônimos — servem para repartir, não para classificar. A F79 precisa dizer
   * qual critério cada grupo representa, senão conferir vira tarefa mecânica.
   */
  destLabels?: string[];
  tutorialText?: string;
  onAnswer?: (val: any) => void;
  onProgress?: (progress: { itemsLeft: number; boxes: number[] }) => void;
  boxCapacity?: number;
  disabled?: boolean; 
  state?: UIState;
  q?: any;
}) {
  const actualSourceCount = sourceCount ?? q?.dividend ?? 0;
  const actualDestCount = destCount ?? q?.divisor ?? 2;
  const actualSourceEmoji = sourceEmoji ?? q?.emoji ?? "🍎";
  const actualDestEmoji = destEmoji ?? "🐰";
  const capacity = Math.max(1, Math.round(boxCapacity));

  const [itemsLeft, setItemsLeft] = useState(actualSourceCount);
  const [boxes, setBoxes] = useState<number[]>(Array(actualDestCount).fill(0));
  const [isAnswered, setIsAnswered] = useState(false);
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const [showTutorial, setShowTutorial] = useState(false);
  useEffect(() => {
    // Only show once per page load for this component.
    if (!window.localStorage.getItem('seen-draggroup-tut')) {
      setShowTutorial(true);
      window.localStorage.setItem('seen-draggroup-tut', '1');
      setTimeout(() => setShowTutorial(false), 4500);
    }
  }, []);

  const reset = () => {
    setItemsLeft(actualSourceCount);
    setBoxes(Array(actualDestCount).fill(0));
    setIsAnswered(false);
  };
  
  useEffect(() => {
    reset();
  }, [actualSourceCount, actualDestCount]);

  // Progresso é uma notificação do estado interno. A identidade do callback não
  // faz parte do estado observado: depender dela criava um ciclo quando o pai
  // passava uma função inline e atualizava estado em resposta à notificação.
  useEffect(() => {
    onProgressRef.current?.({ itemsLeft, boxes: [...boxes] });
  }, [itemsLeft, boxes]);
  
  const handleBoxClick = (i: number) => {
    if (disabled) return;
    // se for legacy (q.dividend), aceita múltiplos itens; o modo autoral pode
    // declarar capacidade explícita (F38 usa 2 para que cada destino seja uma dupla).
    const isLegacy = !!q;
    const room = isLegacy || boxes[i] < capacity;
    if (itemsLeft > 0 && room) {
      setItemsLeft(l => l - 1);
      setBoxes(b => {
        const nb = [...b];
        nb[i]++;
        return nb;
      });
    } else if (boxes[i] > 0) {
      setItemsLeft(l => l + 1);
      setBoxes(b => {
        const nb = [...b];
        nb[i]--;
        return nb;
      });
    }
  };
  
  useEffect(() => {
    if (!disabled && onAnswer && !isAnswered) {
      if (q) {
        if (itemsLeft === 0) {
          const allEqual = boxes.every(v => v === boxes[0]);
          if (allEqual) {
            setIsAnswered(true);
            onAnswer(boxes[0]);
          }
        }
      } else {
        const allFilled = boxes.every(v => v === capacity);
        if (allFilled) {
          setIsAnswered(true);
          onAnswer(actualDestCount);
        }
      }
    }
  }, [itemsLeft, boxes, disabled, onAnswer, actualDestCount, q, isAnswered, capacity]);
  
  return (
    <div className={`w-full flex flex-col items-center gap-6 mt-4 select-none ${tokens.estado[state]} relative`}>
      {showTutorial && (
        <div className="absolute top-[-70px] left-0 right-0 z-50 pointer-events-none flex justify-center">
          <div
            className="p-4 rounded-2xl shadow-xl border-4 flex flex-col items-center max-w-[320px]"
            style={{ backgroundColor: tokens.cor.superficie.destaque, borderColor: tokens.cor.elementos.marcador }}
          >
             <span className="text-xl mb-2 text-center font-black leading-tight" style={{ color: tokens.cor.texto.principal }}>
               {tutorialText ?? 'Dê uma comidinha para cada bichinho!'}
             </span>
             <div className="flex gap-2 text-3xl animate-bounce">👇👇👇</div>
          </div>
        </div>
      )}
      <div 
        className="flex flex-wrap gap-2 justify-center min-h-[60px] p-4 w-full border-dashed"
        style={{
          backgroundColor: tokens.cor.elementos.preenchimento,
          borderRadius: '16px',
          borderColor: tokens.cor.elementos.borda,
          borderWidth: 2
        }}
      >
        {Array.from({ length: itemsLeft }).map((_, i) => (
          <motion.div
            key={`left-${i}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            data-draggroup-item
            className="text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            {actualSourceEmoji}
          </motion.div>
        ))}
        {itemsLeft === 0 && (
          <div className="font-bold w-full text-center" style={{ color: tokens.cor.texto.secundario }}>Nenhum sobrando!</div>
        )}
      </div>
      <div className="flex justify-center gap-4 w-full flex-wrap">
        {boxes.map((count, i) => (
          <div 
            key={`box-${i}`}
            onClick={() => handleBoxClick(i)}
            data-draggroup-box={i}
            aria-label={destLabels?.[i]}
            className="flex-1 flex flex-col items-center justify-center p-2 gap-1 cursor-pointer transition-colors shadow-sm hover:brightness-95 relative"
            style={{
              minWidth: tokens.tamanho.alvo,
              minHeight: '80px',
              backgroundColor: count > 0 ? tokens.cor.elementos.preenchimento : tokens.cor.superficie.cartao,
              borderColor: tokens.cor.elementos.marcador,
              borderWidth: 3,
              borderRadius: '12px'
            }}
          >
            {destLabels?.[i]
              ? <span className="px-1 text-center text-xs font-black leading-tight" style={{ color: tokens.cor.texto.principal }}>{destLabels[i]}</span>
              : !q && <div className="text-3xl opacity-30 absolute">{actualDestEmoji}</div>}
            {count > 0 && Array.from({ length: count }).map((_, j) => (
              <motion.div
                key={`box-${i}-${j}`}
                layout
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`text-3xl ${!q ? 'z-10' : ''}`}
              >
                {actualSourceEmoji}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
