import { readFileSync, writeFileSync } from 'fs';

function fixFile(path: string) {
    let content = readFileSync(path, 'utf-8');
    content = content.replace(/tokens\.cor\.elementos\.primario/g, 'tokens.cor.elementos.marcador');
    content = content.replace(/tokens\.cor\.elementos\.fundo/g, 'tokens.cor.superficie.fundo');
    content = content.replace(/tokens\.cor\.fundo/g, 'tokens.cor.superficie.fundo');
    writeFileSync(path, content);
}

fixFile('src/components/primitives/AudioChoice.tsx');
fixFile('src/components/primitives/SentenceBuilder.tsx');
fixFile('src/components/primitives/StoryPanel.tsx');
fixFile('src/components/primitives/TouchPlace.tsx');
