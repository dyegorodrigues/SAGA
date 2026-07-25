const fs = require('fs');
let code = fs.readFileSync('src/components/primitives/EmojiRow.tsx', 'utf8');
code = code.replace(
  "import { tokens, UIState } from '../../styles/tokens';",
  "import { tokens, UIState } from '../../styles/tokens';\nimport { speak } from '../Mascot';"
);
code = code.replace(
  "interactiveCount?: boolean;",
  "interactiveCount?: boolean;\n  disabled?: boolean;"
);
code = code.replace(
  "onItemTouch\n}: EmojiRowProps) {",
  "onItemTouch,\n  disabled\n}: EmojiRowProps) {"
);
code = code.replace(
  "if (!interactiveCount) return;",
  "if (!interactiveCount || disabled) return;"
);
code = code.replace(
  "setTouchedCount(newCount);",
  "setTouchedCount(newCount);\n      speak(newCount.toString());"
);
fs.writeFileSync('src/components/primitives/EmojiRow.tsx', code);
