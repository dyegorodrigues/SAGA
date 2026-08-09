# Checkpoint — Cloud Reconciliation fechada

> **VIGENTE em 9/ago/2026.** Este checkpoint substitui `CHECKPOINT_MATRICULA_FECHADA_2026-08-09.md` como fonte operacional mais nova. Não reabrir Cloud Reconciliation nem blocos pedagógicos anteriores sem falha objetiva.

## 1. Âncora Git e governança

- repositório: `dyegorodrigues/SAGA`;
- branch única: `codex/integrar-bloco-f0`;
- PR #29: **open + draft + unmerged**;
- base protegida: `main` em `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- Creature Engine fora deste fluxo;
- nenhuma branch auxiliar criada;
- nenhum merge/rebase/ready/auto-merge.

Cabeça funcional fechada:

`f76017e3a8ed2a15fb5561f2fc886f6445964168`

CI funcional terminal:

- CI **#766**;
- run **`31319778442`**;
- conclusão: **success**;
- **150 arquivos / 2.325 testes**;
- TypeScript verde;
- build verde;
- `npm run auditar` verde;
- `npm run fichas:auditar` verde;
- `npm run fichas:conferir` verde;
- `npm run grafo:check` verde;
- `npm run pr:check` verde;
- higiene do diff verde;
- guarda de binários verde;
- Chrome real/Sensei verde.

Artefato Chrome: **`9039831130`**, `sonda-sensei-f76017e3a8ed2a15fb5561f2fc886f6445964168`.

Diff auditado desde a cabeça documental anterior `d51d68544c0bdca396232baf287da86105f0aaec`:

- 17 commits à frente;
- 0 atrás;
- somente 9 arquivos de cloud/reconciliação/testes;
- nenhum arquivo do Creature Engine;
- nenhum arquivo curricular;
- `App.tsx` não foi alterado neste bloco.

## 2. Bugs realmente provados

### C1 — stale writer / last-arrival derrotava last-state-time

**Falha provada antes do patch.**

Regressão-only: `33ec68d087292babf5fb4d47e9c2344cfebda9e1`.

CI **#750**, run `31318999291`: vermelho exatamente nos contratos novos de concorrência.

O writer antigo fazia `setDoc(..., { merge: true })` sem comparar atomicamente o estado já armazenado. Um write logicamente antigo podia chegar depois e sobrescrever um `State.updatedAt` mais novo.

Correção:

- `saveStateToCloud()` passou a usar transação Firestore;
- a autoridade é **`State.updatedAt` interno**;
- o `updatedAt` externo do documento Firestore é apenas observabilidade de transporte;
- incoming só vence se for estritamente mais novo;
- empate preserva o cloud já aceito, coerente com a política do bootstrap;
- save sem timestamp ou timestamp inválido não derrota cloud carimbado;
- nenhuma fusão campo-a-campo foi inventada.

Primeira prova verde desta correção: `499b832fc39e212fe33fd098f737cfeb7ed448ca`, CI **#751**, run `31319130566`.

### C2 — writer/bootstrap podiam transportar envelope efêmero não materializado

**Falha provada antes do patch.**

Regressão-only: `a039163a118393ec63fade15b1b281082a76de8c`.

CI **#752**, run `31319263217`: 1 falha nova / 2.314 testes vizinhos verdes. O writer direto serializou `progress.aula` com `__aulaSourceTrackId` em vez de materializar a competência-fonte.

Correção:

- criada `materializarEstadoParaPersistencia()`;
- Aula e Dojo são materializados sem alterar o relógio lógico;
- `carimbar()` materializa e só então cria um novo timestamp;
- candidatos de bootstrap são migrados + materializados antes de entrar em React;
- writer cloud também materializa defensivamente antes de serializar;
- ler/migrar/materializar **não** faz um estado velho parecer novo.

### C3 — falha offline apagava a pendência do sincronizador

**Falha provada antes do patch.**

Regressão-only: `e4bee5687eac1f928b0d3253cd01a8c9241179e1`.

CI **#758**, run `31319461138`: 1/2.319 testes vermelho. Depois de uma falha `offline`, `temPendencia()` ficava `false`; sem nova atividade da criança o estado podia permanecer apenas local indefinidamente.

Correção:

- erros transitórios sobem do Firebase writer para a camada de retry;
- o sincronizador mantém um único estado pendente e agenda nova tentativa;
- estado mais novo agendado durante um write em voo suplanta retry velho;
- `cancelarPendencia()` incrementa uma geração de identidade;
- troca de UID enquanto write está em voo impede a falha antiga de ressuscitar um retry de outra conta;
- erro permanente não entra em loop de retry;
- UI/local continuam offline-first e não aguardam cloud.

## 3. Hipóteses investigadas e descartadas como bug

### H3 — identidade local UID A × UID B

Não foi encontrada mistura no contrato atual:

- storage local usa chave escopada por UID;
- legado sem dono possui gate de owner/família;
- bootstrap do UID atual não lê a chave escopada de outro UID;
- `expectedUid` já barrava writer de A depois de auth virar B;
- listener de auth já cancela pendência na troca de UID;
- a geração adicionada ao sincronizador agora cobre também write antigo já em voo.

### H4 — anonymous → Google

O contrato real usa `linkWithPopup` quando o usuário ativo é anônimo. Regressão comportamental prova:

- não chama `signInWithPopup` nesse caso;
- o UID permanece o mesmo;
- o namespace `usr_cloud_<uid>` permanece o mesmo;
- o estado cloud daquele UID continua acessível após o vínculo.

Logo não foi encontrada criação silenciosa de segunda identidade pelo caminho atual.

### H5 — round-trip dos campos novos

Não foi encontrada perda no migrador atual. Regressão permanente prova preservação de:

- `schemaVersion`;
- `updatedAt`;
- `dojoTracks`;
- `masteryEvidence`;
- `bank`;
- `reviewForce`;
- `lastDay`;
- `FactStrength` / `facts`;
- `ProcStrength` / `procs`.

O migrador mantém a política existente para schema incompatível: reset fase 1. Durante reconciliação, candidato de schema incompatível é inválido e não pode vencer um estado válido por empate.

## 4. Matriz de Cloud Reconciliation provada

1. nenhum save local / nenhum cloud → `fresh`, sem upload vazio;
2. local-only → local vence e agenda reparo cloud;
3. cloud-only → cloud vence;
4. local mais novo → local vence pelo `State.updatedAt`;
5. cloud mais novo → cloud vence;
6. timestamps iguais → cloud/estado já aceito vence;
7. timestamp ausente → perde para carimbo válido;
8. timestamp inválido → perde para carimbo válido;
9. schema antigo/estado incompleto v1 → migração completa campos atuais; schema incompatível não vira candidato vazio vencedor;
10. local UID A com usuário atual UID B → chave escopada/owner impedem participação indevida;
11. logout A → login B → pendência cancelada, expectedUid barra A e write A em voo não ressuscita retry;
12. anonymous → Google → link preserva UID/namespace/progresso;
13. bootstrap offline → cloud indisponível não bloqueia local;
14. reconexão posterior → pending write transitório volta sozinho e stale local não destrói cloud mais novo;
15. write antigo chegando depois → transação rejeita;
16. duas abas concorrentes → empate lógico preserva estado cloud já aceito; SDK continua com cache persistente multi-tab;
17. dois dispositivos fora de ordem → converge para maior `State.updatedAt` sob o contrato atual;
18. materialização → Aula/Dojo efêmeros são materializados antes de React/save, sem re-carimbo;
19. round-trip → campos pedagógicos novos/importantes sobrevivem migrate/reconcile/save.

## 5. Decisões arquiteturais

- Fonte de autoridade concorrente: **`State.updatedAt`**, não horário de chegada do Firestore.
- Persistência continua **whole-state**; nenhuma fusão campo-a-campo sem especificação objetiva.
- Firestore transaction fornece comparação + write atômicos no documento do UID.
- `updatedAt` externo do documento é telemetria de transporte, sem autoridade curricular.
- materialização é uma operação separada de carimbo.
- local continua imediato; cloud continua amortecido/debounced.
- retry offline mantém no máximo um estado pendente e nunca pode atravessar cancelamento de identidade.
- igualdade de timestamp favorece o cloud/estado já aceito, preservando a política anterior explícita.

## 6. Riscos residuais — explícitos, não bloqueantes

1. **Clock skew entre dispositivos.** O contrato escolhido usa relógio de cliente em `State.updatedAt`. A transação impede chegada fora de ordem, mas não consegue descobrir causalidade real se o relógio de um aparelho estiver incorreto. Resolver isso exigiria uma especificação de revisão lógica/causal; não foi inventada neste bloco.
2. **Conflito verdadeiramente simultâneo.** Whole-state last-logical-time não mescla edições divergentes. Empate preserva o estado cloud já aceito. Isso é intencional enquanto não existir contrato de merge.
3. **Retry fixo de 8 s.** É um único timer/um único estado pendente; não bloqueia UI, porém backoff exponencial pode entrar em hardening futuro.
4. Dívidas já conhecidas de bundle/jsdom continuam no backlog de hardening e não foram abertas aqui.

## 7. DEPLOYMENT-ONLY

**Nenhum item novo.**

Não foi necessário token, service account, Firebase Console, mudança de provider, índice ou alteração/deploy de Firestore Rules para fechar a lógica deste bloco.

## 8. Dívida curricular permanece intacta

- Composer ativo: 26/90;
- servido sem placeholder: 51/90;
- 25 fichas prontas ainda em legado;
- 39 fichas prontas ainda em fallback;
- 21 divergências ficha↔tela;
- 12 trocas de linguagem visual;
- 44 estreias a classificar;
- primitivas incompletas: `LinkingCubes`, `Moedas`, `SingaporeBars`, `VisualAddition`, `Quadrado100`, `Regua`;
- `Moedas` bloqueia GM.03;
- `Regua` bloqueia GM.05.

**Não iniciar fábrica das 39 antes da Coverage Matrix.**

## 9. Próxima tarefa única

**Simulação longitudinal.**

Objetivo: exercitar o Learner Model/Sensei ao longo de múltiplas sessões e perfis sintéticos — iniciante absoluto, ritmo típico, alta facilidade, dificuldade persistente, esquecimento/retenção e retorno — verificando progressão, remediação, Dojo, Jardim, revisão, Matrícula e persistência ao longo do tempo sem reabrir os contratos fechados por preferência.

Depois:

`simulação longitudinal → gamificação/economia/mascote → Coverage Matrix → fábrica curricular → mega auditoria → hardening/performance/release`.

## 10. Cabeças documentais e recibo remoto

O SHA de um commit não pode ser escrito dentro do próprio conteúdo que gera esse SHA. Para evitar auto-referência falsa, o fechamento usa três âncoras distintas:

1. **head funcional:** `f76017e3a8ed2a15fb5561f2fc886f6445964168` — CI #766/run `31319778442` verde;
2. **head documental auditado:** será o commit que consolida checkpoint + `RETOMADA.md` + `BRIEFING_CODEX.md` + `HANDOFF_CONTINUIDADE_IA.md` e será registrado neste checkpoint por recibo posterior;
3. **head remoto final/CI terminal:** será registrado também no corpo da PR #29, que não altera a cabeça Git.

Assim nenhum SHA/run é inventado para um commit que ainda não existe.

> **A criança pode escolher treinar. Quando segue o Sensei, quem escolhe o currículo é o Tutor.**
