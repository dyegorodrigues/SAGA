const fs = require('fs');

// Fix GameLoop.tsx
let gameCode = fs.readFileSync('src/components/GameLoop.tsx', 'utf-8');
gameCode = gameCode.replace(/setAiTutorOpen\(false\); \/\/ Close AI bubble on reply/g, '');
gameCode = gameCode.replace(/setAiTutorOpen\(false\);/g, '');
gameCode = gameCode.replace(/ onClick=\{askAiTutor\}/g, '');
gameCode = gameCode.replace(/state="sucesso"/g, 'state="correto"'); // Assuming 'correto' is the UIState for success, or maybe just remove state
fs.writeFileSync('src/components/GameLoop.tsx', gameCode);

// Fix KidHomeScreen.tsx
let kidCode = fs.readFileSync('src/components/KidHomeScreen.tsx', 'utf-8');
kidCode = kidCode.replace(/const \[activeShellTab, setActiveShellTab\] = useState<"jornada" \| "escola" \| "dojo" \| "oficina" \| "perfil">\| "dojo" \| "oficina" \| "perfil">\("jornada"\);/, 'const [activeShellTab, setActiveShellTab] = useState<"jornada" | "escola" | "dojo" | "oficina" | "perfil">("jornada");');
fs.writeFileSync('src/components/KidHomeScreen.tsx', kidCode);

