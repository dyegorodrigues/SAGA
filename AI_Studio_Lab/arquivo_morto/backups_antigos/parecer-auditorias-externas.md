# 🔬 PARECER: as 4 auditorias externas (Gemini 3.1 Pro) — item por item

*Análise do Claude (2026-07-18) sobre os documentos que o Zeus trouxe:
`AUDITORIA_MATEMAGICA.md`, `AUDITORIA_CONSOLIDADA_MATEMAGICA.md`,
`BACKUP_HISTORICO_AUDITORIAS_COMPLETO.md` (os 3 são o MESMO dossiê em versões — nada
divergente entre eles) e `PROPOSTAS_AVANCADAS_MATEMAGICA.md` (a visão "Motor Gênio").
Cada item foi verificado CONTRA O CÓDIGO REAL da branch oficial antes do veredito.*

**Legenda:** ✅ já existia · 🔨 CONSERTADO nesta rodada (24ª) · 🟢 ADOTAR · 🟡 ADAPTAR
(a ideia sim, a forma não) · 🔴 NÃO AGORA (bom, mas escopo/risco errado) · ❌ improcedente
(não confere no código atual)

---

## PARTE A — O DOSSIÊ DE AUDITORIA (os 3 arquivos)

### A1. Engenharia de áudio
| Achado da auditoria | Veredito | O que eu verifiquei/fiz |
|---|---|---|
| Falas se atropelam (sem fila central) | 🔨 | `speak()` reescrito: fala por FRASES em fila própria, token `SPEAK_SEQ` (fala nova mata a anterior SEM deixar "fantasma"), salvaguarda proporcional ao tamanho (a antiga era 4,5s FIXOS — era ELA que decapitava explicações longas, o bug nº1 do Zeus) |
| Voz continua após sair da tela (memory leak) | 🔨 | `stopSpeak()` no unmount do GameLoop; `advanceNow`/Journey usam `stopSpeak` (mata a fila, não só o utterance) |
| Explicação de erro cortada no meio | 🔨 | avanço agora é por `onEnd` REAL da fala + rede de segurança folgada (18s) presa à transição da própria questão |
| Tutorial "Como faz?" atropela passos | 🔨 | passos encadeados por `onEnd` (o próximo só entra quando a fala termina), com fallback por tamanho do texto quando sem som |
| AudioQueueManager como hook singleton (`useAudioEngine`) | 🟡 | a NECESSIDADE é real e já atendida dentro de `speak()`/`stopSpeak` (1 raia de voz global). Criar um hook novo com 2 raias formais + ducking é over-engineering AGORA: não temos música de fundo pra "duckar". Se um dia entrar trilha sonora, aí sim. |
| Banco de áudio neural pré-gerado (TTS Gemini/Cloud) | ✅🟢 | é exatamente o plano Luna (39 roteiros prontos, espera billing). Converge 100%. |

### A2. UX física (HCI-Kids)
| Achado | Veredito | Detalhe |
|---|---|---|
| 🔊 microscópico → criança erra sem querer e é punida | 🔨 | **TOQUE DUPLO INTELIGENTE implementado** (a melhor proposta do dossiê): em questão audível, o BOTÃO INTEIRO é o alto-falante — 1º toque OUVE + arma (anel amarelo + 👂), 2º toque na MESMA opção confirma; tocar noutra re-arma. O 🔊 virou selo indicativo sem clique. Legenda fixa: "👂 Toque para OUVIR · toque de novo para escolher". Zero punição por pontaria. |
| Alvos táteis ≥48-64px | 🟢 | opções já têm minHeight 74px ✔; falta auditar os botões PEQUENOS fora das opções (fechar, som, álbum). Entra na revisão trilha-a-trilha. |
| Spam de cliques → progresso duplo/pulo de questões | 🔨 | race REAL confirmada (2 toques no mesmo tick passavam pelo `status` nulo). Trava síncrona `answeredRef` no `handlePick`. |

### A3. Pedagogia/conteúdo
| Achado | Veredito | Detalhe |
|---|---|---|
| Elogio longo/temático toda hora quebra o flow | 🔨 | elogio temático agora SÓ no 1º acerto da missão; resto curto ("Isso!"); erro = ensino. (Convergiu com o pedido direto do Zeus.) |
| Warm-up de 2 fáceis no início da sessão | ✅ | JÁ EXISTE desde a Parte E (aquecimento nível−1, erro não rebaixa). A auditoria propôs o que já temos — validação externa do nosso desenho. |
| Botão "Pular ⏭️"/tocar no balão corta a fala | ✅ | JÁ EXISTE (7ª rodada): tocar no balão corta e avança; botão Avançar visível. |
| DayPartScene: sol "igual" não comunica manhã×tarde | 🔨 | **"Janela das Rotinas" aplicada**: manhã = sol NASCENDO (metade no horizonte) + GALO cantando ♪; tarde = sol A PINO pequeno + BOLA no quintal; noite = lua + janelas acesas + Zzz. A criança lê pela ROTINA, não pela geometria. Provado em tela. + Aulinha do daypart agora TROCA a imagem por passo. |
| GrowthScene: semente na terra sem raiz visível não comunica vida | 🟢 | procede parcialmente (estágio 2 já tem raiz; o 1 não). Ajuste barato: corte transversal com semente visível + gotinha. Fila da revisão. |
| Sílabas DUPLICADAS nas opções (GA/GA) punindo a criança | ❌🔨 | **NÃO CONFERE no código atual**: escrevi teste novo que valida unicidade DO LABEL (o que a criança vê) em 80 questões × 5 níveis × todas as trilhas de Português — passou 100%. Era a versão velha do AI Studio ou hipótese. Fica a blindagem permanente no CI. |
| Enunciados longos/abstratos ("selecione a alternativa correspondente…") | 🟡 | nossos enunciados já são curtos ("Toque na sílaba", "Quantos você viu?"), mas o Zeus reportou repetição robótica e casos ruins REAIS na Fábrica de Sílabas (sílaba falada 2×, alvo escrito quando não devia). Entra na revisão trilha-a-trilha com ouvido. |
| Fônica gradual (C/G duros antes de brandos) | ✅ | JÁ É o desenho do `graphogame-blueprint.md` (Sons Mágicos: vogais → consoantes REGULARES; as "manhas" C/G, R/RR, S/Z são módulo próprio futuro). Converge. |
| Montessori: isolar a variável (mesmo objeto nos 2 grupos do maior/menor) | 🟢 | procede e é fino: o nosso Muito ou Pouco usa EMOJIS DIFERENTES de propósito — vou trocar para MESMO emoji nos níveis 1-3 (isola quantidade) e diferentes só em níveis altos (abstração). Barato. |
| Piaget/centração: tela carregada rouba o foco | 🟢 | válido como princípio de revisão (o mascote não deve dançar durante a pergunta). Já é a direção da frente 5 (design). |
| Reversibilidade/tempo abstrato cedo demais | ✅ | converge com nossos post-mortems (geografia, Senhor do Tempo com relógio SÓ no N5). |

### A4. Arquitetura de código
| Achado | Veredito | Detalhe |
|---|---|---|
| GameLoop.tsx monolito (~1.500 linhas) | ✅🟢 | já diagnosticado por nós (Sessão 12; MascotBases já foi dividido 115→12KB). Divisão continua QUANDO atrapalhar (regra da 23ª). A auditoria confirma, não descobre. |
| Memory leaks de áudio no unmount | 🔨 | resolvido (stopSpeak no cleanup + timers de aulinha zerados por questão). |
| Firestore offline (erro "Could not reach backend") | 🟢 | procede; o SDK do Firebase tem persistência offline nativa (IndexedDB). Ativar é ~3 linhas em `firebase.ts` + testar. Entra na onda 2. |
| XState/máquina de estados formal | 🔴 | benefício não paga a reescrita agora; nosso fluxo de estados é simples (question→status→transition) e acaba de ganhar as travas. Reavaliar se a Sessão 12 mostrar necessidade. |

---

## PARTE B — AS PROPOSTAS AVANÇADAS ("Motor Gênio" V3)

| Proposta | Veredito | Parecer |
|---|---|---|
| **Dojo Kumon / Tiro Rápido** (20 contas, mede tempo de reação, sem narração) | 🟢 **ADOTAR** (onda 2) | Excelente e ORTOGONAL ao que temos: é um MODO de missão, não uma reescrita. Reusa os geradores atuais (`gen(lvl)` de soma/sub/contar), UI mínima, botões gigantes, `performance.now()`. Vira a trilha "⚡ Relâmpago" (fluência = libera memória de trabalho — a ciência está certa). Commit em lote no fim (batch), como propõem. |
| **Bar Models Singapura (arrastar barras)** | ✅🟢 | JÁ PLANEJADO por nós (Probleminhas N5 + kind `drag` no Balde 2). Convergência total — sobe de prioridade na fila da matemática. |
| **Medir TEMPO DE REAÇÃO por resposta** | 🟢 **ADOTAR JÁ** (onda 1) | Barato (já medimos `durationMs` por questão!) e destrava tudo que é inteligente depois (fluência, domínio real, relatórios). Falta só AGREGAR por trilha (média/melhor tempo) e usar no critério de Domínio 👑 ("3 seguidas no N5" → "3 seguidas RÁPIDAS no N5"). |
| **ELO substituindo níveis 1-5 + Skill Tree RPG** | 🔴 **NÃO AGORA** | O motor atual (ZDP: 3 acertos sobe / 2 erros desce + maxLvl + dom + banco de revisão) é um ELO discreto que FUNCIONA e é legível pra criança e pro pai (bolinhas). Trocar por rating contínuo = reescrever o coração testado do app por ganho marginal. O que o ELO daria de bom (granularidade) a gente pega com o tempo de reação + prereqs. Reavaliar num futuro distante. |
| **SessionOrchestrator (Warm-up/Memory/Progression agents) + botão "TREINAR AGORA"** | 🟡 **ADAPTAR** (onda 2) | A auditoria propõe com nomes novos o que JÁ TEMOS EM PEÇAS: aquecimento ✔, revisão espaçada (banco 🧠 35%) ✔, Desafio Misto 👑 diário (40% revisão + 30% pior trilha + 30% novas) ✔. O que falta é PROMOVER: um botão-herói "▶️ TREINAR AGORA" no topo da home que dispara uma missão montada pelo algoritmo (generalização do Desafio Misto, atravessando matérias, com a receita 20% fácil + resgates + fronteira). NÃO é rebuild da home — é 1 card novo em cima. As trilhas continuam embaixo para escolha livre (importante: autonomia também educa, e o pai usa o seletor 🎯). |
| **Interleaved practice / fim dos silos** | ✅🟢 | o Desafio Misto já intercala; o "Treinar Agora" estende isso ao dia a dia. Converge com a ciência (Rohrer & Taylor). |
| **Inputs multimodais anti-chute: NUMPAD digitável** | 🟢 **ADOTAR** (onda 2) | Certeiro: múltipla escolha permite chute de 25-33%. Numpad (kind `type`) tem 2+ usos claros (Dojo Relâmpago + Somar/Subtrair N4-5) = passa a regra 2 da Constituição. Drag e ligar-pontos ficam no Balde 2 como já estava. |
| **VerticalMathTutor (conta armada + material dourado sincronizado, "empréstimo")** | 🟢 **ADOTAR** (onda 3 — é a joia pedagógica do dossiê) | A tela dividida (conta armada ↔ blocos; quebrar a dezena ANIMA o riscar do número) é exatamente COMO se ensina reagrupamento hoje (CPA de Singapura). MAS é conteúdo de 2º ano (nossa Ponte/Modo Gênio) e depende do motor Aulinha (que acabou de nascer) + kind próprio. Entra como a grande construção da Fase C, DEPOIS da matemática 4-7 estar redonda. |
| **Trilha Gênesis (pré-simbólica) + downgrade invisível por competência (cego pra idade)** | 🟡 | a trilha Gênesis JÁ EXISTE = nosso M0 Meu Mundo (Muito ou Pouco, perceptual, sem números) — a auditoria não viu. O DOWNGRADE INVISÍVEL (7 anos travado em soma → recebe subitização disfarçada) é ideia BOA e barata de aproximar: o banco de revisão já injeta; dá pra ampliar com "injeção de fundamento" quando `bad` repetir na mesma habilidade (onda 3, junto do grafo prereqs da Fase C — que já ia fazer isso na direção "pra frente"). |
| **Offline-first (fila de sync)** | 🟢 | persistência nativa do Firestore (onda 2, barato). A fila manual/worker só se a nativa não bastar. |
| **Spotlight/Focus mode (fundo escuro na prática intensa)** | 🔴 | cosmético agora; frente 5 (design) decide depois. |
| **Trilhas novas: Geometria espacial (tangram/simetria/dobradura) e Hacker Lógico (comandos ao mascote)** | 🟢 backlog | ótimas, CONVERGEM com o catálogo (rotação mental é mesmo o maior preditor espacial). Entram no backlog da matemática (depois do delta atual), com trajetória pela receita de 6 passos cada. NÃO abrir agora (regra Matemática-Primeiro: terminar o que existe antes de abrir frente). |
| **Analytics ricos no Firebase (`mastery_nodes` por conceito)** | 🟡 | direção certa, dose errada: começar AGREGADO (tempo médio/habilidade no Progress atual, que já sincroniza) em vez de 1 doc por resposta (custo/rules/privacidade). Evoluir se o relatório dos pais pedir. |

---

## PARTE C — SÍNTESE E PLANO DE ONDAS (a ordem que eu recomendo)

**Veredito geral:** o dossiê é FORTE no diagnóstico de experiência (áudio, toque, flow —
quase tudo confirmado no código e JÁ corrigido nesta rodada) e AMBICIOSO nas propostas.
As grandes ideias se dividem em: (a) o que JÁ TÍNHAMOS construído/planejado com outros
nomes (warm-up, revisão espaçada, misto, bar models, M0) — validação externa boa;
(b) o que ADOTAMOS porque preenche lacuna real (toque duplo ✔ feito, tempo de reação,
numpad, Dojo, Treinar Agora, VerticalMathTutor, offline); (c) o que RECUSAMOS por ora
porque reescreve coração saudável (ELO total, XState, skill-tree-RPG como HOME).
**Regra-síntese (a mesma do dossiê ChatGPT): adotar a VISÃO, escalonar a CONSTRUÇÃO.**

- **Onda 1 (AGORA — fechada nesta rodada):** áudio redondo (fala nunca cortada, sem
  fantasma, sem vazamento) · motor Aulinha 🎬 (auto 1ª vez + botão + re-oferta após 2
  erros + aula com IMAGENS trocando + mãozinhas Somar/Tirar vivas com numeral) · toque
  duplo audível · trava anti-spam · elogio raro · Meu Dia rotinas · blindagem de labels.
- **Onda 2 (próxima):** Dinheirinho resequenciado (já era o item 2 da fila) · tempo de
  reação agregado + Domínio por fluência · numpad (kind `type`) · Dojo Relâmpago ⚡ ·
  botão "▶️ Treinar Agora" (Desafio Misto generalizado) · Firestore offline · Muito ou
  Pouco com mesmo emoji (Montessori) · GrowthScene semente visível · revisão
  trilha-a-trilha da matemática (fala/lógica/textos, com ouvido).
- **Onda 3 (Fase C ampliada):** grafo prereqs ATIVO + Modo Gênio + downgrade invisível
  (injeção de fundamento) · VerticalMathTutor (conta armada CPA) · bar models `drag`.
- **Backlog registrado:** Geometria espacial · Hacker Lógico · spotlight · XState/ELO
  (reavaliar) · analytics ricos.

## PARTE D — as 2 perguntas do Zeus (respondidas)

**1. "Gerar uma API key (Gemini etc.) pra você usar e não comer nossos créditos?"**
Honestamente: **não existe** jeito de plugar uma chave externa no MEU raciocínio — o meu
custo é da sessão Claude e chave de Gemini não paga Claude. ONDE uma chave Gemini AJUDA
DE VERDADE: (a) **Luna/áudio neural** — é O desbloqueio nº1 (banco de voz natural,
mata a voz robótica); (b) os endpoints do app (tutor 💡) que já usam; (c) eu posso
escrever SCRIPTS que chamam a API Gemini pra tarefas em lote (ex.: gerar 200 frases de
exercício e eu só revisar) — útil às vezes, mas revisar dá quase o mesmo trabalho.
Resumo: **faça o billing da chave pro Luna** — esse é o dinheiro bem gasto.

**2. "Criar um agente sem o teu contexto pra auditar sem viés?"**
Sim, sei fazer (subagente com olhos limpos, só código + telas, sem ler nossos docs).
É útil 1×/era como "QA cego". MAS o custo é alto (ele re-lê o projeto inteiro) e o
Gemini acabou de fazer esse papel de graça — e o resultado confirma que auditoria
externa acha MUITO do que já sabemos. Recomendo: guardar essa carta pra DEPOIS da onda
2 (quando o app estiver "redondo" e um olhar frio valer mais), e com escopo fechado
("jogue 10 missões e liste tudo que estranhar"), não auditoria aberta.

---
*Doc vivo até as ondas virarem código; depois ganha carimbo histórico. Fonte dos
originais: uploads do Zeus (2026-07-18), preservados fora do repo.*

---

## PARTE E — VEREDITO DO "MAB" + MEGA-ANÁLISE + acervo de didática (ZIP do AI Studio, 2026-07-19)

**Contexto:** o ZIP partiu da 23ª rodada (não continha Aulinha/áudio redondo/Compositor/
Matrícula/Dinheirinho novo). Regra aplicada: docs entram por absorção; CÓDIGO não mescla
por cima da oficial. Item a item:

| Proposta do AI Studio | Veredito | Como fica |
|---|---|---|
| Reorganização da árvore `/docs` em 7 pastas | 🔨 **ADOTADA** | aplicada na oficial com todas as referências corrigidas |
| Acervo `/docs/didatica/` (adição→frações, 9 docs + bibliografia) | 🟢 **OURO** | vira a fonte das aulinhas/Dojo/E5-E6 (a "escada da adição" com Ponte do 10 = exatamente nossa §5 do blueprint, mais detalhada) |
| "Sistema Operacional Cognitivo" / grafo de microcompetências com IDs (`M-NUM-SUBIT-01`) | 🟡 **ADAPTAR** | é a NOSSA Fase C/E4 com nomes novos: o grafo já existe (`prereqs`); os IDs estruturados entram na E4 como *tags* das trilhas — sem reescrever motor |
| 5 estados de domínio (Descoberta→Compreensão→Consolidação→Automação→Transferência) | 🟢 | mapeiam 1:1 no que existe: aulinha→CPA→abstrato→Dojo (E5)→probleminhas; adotamos o VOCABULÁRIO |
| Taxonomia do erro (contagem/recuperação/hesitação) | 🟢 | = nossa "tabela erro→microaula" (§7 do blueprint); a HESITAÇÃO (15s sem clicar → amparo sem punição) é ideia nova barata — entra na fila |
| Frustration Engine | 🟡 | metade já feita (re-oferta da aulinha após 2 erros, cool-off); falta só o gatilho de hesitação |
| Dojo em modo DUAL (algoritmo + seleção livre) | 🟢 | CONFIRMA nossa decisão da 28ª (autonomia educa); espec do E5 |
| Reestruturar `/src` em 6 camadas (core/knowledge/pedagogy/kinds/templates/ai) | 🔴 **NÃO AGORA** | as camadas JÁ EXISTEM implícitas (utils=core+pedagogy · subjects=knowledge · GameLoop=kinds); mudança de pastas em massa = risco sem ganho funcional; a divisão física acontece via Sessão 12, incremental |
| CRDT/fila offline própria | 🔴 | persistência nativa do Firestore basta (onda 2); CRDT é over-engineering |
| `/src/lib/ai` gerando conteúdo em RUNTIME | 🔴 | contraria a doutrina de IA (§7): geração é EM LOTE, lição é determinística |
| Deletar `.claude/` | ❌ **RECUSADO** | as skills de lá são ferramentas vivas do Claude Code |
| `PedagogicalEditor.tsx` (575 linhas) | 🟡 | preservado em externos/aistudio-2026-07-19; avaliar cherry-pick quando a frente de conteúdo pedir editor |

### E.1 — MEGA_ANALISE_VULNERABILIDADES, item a item (revisão honesta — 1ª passada foi compactada demais)

| § do documento | Achado | Veredito | Detalhe |
|---|---|---|---|
| 1.1 GameLoop re-renders | Estado de jogo rápido (timers/áudio) no topo da árvore React pode causar cascata de re-render; sugere Zustand/Jotai + lógica pesada fora do ciclo React | 🟡 **PARCIAL** | O sintoma é real (GameLoop é grande — já diagnosticado, Sessão 12). A CAUSA raiz nossa não é falta de state manager: já isolamos os timers de fala/aulinha em `useRef` (rodada 24, `aulaTimersRef`) — que é exatamente a técnica que a MEGA_ANALISE recomenda, só que sem precisar de lib nova. Zustand/Jotai só valeria a pena se a Sessão 12 (dividir o arquivo) não bastar sozinha — **não introduzir dependência nova preventivamente**. |
| 1.2 Offline "falso" / CRDT | Progresso pode corromper se o app fechar sem internet no meio de uma sessão | 🔴 **DESPROPORCIONAL** | Firestore já tem persistência local nativa (IndexedDB) com merge por campo — o cenário descrito (fechar no carro sem internet) é coberto por ela sem CRDT. Ativar essa persistência é a tarefa real (onda 2, já registrada); Event Sourcing é engenharia de escala de milhões de usuários, não do estágio atual. |
| 2.1 Frustration Engine (hesitação 15s + clique-metralhadora) | Sistema não percebe quando a criança trava em silêncio, só quando erra | 🟢 **ADOTAR — fila nova, concreta** | Isso é uma LACUNA REAL que não tínhamos: hoje só reagimos a erro, nunca a inação. Ação: `GameLoop` ganha um timer de 15s sem interação → dica passiva (brilho sutil na resposta certa, sem revelar) antes de qualquer erro acontecer. O "clique-metralhadora" já está coberto (`answeredRef` trava clique duplo desde a rodada 24) — falta só detectar RAJADA (3+ cliques em <1s em botões diferentes) e pausar 2s. Registrado como item novo da fila E5. |
| 2.2 Transição matemática↔leitura (word problems) | Criança pode errar problema de texto por não saber LER, não por não saber a conta — o ELO cairia injustamente | 🟢 **ADOTAR — diagnóstico correto** | Ainda não temos isso e é importante: quando os Probleminhas (N5, modelo de barras) forem trabalhados, o erro precisa DISTINGUIR "não leu" de "não calculou" — testar a mesma operação sem texto (só imagem/áudio) antes de mexer no nível de matemática. Registrado como requisito de design da trilha Probleminhas (item 5 da fila B). |
| 3.1 Explosão combinatória de sprites (aura+chapéu+armadura) | Compor variações em PNG fundido explode em milhares de arquivos | 🟢 **JÁ É A NOSSA ARQUITETURA** | Não é risco novo — é exatamente por isso que os acessórios são SVG/código por CIMA do PNG do mascote (regra de arte do CLAUDE.md: "efeitos/animações por código POR CIMA", "SVG só para acessórios"). O documento redescobriu uma decisão que já é lei da casa. |
| 3.1 Filtro de daltonismo (protanopia) na Moldura de 10 | Bolinhas vermelho/azul podem ser indistinguíveis pra criança daltônica | 🟢 **ADOTAR — achado genuinamente novo** | Isso NINGUÉM tinha levantado antes e é barato de corrigir: a Moldura de 10 e outras cenas que usam vermelho/verde como ÚNICA distinção devem ganhar uma 2ª pista (forma, borda, ícone) — não só cor. Registrado como item de acessibilidade na revisão trilha-a-trilha (item 6 da fila B). |
| 4.1 Telefone-sem-fio multi-IA + proposta de `npm run test:pedagogy` | Claude pode refatorar sem entender a didática por trás e quebrar algo pedagogicamente fino | 🟡 **PARCIAL — mecanismo já existe, nome não** | A intenção já é atendida pela nossa cinta de testes (`generators.test.ts` valida contrato+coerência aritmética de TODA trilha após qualquer mudança, é rodada sempre) e pelo `blueprint`/`parecer` como fonte de verdade pedagógica que eu releio antes de decidir. Não vou criar um script batizado `test:pedagogy` separado — seria duplicar o que `npm run test` já faz. A trava "não refatorar `/docs` e `/subjects` sem ler o changelog" fica registrada como prática, não como bloqueio técnico (eu já leio `sala-de-situacao.md`/`CLAUDE.md` no início de cada sessão). |

### E.2 — As 3 "Próximas Fronteiras" (§5) — ideias novas, não diagnóstico. Vereditos individuais:

| Ideia | Veredito | Parecer |
|---|---|---|
| **Regulação emocional / respiração guiada** ("cheire a flor, assopre a vela" quando o Frustration Engine detectar ansiedade) | 🟢 **ADOTAR, pequeno** | Uma vez que o gatilho de hesitação existir (E.1 acima), a intervenção pode ser essa respiração de 10s em vez de só "dica passiva" — é uma variante de UI, barata, e cientificamente correta (regulação antes de reensinar). Entra JUNTO com o item de hesitação, não como frente própria. |
| **"Banco da Luna" — juros/gratificação adiada com moedinhas** | 🔴 **NÃO AGORA, mas não descartada** | Contraria uma decisão explícita da Constituição: 🪙 moedinhas são a moeda GASTÁVEL simples (economia dupla, regra pedagógica "sem punição/sem complexidade financeira precoce"). Introduzir juros é um conceito de educação financeira avançado (mais adequado a 8-10 anos) que hoje NÃO está na fila (estamos em Matemática-Primeiro, 4-7 anos como prioridade). Fica registrado como ideia de expansão futura pro módulo de Educação Financeira (quando existir), não pra economia central do app. |
| **Painel dos pais preditivo** ("Benjamin tem dificuldade em X, sugerimos Y; ele rende melhor de manhã") | 🟢 **ADOTAR — converge com decisão da 28ª** | Isso é a continuação natural do que já decidimos (feedback estruturado dos pais alimentando o Compositor, 28ª rodada) MAS na direção INVERSA: o app INFORMA o pai com base no `rt`/`lastDay`/banco de erros que já coletamos (E1). É barato porque os dados já existem — falta só a UI de relatório. Registrado como extensão do ParentDashboard na E4/E5, junto do campo de feedback. |
