# 📚 Análise Arquitetônica e Referencial Teórico da Didática Matemágica

Este documento compila a pesquisa de engenharia pedagógica, os fundamentos científicos, a análise de concorrência global e a arquitetura das didáticas geradas para o Matemágica AI.

## 1. Referencial Teórico e Metodológico (Pesquisa Global)

A construção das didáticas (Adição, Subtração, Multiplicação, Divisão, Frações, Geometria, Medidas e Lógica) foi desenvolvida utilizando a fusão das metodologias matematicamente mais puras e validadas neurologicamente do mundo:

*   **Matemática de Singapura (Singapore Math):** O currículo nacional de Singapura, líder isolado no PISA (Programme for International Student Assessment).
    *   *Pilar utilizado:* O framework **CPA (Concreto -> Pictórico -> Abstrato)**.
    *   *Pilar utilizado:* Modelagem de Barras (Bar Models) para frações e resolução de problemas.
    *   *Pilar utilizado:* "Number Bonds" (Laços Numéricos) para a operação inversa e fluência de cálculo sem contagem de dedos.
*   **Trajetórias de Aprendizagem (Clements & Sarama - 2009):** O mapeamento científico de como a mente infantil entende conceitos desde o nascimento.
    *   *Pilar utilizado:* Os níveis de contagem e subitização da adição (Counting-on) e os estágios topológicos iniciais de desenvolvimento espacial.
*   **Modelo de Van Hiele de Pensamento Geométrico (1957):** Teoria que postula como as crianças aprendem geometria, estruturada em níveis inquebráveis.
    *   *Pilar utilizado:* Desconstrução do reconhecimento visual por memorização cega em favor da análise tátil e manipulação rotacional 2D e 3D.
*   **Cognitive Load Theory (Sweller - 1988) e Game Flow (Csíkszentmihályi):**
    *   *Pilar utilizado:* A ausência de carga extrínseca (TDAH-friendly). Zero excesso visual. Feedback haptic (vibração) e áudio condicionado (condicionamento operante de Skinner).

## 2. Análise de Concorrentes e Sistemas de Aprendizagem

O desenvolvimento destas didáticas buscou superar as fraquezas sistêmicas dos principais apps e métodos do mercado:
*   *IXL / Khan Academy:* Excelentes para o abstrato, mas péssimos para crianças de 4 a 6 anos porque focam imediatamente em numerais na tela. Saltam a fase "Concreta/Física".
*   *DragonBox (Kahoot):* Extraordinário uso do meio digital para representar álgebra secreta e frações. O Matemágica absorve a ideia de "Objetos Vivos" (amigos do 10, caixas, blocos que se comem), mas corrige a falta de transição clara para a conta armada escolar.
*   *Todo Math:* Fantástico no design infantil e tracing, mas repetitivo. Falta o motor dinâmico "Flow" que ajusta dificuldade a cada 5 segundos que o Matemágica implementa através das Skills-AI.

## 3. O Ecossistema Didático Atual (O Que Foi Construído)

Organizamos todas as trilhas core no diretório `/docs/didatica/`:
1.  **`didatica-adicao.md`:** O segredo do cálculo mental de Singapura.
2.  **`didatica-subtracao.md`:** O fim do trauma de "pegar emprestado".
3.  **`didatica-multiplicacao.md`:** A visualização de escala geométrica (Arrays).
4.  **`didatica-divisao.md`:** A justiça (Partição) e o empacotamento (Medida).
5.  **`fracoes.md`:** A ciência de repartir o espaço e dobraduras.
6.  **`geometria.md`:** Os níveis de Van Hiele e tangram.
7.  **`medidas.md`:** Senso espacial, monetário e de grandeza.
8.  **`logica-e-padroes.md`:** O pensamento algébrico primitivo.

## 4. O Que Mais Precisa Ser Criado? (Lacunas Faltantes)

Olhando para a matemática cognitiva do currículo inicial, as próximas didáticas fundamentais que o sistema precisa orquestrar são:

*   **A Didática Científica dos Decimais e Porcentagem:** É a evolução direta das Frações (ligar o sistema monetário de R$ 1,50 com a fração 1/2 e com 50%).
*   **A Didática da Coleta e Análise de Dados (Gráficos e Estatística Primitiva):** Crianças de 6 anos precisam aprender a organizar a desordem. Tabelas de contagem (Tally marks), pictogramas e gráficos de barra são fundamentais para o cérebro processar múltiplas variáveis visuais de uma vez.
*   **A Didática Científica da Resolução de Problemas (Word Problems - O Método de Barras):** A maior dor do fundamental é "qual conta eu uso agora?". Criar uma didática mostrando como quebrar um texto em português e transformá-lo num Bar Model de Singapura resolveria isso.
