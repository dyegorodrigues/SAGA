# Estado do Fechamento Curricular — SAGA

**Data de abertura desta linha:** 11/08/2026  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — draft  
**Fonte de verdade:** GitHub remoto + gates executáveis. Este arquivo é um checkpoint de retomada, não substitui evidência remota.

## Estado operacional

HEAD          `102699fb12cbc8fbd2603f00ec0a44b48bfb057e` — commit imediatamente anterior a este checkpoint; o próprio checkpoint cria o SHA seguinte  
CI            `main` run #1086 / `31550459281`, attempt 2 — `success` no job aplicável a `push` (`Gates do SAGA`); os 5 jobs de sonda/diff são condicionados a `pull_request` e ficaram `skipped` por desenho do workflow  
Bloco         0 — Mesclar e recomeçar a linha — **CONCLUÍDO**  
Matrix        `31 Composer / 21 legado / 38 fallback / 52 servidas / 16 divergências / 12 swaps / 44 estreias`  
Ondas feitas  W1 `N1.04`; W2 `N1.05`; W3 `N2.01`; W4 `N1.12`; W5 `GM.05`; W6 `N2.03/F29` — todas anteriores a esta linha e já consolidadas na `main`  
Próximo       Bloco 1 — recalcular/confirmar a primeira onda por Matrix + DAG antes de implementar; `N2.02/F36` permanece candidata até o checkpoint de seleção  

## Recibo do Bloco 0

1. PR #29 foi reancorado no remoto ainda `open + draft + unmerged`, com head exato `5d3daa1b5735be725319e0d463af13f0f5d17fce`.
2. CI #1085 / run `31548303226` do head tinha `success` em 6/6 jobs, incluindo transversal `390px × 8 sementes`.
3. Review threads abertas: `0`; reviews submetidas: `0`.
4. W6 `N2.03 / F29` estava fechada e o checkpoint de retificação pós-auditoria estava presente. A retificação observada no código preservava L2 até 10, L5 com parcela compartilhada e posição da parcela compartilhada sorteada, RT silencioso de 8 s e nenhum delta de Matrix.
5. `main` permanecia em `68fad4c575e28959b2ca4776e9a541d6828b63f3`; a branch estava `964` commits à frente e `0` atrás.
6. `firestore.rules` tinha o mesmo blob SHA `fab313c11e0d3f1a55aa568818625e372bf40fa9` em `main` e na branch. O único workflow de publicação é `deploy-rules.yml`, condicionado a push em `main` com mudança em `firestore.rules` ou no próprio workflow. O merge não alterou esses arquivos.
7. O autor autorizou expressamente o portão humano do Bloco 0 nesta retomada e os documentos de Claude Code de 11/08/2026 mandavam, sob essas precondições, merge por **merge commit**, sem squash.
8. PR #29 foi retirado de draft e mesclado com `expected_head_sha=5d3daa1b...`. Merge commit: `106dfe0d796babebe40ebc36e5a84d4a80b9a858`.
9. A branch histórica `codex/integrar-bloco-f0` foi preservada.
10. `codex/fechamento-curricular` foi criada exatamente de `106dfe0d...`.
11. O novo PR não pôde ser aberto enquanto a branch era idêntica à `main`; não foi criado commit vazio artificial.
12. O primeiro CI pós-merge em `main` (#1086) expôs flake em `reta20Boundary.test.tsx`: F19 nível 3 podia sortear `1 → 0`, deixando o helper do teste sem vizinho ±1 distinto da origem. A causa era fixture aleatória do gate, não runtime nem expectativa pedagógica.
13. O reparo foi feito apenas na nova branch em `102699fb`: a fixture do teste foi tornada determinística com `Math.random = 0.5` via spy local; runtime e contrato F19 ficaram intocados.
14. A reexecução do mesmo SHA da `main` passou no Gates, confirmando a natureza amostral do defeito. O reparo determinístico permanece na linha nova para remover a recorrência.
15. Com o primeiro diff real, o PR #35 foi aberto em draft para `main`.

## Decisões autônomas

- **Merge executado:** todas as precondições documentadas e remotas estavam satisfeitas; foi usado merge commit e `expected_head_sha` para impedir corrida com avanço inesperado do PR.
- **Nenhum patch direto na `main`:** o flake descoberto após o merge foi reparado exclusivamente na nova branch de trabalho, preservando a política de branch.
- **Flake tratado como defeito do portão:** não houve alteração de produto, relaxamento de expectativa nem `skip` de teste.
- **Nenhum commit vazio para abrir PR:** o GitHub recusou PR sem diff; o primeiro commit legítimo abriu a comparação.
- **Creature Engine e Thinking Engine runtime continuam fora do escopo.**

## Discordâncias / correções ao plano externo

1. `PLANO_ATE_O_FIM.md` agrupava `ShapeCanvas` entre primitivas "renderer sem builder". O remoto atual contradiz essa classificação: `AI_Studio_Lab/tools/ficha_runtime_map.cjs` prova `ShapeCanvas` com `builderKinds: ["shapecanvas"]` e `rendererKinds: ["shapecanvas"]`, atendendo F47/GE.01 e F48/GE.02 por `CenaDePosicaoStage`/`FormaStage`. Portanto, no Bloco 2, `ShapeCanvas` é infraestrutura **já executável**, embora as seis competências pendentes ainda precisem de conteúdo/contratos próprios.
2. Em CI de `push` para `main`, não existe "6/6" aplicável: cinco jobs têm condição de PR e são `skipped`. O critério "CI verde na main" foi satisfeito pelo job `Gates do SAGA`, que inclui auditorias, conformidade, grafo, TypeScript, testes, build e guarda textual. Não registrar os `skipped` como sucesso executado.

## Aberto

- PR #35 CI #1087 foi disparado no primeiro commit da nova linha; no momento deste registro, Gates, Sensei, higiene e binários já estavam verdes e as duas sondas transversais ainda executavam. Runs posteriores podem supersedi-lo à medida que a W7 avançar.
- O Bloco 1 ainda não começou em código. A primeira onda deve ser selecionada novamente por Matrix + DAG no estado pós-W6; nenhum ID pode ser fixado apenas porque o plano externo o sugeriu.
- A inconsistência documental `ShapeCanvas` deve continuar registrada; não fazer faxina fora do bloco para "corrigir tudo".
