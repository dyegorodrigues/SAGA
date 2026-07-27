# Diário de Bordo - SAGA

## Evoluções da UI e UX (Aba Tutor e Dojo)
- **Tutor:** Reformulado para "O Sensei preparou pra você". As missões foram ajustadas para "Tarefas do Sensei" e a cópia de botões e legendas ajustadas para remover jargões como "Próximo portal secreto", alinhando mais com a visão de um Tutor pedagógico.
- **Dojo Matemático:**
  - O "Desafio Misto" e o "Modo Dojo Livre" (que competiam em função e confundiam usuários) foram mesclados e simplificados para o **Desafio do Sensei 🦊**.
  - **As Academias (Ginástica Matemática):** Agora aplica filtro dinâmico (`kid.grade !== 'pre'`) para que crianças da pré-escola e alfabetização não sejam expostas assustadoramente a botões de Multiplicação e Divisão precocemente.
  - **Treinos Específicos:** Os módulos (Strands) foram renomeados sob a ótica pedagógica correta (ex: "Alfabetização e Quantificação Matemática" no lugar de apenas "Senso Numérico"). O sistema já filtra para só exibir os tópicos onde a criança possui histórico (progressão), escondendo conteúdo não descoberto.

## Métricas e Analytics (Visão Data Science)
Foi validado o plano arquitetural para o tracking atômico. Para possibilitar o acompanhamento milimétrico exigido (cada etapa, erro, tempo de reação, erros de clique):
- O loop de jogo atual (`GameLoop.tsx`) utiliza os `rt_max_s` para medir velocidade e já sabe quando há erro.
- A arquitetura futura de Firestore necessita não apenas salvar a progressão agregada (`prog: Progress`), mas disparar eventos granulares para uma subcoleção `TelemetryLogs` ou `PlaySessions`, registrando o log exato de cada `Question`, resposta escolhida, e o `timestamp`/delay, permitindo a construção do **Dashboard Avançado para os Pais** e relatórios pedagógicos evolutivos.


### Atualização (Telemetria e Modularização)
- **Telemetria Atômica**: Adicionada função de envio assíncrono para o Firestore (coleção `userStates/{userId}/Kids/{kidId}/TelemetryLogs`) no arquivo `src/lib/firebase.ts`. Ela registra cada resposta sem bloquear a interface de usuário.
- **Modularização**: O arquivo gigante `KidHomeScreen.tsx` foi fatiado. O `switch/case` de abas agora utiliza componentes dedicados em `src/components/home/`: `SenseiTab`, `JourneyTab`, `DojoTab`, `OficinaTab`, `PerfilTab`.
- **Limpeza**: Arquivos temporários criados por ferramentas (`patch_gameloop.cjs`, `add_telemetry.cjs`, `sensei_block.txt`, etc) foram devidamente apagados para não poluir o explorador.

### Atualização Estrutural de Agentes (A Tríade de Orquestração)
- **Desafio**: O usuário identificou lacunas de comportamento no agente Gemini (esquecimento de limpar o workspace, falhas de leitura do MD e arquivos monolíticos) e pediu uma revisão profunda do `AGENTS.md`. 
- **Solução (A Tríade)**: Evoluímos a estrutura de um único arquivo de regras para três pilares:
  1. `AGENTS.md` (Cérebro Central): Protocolo Fable melhorado com estratégia de Fallback/Rollback (desistir e documentar após 3 erros) e regras de componentização (Anti-Monólito).
  2. `GEMINI.md` (Operacional): Instruções duras para o próprio agente AI Studio, incluindo a **Regra Absoluta de Limpeza** (nunca deixar lixo `.cjs` ou `.txt` no final do turno) e uso obrigatório de background tasks.
  3. `CLAUDE.md` (Roteador): Regras de sincronia para garantir que a IA externa leia os relatórios do Gemini.
- **Resultado**: Sistema purificado e regras de orquestração aprimoradas para diminuir erros sistêmicos.

### Conclusão da Mega Auditoria de Componentização (26 Julho 2026 - Etapa Final)
- **Problema Inicial:** O componente `KidHomeScreen.tsx` e o `GameLoop.tsx` haviam se tornado monólitos pesados (quase 900 e 1500 linhas respectivamente), dificultando a injeção de IA, rastreabilidade e causando o que foi apontado pelo usuário como "arquivos gigantes e lentidão".
- **Execução Front-End (Home):**
  - **Abas Extratadas (Tabs):** O conteúdo da Home (SenseiTab, JourneyTab, DojoTab, OficinaTab, PerfilTab) foi componentizado com êxito na nova pasta `src/components/home/`.
  - **Modais Extraídos:** `LevelPickerModal` (seletor de nível) e `WardrobeModal` (escolha de cenários) também foram refatorados, isolando os estados `showWardrobe`, controle de `inventory`, compras de cenário, e amostragem de dificuldades (`pickerSamples`).
  - **Impacto:** O arquivo `KidHomeScreen.tsx` foi reduzido de ~873 linhas para meras ~307 linhas, transformando-se de fato em um orquestrador (router das abas) em vez de acumular estado da UI inteira.
- **Limpeza:** A compilação (`tsc --noEmit`) rodou com sucesso sem quebrar dependências, provando a qualidade da componentização, e todos os arquivos de procedimento (`fix.cjs`, etc) foram apagados do repositório conforme ditam as novas regras.

### Erradicação do Monólito GameLoop (26 Julho 2026 - Conclusão)
- **Desafio:** `GameLoop.tsx` era o último grande monólito do sistema, com 1601 linhas, devido a uma estrutura condicional gigante de JSX (Switch de Tipos) que renderizava dezenas de mini-games diretamente no corpo do componente.
- **Ação:**
  - Extraí 600+ linhas de lógica de interface para um novo componente injetado na arquitetura: `src/components/gameloop/GameLoopExerciseRenderer.tsx`.
  - Desacoplei as mais de 16 dependências de cenas (`SyllableScene`, `WeatherScene`, etc.) e primitivas (`NumberLine`, `ArrayGrid`, etc.) do orquestrador principal, injetando-as apenas no renderizador filho.
  - Ajustei todos os estados internos locais (como as _props_ `aulaSuggest`, `guidedNarr`, e variáveis transitórias da Aulinha) para serem transmitidos reativamente ao renderizador.
- **Impacto e Resiliência:** `GameLoop.tsx` foi enxugado em 40% e agora foca estritamente em progressão, áudio e telemetria, delegando renderização. A compilação `npx tsc --noEmit` completou com exatidão (`0 errors`), provando que a tipagem TypeScript permaneceu intacta e sem pontas soltas. Todos os scripts locais foram obliterados em respeito ao protocolo.

## Alinhamento Arquitetural e Pedagógico do Dojo (Feedback do Usuário)
- **Problema de UX/Pedagogia**: A aba Dojo perdeu a transição essencial do Concreto para o Abstrato (CRA). O usuário sugeriu uma divisão clara: **Dojo Garden** (focado no progresso CRA: concreto, concreto+abstrato, mental) e **Dojo Sensei** (focado apenas em fluência/abstrato final). Além disso, os botões das academias não devem ficar soltos poluindo a tela, mas organizados dentro de uma janela/modal que alterne essas variações.
- **Problema de Documentação Cânonica**: Foram criadas "fichas" (ex: `dojo_add.ts`) que não estão devidamente mapeadas no Grafo de Conhecimento, na Bíblia ou no documento principal. Isso gera um "ponto cego" na arquitetura, perigoso para auditorias futuras ou para novos agentes que não saberão como a lógica e os exercícios do Dojo se comunicam com o resto do sistema.
- **Problema nas Estatísticas**: As métricas exibidas na home (ex: "Acertos totais" e "344 Desafios") são rasas. A pedagogia exige métricas mais sofisticadas e precisas: ciclos/baterias completadas, velocidade/tempo de reação e precisão, não apenas a soma crua.
- **Plano de Ação Próximo Turno**:
  1. Redesenhar o `DojoTab.tsx` para a estrutura *Garden* vs *Sensei* com navegação in-window.
  2. Atualizar o `BIBLIA_DO_SAGA.md` e o mapa de currículo para oficializar as estruturas de geração do Dojo (`dojo_*.ts`), conectando-os aos motores cânonicos.
  3. Expandir o modelo de estatísticas (no state/telemetria) para suportar baterias e métricas de desempenho mais aprofundadas.
