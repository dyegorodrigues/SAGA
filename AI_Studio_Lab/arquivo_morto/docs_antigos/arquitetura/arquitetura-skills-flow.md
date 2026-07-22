# 🛰️ O Flow Engine & A Engenharia de Skills de IA

**O blueprint de arquitetura de software, engajamento neurológico (Flow) e orquestração de Inteligência Artificial para o ecossistema Matemágica AI.**

---

## 1. O CONCEITO DE "FLOW ENGINE" (Engajamento Neuropsicológico)

O estado de **Flow (Fluxo)** — teorizado por Mihaly Csikszentmihályi — é a zona mental ideal onde uma pessoa está tão imersa em uma atividade que o tempo parece parar. Para uma criança de 4 a 7 anos, o Flow é a chave para o aprendizado sem exaustão ou estresse.

No Matemágica AI, o **Flow Engine** é uma máquina de estado reativa que orquestra o equilíbrio perfeito entre o desafio cognitivo e a resposta emocional da criança.

### 1.1. O Loop Sensorial e Reativo (Anatomia do Clique)
Cada micro-interação no jogo é desenhada para dar à criança uma sensação de controle absoluto e feedback físico imediato:

1.  **Estímulo de Entrada (O Som vem primeiro):** Em dispositivos infantis, a leitura é secundária. O áudio do comando espacial (*"Encontre o amigo do 8!"*) toca automaticamente na entrada.
2.  **O Spotlight Visual (Foco TDAH-friendly):** O fundo do app é de um azul-escuro profundo e cósmico, ou off-white extremamente limpo, com zero poluição visual. Não há menus saltitantes, propagandas ou barras desnecessárias de status durante o exercício. Apenas o problema pedagógico brilha no centro.
3.  **Resposta Física (O Clique Reativo):** Ao tocar em uma resposta, a tela vibra sutilmente (haptic feedback) e o elemento emite um som harmônico curto (agudo para acerto, grave suave para erro), garantindo o fechamento sináptico imediato da ação.
4.  **Feedback Emocional Gradual (Streak & Comemoração):**
    *   *Acerto em sequência (Streak):* Os elogios falados ficam **mais curtos** e o ritmo acelera. A Luna não faz festa a cada acerto banal para não quebrar a velocidade do raciocínio da criança.
    *   *Quebra de Streak:* O sistema desacelera suavemente, muda o tom de voz para acolhimento e oferece uma pista visual.

---

### 1.2. O Algoritmo Adaptativo de Dificuldade (ZDP Ativa)
O coração matemático do GameLoop decide a próxima pergunta em menos de 5 milissegundos offline:

*   **A Regra da ZDP (Zona de Desenvolvimento Proximal):**
    *   Se a criança acerta **3 vezes consecutivas** com tempo de resposta baixo (latência < 3s): a dificuldade sobe um sub-nível (ou insere um distrator mais complexo).
    *   Se a criança erra **2 vezes consecutivas** (ou demora mais que 20 segundos por trial): o sistema aciona um recuo didático ativo (downgrade invisível). O exercício atual é pausado, e uma micro-demonstração com o tutorial visual 💡 entra em cena automaticamente.
*   **A Curva Kumon de Automação:** Após o domínio de um conceito (nível 5), a trilha abre o **Dojo de Velocidade (Modo Relâmpago ⚡)**, onde o foco não é mais compreender a lógica, mas sim diminuir a latência do reflexo mental.

---

### 1.3. O Sistema Tamagotchi (Mascotes com Vida)
O mascote (Herói/Dragão/Beast) não é um adesivo estático. Ele representa a própria jornada da criança:

*   **Evoluções de Impacto:** O mascote evolui visualmente em marcos matemáticos profundos, e não apenas por "tempo de jogo".
*   **Sprites de Altíssima Performance (Sem Sobrecarga de Hardware):**
    *   *O Problema:* Usar animações 3D pesadas ou arquivos de vídeo drena a bateria de aparelhos de baixo custo comuns em escolas públicas brasileiras.
    *   *A Solução:* **CSS Sprite Sheets em PNG de baixa amostragem** (orquestrados via código). O mascote é desenhado em uma folha de poses estáticas (idle, comemoração, sono, fadiga). O React simplesmente altera o `background-position` do elemento CSS baseado no estado do jogo. Isso roda a 60 FPS estáveis mesmo em processadores de entrada antigos de 100 dólares.
*   **Integração com Cenários Vivos:** O mascote habita o cenário pedagógico da atividade (ex: se é o Senhor do Tempo, o dragãozinho dorme quando o céu escurece na órbita, criando consistência lógica absoluta).

---

## 2. A ENGENHARIA DE "SKILLS" DE IA (O Segredo do Orquestrador)

Uma dúvida comum no desenvolvimento de produtos com IA é: *"A criação de arquivos de 'Skills' de IA limita o desenvolvimento ou o liberta?"*

**A resposta técnica:** **Liberta exponencialmente.**

No desenvolvimento convencional com LLMs, tentar injetar todas as regras de pedagogia, todas as estruturas de código do GameLoop e toda a matriz curricular dentro de um único "System Prompt" causa **Sobrecarga de Contexto (Context Overload)**, degradação cognitiva da IA e alucinações de código.

### 2.1. O que é uma "Skill" no Ecossistema Matemágica AI?
Uma Skill é um **módulo de memória de longo prazo externalizado e estruturado** (guardado como arquivos markdown claros na pasta do projeto). 
Ao invés do LLM carregar todo o peso do projeto, ele carrega apenas os "contratos" e "conceitos de ferro" necessários para a ação imediata. Isso transforma o agente em um **Arquiteto Altamente Especializado**.

### 2.2. O Mapa de Skills a Serem Implementadas e Evoluídas

Para que o Matemágica atinja consistência absoluta de engenharia e didática, estruturamos 4 Skills-Core fundamentais no repositório:

```
                                [ AGENTE DE IA ]
                                       |
                +----------------------+----------------------+
                |                      |                      |
      [ SKILL: Didática CPA ]  [ SKILL: Motor GameLoop ]  [ SKILL: Sincronia GitHub ]
      - Regras de Singapura    - Máquina de Estados     - Auditoria reversa de código
      - Layouts de cena SVG    - Gestão de trials/ZDP   - Prevenção de concorrência
      - Didática de conceitos  - Análise de latência    - Resolução de conflitos
```

#### 1. Skill: `pedagogia-cpa-singapura` (`/skills/math/cpa-singapura.md`)
*   **Responsabilidade:** Garantir que nenhuma atividade matemática nasça abstrata.
*   **Conteúdo:** O dicionário visual de como traduzir números e equações em elementos de cena viva (Number Bonds de Singapore, Ten-Frames, representações de frações e material dourado).

#### 2. Skill: `estado-gameloop-offline` (`/skills/architecture/gameloop-offline.md`)
*   **Responsabilidade:** Definir o comportamento inabalável do fluxo de telas e trials.
*   **Conteúdo:** A máquina de estados finitos do React, as regras de cálculo de ELO, os gatilhos de transição para o Dojo de Fluência e a gestão de fila de sincronização em segundo plano (Firebase Sync).

#### 3. Skill: `luna-estudio-tts-pacing` (`/skills/audio/pacing-estudio.md`)
*   **Responsabilidade:** Harmonização vocal e roteiros de feedback.
*   **Conteúdo:** Regras de coarticulação fônica (impedir o TTS de soletrar letras mudas incorretamente, como pronunciar o "H" ou truncar sílabas), pacing de fala para crianças mais novas e mapeamento do banco de AudioSprites.

#### 4. Skill: `auditoria-sincronizacao-reversa` (`/skills/devops/git-sync-audit.md`)
*   **Responsabilidade:** Sincronização e segurança do codebase em ambientes multi-IA e colaborativos.
*   **Conteúdo:** Protocolos de revisão byte-a-byte, checagem de integridade de índice Git local e geração automática de relatórios de auditoria pedagógica e técnica (impede sobrescrever código alheio).

---

## 3. PROTOCOLO DE COLABORAÇÃO & AUDITORIA DE CÓDIGO (Sem Perda de Insights)

Para manter o projeto 100% íntegro e sincronizado, estabelecemos a seguinte árvore de documentos onde a inteligência do projeto é guardada, impedindo que qualquer insight se perca entre as conversas:

### 3.1. Onde Guardar Cada Informação

| Documento | Função Principal | Como Alimentar / Atualizar |
|---|---|---|
| **`/docs/metodo-matemagica.md`** | **A Alma Pedagógica:** O "como pensamos", o framework de Singapura, a receita das trilhas, e agora a didática científica da adição. | Atualizar ao descobrir novos insights de ensino ou expandir matérias (ex: didática da multiplicação ou fonética). |
| **`/.claude/PROPOSTAS_AVANCADAS_MATEMAGICA.md`** | **O Cérebro da Engenharia:** Arquitetura em camadas, o Flow Engine, processamento em lote (Batch AI), e o ecossistema de Skills. | Atualizar ao redesenhar módulos do sistema, estruturas de dados ou modelos de persistência. |
| **`/docs/sala-de-situacao.md`** | **A Torre de Controle:** Progresso de desenvolvimento em tempo real, bugs mapeados, tarefas na fila, congelador de matérias e próximos passos imediatos. | Atualizar obrigatoriamente a cada ciclo de refatoração ou testes práticos com as crianças (Benjamin/Heitor). |
| **`/docs/curriculo-mestre.md`** | **O Mapa do Conhecimento:** A Skill Tree visual, dependências de pré-requisitos (`prereqs`) e mapeamento das habilidades BNCC por idade. | Atualizar ao cadastrar ou reorganizar a ordem de exibição das trilhas do aplicativo. |

---

### 3.2. Sincronização em Tempo Real (AI Studio ↔ GitHub)

Quando você altera arquivos fora do Google AI Studio (ex: editando diretamente no GitHub ou via scripts locais no seu aparelho):

1.  **Auditoria Prévia (Puxar as Alterações):** No AI Studio, antes de fazer qualquer alteração técnica, rodamos um script de auditoria para comparar o estado atual da branch de nuvem com os arquivos locais.
2.  **Rastreador de Mudanças Pedagógicas:** Criamos um agente auditor (nossa própria thread) que varre as pastas de `/src/subjects/` e `/src/components/` analisando diferenças significativas (diffs).
3.  **Relatório de Impacto:** Quaisquer mudanças no comportamento do jogo são documentadas na hora no arquivo `docs/sala-de-situacao.md` para garantir que o fluxo de trabalho permaneça limpo, transparente e à prova de regressões visuais ou lógicas.
