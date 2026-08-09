# CHECKPOINT — GAMIFICAÇÃO / ECONOMIA / META-JOGO FECHADA

Data: 2026-08-09

Branch única: `codex/integrar-bloco-f0`

PR de comparação/CI: #29 — **NÃO MESCLAR NA MAIN**

Base protegida: `main@68fad4c575e28959b2ca4776e9a541d6828b63f3`

Creature Engine: **não modificado** nesta frente.

## 1. Estado terminal da frente

Cabeça funcional validada: `791a21b002794e29818551adbb5cdb93138105e9`

CI funcional terminal: **#811 / run `31325208953` — SUCCESS integral**.

Recibos do run:

- Higiene do PR: verde;
- binários: verde;
- sonda real do Sensei: verde;
- TypeScript: verde;
- auditoria de ficha↔tela: verde;
- auditoria do Curriculum Graph: verde;
- `pr:check`: verde;
- **155 arquivos / 2.367 testes Vitest verdes**;
- build Vite verde;
- Chrome real verde;
- artefato Chrome: **`9074276985`** (`chrome-test-artifacts`).

Comparação contra o último recibo fechado (`f2ce7119...`):

- 30 commits à frente;
- 0 atrás;
- 18 arquivos alterados;
- nenhum arquivo em `engine/mascot-v2`/Creature Engine;
- nenhum conteúdo/ficha curricular foi fabricado nesta frente.

## 2. Falha objetiva que abriu a frente

A frente começou em regression-first no commit `029fa39d6f4f9bda462e5ab8ab3afdee9ed9d58e`.

CI **#784 / run `31322217237`** ficou vermelho de propósito com 1 nova regressão:

- 2.341 testes vizinhos passaram;
- falha nova: XP vitalício do Dojo desaparecia ao materializar `progress.dojo_*` para `dojoTracks`;
- caso: antes = 35 XP; depois = 10 XP;
- mensagem: `expected 10 to be 35`.

A causa arquitetural era real: `Progress.stars` estava servindo simultaneamente como memória pedagógica e carteira implícita de XP, mas o Dojo Sensei remove corretamente seus envelopes transitórios de `Progress`. O meta-jogo não podia depender daquela representação.

Primeiro fechamento intermediário do bug: `a03c300a0ca03d398289e4f0118cc3c2996974b4`, CI **#790 / run `31323835219`**, verde integral.

## 3. Decisão arquitetural principal — três progressões diferentes

A partir desta frente, o SAGA distingue explicitamente:

### A. Progressão do aprendiz

Pergunta: **o que a criança sabe fazer?**

Fonte de verdade:

- Curriculum Graph;
- `Progress` conceitual;
- `masteryEvidence`;
- domínio/níveis pedagógicos;
- Radar/misconceptions;
- Dojo/Jardim como automaticidade;
- Oficina como recuperação causal.

Somente esta camada tem autoridade para mastery, unlock curricular, prescrição e domínio.

### B. Progressão do jogador/perfil

Pergunta: **quanto a criança já viveu/construiu no SAGA?**

Fonte de verdade: XP vitalício legitimamente ganho.

- **Nível SAGA 1–100 pertence à criança/perfil, não ao mascote**;
- não é nota, série, QI nem nível de matemática;
- trocar personagem/skin/companheiro não altera o nível da criança;
- XP nunca é gasto;
- XP não compra mastery, unlock, Oficina, Jardim, Matrícula ou autoridade do Sensei.

### C. Progressão do companheiro

Pergunta: **como o companheiro cresce e reage à jornada?**

Hoje o mascote ainda reage ao XP e possui energia/estágio cosmético. A visão futura exige estado próprio de vínculo/evolução/necessidades suaves. Essa camada é separada conceitualmente da identidade do jogador e da verdade pedagógica.

Documento de visão permanente:

`AI_Studio_Lab/codex/VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`

## 4. Fonte de verdade do XP vitalício

Criado `src/lib/gamificationProgress.ts`.

Leitura única:

- Jornada/conceito: soma de `progress.*.stars`;
- Dojo/Jardim/fluência: soma de `dojoTracks.*.xpStars`;
- total = `getKidLifetimeXp(kidId, state)`.

O campo de meta-progressão nos estados de fluência é aditivo/opaco e não concede autoridade pedagógica.

### Dojo

`src/curriculum/motores/senseiDojoProgressContext.ts` agora:

- preserva `stars` de saves `progress.dojo_*` legados em `xpStars`;
- acumula XP das respostas reais ao materializar os markers;
- preserva o bônus de missão perfeita;
- continua removendo `progress.dojo_*`;
- não migra `dom/masteryEvidence` para o Dojo;
- marker sem elegibilidade curricular não ganha evidência nem XP.

### Jardim

`src/curriculum/motores/jardimEngine.ts` agora:

- acumula `xpStars` dentro do estado JD;
- preserva automaticidade e misconceptions em seu domínio correto;
- não altera o `Progress` conceitual da competência-mãe para guardar XP.

### Reload/migração

`src/lib/gamificationPersistence.test.ts` prova:

- `JSON → migrate` preserva XP conceitual + XP de fluência;
- legacy Dojo → materialização → JSON → migrate conserva o mesmo total;
- reload/materialização repetida é idempotente.

Schema permanece 1: a adição é compatível e o migrator atual preserva o campo opcional pelos spreads de estado.

## 5. Política econômica central

Criado `src/lib/rewardPolicy.ts`.

Regra V1:

### XP

- resposta terminal correta válida: **+1 XP**;
- resposta errada: 0 XP;
- missão perfeita: **+5 XP**;
- velocidade não multiplica XP;
- Misto não multiplica XP;
- fallback não paga XP;
- retry intermediário/double tap não chega ao boundary premiável;
- deliberate replay é atividade nova e pode render recompensa base, mas não repete o bônus único de primeira missão.

### Moedas

- resposta correta normal: **+1 moeda**;
- conclusão: +3 moedas;
- primeira missão do dia: +5 moedas adicionais + 1 ração;
- Misto: moeda 2×, XP continua normal;
- fallback não paga moeda;
- nenhum gasto pode gerar saldo negativo.

### Por que velocidade saiu do XP

A regra antiga do Dojo pagava 15/5/2 XP conforme RT e ainda possuía um atalho que podia forçar streak por velocidade. Isso criava dois riscos:

1. criança rápida podia comprimir meses de meta-progressão em poucas sessões;
2. velocidade podia vazar autoridade para a progressão pedagógica.

Agora RT continua sendo sinal de automaticidade no Dojo, que é seu lugar pedagógico correto, mas **criança lenta e correta recebe o mesmo XP de perfil**.

Guardrails em `src/lib/gamificationWiring.test.ts` impedem o retorno de:

- `starGain=15/5/2`;
- shortcut de `streak` por rapidez;
- UI de moedas fora da política central;
- recompensa falsa de fallback;
- perda do guard de double tap/retries;
- repetição visual do bônus de primeira missão em replay.

## 6. Curva Nível SAGA 1–100

Curva inicial configurável:

`threshold(level) = round(10*n + 0.35*n²)`, com `n = level - 1`.

Marcos:

- nível 1: 0 XP;
- nível 2: 10 XP;
- nível 10: 118 XP;
- nível 100: **4.420 XP**.

Uma missão padrão perfeita de 8 itens rende 13 XP: 8 acertos +5 perfeição.

Simulações cobertas por teste:

- 1 missão perfeita/dia → nível 100 em **340 dias**;
- 2/dia → **170 dias**;
- 3/dia → **114 dias**.

A aceleração por dedicação é aproximadamente proporcional, sem multiplicador oculto por velocidade.

A curva é uma **primeira calibração**, não uma constante sagrada. Telemetria real futura pode recalibrar thresholds sem mexer em mastery.

## 7. Economia longitudinal inicial

Para missão normal perfeita de 8 itens:

- primeira missão do dia: 8 +3 +5 = **16 moedas**;
- missões seguintes no mesmo dia: 8 +3 = **11 moedas** cada.

Simulações cobertas:

- 1 missão/dia = 16 moedas/dia;
- 2/dia = 27 moedas/dia;
- 3/dia = 38 moedas/dia;
- 30 dias a 1/dia = 480;
- 90 dias a 1/dia = 1.440;
- 30 dias a 2/dia = 810;
- 30 dias a 3/dia = 1.140.

O álbum atual permanece **bancada provisória de consumo**, não fundamento da economia. Preços futuros devem ser recalibrados quando houver catálogo definitivo de cosméticos/companheiros/ambientes.

## 8. Transações econômicas atômicas

Criado `src/lib/economyTransactions.ts`.

Contratos:

- `applyKidPurchase`: mutação do perfil/companheiro + débito ou nada;
- `purchaseAlbumItem`: item único; duplicata rejeita e não cobra;
- `spendCoins`: saldo insuficiente/valor inválido rejeita;
- nenhum `Math.max(0, saldo - custo)` pode esconder compra sem dinheiro.

Antes, o `App` podia aplicar a mutação e apenas zerar a carteira se uma chamada ultrapassasse o saldo. A UI normalmente evitava isso, mas o boundary não era seguro. Agora o boundary é a autoridade.

`src/lib/economyTransactions.test.ts` e `src/lib/economyWiring.test.ts` guardam esses contratos.

## 9. Atlas de Habilidades / insígnias

Criado `src/lib/skillAtlas.ts` e integrado ao Perfil.

O Atlas é uma projeção infantil do **Curriculum Graph real**, não uma árvore paralela de gamificação.

Estados derivados:

- `not-started`;
- `learning`;
- `consolidating`;
- `mastered`;
- `coming-soon` para fallback.

Regras:

- XP e moedas são deliberadamente ignorados;
- `lvl=5` sem domínio maduro aparece como consolidação, não insígnia máxima;
- somente `dom=true` produz `mastered`;
- fallback não conta como competência real servida;
- resumos por ilha/domínio vêm do learner state.

Isso permite futuramente transformar a visualização em mapa de skills/ilhas/dojo sem alterar a verdade subjacente.

## 10. Perfil infantil

`src/components/home/PerfilTab.tsx` passou a mostrar:

- **Nível SAGA 1–100**;
- XP vitalício e barra para o próximo nível;
- Atlas de Habilidades;
- quantidade de habilidades dominadas;
- progresso por ilha ativa;
- dias de jornada;
- desafios respondidos;
- companheiro separado;
- álbum separado.

Não foi construído um megamapa visual definitivo nesta fase porque a Coverage Matrix/fábrica curricular ainda precisa resolver conteúdo real antes de polir a cartografia final.

## 11. Mascote — correção limitada, sem Creature Engine

`src/components/MascotEvolution.tsx` passou a ler o XP vitalício unificado.

Também foi corrigido um bug de UI existente:

- há 8 estágios definidos;
- a estrada de “próxima evolução” parava erroneamente após o estágio 5;
- agora segue corretamente até o estágio 8.

Nenhum arquivo do Creature Engine foi alterado.

## 12. Consistência UI ↔ persistência

Fechado:

- Misto mostra a mesma moeda 2× que o App credita;
- fallback não anuncia prêmio inexistente;
- condição de primeira missão fica congelada no início da sessão para a tela de resultado não perder o bônus após o App atualizar o log;
- replay não repete bônus de primeira missão;
- o rótulo do bônus do Misto não finge que é +5 quando o multiplicador econômico torna o valor diferente.

O commit `f614629f...` introduziu acidentalmente uma remoção visual de `mb-4` ao substituir o `GameLoop` inteiro pela API. A revisão de diff detectou o ruído e o commit `791a21b...` o reverteu antes do fechamento. O diff final funcional não carrega essa alteração acidental.

## 13. Idempotência — escopo correto

Contratos provados/preservados:

- double tap síncrono: `answeredRef` barra segundo terminal;
- retries intermediários retornam antes do terminal premiável;
- materialização Dojo repetida não duplica XP;
- reload não duplica XP;
- compra duplicada de álbum não cobra;
- replay é nova prática real, mas bônus de primeira missão não reaplica;
- retry de cloud reenvia snapshot de estado reconciliado, não reaplica um evento de recompensa separadamente.

Não foi criado um event ledger global nesta fase porque não houve falha objetiva que justificasse essa complexidade. Se o produto evoluir para economia multiplayer/servidor autoritativo, compras pagas ou eventos concorrentes aditivos entre dispositivos, esse boundary deve ser reavaliado.

## 14. Visão futura registrada — não executar agora

A visão de produto foi capturada em:

`AI_Studio_Lab/codex/VISAO_METAJOGO_PERFIL_CONQUISTAS_COMPANHEIRO_2026-08-09.md`

Inclui:

- companheiro/NPC meta-inteligente persistente;
- emoções/retratos;
- alimentação, banho, carinho, sono, estudo, treino, corrida/artes marciais como necessidades suaves;
- widget futuro no celular;
- sem morte/doença/perda de evolução/culpa por ausência;
- personagens autorais animais humanoides em HD pixel art;
- futuro modo de luta 1×1 com combos/especiais;
- futuro beat ’em up 2.5D/belt-scroll com profundidade;
- contrato de animação reutilizável;
- `Laboratório de Raciocínio / Thinking Lab` para lógica, resolução de problemas, decomposição, padrões, abstração, algoritmos, modelagem, dados, debugging, pensamento sistêmico, metacognição e futura ponte com programação/engenharia/robótica/IA.

Esses itens são visão de evolução. **Não são requisito para fechar o aplicativo matemático atual e não autorizam mexer no Creature Engine nesta fila.**

## 15. Contratos permanentes desta frente

Não reabrir sem falha objetiva:

1. `mastery/unlock` nunca podem ser comprados por XP/moedas;
2. Nível SAGA é do perfil, não do mascote;
3. XP é vitalício e não gastável;
4. moedas são a carteira gastável;
5. velocidade não multiplica XP nem streak conceitual;
6. criança lenta e correta não recebe menos XP de perfil;
7. Misto 2× afeta moedas, não XP/mastery;
8. fallback não fornece evidência nem recompensa real;
9. insígnias curriculares derivam do learner state;
10. compra é atômica e não permite saldo negativo;
11. UI e persistência devem mostrar/aplicar a mesma política;
12. ausência não causa perda de nível, morte ou punição do companheiro;
13. Creature Engine permanece desacoplado da pedagogia/economia.

## 16. Dívida curricular preservada

Esta frente **não resolve nem deve esconder** a dívida já inventariada:

- Composer 26/90;
- servido sem placeholder 51/90;
- 25 prontos em legado;
- 39 fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias de ferramenta;
- primitivas incompletas `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar a fábrica antes da Coverage Matrix.**

## 17. Próxima tarefa única

**Coverage Matrix.**

Objetivo: transformar a dívida curricular já inventariada numa matriz executável, competência por competência, ligando grafo → ficha → tela/primitiva → compositor → auditoria → status real de serviço.

Depois:

`Coverage Matrix → fábrica curricular → mega auditoria integrada → hardening/performance → release`.

Arte definitiva, Creature Engine, widget e jogo de luta ficam em trilha futura separada até o núcleo matemático estar fechado.

---

**Regra de ouro:** a criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor. O meta-jogo celebra o caminho; ele nunca decide o que a criança sabe.
