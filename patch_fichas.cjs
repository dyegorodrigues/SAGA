const fs = require('fs');

// Patch N1.01
let n101 = fs.readFileSync('src/curriculum/fichas/N1.01.ts', 'utf8');
n101 = n101.replace('audio_prompt: "Dê um para cada!"', 'audio_prompt: "Dê um para cada!", tutorial: [{ say: "Toque para entregar uma comidinha para cada um!" }]');
n101 = n101.replace('audio_prompt: "Será que tem o suficiente para todos?",', 'audio_prompt: "Será que tem o suficiente para todos?", tutorial: [{ say: "Lembre-se: é apenas UM para cada um!" }],');
fs.writeFileSync('src/curriculum/fichas/N1.01.ts', n101);

// Patch Composer
let composer = fs.readFileSync('src/curriculum/Composer.ts', 'utf8');
composer = composer.replace('audioPrompt: params.audio_prompt,', 'audioPrompt: params.audio_prompt,\n      tutorial: params.tutorial,');
fs.writeFileSync('src/curriculum/Composer.ts', composer);
