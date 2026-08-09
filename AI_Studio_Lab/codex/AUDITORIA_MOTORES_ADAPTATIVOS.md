# Auditoria longitudinal dos motores adaptativos

**Data:** 8/ago/2026  
**Branch:** `codex/integrar-bloco-f0`  
**Estado de entrada:** P21 + P22 concluídas; 94 fichas; cobertura autoral 90/90; CI limpo P22 `31288136803`.

## 1. Regra desta fase

Não corrigir algoritmo por intuição. Cada afirmação precisa atravessar:

`emissor → mutação de estado → persistência → consumidor → efeito pedagógico`.

Classificação:

- **PROVADO OK** — caminho completo encontrado e coerente;
- **BUG PROVADO** — produtor e consumidor divergiam de forma observável;
- **CORRIGIDO** — bug provado com regressão permanente e gate verde;
- **HIPÓTESE** — suspeita ainda sem cadeia completa;
- **DÍVIDA DECLARADA** — comportamento consciente ainda não implementado.

## 2. Arquitetura pedagógica vigente após a decisão do Sensei

Fonte de decisão: `DECISAO_POS_P22_SENSEI_ECOSSISTEMA_PEDAGOGICO.md`.

Invariantes:

1. **Sensei/Aula do Dia é a rota principal e prescritiva.** Não é modo misto.
2. A aula possui uma **meta conceitual dominante**; aquecimento, revisão, resgate e fluência servem essa progressão.
3. **Dojo é automaticidade**, prescrito pelo Tutor ou acessado livremente; não cria domínio conceitual.
4. **Oficina é recuperação causal**, curta e com saída; não é punição nem depósito de erros.
5. **Desafio Misto é opcional**, não decide a progressão curricular.
6. **Domínio/evidência/pré-requisitos governam o percurso.** `grade`/idade são contexto, nunca trilho pedagógico.

## 3. Máquina longitudinal confirmada

### 3.1 Trilha simples

`GameLoop → applyJourneyAnswer → Progress → App.commitProg → persist → local/cloud`

**PROVADO OK:** o mesmo nó recebe:

- `lvl/maxLvl`;
- mastery/evidência;
- misconceptions;
- banco;
- `lastDay/rt`;
- `reviewForce` quando aplicável.

A hipótese antiga de que um mapa multi-nó era truncado pelo App foi **REFUTADA**: no caminho simples existe apenas um `Progress` e o mapa criado para o Leitner referencia esse mesmo objeto.

### 3.2 Mastery

`applyJourneyAnswer` mantém:

- `lvl` 1..5;
- `maxLvl` monotônico;
- streak/bad para avanço/recuo;
- janela de mastery no L5;
- sessões maduras separadas para `dom`;
- evidência autoral quando declarada;
- `fluencyStreak` apenas como telemetria.

**PROVADO OK:** tempo/RT não governa domínio conceitual.

### 3.3 Leitner

`evaluateSpacedRepetition` atualiza `reviewForce/lastDay`.

`getDueReviews` é consumido por `planAula` e injeta `spaced-review` no plano diário.

**PROVADO OK:** revisão vencida não está órfã.

### 3.4 Unlock

`computeUnlockStatus` usa DAG + `maxLvl >= 3` ou `dom` para satisfazer pré-requisitos.

**PROVADO OK:** política explícita e testada; `maxLvl` não regride quando `lvl` recua.

## 4. CORRIGIDO #1 — Radar não roteia mais tag para nó fixo

Estado antigo:

- `LENTO_DEDOS → N1.03`;
- `OFF_BY_ONE → N1.02` com chave que nem casava com `"off-by-one"`;
- roteamento paralelo competia com o DAG.

Correção:

- `getRescueItems` devolve o nó em que o padrão foi observado;
- `rescuePlanner` decide se permanece no nó ou desce ao pré-requisito mais fraco.

Regressão: `radarRouting.test.ts`.  
Gate: `31288516415` = **success**.

## 5. CORRIGIDO #2 — Aula composta agora persiste no nó que gerou a questão

Bug original:

- `buildAulaTrack` devolvia `id: "aula"`;
- perguntas de N1.07/GM.02/etc. compartilhavam um único progresso sintético;
- mastery/Radar/Leitner/banco/nível podiam ser gravados em `progress[kid]["aula"]`.

Correção:

1. cada `Question` da Aula recebe `sourceTrackId`, `sourceGraphId`, `sourceLevel`;
2. `aulaProgressContext` mantém snapshots por competência durante a missão;
3. o boundary de resposta registra a origem;
4. `applyJourneyAnswer` consome o `Progress` do source, não o envelope;
5. o commit transitório carrega marcador interno;
6. `carimbar()` materializa o commit em `progress[kid][sourceTrackId]` e remove `progress.aula` antes de React/local/cloud;
7. save sintético antigo sem marcador é descartado e nunca vira evidência curricular.

Regressões:

- `aulaProgressRouting.test.ts`;
- `aulaQuestionSource.test.ts`.

Gate estrutural: `31290512422` (CI 585) = **success**.

### Ponto residual da identidade

O estado curricular está correto, mas a auditoria encontrou rótulos do `GameLoop` que ainda usam `track.id` para telemetria e chamada do Leitner. No caso da Aula esse id é `"aula"`.

O Leitner hoje ainda muta o mesmo objeto correto, então não foi provada corrupção de estado por isso; a telemetria, porém, pode ficar rotulada como `aula` em vez do source. **DÍVIDA DECLARADA**: normalizar identidade observacional por questão antes de encerrar a Coverage Matrix longitudinal.

## 6. CORRIGIDO #3 — Sensei não usa série como trilho pedagógico

Bug provado:

- o card do Tutor planejava com o grafo completo;
- `App.aulaTrack` entregava a `buildAulaTrack` apenas `SUBJECTS.tracks[kid.grade]`;
- UI e runtime podiam prometer/executar aulas diferentes;
- série voltava a funcionar como filtro curricular.

Correção:

- `canonicalSenseiTracks()` reconstrói sempre `ALL_MATH_TRACKS`;
- tracks recebidas com o mesmo id podem sobrescrever bindings, mas não reduzir o DAG;
- `buildAulaTrack` ignora `grade` como autoridade curricular;
- Aula do Dia passou a dose adaptativa V1:
  - **8** no zero absoluto ou com resgate/fricção;
  - **10** no desenvolvimento normal;
  - **12** apenas em fronteira estável, sem banco/resgate;
- alta facilidade deve preferir mais complexidade/menos andaime, não simplesmente mais volume.

Regressões: `senseiPolicy.test.ts` + contratos históricos atualizados.  
Gate: `31290796584` (CI 589) = **success**.

## 7. CORRIGIDO #4 — lacuna causal muda a missão prescrita, não vira “mistureba”

O `rescuePlanner` já possuía uma Oficina standalone com física própria:

- alvo no próprio nó ou pré-requisito frágil;
- `requiredLevel` explícito;
- `questionBudget` **4 ou 8**, conforme tamanho do buraco;
- progressão acelerada somente dentro do rescue;
- encerramento antecipado quando recupera o nível necessário;
- `rescueAttempts` incrementa se falha e zera quando recupera;
- após o limite, o planner pode sondar um degrau anterior.

A Aula composta, por outro lado, tratava resgate causal como uma ou duas perguntas em meio à sessão. Isso contradizia a regra de uma meta dominante.

Correção:

- `senseiOrchestrator.chooseSenseiEntry()` cria uma porta única;
- prioridade: `prerequisite-gap` → `misconception` → aula normal;
- `spaced-review` e `error-bank` não sequestram a meta: permanecem retrieval curto;
- `KidHomeScreen` mantém UM botão; se existe lacuna causal, esse botão chama `onRescue` automaticamente;
- o usuário não precisa diagnosticar nem escolher a aula correta;
- `SenseiTab` explica visualmente quando a Aula do Dia virou reconstrução e mostra meta/budget;
- Oficina continua acessível manualmente como painel complementar.

Regressão: `senseiOrchestrator.test.ts`.  
Gate: `31290937246` (CI 593) = **success**.

## 8. Eixo atual — Tutor ↔ Dojo

### Achado inicial — motor genérico do Dojo não é um learner model de fluência

`utils/dojoMode.ts` hoje:

- filtra `FLUENCY_IDS` conceituais;
- escolhe uma track aleatoriamente;
- força geração em `Math.max(4, lvl)`;
- se encontra expressão, troca o `kind` para `rapid-fire`;
- fixa `rt_max_s: 5`.

Isso é incompatível com a arquitetura desejada de treino sistemático adaptativo por fatos/procedimentos.

Ao mesmo tempo, já existem quatro templos autorais com **10 níveis** (`dojo_add/sub/mul/div`) e o Jardim JD com estado próprio. Os templos possuem progressões úteis, mas ainda precisam ser conectados a:

- domínio conceitual que libera a prática;
- estado longitudinal de fluência;
- prescrição automática do Sensei;
- via livre/manual separada;
- seleção de fatos fracos e dificuldade;
- critérios de subida/descida que não confundam velocidade com compreensão.

**Estado:** auditoria em andamento; não corrigir por sorteio ou por star count.

## 9. Dívidas seguintes já identificadas

1. Tutor ↔ Dojo real: prescrição de família/faixa/fatos/procedimentos;
2. banco de erros em Aula composta: revisar sem criar ciclo duplicado;
3. telemetria/Leitner: rotular source real na Aula;
4. `LENTO_DEDOS`: sair de string literal fora do catálogo canônico;
5. `lastDay`/timezone: usar dia local de maneira consistente;
6. recomendação paralela do `KidHomeScreen` por menor número de estrelas: não pode disputar autoridade com Sensei;
7. Desafio Misto: elegibilidade por repertório real, não série/track list bruta;
8. Matrícula: placement também precisa abandonar corte rígido por `grade`;
9. reconciliação cloud/local com todos os campos novos;
10. simulação longitudinal: zero absoluto, ritmo típico, alta facilidade, dificuldade persistente, esquecimento e retorno;
11. gamificação/economia: auditar recompensa sem comprar unlock/mastery.

## 10. Estado atual

- P21/P22: fechadas;
- Radar: corrigido;
- Aula → source Progress → persist: corrigido, CI 585;
- Sensei full DAG + dose por estado: corrigido, CI 589;
- lacuna causal → Oficina prescrita: corrigido, CI 593;
- **próximo bloqueante: transformar o Dojo de sorteio/rapid-fire genérico em pilar de fluência longitudinal integrado ao Sensei, preservando a via livre.**

> Regra de continuidade: a criança escolhe brincar/treinar quando quiser; o Tutor escolhe o currículo quando ela segue a Aula do Dia.
