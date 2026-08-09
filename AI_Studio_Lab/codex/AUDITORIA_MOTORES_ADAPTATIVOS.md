# Auditoria longitudinal dos motores adaptativos

**Data:** 9/ago/2026  
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

### 8.1 Legado ainda visível

`utils/dojoMode.ts` ainda é heurística legada:

- filtra `FLUENCY_IDS` conceituais;
- sorteia track;
- força geração em `Math.max(4, lvl)`;
- troca expressão para `rapid-fire`;
- fixa `rt_max_s: 5`.

**DÍVIDA DECLARADA:** esse caminho não pode continuar como autoridade do Tutor.

### 8.2 Estrutura autoral de fluência já existente

Quatro templos com 10 faixas:

- `dojo_add`;
- `dojo_sub`;
- `dojo_mul`;
- `dojo_div`.

`senseiDojoPolicy.ts` define pré-requisitos conceituais por faixa e `fact | procedure`.

`senseiDojoEngine.ts` mantém estado separado:

- 10 itens por round;
- precisão e fluência separadas;
- `FactStrength/ProcStrength`;
- current/highest step;
- bons/fracos rounds;
- avanço/recuo da automaticidade sem tocar mastery conceitual.

`senseiDojoPrescription.ts` já prescreve sem sorteio, priorizando:

1. itens fracos;
2. lacuna de fluência;
3. recém-liberado;
4. refresh.

### 8.3 Pipeline tentativa → persistência — PROVADO IMPLEMENTADO

A leitura final do runtime corrigiu uma hipótese anterior: **não falta construir esse pipeline do zero**.

`senseiDojoProgressContext.ts` já implementa:

`question fluency meta → tentativa → consumeSenseiDojoTerminal → marcador transitório → carimbar() → materializeSenseiDojoProgress → dojoTracks`.

Conexões:

- `answerPolicy.ts` registra cada tentativa real pelo token da questão;
- `progressEngine.ts` intercepta Dojo antes de Journey;
- `reconciliacaoDeSaves.ts` materializa Dojo antes de persistir local/cloud.

Regressões de `senseiDojoProgressContext.test.ts` provam:

- 1 resposta → round parcial em `dojoTracks`;
- 10 → round fechado;
- 20 respostas boas → faixa pode avançar;
- progresso conceitual fica semanticamente intacto;
- retry não vira fluência de primeira tentativa;
- save legado de templo não carrega coroa conceitual;
- faixa acima do teto não recebe crédito.

**PROVADO OK:** separação estrutural de armazenamento entre domínio conceitual e fluência.

### 8.4 BUG PROVADO — origem manual/prescrita não acompanha a sessão

`materializeSenseiDojoProgress` decide hoje se um round é adaptativo por:

`servedStep === currentStep`.

Isso não prova que o Sensei prescreveu a missão.

Se a criança escolher manualmente justamente a faixa corrente, a prática pode mover `goodRounds/weakRounds/currentStep`, contrariando a regra de que treino livre **observa e fortalece**, mas não governa a prescrição.

**Correção bloqueante:** carregar origem explícita `prescribed | manual` do launch até a materialização.

Invariante testável:

- `prescribed` → `adaptive=true`;
- `manual` → `adaptive=false`, mesmo quando `servedStep === currentStep`;
- manual ainda atualiza fatos/procedimentos, RT, precisão e volume.

### 8.5 DÍVIDA — prescrição existe, mas ainda não governa a UX do Tutor

- `senseiOrchestrator.ts` ainda decide `lesson | rescue`;
- `KidHomeScreen` não usa `prescribeSenseiDojo` como parte da rota prescritiva;
- `LevelPickerModal` possui porta automática opcional, mas o fluxo atual não a liga no `KidHomeScreen`;
- `App.tsx` ainda mantém `screen.track === "dojo"` no legado `buildDojoTrack`.

Próximo lote de código:

1. origem manual/prescrita explícita;
2. regressão correspondente;
3. conectar prescrição ao Sensei sem quebrar meta dominante;
4. definir dose/posição pedagógica do bloco de fluência;
5. preservar prática livre;
6. retirar `dojoMode.ts` da posição de inteligência principal;
7. sonda visual e gates.

## 9. Dívida canônica detectada durante a auditoria final

O runtime/grafo estão em 90 competências, mas a prosa ainda tem drift histórico:

- Manual fecha em 89/89;
- Método ainda cita 89/92 e mistura Jornada 1→3 / Dojo 3→5 + RT conceitual;
- Bíblia v3.3 tem retificação correta posterior, mas seções normativas antigas ainda contradizem a separação de fluência;
- `catalog_auditor.cjs`, apesar de `EXPECTED_COMPETENCIES = 90`, ainda exige as frases de 89 no Manual/Método.

**DÍVIDA BLOQUEANTE DOCUMENTAL:** reconciliar esses documentos cirurgicamente e fortalecer o auditor antes de chamar o cânone de verde.

Detalhes em `CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-09.md`.

## 10. Dívidas seguintes já identificadas

1. reconciliação canônica pós-P22;
2. origem manual/prescrita + integração Tutor↔Dojo;
3. Jardim como remediação perceptual causal;
4. banco de erros em Aula composta;
5. telemetria/Leitner: source observacional real na Aula;
6. `LENTO_DEDOS`: sair de string literal fora do catálogo canônico;
7. `lastDay`/timezone consistente;
8. recomendação paralela por estrelas: não disputar autoridade com Sensei;
9. Desafio Misto por repertório real;
10. Matrícula sem grade rígida;
11. reconciliação cloud/local com campos novos;
12. simulação longitudinal;
13. gamificação/economia;
14. Coverage Matrix e fábrica curricular.

## 11. Estado atual

- P21/P22: fechadas;
- Radar: corrigido;
- Aula → source Progress → persist: corrigido, CI 585;
- Sensei full DAG + dose por estado: corrigido, CI 589;
- lacuna causal → Oficina prescrita: corrigido, CI 593;
- Dojo: motor, política, prescrição e persistência parcial/round **já existem**;
- Dojo bloqueante: separar origem manual/prescrita e integrar a prescrição à rota do Tutor;
- cânone bloqueante: reconciliar Bíblia/Manual/Método e o auditor de prosa sem apagar conteúdo histórico.

> Regra de continuidade: a criança escolhe brincar/treinar quando quiser; o Tutor escolhe o currículo quando ela segue a Aula do Dia.
