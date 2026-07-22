# 📖 MAB - Matemágica Architecture Bible (A Constituição do Sistema)

**O ÚNICO DOCUMENTO QUE GOVERNA TODOS OS AGENTES E CÓDIGOS.**
*Inspirado nas arquiteturas de Intelligent Tutoring Systems (ITS) e Knowledge Graphs.*

## 1. O Paradigma: Sistema Operacional Cognitivo
O Matemágica AI **NÃO** é um aplicativo de listas de exercícios com conteúdo fixo. Ele é um **Sistema Operacional de Aprendizagem (Data-Driven)**. A arquitetura foi desenhada para separar estritamente **o que a criança aprende (Competência)** de **como ela aprende (Experiência)**. 

### A Regra de Ouro da Geração por IA:
Agentes de IA (Claude, AI Studio, etc.) **NUNCA** devem escrever milhares de exercícios hardcoded. A IA deve trabalhar na criação e refinamento de **Competências (Nós de Conhecimento)** e **Templates de Experiência**. O aplicativo (Runtime) gera o conteúdo na hora, conectando o nó ao template dinamicamente (Engenharia da Curiosidade, alterando maçãs para dinossauros se a criança preferir).

---

## 2. A Arquitetura de 6 Camadas
Todo o código fonte e as futuras refatorações DEVEM respeitar esta separação estrita de responsabilidades:

1.  **CORE (`/src/core/`)**: O Cérebro. Gerencia estado, fluxo, progressEngine (rastreia nível 0 a 7), sessionManager, fila de sincronização offline (CRDT/Firestore) e cálculo de maestria. Não contém matemática hardcoded.
2.  **KNOWLEDGE (`/src/knowledge/`)**: O "DNA" do currículo (O Grafo de Competências). Arquivos descritivos (JSON/TS) contendo centenas de microcompetências. Define o que ensinar, pré-requisitos, representações (dedos, blocos, frutas), estratégias e erros esperados. Ex: `M-NUM-SUBIT-01`.
3.  **PEDAGOGY (`/src/pedagogy/`)**: O Motor Pedagógico. Define regras de intervenção baseadas em evidências: quando mostrar um *Worked Example* (Tutorial), quando enviar para o *Dojo* (Automação), progressão visual obrigatória *CRA (Concrete -> Representational -> Abstract)*, e quando acionar o *Frustration Engine* (Acolhimento).
4.  **EXPERIENCE / KINDS (`/src/components/kinds/`)**: As interfaces visuais genéricas. Múltipla Escolha, Drag-and-Drop, Reta Numérica, Material Dourado. *Eles não sabem qual é a conta, apenas recebem os dados e renderizam a interação.*
5.  **CONTENT / TEMPLATES (`/src/templates/`)**: Fábricas de exercícios. O elo entre Knowledge e Experience. Um template diz: "Para ensinar Parte-Todo, use o Kind DragAndDrop, gere 5 maçãs, e a mecânica é dividir em dois cestos".
6.  **AI GENERATORS (`/src/lib/ai/`)**: Funções que alimentam os templates em tempo de execução, mudando a "Engenharia da Curiosidade" (contextualização do problema de forma lúdica).

---

## 3. O Grafo de Microcompetências (Knowledge Graph) e a UI ("Mapa de Ilhas")
O ensino abandona o formato linear (`Capítulo 1 -> Capítulo 2`) e adota o Grafo de Dependências. A adição não é um monólito. É o final de uma esteira:
`Atenção Visual` ➔ `Subitização` ➔ `Correspondência 1:1` ➔ `Cardinalidade` ➔ `Conservação` ➔ `Parte-Todo` ➔ **`Adição Numérica`**

- Se a criança erra a adição, o sistema desce a árvore até descobrir qual microcompetência base falhou.
- A criança **não vê o grafo**. A UI principal (`KidHomeScreen`) deve ser um "Caminho de Aprendizagem" ou "Mapa de Ilhas" linear e envolvente (estilo "Duolingo").
- Cada "fase" nesse mapa é gerada dinamicamente pelo algoritmo (`sessionManager`).

---

## 4. O Ciclo de Domínio e a Sessão Diária
Uma criança não deve ficar presa "um século na adição". O tempo é distribuído dinamicamente na sessão (aprox. 15-20 minutos). O sistema não usa apenas "acertou ou errou", ele rastreia os níveis (0 a 7).

### Estrutura da Sessão (Flow)
1. **Abertura Curta**: Mascote apresenta a missão do dia baseada no interesse da criança.
2. **Descoberta / Microtutorial (Worked Example)**: IA demonstra (Nível 0-1) com animação (20-40 segundos de "think aloud").
3. **Prática Guiada (Compreensão)**: A criança resolve problemas de lógica com manipulativos visuais (CPA - Concreto/Pictórico) e feedback imediato (Nível 2-3).
4. **Consolidação e Abstração**: Transição para numerais e símbolos abstratos (Nível 4).
5. **Automação (O Dojo)**: Treino de alta velocidade, restrição de tempo, foco em memória aritmética (recuperação de fatos). Sem explicações longas, ritmo de videogame (Nível 5-7).
   - **Modo Dual**: (1) Modo Algoritmo foca em áreas de necessidade. (2) Modo Autonomia permite seleção livre pela criança.
6. **Transferência (Mini-revisão)**: Resolver "Word Problems" complexos em cenários diferentes. Recuperação espaçada (Spaced Retrieval).
7. **Encerramento**: Ganho visível (XP, evolução do mascote).

---

## 5. Taxonomia do Erro e O Frustration Engine
Errar `7 + 5` não significa não saber somar. A arquitetura exige que os validadores interceptem o *tipo* de erro para fornecer o feedback correto:
- **Erro de Contagem:** Contou a mesma maçã duas vezes. *Intervenção: Voltar para a mecânica tátil onde o objeto some ao ser tocado. Restrição de duplo-toque (UX).*
- **Erro de Recuperação (Esquecimento):** Errou `6x7`. *Intervenção: Não reensinar matrizes, apenas revisar os Amigos do 10 e derivações lógicas. Voltar ao visual (Blocos/Ten-Frames).*
- **Erro de Hesitação (Frustration Engine):** Criança não clica em nada por 15 segundos. *Intervenção: Pausa visual, respiração, e o tutor pisca a área correta (dica passiva) sem punição de ELO.*

## 6. Governança e Regras Críticas (Correções Urgentes)
### Nivelamento Inicial (Assessment) - Proteção Cognitiva
- **Bloqueio de Idade Base**: Crianças de 4-5 anos (Iniciantes) **jamais** devem receber subtração abstrata ou números acima de 10 na primeira avaliação.
- O Assessment deve iniciar na base do grafo (Subitização, Cardinalidade, Comparação Maior/Menor). A sondagem é progressiva. Erros no assessment devem causar acolhimento suave, não "telas vermelhas".

*Nota: Todas as implementações no código (React/Vite) devem consultar este documento antes de criar novas trilhas ou exercícios estáticos.*
