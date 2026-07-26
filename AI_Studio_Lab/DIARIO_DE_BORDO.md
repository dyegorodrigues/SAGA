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

