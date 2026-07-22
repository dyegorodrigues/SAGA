# 📖 MAB - Matemágica Architecture Bible (A Constituição do Sistema)

**O ÚNICO DOCUMENTO QUE GOVERNA TODOS OS AGENTES E CÓDIGOS.**
*Inspirado nas arquiteturas de Intelligent Tutoring Systems (ITS) e Knowledge Graphs.*

---

## 1. O Paradigma: Sistema Operacional Cognitivo

O Matemágica AI **NÃO** é um aplicativo de listas de exercícios. Ele é um **Sistema Operacional de Aprendizagem (Data-Driven)**. 

### A Regra de Ouro da Geração por IA:
Agentes de IA (Claude, Gemini, etc.) **NUNCA** devem escrever milhares de exercícios hardcoded. A IA deve trabalhar na criação e refinamento de **Competências (Nós de Conhecimento)** e **Templates de Experiência**. O aplicativo (Runtime) gera o conteúdo na hora, conectando o nó ao template.

---

## 2. A Arquitetura de 6 Camadas

Todo o código fonte e as futuras refatorações do Claude DEVEM respeitar esta separação estrita de responsabilidades:

1.  **CORE (`/src/core/`)**: O cérebro agnóstico. Gerencia sessões, perfis de usuário, fila de sincronização offline (CRDT), cálculo de Elo e gestão do Grafo de Conhecimento. *Não contém regras de matemática.*
2.  **KNOWLEDGE (`/src/knowledge/`)**: O "DNA" do currículo. Arquivos descritivos (JSON/TS) contendo centenas de microcompetências. Define o que ensinar, pré-requisitos, erros comuns e intervenções esperadas.
3.  **PEDAGOGY (`/src/pedagogy/`)**: As regras do ensino. Define quando mostrar um *Worked Example* (Tutorial), quando enviar para o *Dojo* (Automação), e quando acionar o *Frustration Engine* (Acolhimento).
4.  **EXPERIENCE / KINDS (`/src/components/kinds/`)**: As interfaces visuais genéricas. Múltipla Escolha, Drag-and-Drop, Reta Numérica, Material Dourado. *Eles não sabem qual é a conta, apenas recebem os dados e renderizam a interação.*
5.  **CONTENT / TEMPLATES (`/src/templates/`)**: O elo entre Knowledge e Experience. Um template diz: "Para ensinar Parte-Todo, use o Kind DragAndDrop, gere 5 maçãs, e a mecânica é dividir em dois cestos".
6.  **AI GENERATORS (`/src/lib/ai/`)**: Funções que alimentam os templates em tempo de execução, mudando a "Engenharia da Curiosidade" (trocando maçãs por dinossauros se o usuário gostar de dinossauros).

---

## 3. O Grafo de Microcompetências (Knowledge Graph)

O ensino abandona o formato linear (`Capítulo 1 -> Capítulo 2`) e adota o Grafo de Dependências. 
A adição não é um monólito. É o final de uma esteira:

`Atenção Visual` ➔ `Subitização` ➔ `Correspondência 1:1` ➔ `Cardinalidade` ➔ `Conservação` ➔ `Parte-Todo` ➔ **`Adição Numérica`**

*Ação Técnica:* O sistema usará IDs estruturados (ex: `M-NUM-SUBIT-01`) para cada nó. Se a criança errar a adição, o sistema desce a árvore até descobrir qual microcompetência base falhou.

---

## 4. O Ciclo de Domínio (Os 5 Estados)

O sistema não usa apenas o binário "Acertou / Errou". Cada microcompetência possui 5 estados de maestria. A UI e a pedagogia mudam de acordo com o estado da criança no grafo:

1.  **Descoberta:** O sistema usa *Worked Examples* (o tutor resolve junto com animação pesada).
2.  **Compreensão:** A criança resolve problemas de lógica com manipulativos visuais (CPA - Concreto/Pictórico).
3.  **Consolidação:** A criança usa representações abstratas (números e símbolos).
4.  **Automação (O Dojo):** Treino de alta velocidade, restrição de tempo, foco em memória aritmética (recuperação de fatos).
    *   **Seleção Livre vs. Algorítmica:** O Dojo operará em modo dual. (1) Modo Algoritmo: foca nas áreas onde o sistema detectou que a criança precisa de consolidação em velocidade. (2) Modo Autonomia (Seleção Livre): A criança escolhe ativamente qual módulo aritmético quer jogar para bater seu próprio recorde (ex: "Quero treinar tabuada do 7 hoje"). Isso gera agência e engajamento.
5.  **Transferência:** Resolver "Word Problems" complexos usando a competência num cenário diferente.

---

## 5. Taxonomia do Erro e O Frustration Engine

Errar `7 + 5` não significa não saber somar. A arquitetura exige que os validadores interceptem o *tipo* de erro para fornecer o feedback correto:

*   **Erro de Contagem:** Contou a mesma maçã duas vezes. *Intervenção: Voltar para a mecânica tátil onde o objeto some ao ser tocado.*
*   **Erro de Recuperação (Esquecimento):** Errou `6x7`. *Intervenção: Não reensinar matrizes, apenas revisar os Amigos do 10 e derivações lógicas.*
*   **Erro de Hesitação (Frustration Engine):** Criança não clica em nada por 15 segundos. *Intervenção: Pausa visual, respiração, e o tutor pisca a área correta sem punição de ELO.*
