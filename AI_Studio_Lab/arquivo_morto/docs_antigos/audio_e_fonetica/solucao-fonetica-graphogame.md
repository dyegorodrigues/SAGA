# 🔊 Fonética pt-BR + método GraphoGame — a solução definitiva e o plano

*Estudo do método GraphoGame, a solução de áudio (com o que testei de verdade), a regra
do CA/CE/CI, e o redesenho da Fábrica de Sílabas. Escrito depois de tentar gerar áudio
neural neste ambiente.*

---

## 1. A verdade sobre o áudio (o que funciona e o que não funciona)

**O que NÃO funciona (e a pesquisa do Zeus confirmou):** colar fonemas isolados
(`/k/` + `/a/`) via código. Coarticulação: na fala real o C "desliza" para a vogal;
colar dois áudios secos dá "K...A" robótico e truncado. E oclusivas (P,B,T,D,C,G) nem
existem isoladas. **Foi por isso que o hack do Gemini (`MAPA_FONEMAS_PTBR`) bugou** — e é
a causa do "N acento agudo no I" e do "v-v-u".

**A boa notícia que resolve metade do problema DE GRAÇA:** a voz pt-BR do navegador **já
sabe as regras do português**. Se você mandar a SÍLABA ou a PALAVRA inteira:
- "ca" → ela fala /ka/ · "ce" → /se/ · "ci" → /si/ · "co" → /ko/
- "gato" → /gatu/ · "gelo" → /ʒelu/ · "guerra" → /gɛʁa/
Ou seja: **falando a sílaba inteira (a minha abordagem), o CA/CE/CI sai CERTO sozinho.**
O problema do Zeus com o som do C só existe na versão do Gemini (que força fonema). Na
minha versão isso já está correto.

**O upgrade de qualidade (voz natural em vez de robótica):** um **banco de áudio neural
pré-gerado** de sílabas e palavras. Gera-se UMA vez, embarca no app, toca offline. É o
que o GraphoGame faz. Precisa de um destes motores (todos com voz pt-BR de primeira):
- **Google Cloud TTS** (vozes `pt-BR-Neural2` / `Chirp3-HD`) — a melhor. Precisa de chave.
- **Gemini API TTS** (`gemini-2.5-flash-preview-tts`) — a mesma chave que o app já usa
  no server. **O AI Studio é do próprio Google — lá dá pra gerar isso nativamente.**
- **Piper** (offline, grátis, voz `pt_BR-faber`) — precisa baixar o modelo do HuggingFace.

## 2. Script pronto de geração (rodar UMA vez onde houver chave/acesso)

Gera todas as sílabas CV + palavras-âncora como MP3 em `public/audio/`. Exemplo com a
API do Google (Gemini/Cloud) — é só ter a `GEMINI_API_KEY` no ambiente:

```js
// scripts/gen-audio.mjs  — roda com: node scripts/gen-audio.mjs
import fs from "node:fs";
const KEY = process.env.GEMINI_API_KEY;
const CONS = ["p","b","t","d","c","g","m","n","l","r","s","v","f","j","z","x"];
const VOG  = ["a","e","i","o","u"];
const silabas = CONS.flatMap(c => VOG.map(v => c+v));           // pa, pe, pi...
const palavras = ["bola","casa","sapo","gato","pato","vaca","mala","lua","dado","fada"];
const alvos = [...silabas, ...palavras];
fs.mkdirSync("public/audio", { recursive: true });
for (const t of alvos) {
  // Google Cloud TTS (pt-BR-Neural2-A): POST texto -> recebe MP3 base64
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${KEY}`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: { text: t },
      voice: { languageCode: "pt-BR", name: "pt-BR-Neural2-A" },
      audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
    }),
  });
  const j = await res.json();
  fs.writeFileSync(`public/audio/${t}.mp3`, Buffer.from(j.audioContent, "base64"));
  console.log("ok", t);
}
```
São ~130 arquivos, ~2-3 MB no total. Depois o app toca `public/audio/${silaba}.mp3` em vez
do TTS do navegador. **Zero gravação manual.** Enquanto o banco não existe, o app cai no
TTS do navegador (que já fala a sílaba certa).

## 3. A regra do CA/CE/CI (grafema → fonema) — para ENSINAR, não só falar

O TTS já pronuncia certo. Mas para a trilha "Manhas do Português — Dança do C" (ensinar a
REGRA), o mapa é:
| Grafema | Antes de A, O, U | Antes de E, I |
|---|---|---|
| **C** | som /k/ (CA, CO, CU) | som /s/ (CE, CI) |
| **G** | som /g/ (GA, GO, GU) | som /ʒ/ (GE, GI) |
| **C+H** | — | CH = /ʃ/ (CHA, CHE) |
Ordem de ensino (sem bugar a cabeça): primeiro só as "duras" (CA/CO/CU, GA/GO/GU) até
dominar; SÓ DEPOIS introduz as "brandas" (CE/CI, GE/GI) como contraste. Nunca misturar no
começo (Princípio 3 do método: uma novidade por vez).

## 4. Como o GraphoGame constrói o exercício (a dinâmica certa)

Cada atividade tem esta estrutura — e a nossa Fábrica de Sílabas deve seguir:
1. **Introdução curta (1ª vez):** o mascote diz o que fazer ("Vamos ouvir os sons e juntar!").
2. **Apresentação do som:** um botão 🔊 que a criança pode tocar QUANTAS VEZES quiser para
   ouvir o som-alvo (a sílaba inteira: "pá"). Sem pressa.
3. **A fusão visual:** as letras deslizam e se juntam (a animação SyllableBlender) — o
   VISUAL ajuda, mas o áudio é a sílaba inteira, não fonema colado.
4. **A escolha por OUVIDO:** as opções (pa/po/pe) têm um 🔊 cada — a criança ouve cada uma
   e toca na que casa com o alvo. É assim que pré-leitor faz: por som, não por leitura.
5. **Feedback curto ao acertar; explicação só ao errar; dá pra pular tocando na tela.**
6. **Progressão:** sílaba CV simples → famílias (PA-PE-PI-PO-PU) → CVC (POR, MAR) →
   palavras (BO+LA) → esconde a palavra, mostra o emoji, revela ao acertar.

**Não precisa ser gigante como o GraphoGame** — poucas trilhas bem-feitas, com essa
dinâmica, valem mais que mil sequências. E já deixamos os `prereqs` prontos pra expandir.

## 5. Plano de execução (o que fazer, na ordem)
1. **Agora (código, sem depender de chave):** redesenhar a Fábrica de Sílabas com a
   dinâmica do §4 — opções audíveis (🔊 por opção), intro só na 1ª, fusão visual com áudio
   de sílaba inteira (correto), sem o hack de fonemas. Funciona com o TTS do navegador.
2. **Quando houver chave/acesso:** rodar o `gen-audio.mjs` (§2) → o banco neural entra e a
   voz vira natural. É um passo de build, não muda o resto do app.
3. **Futuro:** trilha "Dança do C" (§3) e voz da família (regravar por cima do banco).

## 6. Fontes
- FalaBrasil — datasets e dicionário fonético pt-BR: https://github.com/falabrasil/speech-datasets
- Piper TTS (voz neural offline): https://github.com/rhasspy/piper
- GraphoGame — método fônico (pesquisa de Jyväskylä; adaptação PUC-RS).
- Coarticulação e o problema do fonema isolado: confirmado pela pesquisa do Zeus (Kaggle/CETUC).
