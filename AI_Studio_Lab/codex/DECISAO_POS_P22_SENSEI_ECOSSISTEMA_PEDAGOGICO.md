# Decisão pós-P22 — Sensei e ecossistema pedagógico adaptativo

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Status:** decisão arquitetural vigente para a auditoria longitudinal dos motores.

## 1. Correção de conceito

A **Aula do Dia / Sensei** NÃO é um modo “misto” em que assuntos são sorteados.

Ela é a rota pedagógica principal e prescritiva do SAGA: o aluno entra, o Tutor lê o estado longitudinal da criança e decide o que ela deve aprender, reforçar, revisar ou automatizar naquele momento.

A criança não precisa montar a própria aula. Dentro da rota Sensei, o sistema assume o papel que um professor particular excelente assumiria: escolhe a próxima meta, o nível de suporte, a quantidade de prática, quando avançar, quando recuar e quando voltar a uma base anterior.

O **Desafio Misto** é outra coisa: um modo de prática/desafio, não a definição da Aula do Dia.

## 2. Objetivo do método

O objetivo do SAGA é permitir que uma criança avance do zero matemático até repertórios progressivamente mais abstratos e complexos por **domínio demonstrado**, não por idade cronológica.

Idade, série e faixa escolar podem:

- orientar linguagem, tamanho de sessão, apresentação ou expectativa de referência;
- ajudar pais e relatórios a contextualizar o percurso.

Mas NÃO podem:

- esconder nós do grafo;
- impor o próximo conteúdo;
- bloquear uma criança avançada;
- empurrar uma criança com lacuna para um conteúdo para o qual ela não está pronta;
- definir sozinhas a duração ou dificuldade da Aula do Dia.

**Invariante:** progressão curricular = evidência + domínio + prerequisitos + retenção + independência. Nunca `kid.grade` como trilho pedagógico.

## 3. Arquitetura do ecossistema

### 3.1 Sensei / Tutor — rota principal

Função: **ensinar e orquestrar**.

O Sensei decide a Aula do Dia usando o Learner Model. A aula deve ter uma **fronteira conceitual dominante**. Aquecimento, revisão, resgate e fluência podem aparecer, mas devem servir essa progressão — não virar uma coleção aleatória de conteúdos.

Estrutura conceitual da sessão:

1. **Entrada / aquecimento** — vitória acessível e ativação de conhecimento relevante;
2. **Meta principal** — uma microcompetência/fronteira conceitual dominante;
3. **Ensino + prática guiada** — variação de representação e de andaime dentro da meta;
4. **Remediação ou revisão**, apenas quando evidência pedir;
5. **Fluência prescrita**, somente sobre conhecimento já compreendido;
6. **Fecho** — consolidação, sensação de progresso e atualização do próximo estado.

A quantidade de questões NÃO é fixa por série. O orçamento da sessão deve ser adaptativo e limitado por sinais do aluno.

### 3.2 Jornada — mapa do conhecimento

Função: tornar o continuum matemático visível e permitir inspeção/navegação controlada.

A Jornada mostra onde a criança está, o que está conquistado, o que é fronteira e o que ainda depende de bases. Ela não substitui o Sensei como sequenciador principal.

Acesso manual pode existir, especialmente para pai/professor ou treino voluntário, sem transformar o mapa em “escolha seu currículo”.

### 3.3 Dojo — automaticidade e prática deliberada

Função: transformar conhecimento já compreendido em repertório rápido, estável e recuperável.

Duas portas coexistem:

- **Dojo prescrito pelo Sensei:** o Tutor decide qual família, dificuldade, dose e momento;
- **Dojo livre:** a criança pode escolher treinar por vontade própria dentro do que estiver pedagogicamente seguro/desbloqueado.

O Dojo não concede domínio conceitual que a Jornada/Sensei não demonstrou.

#### Jardim do Dojo

Pré-simbólico/estrutural: subitização, cinco/dez, vizinhança numérica, parte-todo e outras bases que transformam percepção em reflexo.

Pode ser prescrito pelo Tutor quando uma dificuldade simbólica aponta para uma base perceptual insuficiente. A descida deve ser causal, não “voltar para exercício infantil” por punição.

#### Dojo Sensei / templos aritméticos

Prática sistemática de fatos e procedimentos de:

- adição;
- subtração;
- multiplicação;
- divisão;
- posteriormente frações e outras famílias quando o currículo exigir.

Dificuldade e distribuição devem responder a força, precisão, RT, erro recente, retenção e pré-requisitos. Tempo é dado de fluência, NÃO critério de compreensão conceitual.

### 3.4 Oficina — recuperação sem punição

Função: reconstruir uma base quando o Radar encontra evidência suficiente de lacuna.

A Oficina deve parecer:

- curta;
- segura;
- encorajadora;
- concreta quando necessário;
- explicativa;
- orientada a voltar para a trilha principal.

Ela não é um depósito de erros. Cada resgate precisa de causa, alvo, dose e critério de saída.

A Oficina pode ser chamada automaticamente dentro da Aula do Dia e também ficar acessível como painel de reforço.

### 3.5 Desafio Misto

Função: desafio/retrieval/interleaving/gamificação.

Não é o mecanismo que decide a progressão curricular e não é a Aula do Dia. Só deve usar repertório que faça sentido para a criança naquele momento; não pode sortear conteúdo apenas porque pertence à série/faixa.

## 4. Learner Model — o que o Tutor precisa saber

O estado do aluno deve convergir para uma visão multidimensional por competência/família:

1. **compreensão conceitual** — acertos com a representação adequada;
2. **nível de representação** — concreto → pictórico/semiconcreto → abstrato;
3. **independência** — ajuda, dicas, tutorial, andaime;
4. **evidência autoral** — condição específica que prova a microcompetência;
5. **estabilidade** — retenção em sessões separadas;
6. **precisão recente** — não apenas média histórica;
7. **misconceptions** — padrões causais, não erro solto;
8. **banco de itens frágeis** — para retrieval/revisão;
9. **fluência** — RT/força de fatos/procedimentos, separada da compreensão;
10. **carga/fricção** — erros em sequência, necessidade de ajuda e sinais de que a sessão deve simplificar;
11. **progresso no DAG** — prerequisitos, frontier e dependentes;
12. **histórico de intervenção** — se uma remediação funcionou ou precisa descer mais um degrau.

## 5. Máquina de decisão do Sensei

### 5.1 Antes da aula

1. reconciliar estado local/cloud;
2. recalcular unlock/frontier pelo DAG;
3. verificar revisões vencidas;
4. verificar padrões de misconception;
5. verificar bases frágeis;
6. verificar alvo conceitual já em aprendizagem;
7. escolher **uma meta conceitual dominante**;
8. decidir dose inicial e representações;
9. decidir se haverá bloco de fluência e qual Dojo é elegível.

### 5.2 Durante a aula

O Tutor deve poder mudar a rota sem trocar arbitrariamente de currículo:

- erro motor → repetir sem penalizar;
- erro isolado → retry/feedback;
- padrão conceitual → mais andaime ou representação mais concreta;
- lacuna de prerequisito → micro-resgate causal;
- acerto consistente sem ajuda → retirar andaime;
- domínio rápido → aumentar complexidade/variação, não obrigatoriamente aumentar quantidade;
- resposta lenta com compreensão correta → registrar fluência, sem reprovar domínio;
- fadiga/fricção alta → reduzir dose, fechar com sucesso e retomar depois.

### 5.3 Depois da aula

1. persistir cada resposta no **nó que a originou**;
2. atualizar mastery/evidência/Radar/Leitner;
3. atualizar Dojo separadamente;
4. decidir se a meta continua, avança ou entra em retenção;
5. gerar o estado do próximo plano — não uma grade fixa de aulas pré-enfileiradas.

## 6. Regras de ouro pedagógicas

1. **Uma aula não é uma mistureba.** Há uma meta dominante e os demais blocos têm função explícita.
2. **Tempo varia; objetivo de aprendizagem não.** Crianças podem precisar de doses diferentes para atingir o mesmo domínio.
3. **Compreensão antes de automaticidade.** Dojo fortalece o aprendido; não substitui conceito.
4. **CPA/representações são ferramenta adaptativa.** Dificuldade pode fazer o Tutor voltar de abstrato para pictórico/concreto sem regredir a identidade da competência.
5. **Revisão é espaçada e causal.** Não repetir tudo o tempo todo.
6. **Interleaving vem depois de uma base mínima.** Desafio misto não é onboarding.
7. **Erro informa.** Misconception repetida pode mudar a rota; erro de dedo não.
8. **Velocidade não coroa.** RT alimenta fluência/Dojo.
9. **Idade não poda o grafo.** `grade` é contexto de apresentação, não autoridade curricular.
10. **Modo livre não pode corromper o Tutor.** Treino voluntário gera dados, mas não concede domínio conceitual sem a evidência exigida.
11. **Toda intervenção precisa de saída.** Oficina/resgate não pode virar loop infinito.
12. **Gamificação recompensa a jornada sem manipular a pedagogia.** Economia/mascote não compra unlock nem substitui mastery.

## 7. Base de evidência usada para a direção

A decisão está alinhada a evidência de ensino de matemática e mastery learning:

- EEF, *Mastery learning*: objetivos constantes, tempo variável; alta exigência de sucesso antes de avançar. https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/mastery-learning
- What Works Clearinghouse/IES, *Assisting Students Struggling with Mathematics*: instrução sistemática, linguagem matemática clara e uso criterioso de representações concretas/semiconcretas. https://ies.ed.gov/ncee/wwc/practiceguide/26
- EEF, *Mathematics Mastery Primary*: profundidade conceitual, linguagem matemática, objetos/imagens, problem solving e pensamento matemático. https://educationendowmentfoundation.org.uk/projects-and-evaluation/promising-programmes/mathematics-mastery-primary

Estas fontes orientam princípios; o algoritmo específico do SAGA precisa continuar sendo testado longitudinalmente no próprio runtime.

## 8. Discrepâncias encontradas no runtime atual

### D1 — Aula planejada e Aula executada usam universos diferentes — BUG PROVADO

`KidHomeScreen` calcula `planAula(tracks, progOf)` com a Jornada matemática completa.

`App.aulaTrack`, porém, reconstrói a missão com:

`SUBJECTS[mat].tracks[kid.grade]`.

Consequências:

- o card do Sensei pode descrever um plano e o runtime executar outro;
- série volta a funcionar como filtro pedagógico;
- criança avançada pode ficar artificialmente presa;
- criança com lacuna fora da faixa pode não receber a base correta.

**Correção bloqueante após o gate de persistência por source.**

### D2 — duração da Aula ainda é por série — BUG DE POLÍTICA

`getAulaTotal/buildAulaTrack` usa `pre/ano1/ano2/...` para escolher 8/12/16/20 questões.

Isso contradiz domínio como eixo. A dose precisa migrar para política adaptativa baseada em estado/fricção/necessidade pedagógica. Idade pode estabelecer apenas limites de UX no futuro, não a sequência curricular.

### D3 — bloco de “fluência” da Aula não está integrado ao estado real do Dojo — DÍVIDA

O Composer escolhe `Track` conceitual por `FLUENCY_IDS`; ainda não há contrato longitudinal que converta learner state em prescrição de `JD/FD/PD`/templos e depois devolva resultado para o Tutor.

### D4 — `questionBudget` da Oficina não governa a dose dentro da Aula — HIPÓTESE FORTE

O planner produz dose de resgate, mas `composeAula` hoje consome cada item da fila de resgate como uma única questão. Auditar e corrigir sem confundir missão standalone com micro-resgate embutido.

### D5 — recomendação paralela por estrelas — DÍVIDA

`KidHomeScreen.rec` usa revisão/banco e depois “menor número de estrelas” para recomendar foco. Isso é uma segunda inteligência competindo com `planAula`. O Sensei deve ter uma autoridade de recomendação única; cards secundários podem expor a decisão, não inventar outra.

### D6 — Desafio Misto precisa de elegibilidade por repertório — DÍVIDA

O modo misto atual é filtrado indiretamente por faixa no `App` e amostra trilhas/bancos. Precisa migrar para conjunto elegível por domínio/unlock/prática, mantendo-o como desafio opcional e não como professor.

## 9. Ordem de implementação

1. fechar `Aula → sourceTrackId → Progress → persist`;
2. unificar universo do Sensei no DAG completo e remover `grade` como filtro;
3. remover duração fixa por série e criar dose adaptativa V1 com contrato explícito;
4. provar `rescueAttempts/questionBudget` ponta a ponta;
5. integrar prescrição de Dojo ao Learner Model;
6. reconciliar Jardim como remediação perceptual causal;
7. eliminar recomendador paralelo por estrelas;
8. restringir Desafio Misto a repertório elegível;
9. revisar gamificação/economia contra os novos eventos pedagógicos;
10. simulação longitudinal sintética: iniciante absoluto, ritmo típico, alta facilidade, dificuldade persistente, esquecimento e retorno.

## 10. Critério de sucesso

Uma criança deve poder abrir o SAGA e simplesmente seguir o Sensei.

O sistema deve saber:

- **o que ensinar agora**;
- **por que ensinar isso**;
- **como representar**;
- **quanto praticar**;
- **quando simplificar**;
- **quando retirar ajuda**;
- **quando revisar**;
- **quando automatizar**;
- **quando avançar**;
- **e onde registrar a evidência**.

A criança vê uma aventura clara. Por baixo, o SAGA mantém uma máquina pedagógica longitudinal rigorosa.
