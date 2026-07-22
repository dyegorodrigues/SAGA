# 📖 BÍBLIA PEDAGÓGICA UNIFICADA DO MATEMÁGICA AI (MAB)
**Única Fonte de Verdade (Single Source of Truth) - Julho 2026**

*Nota aos Agentes: Este documento substitui todos os manuais, blueprints e diretrizes anteriores. Toda lógica, currículo, regras de UI/UX, e metodologias estão fundidos aqui. Nunca recrie documentos paralelos.*

---

## 🏗️ 1. CONSTITUIÇÃO MESTRE (Filosofia e Diretrizes)
### 1.1 Público-Alvo e Linguagem
- **Faixa Etária**: 4 a 8 anos (Do Zero Absoluto à Fluência).
- **Linguagem**: PT-BR nativo, frases curtas, fonética impecável (GraphoGame).
- **Sem Punições Obscuras**: Errar é parte do processo. A UI não frita a criança. A IA usa o método *Scaffolding* (Mão Fantasma).
- **Zero Interface Administrativa Visível**: O aplicativo é mágico. Painéis de métricas e códigos (C0XXX) são camuflados ou vistos apenas por pais/professores.

### 1.2 O Método CRA e Singapura
A base matemática do aplicativo segue o **CRA (Concreto -> Representacional -> Abstrato)** e o cálculo mental rápido (Singapura).
1. **Nível 1 (Concreto/Tutorial)**: Manipulação simulada (arrastar maçãs reais). *I DO* (A máquina mostra).
2. **Nível 2 (Representacional)**: Uso de blocos, Caixas Mágicas (Ten Frames) e Number Bonds.
3. **Nível 3 (Transição)**: Imagens + Símbolos Matemáticos (+, -, =).
4. **Nível 4 (Abstrato)**: Apenas números e equações.
5. **Nível 5 (Fluência/Elite)**: O *Dojo* de velocidade (Cálculo Mental).

---

## 🗺️ 2. ARQUITETURA DO MAPA (As Ilhas Pedagógicas)
O aprendizado não é linear e maçante. É agrupado em **Ilhas Temáticas**. 
Uma Ilha só é destravada quando as competências raízes (prereqs) de outras ilhas são alcançadas (Interseção).

### 🏝️ Ilha 1: Alfabetização Numérica (O Zero Absoluto)
A fundação. Sem isso, nada existe.
- `C000A` Canto Numérico (Música e Ritmo).
- `C000B` Símbolos Numéricos (Reconhecimento visual 1-9).
- `C0001` Contar (Correspondência 1 a 1 - Arrasto com Lock).
- `C0003` Caixa Mágica (Subitização Inicial - Grade 2x5, bater o olho e ver quantidade).
- `C0001_B` Olhômetro (Subitização Rápida Flash).

### 🏝️ Ilha 2: Noções de Grandeza e Lógica Básica (Pré-Cálculo)
Ensinar o cérebro a classificar o mundo.
- `C0005` Comparar Visual (Mais / Menos).
- `C0006` O Que Vem Depois (Reta numérica primária).
- `C_LOG1` Formas Geométricas Básicas.
- `C_LOG2` Padrões Lógicos (Sequências AB, ABB).
- `C_LOG3` Qual é o Intruso? (Classificação por anomalia).
- `C_ESP1` Onde Está? (Navegação Espacial - Cima, baixo, dentro, fora).

### 🏝️ Ilha 3: O Despertar do Tempo e Realidade
- `C_TMP1` Calendário (Dias da Semana, Ontem, Hoje).
- `C_RL1` Sistema Monetário (Moedas Iniciais).
- `C_RL2` Relógio e Horas Básicas.

### 🏝️ Ilha 4: Primeiras Operações (Transição para o Abstrato)
*Requisito Mestre: Domínio de Grandeza (C0005) e Contagem (C0001).*
- `C0101` Juntar e Somar (Concreto - Juntando grupos).
- `C0201` Tirar e Esconder (Subtração Concreta).
- `C0006_B` Reta Numérica (Saltos).
- `C_NUM1` Dezenas e Unidades (Introdução ao Sistema Base 10).

### 🏝️ Ilha 5: Operações Estratégicas (A Fluência de Singapura)
*Requisito Mestre: Domínio Total das Operações Concretas.*
- `C0102` Soma (Counting On - Contar a partir do maior).
- `C0203` Subtração Lógica (Diferença na reta).
- `C0103` Amigos do 10 (Elite) - Base para soma de 2 dígitos rápidos.
- `C0104` Amigos dos Números (Number Bonds) - Decomposição mental.
- `C0106` Adição Vertical (Algoritmo Armado) *(Status Atual: Não implementado no código).*
- `C0206` Subtração Vertical *(Status Atual: Não implementado no código).*

### 🏝️ Ilha 6: Lógica Aplicada e Problemas
*A intersecção de todas as outras Ilhas.*
- `C_LOG4` Probleminhas de História (Textos curtos + áudio).
- `C_LOG5` Leitura de Gráficos Simples.

---

## ⚙️ 3. REGRAS DE DESIGN DE EXERCÍCIO E INTERAÇÃO (UX/UI)
1. **Touch Targets Gigantes**: Botões e áreas de clique precisam de min 80x80px (Tailwind `w-20 h-20`).
2. **Prevenção de Misclick**: A interface desabilita temporariamente os cliques durante áudios e transições.
3. **Ghost Hand (Mão Fantasma / I DO)**: O nível 1 de toda trilha DEVE iniciar travado para a criança, rodando uma animação de uma mão translúcida fazendo o exercício primeiro. *(Status: Requer implementação no motor `KidDojo`).*
4. **Feedback de Erro Sensível**: Se a criança erra, o mascote fala a `dica` (campo `explain` ou `howto`). A tela esconde opções absurdas para diminuir a carga cognitiva. Nenhuma punição severa de pontos (energia).
5. **Sem Lixo Visual (Anti-Slop)**: O canvas do exercício deve ser limpo, cores suaves, sem placares poluentes de "NÍVEL 34, XP 99000" gigantescos. O foco é na matemática.

---

## 📊 4. TELEMETRIA E PROGRESSÃO (O CÉREBRO)
O estado salvo no Firebase (`UserProgress`) não anota apenas se a criança acertou ou errou. Ele rastreia:
- `lvl` (Nível CRA atual de 1 a 5).
- `xp` / `elo` (Pontuação de fluência oculta).
- `helpClicks` (Contagem de vezes que a criança pediu ajuda ou dica ao Mascote).
- `skips` (Abandono do exercício no meio).
- `latency` (Tempo para a resposta final).

**Regra de Repetição Espaçada**: Uma Trilha só ganha o "Status de Domínio" (Coroa 👑 e `dom: true`) se o ELO for alto E o `helpClicks` no último nível for ZERO, com latência de resposta baixa (Fluência pura).

---

## 🛠️ 5. STATUS ATUAL DO CÓDIGO FONTE vs BÍBLIA (GAP ANALYSIS)
- **Implementado:** O motor de Kinds e Geradores (`src/utils/generators.ts`), UI de Ilhas (`LearningPath.tsx`), Mascote Responsivo (`Mascot.tsx`). A separação visual e a telemetria foram recém injetadas nas interfaces de tipos (`types.ts`).
- **Lacunas Críticas (Faltam ser construídas nos próximos ciclos):**
  1. Criação do componente `<GhostHand />` (Tutorial I DO).
  2. Implementação das reações de Erro no motor principal.
  3. Desbloqueio Inter-Ilhas: O código atual não tem o `GraphValidator` (que trava Ilha X se Trilha Y não estiver dominada).
  4. Exercícios do Nível Avançado (Armar continhas de adição/subtração vertical, e a ponte para multiplicação).

*Assinatura do Sistema: Todas as manutenções, patches e expansões devem estritamente consultar este documento e nenhum outro.*
