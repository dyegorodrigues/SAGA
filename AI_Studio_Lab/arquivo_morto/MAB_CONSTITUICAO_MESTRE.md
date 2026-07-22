# 📖 MAB - Matemágica Architecture Bible (A Constituição Mestre)

**A BÍBLIA CONSOLIDADA DO PROJETO MATEMÁGICA AI**
*Este é o documento unificado que governa todos os Agentes de Inteligência Artificial. Ele funde a Visão (A Bíblia), O Método (Learning Trajectories), A Arquitetura de Software (As 6 Camadas), O Motor de Flow e O Acordo Multi-IA.*

---

## 🏛️ PARTE I: A VISÃO E OS PRINCÍPIOS INEGOCIÁVEIS (A Ética)
O Matemágica não é apenas um "aplicativo de matemática" com listas de exercícios fixos. Ele é um **Sistema Operacional de Aprendizagem (Data-Driven)** nascido para Heitor e Benjamin, com o objetivo de fazer pela aprendizagem o que os melhores modelos do mundo fazem.

1. **A dificuldade é problema do sistema, nunca da criança.** O app adapta (ZDP); ela nunca é rotulada.
2. **Nada pune.** O mascote nunca morre, nunca regride. Erro vira revisão, não castigo.
3. **Anti-vício por design.** Sessões curtas, limite gentil, ritual de encerramento.
4. **A voz é inclusão.** Tudo pode ser ouvido (TTS).
5. **Neutralidade absoluta** em temas sociais. Ensina-se o processo.
6. **Privacidade sagrada.** Sem gravação de voz ou dados não essenciais.
7. **Regra de Ouro da Geração por IA:** A IA NUNCA deve escrever milhares de exercícios hardcoded. A IA cria **Competências** e **Templates**. O aplicativo gera o conteúdo em tempo de execução via *Geradores Procedurais*.

---

## 🧬 PARTE II: O MÉTODO MATEMÁGICA (A Máquina de Criar Trilhas)
*Baseado em Learning Trajectories (Clements & Sarama)*

Toda trilha de aprendizado segue 3 componentes científicos:
1. **O Objetivo** (A grande meta).
2. **A Progressão** (Os degraus naturais, do novato ao expert).
3. **As Atividades Casadas** (Nossos geradores procedurais que empurram do N para N+1).

### Os Princípios de Criação de Trilhas:
- **Degrau Zero**: Identificar o pré-requisito invisível (ex: antes de ler letras -> ouvir sons).
- **Sem Pulos Mágicos**: Todo erro revela um degrau ausente. Se errou adição abstrata, volte para representações concretas.
- **CPA Obrigatório**: Concreto (Mãos/Maçãs) -> Pictórico (Desenhos/Símbolos) -> Abstrato (Números).
- **O Tamanho do Passo**: Cada nível (1 a 5) treina APENAS uma variável nova.

---

## 🏗️ PARTE III: A ARQUITETURA DE SOFTWARE (As 6 Camadas)
*Motor agnóstico, conteúdo plugável. A lógica de matéria JAMAIS entra no núcleo.*

1.  **CORE (`/src/core/`)**: O Cérebro. Gerencia estado, progressEngine (níveis 0 a 7), sessionManager, fila de sincronização offline e ZDP (Zona de Desenvolvimento Proximal). *Não sabe matemática.*
2.  **KNOWLEDGE (`/src/knowledge/`)**: O Grafo de Competências. O "DNA". Arquivos JSON/TS com microcompetências (ex: `M-NUM-SUBIT-01`), pré-requisitos e erros esperados.
3.  **PEDAGOGY (`/src/pedagogy/`)**: O Motor Pedagógico. Define intervenções, Worked Examples (tutorias), CRA, e aciona o Frustration Engine.
4.  **EXPERIENCE / KINDS (`/src/components/kinds/`)**: Renderizadores universais (count, options, scene, money, picto). *Não sabem qual é a conta, apenas renderizam.*
5.  **CONTENT / TEMPLATES (`/src/templates/`)**: Fábricas. O elo entre Knowledge e Experience.
6.  **AI GENERATORS (`/src/lib/ai/`)**: Funções que alimentam os templates em tempo de execução ("Engenharia da Curiosidade").

---

## 🧠 PARTE IV: O FLOW ENGINE E A ARQUITETURA PEDAGÓGICA (O Exercício)
O estado de *Flow* orquestra o equilíbrio entre desafio e resposta emocional.

### O Ciclo de Vida Universal de um Exercício:
1. **Introdução (Opcional):** Mascote apresenta o conceito.
2. **Demonstração:** `howto` falado + tutorial visual (a mãozinha que conta).
3. **Prática (Trial):** Estímulo de entrada (Som primeiro) -> Spotlight Visual TDAH-friendly -> Resposta Física (Haptic/Vibração) + Som harmônico.
4. **Feedback:** Acerto (curto, acelera o ritmo no Streak). Erro (ensina estratégia, Frustration Engine evita rage-clicks).
5. **Fixação:** Revisão espaçada (Spaced Retrieval) até o Domínio Absoluto.

### Taxonomia do Erro e O Frustration Engine:
- **Erro de Contagem:** Contou 2x. *Voltar tátil, evitar duplo clique.*
- **Erro de Recuperação:** Esqueceu tabuada. *Revisar Amigos do 10.*
- **Hesitação (15s parado):** Criança travada. *Dica passiva e respiração guiada, sem punição de ELO.*

### A Sessão Diária:
Aprox. 15-20 min. Abertura -> Microtutorial -> Prática Guiada -> Dojo (Fluência/Velocidade) -> Mini-revisão (Transferência) -> Encerramento.

---

## 🔀 PARTE V: PROTOCOLO MULTI-IA (AI Studio ↔ Claude)
Para evitar o efeito "telefone sem fio":
- **AI Studio:** Arquiteto principal, UX, Pedagogo. Fica no navegador.
- **Claude:** Editor-chefe externo, codificador de componentes pesados.
- **A Regra de Ouro:** O Claude **nunca** sobrescreve heurísticas pedagógicas sem ler a documentação no `/AI_Studio_Lab/`.
- Todos os acordos, bugs e auditorias devem ser centralizados no `historico_sincronizacao_claude.md` e `mapa_do_projeto.md`.

---
*(Este documento funde perfeitamente: MAB_Matemagica_Architecture_Bible, biblia-do-matemagica, metodo-matemagica, arquitetura-pedagogica, arquitetura-skills-flow e fluxo-multi-ia, garantindo NENHUMA perda de conhecimento).*
