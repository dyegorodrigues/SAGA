const fs = require('fs');
let code = fs.readFileSync('src/components/primitives/DragGroup.tsx', 'utf8');

code = code.replace(
  'const [boxes, setBoxes] = useState<number[]>(Array(actualDestCount).fill(0));',
  'const [boxes, setBoxes] = useState<number[]>(Array(actualDestCount).fill(0));\n  const [isAnswered, setIsAnswered] = useState(false);'
);

code = code.replace(
  'setBoxes(Array(actualDestCount).fill(0));\n  };',
  'setBoxes(Array(actualDestCount).fill(0));\n    setIsAnswered(false);\n  };'
);

code = code.replace(
  /useEffect\(\(\) => \{\n    if \(\!disabled && onAnswer\) \{[\s\S]*?\}, \[itemsLeft, boxes, disabled, onAnswer, actualDestCount, q\]\);/,
  `useEffect(() => {
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
        const allFilled = boxes.every(v => v === 1);
        if (allFilled) {
          setIsAnswered(true);
          onAnswer(actualDestCount);
        }
      }
    }
  }, [itemsLeft, boxes, disabled, onAnswer, actualDestCount, q, isAnswered]);`
);

fs.writeFileSync('src/components/primitives/DragGroup.tsx', code);
