# 📚 Auditoria Pedagógica Profunda: Trilhas, Ilhas e Microcompetências

**Data da Auditoria:** Julho 2026
**Objetivo:** Responder às preocupações sobre a organização do currículo, a ausência de Códigos Técnicos (C0XXX), a estruturação de Raciocínio Lógico/Noções de Grandeza e a arquitetura de micro-tutoriais.

## 1. O Retorno dos Códigos Técnicos (Grafo C0XXX)
**Problema:** A remoção dos códigos das trilhas (ex: C0001, C0101) dificultou a visualização arquitetural e o alinhamento com a "Bíblia" do Matemágica.
**Solução Aplicada:**
- Os IDs do grafo (ex: `C0001`) foram reintegrados como a propriedade estrutural `graphId` de cada Trilha.
- Na tela de jornada (Mapa de Ilhas), **o código técnico agora aparece discretamente acima do nome da trilha** (em texto cinza pequeno, ex: `C000A`).
- A criança foca no nome divertido ("Canto Numérico"), enquanto pais/admin (e o código) visualizam o `graphId` para rastrear o progresso no Grafo de Microcompetências.

## 2. Nova Organização: As Ilhas Pedagógicas (Módulos Mestre)
**Problema:** O mapa anterior dividia as trilhas em blocos aleatórios de 4 em 4. Trilhas como "Onde Está?" ou "Padrões" pareciam jogadas no meio da contagem.
**Solução Aplicada:** A arquitetura do `LearningPath` foi reescrita para agrupar as microcompetências **semanticamente**, respeitando a Teoria Pedagógica.

### Nível Pré-Escola (4 a 5 anos):
*   🏝️ **Ilha 1: Alfabetização Numérica** (A Base - Contagem, Subitização)
    *   `C000A` Canto Numérico
    *   `C000B` Símbolos Numéricos
    *   `C0001` Contar (Correspondência 1 a 1)
    *   `C0003` Caixa Mágica (Cardinalidade Elite)
    *   `C0001_B` Olhômetro (Subitização Flash)
*   🏝️ **Ilha 2: Noções de Grandeza** (Preparação para Operações)
    *   `C0005` Comparar Visual (Mais / Menos)
    *   `C0006` O Que Vem Depois (Ordenação Inicial)
*   🏝️ **Ilha 3: Raciocínio Lógico & Espaço** (Pensamento Computacional Base)
    *   `C_LOG1` Formas Geométricas
    *   `C_LOG2` Padrões Lógicos (Sequenciamento)
    *   `C_LOG3` Qual é o Intruso? (Classificação)
    *   `C_ESP1` Onde Está? (Em cima, embaixo, dentro, fora)
*   🏝️ **Ilha 4: Noções de Tempo**
    *   `C_TMP1` Calendário (Dias da semana, ontem/hoje)
*   🏝️ **Ilha 5: Primeiras Operações** (Transição CRA)
    *   `C0101` Juntar e Somar
    *   `C0201` Tirar e Esconder

### Nível 1º Ano (6 a 7 anos):
*   🏝️ **Ilha 1: Números e Sequências** (Avançando até 100)
    *   `C0006_B` Reta Numérica
    *   `C_NUM1` Dezenas e Unidades
    *   `C_NUM2` Contar Pulando (Preparação Tabuada)
    *   `C_NUM3` Maior, Menor, Igual
*   🏝️ **Ilha 2: Operações e Estratégias** (Do Concreto ao Lógico)
    *   `C0102` Soma (Counting On)
    *   `C0203` Subtração Lógica
    *   `C0103` Amigos do 10 (Elite)
    *   `C0104` Amigos dos Números (Elite)
*   🏝️ **Ilha 3: Lógica Aplicada**
    *   `C_LOG4` Probleminhas
    *   `C_LOG5` Ler Gráficos
*   🏝️ **Ilha 4: Mundo Real**
    *   `C_RL1` Sistema Monetário (Dinheiro)
    *   `C_RL2` Lendo as Horas

*Nota:* Conceitos de Pensamento Computacional (como Padrões, Intruso) já estão embutidos na Ilha "Raciocínio Lógico", e não misturados com adição. A progressão está limpa e reflete a evolução cognitiva real.

## 3. Micro-Tutoriais, Erros e Telemetria (Lacunas Encontradas e Soluções)
**Problema:** O usuário questionou como o app ensina antes de testar, e como registra o uso de dicas ou erros repetidos.
**Análise de Código e Arquitetura:**
1.  **O "Zero Absoluto" e a Pedagogia CRA:** 
    A metodologia exige que antes da criança fazer uma conta abstrata (`3 + 2 = 5`), ela manipule representações (ex: Barras de Singapura, Caixas Mágicas). Essas "cenas vivas" (kinds) garantem que ela não está apenas decorando.
2.  **Micro-Tutoriais (Scaffolding Visual):**
    Atualmente, os Kinds apresentam o problema, mas a interface precisa de uma camada de **"I Do" (Mão Fantasma / IA faz primeiro)**. 
    *Decisão Arquitetural:* Nos primeiros níveis (Nível 1 de cada microcompetência), o app *deve* mostrar o micro-tutorial antes de habilitar a interação da criança. A ser implementado no loop principal de `KidDojo`.
3.  **Feedback Sensível de Erro:**
    Atualmente, a tela balança e pede para "Tentar de novo".
    *Decisão Arquitetural:* O campo `howto` e `explain` nas questões geradas devem ser transformados em áudio/feedback visual *quando a criança erra*, não apenas no final. Se ela seleciona a opção errada, a tela mostra o `explain` daquela questão, guiando sem dar a resposta mastigada (We Do).
4.  **Registro Profundo (Analytics):**
    O usuário pediu para registrar cliques em dicas e abandonos.
    *Decisão Arquitetural:* Atualizar a interface `Progress` (em `src/types.ts`) para incluir campos como `helpClicks` e `skips`. Isso alimentará o algoritmo de Repetição Espaçada, forçando a revisão de conceitos onde a criança dependeu muito de ajuda, mesmo que tenha passado de nível.

## 4. O Problema das "Cópias de Exercícios"
**Problema:** A IA gerou exercícios com nomes parecidos mas mecânicas repetidas ("Caixa Mágica" e "Amigos dos Números").
**Esclarecimento:** Na verdade, são trilhas *distintas* na metodologia:
- **Caixa Mágica (Ten Frame):** Treina apenas a *Subitização Cardinal* (reconhecer rápido quantas bolinhas tem numa grade 2x5 sem contar um a um). É visual.
- **Amigos dos Números (Number Bonds):** Usa uma mecânica parecida, mas treina *Composição/Decomposição* (ex: "Se tenho 6, faltam 4 para fazer 10"). É cálculo mental estratégico ("fazer 10").
A nomenclatura no código (`gMatTenFrame` vs `gMatBond`) reflete essa diferença. Eles aparecem no momento certo da jornada pedagógica (Caixa Mágica na Alfabetização Numérica; Amigos na Ilha de Operações).

## Conclusão
A estrutura está alinhada, modularizada nas Ilhas corretas e com o rastreamento do Grafo C0XXX visível e organizado. O próximo passo de desenvolvimento será expandir a camada de **Micro-Tutoriais Dinâmicos** e **Feedback Sensível a Erro** (Scaffolding) diretamente no loop de exercícios.
