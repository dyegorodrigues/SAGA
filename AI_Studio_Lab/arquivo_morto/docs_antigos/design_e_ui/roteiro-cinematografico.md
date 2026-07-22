# 🎬 Roteiro Cinematográfico — o app cena a cena, como a criança vive

*Este documento existe para o Zeus ENXERGAR o app sem abrir o código: o que aparece,
o que a voz fala, onde a criança toca, o que acontece. Legenda: ✅ já funciona assim
hoje · 🔮 planejado (o "momento 0"/animações — áudio já roteirizado no Luna).
A anatomia por trás de cada cena: `arquitetura-pedagogica.md`.*

---

## ATO 1 — O primeiro minuto da vida no app

1. **Abre o app** → tela de login (Google ou visitante). Pais logam UMA vez. ✅
2. **Tela de perfis:** os cartões do Heitor e do Benjamin, com avatar e mascote. A
   criança toca no SEU cartão (botão dos pais discreto embaixo). ✅
3. **Home da criança:** no topo, "Oi, Benjamin! 🦖" + moedinhas 🪙 + fogo de streak 🔥.
   O CARTÃO DO MASCOTE (tamagotchi: energia, humor, botão alimentar). Abaixo: a
   "Jornada Mágica" (missão recomendada pelo motor), o Desafio Misto 👑 (1×/dia), e as
   trilhas agrupadas por matéria, cada card com bolinhas de nível e o badge 🎯. ✅
4. **🔮 Primeira vez NA VIDA numa trilha:** antes da 1ª questão, a Luna apresenta o
   conceito (voz `intro_*` + animação da cena viva, 15-30s, pulável com um toque).
   *Hoje:* a apresentação é só o `howto` falado na 1ª questão. O upgrade é o motor de
   introduções.

## ATO 2 — Um trial (a batida universal de TODO exercício) ✅

```
[VOZ fala o enunciado]  →  criança pode: tocar no balão 🗨️ (reouve) ·
tocar na frase 🔊 (reouve) · tocar no 🔊 de cada opção (ouve a opção)
        ↓ toca numa opção
ACERTOU: som alegre + "Isso!" curto (em sequência, mais curto ainda) +
         +1⭐ +1🪙 → transição em 250ms (ou toca na tela e pula na hora)
ERROU:   a certa BRILHA + a voz ENSINA a estratégia (explain) + selo 🧠
         (a questão volta depois, espaçada, até 2 acertos = dominada)
```
A criança NUNCA fica presa: tocar na tela corta a voz e avança. 8 questões por
missão (10 no Desafio), 2 primeiras em nível−1 (aquecimento, erro não rebaixa).

## ATO 3 — Cenas detalhadas (uma trilha modelo por matéria)

### 🔢 Contar com a mãozinha (mat pré) — O PADRÃO-OURO ✅
**TELA:** 7 dinossauros espalhados. Botão "👉 Contar comigo".
**VOZ:** "Quantos tem aqui?"
**MÁGICA:** tocando no 👉, a mãozinha PULA de dino em dino, cada um cresce e a voz
conta "um... dois... três..." — a criança VÊ a correspondência um-a-um.
**ERRO:** "Conte com o dedinho, um por um... são 7!"
*Toda trilha nova deve perseguir ESTA sensação.*

### 🔤 Sons Mágicos N1 (português) ✅
**TELA:** emoji 👂 grande + "Escute o som e ache a letra!" + 3 letrões: A, E, O
(cada um com 🔊 próprio).
**VOZ:** "Que letra faz esse som? ... a... a!" *(o som NUNCA aparece escrito — a
resposta não vaza na tela)*.
**CRIANÇA:** reouve à vontade; toca no A.
**ACERTO:** "Isso!" → próxima. **ERRO:** "Esse é o som da letra A! a!"

### 🏭 Fábrica de Sílabas N1 (português) ✅
**TELA:** as letras M e A em bolhas deslizam uma até a outra e se FUNDEM numa
bolha-mistério ❓ pulsando. Opções escritas: MA, ME, NA (com 🔊 cada).
**VOZ:** "Que sílaba nasce ao juntar? Escute: ma! Toque no ma."
**ACERTO:** a bolha ❓ REVELA "MA" em verde + ✨. **ERRO:** "M com A faz ma! ma!" e a
bolha revela a resposta (momento de ensino).

### 🤝 Amigos dos Números N2 (mat de elite) ✅
**TELA:** a cena do number bond (círculos ligados: 10 no topo, 7 num braço, ? no
outro) + moldura de 10 com 7 casinhas cheias.
**VOZ:** "Quem é o amigo do 7 para formar 10? ... Conte os espaços vazios na moldura!"
**ERRO:** "7 e 3 são amigos! 7 mais 3 formam 10!"

### 🐶 Animals N2 (inglês) ✅
**TELA:** 🇺🇸 + frase tocável "🔊 Where is the horse?" + 3 bichões-emoji, cada um com
seu 🔊 (fala "horse", "duck", "cat" em INGLÊS — ouvir até decorar).
**VOZ (en-US):** "Where is the horse?"
**ACERTO:** elogio curto em pt (de propósito: não misturar voz pt no inglês do ensino).

### 🌱 Vivo ou Não N2 (ciências) ✅ *(N4 🔮 vira ciclo da sementinha)*
**TELA:** "O que é um SER VIVO aqui?" + opções: 🐦 passarinho, ☁️ nuvem, 🪨 pedra.
**PEGA-RATÃO:** nuvem e rio SE MEXEM mas não têm vida — o erro clássico de 4 anos.
**ERRO:** "A nuvem se move com o vento, mas não nasce, não come, não cresce. O
passarinho sim: ele é VIVO!"
**🔮 N4 planejado:** cena viva da sementinha (kind `order`): semente → broto → arvorezinha
→ árvore com frutos, a criança ORDENA as etapas (adeus emojis soltos).

## ATO 4 — O RAIO-X completo (toda trilha × os 5 momentos)

*Momentos: 0=intro animada · 1=howto (como fazer) · 2=cena/visual · 3=explain (ensina
no erro) · 4=revisão 🧠 (todas têm ✅ — é do motor). Intro 🔮 = áudio JÁ roteirizado.*

| Trilha | 0 intro | 1 howto | 2 cena | 3 explain |
|---|---|---|---|---|
| **MAT PRÉ** Contar 👉 | 🔮 | ✅ mãozinha | ✅ emojis+tutorial | ✅ |
| Mais ou Menos | 🔮 | — | ✅ grupos | ✅ |
| Formas | 🔮 | — | ✅ formas SVG | 🔴 |
| Padrões | 🔮 | — | ✅ sequência | 🔴 |
| Vizinho / Soma pré / Tirar | 🔮 | — | ✅ | ✅✅🔴 |
| **MAT 1ª** Sequência/Soma/Sub/Comparar/Pular/Dezenas | 🔮 | — | ✅ (dezenas: tutorial 👉) | ✅ todos |
| Horas | 🔮 | ✅ tutorial 🧭 | ✅ relógio | 🔴 |
| Dinheiro / Problemas / Gráficos | 🔴 | — | ✅ | 🔴 *(fila)* |
| **ELITE** Amigos 🤝 / Moldura 🔟 | 🔮 | ✅ | ✅ cenas vivas | ✅ |
| **LÓGICA** Detetive 🕵️ | 🔮 | ✅ | ✅ | ✅ |
| **PORT** Rimas / Palminhas | 🔮 | ✅ | 🟡 emojis | ✅ |
| Sons Mágicos 🔤 | 🔮 | ✅ | 🟡 (cena de letra: fila) | ✅ |
| Fábrica de Sílabas 🏭 | 🔮 | ✅ | ✅ fusão blend | ✅ |
| Ditado Mágico 🔊 | 🔮 | ✅ | 🟡 | 🔴 *(fila)* |
| **ENG** Hello/Colors/Animals/Numbers | 🔮 | ✅ | 🟡 emojis | — (decisão) |
| **CIÊN** Vivo / Casas / Origem / Sentidos | 🔮 | ✅ | 🟡 emojis → cenas 🔮 | ✅ |

**Leitura do raio-X:** o motor (momentos 2-prática, 3-feedback, 4-revisão) está de pé
em tudo; os buracos são: (a) TODAS as intros são 🔮 (= o motor de introduções, próximo
grande passo, áudio pronto); (b) explains faltantes pontuais (formas, padrões, horas,
dinheiro, ditado); (c) upgrades de emoji→cena viva em ciências/português.

## ATO 5 — Onde o Luna entra em cada cena

| Áudio do Luna | Toca em qual momento |
|---|---|
| `intro_*` (25 introduções) | Momento 0 — 1ª vez na trilha 🔮 |
| `fon_*`, narrações de regra | Momento 0 e explain de leitura |
| `sil_seca_*`, `pal_seca_*`, `num_*` | Momento 2 — o som-alvo do trial (substitui TTS) |
| `feed_curto_*` | Momento 3 — elogios/consolos |
| Import: `docs/luna-import-completo.json` (210 itens) → botão de importar do Luna | |
