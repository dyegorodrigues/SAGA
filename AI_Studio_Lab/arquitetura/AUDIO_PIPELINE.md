# 🎙️ PIPELINE DE ÁUDIO (SAGA)

## O Problema
Para a frente F0 e F1 (4 a 7 anos), a interface deve ser **Áudio-First**. A criança não lê enunciados. Tudo o que precisa ser feito ou ensinado deve ser falado.
Se os geradores não declararem as falas, eles nascem mudos.

## A Solução (Como as falas são declaradas)
A interface `Question` recebeu dois novos campos:
1. `audioPrompt?: string;` -> A frase principal que introduz o exercício. Ex: "Coloque três balões no barco."
2. `audioSteps?: string[];` -> Um array de falas sequenciais usadas principalmente na "Aulinha" (I-do). Ex: `["Um!", "Dois!", "Três!"]` casando com as animações.

## Como o GameLoop consome
O motor TTS em runtime (atualmente usando o Web Speech API nativo, via `speak()` e `pickVoice()`) consome o `audioPrompt` no momento em que a tela do exercício monta (ou após a aulinha de introdução).
No caso da aulinha guiada (You-do / We-do), o componente renderizador (ex: O Canhão de Balões) consome o `audioSteps` a cada disparo/animação concluída, usando `speak(audioSteps[i])`.

## Futuro (Áudio Pré-gravado)
O TTS nativo do navegador é bom para prototipagem rápida e desenvolvimento, mas a voz robótica não é o ideal para engajar crianças.
O pipeline está preparado para, no futuro, trocar a função `speak()` que chama o TTS por uma função que busca arquivos de áudio pré-gravados em um CDN (ex: `https://cdn.saga.com/audio/f0/contagem_pirata_3.mp3`). A chave de busca seria gerada a partir do `audioPrompt` ou de um `audioId` injetado pelo gerador.
