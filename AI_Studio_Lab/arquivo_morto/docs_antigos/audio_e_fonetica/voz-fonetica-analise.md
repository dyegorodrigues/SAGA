# 🎙️ Voz e Fonética pt-BR — a análise definitiva (Claude Code)

> ⚠️ **SUPERADO.** Esta análise foi absorvida e atualizada por `solucao-fonetica-graphogame.md` (a decisão) e `luna-roteiro-audios.md` (a execução). Preservado como registro.

*Resposta à pergunta do Zeus: qual a melhor forma de ter voz nativa pt-BR e fonemas
para a alfabetização, sem depender de gravação manual? Este doc analisa as opções,
CORRIGE um erro técnico dos dossiês do AI Studio, e define o caminho.*

---

## 1. O erro técnico que preciso corrigir (importante)

Os dois dossiês do AI Studio propõem **tocar fonemas isolados em sequência** (`/p/` +
`/o/` → "pó") a partir de um banco de 32 sons gravados. **Isso NÃO funciona** — e é a
razão de nenhum app sério de alfabetização fazer exatamente assim:

- **Coarticulação:** a fala não é conta de colar (bead-on-a-string). Os sons se
  fundem e transicionam. Colar um `/p/` gravado + um `/o/` gravado soa robótico e
  quebrado — não vira "pó" natural.
- **Consoantes OCLUSIVAS (P, B, T, D, C/K, G) são IMPOSSÍVEIS de pronunciar sozinhas.**
  O `/p/` isolado é literalmente silêncio + um estalo; para "dizer o /p/" você é
  obrigado a colar uma vogal ("pê", "pŭ"). Um arquivo `p.mp3` "puro" não existe de
  verdade. Por isso o banco de 32 fonemas do Kaggle **não resolve a situação sozinho**.
- **Só as CONTÍNUAS (M, N, L, R, S, Z, V, F, J, X) podem ser esticadas** ("mmmm",
  "ssss") — e mesmo essas, para ENSINAR o som, não para "colar" a sílaba.

**Conclusão:** a unidade certa de áudio para o nosso currículo é a **SÍLABA inteira**
(pa, pe, pi, po, pu, ma, me…), não o fonema isolado. O TTS neural pronuncia sílaba
perfeitamente. Os fonemas contínuos gravados servem de APOIO para ensinar o som da
letra, não para montar a sílaba.

---

## 2. A solução definitiva: Banco de Áudio Pré-Gerado (sílabas + palavras)

O que os apps profissionais (linhagem GraphoGame) realmente fazem: um **banco estático
de áudios de SÍLABAS e PALAVRAS**, gerado UMA vez com voz de alta qualidade e embarcado
no app. Vantagens: voz natural (sem os erros do TTS do navegador), **funciona offline**,
**custo zero por uso** (gerado uma vez), **sem gravação manual**.

O conjunto é **pequeno e fechado**:
- ~125 sílabas CV (25 consoantes-som × 5 vogais) + ~60 sílabas CVC/CCV comuns
- ~10 sons de consoantes contínuas (para "escute o /mmm/")
- ~200 palavras-âncora do currículo (bola, casa, sapo…)
Total: ~400 clipes MP3 curtos (~2-4 MB no total). Cabe folgado no app.

### Como gerar (sem gravar nada, e independente do Zeus)
Três motores neurais pt-BR, do mais autônomo ao premium:

| Motor | Tipo | Custo | Nota |
|---|---|---|---|
| **Piper** (rhasspy) | Offline, open-source (MIT), roda em CPU | **Grátis** | Voz pt-BR "faber" (masculina). Gera os 400 clipes num script local. É o caminho mais independente. |
| **Google Cloud TTS** (Chirp3-HD / Neural2 pt-BR) | Nuvem, gera no build | ~centavos (gera 1×) | Vozes femininas dóceis excelentes; SSML com `<phoneme>` IPA para precisão. |
| **Azure / ElevenLabs** | Nuvem premium | Pago | Qualidade de estúdio; ElevenLabs permite clonar voz (família, no futuro). |

**Recomendação:** gerar com **Google Cloud TTS Neural2 pt-BR** (voz infantil dócil,
qualidade superior à do Piper) num script de build que roda UMA vez e salva os MP3 em
`public/audio/`. Se quiser 100% offline/grátis sem chave de API, **Piper** é o plano B.
Nos dois casos: **gera uma vez, embarca, toca offline — o Zeus não grava nada.**

### A coreografia de fusão, feita CERTO
```
sílaba CV com consoante CONTÍNUA (ex.: MA):
  toca "mmmm" (fonema contínuo) → letra M vibra → 300ms
  toca a SÍLABA inteira "ma" (áudio neural) → as letras se juntam com brilho
sílaba CV com consoante OCLUSIVA (ex.: PA):
  NÃO tenta isolar o /p/. Fala direto: "o P e o A juntos fazem... PA!" (sílaba neural)
```

---

## 3. O caminho em fases (pragmático)

- **Fase 0 — AGORA (grátis, já no app):** TTS do navegador falando a SÍLABA ("Escute:
  pá!"). É a voz robótica, mas funciona e ensina. É onde estamos. Já ajustei para
  liderar com o som da sílaba (não soletrar letra).
- **Fase 1 — O FIX REAL (esforço médio, alto valor):** banco de áudio pré-gerado
  (§2). Escrevo o script de geração + o player de fusão. A voz vira natural e offline.
  **Esta é a "solução definitiva que funciona" que o Zeus pediu.**
- **Fase 2 — Profissionalização (futuro):** regravar com voz profissional OU da própria
  família (ElevenLabs clona, ou gravação caseira) — calor e identidade de marca.

## 4. Respostas diretas às perguntas do Zeus
- *"Você consegue gerar/desenvolver isso?"* — Sim: escrevo o script que gera o banco
  (Piper offline ou Google Cloud) e o player. A geração é um passo de build único.
- *"O Google AI Studio resolve?"* — O Gemini/Google Cloud TEM TTS neural pt-BR de
  primeira; dá para gerar os áudios por lá. Mas o mais independente é gerar uma vez
  (Piper/Cloud) e embarcar — aí não depende de API em runtime.
- *"O repo de 32 fonemas do Kaggle resolve?"* — Ajuda a ENSINAR o som das contínuas,
  mas NÃO monta sílaba (coarticulação/oclusivas). Não é a solução completa sozinho.
- *"Qual a melhor alternativa?"* — Banco de SÍLABAS+palavras pré-gerado com TTS neural
  (Fase 1). É o que dá voz nativa, offline, sem gravação manual, e escala para todas as
  matérias (inglês, números, ciências usam o mesmo player).

## 5. Fontes
- Piper (rhasspy) — TTS neural local, offline, MIT, vozes pt-BR: https://github.com/rhasspy/piper · vozes: https://github.com/rhasspy/piper/blob/master/VOICES.md
- Voz pt-BR "faber" (Hugging Face): https://huggingface.co/Trelis/piper-pt-br-faber-medium
- Amostras Piper: https://rhasspy.github.io/piper-samples/
