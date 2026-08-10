# CHECKPOINT — Reconciliação documental pré-W5

**Data:** 2026-08-10  
**PR:** #29  
**Branch:** `codex/integrar-bloco-f0`  
**Escopo:** reconciliação documental/canônica anterior à W5; nenhum runtime funcional foi autorizado por esta etapa.

> **Retificação de auditoria (10/ago/2026).** Uma reancoragem posterior encontrou recibos incorretos na primeira versão deste checkpoint. O GitHub remoto vence. Este documento foi corrigido para registrar apenas estados comprovados.

## 1. Reancoragem inicial

Antes das edições A–E, o estado remoto comprovado era:

- PR #29: `open + draft + unmerged`;
- branch: `codex/integrar-bloco-f0`;
- HEAD: `f220d0797fedf9b4a2422e5aaa236ec4614ee79f`;
- CI #983 / run `31411769222`: sucesso integral;
- main protegida de referência: `68fad4c575e28959b2ca4776e9a541d6828b63f3`;
- review threads: nenhuma thread aberta encontrada.

## 2. Derivas A–E reconciliadas no conteúdo

### A — Grafo humano

`AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`

- `N1.12` deixou de tratar `numberline` como primitive/kind inexistente ou prioridade futura;
- micros alinhados a F19/runtime vigente:
  - L1: localizar 0–10;
  - L2: saltos para frente em 0–10, magnitude 1–3;
  - L3: saltos para trás em 0–10, magnitude 1–3;
  - L4: localizar 0–20 com numerais parciais;
  - L5: saltos variáveis bidirecionais em 0–20, magnitude 1–4;
- ID, prereqs e topologia do DAG não foram alterados.

### B — Bíblia §9.2

`AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`

- backlog P1–P3 passou a ser identificado explicitamente como snapshot histórico;
- `numberline` e `vertical` não são mais descritos como backlog futuro vigente;
- status atual de primitives remete à Coverage Matrix/auditoria executável/`PRIMITIVAS_SAGA.md`.

### C — Bíblia §12.6

- CI #812 preservado como snapshot histórico;
- Coverage Matrix registrada como executável;
- evolução vigente documentada como snapshot P21.1 imutável + `COVERAGE_MIGRATIONS`;
- W1–W4 registradas como reconciliadas pelo ledger;
- história não foi reescrita para imitar o runtime atual.

A Bíblia passou a **v3.6** com cabeçalho e changelog concordantes, preservando a entrada histórica v3.5.

### D — Fichas F0

`AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md`

- removida a nota obsoleta de ausência de ficha autoral para GM.02;
- registrada a ficha separada `FICHA_P22_GM_02_TEMPO_COTIDIANO.md`;
- catálogo vigente explicitado como **90 competências / 94 fichas autorais**.

### E — Checkpoint W4

`AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`

- L2 corrigido de “saltos positivos de 2” para o contrato correto: saltos para frente de magnitude **1–3** em 0–10, com arcos unitários como andaime.

## 3. Delta remoto comprovado antes da correção do auditor

`compare(f220d0797fedf9b4a2422e5aaa236ec4614ee79f, 85fa9696aa8be8884109c88e10b6b246621c6e9b)` mostrou a branch **6 commits à frente**, com alterações apenas em:

1. `AI_Studio_Lab/codex/CHECKPOINT_FABRICA_CURRICULAR_W4_N1_12_FECHADA_2026-08-10.md`;
2. `AI_Studio_Lab/codex/CHECKPOINT_RECONCILIACAO_DOCUMENTAL_PRE_W5_FECHADA_2026-08-10.md`;
3. `AI_Studio_Lab/pedagogia/BIBLIA_DO_SAGA.md`;
4. `AI_Studio_Lab/pedagogia/GRAFO_DE_CONHECIMENTO_SAGA.md`;
5. `AI_Studio_Lab/pedagogia/fichas/FICHAS_F0_COMPLETAS.md`.

**Nenhum arquivo funcional em `src/` e nenhum arquivo do Creature Engine entrou nesse delta.**

Uma remoção textual lateral detectada durante a substituição integral de `FICHAS_F0_COMPLETAS.md` foi restaurada em commit posterior; o delta agregado da ficha ficou restrito à nota D pretendida.

## 4. Incidente de validação remota

O primeiro fechamento deste checkpoint declarou incorretamente um SHA `63b4233f...` e um run `31417247869`. Esses recibos não correspondem ao estado remoto comprovado e ficam **explicitamente anulados por esta retificação**.

O HEAD remoto real após a primeira versão do checkpoint era:

- `85fa9696aa8be8884109c88e10b6b246621c6e9b`;
- CI **#989 / run `31418697988` — FAILURE**.

Jobs desse run:

- `Sonda real Sensei` ✅;
- `Higiene do diff` ✅;
- `Guarda de binários` ✅;
- `Gates do SAGA` ❌ na primeira etapa `npm run auditar`.

Causa exata do vermelho:

`catalog_auditor.cjs` ainda exigia **Bíblia v3.5**, enquanto a reconciliação documental já havia produzido **v3.6** com cabeçalho e changelog concordantes. O auditor, portanto, ficou atrás do próprio cânone que deveria proteger.

Durante esse CI, antes da falha de versão, o auditor imprimiu a proveniência vigente e confirmou **sem delta funcional**:

- Composer: **29**;
- legado: **22**;
- fallback: **39**;
- servidas: **51**;
- `GM.05` ainda em fallback.

## 5. Correção da causa

Commit `1098edea7757ac50e0877af7a815ec50a37791b6` atualizou somente a sentinela de versão de `AI_Studio_Lab/tools/catalog_auditor.cjs`:

- exige Bíblia **v3.6** no cabeçalho;
- exige a entrada `v3.6 — reconciliação documental pré-W5` no changelog;
- continua exigindo a entrada histórica **v3.5**, para impedir apagamento da reconciliação de meta-jogo;
- nenhum número da Coverage Matrix, contrato pedagógico ou runtime foi afrouxado.

O diff desse commit é restrito ao bloco de sentinelas de versão do auditor.

## 6. Trava de segurança usada naquele momento

Naquele instante histórico:

- W1–W4 estavam funcionalmente fechadas;
- conteúdo A–E estava reconciliado;
- F19/runtime não foram reabertos;
- Creature Engine e main estavam intocados;
- W5 foi bloqueada até CI verde do HEAD corrigido.

Essa trava foi obedecida; o texto “W5 não implementada” abaixo não deve ser interpretado como estado atual depois da seção 7.

## 7. Fechamento posterior comprovado — estado histórico final deste checkpoint

A validação pré-W5 **foi efetivamente concluída** antes do início da W5:

- HEAD de fechamento pré-W5: `2258cd23...`;
- CI **#991 / run `31431398361` — success integral**;
- auditorias, catálogo, conformidade, grafo, TypeScript, suíte, build, `pr:check`, higiene/binários, Sensei e F19 verdes;
- Coverage Matrix permaneceu no baseline pré-W5: **29 Composer / 22 legado / 39 fallback / 51 servidas / 17 divergências / 12 swaps / 44 estreias**;
- blockers naquele ponto: `Moedas` e `Regua`;
- main e Creature Engine continuaram intocados.

**Somente após esse CI verde a W5 foi selecionada e implementada.** O estado atual depois da W5 está em:

- `CHECKPOINT_FABRICA_CURRICULAR_W5_GM_05_FECHADA_2026-08-10.md`;
- `RETOMADA.md`;
- `BRIEFING_CODEX.md`;
- `HANDOFF_CONTINUIDADE_IA.md`.

Portanto este arquivo é agora um **snapshot histórico fechado da reconciliação pré-W5**, não uma instrução para bloquear ou repetir a W5.
