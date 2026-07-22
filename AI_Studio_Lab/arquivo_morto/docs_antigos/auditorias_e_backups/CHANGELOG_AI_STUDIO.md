# 🔄 Registro de Sincronização e Mudanças (AI Studio ➔ Claude/GitHub)

**Status de Sincronização:** PENDENTE (O Claude precisa ler este arquivo para atualizar o repositório oficial no GitHub).

Este documento é o **Diário de Bordo Oficial** de todas as arquiteturas, refatorações e criações de conteúdo feitas exclusivamente dentro do ambiente do Google AI Studio. Como o AI Studio não faz `git push` direto para o repositório do Claude, **este arquivo garante que nenhum insight, documento ou código seja perdido.**

---

## 📅 Sessão Atual (Julho 2026 - Sprint de Organização e Didática)

### 1. 📂 Reestruturação da Arquitetura de Documentação (Mega-Organização)
A pasta `/docs` estava superlotada e desorganizada, misturando metodologias, backups e roteiros. O diretório `.claude` operava em paralelo, causando confusão. 
**Ação:** Unificamos e padronizamos tudo sob a pasta `/docs`, adotando uma arquitetura limpa de engenharia de software:

*   **`/docs/arquitetura/`**: Arquivos técnicos do sistema (`arquitetura-pedagogica.md`, `arquitetura-skills-flow.md`, `fluxo-multi-ia.md`, `PROPOSTAS_AVANCADAS_MATEMAGICA.md`).
*   **`/docs/planejamento/`**: Controle de voo e currículo (`sala-de-situacao.md`, `mapa-mestre.md`, `plano-diretor-v2.md`, `roteiro-de-execucao.md`, `catalogo-atividades.md`, `curriculo-mestre.md`).
*   **`/docs/metodologia/`**: A alma do método e regras pedagógicas (`metodo-matemagica.md`, `biblia-do-matemagica.md`, `relatorio-expansao-pedagogica.md`, etc.).
*   **`/docs/didatica/`**: **[NOVO]** O acervo definitivo das didáticas científicas (detalhes abaixo).
*   **`/docs/audio_e_fonetica/`**: Roteiros de voz, GraphoGame e TTS (`luna-roteiro-audios.md`, `graphogame-blueprint.md`, etc.).
*   **`/docs/design_e_ui/`**: Visuais, SVGs e fluxos de tela (`brief-arte-svg.md`, `mapa-de-cenas-svg.md`, `roteiro-cinematografico.md`, `atlas.html`).
*   **`/docs/auditorias_e_backups/`**: Histórico de revisão de código, backups do chat e este changelog (`AUDITORIA_CONSOLIDADA_MATEMAGICA.md`, `BACKUP_HISTORICO_AUDITORIAS_COMPLETO.md`, `AUDITORIA_MATEMAGICA.md`).
*   **`/docs/skills/`**: Arquivos de Skills de IA extraídos do `.claude` (`nova-materia/`, `nova-trilha/`).

### 2. 🧠 Criação do Acervo de "Didática Científica"
A pedido da direção pedagógica, foram pesquisadas, estruturadas e documentadas as fundações científicas inquebráveis para o ensino da matemática (baseado em Singapura, Clements & Sarama, e Van Hiele).
**Arquivos Criados em `/docs/didatica/`:**
*   `adicao.md` - Do concreto ao cálculo mental (Amigos do 10).
*   `subtracao.md` - Desconstruindo o "pegar emprestado" (Parte-Todo).
*   `multiplicacao.md` - A geometria da escala e matrizes (Arrays).
*   `divisao.md` - A equidade, partição e a desmistificação da "Chave".
*   `fracoes.md` - O modelo de barras, partilha justa e equivalência.
*   `geometria.md` - O raciocínio espacial, eixos de simetria e Van Hiele.
*   `medidas.md` - Grandezas, tempo, dinheiro e iteração de unidades.
*   `logica-e-padroes.md` - O pensamento algébrico primitivo e dedução.
*   `ANALISE_E_BIBLIOGRAFIA.md` - A pesquisa referencial global que embasa tudo.

### 3. 📝 Como o Claude deve processar este arquivo?
Caro Claude, ao receber o ZIP atualizado ou o conteúdo via chat:
1.  **Reconstrua a árvore de diretórios** no repositório GitHub para refletir a nova estrutura de `/docs/`.
2.  **Delete** o antigo diretório `.claude` (seu conteúdo foi realocado).
3.  **Absorva** as novas diretrizes pedagógicas da pasta `/docs/didatica/` para balizar a geração de código das trilhas de Subtração, Multiplicação e Divisão que estão na fila.
4.  **Limpe** este changelog ou marque-o como "SINCRONIZADO" no seu próximo commit.

---
*Gerado automaticamente pelo Agente Google AI Studio.*

### 4. 🚨 MEGA-ANÁLISE DE VULNERABILIDADES (ATENÇÃO CLAUDE)
Foi gerado um novo documento profundo de diagnóstico chamado **`docs/arquitetura/MEGA_ANALISE_VULNERABILIDADES.md`**.
*   **Para o Claude:** Este arquivo é de leitura OBRIGATÓRIA antes de qualquer grande refatoração de código. Ele mapeia os perigos do React Re-renders no `GameLoop`, os riscos da transição disciplinar (Word Problems) e propõe o "Frustration Engine" para lidar com desistência silenciosa das crianças. **Leia-o para ter a visão de raio-x do nosso ecossistema.**

### 5. 🧠 INTEGRAÇÃO DO CONCEITO DE "SISTEMA OPERACIONAL COGNITIVO"
**Data:** 19/07/2026
**Origem:** Auditoria Externa profunda baseada em Intelligent Tutoring Systems (ITS).

**Resumo da Mudança:** A pedido da direção, o projeto sofreu um "pivot" mental. Paramos de enxergar o Matemágica como um "aplicativo de listas de exercícios" e passamos a arquitetá-lo como um **Sistema Operacional Cognitivo movido a um Grafo de Conhecimento.**
*   **Documento Mestre Criado:** `docs/arquitetura/MAB_MATEMAGICA_ARCHITECTURE_BIBLE.md`.
*   **Aviso ao Claude:** Você DEVE ler o `MAB_MATEMAGICA_ARCHITECTURE_BIBLE.md` antes de qualquer refatoração. A partir de agora, não geraremos milhares de exercícios em código. Focaremos em desenvolver **Templates de Experiência (Kinds)** e **Microcompetências (Nós de Conhecimento)**, permitindo que o motor as combine exponencialmente. O foco não é "qual é o conteúdo", mas "qual é a arquitetura que permite ensinar qualquer conteúdo".

### 6. 🥋 ATUALIZAÇÃO DO MODO DOJO (SELEÇÃO LIVRE)
**Data:** 19/07/2026
Foi adicionada uma diretriz importante sugerida pela direção: O **Dojo** não será estritamente automático. Além do algoritmo ditar o treino com base nas microcompetências em estado de "Automação", haverá o **Modo de Seleção Livre**. A criança poderá entrar no Dojo e escolher proativamente o que quer treinar (ex: "Quero treinar tabuada do 7" ou "Quero treinar adição com vai um"). Isso empodera a criança, dá autonomia e permite que ela se desafie por conta própria. A `MAB_MATEMAGICA_ARCHITECTURE_BIBLE.md` foi atualizada com essa premissa.
