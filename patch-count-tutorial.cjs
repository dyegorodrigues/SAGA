const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

if (!code.includes('mockTutorialN')) {
  code = code.replace(
    /const \[guidedIdx, setGuidedIdx\] = useState<number \| null>\(null\);/,
    'const [guidedIdx, setGuidedIdx] = useState<number | null>(null);\n  const [mockTutorialN, setMockTutorialN] = useState<number | null>(null);\n\n  useEffect(() => {\n    if (guidedIdx === null) setMockTutorialN(null);\n  }, [guidedIdx]);'
  );
}

// Modify startGuidedCount
code = code.replace(
  /const startGuidedCount = \([\s\S]*?\}\s*;\s*const startGuidedSum =/m,
  `const startGuidedCount = (isAuto: boolean = true) => {
    const realN = q.n || 3;
    const mockN = realN === 3 ? 4 : 3;
    setMockTutorialN(mockN);
    runCountAula(
      mockN,
      "Veja como a gente conta! Aponte um por um:",
      \`... então são \${numPt(mockN).toLowerCase()}! O último número é o total! Agora é sua vez!\`,
      isAuto,
      true
    );
  };
  const startGuidedSum =`
);

// Modify runCountAula signature and usage
code = code.replace(
  /const runCountAula = \(total: number, intro: string, finale: string, isAuto: boolean\) => \{/,
  'const runCountAula = (total: number, intro: string, finale: string, isAuto: boolean, isMock: boolean = false) => {'
);
code = code.replace(
  /const limit = shouldScaffold \? 2 : total;/,
  'const limit = (shouldScaffold && !isMock) ? 2 : total;'
);

fs.writeFileSync('src/components/GameLoop.tsx', code);
