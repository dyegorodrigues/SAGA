# 🗺️ Sala de Situação — o painel vivo do projeto

*"Sala de situação" = a sala de onde um general enxerga a guerra inteira num mapa só.
Este arquivo é isso: abre ele e vê o estado de TUDO — as frentes, o que anda, o que
está travado e QUEM destrava. Eu (Claude) atualizo a cada rodada. Se você se sentir
perdido, comece por aqui.*

**Atualizado:** 2026-07-17 · branch oficial `claude/ai-studio-github-sync-889al1` · 337 testes ✅

> 🧭 **VIRADA ESTRATÉGICA (Zeus, 2026-07-17):** paramos de CRIAR matéria nova. Foco =
> **terminar a Matemática INTEIRA primeiro** (auditar + completar cada trilha), depois
> arquitetar as próximas matérias uma a uma. A geografia v2 (abaixo) foi a última peça
> "de fora da Matemática" — nasceu de pedido explícito e já estava em voo.

---

## As 6 frentes

| # | Frente | Estado | Próximo passo | Destrava quem? |
|---|---|---|---|---|
| 1 | **Conteúdo & pedagogia** (exercícios, trilhas, GraphoGame) | 🟢 andando — 6 matérias, geografia v2 (viagem) NO AR | **FOCO NOVO: TERMINAR A MATEMÁTICA inteira** (auditar+completar cada trilha) antes de mexer noutra matéria | **Claude** |
| 2 | **Áudio** (voz natural — Luna Studio) | 🔴 travada: cota grátis 429; 39 roteiros prontos, 1 gerado | **Zeus: billing na chave API** → gerar em lotes (plano em `luna-roteiro-audios.md`) | **Zeus** |
| 3 | **Arte** (sprites + cenas SVG) | 🟡 2 pipelines plugáveis prontos: mascote (PNG) + **cenas (SVG)**. 8 cenas `place-*` novas (geografia) provadas em tela | Zeus gera folhas de sprite E/OU SVGs de cena (manifesto em `mapa-de-cenas-svg.md`) → largar na pasta, troca sozinho | **Zeus** |
| 4 | **Código limpo** (Sessão 12) | 🟡 MascotBases ✅ (115→12KB); faltam GameLoop/Mascot/ParentDashboard/MascotEvolution | continuar divisão + useGameEngine | **Claude** |
| 5 | **Design visual do app** (home, hierarquia, tamagotchi) | ⚪ fase futura declarada (crítica anotada: amador/pequeno/carregado) | auditoria tela a tela QUANDO conteúdo estabilizar | Claude (fase própria) |
| 6 | **Multi-IA & memória** | 🟢 operando — branches separadas, CLAUDE.md = memória viva, docs = SD persistente | manter o ritual | ambos |

## Checklist do Zeus (ações fora do meu alcance)

- [ ] **Billing na chave da API Gemini** (assinatura consumidor NÃO libera a API — conferir no AI Studio/Cloud) → destrava a frente 2
- [ ] **AI Studio puxar a branch oficial** (`git reset --hard origin/claude/ai-studio-github-sync-889al1`) → sem isso você testa versão VELHA
- [ ] Firebase Console: rules publicadas = repo · Anonymous ativo
- [ ] Apagar branch `Fork` (GitHub UI)
- [ ] Testar 4 vitais no aparelho (voz · selo 🧠 · progresso persiste · álbum)
- [ ] Gerar folhas de sprites definitivas (verde-chroma, personagens separados)
- [ ] Luna: quando billing ativo, gerar lotes e me trazer os WAVs

## Ordem de execução do Claude (fila atual — NÃO ESQUECER)

**ESTRATÉGIA DOS MOTORES (aprovada 2026-07-16): construir por ALAVANCAGEM, não tudo de
uma vez.** Motor (kind) só nasce com 2+ usos reais esperando (Constituição regra 2).
Três baldes:
- 🟢 **Balde 1 — construir AGORA** (2+ trilhas represadas por eles): `flash`
  (subitização), framework de **tutorial guiado 👉 generalizável**, **animação de cenas**
  (motion), e **`nest`/`zoom`** (o de MAIOR alavancagem — 6+ trilhas de encaixe).
- 🟡 **Balde 2 — quando a 1ª trilha pedir** (1 uso hoje): `drag` (Fábrica de Palavras),
  `grid` (sudoku 4×4 do Detetive N4), `orbit` (Senhor do Tempo).
- 🔴 **Balde 3 — NÃO especular:** `traçar` (canvas/gesto pesado, 1 uso hipotético).

**A — Motores do Balde 1 (a rota de qualidade da interação — ✅ COMPLETA):**
1. ✅ **`flash` (subitização)** — relance ~2s → esconde (🙈) → "quantos eram?" (botão "Ver
   de novo"). Trilha **Olhômetro 👀** (mat pré+ano1), faixas por nível (1-3→5-8 com
   subgrupos), opções escondidas no relance. Reusável em Moldura de 10 / Ciências.
2. ✅ **Framework de tutorial guiado 👉 generalizado** — `src/utils/tutorials.ts`: registro
   declarativo (cada kind declara passos NARRADOS) + runner genérico no GameLoop. Botão
   "👉 Como faz?" nas cenas novas (tenframe/bond/weather/grow/daypart/emotion/lifestage/
   animal/nest). Offline, custo zero (≠ 💡 IA). Os 4 antigos com dedo animado intactos.
3. ✅ **Cenas animadas** (SVG-safe, sutil): sc-rise/sc-pulse/sc-float/sc-sway em
   Growth/Weather/DayPart. Só onde NÃO há transform de posição (armadilha SVG+CSS). O
   prefers-reduced-motion desliga tudo.
4. ✅ **`journey` (viagem narrada) + Meu Lugar no Mundo v2 NO AR** (22ª rodada). O Zeus
   aprovou a trajetória e pediu: **fora o motor de zoom complexo** → cenas prontas
   (`PlaceScene.tsx`, 8 lugares bonitos: casa→bairro→cidade→estado→Brasil→América do Sul→
   mundo→Terra) + **transição suave** (`jr-emerge`, a nova cena entra em cena). Mecânica
   = COMPOSIÇÃO ("muitas casas formam um bairro"), não inclusão de classes (que falhou 4×).
   Kind `journey` (2º uso futuro: Escada do Tempo). Provado no app real: viagem→opções
   escondidas até o fim→`explain` gentil ao errar. Cenas plugáveis (`place-*`).
   **Balde 2 (quando a 1ª trilha pedir):** `drag`, `grid`, `orbit`.

**🎯 B — PLANO MATEMÁTICA-PRIMEIRO (a fila REAL a partir de 2026-07-17):**
*Regra: nenhuma matéria nova, nenhum retoque nas outras. Cada item segue o ritual
completo (trajetória quando for conceito novo → tsc → test → build → screenshot → olhar).*
1. ✅ **Motor AULINHA 🎬 FEITO (24ª)** + ✅ **E1 telemetria (26ª)** + ✅ **E2 Compositor/MINHA AULA (27ª)**. Motor AULINHA (histórico do item): Generalizar o que
   o Contar já tem (dedo animado + narração) num sistema onde cada kind declara uma
   mini-aula VISUAL: a cena se monta passo a passo (ex.: soma = 2 maçãs entram, +3
   entram, juntam, conta uma a uma com o dedo), com voz por passo (1 fala por passo,
   `cancel()` antes de cada — o padrão anti-encavalamento do Journey). QUANDO aparece:
   automática na 1ª visita à trilha; botão "ver de novo" sempre; e o ALGORITMO re-oferece
   após 2 erros seguidos. Começar por **Contar e Somar** (numerais simples), depois
   Tirar e Dezenas. Estudar a didática de cada uma ANTES (receita de 6 passos).
2. **Dinheirinho 💰 resequenciado** (a crítica repetida do Zeus: "contar centavos com
   números grandes buga a cabeça"): N1 = o pré-conceito "100 centavos = 1 real" + contar
   moedas de 1 real (números pequenos) → N2 = cédulas redondas (2, 5, 10) → N3 = juntar
   cédulas (somas pequenas) → N4 = equivalências simples (2 de 5 = 10) → N5 = centavos
   só como INTRODUÇÃO (50¢ = metade). Prereq duro: Contar + Dezenas. Números SEMPRE
   dentro do que a criança já soma.
3. **Subtrair N5 = sentido de COMPARAÇÃO** ("quantos a MAIS?", duas fileiras alinhadas).
4. **Senhor do Tempo ⏰** (consolida o módulo Tempo): dia/noite → ontem/hoje/amanhã →
   dias da semana EM ORDEM → mês/ano → relógio no N5 (absorve Calendário + Reloginho).
5. **Miudezas do delta:** Probleminhas N5 (modelo de barras, com a ponte leitura×
   matemática do item 5b) · Formas N5 (sólidos) · Detetive N4 (grade 4×4 real, kind `grid`).
5b. **Gatilho de hesitação + rajada** (MEGA_ANALISE do AI Studio, parecer §E.1):
   15s sem toque → dica passiva (brilho sutil, sem revelar) antes de qualquer erro
   contar; 3+ cliques em <1s em botões diferentes → pausa 2s (a trava de clique
   duplo já existe desde a rodada 24; falta a RAJADA). Entra na E5.
5c. **Ponte leitura↔matemática** (parecer §E.1): quando Probleminhas usar texto,
   um erro deve DISTINGUIR "não leu" de "não calculou" — testar a mesma operação
   sem texto antes de mexer no nível de matemática. Requisito de design do item 5.
5d. **Acessibilidade de cor** (parecer §E.1, achado novo): cenas que usam vermelho/
   verde como ÚNICA distinção (ex.: Moldura de 10) ganham 2ª pista (forma/borda/
   ícone) — daltonismo. Entra na revisão trilha a trilha (item 6).
6. **Revisão trilha a trilha de TODA a matemática** (fala, lógica, interação, arte —
   com screenshot e ouvido no que a voz diz), usando o Aulinha onde couber.
7. **Fase C:** ativar grafo `prereqs` + Modo Gênio 🚀 (o `dom` já existe) — a porta do
   2º ano (reagrupamento, multiplicação como grupos, frações com pizza). Painel dos
   pais ganha leitura PREDITIVA (parecer §E.2: "Benjamin trava em X, sugerimos Y")
   usando os dados de `rt`/`lastDay`/banco que já coletamos — junto do campo de
   feedback estruturado (28ª rodada).
*Pré-requisito técnico quando começar a pesar: Sessão 12 (dividir GameLoop) — fazer
QUANDO atrapalhar o item 1, não antes por precaução.*

**❄️ C — CONGELADOR (pausado de propósito — NADA se perde, só espera a matemática):**
- **Geografia / alfabetização cartográfica 🌎:** o que existe está NO AR e funcional
  (viagem narrada). O Zeus perdeu um dia inteiro (2026-07-17) tentando gerar
  imagens/animações SVG bonitas com várias IAs — decisão: NÃO iterar arte agora.
  Retomar DEPOIS da matemática, com calma, pela via certa (assets plugáveis `place-*`).
- **Português 📖:** próximo da fila DEPOIS da matemática (auditar Fábrica de Sílabas/
  Rimas/Palminhas/Ditado; construir Fábrica de Palavras, Leitor Veloz, Manhas). O Zeus
  quer participar do desenho.
- **Inglês 🇺🇸 · Ciências 🔬 · Meu Mundo 🌍:** no ar; só manutenção de bug. Reorganizações
  planejadas (Mundo Vivo, Meu Corpo, M0 restante) esperam no `curriculo-mestre`.
- **Áudio natural (Luna) 🎙️:** espera billing do Zeus. **Sprites do mascote 🦖:** espera
  as folhas definitivas do Zeus. Pipelines prontos dos dois lados.
- **Backlog do dossiê** (`curriculo-mestre` §Colheita): Memória, Seriação, Astronomia,
  Sociedade etc. — intactos lá.

## 🩺 DIAGNÓSTICO (2026-07-17 — por que estamos tendo tantos problemas; análise honesta)

1. **Arte estática por código tem TETO.** Eu desenho SVG funcional/didático bem, mas
   "bonito de verdade" por código-à-mão falha reiteradamente (geografia = exemplo). E
   gerar imagem com outras IAs sem pipeline definido virou um dia perdido do Zeus.
   **Regra nova: ninguém mais gasta dia em arte estática.** Fallback funcional meu +
   beleza entra pelos canais que JÁ existem: (a) **animação/interação** (meu ponto
   forte — movimento encanta criança mais que ilustração parada), (b) **assets
   plugáveis** (mascote PNG, cenas SVG — um asset por vez, com calma, quando o Zeus
   quiser), (c) sprites do mascote. Arte externa é polimento incremental, nunca bloqueio.
2. **Pedagogia pulada = retrabalho em dobro** (geografia falhou 4× por isso). A regra
   dos 6 passos + trajetória aprovada ANTES de codar já está em vigor — vale também
   para cada AULINHA (estudar como se ensina somar antes de animar somar).
3. **Multi-IA sem contrato = sobrescrita e teste de versão velha.** O Zeus passou
   semanas testando a versão ANTIGA no AI Studio. Contrato registrado no
   `fluxo-multi-ia.md`, agora com a **receita fechada do "puxar"** (+ conferência por
   hash). O AI Studio é espelho de LEITURA da branch oficial.
4. **Escopo em leque:** 6 matérias abertas com a matemática (o coração) incompleta.
   Corrigido: Matemática-Primeiro + congelador explícito acima.
5. **Dívida técnica pontual:** GameLoop.tsx gigante (~45KB) torna cada kind novo mais
   arriscado. Não bloqueia ainda; dividir quando o Aulinha esbarrar nele (Sessão 12).
6. **Voz robótica é limitação do TTS do navegador**, não bug nosso — a solução real
   (banco neural do Luna) depende do billing. Enquanto isso: caprichar no TEXTO das
   falas (curtas, naturais, sem encavalar), que é o que eu controlo.

## ✅ VERIFICAÇÃO VISUAL (o Claude CONSEGUE ver o app rodando)

Não é só teste automático: eu abro o app num Chromium de verdade, clico pelo fluxo e
tiro screenshots que EU enxergo — valido se abre, renderiza, flui, avança, não trava.
- Como: `npm run dev` (watch ligado) → `node scripts/e2e-screenshots.mjs` (usa `?e2e=1`).
- Gancho `?e2e=1` no App.tsx: entra como visitante e ignora o reset de auth do Firebase
  (inócuo em produção). Sem ele, o login trava o teste automatizado.
- Requer `npm i -D playwright-core` (Chromium já vem no ambiente).
- Ritual reforçado: mudança de UI/exercício → além de build+test, rodar screenshots e
  OLHAR antes de dar como pronto.
- **Áudio (o que EU consigo verificar):** um espião de `speechSynthesis` no harness
  captura CADA fala que o app dispara — o TEXTO, o IDIOMA (pt-BR/en-US), QUANDO começa e
  se um `cancel()` corta antes (anti-encavalamento). Pego: texto errado, idioma errado,
  fala não disparou, sobreposição. NÃO pego: se a voz soa NATURAL (isso é o ouvido do
  Zeus no aparelho). Achado: em dev a fala dispara 2× (StrictMode roda efeitos em dobro);
  inócuo — cada fala vem após um `cancel`, e em produção não duplica.

## 🔎 AUDITORIA MATEMÁTICA + PORTUGUÊS (feita 2026-07-16)

Varredura automatizada (200 questões × nível × trilha) + simulação da fala + screenshots.
- **✅ Integridade:** ZERO bugs estruturais (resposta sempre nas opções, sem duplicatas, sem prompt vazio) em toda mat+port.
- **✅ Áudio/emoji:** o `ttsText` (EMOJI_RE em Mascot.tsx) já remove emoji/setas/símbolos antes de falar — confirmado. A "voz robótica" é a QUALIDADE do TTS do navegador, não emoji → conserto = banco neural do Luna.
- **🔧 CONSERTADO:** Reloginho N3-N5 (era o pior): N3 virou relógio VISUAL (era texto), N4 a voz agora lê o problema inteiro (estava escondido), N5 troca formato 24h (cedo demais) por leitura em palavras ("6 horas", "3 e meia").
- **📌 PENDÊNCIAS (não-bugs, p/ o roadmap):** Contar sem N4-conservação/N5-conta-a-partir-de (catálogo); Português faltam Fábrica de Palavras, Leitor Veloz, Manhas do Português; `mat/onde` (espaço) e `mat/calendario` (dias) já existem e SOBREPÕEM o planejado M0 "Onde Está"/"Meu Dia" e "Senhor do Tempo" — decidir se consolida ou mantém; "Muito ou Pouco" (M0) e "Mais ou Menos" (mat) têm sobreposição perceptual.

## GOVERNANÇA DOS DOCUMENTOS (o que é vivo, fonte ou histórico — auditado 2026-07-15)

**🗺️ VISUAL:** `docs/design_e_ui/atlas.html` — o mapa visual de tudo (docs em 3 camadas + currículo
matéria→trilha com status + modelo de progressão + correções). Abrir no navegador ou
publicar como artifact. É o "organograma intuitivo" pra enxergar sem ler o código.

**🟢 VIVOS (eu atualizo; são a verdade atual):**
| Documento | Papel |
|---|---|
| `sala-de-situacao.md` | painel geral — comece aqui |
| `atlas.html` | o MAPA VISUAL (organograma dos docs + currículo + progressão) |
| **`curriculo-mestre.md`** ← novo | a HIERARQUIA: matéria→módulo→trilha→habilidade, com status e delta plano×app |
| `arquitetura-pedagogica.md` | anatomia de exercício, kinds, régua anti-exaustão, animação, erros |
| `roteiro-cinematografico.md` | o app cena a cena + raio-X trilha×momentos |
| `graphogame-blueprint.md` | sequência fônica pt-BR completa (as "manhas") |
| `luna-roteiro-audios.md` + `luna-import-completo.json` | áudio: plano de lotes + 210 roteiros prontos |
| `fluxo-multi-ia.md` | processo das 2 IAs |
| **`trajetoria-meu-lugar-no-mundo.md`** | a trajetória (6 passos) da geografia v2 — aprovada e construída (kind `journey`) |
| **`parecer-auditorias-externas.md`** ← novo | o PARECER item-a-item das 4 auditorias do Gemini (o que foi feito/adotado/adaptado/recusado) + plano de ONDAS 1-2-3 |
| **`blueprint-professor-magico.md`** ← novo | A ESCOLA: matrícula (placement) · Aula do Dia (professor exigente) · competência>idade (grafo/trilho) · tutor que ensina (conta armada). Etapas E1-E6. **AGUARDA aprovação do Zeus** |
| **`mapa-de-cenas-svg.md`** ← novo | manifesto TÉCNICO do encaixe: cada slot, estados, nome de arquivo, requisitos |
| **`brief-arte-svg.md`** ← novo | o BRIEF criativo: prompt pronto asset por asset pra pedir a arte na ferramenta externa (Zeus) e plugar sem erro |
| `CLAUDE.md` (raiz) | memória de decisões, rodada a rodada |

**📘 FONTES ESTÁVEIS (referência; mudam raramente):**
`biblia-do-matemagica.md` (visão/porquês) · `metodo-matemagica.md` (a receita de criar
trilhas) · `catalogo-atividades.md` (o detalhe [na tela] de cada trilha planejada) ·
`solucao-fonetica-graphogame.md` (verdade técnica da voz) · `mapa-mestre.md` (índice
perguntas do Zeus↔respostas).

**📦 HISTÓRICOS (carimbados no topo; preservados, NÃO usar como fonte):**
`plano-diretor-v2.md` e `roteiro-de-execucao.md` (cumpridos) · `backup-gemini-aistudio.md`
(backup preservado) · `voz-fonetica-analise.md` (superado) · `relatorio-expansao-pedagogica.md`
+ `adendo-relatorio-expansao.md` (absorvidos pelo catálogo/currículo).

**Regra de higiene:** documento novo só nasce se nenhum vivo cobrir o papel; documento
superado ganha carimbo e NUNCA é apagado (nada se perde).
