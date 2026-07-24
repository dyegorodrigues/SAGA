# CLAUDE.md — Memória permanente do projeto Matemágica

## O que é isto
Plataforma educacional adaptativa (React + TypeScript + Vite + Firebase + Gemini server-side) construída por Zeus para os filhos: **Heitor** (6→7 anos, estágio de FLUÊNCIA leitora) e **Benjamin** (4 anos, consciência fonológica). Começou como protótipo de matemática; hoje é plataforma multi-matéria com motor adaptativo próprio.

## FONTE DA VERDADE (ler antes de qualquer decisão)
- `docs/sala-de-situacao.md` — **O PAINEL**: estado vivo das 6 frentes, checklist do Zeus, fila do Claude, GOVERNANÇA dos docs (vivo/fonte/histórico). **Começar por aqui a cada sessão.**
- `docs/curriculo-mestre.md` — **A EMENTA**: hierarquia Matéria→Módulo→Trilha→Habilidade de TODO o currículo, com status (✅🟡🔧🔮) e o delta plano×app. Módulo M0 Conceitos Vitais (Meu Mundo), modelo de progressão adaptativo, reorganização de Ciências, grafo de prereqs.
- `docs/atlas.html` — **O MAPA VISUAL** (organograma intuitivo): docs em 3 camadas + currículo matéria→trilha com status + modelo de progressão + correções. Abrir no navegador / publicar como artifact.
- `docs/arquitetura-pedagogica.md` — **A ANATOMIA**: ciclo de vida dos 5 momentos de todo exercício, tabela de kinds (quando usar cada interação), matriz por idade + lacunas (espaço/tempo/numeral↔quantidade), régua anti-exaustão, cenas vivas > emojis, decisão de animação (sprites/SVG/motion), erros recorrentes estudados.
- `docs/biblia-do-matemagica.md` — visão, pedagogia, arquitetura, o porquê de tudo. **Manda em caso de dúvida.**
- `docs/metodo-matemagica.md` — **O MÉTODO** (Learning Trajectories): os 7 princípios + receita de 6 passos p/ criar QUALQUER trilha. A espinha pedagógica de tudo.
- `docs/catalogo-atividades.md` — **O CATÁLOGO**: toda trilha, por matéria/idade/nível, com o que aparece na tela + porquê + fonte. O app inteiro no papel.
- `docs/plano-diretor-v2.md` — correções técnicas e ordem de execução (Partes A-H)
- `docs/roteiro-de-execucao.md` — o passo a passo por sessões, com o comando de cada uma
- `docs/relatorio-expansao-pedagogica.md` + `docs/adendo-relatorio-expansao.md` — currículo futuro
- `docs/mapa-mestre.md` — perguntas do Zeus ↔ respostas ↔ fases A-E (índice vivo)

## A CONSTITUIÇÃO (8 regras — invioláveis)
1. Contrato do gerador é imutável: `gen(nível 1-5) → { kind, prompt, ..., options[], answer }`
2. Kind (renderizador) novo só com 2+ usos previstos
3. Lógica de matéria JAMAIS entra no núcleo/engine (motor é agnóstico)
4. Arquivo ≤ 15KB — passou, divide
5. Todo gerador nasce com teste; `npm run test` após toda mudança
6. Nomes por convenção (`materia/trilha`, assets `tema-estagio.png`)
7. Toda trilha nova declara `prereqs` (continuum vertical)
8. Tema transversal (financeira, civismo) = fio em matérias existentes, não ilha

## INVARIANTES DE SEGURANÇA (o banco já abriu 2× — nunca mais)
- Firestore: acesso SOMENTE autenticado (Google/anônimo), cada uid só no próprio doc, resto negado. **Verificar as rules após toda sessão de IA.**
- Endpoints Gemini (server.ts): exigem token + rate limit por usuário.
- Voz de criança: processada na hora, NUNCA gravada/armazenada.

## REGRAS DE ARTE (lições pagas caro)
- Personagem = **PNG com transparência REAL** (512×512, centralizado, margem 10-15%), gerado fora; efeitos/animações por código POR CIMA.
- **PROIBIDO PARA SEMPRE:** JPG, fundo preto, `mixBlendMode: screen`, remoção de fundo em tempo real, desenhar personagem completo em SVG à mão.
- SVG só para: acessórios, cenários, ícones, efeitos.

## REGRAS PEDAGÓGICAS INEGOCIÁVEIS
- Nada pune. Mascote nunca morre/adoece/regride. Erro vira revisão 🧠, não castigo.
- Economia dupla: ⭐ XP vitalício (nunca se gasta) / 🪙 moedinhas (gastáveis).
- Anti-vício: sessões curtas, limite gentil. Neutralidade absoluta em temas sociais.

## FLUXO DE TRABALHO
- **Um pedido = UMA mudança.** Nunca refatorar/adicionar por conta própria.
- Ritual pós-mudança: `npm run build` ✅ → `npm run test` ✅ → 4 vitais no app (voz fala · selo 🧠 aparece · progresso persiste ao reabrir · álbum abre) → commit com nome do passo.
- Sessão interrompida no meio = próxima começa com verificação de integridade.

## ESTADO ATUAL / PRÓXIMO PASSO (atualizado 2026-07-11, Claude Code)
**Sessões 0-9 + faxina parcial (11) CONCLUÍDAS** (branch `claude/ai-studio-github-sync-889al1`; ver commits `sessao-*`):
- ✅ 0 Integridade · ✅ 1 Segurança do banco (código; rules do repo fechadas) · ✅ 2 Endpoints (verifyIdToken + rate limit 20 tutor/5 relatórios por dia/uid) · ✅ 3 Testes (vitest; 104 testes; pegou 2 bugs no Reloginho)
- ✅ 4+5 Arte: `DragonMascot.tsx` = dragão SVG oficial em 5 estágios (6 lições da Escola SVG; validado por screenshot). Gambiarras MORTAS: TransparentMascotImage, 10 JPGs (-2,6MB), alternador Vetor/3D, mixBlendMode. PNGs definitivos são plugáveis: basta salvar `dragao-1-ovo.png`… em `src/assets/mascotes/` (ver README lá) que o app troca sozinho via `mascotAssets.ts`.
- ✅ 6 Economia dupla: `State.coins` 🪙 (1/acerto + 3/missão + 5 primeira do dia; migração de wallet); ⭐ = XP puro (1/acerto + 5 perfeita); marcos 15/75/250/700; gastos (álbum/cenários/ração 2🪙) debitam coins. Fixes: XP em dobro, bônus de missão perfeita nunca disparava.
- ✅ 7 Tamagotchi: humor pelo streak (feliz/sonolento/com saudade — só frases/animação), barra única de energia (alimentar +25, decai 25/dia, min 0), ração grátis 1/dia pela primeira missão, brincar/dormir cosméticos. Nunca pune.
- ✅ 8 Aquecimento: 2 primeiras questões em nível−1, erro nelas não rebaixa. ✅ 9 Desafio Misto 👑: card 1×/dia, 10 questões (40% revisão + 30% pior trilha + 30% aleatórias), coins ×2 (`utils/mixedChallenge.ts`, com testes).
- ✅ 11 (parcial): codemods da raiz deletados, AdminGodPanel atrás de `import.meta.env.DEV`, package renomeado "matemagica".

**AÇÕES DO ZEUS (fora do código):**
1. Console Firebase: conferir rules publicadas = `firestore.rules` do repo; Anonymous ativo em Sign-in method.
2. Apagar branch `Fork` no GitHub (UI → Branches; deleção via git é bloqueada no ambiente remoto).
3. Testar as 4 vitais no aparelho real (voz · selo 🧠 · progresso persiste · álbum) + roteiro UX da Parte F (10 min) e me trazer a lista do que falhar (= Sessão 10).
4. Fazer merge da branch na `main` quando aprovar (ou pedir que eu abra PR).

**ATUALIZAÇÃO (mesmo dia, 2ª rodada):**
- ✅ Sessão 10 (1ª leva, bugs reportados pelo Zeus): parede invisível no PickScreen (overflow-x-auto recortava o mascote flutuando), título do estágio quebrado no card do pet, preview de cenário cortado (scale-150).
- ✅ ERA DO CONTEÚDO INICIADA: `src/subjects/` criado. Português 📖 no ar com 4 trilhas (Caça-Rimas 🎵 + Palminhas 👏 pré / Fábrica de Sílabas 🏭 + Ditado Mágico 🔊 ano1), método fônico GraphoGame, sílaba como unidade de voz, prereqs no contrato (`Track.prereqs`), registro `SUBJECTS`, home agrupada por matéria. 126 testes (inclui validação fonológica). Motor intocado — prova da arquitetura.
- 📖 `docs/mapa-mestre.md` = perguntas do Zeus ↔ respostas ↔ fases A-E. Skills `.claude/skills/nova-trilha` e `nova-materia` ativas.
- ⏰ Lembrete agendado (trigger) p/ Zeus: Firebase rules/Anonymous, apagar branch Fork, teste das 4 vitais.

**ATUALIZAÇÃO (mesmo dia, 3ª rodada — respondendo perguntas do Zeus + conteúdo):**
- ✅ 5 BOLINHAS = NÍVEIS DE DOMÍNIO: `Progress.maxLvl` (conquista nunca regride, bolinha atual pulsa) + `Progress.dom` = Domínio Absoluto 👑 (3 acertos seguidos no nível 5, coroa dourada). É o nosso "SmartScore", sem punição. LevelDots atualizado (KidHome + ParentDashboard); migração herda o nível atual.
- ✅ MATEMÁTICA DE ELITE (Singapura): `src/subjects/matElite.ts` — Amigos dos Números 🤝 (number bonds) + Moldura de 10 🔟 (subitização). Estreiam a BIBLIOTECA DE CENAS VIVAS: renderizadores SVG por código `NumberBond` e `TenFrame` em Mascot.tsx (kinds `bond` e `tenframe`). 149 testes.
- 📖 `docs/mapa-mestre.md` §§11-18: respondidas TODAS as perguntas do Zeus (bolinhas/SmartScore, Modo Gênio p/ desbloquear anos, estrutura Ciências/Filosofia/Finanças, emojis→SVG, mascotes vivos/sprite sheet, coerência do grafo de aprendizado, auditoria do algoritmo, resiliência a perda de créditos).

**ATUALIZAÇÃO (mesmo dia, 4ª rodada — documentos-fundadores do Zeus anexados + refino):**
- 📚 ANEXADOS À FONTE DA VERDADE: `docs/metodo-matemagica.md` (O MÉTODO — Learning Trajectories de Clements & Sarama; 7 princípios + receita de 6 passos + a Parte VI = prompt-mestre de pesquisa p/ criar matéria com qualquer IA) e `docs/catalogo-atividades.md` (O CATÁLOGO — toda trilha × matéria × idade × nível, com tela+porquê+fonte). São a espinha pedagógica e o app inteiro no papel.
- ✅ Amigos dos Números refinado pela progressão exata do catálogo: N5 agora é a ESTRATÉGIA MENTAL de fazer 10 (8+5 → 8+2 faz 10, sobra 3 → 13), não mais o inverso simples.

**ATUALIZAÇÃO (mesmo dia, 5ª rodada — mais conteúdo do catálogo, tudo low-risk):**
- ✅ Detetive Lógico 🕵️ (`src/subjects/logica.ts`, mat ano1): raciocínio puro em 5 níveis (qual não pertence → padrão AB/AAB → analogia visual → intruso sutil → sequência lógica), reusando kinds pattern/plain. Banco de analogias curado.
- ✅ Inglês 🇺🇸 (`src/subjects/eng.ts`): 4 trilhas TPR (Hello, Colors, Animals, Numbers). `speak()` ganhou opt `lang` (pt-BR intacto) + voz en-US cacheada; `Question.lang` + GameLoop passam o idioma. A voz fala inglês de graça. Matéria registrada no SUBJECTS. 191 testes.
- Home agora tem 3 matérias (Matemática rica / Português / Inglês), agrupadas com selo "Novo!".
- ✅ Ciências 🔬 (`src/subjects/sci.ts`): 4 trilhas de classificação (Vivo ou Não · Quem Mora Aqui/Animais e Casas · De Onde Vem · 5 Sentidos), kinds existentes. Matéria registrada. **227 testes.** Agora são 4 MATÉRIAS no ar — a prova viva da arquitetura de cartuchos (motor jamais tocado).

**ATUALIZAÇÃO (mesmo dia, 6ª rodada — AUDITORIA DE UX pedida pelo Zeus):**
- Feedback do Zeus: exercícios novos não ensinavam o que fazer nem o porquê (longe do padrão-ouro do Contar com a mãozinha 👉). O "Amigo do 10" era incompreensível até p/ adulto.
- ✅ SISTEMA: `Question.howto` (COMO fazer, falado após o enunciado via qSpeech) + `Question.explain` (o PORQUÊ, falado/mostrado ao errar sempre; ao acertar 35% pra não cansar). Wired no GameLoop.
- ✅ Amigos dos Números agora CONCRETO na moldura de 10 (conta os vazios) + voz explica "X e Y são amigos". Moldura de 10 focada só em enxergar quantidade.
- ✅ Fábrica de Sílabas: a voz narra "P com A faz... pa! Toque no pa" (o método "a voz lê o resultado"). Ciências vivo/não-vivo explica o porquê + foca no erro clássico (planta=viva). Inglês com fala curta (só a palavra-chave).
**ATUALIZAÇÃO (7ª rodada — FLUIDEZ + auditoria do AI Studio, que CONVERGIU com a minha):**
- ✅ FLUIDEZ (o item nº1 do Zeus): app não trava mais esperando a voz. Tocar na tela/balão CORTA a voz (`speechSynthesis.cancel()`) e avança na hora; botão visível "Avançar →" ao responder (`advanceRef` + `advanceNow` no GameLoop).
- ✅ EXPLICAÇÃO NA DOSE: `explain` agora SÓ ao ERRAR (momento de ensino); ao acertar, elogio CURTO ("Isso!") e ainda mais curto em sequência de acertos (streak); transição de acerto quase imediata (250ms).
- ✅ Sílabas lideram com o SOM ("Escute: pa!"); vivo/morto ganhou os "pega-ratão" (nuvem/rio/sol que se movem mas não têm vida — o erro clássico), com explicação que distingue.

**⚠️ SITUAÇÃO MULTI-IA (importante — 8ª rodada):** o Zeus rodou o Gemini no AI Studio EM PARALELO comigo, nos MESMOS problemas/arquivos. O Gemini salvou tudo em `docs/backup-gemini-aistudio.md` (preservado no repo). Convergiu com o meu trabalho, mas: (a) o Gemini foi pelo hack de fonemas TTS (`MAPA_FONEMAS_PTBR` com "íiii/úuuu") que o PRÓPRIO Zeus reportou bugado ("N acento agudo no I", "v-v-u") — NÃO importei, é a causa raiz do bug; mantido o caminho robusto (falar a sílaba inteira). (b) Cherry-pickei o que faz sentido: `bigCompleted` (esconde a palavra, revela ao acertar) e howto só na 1ª questão. Ideias do Gemini ainda não aplicadas que VALEM: `shortPrompt`, o componente `SyllableBlender` animado (só o VISUAL, sem o áudio bugado), dots concretos no NumberBond. **RISCO: se o container do AI Studio for sincronizado direto pro GitHub, SOBRESCREVE meu trabalho. Fluxo correto: GitHub (minha branch) é a fonte da verdade; mudanças do Gemini entram como cherry-pick, nunca sync bruto.**

**📌 LEMBRETES PENDENTES (Zeus pediu pra não esquecer):**
1. **Analisar a versão FINAL do Gemini** quando os créditos do AI Studio voltarem — ele vai subir na `gemini-lab` (ou trazer um doc). Comparar, pegar o que presta (já peguei: fix do `server.ts`, `firebase.ts`), listar o que descartar.
2. **Áudio neural pt-BR:** falta uma chave (Google Cloud/Gemini TTS) OU rodar o `gen-audio.mjs` no AI Studio pra gerar o banco de voz natural. Script e plano em `docs/solucao-fonetica-graphogame.md` e `docs/voz-fonetica-analise.md`.
3. **Zeus está testando a versão do Gemini (AI Studio), NÃO a minha.** Pra ele ver minhas correções, o AI Studio precisa PUXAR a branch oficial. Enquanto não puxar, ele sofre com bugs que já resolvi (elogio-spam, som fonético).
4. **AÇÕES FORA DO CÓDIGO:** Firebase rules/Anonymous · apagar branch `Fork` · testar 4 vitais no celular.
5. **Blueprint dos exercícios:** `docs/graphogame-blueprint.md` = a sequência do português (todas as nuances: C/G, R/RR, S/Z, X, nasais, dígrafos…), a anatomia do exercício e o inventário do que existe. Guia pra construir/revisar cada exercício.
6. **Falta construir:** Sons Mágicos, Fábrica de Palavras, Leitor Veloz completo, Manhas do Português. (Seletor de nível ✅ feito — 9ª rodada.)

**ATUALIZAÇÃO (9ª rodada — blueprint aplicado + seletor de nível):**
- ✅ Fábrica de Sílabas N1-3 = kind `blend` (`scenes/SyllableScene.tsx`): letras deslizam e fundem numa bolha-mistério ❓; a sílaba SÓ aparece ao responder (nunca entrega a resposta — as opções são escritas). Visual do gemini-lab aproveitado SEM o áudio de fonemas. Reouvir = balão; opções audíveis seguem. Testes garantem que a resposta não vaza no enunciado (229 testes).
- ✅ Seletor de nível 🎯 (pedido explícito): badge em cada card de trilha → modal com os 5 níveis + AMOSTRA do prompt de cada nível (gerada na hora via `gen(lvl)`), conquistados coloridos, atual marcado, 👑 no dom. Rota `screen.lvl` + `GameLoop.exactLvl` (sem aquecimento/sem banco de revisão na missão escolhida a dedo).
- ✅ Honestidade das bolinhas: `maxLvl` agora só sobe com ACERTO no nível (saltar pelo seletor não pinta bolinha).
- ✅ `explain` nas trilhas ANTIGAS de matemática (item 2 da agenda): contar/mais-menos/soma pré + vizinho/sequência/soma/sub/comparação/pular/dezenas ano1 — sempre a ESTRATÉGIA (contar do maior nos dedos, voltar passinhos, boca do jacaré, dezena=10), falada só ao errar. `plainQ`/`mathQ` ganharam param `explain` opcional.

**ATUALIZAÇÃO (11ª rodada — feedback de teste do Zeus no aparelho):**
- ✅ **Sons Mágicos 🔤** (a fase que faltava — GraphoGame Fases 1-2, pré E ano1): som das vogais → 1ª letra (vogais) → 1ª letra (consoantes) → pares surda/sonora. TTS-seguro (vogal isolada ok; consoante SEMPRE via palavra inteira). Grafo do português: sons → sílabas → ditado. `Question.sayTarget` novo: som-alvo falado mas NUNCA escrito.
- ✅ BUG do balão: reouvir falava inglês com voz pt-BR (faltava passar `lang`). Corrigido.
- ✅ Inglês ouvível: 🔊 em cada opção fala a palavra em inglês (`Option.say`; label é emoji, say é "horse") — a criança ouve até decorar. Frase do enunciado tocável (🔊 na frente) para reouvir à vontade.
- ✅ Palminhas com fala natural ("A palavra é BOLA. Vamos bater palmas: BO, LA! Quantas palmas deu?") — morreu o "palavra SOL: SOL!" robótico. Rimas com `explain` (mesmo som final).
- ✅ Seletor 🎯 mostra a HABILIDADE de cada nível (`Track.lvlSkills`) nas matérias novas.
- 📌 PENDENTES DO ZEUS (desta rodada de teste): (a) voz robótica GERAL = esperando o banco neural do **Luna Studio** (mini-app dele no AI Studio; funcionava e passou a dar erro sem parar + créditos acabaram — quando voltar: baixar os MP3s JÁ gerados, que são aproveitáveis; plugar em `public/audio/` + fallback TTS); (b) mascotes SPRITES: amostra do Hades recebida e VALIDADA — `scripts/chroma-sprites.py` transforma folha verde-chroma em PNGs transparentes 512×512 plugáveis (testado: 5/5 limpos). Falta o Zeus gerar as folhas DEFINITIVAS (1 por tema existente; idealmente pedir fundo transparente ou verde-chroma, personagens bem separados) → salvar como `tema-N-nome.png` em `src/assets/mascotes/`; (c) "motor de animações" para explicações/tutoriais (= o tutorial visual 💡 da agenda, generalizado); (d) revisar TODAS as frases/perguntas mal construídas (auditoria contínua — começada).

**ATUALIZAÇÃO (12ª rodada — o grande despejo do Zeus organizado em docs permanentes):**
- 📚 3 DOCS NOVOS: `sala-de-situacao.md` (painel das 6 frentes — conteúdo/áudio/arte/código/design/multi-IA, com checklist do Zeus e fila do Claude), `arquitetura-pedagogica.md` (ciclo de vida de 5 momentos, kinds e quando usar, matriz por idade com as lacunas: espaço "Onde Está?", tempo "Meu Dia"/dias da semana/escada do tempo, numeral↔quantidade; régua anti-exaustão — a crítica do "vivo,morto,vivo,morto"; cenas vivas > emojis — a sementinha; animação em 3 camadas sprites/SVG/motion; erros recorrentes estudados), `luna-roteiro-audios.md` (inventário 39 itens/1 gerado, Camada A=narrações prontas + Camada B=sons crus a roteirizar, plano de lotes 8-10, regras anti-coarticulação).
- 🔍 LUNA STUDIO CLONADO E ESTUDADO (`/workspace/luna-studio`, repo público novo): código BOM (retry/backoff/cache/filtros); travou por COTA GRÁTIS 429 diário, não por bug. ⚠️ Assinatura consumidor (Google One/Advanced) NÃO libera a API — precisa billing na CHAVE. Se virar 404 depois: renomear modelo `gemini-3.1-flash-tts-preview`. WAV de 970KB/som → converter p/ MP3 aparado (~2-3MB o banco).
- 🧸 Decisões: tamagotchi NÃO precisa de app/motor separado (sprites + estados idle/dormir/comemorar/oi no próprio app); SVG segue para cenas (fracassos passados = personagem à mão + fonema, não a tecnologia); design visual do app = frente própria futura (crítica registrada: home amadora, tamagotchi pequeno); subagentes descartados por custo (docs + CLAUDE.md são a memória persistente/SD que o Zeus pediu).

**ATUALIZAÇÃO (13ª rodada — currículo-mestre + governança dos docs):**
- 🎓 `curriculo-mestre.md` criado: o cruzamento PLANO (catálogo) × APP REAL, hierarquia formal com status por trilha e o DELTA de cada uma (N4-5 que faltam, explains ausentes, reorganizações). Revelou: deltas baratos (explains de formas/padrões/dinheiro/gráficos/ditado/probleminhas; N4-5 de Contar/Sub/Rimas/Palminhas), reorganizações (CIÊNCIAS: 4 trilhas finas → 2 ricas "Mundo Vivo 🌱" e "Meu Corpo 👂" — a crítica do Zeus sobre granularidade "vivo/morto trilha inteira"; Senhor do Tempo absorve Relógio), construções prioritárias (LEITOR VELOZ = janela do Heitor), kinds novos com 2+ usos mapeados (flash/order/orbit/grid).
- 🗂️ GOVERNANÇA: os 6 docs históricos/absorvidos ganharam carimbo no topo (plano-diretor-v2, roteiro-de-execucao, backup-gemini, voz-fonetica-analise, relatorio-expansao, adendo) — nada apagado; tabela vivo/fonte/histórico na sala-de-situacao. Regra: doc novo só se nenhum vivo cobrir; superado ganha carimbo, nunca some.

**ATUALIZAÇÃO (14ª rodada — dossiê externo do ChatGPT analisado):**
- 🔭 Zeus trouxe um estudo do ChatGPT (não acessível por URL — proxy bloqueia chatgpt.com; ele colou como .md e eu li inteiro) propondo reorganizar o app como "mapa adaptativo de competências" (Domínio→Via→Trilha→Nível→Missão→Cena→Exercício, 8-10 domínios, home como mapa, rebrand "Matemágica Atlas", grafo de conhecimento).
- 📊 VEREDITO (tabela completa em `curriculo-mestre.md` §Dossiê Externo): CONVERGIU com a gente nas decisões grandes (competência>idade, senso de quantidade antes do número=nosso M0, tempo&espaço domínio próprio, áudio 3 camadas=plano do Luna, vivo/morto reconfigurado). ADOTADO o que preenche lacuna: **astronomia "Mundo e Universo"** (8 trilhas + Grandes Perguntas — a falta que o Zeus sentiu), 5 níveis semânticos (Reconhecer→Conectar→Executar→Variar→Transferir), princípio "despertar fascínio" (8º da bíblia), funções executivas explícitas, posicionamento comercial (base intelectual dos 4-10). RECUSADO agora: hierarquia de 7 camadas (over-engineering; nossas 4 bastam), grafo de conhecimento (reescreveria o motor; prereqs já dá 80%), home-como-mapa (rebuild de UI), rebrand (cosmético/prematuro), construir 8-10 domínios já (armadilha de escopo).
- 🧭 REGRA-SÍNTESE: **adotar a VISÃO, escalonar a CONSTRUÇÃO.** O dossiê pinta a catedral de 5 anos; temos fundação+3 paredes e o motor já suporta tudo — nada exige demolir. O risco dele é escopo (×5 frentes num projeto de 1 pai + IA).

**ATUALIZAÇÃO (15ª rodada — verificação visual/áudio + Cenas Vivas + Meu Mundo + anti-exaustão):**
- ✅ **VERIFICAÇÃO VISUAL montada e provada:** eu abro o app num Chromium headless (playwright-core --no-save; `scripts/e2e-screenshots.mjs`), clico pelo fluxo e OLHO os screenshots — valido render/posição/fluxo/avanço. Gancho `?e2e=1` no App.tsx (entra visitante, ignora reset de auth do Firebase; inócuo em prod). Ritual novo: mudança de tela = build+test+SCREENSHOT+olhar.
- ✅ **Verificação de ÁUDIO (o que dá):** espião de `speechSynthesis` captura texto/idioma/timing/`cancel` (anti-encavalamento) de cada fala. Pego texto errado, idioma errado, não-disparo, sobreposição. NÃO pego naturalidade (ouvido do Zeus). Achado: dev fala 2× (StrictMode); inócuo (cada fala após cancel; prod não duplica).
- ✅ **Bloco A (matemática):** `explain` (estratégia, ao errar) em Formas, Padrões, Dinheiro (com "100 centavos = 1 real"), Probleminhas (identifica a operação), Gráficos, Tirar.
- ✅ **BIBLIOTECA DE CENAS VIVAS** (o "teste do floquinho": conceito = cena que a criança lê, não emoji): `scenes/WeatherScene` (frio/calor/chuva/sol), `GrowthScene` (semente→árvore com raiz), `DayPartScene` (manhã/tarde/noite, mesma casa), `EmotionScene` (feliz/triste/bravo/medo), `PersonLifeScene` (bebê→idoso). Kinds novos: weather/grow/daypart/emotion/lifestage.
- ✅ **NOVA MATÉRIA Meu Mundo 🌍** (1ª no SUBJECTS — o nível-zero do M0): Meu Dia (partes do dia) + Como Me Sinto (emoções). ✅ Ciências ganhou O Tempo 🌦️, Ciclo da Planta 🌳, As Fases da Vida 👶 (todas com cenas vivas).
- ✅ **Régua anti-exaustão no Vivo ou Não:** 5 habilidades distintas (óbvio → pega-ratão nuvem/rio → o que precisa → já-foi-vivo tronco/folha → detetive planta-é-viva). 292 testes.

**ATUALIZAÇÃO (16ª rodada — estratégia dos motores + geografia + motor `flash`):**
- 🧭 **Perguntas do Zeus respondidas:** (a) SVG é a base certa p/ cenas paramétricas/adaptativas (1 componente = 4 estados, KB, anima, SSR); o "mais bonito" vem de ANIMAR (motion) + mascote em sprite + Lottie/Rive só nos momentos-herói — NÃO de trocar a base. (b) Interação hoje é quase toda "tocar na opção" — metade proposital (menor carga cognitiva 4-7a), metade lacuna a preencher com motores novos.
- 📐 **ESTRATÉGIA DOS MOTORES (aprovada):** construir por ALAVANCAGEM, não tudo de uma vez (kind só com 2+ usos, regra 2). Balde 1 (agora): `flash`, tutorial guiado generalizável, animação, `nest`/`zoom`. Balde 2 (quando a 1ª trilha pedir): `drag`, `grid`, `orbit`. Balde 3 (não especular): `traçar`. Fila reorganizada em `sala-de-situacao.md`.
- 🌎 **Geografia por ENCAIXE (lacuna que o Zeus pegou):** trilha "Meu Lugar no Mundo" (casa→rua→cidade→país→mundo→planeta; estados do Brasil; liga na astronomia). Revelou o **motor `nest`/`zoom`** — "tudo mora dentro de algo maior" — que paga por 6+ trilhas (espaço, tempo, corpo, número, social, taxonomia): é o de MAIOR alavancagem. Registrado em `curriculo-mestre.md` §Sociedade + §Padrão Encaixe.
- ✅ **Motor `flash` (subitização) + Olhômetro 👀 CONSTRUÍDO:** kind novo `flash` — o grupo aparece por um relance (~2s, menor em níveis altos), esconde (🙈), "quantos eram?" (botão "Ver de novo" gentil; opções escondidas durante o relance). Trilha Olhômetro (mat pré+ano1), faixas subitizáveis por nível (N1 1-3 → N5 5-8 com subgrupos). Treina reconhecer quantidade SEM contar (raiz do senso numérico, Clements & Sarama). 13 testes novos (323 total). Provado em tela: relance→esconde→responde→avança→próximo relance. Reusável em Moldura de 10/Ciências.

**ATUALIZAÇÃO (17ª rodada — BALDE 1 DE MOTORES COMPLETO: tutorial guiado + animação + nest/zoom):**
Zeus mandou "planejar tudo e meter ficha". Executei o Balde 1 inteiro (4 motores), cada um com ritual completo (tsc+test+build+screenshot+commit+push):
- ✅ **`flash`/Olhômetro** (16ª rodada, revisado): subitização por relance. 
- ✅ **Framework de tutorial guiado 👉 GENERALIZADO** (`src/utils/tutorials.ts`): a mãozinha do Contar virou SISTEMA — registro declarativo onde cada kind declara seus passos NARRADOS; runner genérico no GameLoop toca passo a passo com a cena visível (fala + legenda). Offline, determinístico, custo zero (≠ o 💡 do Tutor de IA que é server+rate-limit). Botão "👉 Como faz?" cobre os kinds novos que só "renderizavam e esperavam o toque": tenframe, bond, weather, grow, daypart, emotion, lifestage, animal, nest. Os 4 antigos com DEDO ANIMADO (count/sum/tens/subvis) seguem intactos. Provado em tela (Ciclo da Planta, passos 1→2→3).
- ✅ **Cenas ANIMADAS** (SVG-safe, sutil): classes `sc-rise`/`sc-pulse`/`sc-float`/`sc-sway` (transform-box:fill-box) no App.tsx; aplicadas em Growth (sol pulsa + planta nasce), Weather (sol pulsa + nuvem flutua), DayPart (sol flutua + lua pulsa). SÓ onde NÃO há transform de posição (a armadilha SVG+CSS: o transform da animação sobrescreveria o posicionamento). O `prefers-reduced-motion` já existente desliga tudo. É o "mais bonito" que o Zeus sentiu — animar o SVG, não trocar a base.
- ✅ **Motor `nest`/`zoom` (encaixe) + Meu Lugar no Mundo 🌎**: `NestScene` = molduras concêntricas do menor (dentro) ao maior (fora), desenhadas DE FORA PRA DENTRO (bug pego em tela: a externa cobria as internas). Trilha (mundo pré+ano1): casa⊂rua⊂cidade⊂Brasil⊂mundo⊂espaço. N1-4 = zoom-out ("o que fica em volta da casa?" com ❓ por fora em FOCO, não entrega a resposta); N5 = ordenar do menor ao maior (reusa `order`, que agora renderiza o RÓTULO quando não há cena mapeada). É o motor de MAIOR alavancagem (paga por 6+ trilhas). Gramática "da casa/do Brasil" corrigida (contrações). Campos `nest`/`nestFocus` no Question.
- 📊 **338 testes** (era 323). Respondidas 2 perguntas do Zeus: (SVG) base certa, o bonito vem de animar+sprite+Lottie nos heróis, não de trocar a base; (geografia) virou trilha + revelou o motor de encaixe.

**ATUALIZAÇÃO (18ª rodada — crítica de arte do Zeus: NestScene v2 + pipeline de SVG plugável):**
- 🎯 **Crítica certeira do Zeus:** minha NestScene abstrata (quadrado roxo/faixas) NÃO era "rua" — quebrei o "teste do floquinho". Refiz como **zoom de mapa (visão aérea):** casa desenhada (telhado/porta/janelas) no quintal ⊂ asfalto com FAIXA amarela + CALÇADA (Rua) ⊂ prédios (Cidade) ⊂ país/mundo/espaço, proporção correta + NOME por camada (`PlaceArt`). Provado em tela (casa⊂rua⊂cidade⊂❓ lê perfeitamente). Fim do emoji-em-moldura.
- 🔌 **PIPELINE DE CENAS PLUGÁVEL** (resposta à ideia do Zeus de personalizar SVG numa ferramenta externa e plugar): `src/components/scenes/sceneAssets.ts` espelha `mascotAssets.ts` — se existir `src/assets/scenes/<slot>-<estado>.svg`, a cena usa o SEU no lugar do desenho-código, SEM tocar em código. Fiado em weather/grow/daypart/emotion/lifestage/animal/nest. Assim o Zeus faz arte linda fora e o app fica bonito só largando o arquivo.
- 📄 **MANIFESTO `docs/mapa-de-cenas-svg.md`:** o mapa de todos os slots de cena, os estados, o nome exato de cada arquivo, requisitos (viewBox 0 0 200 200, transparente, ≤15KB, svgo), onde moram as animações, e o fluxo de trabalho. É o que o Zeus pediu ("documento com os caminhos, as pastas, os arquivos de animação").
- 🧭 **Regra de arte reforçada:** SVG-código é o FALLBACK legível; a beleza vem de (a) animar, (b) arte plugável (externa), (c) sprite do mascote — não de mais SVG à mão. 338 testes seguem verdes.
- ⚠️ **CORREÇÃO (mesma rodada):** a NestScene v2 (caixas concêntricas com desenho dentro) TAMBÉM ficou ilegível (Zeus: "não dá pra entender nada"). Refeita v3 = **uma CENA INTEIRA e clara por lugar** (casa com quintal, rua com asfalto+faixa+calçada, cidade com prédios, Brasil=bandeira, mundo=globo, espaço=planeta) — a pergunta mostra `q.big` e a criança escolhe o container. Fim das caixas empilhadas. Provado em tela (casa/rua/cidade lêem lindo). LIÇÃO: encaixe concêntrico não funciona pra 4-7a; cena única por conceito é o caminho.
- 📝 **`docs/brief-arte-svg.md`:** a pedido do Zeus (ele achou uma ferramenta de SVG bonito), criei o BRIEF criativo asset por asset — nome de arquivo exato, regras técnicas (viewBox 0 0 200 200, transparente, ≤15KB), descrição do desenho e PROMPT pronto pra copiar. 7 grupos, ~29 assets. Ele gera na ferramenta, larga em `src/assets/scenes/`, o loader pluga sozinho.

**ATUALIZAÇÃO (19ª rodada — Zeus pegou o furo de LÓGICA da geografia):**
- 🧠 **A lógica estava errada, não só a arte:** "o que fica em volta da cidade? Brasil/mundo/espaço" não faz sentido pra criança — todos são maiores que a cidade, e "em volta" não é como ela pensa país/mundo. O formato era AMBÍGUO (a casa está na rua E na cidade E no Brasil — vários "containers" válidos). Trocado pela mecânica **ORDENAR do MENOR ao MAIOR** (kind `order`): concreta, uma resposta certa, sem ambiguidade. Escada cresce por nível (2→5 lugares); as PEÇAS são as próprias cenas dos lugares (order tile renderiza `NestScene`). Kind `nest` standalone aposentado. LIÇÃO: rever a LÓGICA do exercício, não só o visual.
- 🎨 Arte: prédios da cidade ganharam **grade de janelas** (cara de prédio, crítica do Zeus); rua confirmada legível (asfalto+faixa+calçada+casas+poste). Provado em tela.
- ✅ **Checklist de status da arte** em `mapa-de-cenas-svg.md` (a pedido do Zeus): tabela slot × fallback × qualidade × arte-externa, que eu mantenho a cada rodada. Regra: manter as artes atuais e ajeitar aos poucos, sem estresse.
- 337 testes. **Próximo: CONTEÚDO** (Contar N4/N5 + auditoria/expansão do Português).

**ATUALIZAÇÃO (20ª rodada — POST-MORTEM da geografia: o loop de erro parado pelo Zeus):**
- 🛑 **Zeus encerrou o loop:** 4 formatos da trilha Meu Lugar no Mundo falharam (caixas concêntricas → caixas c/ arte → "o que fica em volta" → ordenar cartões). CAUSA RAIZ (não era arte): **inclusão hierárquica de lugares não é conceito perceptual** — é lógica de classes (Piaget: ~7-9a). Cartões do MESMO tamanho perguntando "qual é maior" CONTRADIZEM visualmente a pergunta. Bandeira ≠ "o Brasil" para criança (símbolo sem associação a lugar; o certo é o MAPA do Brasil/globo com destaque — brief corrigido).
- 🛑 **Furo de processo admitido:** a trilha nasceu de conversa → código direto, PULANDO a receita de 6 passos do Método (sem trajetória escrita, sem pesquisar como se ensina). O ritual de screenshot pega bug de RENDER, não de PEDAGOGIA.
- 📏 **REGRAS NOVAS (invioláveis a partir daqui):** (1) exercício que falha 2× seguidas com o Zeus = PARAR de iterar visual e voltar à trajetória pedagógica; (2) trilha nova SÓ nasce pela receita de 6 passos, com trajetória escrita mostrada ao Zeus ANTES de codar.
- 📦 **mundo_lugar FORA DO AR** (código preservado: gMundoLugar + NestScene). **v2 planejada = VIAGEM DE ZOOM NARRADA** (modelo "Me on the Map"/zoom Google Earth: UMA cena que afasta, camada anterior visível DENTRO da nova — o "maior" vira visual; a criança PREVÊ o que aparece, não ordena). Pede o motor de zoom animado + narração. 327 testes verdes.

**ATUALIZAÇÃO (21ª rodada — trajetória da geografia v2 escrita + Contar N4/N5):**
- 📝 **`docs/trajetoria-meu-lugar-no-mundo.md`** (a regra nova em ação: trajetória ANTES do código, pra o Zeus aprovar): geografia v2 pela receita de 6 passos. A virada do Zeus vira o eixo: **COMPOSIÇÃO** ("muitos formam um" — aditivo, concreto, reusa Muito ou Pouco) no lugar de inclusão de classes (abstrato, falhou). Viagem de zoom narrada casa→bairro→cidade→estado→Brasil→América do Sul→mundo→Terra, com contornos REAIS vetorizados. Propõe o kind `zoom` (scale+fade SVG, simples; reusa na Escada do Tempo). AGUARDA aprovação do Zeus antes de codar.
- ✅ **Contar N4 (conservação) + N5 (contar a partir de)** — catálogo (Gelman & Gallistel). N4 = kind `conserv` novo (fileira junta vs espalhada, resposta "iguais", quebra "espalhado=mais"); N5 = "Continue: 4,5,6,..."→7 (não voltar ao 1). Ambos provados em tela. N1-N3 mantidos. 327 testes.
- **PRÓXIMO CONTEÚDO:** auditoria + expansão do Português (Fábrica de Palavras, Leitor Veloz do Heitor, Manhas do Português) — revisar fala/lógica exercício por exercício.

**ATUALIZAÇÃO (22ª rodada — geografia v2 CONSTRUÍDA + VIRADA "Matemática primeiro"):**
- ✅ **Meu Lugar no Mundo v2 NO AR** (kind `journey`): o Zeus aprovou a trajetória com UMA mudança — **fora o motor de zoom complexo**. No lugar: **cenas prontas** (`PlaceScene.tsx`, 8 lugares bonitos e reconhecíveis: casa 🏠 → bairro 🏘️ → cidade 🏙️ → estado 🗺️ → Brasil 🇧🇷 → América do Sul 🌎 → mundo 🌍 → Terra 🪐) + **transição suave** (`JourneyScene.tsx` + `jr-emerge`: a nova cena ENTRA em cena, leve zoom-in+fade — a sensação de "afastar e ver o lugar maior", sem física/câmera). Mecânica = **COMPOSIÇÃO** ("muitas casas formam um bairro"), não inclusão de classes (que falhou 4×). Viagem narrada → opções escondidas até o fim → `explain` gentil ao errar. **Provado no app real** (galeria das 8 cenas + fluxo casa→bairro dirigido no Chromium). Cenas plugáveis (`place-*` no `sceneAssets`). Kind `journey` justifica a regra 2 (2º uso: Escada do Tempo). `nest`/NestScene aposentado. 337 testes.
- 🎨 **As 8 imagens** (o que o Zeus pediu — "crie as imagens, bonitas e didáticas"): desenho-código SVG reconhecível (casa com quintal/sol/fumaça, bairro com 5 casas+rua, cidade com prédios+janelas, estado=região com cidades-ponto+capital⭐, Brasil com cotovelo NE+bico sul+pino, América do Sul com bico ao sul+Brasil destacado, mundo=mapa-múndi, Terra=planeta+nuvens+lua+estrelas). Arte externa que mais paga: `place-brasil`/`place-americasul` (contornos reais). Brief atualizado.
- 🧭 **VIRADA ESTRATÉGICA (Zeus):** PARAR de criar matéria nova. **Terminar a MATEMÁTICA inteira primeiro** (auditar + completar cada trilha), depois arquitetar as próximas matérias uma a uma. Geografia foi a última peça "de fora" (já estava em voo). Fila da sala-de-situação reorganizada com esse foco.

**ATUALIZAÇÃO (23ª rodada — dia perdido do Zeus + DIAGNÓSTICO GERAL + plano Matemática-Primeiro detalhado):**
- 🛑 **Contexto:** o Zeus perdeu o dia inteiro (2026-07-17) tentando gerar imagens/animações SVG bonitas pra alfabetização cartográfica com várias IAs — e reprovou também as minhas imagens da geografia ("ficou muito ruim"). Decisão dele: **geografia CONGELADA** (o que existe fica no ar), retomar só depois da matemática; Português depois; áudios aos poucos.
- 🩺 **DIAGNÓSTICO registrado** (`sala-de-situacao.md` §Diagnóstico): (1) arte estática por código tem TETO — regra nova: ninguém gasta mais dia em arte estática; beleza = animação/interação + assets plugáveis com calma; (2) pedagogia pulada = retrabalho (regra dos 6 passos vale pras aulinhas também); (3) multi-IA sem contrato = Zeus testando versão velha — **receita fechada do "puxar" pro AI Studio escrita no `fluxo-multi-ia.md`** (ordem git exata + conferência por hash + só `npm install`); (4) escopo em leque corrigido (Matemática-Primeiro + congelador explícito); (5) GameLoop gigante = dividir quando atrapalhar (Sessão 12); (6) voz robótica = TTS do navegador, espera Luna/billing.
- 🎬 **PLANO MATEMÁTICA-PRIMEIRO detalhado** (`sala-de-situacao.md` §B): 1º **Motor AULINHA** (o pedido nº1 do Zeus: animações que ENSINAM como somar/contar — cena se monta passo a passo com voz; automática na 1ª visita, botão "ver de novo", algoritmo re-oferece após 2 erros; começar por Contar e Somar, didática estudada ANTES pela receita); 2º **Dinheirinho resequenciado** (100 centavos=1 real → cédulas redondas → centavos SÓ no fim como introdução; números sempre pequenos); 3º Subtrair N5 comparação; 4º Senhor do Tempo; 5º miudezas do delta; 6º revisão trilha a trilha; 7º Fase C (prereqs + Modo Gênio).
- ❄️ **CONGELADOR** (`sala-de-situacao.md` §C): geografia, Português, Inglês/Ciências/Meu Mundo (só manutenção), Luna, sprites — tudo registrado com o estado exato de onde parou, nada perdido.

**AGENDA CONSOLIDADA DAS AUDITORIAS (Zeus + AI Studio) — próximos passos de qualidade:**
1. **Tutorial visual da 💡 para os kinds novos** (como a mãozinha do Contar): guiar bond/tenframe/classificação passo a passo (o AI Studio insistiu nisso e tem razão — é o que faz a magia do Contar). Prioridade alta.
2. ~~Padronizar `explain` nas trilhas antigas de matemática~~ ✅ feito (9ª rodada).
3. **Fonética pt-BR gravada** (fase futura): o TTS do navegador NÃO pronuncia fonema isolado esticado (mmmm+aaa) de forma confiável — a fusão fônica de elite pede ~40 áudios gravados (pode ser com a voz da família). Documentado na bíblia como fase 2 da voz.
4. **Ciclo de vida** (ovo→pinto→galinha) como kind de ORDENAR no nível 5 de Ciências; **Amigos** pode ganhar a narrativa "árvore/ninho" com emojis além da moldura.
5. Simular sessão real do Benjamin (4) e do Heitor (6) exercício a exercício após o Zeus testar no aparelho.

**ALINHAMENTO COM O CATÁLOGO — oportunidades ainda abertas:**
- **Olhômetro 👀** trilha SEPARADA (subitização "mostra 2s → esconde → quantos?"): precisa de um kind `flash` (revelação temporizada) no GameLoop.
- **Contar**: N4 = conservação ("juntas vs espalhadas — iguais!") e N5 = contar a partir de um número (Gelman & Gallistel).
- **Detetive Lógico**: falta N4 sudoku 4×4 de verdade (hoje é intruso sutil) — pede renderizador de grade.
- **Ciências 🔬** (Vivo/Não-Vivo, Animais e Casas, De Onde Vem, Sistema Solar) — trilhas de classificação, kinds existentes; matéria fácil de adicionar.
- **Senhor do Tempo ⏰** com animação orbital (kind `orbit` novo). **Música 🎵** (método Parte V).

**ATUALIZAÇÃO (10ª rodada — Sessão 12 iniciada: MascotBases dividido):**
- ✅ `MascotBases.tsx` (o pior violador: 115KB, 2545 linhas, quase tudo UMA função `HeroSkin` com 24 personagens em if/else) → virou despachante fino de 12KB. Os 24 personagens foram para `src/components/mascots/heroSkins/` (10 arquivos agrupados por afinidade, todos ≤15KB) + `types.ts` (`SkinCtx`/`LimbConfig` — o contexto que cada skin recebe) + `index.ts` (mapa `SKIN_RENDERERS[tema]`).
- Método: extração automatizada com verificação — cada bloco de personagem foi copiado literalmente (nenhum SVG foi reescrito à mão), confirmado por **diff byte-a-byte** contra o original, e sanity-checado por **SSR** (renderToStaticMarkup) nos 24 temas × 4 estágios + fallback, zero erros. Risco de regressão visual próximo de zero — só mudou ONDE o código mora.
- **Ainda faltam da Sessão 12:** GameLoop.tsx (~44KB), Mascot.tsx (~42KB), ParentDashboard.tsx (39KB), MascotEvolution.tsx (34KB), MascotRenderer.tsx (21KB) — nenhum é um único componente-monstro como o HeroSkin era; precisam de uma extração mais cuidadosa (ex.: separar por tipo de tela/kind), não o mesmo truque mecânico.

**PRÓXIMOS PASSOS (ordem):** Sessão 12 continuação (GameLoop/Mascot/ParentDashboard/MascotEvolution/MascotRenderer → ≤15KB, extrair useGameEngine — pré-requisito técnico da era do conteúdo) → tutorial visual 💡 dos kinds novos (bond/tenframe/classificação) → **Fase C** (ATIVAR o grafo `prereqs` + Modo Gênio 🚀 usando o `dom` já pronto + Senhor do Tempo com órbita) → alinhamento com o catálogo → Fase D (Leitor Veloz, Camada 0 de voz — banco de áudio via mini-app do Zeus no AI Studio, plugável em `public/audio/` quando pronto). Ordem completa em `docs/mapa-mestre.md`.

**COMO O ZEUS VÊ O APP (sincronização reversa):** todo o trabalho está na branch `claude/ai-studio-github-sync-889al1` no GitHub. O fluxo original era AI Studio → GitHub; para VISUALIZAR agora é o contrário. Opções: (a) merge da branch na `main` e o AI Studio puxa da main; (b) no AI Studio, fazer "pull"/importar essa branch; (c) rodar local (`npm install && npm run dev`). Sem esse pull reverso, o AI Studio continua mostrando a versão antiga.
