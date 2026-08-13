# Estado do Fechamento Curricular — SAGA

**Linha aberta em:** 11/08/2026  
**Última atualização operacional:** 13/08/2026 — W11 fechada; W12 é a próxima onda  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer draft, open e unmerged  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

## Estado atual

Bloco 0 — **CONCLUÍDO**.  
Bloco 1 — **EM EXECUÇÃO**.

Ondas/contratos fechados nesta linha:

- W7 `N2.02/F36`;
- W8 `N3.01/F13`;
- W9 `N3.02/F15`;
- R0-A — contrato de resolução, sem delta curricular;
- W10 `N3.03/F14`;
- W11 `AL.03/F30`.

Matrix vigente reconciliada:

`36 Composer / 16 legado / 38 fallback / 52 servidas / 12 divergências / 12 swaps / 44 estreias`.

Próxima sequência causal autorizada: **W12 `N4.01/F97`**.

## W10 — N3.03 / F14 — FECHADA

- `CountingOnStage` é o owner especializado da estratégia.
- Composição: `LinkingCubes + NumberLine`.
- nasceu sob R0-A com resolução calculada do item;
- RT não compra mastery, unlock ou XP.

Ledger:

- `W10-N3.03`: `{ composer:+1, legacy:-1, divergences:-1 }`;
- `OBS-COMPOSITE-N4.03`: `{ divergences:-1 }`, observabilidade apenas.

A evidência de `OBS-COMPOSITE-N4.03` foi retificada para o fato realmente concluído:
SHA `0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`, CI #1195 / run `31655630072`.

## W11 — AL.03 / F30 — FECHADA

### Reancoragem canônica

O rascunho da scratch branch não foi copiado cegamente. A fonte canônica provou:

- pré-requisitos `N1.09 + N2.01`;
- L1: 2 em 2 com reta/arcos até 10;
- L2: 10 em 10 com reta até 100;
- L3: 5 em 5 com reta + `Quadrado100` até 50;
- L4: sequência escrita, sem manipulável, generalizando o tamanho do salto;
- L5: início deslocado, mental; o exemplo canônico `3 em 3 a partir de 6` é coberto por teste determinístico;
- domínio `3/3` em `2 sessões`, cobrindo pelo menos **dois saltos diferentes**.

### Arquitetura

- `SkipCountStage` é o owner especializado;
- reutiliza `InteractiveNumberLineSurface`; nenhuma segunda reta foi criada;
- compõe `Quadrado100` no L3;
- kind: `skip-count-f30`;
- resolução R0-A tipada desde o nascimento;
- misconceptions: `PERDE_O_SALTO`, `SALTO_DUPLO`, `SO_DEZENAS`, `NAO_PARTE_DE`;
- evidência por salto: `contagem-saltos-passo-<n>`;
- `MasteryRule.evidenciasDistintas` exige mínimo 2 valores do prefixo acima;
- `MasteryEvidence.evidenciasVistas` continua a fonte histórica; não foi criado estado paralelo;
- velocidade continua telemetria e não participa da coroa.

### Recibo inativo

SHA `5988403f91a66919463ea478492560c54a8a051d`  
CI #1219 / run `31662349768` — **success 6/6**.

No mesmo SHA ficaram verdes:

1. Gates;
2. Sensei real, incluindo F30;
3. 390px × 8 sementes;
4. 320/900px × 1 semente;
5. higiene;
6. binários.

### Promoção e Matrix observa

Promoção semântica: `7052c93b909883a671e6555e413a6992d4c5e8db`.

O Gates pós-promoção ficou vermelho apenas porque o baseline ainda era o anterior. A Matrix observou:

- Composer `36`;
- legado `16`;
- fallback `38`;
- servidas `52`;
- divergências `12`;
- swaps `12`;
- estreias `44`.

Não foi necessária reconciliação adicional de observabilidade: o mapa composto já enxerga `InteractiveNumberLine + Quadrado100` para `skip-count-f30`.

Ledger:

`W11-AL.03 = { composer:+1, legacy:-1, divergences:-1 }`.

Checkpoint detalhado:
`CHECKPOINT_FABRICA_CURRICULAR_W11_AL03_F30_FECHADA_2026-08-13.md`.

## Motor de Resolução

R0-A está concluída como contrato de dados e não conta como migração curricular.

Decisões de política de player continuam estacionadas em `PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`. W12 não pode congelá-las por oportunismo:

- “2º erro = dica / 3º = resolução”;
- teto de resoluções por sessão;
- modos do player;
- pausa acumulada de RT;
- inércia/foco;
- faixa do tutor e telemetria própria de ajuda.

## W12 — N4.01 / F97 — PRÓXIMA

Só abre após reancoragem nova do remoto.

Rascunho: branch `codex/w11-w12-drafts`, arquivo `AI_Studio_Lab/codex/drafts/W12_N4_01_F97_DRAFT.md`.

O rascunho é **não executável** e **não fonte de verdade**. Antes do regression-first, reconciliar F97 contra:

1. ficha canônica;
2. Curriculum Graph;
3. Coverage Matrix;
4. código/runtime atuais;
5. contrato R0-A quando aplicável.

## Invariantes

- não tocar `main`;
- PR #35 continua draft; nenhum merge/ready/auto-merge sem autorização explícita;
- Creature Engine fora desta fila;
- Thinking Engine runtime não autorizado;
- learner state soberano;
- RT/velocidade não compram mastery/XP;
- gates vermelhos são evidência;
- snapshots históricos imutáveis;
- nenhuma faxina P2 oportunista;
- verde de SHA anterior não vale por procuração.

## Porta de handoff

Para nova conversa, começar por:

`CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-13.md`.

Depois reancorar PR/HEAD/CI/reviews antes de qualquer edição.
