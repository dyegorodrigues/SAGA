# Estado do Fechamento Curricular — SAGA

**Linha aberta em:** 11/08/2026  
**Última atualização operacional:** 12/08/2026 — W10 fechada; W11 é a próxima onda  
**Branch:** `codex/fechamento-curricular`  
**PR:** #35 — deve permanecer draft, open e unmerged  
**Fonte de verdade:** GitHub remoto + gates executáveis do mesmo SHA.

## Estado atual

Bloco 0 — **CONCLUÍDO**.  
Bloco 1 — **EM EXECUÇÃO**.

Ondas fechadas nesta linha:

- W7 `N2.02/F36`;
- W8 `N3.01/F13`;
- W9 `N3.02/F15`;
- R0-A — contrato de resolução, sem delta de Matrix;
- W10 `N3.03/F14`.

Recibo de produto W10: `0b4a5b0dbe26a2c321d7bbb23124cb81681fdcd5`,
CI #1195 / run `31655630072`, seis jobs verdes no mesmo SHA.

Matrix vigente:

`35 Composer / 17 legado / 38 fallback / 52 servidas / 13 divergências / 12 swaps / 44 estreias`.

Próxima sequência causal: **W11 `AL.03/F30` → W12 `N4.01/F97`**.

## W10 — N3.03 / F14 — FECHADA

- `CountingOnStage` é o owner especializado da estratégia.
- Composição física/canônica: `LinkingCubes + NumberLine`.
- `N3.03` foi promovida ao Composer apenas depois do portão inativo verde.
- A família nasceu sob R0-A com `Question.resolucao` tipada e snapshots declarativos.
- Processo, misconception e evidência permanecem separados da resposta final.
- RT não compra mastery, unlock ou XP.

O ledger separa:

- `W10-N3.03`: `{ composer:+1, legacy:-1, divergences:-1 }`;
- `OBS-COMPOSITE-N4.03`: `{ divergences:-1 }`, observabilidade apenas.

Snapshot P21.1 segue imutável.

Checkpoint detalhado:
`CHECKPOINT_FABRICA_CURRICULAR_W10_N3_03_FECHADA_2026-08-12.md`.

## Auditoria de palcos compostos — fechada como pré-condição da W11

`ficha_runtime_map.cjs` voltou a declarar a regra:

> arrays vazios continuam sendo lacunas reais, nunca inferências silenciosas.

A convenção de composição foi formalizada e mecanizada por
`AI_Studio_Lab/tools/composite_stage_auditor.cjs`.

Composições cobertas: CountingOn, MaterialDourado, Medidas, StoryBars, Vertical
e Tabuada. `Arranjo` continua realização física de `ArrayGrid`, não uma primitiva
canônica inventada.

Documento:
`AUDITORIA_PALCOS_COMPOSTOS_2026-08-12.md`.

## Motor de Resolução

R0-A está concluída como contrato de dados e não conta como migração curricular.

Decisões de política de player continuam deliberadamente estacionadas em
`PENDENCIAS_PLAYER_MOTOR_RESOLUCAO.md`. W11/W12 não podem congelar por oportunismo:

- “2º erro = dica / 3º = resolução”;
- teto de resoluções por sessão;
- modos do player;
- pausa acumulada de RT;
- inércia/foco;
- faixa do tutor e telemetria própria de ajuda.

## W11 — AL.03 / F30 — PRÓXIMA

W11 ainda não deve ser considerada aberta apenas porque existe um rascunho.

Rascunho remoto: branch `codex/w11-w12-drafts`,
`AI_Studio_Lab/codex/drafts/W11_AL03_F30_DRAFT.md`.

Contrato reancorado do rascunho:

- L1: 2 em 2 com reta;
- L2: 10 em 10 com reta;
- L3: 5 em 5 com Quadrado100;
- L4: 2/5/10 em sequência escrita, sem manipulável;
- L5: 2/5/10 com início deslocado, mental;
- `InteractiveNumberLineSurface` deve ser reutilizada; não criar segunda reta;
- resolução tipada R0-A desde o nascimento;
- mastery exige evidência nos passos 2, 5 e 10 e início deslocado; RT não participa.

Primeiro movimento: regression-first provando a proveniência legada/ausência
deliberada do registro Composer de AL.03. Depois implementar registrada/inativa,
provar no browser, promover, observar Matrix, registrar ledger e fechar no SHA exato.

## W12 — N4.01 / F97

Só abre depois de W11 formalmente fechada. Rascunho remoto na mesma scratch branch,
também não executável.

## Invariantes

- não tocar `main`;
- PR #35 continua draft; nenhum merge sem autorização explícita;
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

`CHECKPOINT_FINAL_NOVA_CONVERSA_2026-08-12.md`.

Depois reancorar PR/HEAD/CI antes de qualquer edição.
