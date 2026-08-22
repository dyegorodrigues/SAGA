# Checkpoint final — nova conversa — 2026-08-13

## Regra de abertura

GitHub remoto é a fonte da verdade. Este arquivo é um handoff, não substitui a reancoragem.

Antes de qualquer edição:

1. abrir `dyegorodrigues/SAGA`, PR #35;
2. confirmar PR `open + draft + unmerged`;
3. confirmar branch `codex/fechamento-curricular` e HEAD remoto atual;
4. conferir o CI do **HEAD exato**, job a job;
5. conferir reviews e review threads;
6. se houver deriva, investigar antes de editar.

Nunca usar verde de outro SHA por procuração.

## Invariantes

- não tocar `main`;
- não fazer merge, ready ou auto-merge;
- não tocar Creature Engine;
- Thinking Engine runtime continua não autorizado;
- não reabrir W7–W11 sem regressão real comprovada;
- não fazer faxina P2 oportunista;
- não enfraquecer gates;
- learner state continua soberano;
- RT/velocidade não compram mastery, unlock ou XP.

## Estado curricular fechado

Fechadas:

- W7 `N2.02/F36`;
- W8 `N3.01/F13`;
- W9 `N3.02/F15`;
- R0-A — Contrato de Resolução;
- W10 `N3.03/F14`;
- **W11 `AL.03/F30`**.

Matrix reconciliada após W11:

`36 Composer / 16 legado / 38 fallback / 52 servidas / 12 divergências / 12 swaps / 44 estreias`.

Snapshot P21.1 permanece imutável; avanços posteriores vivem no ledger de migrações.

## Tarefa zero encerrada

`OBS-COMPOSITE-N4.03` não referencia mais o CI #1191 cancelado.

Evidência válida:

- SHA `0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`;
- CI #1195 / run `31655630072`;
- `success`.

## W11 — AL.03 / F30 — fechamento

### Reancoragem canônica

O draft da scratch branch foi corrigido pela fonte canônica:

- prereqs: `N1.09 + N2.01`;
- L1: 2 em 2, reta com arcos;
- L2: 10 em 10, reta;
- L3: 5 em 5, reta + `Quadrado100`;
- L4: sequência escrita sem manipulável, generalizando saltos 2..10;
- L5: início deslocado, mental; teste materializa `3 em 3 a partir de 6`;
- domínio: `3/3` em `2 sessões`, com pelo menos dois saltos diferentes.

### Implementação

- owner: `SkipCountStage`;
- reutiliza `InteractiveNumberLineSurface`; não criar segunda reta;
- compõe `Quadrado100` no L3;
- kind `skip-count-f30`;
- builder especializado `construirSkipCountF30Question`;
- `resolucao()` R0-A tipada e calculada do item;
- snapshots declarativos/idempotentes;
- misconceptions: `PERDE_O_SALTO`, `SALTO_DUPLO`, `SO_DEZENAS`, `NAO_PARTE_DE`;
- evidência: `contagem-saltos-passo-<n>`;
- `MasteryRule.evidenciasDistintas` exige dois saltos distintos;
- RT permanece observacional.

### Regression-first

Contrato inicial: `600020e79b303e18a9daf01478f7f400c5eb1f21`.

O vermelho foi localizado: testes antigos passaram; W11 falhou apenas porque AL.03 ainda não estava registrada na porta do Composer.

### Recibo da implementação registrada e INATIVA

SHA:
`5988403f91a66919463ea478492560c54a8a051d`

CI:
- #1219;
- run `31662349768`;
- **success 6/6**.

O mesmo SHA provou Gates, Sensei/F30, Chrome 320/390/900, transversal 390×8, higiene e binários.

### Promoção

SHA semântico de promoção:
`7052c93b909883a671e6555e413a6992d4c5e8db`

CI #1223 / run `31664033144` deixou o Gates vermelho somente para a Matrix observar a mudança real:

- 36 Composer;
- 16 legado;
- 38 fallback;
- 52 servidas;
- 12 divergências;
- 12 swaps;
- 44 estreias.

Não houve necessidade de reconciliação extra de observabilidade.

### Ledger

`W11-AL.03 = { composer:+1, legacy:-1, divergences:-1 }`.

Checkpoint detalhado:
`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W11_AL03_F30_FECHADA_2026-08-13.md`.

## Recibo final do fechamento

O recibo final de HEAD + CI da documentação/ledger deve ser confirmado diretamente no PR #35 após o CI do último SHA de fechamento. Não inferir o HEAD final deste arquivo se a branch tiver avançado: reancorar no remoto e usar o recibo registrado no corpo/comentário do PR.

## Próxima onda autorizada

**W12 — `N4.01 / F97`**.

Rascunho remoto:

- branch `codex/w11-w12-drafts`;
- `AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md`.

O draft é **não executável** e **não fonte de verdade**.

Antes de implementar W12:

1. reler F97 canônica integralmente;
2. conferir o nó N4.01 e prereqs no Curriculum Graph;
3. conferir a linha N4.01 na Coverage Matrix atual;
4. conferir gerador legado, Composer, renderer e primitivas existentes;
5. corrigir qualquer deriva do draft antes do regression-first;
6. repetir o protocolo permanente completo.

## Protocolo permanente

`regression-first → implementação registrada e INATIVA → gates + Chrome real no mesmo SHA → promoção → Matrix observa → reconciliação de observabilidade, se necessária → ledger → checkpoint → CI integralmente verde no HEAD exato`.
