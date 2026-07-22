# 🎙️ Luna Studio — inventário, o que falta roteirizar e o plano de lotes

*Estudo do repo `dyegorodrigues/Luna-Studio` (2026-07-15). O app está bem construído:
retry com backoff, cache em disco, fallback, filtros por categoria e geração manual
item a item — perfeito para lotes. O que travou foi a COTA GRÁTIS da API (429 diário),
não o código. Com billing na chave, volta a funcionar.*

## 1. Inventário atual (db.json: 39 itens · 1 gerado)

| Categoria | Itens | Natureza |
|---|---|---|
| fonemas | 18 (1 ✅ `fon_a`) | narrações de ensino ("O som da vogal A é... aaa!") — vogais, nasais, C/G duro-brando, R forte/brando, LH/NH |
| silabas | 6 | "Juntando o B e o A, forma... BA" (inclui regra do CE e CCV `pra`) |
| palavras | 8 | "Pato. Pa-to." com frase-contexto |
| instrucoes_e_feedbacks | 7 | boas-vindas, acerto ×2, erro, instruções de dinâmica |

**Descoberta importante:** esses textos são a **Camada A (narrações de ensino)** — o
áudio do *momento 0* (introdução de trilha) e das explicações. Excelentes. O que falta
escrever é a **Camada B (sons crus)** que toca DENTRO dos exercícios.

## 2. ✅ FEITO: `docs/audio_e_fonetica/luna-import-completo.json` — 210 itens prontos

Escrevi TUDO que faltava, no formato exato do import do Luna: 7 vogais secas +
75 sílabas secas + 60 palavras do app + 28 números + 8 feedbacks curtos + 25
introduções de trilha (Camada A dos momentos 0) + regras respeitadas (nenhuma
consoante oclusiva isolada; sons crus em `pureSoundMode` com tom fônico).

**Como importar (2 jeitos):**
1. Pela interface do Luna: menu de configurações → Importar JSON → colar o conteúdo
   do arquivo (o campo aceita o objeto `{"assets": [...]}`).
2. Por comando (no terminal do AI Studio, com o Luna rodando):
   `curl -X POST http://localhost:3000/api/assets/import -H "Content-Type: application/json" -d @luna-import-completo.json`

Depois de importar, os 210 aparecem como "pending" nos filtros por categoria —
gerar pelos lotes do §4.

## 2b. O que ficou de fora de propósito

**Camada B — sons crus (curtos, secos, sem narração):**
- ~100 sílabas CV secas: "pa", "pe"... (p,b,t,d,c,g,m,n,l,r,s,v,f,j,z × a,e,i,o,u)
- ~40 palavras secas do app: bola, casa, sapo, pato... (bancos de port.ts)
- números falados 1–20 + dezenas (10,20...90)
- feedbacks de 1 palavra: "Isso!", "Muito bem!", "Quase!", "Tenta de novo!"
- vogais secas: "a", "é", "ê", "i", "ó", "ô", "u"

**Camada A — introduções que faltam (1 por trilha do app):**
- Sons Mágicos 🔤 · Fábrica de Sílabas 🏭 (blend) · Amigos dos Números 🤝 (bond) ·
  Moldura de 10 🔟 · Detetive 🕵️ · Vivo ou Não 🌱 · Inglês (em inglês!) · Desafio Misto 👑

## 3. Regras de qualidade (aprendidas a caro)

1. **Consoante oclusiva (P,B,T,D,C,G) NUNCA em `pureSoundMode` isolado** — coarticulação
   torna impossível; o resultado é "buh"/"bê" robótico. Contínuas (S,R,F,V,M,N,L,Z,CH)
   podem ("ssss", "rrrr"). Nas narrações (Camada A) tudo bem: o som vem ancorado em palavra.
2. **Formato final no app: MP3 mono ~48kbps com silêncio aparado** (o WAV de 24kHz saiu
   com 970KB para UM som; 130 assim = ~130MB. Em MP3 aparado: ~2-3MB o banco todo).
   Eu converto quando os WAVs chegarem.
3. Se com billing o erro virar 404/NOT_FOUND: atualizar o nome do modelo
   (`gemini-3.1-flash-tts-preview` é preview e pode ser renomeado).

## 4. Plano de LOTES (gerar aos poucos, sem estourar cota)

Lotes de **8–10 itens**, esperando ~1 min entre lotes. Ordem por VALOR no app:

| Lote | Conteúdo | Por quê primeiro |
|---|---|---|
| 1 | 7 instruções/feedbacks existentes | usados em TODA missão, qualquer matéria |
| 2 | 6 sílabas + 8 palavras existentes | miolo da alfabetização (trilhas já no ar) |
| 3 | vogais (7 fonemas de vogal + nasal) | Sons Mágicos N1-3 usa direto |
| 4-5 | Camada B: feedbacks curtos + vogais secas + primeiras 20 sílabas secas | trials |
| 6+ | resto das sílabas secas, palavras secas, números | completa o banco |
| último | fonemas narrados de consoante (C/G/R/LH/NH) | úteis nas Manhas do Português (trilha futura) |

**Fluxo:** Zeus gera lote no Luna (filtro por categoria → botão por item) → baixa ZIP
(`/api/assets/download-zip`) → me traz → eu converto p/ MP3, plugo em `public/audio/`
e ligo o fallback. Cada lote já melhora o app no dia.

## 5. Melhorias de código do Luna (aguardando autorização do Zeus)

O checklist do próprio Luna diz que só atualizo o repo dele com autorização explícita.
Se autorizado, eu faria: (a) modelo TTS configurável por env; (b) UI respeitar o
`retryDelaySec` do 429 (botão "aguarde Xs" em vez de deixar tentar de novo à toa);
(c) botão "gerar lote" com fila espaçada automática (8 itens, 10s entre eles);
(d) export direto no formato do Matemágica (MP3 + nomes `public/audio/<id>.mp3`).
