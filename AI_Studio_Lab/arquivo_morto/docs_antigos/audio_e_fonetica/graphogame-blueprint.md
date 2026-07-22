# 🧬 Blueprint: engenharia reversa do GraphoGame + alfabetização fônica pt-BR

*O documento-mestre dos exercícios de leitura. Como o GraphoGame funciona por dentro,
a sequência CORRETA do português brasileiro com TODAS as nuances (não só o CA/CE/CI),
a anatomia de um exercício bem-feito, e como construir cada um no nosso motor.*

---

## 1. O que o GraphoGame é (a pesquisa, não achismo)

GraphoGame nasceu do Estudo Longitudinal de Dislexia de Jyväskylä (Finlândia, Profa. Ulla
Richardson). É **fônica sintética**: o SOM (fonema) é apresentado PRIMEIRO, e a criança
aprende a acoplar grafema↔fonema, começando pela conexão letra-som ANTES de unidades
maiores (sílaba → palavra). O motor é **adaptativo e individual**: foca exatamente no ponto
fraco de cada criança, com repetição espaçada dos erros. Exposição alta, curta e lúdica.
*(Fontes no fim.)*

**A tradução pro nosso projeto:** nosso motor adaptativo + revisão espaçada JÁ é o cérebro
do GraphoGame. Falta só (a) o CONTEÚDO na sequência certa e (b) a ANATOMIA certa de cada
exercício. É o que este doc define.

## 2. A anatomia de UM exercício (o "trial") — o loop reverso-engenheirado

Todo exercício fônico do GraphoGame é um ciclo curtíssimo, sempre igual (previsibilidade =
segurança pra criança):

1. **O SOM toca primeiro** (o alvo: um fonema, uma sílaba ou uma palavra). A criança NÃO
   precisa ler para começar.
2. **Aparecem as opções** (2 a 4 letras/sílabas/palavras). Poucas.
3. **A criança pode reouvir** o alvo quantas vezes quiser (botão 🔊) — e OUVIR cada opção
   (🔊 por opção — já implementei isso).
4. **Ela toca na opção** que casa com o som.
5. **Feedback imediato:** certo → som alegre + avança rápido (< 1s). Errado → a certa
   brilha, voz gentil ensina o porquê, tenta de novo. Nunca "trava".
6. **Adaptação:** o que ela erra volta espaçado; a dificuldade sobe/desce sozinha.

**Duração:** cada trial = 3-8 segundos. Sessão = muitos trials curtos, não poucos longos.
**Regra de ouro:** a criança está SEMPRE no controle do ritmo (pode pular tocando na tela).

## 3. A SEQUÊNCIA correta do português brasileiro (a espinha — com TODAS as nuances)

O português é *quase* transparente, mas tem armadilhas que, ensinadas fora de ordem, "bugam
a cabeça" da criança (exatamente o que o Zeus intuiu). A ordem certa, uma novidade por vez:

### Fase 0 — Consciência fonológica (4 anos, SEM letras) — *Benjamin*
Rimas → aliteração (mesmo som inicial) → sílabas (palmas) → contar/segmentar sílabas →
juntar sílabas ditas → som inicial → som final. *(Já temos: Caça-Rimas, Palminhas.)*

### Fase 1 — Vogais
A, E, I, O, U (os 5 sons orais). As abertas/fechadas (É/Ê, Ó/Ô) ficam pra MUITO depois.

### Fase 2 — Consoantes, na ORDEM DE FACILIDADE (não alfabética!)
1. **Regulares de correspondência 1:1** (uma letra = um som, sempre): **P, B, T, D, F, V, M, N, L**.
   Começar por essas dá vitórias fáceis e nenhuma exceção.
2. **Contínuas** (dá pra "cantar" o som, ótimas pra fusão): F, V, M, N, L, S, R, Z, J.
3. Só depois as de **múltiplos sons** (as armadilhas da Fase 5).

### Fase 3 — Sílabas CV + famílias silábicas
Juntar consoante+vogal (PA), depois a família inteira (PA-PE-PI-PO-PU). *(Temos: Fábrica de Sílabas.)*

### Fase 4 — Palavras CVCV transparentes
BOLA, CASA, PATO — só padrões já dominados (palavras decodáveis). *(Temos: começo disso.)*

### Fase 5 — AS ARMADILHAS (uma de cada vez — o que o Zeus pediu: "som do R" etc.)
Estas são as "Manhas do Português". Cada uma vira uma trilha/nível próprio, ensinada por
CONTRASTE (ouvir os dois casos e classificar), NUNCA misturada no começo:

| Armadilha | A regra | Exemplo |
|---|---|---|
| **C duro/brando** | /k/ antes de A,O,U · /s/ antes de E,I | CASA vs CEBOLA |
| **G duro/brando** | /g/ antes de A,O,U · /ʒ/ antes de E,I | GATO vs GELO |
| **Ç** | sempre /s/, só antes de A,O,U | LAÇO, AÇÚCAR |
| **GU/QU com U mudo** | GUE,GUI / QUE,QUI = U não soa; GUA,QUA = U soa | GUERRA vs ÁGUA · QUEIJO vs QUADRO |
| **R forte × brando × travado** | forte (início, RR, após N/L/S) · brando (entre vogais) · travado (fim de sílaba) | RATO · caRo · poRta/maR |
| **RR** | sempre forte, entre vogais | CARRO |
| **S com som de Z** | /s/ (início, SS, após consoante) · /z/ (entre vogais) | Sapo/paSSo vs caSa |
| **X (o mais difícil)** | /ʃ/ (Xícara,caiXa) · /s/ (próXimo) · /z/ (eXame) · /ks/ (táXi) | 4 sons! deixar por último |
| **Dígrafos** | CH /ʃ/ · NH /ɲ/ · LH /ʎ/ (duas letras, um som) | CHAVE, NINHO, FILHO |
| **Nasais** | M/N no fim nasaliza · ÃO, ÃE, ÕE, til | BOM, PENTE, MÃO, PÃES |
| **Sílabas travadas (CVC)** | consoante fecha a sílaba | POR-TA, MAR, CAS-CA |
| **Encontros consonantais (CCV)** | duas consoantes juntas | BRA-ÇO, PLA-CA, TRA-TOR |
| **Ditongos/hiatos** | duas vogais juntas (ou separadas) | PAI, PEIXE · SA-Ú-DE |
| **Pares surda/sonora** | discriminação fina (vibra ou não a garganta) | FACA/VACA, PATO/BATO, TIA/DIA |
| **Letras-espelho** | confusão VISUAL (não fonética) | b/d/p/q |
| **Vogais aberta/fechada** | mesmo grafema, dois sons | avÓ/avÔ, sÉ/sÊ |

**Este é o mapa completo das nuances.** Cada linha = uma "manha" ensinável por contraste
auditivo. É por isso que o TTS que fala a SÍLABA/PALAVRA inteira acerta tudo isso sozinho —
ele já sabe as regras. O que falta é ENSINAR a regra à criança, na ordem acima.

## 4. Como construir CADA tipo de exercício (a receita, no nosso motor)

Regras universais de construção (valem pra TODA matéria, resolvem os bugs que o Zeus viu):
- **Som primeiro, sempre.** O enunciado falado abre; a instrução "como fazer" só na 1ª
  questão da trilha (depois vai direto — já implementei).
- **Nunca mostrar a resposta no enunciado.** (Ex.: completar palavra mostra o emoji 🏠,
  não "CASA" escrito — já corrigi; revela a palavra só ao acertar.)
- **Opções audíveis** (🔊) pra escolher por ouvido — já implementei em sílabas/ditado.
- **Feedback:** curto ao acertar (mais curto ainda em sequência); explica o porquê só ao
  errar; sempre pulável tocando na tela.
- **Uma tarefa por tela.** Nada de duas perguntas. Áudio nunca encavalado
  (`speechSynthesis.cancel()` antes de cada fala — já implementei).

Receita por exercício de leitura:
- **Caça-Rimas 🎵:** ouve a palavra-alvo → 3 imagens → toca a que rima (por som).
- **Palminhas 👏:** ouve a palavra segmentada → conta as sílabas.
- **Fábrica de Sílabas 🏭:** ouve o alvo → junta CV (animação das letras se aproximando) →
  escolhe a sílaba por som (opções audíveis). N5 = completa palavra (esconde/revela).
- **Ditado Mágico 🔊:** ouve a palavra → acha entre pares mínimos (BOLA/BOTA/BOCA).
- **Leitor Veloz 🚀 (Heitor):** Palavras-Relâmpago (as 100 mais frequentes piscam),
  Cola-Sílabas (blending acelerando), leitura em eco, Livrinhos decodáveis.
- **Manhas do Português 🇧🇷:** cada armadilha da Fase 5, por contraste (ouve → classifica).

## 5. Áudio: a decisão final (encerrando o assunto da voz)
1. **Agora:** TTS do navegador falando SÍLABA/PALAVRA inteira — pronuncia CA/CE/CI, R, nasais
   TUDO certo (o hack de fonemas do Gemini é que buga; não usar).
2. **Upgrade (voz natural):** banco de áudio neural pré-gerado — script pronto em
   `docs/solucao-fonetica-graphogame.md` (Google Cloud/Gemini TTS, offline, sem gravar).
3. **Futuro:** voz da família por cima do banco.

## 6. Quais habilidades esse app exige (a pergunta do Zeus)
Um app educacional de elite mistura: **design instrucional / LX** (experiência de
aprendizagem), **ciência da leitura** (fônica), **UX de primeira infância** (carga
cognitiva, previsibilidade, alvos grandes), **animação** (Framer Motion / SVG por código),
**engenharia de áudio** (TTS + banco + sincronia), **algoritmo adaptativo** (ZDP + repetição
espaçada — já temos), **arquitetura de software** (motor agnóstico + cartuchos — já temos),
e **acessibilidade**. A boa notícia: o mais difícil (o motor adaptativo) já existe. O que
falta é disciplina de CONTEÚDO e de ANATOMIA de exercício — este doc é o guia.

## 7. Inventário atual do Português (pra você SABER o que existe)
- **Pré (Benjamin):** Caça-Rimas 🎵 (N1-5: rima óbvia→sutil), Palminhas 👏 (N1-5: 2→4+ sílabas),
  Sons Mágicos 🔤 (Fases 1-2: N1-2 som das vogais · N3 1ª letra com vogais · N4 1ª letra
  com consoantes regulares · N5 pares surda/sonora F/V, P/B, T/D — tudo TTS-seguro:
  vogal isolada ou palavra inteira, nunca consoante isolada).
- **Ano 1 (Heitor):** Sons Mágicos 🔤 → Fábrica de Sílabas 🏭 (N1-3 fusão visual `blend` ·
  N4 reconhecer por som · N5 completar palavra) → Ditado Mágico 🔊 (N1-5: pares mínimos).
  O grafo: sons → sílabas → ditado (prereqs declarados).
- **Falta construir (do catálogo):** Fábrica de Palavras, Leitor Veloz completo,
  Manhas do Português (Fase 5 completa — o N5 dos Sons Mágicos é só a entrada).
- **Seletor de nível 🎯 feito** (badge no card → modal com habilidade + amostra por nível).

---

## 8. Fontes da pesquisa
- The GraphoGame Method (Richardson & Lyytinen, Univ. Jyväskylä): https://jyx.jyu.fi/bitstreams/e288b6b1-d7e1-4c45-bdd5-5d55678f81da/download
- GraphoGame — evidência científica: https://graphogame.com/evidence/
- Estudo Longitudinal de Dislexia de Jyväskylä (JLD): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4624816/
- RCT GraphoGame Rime (Frontiers in Education, 2020): https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2020.00132/full
- Fônica em ortografia transparente (Studies in Psychology, 2014): https://www.tandfonline.com/doi/abs/10.1080/02109395.2014.974424
