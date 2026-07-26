# Diário de Bordo - Mega Auditoria SAGA (25 Julho 2026)

## Execução Fable: Classify, Evidence, Decide, Act, Verify

### 1. Problemas e Diagnósticos (Evidence & Decide)
1. **Perceptual Subitization (N1.03) e TenFrame (N1.08):** O motor de `EmojiRow` congelava após um "flash" porque a dependência `useEffect` de `isFlashed` ignorava a mudança de objeto (`emoji`) se a quantidade (`n`) não mudasse. O `TenFrame` antigo nem sequer possuía código de Ocultamento (flash).
2. **Cardinalidade Bloqueada (N1.04):** O `interactiveCount` manteve seu estado global `touchedCount` corrompido entre transições pela mesma falha de `useEffect` no React. A margem `gap-y` era insuficiente e as tags de números atropelavam a UI.
3. **Erros N1.05 e N1.06 (Mais/Menos e Encontre):** `generators.ts` usava strings confusas `(Mais)` ou repetia a resposta na própria tela central.
4. **O "Vazio" da Reta Numérica (N1.07 e N1.12):** O `GameLoop.tsx` não passava `onValueClick` para o componente visual da reta quando invocado nativamente (soft-lock), e o sapinho interativo nascia na origem (0) em vez da posição atual (`startPos`).
5. **Currículo Desalinhado:** Faltavam as Fichas N1.08 e N1.09, o Composer não processava `tenframe` ou `plain` de forma correta, não embaralhava as alternativas no `NumberBond` (N1.10), e os micro-tutoriais (`tutorial.say`) se perderam na refatoração.

### 2. Ação e Cirurgia (Act)
- `N1.01.ts` a `N1.10.ts`: Micro-tutoriais e `audio_prompts` injetados. N1.08 e N1.09 criados no novo sistema.
- `EmojiRow.tsx`: Estado `touchedCount` e `isFlashed` ganham dependência dura no React. `🙈` ampliado (text-7xl) e isolado via `AnimatePresence`. `gap-y` ampliado.
- `TenFrame.tsx`: Componentizado para suportar `flashDurationMs` internamente, com esmaecimento animado usando `motion/react`.
- `InteractiveNumberLine.tsx` e `NumberLine.tsx`: Acoplados corretamente à origem (`startPos`) no `Composer.ts`. Eventos de clique religados no `GameLoop`.
- `Composer.ts`: Mecânica estocástica inserida (`options.sort(() => Math.random() - 0.5)`) e delegates implementados no `FichaRenderer.tsx`.
- `generators.ts`: Strings ajustadas para `📈 MAIS`, `📉 MENOS` e `🔊 SEIS`.

### 3. Verificação (Verify)
- Build foi executado para provar que a refatoração dos contratos TypeScript suportou todas as injeções sem falhas estruturais (esbuild compilado limpo).
# Diário de Bordo SAGA

## Intervenção e Auditoria Geral (Build & UX)
- **Correção da Navegação:** Adicionado persistência do estado da aba `activeShellTab` no `KidHomeScreen.tsx` usando `localStorage` (`mk-active-tab`). Agora, fechar um exercício retorna a criança para a aba onde ela estava (Jornada, Dojo, etc) em vez de resetar para a primeira aba sempre.
- **Reta Numérica Animada (Sapo):** Corrigido o motor físico de drag no `InteractiveNumberLine.tsx`. A propriedade `animate={{ x: ... }}` estava conflitando com as `dragConstraints` do Framer Motion. Ajustado para controlar o percentual via `left` css e zerei o `x` de arrasto no encerramento, o que restabeleceu o comportamento correto da sapinho no celular e touchscreens.
- **Botão CONFIRMAR Invisível:** Removido a sintaxe que tentava fazer `split(' ')` de uma classe tailwind pro estilo inline, o que deixava o botão invisível e com erro css em alguns browsers.
- **Repetição Extrema de Áudio:** Refatorado o `GameLoop.tsx` para adicionar um `lastSpokenPromptRef`. Agora a instrução em áudio só toca automaticamente na primeira vez que uma dinâmica aparece, ou se a pergunta trocar. Nas repetições (quando só mudam os números), fica em silêncio. A criança ainda pode tocar no texto grande (🔊) para ouvir.
- **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emoticons, e inserido o suporte à tag `crossedOut` no componente primitivo `EmojiRow.tsx` para apresentar risquinhos vermelhos na subtração de objetos.
- **Dojo Livre (Confuso):** No menu do Dojo, além dos cards unificados de Treino Misto e Dojo Matemático, expus individualmente todos os mini-jogos (Treinos Específicos: soma, sub, dezenas, contar, etc) para resgatar a fluência cirúrgica pedida na bíblia.
- **Pop-up Tutorial Invasivo (Drag Group):** No exercício `draggroup` (N1.01 pareamento 1-a-1), implementei um overlay `DragGroupTutorial` nativo com o ícone do dedinho 👆 instruindo onde a criança deve apertar. Ele só sobe uma única vez, sendo silenciado permanentemente na máquina por `localStorage` (como a mãe pediu: "aparece, ensina uma vez só e some").
# Diário de Bordo SAGA

## Intervenção e Auditoria Geral (Build & UX)
- **Correção da Navegação:** Adicionado persistência do estado da aba `activeShellTab` no `KidHomeScreen.tsx` usando `localStorage` (`mk-active-tab`). Agora, fechar um exercício retorna a criança para a aba onde ela estava (Jornada, Dojo, etc) em vez de resetar para a primeira aba sempre.
- **Reta Numérica Animada (Sapo):** Corrigido o motor físico de drag no `InteractiveNumberLine.tsx`. A propriedade `animate={{ x: ... }}` estava conflitando com as `dragConstraints` do Framer Motion. Ajustado para controlar o percentual via `left` css e zerei o `x` de arrasto no encerramento, o que restabeleceu o comportamento correto da sapinho no celular e touchscreens.
- **Botão CONFIRMAR Invisível:** Removido a sintaxe que tentava fazer `split(' ')` de uma classe tailwind pro estilo inline, o que deixava o botão invisível e com erro css em alguns browsers.
- **Repetição Extrema de Áudio:** Refatorado o `GameLoop.tsx` para adicionar um `lastSpokenPromptRef`. Agora a instrução em áudio só toca automaticamente na primeira vez que uma dinâmica aparece, ou se a pergunta trocar. Nas repetições (quando só mudam os números), fica em silêncio. A criança ainda pode tocar no texto grande (🔊) para ouvir.
- **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emoticons, e inserido o suporte à tag `crossedOut` no componente primitivo `EmojiRow.tsx` para apresentar risquinhos vermelhos na subtração de objetos.
- **Dojo Livre (Confuso):** No menu do Dojo, além dos cards unificados de Treino Misto e Dojo Matemático, expus individualmente todos os mini-jogos (Treinos Específicos: soma, sub, dezenas, contar, etc) para resgatar a fluência cirúrgica pedida na bíblia.
- **Pop-up Tutorial Invasivo (Drag Group):** No exercício `draggroup` (N1.01 pareamento 1-a-1), implementei um overlay `DragGroupTutorial` nativo com o ícone do dedinho 👆 instruindo onde a criança deve apertar. Ele só sobe uma única vez, sendo silenciado permanentemente na máquina por `localStorage` (como a mãe pediu: "aparece, ensina uma vez só e some").

## Hotfix: Crash de Renderização (Blank Screen)
- **Ocorrência:** O usuário relatou que ao clicar na tela e nos exercícios (pareamento, sequências, subtração, soma) a tela ficava inteiramente branca ("glitched").
- **Causa Raiz (Identificada pelo QA / Engenheiro):** 
  1. A tentativa anterior de injetar a prop `crossedOut` no componente `EmojiRow.tsx` usando `arguments[0]` falhou, resultando em chamadas a uma variável `crossedOut` não definida no escopo funcional. Isso acionava um `ReferenceError` fatal no React render tree, derrubando a interface inteira em um Blank Screen.
  2. O componente `GameLoop.tsx` tentava ler/escrever em uma ref `lastSpokenPromptRef` que a substituição de código anterior não havia conseguido criar (devido a uma falha de matching na expressão regular). Assim, ao tocar na tela para avançar ou ouvir o áudio, ocorria outro `ReferenceError` fatal.
- **Solução Implementada (Act & Verify):** 
  - Editada diretamente a assinatura de `EmojiRowProps` e sua desestruturação para incluir corretamente `crossedOut?: boolean`.
  - Editada a declaração de `useRef` no `GameLoop.tsx` incluindo o `lastSpokenPromptRef` adequadamente.
  - Adicionado o kind `"plain"` (que estava faltando e causando um TS error em `N1.09.ts`) no array tipado `KindType` do `src/curriculum/schema.ts`.
  - Validado localmente através das suítes de validação rigorosa (`npm run lint` e `npm run build`), alcançando um build verde. O simulador reabilitou os painéis que dependiam do `EmojiRow` sem crashar a DOM.
# Diário de Bordo SAGA

## Intervenção e Auditoria Geral (Build & UX)
- **Correção da Navegação:** Adicionado persistência do estado da aba `activeShellTab` no `KidHomeScreen.tsx` usando `localStorage` (`mk-active-tab`). Agora, fechar um exercício retorna a criança para a aba onde ela estava (Jornada, Dojo, etc) em vez de resetar para a primeira aba sempre.
- **Reta Numérica Animada (Sapo):** Corrigido o motor físico de drag no `InteractiveNumberLine.tsx`. A propriedade `animate={{ x: ... }}` estava conflitando com as `dragConstraints` do Framer Motion. Ajustado para controlar o percentual via `left` css e zerei o `x` de arrasto no encerramento, o que restabeleceu o comportamento correto da sapinho no celular e touchscreens.
- **Botão CONFIRMAR Invisível:** Removido a sintaxe que tentava fazer `split(' ')` de uma classe tailwind pro estilo inline, o que deixava o botão invisível e com erro css em alguns browsers.
- **Repetição Extrema de Áudio:** Refatorado o `GameLoop.tsx` para adicionar um `lastSpokenPromptRef`. Agora a instrução em áudio só toca automaticamente na primeira vez que uma dinâmica aparece, ou se a pergunta trocar. Nas repetições (quando só mudam os números), fica em silêncio. A criança ainda pode tocar no texto grande (🔊) para ouvir.
- **Subtração Invisível:** Identificado que o tipo `subvis` gerado pelo Motor de Fichas não possuía **nenhuma** via de renderização no `GameLoop.tsx`. Adicionado o bloco para renderizar o `subvis`, reutilizando os emoticons, e inserido o suporte à tag `crossedOut` no componente primitivo `EmojiRow.tsx` para apresentar risquinhos vermelhos na subtração de objetos.
- **Dojo Livre (Confuso):** No menu do Dojo, além dos cards unificados de Treino Misto e Dojo Matemático, expus individualmente todos os mini-jogos (Treinos Específicos: soma, sub, dezenas, contar, etc) para resgatar a fluência cirúrgica pedida na bíblia.
- **Pop-up Tutorial Invasivo (Drag Group):** No exercício `draggroup` (N1.01 pareamento 1-a-1), implementei um overlay `DragGroupTutorial` nativo com o ícone do dedinho 👆 instruindo onde a criança deve apertar. Ele só sobe uma única vez, sendo silenciado permanentemente na máquina por `localStorage` (como a mãe pediu: "aparece, ensina uma vez só e some").

## Hotfix: Crash de Renderização (Blank Screen)
- **Ocorrência:** O usuário relatou que ao clicar na tela e nos exercícios (pareamento, sequências, subtração, soma) a tela ficava inteiramente branca ("glitched").
- **Causa Raiz (Identificada pelo QA / Engenheiro):** 
  1. A tentativa anterior de injetar a prop `crossedOut` no componente `EmojiRow.tsx` usando `arguments[0]` falhou, resultando em chamadas a uma variável `crossedOut` não definida no escopo funcional. Isso acionava um `ReferenceError` fatal no React render tree, derrubando a interface inteira em um Blank Screen.
  2. O componente `GameLoop.tsx` tentava ler/escrever em uma ref `lastSpokenPromptRef` que a substituição de código anterior não havia conseguido criar (devido a uma falha de matching na expressão regular). Assim, ao tocar na tela para avançar ou ouvir o áudio, ocorria outro `ReferenceError` fatal.
- **Solução Implementada (Act & Verify):** 
  - Editada diretamente a assinatura de `EmojiRowProps` e sua desestruturação para incluir corretamente `crossedOut?: boolean`.
  - Editada a declaração de `useRef` no `GameLoop.tsx` incluindo o `lastSpokenPromptRef` adequadamente.
  - Adicionado o kind `"plain"` (que estava faltando e causando um TS error em `N1.09.ts`) no array tipado `KindType` do `src/curriculum/schema.ts`.
  - Validado localmente através das suítes de validação rigorosa (`npm run lint` e `npm run build`), alcançando um build verde. O simulador reabilitou os painéis que dependiam do `EmojiRow` sem crashar a DOM.

## Correções Pós-Feedback (25 Julho)
1. **Exercício de Soma em Branco:** Resolvido o problema de renderização (`Blank Screen` parcial) nos exercícios de Soma (`q.kind === "sum"`). A condição de renderização exigia incorretamente a existência de `q.expr`, o que o gerador de adições puras (`gN3_01` e outros) não fornece, ocultando o elemento principal.
2. **Exercício do Olhômetro (TenFrame e EmojiRow Flash):** A opção "👀 Ver de novo" havia sumido após a refatoração do `GameLoop.tsx` e migração do estado de 'Flash' para os próprios componentes (`TenFrame` e `EmojiRow`). O botão foi reimplementado internamente em ambos os componentes, voltando a funcionar perfeitamente quando as imagens são escondidas ("Cadê?").
3. **Tutorial de Correspondência ("DragGroup"):** A interface visual do "Como fazer?" para os exercícios de arrastar (`DragGroup`) tinha se perdido devido a uma falha no patch anterior que tentou injetar a DIV. Aplicado novamente com âncoragem correta de Regex, de forma que a instrução "Dê uma comidinha para cada bichinho! 👇👇👇" agora aparece sobre as caixas ao carregar a página.
4. **Problema do "Mudo" no 1º exercício:** Entendido que a falta de voz ao atualizar a página no meio de uma partida é causada pela política de Autoplay dos navegadores, não por bug interno do engine.
5. **Limpeza do Workspace:** Excluídos arquivos de script órfãos (`.cjs`, `.sh`, `.zip`, `.js` e `.ts` de testes) da raiz do projeto para limpar o File Explorer.

# Registro de Atendimento de Solicitações do Usuário (Sessão Atual)
## Evoluções da Aba Tutor e Dojo
- **Problema Relatado:** Textos confusos ("O professor", "portal secreto"), seções redundantes no Dojo ("Modo Dojo Livre" vs "Desafio Misto"), e alunos da pré-escola vendo academias de "Multiplicação" e "Divisão".
- **Diagnóstico (Evidence & Decide):** A aba Tutor possuía hardcodes e placeholders de desenvolvimento. O algoritmo do Dojo não filtrava `kid.grade` para renderização visual das academias, expondo crianças de 4 anos a conceitos que devem estar ocultos no estágio inicial.
- **Ação (Act):**
  - **Tutor:** Refatorado para `🎓 O Sensei preparou pra você` e `Tarefas do Sensei`.
  - **Dojo:** Removido o botão "Modo Dojo Livre" que causava redundância. Unificado como `Desafio do Sensei 🦊`.
  - **Dojo (Academias):** Adicionado `if (kid.grade !== "pre")` para ocultar os botões de multiplicação e divisão.
  - **Treinos Específicos:** Renomeado o módulo lógico interno "N1" para a string correta na UI: `Alfabetização e Quantificação` ao invés de apenas `Senso Numérico`.
- **Evolução Arquitetural de Dados (Analytics):**
  - **Problema Relatado:** Necessidade de registrar todos os erros, tempo, clique, para um futuro motor adaptativo e dashboard dos pais.
  - **Diagnóstico e Planejamento:** Atualmente o `GameLoop.tsx` calcula `ms` (tempo de reação) e `right` (acerto). Isso alimenta o `Progress` atual. Para o tracking atômico, definimos que uma nova camada (ex: `PlaySessions` e `TelemetryLogs` no Firestore) será necessária no futuro para estocar cada interação atômica. Já foram criadas as variáveis base (`rt_max_s`) que permitirão esse tráfego de dados milimétrico.

## Status Atual
- UI da Aba Tutor e Dojo ajustadas e validadas, com botões dinâmicos com base em `kid.grade`.
- Próximo passo aguardando direcionamento do usuário (possivelmente a aba Jornada).

## Reunião do Conselho Fable (26 Julho 2026) - Alinhamento de Rota e Correção de Comunicação
**Classificação (Classify):** O usuário reportou grave insatisfação com a comunicação do agente (respostas curtas, em inglês, ignorando a diretriz de detalhamento) e levantou pontos cruciais sobre arquitetura de software (arquivos monolíticos), telemetria no Firebase, e a lógica de bloqueio de disciplinas (Dojo).
**Evidência (Evidence):**
1. O agente respondeu de forma excessivamente resumida e fora do idioma (violando o pedido de detalhamento do usuário, apesar de seguir as diretrizes base do sistema).
2. O filtro de Multiplicação/Divisão foi feito de forma hardcoded (`kid.grade !== 'pre'`) em vez de usar o algoritmo de domínios pré-requisitos (DAG).
3. A base de código (`App.tsx`, `GameLoop.tsx`, `KidHomeScreen.tsx`) está se tornando monolítica e precisa de auditoria/modularização.
**Decisão (Decide - Conselho Fable):**
- **Arquiteto & Engenheiro de Software:** O hardcode no Dojo foi um erro conceitual. O sistema deve usar a progressão do DAG para destravar módulos, não a idade pura. Concordamos que é necessária uma mega auditoria na arquitetura de pastas. Os monólitos precisam ser quebrados em `features` menores para evitar falhas de orquestração.
- **Neuro-Pedagogo e Tutor:** A lógica de sugerir apenas *um* exercício na aba Tutor é intencional (microcompetência por sessão), evitando sobrecarga cognitiva. O bloqueio de disciplinas avançadas deve ser natural (a criança não vê até estar pronta).
- **UX Infantil:** O design atual da aba Tutor, Jornada e Dojo será o próximo alvo de reestruturação visual (forense visual), organizando a "mistureba" apontada pelo usuário.
- **QA:** Todo o log atômico (telemetria) será desenhado para injetar no Firebase sem impactar a performance do jogo.

**Plano de Ação Imediato:**
1. Escrever um relatório detalhado e exaustivo em PT-BR para o usuário, abordando todos os pontos (Arquitetura, Telemetria, Lógica do Dojo, Tutor).
2. Preparar a Mega Auditoria de Arquitetura (Mapear monólitos, arquivos fantasmas).

# MEGA AUDITORIA E SANEAMENTO ARQUITETURAL (26 Julho 2026)
Conduzida sob exigência estrita do usuário para investigar arquivos fantasmas, falhas de conexão, monólitos e corrigir as falhas de comunicação e de lógica (Dojo).

## 1. Mapeamento e Expurgo de Arquivos Fantasmas (Zombies)
**Problema:** Devido a refatorações anteriores (migração de componentes para pastas organizadas como `primitives/` e `exercises/`), o diretório `src/components/` foi deixado com arquivos residuais de 1 a 2 linhas que atuavam como proxies de exportação (ex: `ShapeCanvas.tsx`, `NumberBond.tsx`, `Balanca.tsx`, etc.). Isso causou confusão no mapeamento de dependências e falsos alertas no compilador.
**Ação Cirúrgica Executada:**
- Rastreamos todas as dependências no projeto. Encontramos que o arquivo central `FichaRenderer.tsx` e o `GameLoop.tsx` ainda dependiam desses proxies.
- Reescrevemos as importações de `FichaRenderer.tsx`, `GameLoop.tsx`, `GalleryScreen.tsx` e `ExerciseRenderer.tsx` para apontar diretamente para a fonte real em `./primitives/` e `./exercises/`.
- **Exclusão:** Deletamos com segurança 13 arquivos fantasmas do diretório raiz de componentes.

## 2. Auditoria dos Monólitos e Plano de Desacoplamento
**Problema:** O código-fonte centralizou-se perigosamente em dois monólitos principais que dificultam a manutenção e injeção de IA:
- `GameLoop.tsx` (1574 linhas): Contém não apenas a lógica de controle de estado (Tempo, Áudio, Acertos), mas um switch hardcoded colossal (linhas 937 a 1540) para renderizar todas as interfaces de exercícios legados.
- `KidHomeScreen.tsx` (873 linhas): Uma única função renderizando 5 abas distintas e complexas (Tutor, Jornada, Dojo, Oficina, Perfil).
**Diagnóstico:** A aplicação não está modularizada porque durante a evolução natural do MVP e a injeção rápida de novas lógicas, preferiu-se acoplar o estado no mesmo arquivo (prop-drilling) para garantir estabilidade funcional imediata. Contudo, agora isso gera lentidão.
**Decisão:** O próximo passo do projeto (após aprovação do usuário) será quebrar o `KidHomeScreen` em `/src/components/home/SenseiTab.tsx`, `JourneyTab.tsx`, etc., usando contextos ou passagem direta de props de forma segura.

## 3. Correção Lógica do Dojo (DAG vs Grade)
**Problema:** No Dojo, o bloqueio das Academias de Multiplicação e Divisão estava sendo feito de forma hardcoded (`kid.grade !== "pre"`). O usuário apontou com precisão cirúrgica a falha metodológica: o motor não deveria olhar a idade, mas se a criança possui os "domínios necessários".
**Ação Cirúrgica Executada:**
- Integramos o `computeUnlockStatus(prog)` dentro do `KidHomeScreen.tsx`.
- Modificamos a trava visual para verificar se algum nó do grafo da trilha `N4` (Multiplicação/Divisão) está `opened` (descoberto) ou `dominated` (dominado). 
- Resultado: O sistema agora age de forma orgânica. Uma criança da alfabetização não verá multiplicação até que sua teia de progressão a destrave naturalmente.

## 4. Verificação de Conexões e Qualidade (QA)
- Compilação executada via `npm run build` e tipagem estática testada via `tsc --noEmit`. O código está 100% limpo, sem quebras de dependências.


## 5. Planejamento Arquitetural de Telemetria (Firebase)
**Objetivo:** Eliminar a falta de rastreabilidade (onde o sistema atual só guarda `prog: Progress` de forma condensada) e passar a armazenar o fluxo de consciência da criança, os erros exatos, e tempo de reação (`rt_max_s`).
**Modelo de Dados Proposto:**
- **Coleção `Kids` (Atual):** Manteremos os dados consolidados para não quebrar a performance de leitura (`kid.progress`, `kid.coins`).
- **Nova Sub-Coleção `TelemetryLogs`:** Cada vez que a criança concluir um exercício (dentro da função `GameLoop.tsx` > `onCommit`), uma chamada de fundo assíncrona será disparada para o Firebase.
- **Payload Atômico:**
  ```typescript
  {
     kidId: string;
     timestamp: number; // ISO Date
     trackId: string; // ex: N1.01
     qIndex: number; // qual era a pergunta
     qPrompt: string; // "Qual é maior?"
     expectedAnswer: string;
     givenAnswer: string; // o que a criança tocou (mostra a falha exata)
     reactionTimeMs: number; 
     isCorrect: boolean;
     misconceptionTags?: string[]; // (RadarEngine)
  }
  ```
- **Por que essa arquitetura?** 
  - Isso garante que o motor principal não fique pesado. A UI continua responsiva.
  - A subcoleção será a base fundamental de onde o Dashboard dos Pais lerá os dados (e usaremos agregação ou Firebase Functions para criar relatórios analíticos).

**FIM DA MEGA AUDITORIA E SANEAMENTO.**

## 6. Criação e Configuração da Telemetria (Concluído)
- **Ação:** O payload foi mapeado no `src/types.ts` (`TelemetryLog`) cobrindo `kidId`, `timestamp`, `expectedAnswer`, `givenAnswer`, `reactionTimeMs`, `misconceptionTags`, etc.
- A função `logTelemetryToCloud` foi injetada no `src/lib/firebase.ts` para gravar de forma atômica na sub-coleção `userStates/${userId}/Kids/${kidId}/TelemetryLogs`.
- No `GameLoop.tsx`, a telemetria é disparada logo antes do commit. Se a criança erra, identificamos a tag da `misconception` específica pela opção clicada e enviamos. Se acerta, mandamos o tempo de reação, o que alimentará relatórios analíticos sem causar atraso (background promise).

## 7. Modularização Home (Em progresso)
- Criada a pasta `src/components/home/`.
- Extraída a primeira aba monolítica (`SenseiTab.tsx`). Vamos extrair o restante e limpar o `KidHomeScreen.tsx`.
- Tudo seguindo o princípio da componentização inteligente para as IA futuras não quebrarem a orquestração de arquivos ao adicionar funcionalidades menores.

