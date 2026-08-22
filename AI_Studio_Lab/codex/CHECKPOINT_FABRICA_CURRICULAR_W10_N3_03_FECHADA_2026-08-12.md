# Checkpoint — W10 N3.03 / F14 — FECHADA

**Data:** 12/08/2026 (America/Sao_Paulo)  
**Repo:** `dyegorodrigues/SAGA`  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer `open + draft + unmerged`  
**Regra:** GitHub remoto + gates executáveis do mesmo SHA vencem memória e texto histórico.

## Recibo de produto da W10

W10 `N3.03 / F14` está fechada no produto somente porque o HEAD de produto
`0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5` completou o CI #1195 / run
`31655630072` com todos os seis jobs verdes.

A cadeia incluiu:

- Gates do SAGA: catálogo, fichas, conformidade, grafo, TypeScript, suíte, build e guarda textual;
- Higiene do diff;
- Guarda de binários;
- Sonda real Sensei, com F19, F61, F29, F36, F13, F15 e F14;
- Sonda transversal `320/900px × 1 semente`;
- Sonda transversal `390px × 8 sementes`.

Verde de SHA anterior não fecha esta onda por procuração.

## O que a W10 entregou

- `N3.03` migrou do legado para o Composer.
- `CountingOnStage` é o owner autoral da estratégia de contar a partir do maior.
- O palco compõe `LinkingCubes + NumberLine`; a composição é observada pela Matrix.
- A família nasce sob R0-A com `Question.resolucao` tipada e snapshots declarativos.
- Misconceptions e evidências preservam processo; resposta final isolada não apaga estratégia.
- RT/velocidade continua fora de mastery, unlock e XP.
- Políticas de escalada de ajuda/player permanecem estacionadas em
  `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`; não foram congeladas dentro da W10.

## Coverage Matrix e ledger

Baseline vigente observada após W10 e a auditoria de palcos compostos:

`35 Composer / 17 legado / 38 fallback / 52 servidas / 13 divergências / 12 swaps / 44 estreias`.

O snapshot histórico P21.1 continua imutável. O ledger registra dois fatos distintos:

1. `W10-N3.03`: `{ composer:+1, legacy:-1, divergences:-1 }` — mudança curricular real.
2. `OBS-COMPOSITE-N4.03`: `{ divergences:-1 }` — correção de observabilidade; nenhum runtime pedagógico de N4.03 foi alterado.

## Auditoria de palcos compostos

A regra removida de `ficha_runtime_map.cjs` foi restaurada:

> arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas.

Também ficou formalizada a convenção de composição: um mesmo `rendererKind` pode
aparecer nas linhas das várias primitivas canônicas que o Stage realmente entrega,
e o observador deve unir essas entradas. Helpers físicos não viram primitivas
canônicas por conveniência.

O gate `AI_Studio_Lab/tools/composite_stage_auditor.cjs` prova as composições de
CountingOn, MaterialDourado, Medidas, StoryBars, Vertical e Tabuada. A auditoria
completa está em `AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`.

## F36 — reforço de diagnóstico

O CI #1194 registrou 404s anônimos na sonda F36. Não foram classificados como
flake sem prova. A sonda passou a registrar localização de `console.error` e toda
resposta HTTP `>=400` com URL/status. No recibo #1195 a F36 passou sob esse
diagnóstico fortalecido.

## Próxima onda

A próxima onda autorizada é W11 `AL.03 / F30`, mas ela não deve ser iniciada a
partir deste checkpoint sem reancorar o HEAD atual do PR #35 e confirmar que o
commit documental de handoff também tem CI verde no próprio SHA.

O rascunho remoto existe em `codex/w11-w12-drafts`, fora do PR #35, e é
deliberadamente não executável. Ele deve ser lido como preparação, nunca
mesclado cegamente.
