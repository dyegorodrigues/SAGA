const fs = require('fs');
let code = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');

// Remove askAiTutor function
code = code.replace(/const askAiTutor = async \(\) => \{[\s\S]*?^  \};/m, '');

// Remove AI Tutor states
code = code.replace(/const \[aiTutorOpen, setAiTutorOpen\] = useState\(false\);\n  const \[aiTutorMessage, setAiTutorMessage\] = useState\(""\);\n  const \[aiTutorLoading, setAiTutorLoading\] = useState\(false\);\n/m, '');

// Remove askAiTutor button
code = code.replace(/<button\s*onClick=\{askAiTutor\}[\s\S]*?<\/button>/m, '');

// Remove AI Tutor Dialogue Bubble
code = code.replace(/\{\/\* AI Tutor Dialogue Bubble \*\/\}\s*\{aiTutorOpen && \([\s\S]*?\}\)}/m, '');

fs.writeFileSync('src/components/GameLoop.tsx', code);
