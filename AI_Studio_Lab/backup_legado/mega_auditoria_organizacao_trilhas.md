# 🔍 Mega Auditoria: Organização, Sequenciamento e Micro-Tutoriais

## 1. O Problema das Peças Soltas
Foi relatado que as trilhas ("O que vem depois", "Padrões lógicos", "Onde está", etc.) pareciam não se conectar à evolução da Matemática, ou não tinham seus códigos, ou pareciam "jogadas" ao acaso. 
A sensação de "falta de coerência" ocorre quando a arquitetura pedagógica não está refletida na interface do usuário (UI) ou na estrutura de dados do aplicativo.

## 2. A Solução Aplicada na Base de Código
Nós unificamos o `curriculum.ts` (A Bíblia do Matemágica) e o componente de UI `LearningPath.tsx` (O Mapa de Ilhas). 

### A Estrutura de "Ilhas"
Não temos mais uma lista gigantesca e misturada de trilhas. O aprendizado da criança (Jardim/Pré-escola) está dividido em **Ilhas Temáticas (Módulos)** rigorosamente organizadas. Uma criança não estuda "Adição" na mesma semana que estuda "Onde Está". 

Veja como a **Lógica Organizacional** foi implementada no código (que já está no app):

*   **🏝️ Ilha 1: Alfabetização Numérica (A Base Primordial)**
    *   *Trilhas Inclusas:* `C000A` Canto Numérico, `C000B` Símbolos Numéricos, `C0001` Contar, `C0003` Caixa Mágica, `C0001_B` Olhômetro.
    *   *Lógica:* Conectar o som, o símbolo e a quantidade da forma mais rápida possível (Subitização).

*   **🏝️ Ilha 2: Noções de Grandeza (Pré-Cálculo)**
    *   *Trilhas Inclusas:* `C0005` Comparar Visual, `C0006` O Que Vem Depois.
    *   *Lógica:* Entender "maior/menor" e "antes/depois" (Ordenação). Sem isso, a subtração no futuro é impossível de compreender.

*   **🏝️ Ilha 3: Raciocínio Lógico & Espaço (Pensamento Computacional)**
    *   *Trilhas Inclusas:* `C_LOG1` Formas Geométricas, `C_ESP1` Onde Está?, `C_LOG2` Padrões Lógicos, `C_LOG3` Qual o Intruso?.
    *   *Lógica:* Esta ilha não ensina "números". Ela ensina a **pensar, classificar e localizar**. É a base da cognição.

*   **🏝️ Ilha 4: Noções de Tempo**
    *   *Trilhas Inclusas:* `C_TMP1` Calendário.
    *   *Lógica:* Mundo real. Quando a criança entende "ontem/hoje/amanhã", ela se prepara para ler "probleminhas" de matemática no 1º Ano.

*   **🏝️ Ilha 5: Primeiras Operações (Transição CRA)**
    *   *Trilhas Inclusas:* `C0101` Juntar e Somar, `C0201` Tirar e Esconder.
    *   *Lógica:* O fim da Pré-escola. Juntar grupos (concreto) antes de ver a equação `3+2` (abstrato).

Essa organização dita exatamente **ONDE** cada microcompetência vive. Nada está misturado.

## 3. Códigos e Hierarquia Transparente
Para garantir que a "arquitetura de engenharia" nunca mais se perca:
- Atualizamos o `src/types.ts` para que toda Trilha obrigatoriamente tenha a propriedade `graphId` (ex: `C0001`) e a propriedade `island` (ex: `alfa`, `logica`, `op`).
- No aplicativo, acima do nome de cada trilha (ex: "Símbolos Numéricos"), o `graphId` aparece em cinza claro (`C000B`). Pais, pedagogos e engenheiros sabem exatamente em que nó do grafo a criança está pisando.

## 4. O Mistério dos "Exercícios Duplicados" (Caixa Mágica x Amigos)
Não é erro de geração, é o **Método de Singapura**.
- **Caixa Mágica (`C0003` - Ilha Alfa):** A tela mostra uma grade 2x5 com 6 bolinhas. A pergunta é "Quantos você vê?". A criança bate o olho e fala "6" sem contar um por um (Subitização).
- **Amigos dos Números (`C0104` - Ilha Operações):** A tela mostra a mesma grade 2x5 com 6 bolinhas. Mas a pergunta é "Quantos FALTAM para encher a caixa (fazer 10)?". A criança conta os buracos vazios (4). Isso é "cálculo mental asiático" (Composição/Decomposição).
A *ferramenta visual* é a mesma (a caixa), mas a *habilidade mental* (a microcompetência) é totalmente diferente e treinada em Ilhas (épocas) diferentes.

## 5. Micro-Tutoriais, Telemetria e Lacunas ("O que falta fazer?")
Na sua auditoria, você identificou corretamente "buracos" críticos que o app ainda não tem e precisa desenvolver:

1.  **Falta do Scaffolding Visual (A Mão Fantasma):**
    *   *O Buraco:* A criança entra na trilha nível 1 e o exercício já espera que ela saiba o que arrastar ou clicar.
    *   *Plano Desenvolvido:* O motor do jogo precisará de um estado de "Tutorial". Se for o nível 1 daquela microcompetência, a IA faz primeiro (I Do) com uma animação guiada e bloqueia o erro da criança (We Do).
2.  **Falta da Telemetria de Ajuda (O clique na dúvida):**
    *   *O Buraco:* Se a criança erra, fecha, pula ou clica 10 vezes no mascote para ouvir a explicação, isso não afeta o progresso dela hoje.
    *   *Plano Desenvolvido:* Já incluímos `helpClicks` e `skips` na interface `Progress` (no código TypeScript). O motor de Repetição Espaçada usará isso para saber: "A criança passou de fase, mas precisou de muita ajuda. Vou colocar esse exercício de novo amanhã".

## 6. O Compromisso
A estrutura documental primária (`ARQUITETURA_PEDAGOGICA_COMPLETA.md`) foi gerada e gravada na pasta de laboratório (`/AI_Studio_Lab/pedagogia/`), servindo como nossa fonte única de verdade. Nela, detalhamos o porquê pedagógico de CADA etapa, a escala CRA e os fluxos de tutorial. A bagunça estrutural das trilhas no código e na UI foi resolvida e higienizada, respeitando rigorosamente a organização de Ilhas.
