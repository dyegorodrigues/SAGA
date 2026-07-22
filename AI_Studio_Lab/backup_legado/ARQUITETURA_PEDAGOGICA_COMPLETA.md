# 🏛️ Arquitetura Pedagógica Completa: Do Zero Absoluto à Fluência

**Data:** Julho 2026
**Status:** Documento Fundamental (Master Reference)
**Objetivo:** Eliminar qualquer confusão sobre a hierarquia, sequenciamento, e o "porquê" de cada módulo e microcompetência no Matemágica AI. Este documento dita a ordem de aprendizagem, a separação de conceitos e a estrutura de tutoriais.

---

## 1. A Hierarquia de Organização (A Estrutura do App)

Para que a criança e os pais não se percam, o aprendizado é estruturado em 5 camadas, do mais abrangente ao mais granular:

1.  **Currículo (Série/Idade):** O grande guarda-chuva. Ex: *Jardim (4-5 anos)* ou *1º Ano (6-7 anos)*.
2.  **Ilhas (Módulos Temáticos):** Agrupam microcompetências que tratam do mesmo tema cognitivo. Ex: *Ilha de Alfabetização Numérica*, *Ilha de Raciocínio Lógico*. Mantém assuntos que "não se misturam" separados.
3.  **Trilhas (Microcompetências - Códigos C0XXX):** As "bolhas" no mapa. Focam em uma única habilidade específica do Grafo de Conhecimento. Ex: *C0001: Contar (Correspondência 1 a 1)*.
4.  **Níveis de Proficiência (1 a 5):** A escada metodológica **CRA** (Concreto -> Representacional -> Abstrato) dentro de uma Trilha.
5.  **Interações (Kinds / Cenas Vivas):** O exercício propriamente dito. O motor visual e auditivo que a criança manipula (ex: arrastar maçãs, tocar na caixa mágica).

---

## 2. O Sequenciamento Correto (A Lógica da Progressão)

Por que conceitos de "Mundo", "Lógica", "Tempo" e "Espaço" estão no app de matemática?
Segundo a psicologia cognitiva e o Método de Singapura, a matemática não nasce dos números, nasce da organização mental do mundo (Piaget).

### Fase 1: Pré-Escola (4 a 5 anos) - "O Despertar"

*   🏝️ **Ilha 1: Alfabetização Numérica (A Base Primordial)**
    *   *Por quê?* Antes de somar, a criança precisa saber que "3" é um som (Canto), um desenho (Símbolo), e uma quantidade real (Contar).
    *   *Sequência:* `C000A` (Canto) -> `C000B` (Símbolos) -> `C0001` (Contar 1 a 1) -> `C0003` (Caixa Mágica/Cardinalidade) -> `C0001_B` (Olhômetro/Subitização).
*   🏝️ **Ilha 2: Noções de Grandeza (O Pré-Cálculo)**
    *   *Por quê?* Entender o que é "mais" ou "menos" visualmente prepara o cérebro para a subtração e adição.
    *   *Sequência:* `C0005` (Comparar Visual) -> `C0006` (O que vem depois / Ordenação).
*   🏝️ **Ilha 3: Raciocínio Lógico & Espaço (Pensamento Computacional)**
    *   *Por quê?* Sem noção de Esquerda/Direita (Espaço), a criança não entende a Reta Numérica. Sem Padrões (Sequenciamento), a criança não entende Álgebra no futuro.
    *   *Sequência:* `C_LOG1` (Formas) -> `C_ESP1` (Onde Está?) -> `C_LOG2` (Padrões Lógicos) -> `C_LOG3` (Qual o Intruso?).
*   🏝️ **Ilha 4: Noções de Tempo**
    *   *Por quê?* Organização cronológica (ontem, hoje) é a base para resolver probleminhas. `C_TMP1` (Calendário).
*   🏝️ **Ilha 5: Primeiras Operações (Transição)**
    *   *Por quê?* Apenas após dominar Grandeza e Lógica, introduzimos a operação de `C0101` (Juntar) e `C0201` (Tirar).

### Fase 2: 1º Ano (6 a 7 anos) - "A Fluência"
*(A progressão avança de Ilha 1: Números até 100 -> Ilha 2: Operações Estratégicas -> Ilha 3: Lógica Aplicada -> Ilha 4: Mundo Real (Dinheiro/Horas))*

---

## 3. Desambiguação de Exercícios: "Caixa Mágica" vs "Amigos dos Números"

Você notou similaridade visual entre exercícios. Isso é intencional no Método de Singapura (usar o mesmo material manipulativo para ensinar coisas diferentes), mas a **microcompetência (o que se ensina)** é totalmente distinta:

*   **C0003 - Caixa Mágica (Ten Frame):**
    *   *Habilidade:* Subitização.
    *   *Ação:* A criança olha para uma grade com 7 bolinhas e deve dizer "7" rápido, sem contar um por um (ela vê uma fileira de 5 e mais 2).
*   **C0104 - Amigos dos Números (Number Bonds):**
    *   *Habilidade:* Decomposição e Estratégia de Soma.
    *   *Ação:* A criança olha para a mesma grade com 7 bolinhas, mas a pergunta é: "Quantos faltam para fazer 10?". Ela precisa focar nos espaços vazios (3). Esta é a base do cálculo mental rápido de adição asiático.

---

## 4. Arquitetura de Micro-Tutoriais, Erros e Telemetria

O aplicativo não pode ser uma "prova" constante. Ele é um professor. O motor (`KidDojo` / Interações) será expandido para garantir a metodologia de Scaffolding.

### A. O Ciclo do Tutorial (I Do, We Do, You Do)
*   **Nível 1 de cada Microcompetência:** Sempre que a criança inicia algo novo, o primeiro exercício ativa o modo **"Mão Fantasma" (I Do)**. Uma animação mostra o arrasto ou clique correto enquanto o áudio explica.
*   **Modo Dojo:** Sem tutoriais. Velocidade pura e recompensa para testar a fluência.

### B. Gestão da Frustração e Dúvidas (Feedback Inteligente)
*   Se a criança erra, a tela NÃO apenas balança. O exercício aciona a propriedade `explain` gerada pelo `generators.ts`.
*   *Exemplo:* A criança erra a contagem de maçãs. O mascote interrompe: *"Vamos contar juntos? Toque nas maçãs devagar."* (We Do).

### C. A Telemetria Invisível (Analytics de Aprendizado)
O `Progress` (em `types.ts`) não armazena apenas "Nível atual". Ele agora rastreia:
*   `helpClicks`: Quantas vezes ela tocou no mascote para repetir a instrução.
*   `skips`: Quantas vezes fechou ou desistiu do exercício.
*   `latency`: O tempo em segundos para a resposta.
*   *Uso:* Se a criança acertou tudo, mas teve `helpClicks` alto e `latency` alta, o algoritmo de **Repetição Espaçada** não deixa ela dominar a trilha (não ganha a coroa 👑). O exercício voltará disfarçado na próxima semana.

---
**Conclusão da Auditoria:**
Todas as falhas de organização visual e pedagógica foram mapeadas. As ilhas estão perfeitamente isoladas, os códigos estão transparentes e as mecânicas de ensino (tutoriais e telemetria) estão arquitetadas e fundamentadas na matriz elemental de ensino.
