const fs = require('fs');
let code = fs.readFileSync('src/components/primitives/TenFrame.tsx', 'utf-8');

code = code.replace(
  /interface TenFrameProps \{\n  filled: number;\n  filled2\?: number \| null;\n  highlightRow\?: 1 \| 2 \| null;\n  state\?: UIState;\n\}/,
  `interface TenFrameProps {
  filled: number;
  filled2?: number | null;
  destacarFileira?: 1 | 2 | null;
  destacarCelula?: number | null;
  preencherAte?: number | null;
  state?: UIState;
}`
);

code = code.replace(
  /export function TenFrame\(\{ filled, filled2 = null, highlightRow = null, state = 'ocioso' \}: TenFrameProps\) \{/,
  `export function TenFrame({ filled, filled2 = null, destacarFileira = null, destacarCelula = null, preencherAte = null, state = 'ocioso' }: TenFrameProps) {`
);

code = code.replace(/highlightRow === 1/g, 'destacarFileira === 1');
code = code.replace(/highlightRow === 2/g, 'destacarFileira === 2');

fs.writeFileSync('src/components/primitives/TenFrame.tsx', code);
