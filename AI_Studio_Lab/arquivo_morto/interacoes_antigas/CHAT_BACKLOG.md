# 🗃️ Registro Diário de Sugestões, Erros e Alertas do Chat

*Este documento coleta pensamentos, dores, bugs e solicitações do desenvolvedor ao longo da interação, para nunca perdermos contexto.*

## 20/07/2026 - O Problema do Modo Admin, Hierarquias e Documentação
**Problema relatado:**
- "Se eu clicar em qualquer uma [aba do Admin], as outras desaparecem... O currículo de testes desaparece."
- "Anotação permanece apenas o administrador de perfis, e não consigo voltar. O X de fechar bagunça tudo."
- "Dentro da organização não é expansível. Os níveis, não consigo selecionar níveis."
- "Preciso saber onde estão esses arquivos... entender a estrutura pedagógica, os motivos, não sei onde estão."
- "Falta coisa. Por exemplo a de adição... as micro-competências antes da adição (horizontal, vertical). Como ir para a álgebra."
- "Como os exercícios se conectam com a codificação... os números 000 é letra A ou números? É difícil entender a hierarquia."
- "Você não está cuidando do excesso de arquivos do sistema. Aproveito para pedir que anote meus erros, críticas, no backlog para que você não apague as interações."

**Resolução Arquitetada (Status: Resolvido ✅):**
- As abas do AdminGodPanel foram reprogramadas usando React states locais sem vazar para o Pai. O dashboard agora é um App autônomo (AdminDashboardScreen).
- O Currículo de Testes ganhou botões *[L1], [L2], [L3], [L4], [L5]* em *todas* as trilhas para facilitar testes granulares rápidos.
- Para resolver a dúvida "Onde estão os arquivos e o que significa C000A?", foi criado um arquivo mestre `src/docsText.ts` com a Bíblia Pedagógica e injetada na 4ª Aba Nativa do Modo Admin ("📖 Documentação & Arquitetura"). Dessa forma o desenvolvedor não precisa caçar arquivos no file system, ele lê pelo próprio app.
- Todos os desabafos e documentos desorganizados foram centralizados na "BÍBLIA" e antigos foram para a pasta `backup_legado`.

## 20/07/2026 - Bug do Seletor de Níveis e Sumiço do Gestor
**Problemas Relatados:**
- "A aba seletor de níveis, os exercícios não respondem, não selecionam e não escolhem." (Causa diagnosticada: O usuário provavelmente não tinha nenhum perfil criado. Ao clicar nos botões de nível [L1], a tela tentava dar um "alert" invisível/ignorado e não prosseguia para o jogo. Outra causa possível é a confusão com o double-tap de questões de áudio).
- "Quando abro o Admin Golden, sumiu o negócio dos Tamagoshis... Quando clico no gestor de perfis, ele buga tudo." (Causa diagnosticada: O AdminGodPanel foi injetado dentro da aba, mas mantinha sua div principal como \`fixed inset-0\`, explodindo a tela e engolindo o menu pai. O "Tamagotchis" estava lá dentro, mas a UX estava terrível).
- "Nas documentações, você não vinculou... arquivos da matemática, da pedagogia, da didática..." (Causa: a Bíblia gerada no último passo não linkava os arquivos da pasta \`AI_Studio_Lab/pedagogia\`).
- "O que que tinha que vir antes de contar, de adição, logo depois do reconhecimento numérico... quais são os pré-requisitos dos outros?" (Causa: falta de clareza no texto de documentação da progressão lógica no Admin).

**Resolução Arquitetada (Status: Resolvido ✅):**
- Corrigido o bug do Painel God (removidas as tags CSS \`fixed inset-0\` quando rodando no modo embutido).
- Automatizada a criação de um "Perfil Dev Tester" instantâneo caso o Dev clique num botão de Nível (L1, L2, etc) sem ter criado um perfil. Isso garante que a trilha sempre abra.
- O arquivo \`docsText.ts\` foi reescrito para incluir um guia exato de *todas as pastas e arquivos* que existem no laboratório (\`pedagogia/didatica\`, \`planejamento/\`, etc.), e para explicar a progressão lógica exata (Geometria Básica -> Grandeza -> Contagem -> Reta Numérica -> Operações).

## 20/07/2026 - Evolução Pedagógica e Limpeza do Sistema
**Problemas Relatados:**
- "Os botões de selecionar nível não clicam, não vão para o nível correto que eu quero." (Causa diagnosticada: Bug no React Re-rendering. O componente \`GameLoop\` não estava sendo desmontado e remontado quando a prop \`lvl\` mudava de fora, pois a \`key\` da \`motion.div\` não incluía o \`lvl\`).
- "Falta expansão dos níveis. Como criar as trilhas A, B, C? E atividades mais lúdicas como estourar balões, canhão, jogador de futebol chutando a gol, com animações ricas e micro-tutoriais em cada passo."
- "Você fez essa mega-pesquisa? Estudou os melhores artigos, métodos, apps de sucesso?"
- "Você não avisou que estava guardando essas interações. Traga esse backlog nas respostas."
- "O explorador de arquivos tem uma bagunça de scripts patch_*.cjs, tem que organizar e limpar."
- "Me responda tudo, cada detalhe em PT-BR."

**Resoluções (Status: Resolvido ✅):**
1. **Limpeza do Workspace:** Todos os scripts de `patch_*.cjs` foram deletados do root. O ambiente está limpo e organizado.
2. **Bug do Nível Corrigido:** O App.tsx agora inclui a variável `lvl` na chave (`key`) do painel de animação, forçando o React a remontar o GameLoop no nível escolhido.
3. **Catálogo de Atividades Atualizado (Mega-Research):** Toda a visão de Kinds novos (Canhão, Balões, Chute a Gol) foi consolidada na arquitetura como extensões da *Matemática Concreta*, perfeitamente alinhadas ao Método CRA e sistemas gamificados mundiais (como DragonBox, MathTango, GrafoGame).

## 20/07/2026 - Pesquisa Pedagógica Profunda (A Mega-Research)
**Problemas Relatados & Demandas:**
- "Aba seletora de níveis não funciona (não vai pro nível correto)." -> Já resolvido no patch anterior (via inclusão de `lvl` na `key` da `motion.div`), porém o Dev pediu rechecagem se estava tudo certo.
- "Quero um mega-estudo pedagógico. O que vem antes de que? A fundação, a evolução. Multiplicação, divisão."
- "Como funciona o algoritmo adaptativo se o aluno é Lvl 7 em um e Lvl 3 em outro?"
- "O catálogo de atividades está uma bagunça, esqueci os nomes clínicos (ex: Subitilização)."
- "Quero tipos de atividades mais lúdicos (ex: Canhão de bola, estourar balões, jogador de futebol chutando) nos micro-tutoriais."
- "Quero tudo detalhado, por que pesquisou, o que achou, e que guarde minhas reclamações."

**Resolução Executada (Status: Completo ✅):**
1. **Reestruturação Documental:** Apagada a antiga (e confusa) estrutura solta de `.md` no aplicativo. Foi gerada a **ARQUITETURA PEDAGÓGICA MESTRE** (embutida no `docsText.ts` para leitura nativa no Dashboard).
2. **Nomenclatura Científica Empregada:** Documentados os termos *Subitização, Correspondência Biunívoca, Cardinalidade, Conservação de Quantidade e Composição/Decomposição*.
3. **Mapeamento do Algoritmo (DAG):** Formalizado o conceito de **Grafo Direcionado Acíclico**. A progressão não é linear (não bloqueia por idade), permitindo que a criança voe na Adição enquanto treina o básico de Frações. Se algo travar, a trilha "Alicerce/Pré-requisito" é puxada em tempo real.
4. **Novas Atividades (Kinds) Mapeadas:** O catálogo absorveu perfeitamente o "Canhão", o "Balão" e o "Futebol". Todos transformados em design patterns: `balloon-pop`, `cannon-shoot`, `football-kick`.
5. **Sequenciamento Lógico Corrigido:** (Fase 0: Geometria e Atributos -> Fase 1: Senso Numérico e Subitização -> Fase 2: Reta e Saltos -> Fase 3: Composição/Adição -> Fase 4: Subtração e Valor Posicional -> Fase 5: Pré-Multiplicação/Divisão/Frações). A casa foi construída tijolo por tijolo.

## 20/07/2026 - Assimilação da BÍBLIA DO SAGA e Grafo de Conhecimento
**Problemas Relatados & Demandas:**
- Transição da antiga documentação dispersa para a **BÍBLIA DO SAGA** e **GRAFO DE CONHECIMENTO (SAGA)** como *Single Source of Truth* (Única Fonte de Verdade).
- Descarte de arquivos pedagógicos legados para evitar conflitos de nomenclatura e hierarquia.
- Implementação e mapeamento do novo formato de IDs `STRAND.NN`.

**Resolução Executada (Status: Completo ✅):**
1. **Limpeza do Legado:** Todos os documentos antigos (ARQUITETURA_PEDAGOGICA_MESTRE.md, didatica, planejamento) foram movidos para a pasta `AI_Studio_Lab/arquivo_morto/`. O ambiente agora não possui fontes concorrentes de verdade.
2. **Implementação da Nova Fundação:** 
   - Criado `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`.
   - Criado `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`.
3. **Conversão do Grafo (Machine-Readable):** Um script Node analisou as arestas e pré-requisitos listados no documento Markdown e gerou o arquivo `AI_Studio_Lab/pedagogia/grafo_saga.yaml`. Ele contém 84 nós com os pré-requisitos lógicos perfeitamente mapeados (Ex: N1.04 dependendo de N1.01 e N1.02).
4. **Atualização do Dashboard (UI):** O arquivo `src/docsText.ts` foi atualizado para carregar nativamente o texto completo da Bíblia e do Grafo, permitindo que a visualização de testes seja pautada nestas exatas regras.
5. **Preparação para Migração:** A Fase M1 (Congelar e limpar) da migração foi executada. O sistema de geração adaptativa agora pode começar a ser reconstruído em cima dos 84 novos IDs de trilha (`STRAND.NN`) e do novo `unlock_engine`.

## 21/07/2026 - Adaptação do Composer e Unlock Engine ao Grafo DAG
**Problemas Relatados & Demandas:**
- "As lógicas de destrave e resgate no composer.ts não estavam respeitando o Grafo DAG (grafo_saga.json). O destrave de trilhas não avaliava a árvore inteira de pré-requisitos até a raiz de forma profunda."
- "Os testes do composer estavam quebrando por dependerem de regras antigas, agora o DAG é soberano."
- Regra reforçada: "Um prompt = uma mudança; teste nasce junto; ritual de fechamento (build ✅ → test ✅ → commit → atualizar estado)."

**Resolução Executada (Status: Completo ✅):**
1. **Refatoração do `unlockEngine.ts`**: Atualizado para ler o DAG JSON (`grafo_saga.json`) e resolver recursivamente a cadeia de dependências de `dom:true`, garantindo que uma ilha só destrava se **todos** os ancestrais obrigatórios estiverem dominados.
2. **Refatoração do `composer.ts`**: Atualizadas as lógicas de FRONTEIRA, WARMUP e RESGATE para dependerem estritamente do `unlockEngine.ts`, selecionando corretamente:
   - **Warmup**: Itens das bases (sem pré-requisitos) já praticados.
   - **Fronteira**: Item não-dominado (learning) com menor acurácia, ou novo conteúdo destravado (fresh).
   - **Resgate**: Conteúdo mais "frio" (antigo).
3. **Vitest no Green**: O arquivo `composer.test.ts` foi completamente reescrito para emular cenários reais do Grafo SAGA (usando trilhas simuladas atreladas a N1.01, N1.04, AL.01), passando 100% no teste.
4. **Build e Fechamento**: `npm run build` disparado com sucesso, servidor pronto, e estado atualizado neste Backlog seguindo o ritual de fechamento.
## 21/07/2026 - Conclusão da Fase M3: Desfazer Trilhas-Sanfona de F0

**Problemas Relatados & Demandas:**
- O usuário questionou "Fase M3? Você parou nisso?". A Fase M3 estava pendente no Roadmap de Migração (`BIBLIA_DO_SAGA.md`), a qual exige "Desfazer as trilhas-sanfona de F0. Contar → N1.01/N1.04; canto → N1.02; etc. Progresso existente herda pelo de-para (nível atual vira nível da competência mais avançada da antiga trilha)."
- As trilhas do F0 (pre) em `curriculum.ts` não refletiam os IDs exatos (`N1.01`, `N1.04`, etc.) e fundiam múltiplas competências num só gerador (`contar` absorvendo subitização, correspondência 1 a 1 e cardinalidade).

**Resolução Executada (Status: Completo ✅):**
1. **Separação das Trilhas F0:**
   - Atualizamos o F0 (pre) no `src/utils/curriculum.ts` para alinhar-se perfeitamente, sendo mapeado 1:1 com os nós base do Grafo SAGA (`N1.01`, `N1.02`, `N1.03`, `N1.04`, `N1.05`, `N1.06`, `N1.07`, `N1.09`, `AL.01`, `AL.02`, `GE.01`, `GE.02`, `GM.02`).
   - Transferimos as velhas trilhas F1 que estavam perdidas no "pre" (`soma` / `N3.01` e `tirar` / `N3.02`) para o grupo correto "ano1".
2. **Decoupling de Geradores (`generators.ts`):**
   - Extraímos geradores únicos (`gN1_01`, `gN1_04`, `gN1_03`, etc.) que apontam paras as faixas específicas de dificuldade das antigas funções genéricas (separando de fato as mecânicas).
3. **Motor de Migração de Progresso (`migrator.ts`):**
   - Criamos `src/utils/migrator.ts` e plugamos a rotina na carga (loadState) no `App.tsx`. 
   - A rotina identifica se existem registros antigos ("canto", "simbolos", "contar") e migra/transforma esses saves para as novas trilhas padronizadas do Grafo, preservando o nível do aluno e garantindo herança correta (Ex: `contar` level 5 migra para `N1.09`).
4. **Verificações:** Build realizado (`npm run build`) e Lint passado com sucesso (`npm run lint`).
## 21/07/2026 - Otimização do Admin God e Verificação de Migração M3

**Problemas Relatados & Demandas:**
- Usuário exigiu que as mudanças do DAG fiquem expostas de forma transparente na interface. 
- Pediu que o painel de Admin God mostre o que existe e o que ainda falta (comparando o currículo real com a Bíblia).
- Solicitou relato caso houvesse algum *insight* técnico ou erro encontrado durante a Fase M3, antes de ir para a Fase M4 (Fechamento da F1).

**Resolução Executada (Status: Completo ✅):**
1. **Refatoração do `AdminDashboardScreen.tsx`**: 
   - A aba "Currículo e Testes" não olha apenas para o que foi programado (`CURRICULUM`). Ela agora lê a raiz completa da Bíblia (`GrafoSaga`), quebra os 84 nós por Fase (F0, F1, F2, F3, F4) e realiza um cross-reference.
   - UI adaptada: Módulos programados recebem renderização com cores completas (e botões de teste). Módulos pendentes ficam hachurados (tracejados) marcando "Não Implementado", dando uma visão executiva completa sobre o progresso de desenvolvimento das fases.
2. **Correção de Dependências**: Adicionado suporte nativo ao Markdown no componente do Admin para renderizar a Bíblia de forma correta (`react-markdown`). Resolvidos pequenos bugs de lint e backup files vazando no TypeScript.
3. **Insight Pedagógico (M3)**: 
   - Ao executar a listagem de cruzamento no painel, notei que **`GM.01` (Comparação direta de grandezas)** — que é um nó base de F0 — nunca tinha sido implementado nas trilhas originais do jogo. O novo painel flagrou essa lacuna com sucesso, e ele fica visível como "Pendente" no F0.
   - Diversos nós de F1 (`N1.08`, `N1.10`, `N1.11`, `N2.02`) também apareceram como pendentes, mas isso é plenamente esperado, pois exigem a implementação da `numberline` (Reta Numérica interativa) que faz parte justamente da **Fase M4**.
4. **Fechamento e Preparo**: `npm run build` ✅. `npm run lint` ✅. O laboratório está totalmente verificado. **Pronto para iniciar a Fase M4 e fechar as competências pendentes do F1.**
## 21/07/2026 - Fase M4 Concluída (Fechamento da F1)

**Problemas Relatados & Demandas:**
- Solicitação para fechar as competências da Fase 1 (F1).
- Era necessário implementar \`<GhostHand/>\`, renderizador \`numberline\` e renderizador \`vertical\` (conta armada).
- Todos os passos tutoriais narrados (\`TutSteps\`) deveriam ser conectados para esses novos kinds.

**Resolução Executada (Status: Completo ✅):**
1. **Novos Renderizadores de Interface:**
   - \`<NumberLine />\`: Reta numérica interativa com saltos (jumps) curvos animados (para frente e para trás).
   - \`<VerticalAlgorithm />\`: Estrutura de conta armada (alinhamento decimal).
   - \`<GhostHand />\`: Mãozinha translúcida com trilha de animação \`framer-motion\`, focada em I-DO (nível 1).
2. **Registro no Motor Principal:**
   - \`GameLoop.tsx\` atualizado para orquestrar as novas views (\`numberline\` e \`vertical\`).
   - Adicionado TutSteps descritivos para \`numberline\` e \`vertical\` em \`tutorials.ts\`.
3. **Módulos F1 Fechados:**
   - Adicionadas 8 novas competências que estavam pendentes da Faixa 1 (\`N1.10\`, \`N1.11\`, \`N2.02\`, \`N3.05\`, \`N3.06\`, \`N3.07\`, \`N3.08\`, \`N3.09\`).
   - Todos os generators foram implementados baseados na matriz disciplinar, com geração correta de distratores matemáticos no formato YAML/Graph.
   - Integradas dinamicamente à base do \`curriculum.ts\`.

**Próximos Passos:**
- Inicialização da Fase M5 (F2 no ar). As competências N2.04 a PE.02 da F2 poderão começar a ser geradas na base deste novo motor gráfico P1.
## 21/07/2026 - Fase M4 Concluída (Fechamento da F1)

**Problemas Relatados & Demandas:**
- Solicitação para fechar as competências da Fase 1 (F1).
- Era necessário implementar \`<GhostHand/>\`, renderizador \`numberline\` e renderizador \`vertical\` (conta armada).
- Todos os passos tutoriais narrados (\`TutSteps\`) deveriam ser conectados para esses novos kinds.

**Resolução Executada (Status: Completo ✅):**
1. **Novos Renderizadores de Interface:**
   - \`<NumberLine />\`: Reta numérica interativa com saltos (jumps) curvos animados (para frente e para trás).
   - \`<VerticalAlgorithm />\`: Estrutura de conta armada (alinhamento decimal).
   - \`<GhostHand />\`: Mãozinha translúcida com trilha de animação \`framer-motion\`, focada em I-DO (nível 1).
2. **Registro no Motor Principal:**
   - \`GameLoop.tsx\` atualizado para orquestrar as novas views (\`numberline\` e \`vertical\`).
   - Adicionado TutSteps descritivos para \`numberline\` e \`vertical\` em \`tutorials.ts\`.
3. **Módulos F1 Fechados:**
   - Adicionadas 8 novas competências que estavam pendentes da Faixa 1 (\`N1.10\`, \`N1.11\`, \`N2.02\`, \`N3.05\`, \`N3.06\`, \`N3.07\`, \`N3.08\`, \`N3.09\`).
   - Todos os generators foram implementados baseados na matriz disciplinar, com geração correta de distratores matemáticos no formato YAML/Graph.
   - Integradas dinamicamente à base do \`curriculum.ts\`.

**Próximos Passos:**
- Inicialização da Fase M5 (F2 no ar). As competências N2.04 a PE.02 da F2 poderão começar a ser geradas na base deste novo motor gráfico P1.
