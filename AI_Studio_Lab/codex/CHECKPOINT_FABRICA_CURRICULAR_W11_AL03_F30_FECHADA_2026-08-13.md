# Checkpoint — Fábrica Curricular W11 `AL.03 / F30` fechada

Data: 2026-08-13 (America/Sao_Paulo)

## Invariantes

- Repositório: `dyegorodrigues/SAGA`
- Branch de trabalho: `codex/fechamento-curricular`
- PR: `#35`
- PR deve permanecer `open + draft + unmerged`.
- `main` não foi tocada.
- Creature Engine não foi tocado.
- Thinking Engine runtime continua não autorizado.
- W7–W10 não foram reabertas.

## Tarefa zero desta retomada

A linha `OBS-COMPOSITE-N4.03` do ledger apontava para o CI #1191, que havia sido cancelado. A evidência foi corrigida sem reabrir onda alguma para o fato efetivamente comprovado:

- SHA `0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`;
- CI #1195 / run `31655630072`;
- `success`.

## Reancoragem canônica da W11

O draft `W11_AL03_F30_DRAFT.md` foi tratado apenas como rascunho. A implementação foi reancorada contra a F30 canônica, Curriculum Graph, Coverage Matrix e runtime real.

Correções provadas pela fonte canônica:

- pré-requisitos de `AL.03`: `N1.09 + N2.01`;
- L1: 2 em 2 na reta, com arcos, até 10;
- L2: 10 em 10 na reta, até 100;
- L3: 5 em 5 com reta + `Quadrado100`, até 50;
- L4: sequência escrita sem manipulável e **generalização do tamanho do salto**, não apenas 2/5/10;
- L5: início deslocado, mental; o exemplo canônico “3 em 3 a partir de 6” foi materializado em teste determinístico;
- domínio: `3/3` em `2 sessões`, cobrindo pelo menos **dois saltos diferentes**.

## Regression-first

Commit de contrato inicial:

- `600020e79b303e18a9daf01478f7f400c5eb1f21`

O vermelho foi deliberado e localizado: 188 arquivos de teste / 2667 testes antigos passaram; apenas as asserções W11 falharam porque `AL.03` ainda não estava registrada na porta única do Composer.

Isso provou a ordem causal “teste primeiro → implementação”.

## Implementação registrada e INATIVA

A W11 materializou:

- `src/curriculum/fichas/jornada/AL.03.ts`;
- `skipCountContract.ts`;
- `skipCountProcedure.ts`;
- `skipCountSemantics.ts`;
- `SkipCountStage.tsx`;
- specialized builder `construirSkipCountF30Question`;
- kind autoral `skip-count-f30`;
- renderer/política de resposta próprios;
- mapa executável de palco composto;
- sonda Chrome dedicada F30.

A reta **não foi duplicada**: `SkipCountStage` reutiliza `InteractiveNumberLineSurface`. O L3 compõe a mesma linguagem com `Quadrado100`.

### R0-A desde o nascimento

F30 nasceu com `resolucao()` tipada e calculada do próprio item:

- snapshots declarativos/idempotentes;
- passo de fixação do tamanho do salto;
- passo final que produz o próximo termo e termina exatamente no gabarito;
- misconceptions canônicas: `PERDE_O_SALTO`, `SALTO_DUPLO`, `SO_DEZENAS`, `NAO_PARTE_DE`.

### Evidência de processo e domínio

Cada acerto registra `contagem-saltos-passo-<n>`. A regra genérica de mastery ganhou uma condição opcional `evidenciasDistintas`, baseada em `MasteryEvidence.evidenciasVistas`.

Para F30:

- prefixo: `contagem-saltos-passo-`;
- mínimo: `2` valores distintos;
- RT não entra na cardinalidade;
- `fluencyStreak` continua telemetria e não coroa.

O regression test prova os dois lados:

1. seis acertos ultrarrápidos, em duas datas, todos no mesmo salto → **não** amadurecem domínio;
2. respostas lentas, acima do RT alvo, mas com diversidade real de saltos e duas sessões espaçadas → **coroam**.

## Recibo do canário INATIVO

SHA exato:

`5988403f91a66919463ea478492560c54a8a051d`

CI:

- CI #1219;
- run `31662349768`;
- `success 6/6`.

Jobs verdes no mesmo SHA:

1. Gates do SAGA;
2. Sonda real Sensei, incluindo F19/F61/F29/F36/F13/F15/F14/**F30**;
3. Sonda transversal 390px × 8 sementes;
4. Sonda transversal 320/900px × 1 semente;
5. Higiene do diff;
6. Guarda de binários.

A sonda F30 cobre 320/390/900, L1–L5, tutorial, erro/acerto, misconceptions, evidências, resolução, ausência de opções genéricas duplicadas e overflow.

## Promoção e Matrix observa

Promoção semântica:

`7052c93b909883a671e6555e413a6992d4c5e8db`

No CI #1223 / run `31664033144`, o Gates ficou vermelho **somente** porque a Matrix ainda carregava o baseline anterior. O observador reportou:

- Composer: `36` observado vs `35` ledger;
- legado: `16` observado vs `17` ledger;
- divergências: `12` observadas vs `13` ledger;
- fallback: `38`;
- servidas: `52`;
- swaps: `12`;
- estreias: `44`.

Não houve necessidade de reconciliação adicional de observabilidade: o mapa composto já enxergou `InteractiveNumberLine + Quadrado100` para `skip-count-f30` corretamente.

## Ledger

Migração registrada:

- `W11-AL.03`
- delta: `{ composer: +1, legacy: -1, divergences: -1 }`

Estado reconciliado:

- `36 Composer`
- `16 legado`
- `38 fallback`
- `52 servidas`
- `12 divergências`
- `12 swaps`
- `44 estreias`

## Próxima onda

Próxima onda autorizada após o recibo integral do HEAD de fechamento:

- **W12 — `N4.01 / F97`**.

O arquivo `AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md` continua **não executável** e **não fonte de verdade**. Reancorar novamente contra ficha canônica, Curriculum Graph, Coverage Matrix e código antes de qualquer implementação.

## Regra de retomada

Antes da W12:

1. reancorar no GitHub remoto;
2. confirmar PR #35 `open + draft + unmerged`;
3. confirmar branch/HEAD;
4. confirmar CI integral do HEAD exato deste fechamento;
5. conferir reviews e review threads;
6. remoto vence qualquer checkpoint se houver deriva.
